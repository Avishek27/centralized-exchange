"use client";

import getBalance, { type UserBalances, } from "@/actions/getBalance";

import {
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";
import BalanceActionForm from "./balanceActionForm";



type Mode =
  | "deposit"
  | "withdraw";

interface BalanceModalProps {
  open: boolean;
  mode: Mode;
  onClose: () => void;
}

const BalanceModal = ({
  open,
  mode,
  onClose,
}: BalanceModalProps) => {
  const [mounted, setMounted] =
    useState(false);

  const [balance, setBalance] =
    useState<UserBalances | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (!open) return;

    const loadBalance =
      async () => {
        setLoading(true);

        try {
          const response =
            await getBalance();

          setBalance(
            response
          );
        } finally {
          setLoading(false);
        }
      };

    loadBalance();
  }, [open]);


  /* ESC CLOSE */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    open,
    onClose,
  ]);


  if (
    !mounted ||
    !open
  ) {
    return null;
  }


  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-md
      "
      onMouseDown={
        onClose
      }
    >

      {/* MODAL */}

      <div
        onMouseDown={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          w-full
          max-w-[440px]
          rounded-3xl
          border
          border-white/[0.08]
          bg-[#0f1117]
          p-6
          shadow-[0_30px_100px_rgba(0,0,0,0.7)]
        "
      >

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
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
          "
        >
          <X size={19} />
        </button>


        {/* TITLE */}

        <div className="mb-7">

          <h2 className="text-xl font-semibold">
            {mode ===
            "deposit"
              ? "Deposit"
              : "Withdraw"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Manage your Finora
            account balance.
          </p>

        </div>


        {loading && (
          <div
            className="
              py-20
              text-center
              text-sm
              text-zinc-500
            "
          >
            Loading balance...
          </div>
        )}


        {!loading &&
          balance && (
            <BalanceActionForm
              balances={
                balance.balances
              }
              initialMode={
                mode
              }
              onSuccess={
                async () => {
                  const updated =
                    await getBalance();

                  setBalance(
                    updated
                  );
                }
              }
            />
          )}

      </div>

    </div>,
    document.body
  );
};

export default BalanceModal;