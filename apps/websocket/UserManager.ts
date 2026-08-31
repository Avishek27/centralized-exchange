import WebSocket from "ws";
import { User } from "./User";
import { SubscriptionManager } from "./SubscriptionManager";


export class UserManager{
    
    private static instance: UserManager;
    private users: Map <string,User> = new Map();

    /**
     * Declaring pvt constr because only getInstance should initialize the UserManager object
     */
    private constructor(){

    }


    public static getInstance(){
      if(!this.instance){
        this.instance = new UserManager();
        return this.instance;
      }
      return this.instance;
    }

    public addUser(socket: WebSocket){
        //store 
        const userId = this.generateId();
        const user = new User(userId,socket);
        this.users.set(userId,user);
        this.registerOnClose(userId,socket);
        return user;
    }
    
    public getUser(userId: string){
        return this.users.get(userId);
    }

    private registerOnClose(userId: string,socket: WebSocket){
        socket.on('close',() => {
            this.users.delete(userId);
            SubscriptionManager.getInstance().userLeft(userId);
        })
    }

    private generateId(){
        return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
    }
}