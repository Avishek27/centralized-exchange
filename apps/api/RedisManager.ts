/*
This RedisManager requires 2 things:
the client for subscribing to the channel to recieve message from the PUBSUB of the Engine
the publisher for the message queue to send the messages to the Engine.
*/

import { createClient, type RedisClientType } from "redis";
import type { MessageToEngine } from "./types/engine";
import type { MessageFromEngine } from "./types/orderBook";


export class RedisManager{
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor(){
       this.client = createClient();
       this.client.connect();
       this.publisher = createClient();
       this.publisher.connect();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new RedisManager();
        }

        return this.instance;
    }

    public async sendAndAwait(message: MessageToEngine){
       return new Promise<MessageFromEngine>(async(resolve) =>{
          const id = this.getRandomClientId();

         await this.client.subscribe(id,(message) => {
            this.client.unsubscribe(id);
            resolve(JSON.parse(message));
          });

         await this.publisher.lPush("messages",JSON.stringify({clientId: id,message: message}));
       })
    }


    public getRandomClientId(){
        return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
    }
}