
/*
2. Sending Message to the API:

a. Order is placed: o/p: executedQty,fills(which orders were used to fill the execQty),orderId.
b. Order is cancelled: same o/p.
c. GetDepth: 2 arrays each of [String,String].
d. GetOpenOrders: a combined array consisting of both bids and asks
e. OnRamp: return the final amt in the user's balance.
*/
export const ORDER_PLACED = "ORDER_PLACED";
export const DEPTH_RESPONSE = "DEPTH_RESPONSE";
export const ON_RAMP_RESPONSE = "ONRAMP_RESPONSE";
export const OPEN_ORDER_RESPONSE = "OPEN_ORDER_RESPONSE";
export const ORDER_CANCELLED = "ORDER_CANCELLED";

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

export type MessageFromEngine = {
    type: typeof ORDER_PLACED,
    payload: {
        orderId: string,
        executedQty: number,
        fills: Fill[],
    }
} | {
    type: typeof ORDER_CANCELLED,
    payload: {
        orderId: string,
    }
} | {
    type: typeof DEPTH_RESPONSE,
    payload: {
        bids: [string,string][],
        asks: [string,string][],
    }
} | {
    type: typeof OPEN_ORDER_RESPONSE,
    payload: Order[],
} | {
    type: typeof ON_RAMP_RESPONSE,
    payload: {
        amount: number,
    }
}