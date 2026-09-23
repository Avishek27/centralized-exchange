"use client"

import { BsExclamation } from "react-icons/bs";

interface FormErrorProps{
    label: string | undefined;
}

const FormError = ({label}: FormErrorProps) => {
  
    if(!label){
        return null;
    }

    return (
         <div className="bg-destructive/15 text-destructive rounded-md flex items-center text-center p-3 gap-x-2 text-sm">
           <BsExclamation/>
           <p>{label}</p>
         </div>
    )
}

export default FormError;