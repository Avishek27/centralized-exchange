
/*
Orderbook should know: 

BIDS: BUYING ORDERS
ASKS: SELLING ORDERS

->Which market it belongs to ?
-> Buy Orders: should be an array to store the duplicate orders too
-> Sell Orders
->Never leave an order in the book if it can be executed immediately.
*/

export interface Order{ 
   userId: string;
   price: number;
   quantity: number;
   side: "buy" | "sell";
   orderId: string;
   filled: number;//executedQty
}


export interface Fill{
    tradeId: number;
    price: number;
    quantity: number;
    makerOrderId: string;//existing OrderID in orderbook
    otherUserId: string;//existing UserID in orderbook
}

export class OrderBook{
  
   private baseAsset: string;
   private quoteAsset: string;
    bids: Order[];
    asks: Order[];
   private lastTradeId: number;

    constructor(baseAsset: string,quoteAsset:string,lastTradeId: number){
       this.baseAsset = baseAsset;
       this.quoteAsset = quoteAsset;
       this.bids = [];
       this.asks = [];
       this.lastTradeId = lastTradeId || 0;
    }
    
    ticker(){
      return `${this.baseAsset}_${this.quoteAsset}`;
    }

   /*
   AddOrder:
   To be called on the Engine---public
   has an input of the order
   checks if the order is of buy or sell
   routes them to the matchBid or matchAsk
   they return respective executedQty
   Now 2 things are happening
   if order.qty === executedQty then this needs not to be saved in OB and return the respective fill and executedQty
   else
      we push this order to the orderbook
   NB: if the order is partially filled then the modified order qty is saved in the corresponding function of matchBids or matchAsks
   returns the executedQty and the fills i.e the number of orders processed for this order
   */
    public addOrder(order: Order):{
      executedQty: number,
      fills: Fill[]
    }{
      if(order.side === "buy"){
         const { executedQty, fills} = this.matchBid(order);
         order.filled = executedQty;
         if(order.quantity === executedQty){
            return {
               executedQty,
               fills
            }
         }
         this.bids.push(order);
         this.bids.sort((a,b) => b.price - a.price);
        return {
         executedQty,
         fills
        }
      }else{
         const { executedQty, fills} = this.matchAsk(order);
         order.filled = executedQty;
         if(order.quantity === executedQty){
            return {
               executedQty,
               fills
            }
         }
         this.asks.push(order);
         this.asks.sort((a,b) => a.price - b.price);
        return {
         executedQty,
         fills
        }
      }
    }
   
    public getDepth(){
     //For Each order
     //if this price exists then add the remaining quantity there
     //else 
      //create a new price level
     //defining bids and asks here in this function to return

     const bids: [string,string][] = [];
     const asks: [string,string][] = [];
     
     const bidsObj: {[key: string]: number} = {};
     const asksObj: {[key: string]: number} = {};
     
     for(const tempOrder of this.bids){

      if(!tempOrder)continue;

      const currQuantity = bidsObj[tempOrder.price] ?? 0;
      bidsObj[tempOrder.price] = currQuantity +  (tempOrder.quantity - tempOrder.filled);
     }

     for(const tempOrder of this.asks){

      if(!tempOrder)continue;

      const currQuantity = asksObj[tempOrder.price] ?? 0;
      asksObj[tempOrder.price] = currQuantity + (tempOrder.quantity - tempOrder.filled);
     }

     for(const price in bidsObj){
        bids.push([price, bidsObj[price]!.toString()]);
     }

     for(const price in asksObj){
        asks.push([price,asksObj[price]!.toString()]);
     }
     return {
      bids,
      asks
     }
    }
    public printBook(){
      console.log("Bids: ",this.bids);
      console.log("Asks: ",this.asks);
    }
    public getOpenorders(userId: string){
        //filter the asks and bids based on the userId
        const bids = this.bids.filter((order) => order.userId === userId);
        const asks = this.asks.filter((order) => order.userId === userId);

        return [...asks,...bids];
    }
//Matching a BUYING ORDER
//We have to look in the selling order array i.e the asks array
/*
For each item in the array:
  if the selling price of the item is less than or equal to that the order price 
  and if the incoming order still has qty left to be completed
  
  fill the minimum qty possible : min(this.asks[i].qty - this.asks[i].filled,order.qty - executedQty)
    if the qty of the ask order gets fullfilled then it has to be removed from the orderbook
*/
    private matchBid(order: Order){
        let executedQty = 0;
        let fills: Fill[] = [];
         
        for(let i = 0;i<this.asks.length;i++){
         if(this.asks[i]!.price <= order.price && executedQty < order.quantity){
            //this line has to be reviewed: TODO
           const filledQty = Math.min((this.asks[i]!.quantity - this.asks[i]!.filled),(order.quantity - executedQty));
           executedQty += filledQty;
           this.asks[i]!.filled += filledQty;
           fills.push({
            price: this.asks[i]!.price,
            quantity: filledQty,
            tradeId: this.lastTradeId++,
            otherUserId: this.asks[i]!.userId,
            makerOrderId: this.asks[i]!.orderId,
           })
         }
      }
      for(let i = 0;i<this.asks.length;i++){
        //if the existing ask has qty === filled qty then it has to be removed
        if(this.asks[i]!.quantity === this.asks[i]!.filled){
          this.asks.splice(i,1);
          i--;
        }
      }
        return {
         executedQty,
         fills
        }
    }
    
    private matchAsk(order: Order){
        let executedQty = 0;
        let fills: Fill[] = [];
         
        for(let i = 0;i<this.bids.length;i++){
         if(this.bids[i]!.price >= order.price && executedQty < order.quantity){
            //this line has to be reviewed: TODO
           const filledQty = Math.min((this.bids[i]!.quantity - this.bids[i]!.filled),(order.quantity - executedQty));
           executedQty += filledQty;
           this.bids[i]!.filled += filledQty;
           fills.push({
            price: this.bids[i]!.price,
            quantity: filledQty,
            tradeId: this.lastTradeId++,
            otherUserId: this.bids[i]!.userId,
            makerOrderId: this.bids[i]!.orderId,
           })
         }
      }
      for(let i = 0;i<this.bids.length;i++){
        //if the existing ask has qty === filled qty then it has to be removed
        if(this.bids[i]!.quantity === this.bids[i]!.filled){
          this.bids.splice(i,1);
          i--;
        }
      }
        return {
         executedQty,
         fills
        }
    }

//Cancel Bid
   public cancelBid(orderId: string){
    
      const index = this.bids.findIndex(bid => bid.orderId === orderId);
      if(index !== -1){
         const order = this.bids[index];
         this.bids.splice(index,1);
         return order;
      }else{
         throw new Error("Order not found");
      }
   }
//Cancel Ask
   public cancelAsk(orderId: string){
    
      const index = this.asks.findIndex(ask => ask.orderId === orderId);
      if(index !== -1){
         const order = this.asks[index];
         this.asks.splice(index,1);
         return order;
      }else{
         throw new Error("Order not found");
      }
   }


    
}