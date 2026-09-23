"use client"

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {

    const { data: session, status } = useSession();

    return {
        user: session?.user,
        userId: session?.user?.id,
        role: session?.user?.role,
        status,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
    };
};