"use server";

import { getCurrentUserId } from "@/lib/auth/getCurrentUser";
import axios from "axios";

type CreateOrderInput = {
  market: string;
  price: string;
  quantity: string;
  side: "buy" | "sell";
};

type CreateOrderResponse = {
  success?: string;
  error?: string;
};

const createOrderAction = async (order: CreateOrderInput): Promise<CreateOrderResponse> => {
  
  const userId = await getCurrentUserId();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/orderRouter/create`,
      {
        market: order.market,
        price: order.price,
        quantity: order.quantity,
        side: order.side,
      },
      {
        headers: {
          "x-user-id": userId,
        },
      }
    );

    return {
      success: "Order placed successfully",
    };
  } catch (error) {
    console.error("Create order error:", error);
    if(axios.isAxiosError(error)){
      return {
        error: error.response?.data.error ?? "Failed to place order"
      }
    }

    return {
      error: "Failed to place order",
    };
  }
};

export default createOrderAction;