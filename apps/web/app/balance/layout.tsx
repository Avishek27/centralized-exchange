"use client"

interface BalanceLayoutProps{
    children: React.ReactNode;
}


const BalanceLayout = ({children}: BalanceLayoutProps) => {
    return (
     <div className="min-h-dvh bg-black text-white flex flex-col items-center justify-center">
       {children}
     </div>
    )
}

export default BalanceLayout;