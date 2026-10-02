"use server"

import { getCurrentUserId } from "@/lib/auth/getCurrentUser";
import axios from "axios";

export type UserBalances = {
  balances: {
    INR: {
      available: number;
      locked: number;
    };

    TATA: {
      available: number;
      locked: number;
    };
  };
};



const getBalance = async () => {
   
    const userId = await getCurrentUserId();

    try{
      
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orderRouter/balance`,
            {
                headers: {
                    "x-user-id": userId,
                }
            });
            console.log("Balance data: " + response.data);
            return response.data;
        
    }catch (error) {
    console.error("Failed to get balance:", error);

    throw new Error("Failed to fetch balance");
  }
}

export default getBalance;