"use client"


interface AuthLayoutProps {
    children: React.ReactNode;
}


const AuthLayout = ({children}: AuthLayoutProps) => {
    return (
     <div className="min-h-full flex flex-col items-center justify-center mt-5">
      {children}
     </div>
    )
}


export default AuthLayout;