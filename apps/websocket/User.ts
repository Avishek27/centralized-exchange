import { SubscriptionManager } from "./SubscriptionManager";
import { SUBSCRIBE, UNSUBSCRIBE, type IncomingMessage } from "./types/in";
import type { OutgoingMessage } from "./types/out";
import WebSocket from "ws";


/**
 * We use ws.send for sending messages from Server to the Browser
 * We use ws.on('message') for messages from Browser to Server
 */





export class User{
    private id: string;
    private ws: WebSocket;

    constructor(id: string,ws: WebSocket){
       this.id = id;
       this.ws = ws;
       this.addListeners();
    }
    emit(message: OutgoingMessage){
      this.ws.send(JSON.stringify(message));
    }

    private addListeners(){
      this.ws.on('message',(message: string) => {
         const parsedMessage: IncomingMessage = JSON.parse(message);
         if(parsedMessage.method === SUBSCRIBE){
            parsedMessage.params.forEach(s => SubscriptionManager.getInstance().subscribe(this.id,s));
         }
         if(parsedMessage.method === UNSUBSCRIBE){
          parsedMessage.params.forEach(s => SubscriptionManager.getInstance().unsubscribe(this.id,s));
         }
      })
    }

}