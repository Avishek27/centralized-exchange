"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card,CardContent,CardHeader,CardFooter} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { createOrder } from "@/lib/exchange/api";
import { Order } from "@/lib/exchange/types";
interface orderForm {
  price: string,
  quantity: string,
  userId: string,
}

const SwapUI = () => {
    
    const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: {errors,isSubmitting }
    } =  useForm<orderForm>();

    const [side,setSide] = useState<"buy" | "sell">("buy");
    const price = watch("price");
    const quantity = watch("quantity");

    const total = Number(price || 0) * Number(quantity || 0);
    
    const onSubmit = async(data: orderForm) => {
        console.log({
          ...data,
          side,
          market: "TATA_INR",
        });
        const order: Order = {
            market: "TATA_INR",
            price: data.price,
            quantity: data.quantity,
            userId: data.userId,
            side,
        }
        const response = await createOrder(order);
        console.log(response);
    }

    return (
       <Card className="w-full h-full">
        <CardHeader>
            <div className="flex w-full">
              <button
    type="button"
    onClick={() => setSide("buy")}
    className={`w-1/2 p-2 rounded-md border transition ${
      side === "buy"
        ? "bg-green-600 text-white border-green-600"
        : "bg-transparent text-green-600 border-green-600"
    }`}
  >
    Buy
  </button>

  <button
    type="button"
    onClick={() => setSide("sell")}
    className={`w-1/2 p-2 rounded-md border transition ${
      side === "sell"
        ? "bg-red-600 text-white border-red-600"
        : "bg-transparent text-red-600 border-red-600"
    }`}
  >
    Sell
  </button>
            </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <div>
                    <label>Price</label>
                    <input
                    {...register("price", {required: "Price is required",})}
                    placeholder="Enter price"
                    className="w-full border p-2"
                    />

                    {errors.price && (
                        <p>{errors.price.message}</p>
                    )}
                </div>
                 <div>
                    <label>Quantity</label>
                    <input
                    {...register("quantity", {required: "Quantity is required",})}
                    placeholder="Enter quantity"
                    className="w-full border p-2"
                    />

                    {errors.quantity && (
                        <p>{errors.quantity.message}</p>
                    )}
                </div>
                <div>
                    <label>UserId</label>
                    <input
                    {...register("userId", {required: "UserID is required",})}
                    placeholder="buyer1/seller1"
                    className="w-full border p-2"
                    />

                    {errors.userId && (
                        <p>{errors.userId.message}</p>
                    )}
                </div>
                    <div className="flex justify-between">
                        <span>Total</span>
                        <span>₹ {total.toFixed(2)}</span>
                    </div>
            </CardContent>
            <CardFooter>
                    <Button type="submit" disabled={isSubmitting} className={`w-full p-3 text-white ${side === "buy"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}>
                     {side === "buy" ? "BUY TATA" : "SELL TATA"}
                </Button>
            </CardFooter>
        </form>
       </Card>
    )
}

export default SwapUI;