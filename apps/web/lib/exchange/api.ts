import axios from "axios";
import { Depth, Kline, Order } from "./types";




export const getDepth = async (market: string): Promise<Depth> => {
   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orderRouter/depth?market=${market}`);
   return response.data;
}


export const createOrder = async (order: Order) => {
   const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orderRouter/create`,order);
   return response.data;
}

export const getKLines = async (
   market: string,
   interval: string,
   startTime: number,
   endTime: number
): Promise<Kline[]> => {
   
   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/klines`,{
      params: {
         market,
         interval,
         startTime,
         endTime
      },
   });

   return response.data;
}