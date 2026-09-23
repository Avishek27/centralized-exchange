"use server"

import { getCurrentUserId } from "@/lib/auth/getCurrentUser";
import { BalanceSchema } from "@/schemas"
import { prisma } from "@repo/db";
import * as z from "zod"


const onRamp = async (values: z.infer<typeof BalanceSchema>) => {

    const validatedInputs = BalanceSchema.safeParse(values);

    if(!validatedInputs.success){
        return ({
            error: "Invalid Inputs"
        })
    }

    const { amount } = validatedInputs.data;
    
    const userId = await getCurrentUserId();
    
    try{
        const response = await prisma.balance.findUnique({
            where: {
                userId_asset: {
                  userId: userId,
                  asset: "INR"
                }
            },
        });
        return response;

    }catch(e){
         return  {
            error: e,
         }
    }
}

export default onRamp;