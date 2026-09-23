"use server"
import { getUserByEmail } from '@/data';
import { LoginSchema } from '../schemas/index';
import * as z from "zod"
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

const Login = async (values: z.infer<typeof LoginSchema>) => {

    const validatedInputs = LoginSchema.safeParse(values);

    if(!validatedInputs.success){
        return ({
            error: "Invalid input formats"
    })
    }
    
    const { email,password } = validatedInputs.data;
    
    try{
       

        await signIn("credentials",{
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    }catch(error){
        if(error instanceof AuthError){
            switch (error.type){
                case "CredentialsSignin": 
                      return { error: "Invalid Credentials" }
                default: 
                      return { error: "Something went wrong!" }
            }
        }
        throw error;
    }



    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password){
        return {
            error: "User doesn't exists"
        }
    }

    return ({
       success: "Successfully logged in"
    })
}

export default Login;