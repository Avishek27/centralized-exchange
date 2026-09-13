"use client"

interface marketLayoutTypes{
    children: React.ReactNode;
}



const MarketLayout = ({children}: marketLayoutTypes) => {
    return (
    <div>
       {children}
    </div>
    )
}


export default MarketLayout;