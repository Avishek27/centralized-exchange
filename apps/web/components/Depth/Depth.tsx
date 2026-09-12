"use client"

import { getDepth } from "@/lib/exchange/api"
import { Depth } from "@/lib/exchange/types";
import { useEffect, useState } from "react";
import AskTable from "./AskTable";
import BidsTable from "./BidsTable";
import { SignallingManager } from "@/lib/exchange/SignallingManager";




export const DepthComponent = () =>{
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
     async function fetchDepth(){
        const response = await getDepth('TATA_INR');
        setBids(response.bids);
        setAsks(response.asks);
     }
     fetchDepth();
    },[]);

    useEffect(() =>{
        const manager = SignallingManager.getInstance();
        
         manager.registerCallback(
            "depth",
            (data) => {
               if(data.bids){
                setBids((originalBids) => {
                const bidsAfterUpdate = [...(originalBids || [])];

                // for (const existingBid of bidsAfterUpdate) {
                //     for (const incomingBid of data.bids)  {
                        
                //         if (bidsAfterUpdate[0] === incomingBid[0]) {
                //             bidsAfterUpdate[1] = incomingBid[1];
                //             break;
                //         }
                //     }
                // }

                for(const [price,quantity] of data.bids){
                    const index = bidsAfterUpdate.findIndex(
                        ([existingPrice]) => existingPrice === price
                    );

                    if(quantity === "0"){
                        if(index != -1){
                            //this order has 0 quantity
                        bidsAfterUpdate.splice(index,1);
                        }
                    }else if(index != -1){
                        //if this price exists
                        bidsAfterUpdate[index] = [price,quantity];
                    }else{
                        //new price
                        bidsAfterUpdate.push([price,quantity]);
                    }
                }
                bidsAfterUpdate.sort(
                    (a,b) => Number(b[0]) - Number(a[0])
                );
                return bidsAfterUpdate; 
            });
               }
               if(data.asks){
                setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];

                // for (const existingAsk of asksAfterUpdate) {
                //     for (const incomingAsk of data.asks)  {
                //         if (existingAsk[0] === incomingAsk[0]) {
                //             existingAsk[1] = incomingAsk[1];
                //             break;
                //         }
                //     }
                // }

                for(const [price,quantity] of data.asks){
                    const index = asksAfterUpdate.findIndex(
                        ([existingAskPrice]) => existingAskPrice === price
                    );

                    if(quantity === "0"){
                        if(index != -1){
                            asksAfterUpdate.splice(index,1);
                        }
                    }else if(index != -1){
                        //price exists
                        asksAfterUpdate[index] = [price,quantity];
                    }else{
                        //new price
                        asksAfterUpdate.push([price,quantity]);
                    }
                }
                asksAfterUpdate.sort(
                    (a,b) => Number(a[0]) - Number(b[0])
                );
                return asksAfterUpdate; 
            });
               }
            },
            "DEPTH_TATA_INR"
         )



          manager.sendMessage({
            method: 'SUBSCRIBE',
            params: ['depth@TATA_INR']
          });
        return () => {
            manager.sendMessage({method: 'UNSUBSCRIBE',params: ['depth@TATA_INR']});
            manager.deregisterCallback("depth","DEPTH_TATA_INR");
        }
    },[])
    return (
        <div>
           {asks && <AskTable asks = {asks}/>}
           {bids && <BidsTable bids= {bids}/>}
           <div>{price}</div>
         </div>
    )
}