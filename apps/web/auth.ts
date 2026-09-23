import NextAuth, {type NextAuthResult} from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from  "@auth/prisma-adapter";
import { getUserById } from "./data";
import { prisma } from "@repo/db";



const authResult: NextAuthResult = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user }){
       await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date()
        }
       })
    }
  },
  callbacks:{
  async session({ token, session}){
    if(token.sub && session.user){
      session.user.id = token.sub;
    }
    
    if(token.role && session.user){
      session.user.role = token.role;
    }

    return session;
  },
   async jwt({ token }) {
    console.log({token});
    if(!token.sub)return token;

    const existingUser = await getUserById(token.sub);

    if(!existingUser)return token;

    token.role = existingUser.role;
    return token;
   }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt"},
 ...authConfig
})

export const handlers:
  NextAuthResult["handlers"] =
  authResult.handlers;

export const signIn:
  NextAuthResult["signIn"] =
  authResult.signIn;

export const signOut:
  NextAuthResult["signOut"] =
  authResult.signOut;

export const auth:
  NextAuthResult["auth"] =
  authResult.auth;