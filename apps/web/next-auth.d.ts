import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import type { UserRole } from "@repo/db";


declare module "next-auth" {

    interface User {
        role?: UserRole;
    }

    interface Session extends DefaultSession {
        user: {
            id: string;
            role: UserRole;
        } & DefaultSession["user"];
    }
}


declare module "next-auth/jwt" {

    interface JWT extends DefaultJWT {
        role?: UserRole;
    }
}