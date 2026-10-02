"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import cancelOrder from "@/actions/cancelOrder";
import { OpenOrder } from "@/lib/exchange/types";
import CancelOrderDialog from "./cancelOrderDialog";



interface OpenOrdersTableProps {
  initialOrders:
    OpenOrder[];
}

const OpenOrdersTable = ({
  initialOrders,
}: OpenOrdersTableProps) => {

  const router =
    useRouter();

  const [
    orders,
    setOrders,
  ] = useState(
    initialOrders
  );
  const [
  selectedOrder,
  setSelectedOrder,
] = useState<OpenOrder | null>(null);

  const [
    cancellingId,
    setCancellingId,
  ] = useState<
    string | null
  >(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();


  const handleCancel =
  async () => {
    if (!selectedOrder) {
      return;
    }

    const order =
      selectedOrder;

    setError("");

    setCancellingId(
      order.orderId
    );

    startTransition(
      async () => {
        const response =
          await cancelOrder({
            orderId:
              order.orderId,

            market:
              order.market,
          });

        if (response.error) {
          setError(
            response.error
          );

          setCancellingId(
            null
          );

          return;
        }

        setOrders(
          (current) =>
            current.filter(
              (item) =>
                item.orderId !==
                order.orderId
            )
        );

        setSelectedOrder(
          null
        );

        setCancellingId(
          null
        );

        router.refresh();
      }
    );
  };


  if (
    orders.length === 0
  ) {
    return (
      <div
        className="
          flex
          min-h-[300px]
          items-center
          justify-center
          rounded-2xl
          border
          border-white/[0.06]
          bg-[#101219]
        "
      >
        <div className="text-center">

          <p
            className="
              text-sm
              font-medium
              text-zinc-300
            "
          >
            No open orders
          </p>

          <p
            className="
              mt-2
              text-sm
              text-zinc-600
            "
          >
            Your active orders
            will appear here.
          </p>

        </div>
      </div>
    );
  }


  return (
    <div>

      {error && (
        <div
          className="
            mb-4
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-400
          "
        >
          {error}
        </div>
      )}


      <div
        className="
          overflow-x-auto
          rounded-2xl
          border
          border-white/[0.06]
          bg-[#101219]
        "
      >
        <table
          className="
            w-full
            min-w-[850px]
            border-collapse
          "
        >

          <thead>
            <tr
              className="
                border-b
                border-white/[0.06]
                text-left
                text-xs
                text-zinc-500
              "
            >

              <th className="px-5 py-4">
                Market
              </th>

              <th className="px-5 py-4">
                Side
              </th>

              <th className="px-5 py-4">
                Price
              </th>

              <th className="px-5 py-4">
                Quantity
              </th>

              <th className="px-5 py-4">
                Filled
              </th>

              <th className="px-5 py-4">
                Remaining
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-right
                "
              >
                Action
              </th>

            </tr>
          </thead>


          <tbody>

            {orders.map(
              (order) => {

                const quantity =
                  Number(
                    order.quantity
                  );

                const filled =
                  Number(
                    order.filled ??
                      0
                  );

                const remaining =
                  quantity -
                  filled;

                const isCancelling =
                  isPending &&
                  cancellingId ===
                    order.orderId;


                return (
                  <tr
                    key={
                      order.orderId
                    }
                    className="
                      border-b
                      border-white/[0.04]
                      last:border-b-0
                      hover:bg-white/[0.02]
                    "
                  >

                    {/* MARKET */}

                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                        font-medium
                      "
                    >
                      {order.market.replace(
                        "_",
                        " / "
                      )}
                    </td>


                    {/* SIDE */}

                    <td
                      className="
                        px-5
                        py-4
                      "
                    >
                      <span
                        className={`
                          rounded-md
                          px-2
                          py-1
                          text-xs
                          font-semibold

                          ${
                            order.side ===
                            "buy"
                              ? `
                                bg-emerald-500/10
                                text-emerald-400
                              `
                              : `
                                bg-red-500/10
                                text-red-400
                              `
                          }
                        `}
                      >
                        {order.side
                          .toUpperCase()}
                      </span>
                    </td>


                    {/* PRICE */}

                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                      "
                    >
                      ₹
                      {Number(
                        order.price
                      ).toLocaleString()}
                    </td>


                    {/* QUANTITY */}

                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                      "
                    >
                      {quantity}
                      {" "}
                      TATA
                    </td>


                    {/* FILLED */}

                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                        text-zinc-400
                      "
                    >
                      {filled}
                      {" "}
                      TATA
                    </td>


                    {/* REMAINING */}

                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                        text-zinc-400
                      "
                    >
                      {remaining}
                      {" "}
                      TATA
                    </td>


                    {/* CANCEL */}

                    <td
                      className="
                        px-5
                        py-4
                        text-right
                      "
                    >

                      <button
                        type="button"

                        disabled={
                          isCancelling
                        }

                        onClick={() =>
  setSelectedOrder(order)
}

                        className="
                          rounded-lg
                          border
                          border-red-500/20
                          bg-red-500/10
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-red-400
                          transition

                          hover:bg-red-500/20

                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isCancelling
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>
      </div>
     <CancelOrderDialog
  order={selectedOrder}
  loading={
    isPending &&
    cancellingId ===
      selectedOrder?.orderId
  }
  onClose={() => {
    if (!isPending) {
      setSelectedOrder(null);
    }
  }}
  onConfirm={handleCancel}
/>
    </div>
  );
};

export default OpenOrdersTable;