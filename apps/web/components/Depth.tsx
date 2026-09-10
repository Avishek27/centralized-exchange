import { getDepth } from "@/lib/exchange/api"




export const DepthComponent = async () =>{
    const data = await getDepth('TATA_INR');
    return (
        <div>
           {JSON.stringify(data)}
         </div>
    )
}