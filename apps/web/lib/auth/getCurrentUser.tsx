import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const getCurrentUserId = async () => {

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    return session.user.id;
};