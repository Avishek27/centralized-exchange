"use client"

import { CheckCircle } from "lucide-react";


interface FormSuccessProps{
    label: string | undefined;
}

const FormSuccess = ({label}: FormSuccessProps) => {
  
    if(!label){
        return null;
    }

    return (
         <div className="bg-emerald-500 text-emerald-900 rounded-md flex items-center text-center p-3 gap-x-2 text-sm">
           <CheckCircle/>
           <p>{label}</p>
         </div>
    )
}

export default FormSuccess;