"use client"


import { cn } from "@workspace/ui/lib/utils";
import { Poppins } from "next/font/google";

interface HeaderProps{
    label: string;
}

const font = Poppins({
    subsets: ['devanagari'],
    weight: "300"
})


const Header = ({label}: HeaderProps) => {
   
    return (
       <div className="flex flex-col items-center justify-center space-y-4">
         <h1 className={cn("text-3xl text-black font-bold",font.className)}>Wealthlane</h1>
         <p className="text-accent-foreground">{label}</p>
       </div>
    )
}

export default Header;