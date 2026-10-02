import { Router } from "express";

import { CANCEL_ORDER, CREATE_ORDER, GET_BALANCE, GET_DEPTH, GET_OPEN_ORDER, ONRAMP } from "../types/toEngine";
import { RedisManager } from "../RedisManager";
import { OPEN_ORDER_RESPONSE, ORDER_CANCELLED, ORDER_FAILED, ORDER_PLACED } from "../types/orderBook";


export const orderRouter = Router();


orderRouter.post('/create', async (req,res)=>{
  //TODO: Zod validation!!!
    const { market,price,quantity,side } = req.body;
    const userId = req.headers["x-user-id"];

  if (typeof userId !== "string") {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (!market || !price || !quantity || !side) {
    return res.status(400).json({
      error: "Missing order parameters",
    });
  }
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
    
    if(response.type === ORDER_PLACED){
         return res.status(200).json(
            response.payload
         );
    }


    if(response.type === ORDER_FAILED){
        return res.status(400).json({
            error: response.payload.error
        })
    }

    return res.status(500).json({
        error: "unexpected response from the engine"
    })
});


orderRouter.post('/on_ramp', async (req,res)=>{
  //TODO: Zod validation!!!
    const { asset,amount } = req.body;
    const userId = req.headers["x-user-id"];
    console.log({ userId,amount,asset});
    
    if(typeof userId !== "string"){
        return res.status(401).json({
            error: "UserID is missing"
        })
    }

    if(asset !== "TATA" && asset !== "INR"){
        return res.status(400).json({
            error: "Invalid asset"
        })
    }
    
    const response = await RedisManager.getInstance().sendAndAwait({
        type: ONRAMP,
        data: {
            userId,
            asset,
            amount
        }
    });

    res.json(response.payload);
});

orderRouter.get('/balance',async (req,res) => {
    const userId = req.headers["x-user-id"];

    if(typeof userId !== "string"){
       return res.status(401).json({
        error: "Unauthorized"
       })
    }

    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_BALANCE,
        data: {
            userId,
        }
    });

    return res.json(
        response.payload
    )
})


orderRouter.delete('/order',async (req,res) => {
     //TODO: Zod validation!!!
    try{
    const userId = req.headers["x-user-id"];
    const {orderId,market} = req.body;
    console.log({orderId,market});
    
    if (
        typeof userId !== "string"
      ) {
        return res
          .status(401)
          .json({
            error: "Unauthorized",
          });
      }

      if (
        !market ||
        !orderId
      ) {
        return res
          .status(400)
          .json({
            error:
              "Market and orderId are required",
          });
      }
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CANCEL_ORDER,
        data:{
            orderId,
            market,
        }
    });
    if (
        response.type ===
        ORDER_FAILED
      ) {
        return res
          .status(400)
          .json({
            error:
              response.payload.error,
          });
      }
    
      if (
        response.type ===
        ORDER_CANCELLED
      ) {
        return res
          .status(200)
          .json(response.payload);
      }

      return res
        .status(400)
        .json({
          error:
            "Failed to cancel order",
        });
    }catch(error){
        console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Failed to cancel order",
        });
    }
     
});

orderRouter.get('/open_order',async(req,res) => {
    //TODO: Zod validation!!!

   try {
    const userId = req.headers["x-user-id"];

    if (
      typeof userId !== "string"
    ) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const {market} = req.query;
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
    if (
      response.type ===
      OPEN_ORDER_RESPONSE
    ) {
      return res
        .status(200)
        .json(response.payload);
    }
} catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        "Failed to fetch open orders",
    });
  }
});


orderRouter.get('/depth',async (req,res) => {
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
