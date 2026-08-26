import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDER, ONRAMP, type MessageFromApi } from "../types/fromApi";
import { DEPTH_RESPONSE, ON_RAMP_RESPONSE, OPEN_ORDER_RESPONSE, ORDER_CANCELLED, ORDER_PLACED } from "../types/toApi";
import { OrderBook, type Fill, type Order } from "./OrderBook";

interface AssetBalance{
    available: number,
    lockedOut: number,
}


interface UserBalance {
    [asset: string]: AssetBalance;
}

export const BASE_CURRENCY = "INR";
/*Responsibilities of the Engine

1. Recieving message from the API through a REDIS Queue.
2. Sending message through Redis PubSub to the API.
3. Sending updates to the WS server
4. Sending Data to the DB processor via REDIS Queue.


1. Messages from the API to the Engine.

a. Place an order: i/p: market,qty,side,userId.
b. Get the Depth of the market: i/p: market
c. Cancel an order: i/p: orderId,market,
d. Get Open Orders: means all the open orders for the particular user, i/p: userId
e. OnRamp: means add an amount to the userBalance, i/p: userId,amt.


2. Sending Message to the API:

a. Order is placed: o/p: executedQty,fills(which orders were used to fill the execQty),orderId.
b. Order is cancelled: same o/p.
c. GetDepth: we can delegate this to the OrderBook and give its output.
d. GetOpenOrders: we can delegate this to the Orderbook and give its output.
e. OnRamp: return the final amt in the user's balance.
*/



export class Engine{

private orderBooks: OrderBook[] = [];

private userBalance = new Map<string,UserBalance>();


    constructor(){
       this.orderBooks.push(
        new OrderBook("TATA", "INR", 0)
    );
    }

public process({message,clientId}: {message: MessageFromApi,clientId: string}){
   //If type is Create Order
   /*
     1. Find the orderbook
     2. Check and Lock the funds required for this order
     3. Create an internal order
     4. Update Balances
     5. Return Result
   */
  switch (message.type){
      
    case CREATE_ORDER:
        
    const {executedQty,fills,orderId} = this.createOrder(message.data.market,message.data.price,message.data.quantity,message.data.side,message.data.userId);
    //Now send to API via Redis
    try{
        RedisManager.getInstance().sendToApi(clientId,{
        type: ORDER_PLACED,
        payload: {
            executedQty,
            fills,
            orderId
        }
     });
    }catch(e){
      console.log(e);

      RedisManager.getInstance().sendToApi(clientId,{
        type: ORDER_PLACED,
        payload: {
            executedQty: 0,
            fills: [],
            orderId,
        }
      })
    }
     break;
    
    case CANCEL_ORDER:
        const cancelledOrderId = this.cancelOrder(message.data.market,message.data.orderId);
        //sending to the Redis PUB SUB

        RedisManager.getInstance().sendToApi(clientId,{
            type: ORDER_CANCELLED,
            payload: {
               orderId: cancelledOrderId,
            }
        });
        break;
        
     case GET_OPEN_ORDER:
      
     const openOrderBook = this.orderBooks.find(o => o.ticker() === message.data.market)
      
     if(!openOrderBook){
        throw new Error("No orderbook found");
     }
     
     const openOrders = openOrderBook.getOpenorders(message.data.userId);
     //sending to Redis

     RedisManager.getInstance().sendToApi(clientId,{
        type: OPEN_ORDER_RESPONSE,
        payload: openOrders,
     })
     break;

     case GET_DEPTH:
       
       const orderBook = this.orderBooks.find(o => o.ticker() === message.data.market);
       
       if(!orderBook){
        throw new Error("No OrderBook found");
       }

       const depth = orderBook.getDepth();
       
       //sending to Redis

       RedisManager.getInstance().sendToApi(clientId,{
        type: DEPTH_RESPONSE,
        payload: depth,
       })
       break;

     case ONRAMP:
       const balanceAmount = this.onRamp(message.data.userId,message.data.amount);
       
       //sending to Redis

       RedisManager.getInstance().sendToApi(clientId,{
        type: ON_RAMP_RESPONSE,
        payload: {
            amount: balanceAmount.toString(),
        }
       })
       break;
  }
     
}

//TODO: Why this function????
addOrderBook(orderBook: OrderBook){
    this.orderBooks.push(orderBook);
}

private cancelOrder(market: string,orderId: string){
   const cancelOrderBook = this.orderBooks.find(o => o.ticker() === market);

   if(!cancelOrderBook){
    throw new Error("OrderBook does not exists");
   }
   const baseAsset = market.split("_")[0]!;

   const order = cancelOrderBook.asks.find(ask => ask.orderId === orderId) || cancelOrderBook.bids.find(bid => bid.orderId === orderId);

   if(!order){
    throw new Error("No such order exists");
   }
   const side = order.side;
    
   const cancelUserBalance = this.userBalance.get(order.userId);

   if(!cancelUserBalance){
     throw new Error("User balance does not exist");
   }

   if(side === "buy"){

     cancelOrderBook.cancelBid(orderId);

     const cancelUserQuoteBalance = cancelUserBalance[BASE_CURRENCY];
    
        if(!cancelUserQuoteBalance){
           throw new Error("User has not Quote Asset balance");
        }

      const remainingLockedAmount = (order.quantity - order.filled) * order.price;

      cancelUserQuoteBalance.available += remainingLockedAmount;
      cancelUserQuoteBalance.lockedOut -= remainingLockedAmount;
      
   }else{
     //side is sell

     cancelOrderBook.cancelAsk(orderId);

     //seller had the baseAsset balance------TATA

    const cancelUserBaseBalance = cancelUserBalance[baseAsset];

     if(!cancelUserBaseBalance){
        throw new Error("User has not baseAsset balance");
     }
      
     const remainingLockedAmount = (order.quantity - order.filled);

     cancelUserBaseBalance.available += remainingLockedAmount;
     cancelUserBaseBalance.lockedOut -= remainingLockedAmount;
   
   }
    return order.orderId;
}




private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string){
    //1. Find the orderbook
        const orderbook = this.orderBooks.find(o => o.ticker() === market);

        if(!orderbook){
            throw new Error("No such orderbook found");
        }
        //2. Check and Lock the funds required for this order
        //TODO: Create methods in orderbook to find these
        const baseAsset = market.split("_")[0]!;
        const quoteAsset = market.split("_")[1]!;

        this.checkAndLockFunds(baseAsset,quoteAsset,price,quantity,side,userId);
        
        const orderId = Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);

        const order: Order = {
          orderId,
          price: Number(price),
          quantity: Number(quantity),
          side,
          userId,
          filled: 0 
        }

        const { executedQty,fills } = orderbook.addOrder(order);
        //update the balances
       this.updateBalance(userId,baseAsset,quoteAsset,side,executedQty,fills);
        return {
            executedQty,
            fills,
            orderId: order.orderId
        }

}

private updateBalance(userId:string,baseAsset: string,quoteAsset: string,side: "buy" | "sell",executedQty: number,fills: Fill[]){
   
    if(side === "buy"){
    fills.forEach(fill => {
        //taker
        const takerBalance = this.userBalance.get(userId);
        if(!takerBalance)return;
        //seller
        const makerBalance = this.userBalance.get(fill.otherUserId);
        if(!makerBalance)return;

        //----------------------------Quote Asset----------------------INR
        //QuoteAsset is the INR

        const takerQuoteBalance = takerBalance[quoteAsset];
        if(!takerQuoteBalance)return;
         
        let makerQuoteBalance = makerBalance[quoteAsset];

        if(!makerQuoteBalance){
            makerBalance[quoteAsset] = {
                available: 0,
                lockedOut: 0,
            }

            makerQuoteBalance = makerBalance[quoteAsset];
        }



        //---------------------------Base Asset------------------------TATA

        
        const makerBaseBalance = makerBalance[baseAsset];
        if(!makerBaseBalance)return;
        //taker do not have any base asset
        let takerBaseBalance = takerBalance[baseAsset];

        if(!takerBaseBalance){
            takerBalance[baseAsset] = {
                available: 0,
                lockedOut: 0,
            }
            takerBaseBalance = takerBalance[baseAsset];
        }
//Updating the quoteAsset balance
        //credit the quote balance of the maker
        makerQuoteBalance.available = makerQuoteBalance.available + (fill.price) * (fill.quantity); 
        //remove the locked balance of the taker
        takerQuoteBalance.lockedOut = takerQuoteBalance.lockedOut - (fill.quantity * fill.price);
//Updating the baseAsset balance
        
        //credit the base balance of the taker
        takerBaseBalance.available += (fill.quantity);
        //remove the locked balance of the maker
        makerBaseBalance.lockedOut -= (fill.quantity);
    })
   }else{
    //selling side
    //existing maker == buyer
    //taker == seller
    //debit from seller 
    //credit to buyer

   fills.forEach(fill => {


        //taker
        const takerBalance = this.userBalance.get(userId);
        if(!takerBalance)return;
        //seller
        const makerBalance = this.userBalance.get(fill.otherUserId);
        if(!makerBalance)return;

        //-------------------Quote Asset(INR)-------------------------
        //QuoteAsset is the INR

        
        const makerQuoteBalance = makerBalance[quoteAsset];
        
        if(!makerQuoteBalance)return;
        //taker maynot have the quote balance
        //maker must have quote balance
        let takerQuoteBalance = takerBalance[quoteAsset];

        if(!takerQuoteBalance){
            takerBalance[quoteAsset] = {
                available: 0,
                lockedOut: 0,
            }
            takerQuoteBalance = takerBalance[quoteAsset];
        }

       //--------------------------Base Asset(TATA)-------------------
       //taker must have base asset
       //maker may or may not have the base asset

        const takerBaseBalance = takerBalance[baseAsset];
        
        if(!takerBaseBalance)return;

        let makerBaseBalance = makerBalance[baseAsset];
        
        if(!makerBaseBalance){
            makerBalance[baseAsset] = {
                available: 0,
                lockedOut: 0,
            }
            makerBaseBalance = makerBalance[baseAsset];
        }

        //Updating the quote Asset(INR) balance
         //taker gets money
         takerQuoteBalance.available += (fill.price * fill.quantity);
         //buyer debited money
         makerQuoteBalance.lockedOut -= (fill.price * fill.quantity);
        //Updating the base Asset(TATA) balance
          //maker gets shares
          makerBaseBalance.available += (fill.quantity);
          //taker debited shares
          takerBaseBalance.lockedOut -= (fill.quantity);
   });
   }
}


private checkAndLockFunds(baseAsset:string,quoteAsset: string,price: string, quantity: string,side: "buy" | "sell",userId: string){
    const userBalanceFund = this.userBalance.get(userId);
            if(!userBalanceFund){
                throw new Error("User balance does not exists");
            }
            const quoteAssetBalance = userBalanceFund[quoteAsset];
             const baseAssetBalance = userBalanceFund[baseAsset];
           
    if(side === "buy"){  
        if(!quoteAssetBalance){
                throw new Error(`User has no ${quoteAsset}`);
            }
        //user should have enough available >= qty*price
        if((quoteAssetBalance.available) < (Number(price) * Number(quantity))){
            throw new Error("Insufficient Funds");
        }
         //if yes
        //userBalance.available -= (qty*price)
        //userBalance.locked += (qty*price)
         quoteAssetBalance.available -= (Number(price) * Number(quantity));
         quoteAssetBalance.lockedOut += (Number(price) * Number(quantity));
        
    }else{
        
            if(!baseAssetBalance){
               throw new Error(`User has no ${baseAsset}`);
            }
        //user should have enough baseAsset available >= qty
        if((baseAssetBalance?.available) >= Number(quantity)){
            //if yes
        //userBalance.available -= (qty)
        //userBalance.locked += (qty)
            baseAssetBalance.available -= (Number(quantity));
            baseAssetBalance.lockedOut += (Number(quantity));

        }else{
            throw new Error("User has insufficient shares");
        }
    }
}

private onRamp(userId: string,amount: number,){
   //find the user
   //if not present create it in the map and store the amt

   const user = this.userBalance.get(userId);
   if(!user){
    this.userBalance.set(userId,{
        [BASE_CURRENCY]: {
            available: amount,
            lockedOut: 0,
        }
    });
     return amount;
   }else{
    const balance = user[BASE_CURRENCY];
    if(!balance){
        user[BASE_CURRENCY] = {
            available: amount,
            lockedOut: 0,
        }
        return amount; 
    }

    balance.available += amount;
    return balance.available;
   }
}
}