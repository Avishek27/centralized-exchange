
/*
1. Messages from the API to the Engine.

a. Place an order: i/p: market,qty,side,userId.//create order
b. Get the Depth of the market: i/p: market
c. Cancel an order: i/p: orderId,market,
d. Get Open Orders: means all the open orders for the particular user, i/p: userId
e. OnRamp: means add an amount to the userBalance, i/p: userId,amt.


*/


export const CREATE_ORDER = "CREATE_ORDER";
export const GET_OPEN_ORDER = "GET_OPEN_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ONRAMP = "ON_RAMP";
export const GET_DEPTH = "GET_DEPTH";



export type MessageToEngine = {
  type: typeof CREATE_ORDER,
  data:{
    market: string,
    quantity: string,
    side: "buy" | "sell",
    userId: string,
    price: string,
  }
} | {
    type: typeof GET_DEPTH,
    data: {
        market: string,
    }
} | {
    type: typeof CANCEL_ORDER,
    data: {
        orderId: string,
        market: string,
    }
} | {
    type: typeof GET_OPEN_ORDER,
    data: {
        userId: string,
        market: string,
    }
} | {
    type: typeof ONRAMP,
    data: {
        userId: string,
        amount: number,
    }
}