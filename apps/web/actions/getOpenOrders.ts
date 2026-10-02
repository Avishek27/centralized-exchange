"use server";

import axios from "axios";
import { getCurrentUserId } from "@/lib/auth/getCurrentUser";
import { OpenOrder } from "@/lib/exchange/types";

type EngineOpenOrder = {
  orderId: string;
  price: string | number;
  quantity: string | number;
  filled?: number;
  side: "buy" | "sell";
  market?: string;
};

const getOpenOrders = async (
  market = "TATA_INR"
): Promise<OpenOrder[]> => {
  const userId =
    await getCurrentUserId();

  try {
    const response =
      await axios.get<EngineOpenOrder[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/orderRouter/open_order`,
        {
          params: {
            market,
          },

          headers: {
            "x-user-id": userId,
          },
        }
      );

    console.log(
      "OPEN ORDERS:",
      response.data
    );

    return response.data.map(
      (order) => ({
        ...order,

        // Engine may not send market
        market:
          order.market ??
          market,

        filled:
          order.filled ?? 0,
      })
    );
  } catch (error) {
    console.error(
      "Failed to fetch open orders:",
      error
    );

    throw new Error(
      "Failed to fetch open orders"
    );
  }
};

export default getOpenOrders;