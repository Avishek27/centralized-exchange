"use server"
import { getUserByEmail } from '@/data';
import { RegisterSchema } from '@/schemas/index';
import { prisma } from '@repo/db';
import bcrypt from 'bcryptjs';
import * as z from "zod"

const Register = async (values: z.infer<typeof RegisterSchema>) => {

    const validatedInputs = RegisterSchema.safeParse(values);

    if(!validatedInputs.success){
        return ({
            error: "Invalid input formats"
    })
    }
     
    const { name, email, password } = validatedInputs.data;
    
    const checkExistingUser = await getUserByEmail(email);
    
    if(checkExistingUser){
       return {
        error: "User already exists."
       } 
    }
    const hashedPassword = await bcrypt.hash(password,10);
    
    try{
     await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
     });
    }catch(e){
        console.error(
            "REGISTER ERROR:",
            e
        );

        return {
            error: "User creation failed"
        }
    }
     
     
    return ({
       success: "Successfully created an account"
    })
}

export default Register;