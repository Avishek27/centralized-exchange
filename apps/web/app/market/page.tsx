import ChartManager from "@/components/ChartManager";
import { DepthComponent } from "@/components/Depth/Depth";
import MarketBar from "@/components/MarketBar";
import Navbar from "@/components/Navbar";
import SwapUI from "@/components/SwapUI";



const MarketPage = () => {
    return (
        <div className="min-h-dvh flex flex-col">
         <div className="shrink-0">
            <Navbar/>
            <MarketBar/>
            </div>
           
           <div className="flex flex-1 flex-col items-stretch lg:flex-row">
        <div className="flex w-full min-w-0 flex-col lg:w-2/3 border-r-2 border-gray-400">
          <ChartManager />
        </div>

        <div className="flex w-full min-w-0 flex-col lg:w-1/6 border-r-2 border-gray-400">
          <DepthComponent />
        </div>

        <div className="flex w-full min-w-0 flex-col lg:w-1/6 border-r-2 border-gray-400">
          <SwapUI />
        </div>
      </div>
           
        </div>
        
    )
}


export default MarketPage;