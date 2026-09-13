import axios from "axios";
import { Depth, Order } from "./types";




export const getDepth = async (market: string): Promise<Depth> => {
   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}depth?market=${market}`);
   return response.data;
}


export const createOrder = async (order: Order) => {
   const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}create`,order);
   return response.data;
}