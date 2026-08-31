

export type DepthMessage = {
    stream: string,
    data: {
        bids: [string,string][],
        asks: [string,string][],
        e: "depth"
    }
}

export type TradeMessage = {
    stream: string,
    data: {
        e: 'trade',
        tradeId: string,
        isBuyerMaker: boolean,
        price: string,
        executedQuantity: number,
        market: string, 
    }
}


export type WsMessage = DepthMessage | TradeMessage;