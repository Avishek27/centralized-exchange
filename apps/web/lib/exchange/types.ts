 export type Depth = {
    bids: [string,string][],
    asks: [string,string][],
 }

 export type Trade = {
    tradeId: string,
    isBuyerMaker: boolean,
    price: string,
    executedQuantity: number,
    market: string, 
 }

 export type Order = {
    market: string,
    quantity: string,
    side: "buy" | "sell",
    userId: string,
    price: string,
 }