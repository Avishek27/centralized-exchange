import { prisma } from "@repo/db";
import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDER, ONRAMP, type MessageFromApi } from "../types/fromApi";
import { DEPTH_RESPONSE, ON_RAMP_RESPONSE, OPEN_ORDER_RESPONSE, ORDER_CANCELLED, ORDER_PLACED } from "../types/toApi";
import { BALANCE_UPDATE, ORDER_UPDATE, TRADE_ADDED } from "../types/toDB";
import { OrderBook, type Fill, type Order } from "./OrderBook";

interface AssetBalance{
    available: number,
    lockedOut: number,
}


interface UserBalance {
    [asset: string]: AssetBalance;
}



export const BASE_CURRENCY = "INR";

export class Engine{

private orderBooks: OrderBook[] = [];


private balances: {
    [userId: string]: UserBalance;
} = {};

    constructor(){
       this.orderBooks.push(
        new OrderBook("TATA", "INR")
    );
    }

    public async init(){
        await this.loadBalances();
        console.log("Engine initialized with balances");
    }

public process({message,clientId}: {message: MessageFromApi,clientId: string}){
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
       const balance = this.onRamp(message.data.userId,message.data.asset,message.data.amount);
       
       RedisManager.getInstance().sendToApi(clientId,{
        type: ON_RAMP_RESPONSE,
        payload: {
                asset: balance.asset,
                available: balance.available.toString(),
                locked: balance.locked.toString(),
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
   const [baseAsset,quoteAsset] = market.split("_");

   if(!baseAsset || !quoteAsset){
    throw new Error("Invalid Market");
   }

   const order = cancelOrderBook.asks.find(ask => ask.orderId === orderId) || cancelOrderBook.bids.find(bid => bid.orderId === orderId);

   if(!order){
    throw new Error("No such order exists");
   }
   const side = order.side;
    
   if(side === "buy"){

     cancelOrderBook.cancelBid(orderId);

    const cancelUserQuoteBalance = this.getAssetBalance(order.userId,quoteAsset);

    const remainingLockedAmount = (order.quantity - order.filled) * order.price;

      cancelUserQuoteBalance.available += remainingLockedAmount;
      cancelUserQuoteBalance.lockedOut -= remainingLockedAmount;

      this.publishBalanceUpdate(
        order.userId,
        quoteAsset
    );
      
      
   }else{

     cancelOrderBook.cancelAsk(orderId);

    const cancelUserBaseBalance = this.getAssetBalance(order.userId,baseAsset);
      
     const remainingLockedAmount = (order.quantity - order.filled);

     cancelUserBaseBalance.available += remainingLockedAmount;
     cancelUserBaseBalance.lockedOut -= remainingLockedAmount;

     this.publishBalanceUpdate(
        order.userId,
        quoteAsset
    );
   
   }
   this.sendUpdatedDepthAt(order.price.toString(),market);
    return order.orderId;
}

private sendUpdatedDepthAt(price: string,market: string){
    const orderbook = this.orderBooks.find(o => o.ticker() === market);
    if(!orderbook)return;
    const depth = orderbook.getDepth();

    const updatedBid = depth.bids.filter(x => x[0] === price);
    const updatedAsk = depth.asks.filter(x => x[0] === price);

    RedisManager.getInstance().publishMessage(`depth@${market}`,{
        stream: `depth@${market}`,
        data: {
            bids: updatedBid.length ? updatedBid : [[price,'0']],
            asks: updatedAsk.length ? updatedAsk : [[price, '0']],
            e: 'depth',
        }
    });
}


private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string){
        const orderbook = this.orderBooks.find(o => o.ticker() === market);

        if(!orderbook){
            throw new Error("No such orderbook found");
        }
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

        this.updateBalance(userId,baseAsset,quoteAsset,side,executedQty,fills);
        this.createDbTrades(fills,side,market);
        this.updateDbUpdates(fills,order,executedQty,market);
        console.log("DEPTH UPDATE BEING PUBLISHED:");
        this.publishWsDepthUpdates(fills,price,side,market);
        this.publishTradeMessage(fills,userId,market);
        
         return {
            executedQty,
            fills,
            orderId: order.orderId
        }
}

private publishWsDepthUpdates(fills: Fill[],price: string,side: 'buy' | 'sell',market: string){
    const orderbook = this.orderBooks.find(o => o.ticker() === market);
    
    if(!orderbook)return;

    const depth = orderbook.getDepth();

    if(side === "buy"){
        //Show me only the SELL price levels that were involved in the trade.
        /**
         * REF
         */
        const fillPrices = [
            ...new Set(fills.map(fill => fill.price.toString()))
        ];

        const updatedAsks: [string, string][] = fillPrices.map(fillPrice => {
            const existingAsk = depth.asks.find(
                ([askPrice]) => askPrice === fillPrice
            );

            if (existingAsk) {
                return existingAsk;
            }

            return [fillPrice, "0"];
        });

        //Check whether the BUY order itself is still sitting in the bid book at its own price.
        const updatedBid = depth.bids.find(x => x[0] === price);
        console.log("Publish the ws depth trades");
        console.log("WS DEPTH PAYLOAD:", {
            asks: updatedAsks,
            bids: updatedBid ? [updatedBid] : [],
            e: "depth"
        });
        RedisManager.getInstance().publishMessage(`depth@${market}`,{
            stream: `depth@${market}`,
            data: {
                asks: updatedAsks,
                bids: updatedBid ? [updatedBid] : [],
                e: 'depth',
            }
        });
    }
    if(side === "sell"){
        /**
         * REF
         */
        const fillPrices = [
            ...new Set(fills.map(fill => fill.price.toString()))
        ];

        const updatedBids: [string, string][] = fillPrices.map(fillPrice => {

            const existingBid = depth.bids.find(
                ([bidPrice]) => bidPrice === fillPrice
            );

            if (existingBid) {
                return existingBid;
            }

            return [fillPrice, "0"];
        });

        const updatedAsk = depth.asks.find(
            x => x[0] === price
        );

        console.log("Publish the ws depth trades");

        console.log("WS DEPTH PAYLOAD:", {
            asks: updatedAsk ? [updatedAsk] : [],
            bids: updatedBids,
            e: "depth",
        });
        RedisManager.getInstance().publishMessage(`depth@${market}`,{
            stream: `depth@${market}`,
            data: {
                asks: updatedAsk ? [updatedAsk] : [],
                bids: updatedBids,
                e: 'depth',
            }
        });
    }
}

private publishTradeMessage(fills: Fill[],userId: string,market: string){
   fills.forEach(fill => {
    
    const payload = {
      stream: `trade@${market}`,
      data: {
        e: "trade" as const,
        tradeId: fill.tradeId.toString(),
        isBuyerMaker: fill.otherUserId === userId,
        price: fill.price.toString(),
        executedQuantity: fill.quantity,
        market,
      }
    };

    console.log("TRADE WS PAYLOAD:", payload);

    RedisManager.getInstance().publishMessage(
      `trade@${market}`,
      payload
    );
   })
}

private updateDbUpdates(fills: Fill[],order: Order,executedQty: number,market: string){
    fills.forEach(fill => RedisManager.getInstance().pushMessage({
        type: ORDER_UPDATE,
        data: {
            orderId: fill.makerOrderId,
            executedQty: fill.quantity,
        }
    }));
    
    RedisManager.getInstance().pushMessage({
        type: ORDER_UPDATE,
        data: {
            orderId: order.orderId,
            executedQty: executedQty,
            market,
            price: order.price.toString(),
            quantity: order.quantity.toString(),
            side: order.side,
        }
    })
}


private createDbTrades(fills: Fill[],side: 'buy' | 'sell',market: string){
     fills.forEach(fill => {
        RedisManager.getInstance().pushMessage({
            type: TRADE_ADDED,
            data: {
                tradeId: fill.tradeId.toString(),
                isBuyerMaker: side === 'sell',
                price: fill.price.toString(),
                quantity: fill.quantity.toString(),
                quoteQuantity: (fill.quantity * fill.price).toString(),
                timeStamp: Date.now(),
                market,
            }
        })
     })
}
private updateBalance(userId:string,baseAsset: string,quoteAsset: string,side: "buy" | "sell",executedQty: number,fills: Fill[]){
    
    /**
     * when incoming order is buy
     * taker = buyer(userId)
     * maker = seller(otherUserId)
     */

    if(side === "buy"){
    fills.forEach(fill => {
      
        const takerQuoteBalance = this.getAssetBalance(userId,quoteAsset);
        const takerBaseBalance = this.getAssetBalance(userId,baseAsset);

        const makerQuoteBalance = this.getAssetBalance(fill.otherUserId,quoteAsset);
        const makerBaseBalance = this.getAssetBalance(fill.otherUserId,baseAsset);


        const tradeValue = fill.price * fill.quantity;


//Updating the quoteAsset balance
        //credit the quote balance of the maker
        makerQuoteBalance.available = makerQuoteBalance.available + tradeValue; 
        //remove the locked balance of the taker
        takerQuoteBalance.lockedOut = takerQuoteBalance.lockedOut - tradeValue;
//Updating the baseAsset balance
        
        //credit the base balance of the taker
        takerBaseBalance.available += (fill.quantity);
        //remove the locked balance of the maker
        makerBaseBalance.lockedOut -= (fill.quantity);


        this.publishBalanceUpdate(userId,quoteAsset);
        this.publishBalanceUpdate(userId,baseAsset);
        this.publishBalanceUpdate(fill.otherUserId,quoteAsset);
        this.publishBalanceUpdate(fill.otherUserId,baseAsset);
    })
   }else{
     /**
     * when incoming order is sell
     * taker = seller(userId)
     * maker = buyer(otherUserId)
     */

   fills.forEach(fill => {

       const takerQuoteBalance = this.getAssetBalance(userId,quoteAsset);
        const takerBaseBalance = this.getAssetBalance(userId,baseAsset);

        const makerQuoteBalance = this.getAssetBalance(fill.otherUserId,quoteAsset);
        const makerBaseBalance = this.getAssetBalance(fill.otherUserId,baseAsset);


        const tradeValue = fill.price * fill.quantity;

         takerQuoteBalance.available += tradeValue;
         makerQuoteBalance.lockedOut -= tradeValue;
          makerBaseBalance.available += (fill.quantity);
          takerBaseBalance.lockedOut -= (fill.quantity);

       this.publishBalanceUpdate(userId, quoteAsset);
       this.publishBalanceUpdate(userId, baseAsset);
       this.publishBalanceUpdate(fill.otherUserId, quoteAsset);
       this.publishBalanceUpdate(fill.otherUserId, baseAsset);
   });
   }
}


private checkAndLockFunds(baseAsset:string,quoteAsset: string,price: string, quantity: string,side: "buy" | "sell",userId: string){

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

           
    if(side === "buy"){  
        
        const quoteBalance = this.getAssetBalance(userId,quoteAsset);
        const requiredAmount = numericPrice * numericQuantity;
            
        //user should have enough available >= qty*price
        if((quoteBalance.available) < requiredAmount){
            throw new Error("Insufficient Funds");
        }
         //if yes
         quoteBalance.available -= (requiredAmount);
         quoteBalance.lockedOut += (requiredAmount);
        
    }else{
        
        const baseBalance = this.getAssetBalance(userId,baseAsset);

        //user should have enough baseAsset available >= qty
        if((baseBalance.available) >= numericQuantity){
            //if yes
            baseBalance.available -= (numericQuantity);
            baseBalance.lockedOut += (numericQuantity);

        }else{
            throw new Error("User has insufficient shares");
        }
    }

}


private ensureBalance(userId: string,asset: string){

    if (!this.balances[userId]) {
        this.balances[userId] = {};
    }

    if (!this.balances[userId][asset]) {

        this.balances[userId][asset] = {
            available: 0,
            lockedOut: 0
        };

    }


    return this.balances[userId][asset];
}
private onRamp(
    userId: string,
    asset: "INR" | "TATA",
    amount: number
) {

    if (amount <= 0) {

        throw new Error(
            "Invalid on-ramp amount"
        );

    }


    if (
        asset !== "INR" &&
        asset !== "TATA"
    ) {

        throw new Error(
            "Unsupported asset"
        );

    }


    const balance =
        this.ensureBalance(
            userId,
            asset
        );


    balance.available += amount;


    this.publishBalanceUpdate(
        userId,
        asset
    );


    return {
        asset,
        available: balance.available,
        locked: balance.lockedOut
    };
   }


private getAssetBalance(userId: string,asset: string){
    const userBalance = this.balances[userId];

    if(!userBalance){
        throw new Error("User balance does not exist");
    }

    const assetBalance = userBalance[asset];
    
    if(!assetBalance){
        throw new Error(`User's ${asset} balance does not exist`);
    }

    return assetBalance;
}


  private publishBalanceUpdate(userId: string,asset: string){

    const balance = this.balances[userId]?.[asset];
    
    if(!balance)return;

    RedisManager.getInstance().pushMessage({
        type: BALANCE_UPDATE,
        data: {
            userId,
            asset,
            available: balance.available,
            locked: balance.lockedOut,
        }
    }
    )
  }
  
  public async loadBalances(){

    const balances = await prisma.balance.findMany();

    for(const balance of balances){
        if(!this.balances[balance.userId]){
            this.balances[balance.userId] = {}
        }

        this.balances[balance.userId]![balance.asset] = {
            available: Number(balance.available),
            lockedOut: Number(balance.locked),
        }
    }
    console.log(`Loaded ${balances.length} balances`);
  }

}

