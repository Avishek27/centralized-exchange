import axios from "axios";
import { Depth } from "./types";


export const getDepth = async (market: string): Promise<Depth> => {
   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order/order?userId=buyer1&market=${market}`);
   return response.data;
}