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

 export type Kline = {
  start: number;

  open: string;
  high: string;
  low: string;
  close: string;

  volume: string;
  quoteVolume: string;

  trades: number;
};

export type Candle = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
};