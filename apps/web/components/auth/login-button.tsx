"use client"

import { useRouter } from "next/navigation";

interface LoginButtonProps{
    children: React.ReactNode;
    asChild?: boolean;
    modal?: "redirect" | "modal";
}


const LoginButton = ({children,modal= "redirect"}: LoginButtonProps) => {
   
    const router = useRouter();

    const onClickHandler = () => {
        router.push("/auth/login");
    }
    
    if(modal == "modal"){
        console.log("To be done later");
    }


    return (
        <span className="cursor-pointer" onClick={onClickHandler}>
           {children}
        </span>
    )
}


export default LoginButton;