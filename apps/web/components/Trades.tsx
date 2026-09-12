"use client"

import { SignallingManager } from "@/lib/exchange/SignallingManager";
import { Trade } from "@/lib/exchange/types";
import { useEffect, useState } from "react";



const TradeComponent = () => {
 //what needs to be shown?
 /**
  * Price: 
  * Quantity:
  * TradeId:
  * market:
  */
 const [trades,setTrades] = useState<Trade[]>([]);
  useEffect(() => {
     const manager = SignallingManager.getInstance();
     manager.registerCallback(
        "trade",
        (data) => {
          setTrades((previousTrades) => [
            data,
            ...previousTrades
          ].slice(0,20));
        },
        'TRADES_TATA_INR'
     );

     manager.sendMessage({
    method: "SUBSCRIBE",
    params: ["trade@TATA_INR"]
  });

  return () => {
    manager.sendMessage({
      method: "UNSUBSCRIBE",
      params: ["trade@TATA_INR"]
    });

    manager.deregisterCallback(
      "trade",
      "TRADES_TATA_INR"
    );
  }
  },[]);

 return (
    <div>
      {trades.map((trade) => (
        <div key = {trade.tradeId}>
           {trade.price} - {trade.executedQuantity}
            </div>
      ))}
    </div>
 )

}


export default TradeComponent;