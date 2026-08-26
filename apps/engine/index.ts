/*
Engine will poke the Redis Queue everytime and when a message comes from the API,
it will process that response

Response contains: Message, Client Id
PS: Create an Engine class, Create a Redis class


Note: The queue to which the API is sending messages and the Engine is polling everytime is named as "messages"
*/

import { Engine } from "./trade/Engine";
import { createClient } from "redis";


async function main(){
    
    const engine = new Engine();
    const redisClient = createClient();
    await redisClient.connect();
 console.log("Engine is runnning AF");
    while(true){
       
        const response = await redisClient.rPop("messages" as string);

        if(!response){
           //resp
        }
        else{
            engine.process(JSON.parse(response));
        }
    }
    
}

main();


