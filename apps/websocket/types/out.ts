

export type DepthMessage = {
    type: "depth",
    data:{
        bids?: [string,string][],
        asks?: [string,string][],
        id: string,
        e: "depth"
    }
}

export type OutgoingMessage = DepthMessage;