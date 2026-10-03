"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";

import { FaUser, FaSignOutAlt } from "react-icons/fa";

import LogoutButton from "./logout-button";
import { useCurrentUser } from "@/hooks/getUser";


const UserButton = () => {

    const { user } = useCurrentUser();

    return (
        <DropdownMenu>

            <DropdownMenuTrigger>
                <Avatar>

                    <AvatarImage
                        src={user?.image ?? ""}
                    />

                    <AvatarFallback className="bg-slate-500">
                        <FaUser className="text-white" />
                    </AvatarFallback>

                </Avatar>
            </DropdownMenuTrigger>


            <DropdownMenuContent
                align="end"
                className="w-40"
            >

                <LogoutButton>
                    <DropdownMenuItem>

                        <FaSignOutAlt className="h-4 w-4 mr-2" />

                        Logout

                    </DropdownMenuItem>
                </LogoutButton>

            </DropdownMenuContent>

        </DropdownMenu>
    );
};


export default UserButton;