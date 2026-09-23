"use client"


import CardWrapper from "./card-wrapper";
import { BsExclamationTriangle } from "react-icons/bs";

const ErrorCard = () => {
    return (
    <CardWrapper
    headerLabel="Oops! Something went wrong!"
    backButtonHref="/auth/login"
    backButtonLabel="Back to Login"
    >
        <div className="w-ful flex justify-center items-center"> 
            <BsExclamationTriangle className="text-destructive"/>
        </div>
    </CardWrapper>
    )
}

export default ErrorCard;