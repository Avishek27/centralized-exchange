"use client";

import onRamp from "@/actions/onRamp";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Mode = "deposit" | "withdraw";
type Asset = "INR" | "TATA";

type Balances = {
  INR: {
    available: number;
    lockedOut: number;
  };
  TATA: {
    available: number;
    lockedOut: number;
  };
};

interface BalanceActionFormProps {
  balances: Balances;
  initialMode?: Mode;
  onSuccess?: () => void;
}

const BalanceActionForm = ({
  balances,
  initialMode = "deposit",
  onSuccess,
}: BalanceActionFormProps) => {
  const router = useRouter();

  const [mode, setMode] =
    useState<Mode>(initialMode);

  const [asset, setAsset] =
    useState<Asset>("INR");

  const [amount, setAmount] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  const available =
    asset === "INR"
      ? balances.INR.available
      : balances.TATA.available;

  const locked =
    asset === "INR"
      ? balances.INR.lockedOut
      : balances.TATA.lockedOut;

  const handleSubmit = () => {
    setError("");
    setSuccess("");

    const numericAmount =
      Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setError("Enter a valid amount");
      return;
    }

    if (
      mode === "withdraw" &&
      numericAmount > available
    ) {
      setError(
        `Insufficient available ${asset} balance`
      );

      return;
    }

    startTransition(async () => {
      if (mode === "deposit") {
        const response =
          await onRamp({
            asset,
            amount: numericAmount,
          });

        if (response.error) {
          setError(response.error);
          return;
        }

        setSuccess(
          response.success ??
            "Balance added successfully"
        );

        setAmount("");

        router.refresh();

        onSuccess?.();

        return;
      }

      /*
        WITHDRAW:

        const response = await withdraw({
          asset,
          amount: numericAmount
        });
      */

      setError(
        "Withdrawal backend is not implemented yet"
      );
    });
  };

  return (
    <div className="w-full">

      {/* DEPOSIT / WITHDRAW TABS */}

      <div
        className="
          mb-7
          grid
          grid-cols-2
          rounded-xl
          bg-[#15181f]
          p-1
        "
      >
        <button
          type="button"
          onClick={() => {
            setMode("deposit");
            setError("");
            setSuccess("");
          }}
          className={`
            rounded-lg
            py-2.5
            text-sm
            font-medium
            transition

            ${
              mode === "deposit"
                ? "bg-[#24272f] text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }
          `}
        >
          Deposit
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("withdraw");
            setError("");
            setSuccess("");
          }}
          className={`
            rounded-lg
            py-2.5
            text-sm
            font-medium
            transition

            ${
              mode === "withdraw"
                ? "bg-[#24272f] text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }
          `}
        >
          Withdraw
        </button>
      </div>


      {/* ASSET */}

      <div className="mb-5">
        <p className="mb-2 text-sm text-zinc-500">
          Asset
        </p>

        <div className="grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={() =>
              setAsset("INR")
            }
            className={`
              rounded-xl
              border
              py-3
              text-sm
              font-medium
              transition

              ${
                asset === "INR"
                  ? `
                    border-emerald-500/30
                    bg-emerald-500/10
                    text-emerald-400
                  `
                  : `
                    border-white/[0.06]
                    bg-[#171a21]
                    text-zinc-400
                  `
              }
            `}
          >
            INR
          </button>

          <button
            type="button"
            onClick={() =>
              setAsset("TATA")
            }
            className={`
              rounded-xl
              border
              py-3
              text-sm
              font-medium
              transition

              ${
                asset === "TATA"
                  ? `
                    border-emerald-500/30
                    bg-emerald-500/10
                    text-emerald-400
                  `
                  : `
                    border-white/[0.06]
                    bg-[#171a21]
                    text-zinc-400
                  `
              }
            `}
          >
            TATA
          </button>

        </div>
      </div>


      {/* BALANCE INFORMATION */}

      <div
        className="
          mb-5
          rounded-xl
          border
          border-white/[0.05]
          bg-[#15181f]
          px-4
          py-4
        "
      >
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">
            Available
          </span>

          <span>
            {asset === "INR"
              ? `₹${available.toLocaleString()}`
              : `${available.toLocaleString()} TATA`}
          </span>
        </div>

        <div className="mt-3 flex justify-between text-sm">
          <span className="text-zinc-500">
            Locked
          </span>

          <span className="text-zinc-400">
            {asset === "INR"
              ? `₹${locked.toLocaleString()}`
              : `${locked.toLocaleString()} TATA`}
          </span>
        </div>
      </div>


      {/* AMOUNT */}

      <div className="mb-5">
        <label
          htmlFor="balance-amount"
          className="mb-2 block text-sm text-zinc-500"
        >
          Amount
        </label>

        <div
          className="
            flex
            items-center
            rounded-xl
            bg-[#191c23]
            px-4
            focus-within:ring-1
            focus-within:ring-white/15
          "
        >
          <input
            id="balance-amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="0"
            className="
              min-w-0
              flex-1
              bg-transparent
              py-4
              text-lg
              outline-none
              placeholder:text-zinc-600
            "
          />

          <span className="ml-3 text-sm font-semibold text-zinc-400">
            {asset}
          </span>
        </div>
      </div>


      {/* QUICK VALUES */}

      <div className="mb-5 grid grid-cols-4 gap-2">
        {[25, 50, 75, 100].map(
          (percent) => (
            <button
              type="button"
              key={percent}
              onClick={() => {
                if (
                  mode === "withdraw"
                ) {
                  setAmount(
                    (
                      available *
                      (percent /
                        100)
                    ).toString()
                  );
                }
              }}
              className="
                rounded-lg
                bg-[#171a21]
                py-2
                text-xs
                text-zinc-500
                transition
                hover:bg-[#20232b]
                hover:text-white
              "
            >
              {percent}%
            </button>
          )
        )}
      </div>


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

      {success && (
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
          {success}
        </div>
      )}


      {/* SUBMIT */}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className={`
          w-full
          rounded-xl
          py-3.5
          text-sm
          font-semibold
          transition
          disabled:opacity-50

          ${
            mode === "deposit"
              ? `
                bg-emerald-500
                text-black
                hover:bg-emerald-400
              `
              : `
                bg-blue-500
                text-white
                hover:bg-blue-400
              `
          }
        `}
      >
        {isPending
          ? "Processing..."
          : mode === "deposit"
            ? `Deposit ${asset}`
            : `Withdraw ${asset}`}
      </button>

    </div>
  );
};

export default BalanceActionForm;