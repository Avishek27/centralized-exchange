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


export type AssetBalance = {
   available: number,
   locked: number,
}

export type UserBalances = {
   balances: {
      INR: AssetBalance,
      TATA: AssetBalance
   }
}

export type OpenOrder = {
  orderId: string;
  market: string;
  price: string | number;
  quantity: string | number;
  filled: number;
  side: "buy" | "sell";
};