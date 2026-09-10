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