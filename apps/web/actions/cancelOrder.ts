"use server";

import axios from "axios";

import {
  getCurrentUserId,
} from "@/lib/auth/getCurrentUser";

type CancelOrderInput = {
  orderId: string;
  market: string;
};

type CancelOrderResponse = {
  success?: string;
  error?: string;
};

const cancelOrder =
  async ({
    orderId,
    market,
  }: CancelOrderInput):
    Promise<CancelOrderResponse> => {

    const userId =
      await getCurrentUserId();

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/orderRouter/order`,
        {
          headers: {
            "x-user-id":
              userId,
          },

          data: {
            orderId,
            market,
          },
        }
      );

      return {
        success:
          "Order cancelled successfully",
      };

    } catch (error) {

      if (
        axios.isAxiosError(
          error
        )
      ) {
        return {
          error:
            error.response
              ?.data?.error ??
            "Failed to cancel order",
        };
      }

      return {
        error:
          "Failed to cancel order",
      };
    }
  };

export default cancelOrder;