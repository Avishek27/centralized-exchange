"use client";

import { OpenOrder } from "@/lib/exchange/types";
import { X } from "lucide-react";


interface CancelOrderDialogProps {
  order: OpenOrder | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelOrderDialog = ({
  order,
  loading = false,
  onClose,
  onConfirm,
}: CancelOrderDialogProps) => {
  if (!order) {
    return null;
  }

  const remaining =
    Number(order.quantity) -
    Number(order.filled ?? 0);

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/60
        px-4
        backdrop-blur-sm
      "
      onMouseDown={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <div
        onMouseDown={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          w-full
          max-w-[420px]
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#111319]
          p-6
          shadow-[0_30px_100px_rgba(0,0,0,0.7)]
        "
      >
        {/* CLOSE */}

        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-zinc-500
            transition
            hover:bg-white/[0.05]
            hover:text-white
            disabled:cursor-not-allowed
          "
        >
          <X size={18} />
        </button>

        {/* TITLE */}

        <h2 className="text-lg font-semibold">
          Cancel order?
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          This will remove the order from the order book
          and release the remaining locked funds.
        </p>

        {/* ORDER DETAILS */}

        <div
          className="
            mt-6
            rounded-xl
            border
            border-white/[0.06]
            bg-[#171a21]
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">
                Market
              </p>

              <p className="mt-1 text-sm font-medium">
                {(order.market ?? "TATA_INR").replace(
                  "_",
                  " / "
                )}
              </p>
            </div>

            <span
              className={`
                rounded-md
                px-2.5
                py-1
                text-xs
                font-semibold

                ${
                  order.side === "buy"
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
              {order.side.toUpperCase()}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-zinc-500">
                Price
              </p>

              <p className="mt-1 text-sm">
                ₹
                {Number(
                  order.price
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Quantity
              </p>

              <p className="mt-1 text-sm">
                {Number(order.quantity)}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Remaining
              </p>

              <p className="mt-1 text-sm">
                {remaining}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              rounded-xl
              border
              border-white/[0.08]
              px-4
              py-2.5
              text-sm
              text-zinc-300
              transition
              hover:bg-white/[0.05]
              disabled:opacity-50
            "
          >
            Keep Order
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="
              rounded-xl
              bg-red-500
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderDialog;