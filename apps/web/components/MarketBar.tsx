"use client"



const MarketBar = () => {
    
    return (
        <div className="w-full border-b-2 border-gray-400 flex items-center justify-between h-14 md:h-16 lg:h-20 gap-x-4 px-4 md:px-8">
        <div className="flex gap-x-4">
            <div>
                AssetName
            </div>
           <div>
            Price
           </div>
           <div>
            24 HR Price
           </div>
        </div>
        </div>
    )
}


export default MarketBar;