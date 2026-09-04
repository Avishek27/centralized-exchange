import { createClient, RedisClient, type RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager{
    private static instance: SubscriptionManager;
    private subscriptions: Map<string,string[]> = new Map();
    private reverseSubscriptions: Map<string,string[]> =  new Map();
    private redisClient: RedisClientType;


    private constructor(){
        this.redisClient = createClient({
  url: process.env.REDIS_URL
});;
        this.redisClient.connect();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new SubscriptionManager();
            return this.instance;
        }
        return this.instance;
    }
    
    public subscribe(userId: string, subscription: string){
        //Check whether this user is already subscribed to this channel.
         //  If yes → return.
       if(this.subscriptions.get(userId)?.includes(subscription)){
        return;
       }
        //Update subscriptions: userId → add subscription
        this.subscriptions.set(userId,(this.subscriptions.get(userId) || []).concat(subscription));
        //Update reverseSubscriptions: subscription → add userId
        this.reverseSubscriptions.set(subscription,(this.reverseSubscriptions.get(subscription) || []).concat(userId));
        
        if(this.reverseSubscriptions.get(subscription)?.length === 1){
            //websocket server should subscribe to the Redis Client
            this.redisClient.subscribe(subscription,this.redisCallBackHandler);
        }
    
    }
    
    private redisCallBackHandler = (message: string, subscription: string) => {
       const parsedMessage = JSON.parse(message);
       this.reverseSubscriptions.get(subscription)?.forEach(userId => UserManager.getInstance().getUser(userId)?.emit(parsedMessage));
    }


    public unsubscribe(userId: string,subscription: string){
        const subscriptions = this.subscriptions.get(userId);
        const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
        if(subscriptions){
            this.subscriptions.set(userId,subscriptions.filter(s => s !== subscription));
        }
        if(reverseSubscriptions){
            this.reverseSubscriptions.set(subscription,reverseSubscriptions.filter(s => s !== userId));
            if(this.reverseSubscriptions.get(subscription)?.length === 0){
                this.reverseSubscriptions.delete(subscription);
                this.redisClient.unsubscribe(subscription);
            }
        }
    }

    public userLeft(userId: string){
        console.log('user Left: ',userId);
        this.subscriptions.get(userId)?.forEach(s => this.unsubscribe(userId,s));
    }
}



