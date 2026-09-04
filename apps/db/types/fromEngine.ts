/**
 * We require 2 types for now
 * TRADE_ADDED
= history of executions

ORDER_UPDATE
= current state of orders
 */

export const TRADE_ADDED = "TRADE_ADDED";
export const ORDER_UPDATE = "ORDER_UPDATE";


export type tradeMessage = {
 type: typeof TRADE_ADDED,
 data: {
    tradeId: string,
    isBuyerMaker: boolean,
    price: string,
    quantity: string,
    quoteQuantity: string,
    timeStamp: number,
    market: string,
 }
}

export type orderUpdateMessage = {
  type: typeof ORDER_UPDATE,
  data: {
     orderId: string,
     executedQty: number,
     market?: string,
     price?: string,
     quantity?: string,
     side?: "buy" | "sell"
  }
}


export type dbMessage = tradeMessage | orderUpdateMessage;