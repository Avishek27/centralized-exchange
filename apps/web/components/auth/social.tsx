"use client"

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import {signIn} from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Button } from "@workspace/ui/components/button";

const Social = () => {
    const onClickHandler = (provider: "google" | "github") => {
         signIn(provider,{
          callbackUrl: DEFAULT_LOGIN_REDIRECT,
         })
    }
    return (
        <div className="space-x-3 w-full flex items-center justify-center">
          <Button className="" variant={"outline"} size={"lg"} onClick={() => {onClickHandler("google")}}><FcGoogle></FcGoogle></Button>
          <Button variant={"outline"} size={"lg"} onClick={() => {onClickHandler("github")}}><FaGithub></FaGithub></Button>
        </div>
    )
}


export default Social;