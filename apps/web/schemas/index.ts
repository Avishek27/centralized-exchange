import * as z from "zod";


export const LoginSchema = z.object({
    email: z.email({ 
        message: "Please enter a valid email"
    }),
    password: z.string().min(3,{
        message : "Please enter password more than 3 characters"
    })
});

export const RegisterSchema = z.object({
    name: z.string().min(3,{
        message: "Please provide a name more than 3 characters!"
    }),
    email: z.email({ 
        message: "Please enter a valid email"
    }),
    password: z.string().min(3,{
        message : "Please enter password more than 3 characters!"
    })
});

export const BalanceSchema = z.object({
    amount: z.number(),
})

