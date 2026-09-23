import  type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data";
import bcrypt from "bcryptjs";


const authConfig: NextAuthConfig = {

    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET,
        }),
        Github({
           clientId: process.env.GITHUB_CLIENTID,
           clientSecret: process.env.GITHUB_CLIENTSECRET,
        }),
        Credentials({
            async authorize(credentials){
              
                const validatedFields = LoginSchema.safeParse(credentials);

                if(validatedFields.success){
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if(!user || !user.password){
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(password,user.password);
                    if(passwordMatch)return user;
                }
                return null;
            }
        })
    ],
};


export default authConfig;