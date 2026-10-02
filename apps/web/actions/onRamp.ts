"use server"

import { getCurrentUserId } from "@/lib/auth/getCurrentUser";
import { BalanceSchema } from "@/schemas"
import { prisma } from "@repo/db";
import axios from "axios";
import * as z from "zod"


const onRamp = async (values: z.infer<typeof BalanceSchema>) => {

    const validatedInputs = BalanceSchema.safeParse(values);

    if(!validatedInputs.success){
        return ({
            error: "Invalid Inputs"
        })
    }

    const { asset,amount } = validatedInputs.data;
    
    const userId = await getCurrentUserId();
    
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orderRouter/on_ramp`,
            {asset,amount},
            {
                headers: {
                    "x-user-id": userId,
                }
            });
        const data = response.data;
        
        return {
            success: 
            `${asset} added successfully`,
            balance: data
        }

    }catch (error) {
    console.error(error);

    return {
        error:
            error instanceof Error
                ? error.message
                : "Something went wrong"
    };
}
}

export default onRamp;