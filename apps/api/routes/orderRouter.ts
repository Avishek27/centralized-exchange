import { Router } from "express";

import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDER, ONRAMP } from "../types/engine";
import { RedisManager } from "../RedisManager";


export const orderRouter = Router();


orderRouter.post('/create', async (req,res)=>{
  //TODO: Zod validation!!!
    const { market,price,quantity,side,userId } = req.body;
    console.log({ market,price,quantity,side,userId});
    
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market,
            price,
            quantity,
            side,
            userId
        }
    });

    res.json(response.payload);
});


orderRouter.post('/on_ramp', async (req,res)=>{
  //TODO: Zod validation!!!
    const { userId,amount } = req.body;
    console.log({ userId,amount});
    
    const response = await RedisManager.getInstance().sendAndAwait({
        type: ONRAMP,
        data: {
            userId,
            amount
        }
    });

    res.json(response.payload);
});


orderRouter.delete('/order',async (req,res) => {
     //TODO: Zod validation!!!

    const {orderId,market} = req.body;
    console.log({orderId,market});

    const response = await RedisManager.getInstance().sendAndAwait({
        type: CANCEL_ORDER,
        data:{
            orderId,
            market,
        }
    });

    res.json(response.payload);
});

orderRouter.get('/order',async(req,res) => {
    //TODO: Zod validation!!!

    const {userId,market} = req.query;
    //Temp fix: TODO
    if(typeof userId !== "string")return res.send(400);
    if(typeof market !== "string") return res.send(400);
    console.log({userId,market});

    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_OPEN_ORDER,
        data: {
            userId,
            market
        }
    });

    res.json(response.payload);
});


orderRouter.get('/order',async (req,res) => {
    //TODO: ZOD Validation

    const {market} = req.query;
    if(typeof market!= "string")return res.send(400);

    console.log({market});

    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_DEPTH,
        data: {
            market,
        }
    });

    res.json(response.payload);
})
