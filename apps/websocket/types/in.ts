/**
 * Messages from the Frontend
 */


export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";


export type SubscribedMessage = {
    method: typeof SUBSCRIBE,
    params: string[]
}

export type UnsubscribedMessage = {
    method: typeof UNSUBSCRIBE,
    params: string[]
}

export type IncomingMessage = SubscribedMessage | UnsubscribedMessage;