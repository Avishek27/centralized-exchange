"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import { Order } from "@/lib/exchange/types";
import { useRouter } from "next/navigation";
import createOrderAction from "@/actions/createOrder";

interface OrderForm {
  price: string;
  quantity: string;
}

interface SwapUIProps {
  balances?: {
    INR: {
      available: number;
      lockedOut: number;
    };
    TATA: {
      available: number;
      lockedOut: number;
    };
  };
}

const SwapUI = ({ balances }: SwapUIProps) => {

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"limit" | "market" | "conditional">("limit");
  const [percentage, setPercentage] = useState(0);
  const [orderError,setOrderError] = useState<string>("");
  const [orderSuccess,setOrderSuccess] = useState<string>("");


  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<OrderForm>({
    defaultValues: {
      price: "",
      quantity: "",
    },
  });

  const price = watch("price");
  const quantity = watch("quantity");

  const numericPrice = Number(price || 0);

  const numericQuantity = Number(quantity || 0);

  const total = numericPrice * numericQuantity;

  const availableBalance =
    side === "buy"
      ? balances?.INR.available ?? 0
      : balances?.TATA.available ?? 0;

  const lockedBalance =
    side === "buy"
      ? balances?.INR.lockedOut ?? 0
      : balances?.TATA.lockedOut ?? 0;


  /* =========================
        SLIDER
  ========================= */

  const handlePercentageChange = (
    value: number
  ) => {
    setPercentage(value);

    if (side === "buy") {
      if (!numericPrice) {
        return;
      }

      const amountToUse =
        availableBalance *
        (value / 100);

      const calculatedQuantity =
        amountToUse /
        numericPrice;

      setValue(
        "quantity",
        calculatedQuantity
          .toFixed(4)
      );
    } else {
      const calculatedQuantity =
        availableBalance *
        (value / 100);

      setValue(
        "quantity",
        calculatedQuantity
          .toFixed(4)
      );
    }
  };


  /* =========================
        SUBMIT
  ========================= */

 const onSubmit = async (data: OrderForm) => {
  setOrderError("");
  setOrderSuccess("");

  const response =
    await createOrderAction({
      market: "TATA_INR",
      price: data.price,
      quantity: data.quantity,
      side,
    });

  if (response.error) {
    setOrderError(response.error);
    return;
  }

  if (response.success) {
    setOrderSuccess(response.success);

    reset();
    setPercentage(0);

    router.refresh();
  }
};



  return (
    <div
      className="
        flex
        h-full
        w-full
        flex-col
        bg-[#101219]
        text-white
      "
    >

      {/* =========================
            BUY / SELL
      ========================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-2
          border-b
          border-white/6
          p-4
        "
      >

        <button
          type="button"
          onClick={() => {
            setSide("buy");
            setPercentage(0);
            setValue(
              "quantity",
              ""
            );
          }}
          className={`
            rounded-xl
            py-3
            text-sm
            font-semibold
            transition-all

            ${
              side === "buy"
                ? `
                  bg-emerald-500/15
                  text-emerald-400
                `
                : `
                  bg-[#161920]
                  text-zinc-500
                  hover:text-zinc-300
                `
            }
          `}
        >
          Buy / Long
        </button>


        <button
          type="button"
          onClick={() => {
            setSide("sell");
            setPercentage(0);
            setValue(
              "quantity",
              ""
            );
          }}
          className={`
            rounded-xl
            py-3
            text-sm
            font-semibold
            transition-all

            ${
              side === "sell"
                ? `
                  bg-red-500/15
                  text-red-400
                `
                : `
                  bg-[#161920]
                  text-zinc-500
                  hover:text-zinc-300
                `
            }
          `}
        >
          Sell / Short
        </button>

      </div>


      {/* =========================
            ORDER TYPES
      ========================= */}

      <div
        className="
          flex
          items-center
          gap-6
          border-b
          border-white/6
          px-4
          py-4
        "
      >

        {[
          "limit",
          "market",
          "conditional",
        ].map((type) => {

          const active =
            orderType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() =>
                setOrderType(
                  type as
                    | "limit"
                    | "market"
                    | "conditional"
                )
              }
              className={`
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                capitalize
                transition

                ${
                  active
                    ? `
                      bg-[#1d2027]
                      text-white
                    `
                    : `
                      text-zinc-500
                      hover:text-zinc-300
                    `
                }
              `}
            >
              {type}
            </button>
          );

        })}

      </div>


      {/* =========================
            FORM
      ========================= */}

      <form
        onSubmit={
          handleSubmit(
            onSubmit
          )
        }
        className="
          flex
          flex-1
          flex-col
          p-4
        "
      >

        {/* Available */}
        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            text-sm
          "
        >

          <span className="text-zinc-500">
            Available
          </span>

          <span className="font-medium">
            {side === "buy"
              ? `₹ ${availableBalance.toLocaleString()}`
              : `${availableBalance.toLocaleString()} TATA`}
          </span>

        </div>


        {/* ================= PRICE ================= */}

        <div className="mb-5">

          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >

            <label
              htmlFor="price"
              className="text-sm text-zinc-500"
            >
              Price
            </label>

            <div className="flex gap-3 text-xs">
              <button
                type="button"
                className="text-blue-400"
              >
                Mid
              </button>

              <button
                type="button"
                className="text-blue-400"
              >
                BBO
              </button>
            </div>

          </div>


          <div
            className="
              flex
              items-center
              rounded-xl
              bg-[#191c23]
              px-4
              transition
              focus-within:ring-1
              focus-within:ring-white/20
            "
          >

            <input
              {...register(
                "price",
                {
                  required:
                    "Price is required",
                  validate: (
                    value
                  ) =>
                    Number(
                      value
                    ) > 0 ||
                    "Price must be greater than 0",
                }
              )}
              id="price"
              type="number"
              step="any"
              placeholder="0"
              className="
                min-w-0
                flex-1
                bg-transparent
                py-4
                text-lg
                font-medium
                outline-none
                placeholder:text-zinc-600
              "
            />

            <span
              className="
                ml-3
                shrink-0
                text-sm
                font-semibold
                text-zinc-400
              "
            >
              INR
            </span>

          </div>

          {errors.price && (
            <p className="mt-1.5 text-xs text-red-400">
              {
                errors.price
                  .message
              }
            </p>
          )}

        </div>


        {/* ================= QUANTITY ================= */}

        <div className="mb-5">

          <label
            htmlFor="quantity"
            className="
              mb-2
              block
              text-sm
              text-zinc-500
            "
          >
            Quantity
          </label>


          <div
            className="
              flex
              items-center
              rounded-xl
              bg-[#191c23]
              px-4
              transition
              focus-within:ring-1
              focus-within:ring-white/20
            "
          >

            <input
              {...register(
                "quantity",
                {
                  required:
                    "Quantity is required",
                  validate: (
                    value
                  ) =>
                    Number(
                      value
                    ) > 0 ||
                    "Quantity must be greater than 0",
                }
              )}
              id="quantity"
              type="number"
              step="any"
              placeholder="0"
              className="
                min-w-0
                flex-1
                bg-transparent
                py-4
                text-lg
                font-medium
                outline-none
                placeholder:text-zinc-600
              "
            />

            <span
              className="
                ml-3
                shrink-0
                text-sm
                font-semibold
                text-zinc-400
              "
            >
              TATA
            </span>

          </div>

          {errors.quantity && (
            <p className="mt-1.5 text-xs text-red-400">
              {
                errors
                  .quantity
                  .message
              }
            </p>
          )}

        </div>


        {/* =========================
                PERCENT SLIDER
        ========================= */}

        <div className="mb-7">

          <input
            type="range"
            min="0"
            max="100"
            step="25"
            value={percentage}
            onChange={(e) =>
              handlePercentageChange(
                Number(
                  e.target
                    .value
                )
              )
            }
            className="
              h-1.5
              w-full
              cursor-pointer
              accent-blue-500
            "
          />


          <div
            className="
              mt-2
              flex
              justify-between
              text-xs
              text-zinc-600
            "
          >
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>
              100%
            </span>
          </div>

        </div>


        {/* =========================
                ORDER VALUE
        ========================= */}

        <div
          className="
            mb-5
            rounded-xl
            bg-[#191c23]
            px-4
            py-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span className="text-sm text-zinc-500">
              Order Value
            </span>

            <span className="font-medium">
              ₹{" "}
              {total.toLocaleString(
                undefined,
                {
                  minimumFractionDigits:
                    2,
                  maximumFractionDigits:
                    2,
                }
              )}
            </span>

          </div>

        </div>


        {/* =========================
              BALANCE DETAILS
        ========================= */}

        <div
          className="
            mb-5
            space-y-3
            border-y
            border-white/6
            py-4
          "
        >

          <div
            className="
              flex
              justify-between
              text-sm
            "
          >
            <span className="text-zinc-500">
              Locked Balance
            </span>

            <span className="text-zinc-300">
              {side === "buy"
                ? `₹ ${lockedBalance.toLocaleString()}`
                : `${lockedBalance.toLocaleString()} TATA`}
            </span>
          </div>


          <div
            className="
              flex
              justify-between
              text-sm
            "
          >
            <span className="text-zinc-500">
              Market
            </span>

            <span className="text-zinc-300">
              TATA / INR
            </span>
          </div>

        </div>


        {/* 

        {/* =========================
              BUY / SELL BUTTON
        ========================= */}
        
        {orderError && (
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
      font-medium
      text-red-400
    "
  >
    {orderError}
  </div>
)}
{orderSuccess && (
  <div
    className="
      mb-4
      rounded-xl
      border
      border-emerald-500/20
      bg-emerald-500/10
      px-4
      py-3
      text-sm
      text-emerald-400
    "
  >
    {orderSuccess}
  </div>
)}

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`
            mt-auto
            w-full
            rounded-xl
            py-6
            text-sm
            font-semibold
            text-black
            transition-all

            ${
              side === "buy"
                ? `
                  bg-emerald-500
                  hover:bg-emerald-400
                `
                : `
                  bg-red-500
                  text-white
                  hover:bg-red-400
                `
            }
          `}
        >
          {isSubmitting
            ? "Placing Order..."
            : side ===
                "buy"
              ? "Buy TATA"
              : "Sell TATA"}
        </Button>

      </form>

    </div>
  );
};

export default SwapUI;