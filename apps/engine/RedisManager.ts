import { createClient, type RedisClient, type RedisClientType } from "redis";
import type { SendToApi } from "./types/toApi";
import type { WsMessage } from "./types/toWs";

export class RedisManager{
    private client: RedisClientType;
    private static instance: RedisManager;
    
    constructor(){
        this.client = createClient();
        this.client.connect();
    }

    public static getInstance(){
      if(!this.instance){
        this.instance = new RedisManager();
      }
      return this.instance;
    }
    
    public publishMessage(channel:string,message: WsMessage){
      this.client.publish(channel,JSON.stringify(message));
    }

    public sendToApi(clientId: string,message: SendToApi){
        this.client.publish(clientId,JSON.stringify(message));
    }
}