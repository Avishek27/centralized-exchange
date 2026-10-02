"use client";

import { getDepth } from "@/lib/exchange/api";
import { SignallingManager } from "@/lib/exchange/SignallingManager";
import { useEffect, useRef, useState } from "react";
import { getKLines } from "@/lib/exchange/api";
import AskTable from "./AskTable";
import BidsTable from "./BidsTable";

export const DepthComponent = () => {
  const [bids, setBids] = useState<[string, string][]>([]);
  const [asks, setAsks] = useState<[string, string][]>([]);

  const [lastPrice, setLastPrice] = useState<number | null>(null);

  const [priceDirection, setPriceDirection] =
    useState<"up" | "down" | null>(null);

  const previousPriceRef = useRef<number | null>(null);

  /* =========================
      INITIAL DEPTH
  ========================= */

//   useEffect(() => {
//     const fetchDepth = async () => {
//       const response = await getDepth("TATA_INR");

//       setBids(response.bids);
//       setAsks(response.asks);
//     };

//     fetchDepth();
//   }, []);
useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const depthResponse =
        await getDepth("TATA_INR");

      setBids(depthResponse.bids);
      setAsks(depthResponse.asks);


      // Get recent Klines
      const endTime =
        Math.floor(Date.now() / 1000);

      const startTime =
        endTime - 60 * 60 * 24;


      const klines =
        await getKLines(
          "TATA_INR",
          "1m",
          startTime,
          endTime
        );


      if (klines.length > 0) {
        const latestKline =
          klines[klines.length - 1];

        if (latestKline) {
          const initialPrice =
            Number(latestKline.close);

          setLastPrice(
            initialPrice
          );

          previousPriceRef.current =
            initialPrice;
        }
      }

    } catch (error) {
      console.error(
        "Failed to load order book:",
        error
      );
    }
  };

  fetchInitialData();
}, []);

  /* =========================
        WEBSOCKET
  ========================= */

  useEffect(() => {
    const manager = SignallingManager.getInstance();

    /* DEPTH */

    manager.registerCallback(
      "depth",
      (data) => {
        if (data.bids) {
          setBids((originalBids) => {
            const updated = [...originalBids];

            for (const [price, quantity] of data.bids) {
              const index = updated.findIndex(
                ([existingPrice]) => existingPrice === price
              );

              if (quantity === "0") {
                if (index !== -1) {
                  updated.splice(index, 1);
                }
              } else if (index !== -1) {
                updated[index] = [price, quantity];
              } else {
                updated.push([price, quantity]);
              }
            }

            updated.sort(
              (a, b) => Number(b[0]) - Number(a[0])
            );

            return updated;
          });
        }

        if (data.asks) {
          setAsks((originalAsks) => {
            const updated = [...originalAsks];

            for (const [price, quantity] of data.asks) {
              const index = updated.findIndex(
                ([existingPrice]) => existingPrice === price
              );

              if (quantity === "0") {
                if (index !== -1) {
                  updated.splice(index, 1);
                }
              } else if (index !== -1) {
                updated[index] = [price, quantity];
              } else {
                updated.push([price, quantity]);
              }
            }

            updated.sort(
              (a, b) => Number(a[0]) - Number(b[0])
            );

            return updated;
          });
        }
      },
      "DEPTH_TATA_INR"
    );

    /* LAST TRADE */

    manager.registerCallback(
      "trade",
      (data) => {
        const newPrice = Number(
          data.price ?? data.data?.price
        );

        if (Number.isNaN(newPrice)) {
          return;
        }

        const previousPrice = previousPriceRef.current;

        if (previousPrice !== null) {
          if (newPrice > previousPrice) {
            setPriceDirection("up");
          } else if (newPrice < previousPrice) {
            setPriceDirection("down");
          }
        }

        previousPriceRef.current = newPrice;

        setLastPrice(newPrice);
      },
      "TRADE_DEPTH_TATA_INR"
    );

    manager.sendMessage({
      method: "SUBSCRIBE",
      params: [
        "depth@TATA_INR",
        "trade@TATA_INR",
      ],
    });

    return () => {
      manager.sendMessage({
        method: "UNSUBSCRIBE",
        params: [
          "depth@TATA_INR",
          "trade@TATA_INR",
        ],
      });

      manager.deregisterCallback(
        "depth",
        "DEPTH_TATA_INR"
      );

      manager.deregisterCallback(
        "trade",
        "TRADE_DEPTH_TATA_INR"
      );
    };
  }, []);

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        min-w-0
        flex-col
        overflow-hidden
        bg-[#101219]
        text-white
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          h-14
          shrink-0
          items-center
          gap-5
          border-b
          border-white/[0.06]
          px-4
        "
      >
        <button
          className="
            rounded-lg
            bg-[#1c1f26]
            px-4
            py-2
            text-sm
            font-medium
          "
        >
          Book
        </button>

        <button className="text-sm text-zinc-500">
          Trades
        </button>
      </div>

      {/* COLUMN HEADERS */}

      <div
        className="
          grid
          grid-cols-3
          px-4
          py-3
          text-xs
          text-zinc-500
        "
      >
        <span>Price (INR)</span>

        <span className="text-right">
          Size (TATA)
        </span>

        <span className="text-right">
          Total
        </span>
      </div>

      {/* ASKS */}

      <AskTable asks={asks} />

      {/* LAST TRADED PRICE */}

      <div
        className="
          flex
          h-14
          shrink-0
          items-center
          border-y
          border-white/[0.06]
          px-4
        "
      >
        <span
          className={`
            text-lg
            font-semibold

            ${
              priceDirection === "up"
                ? "text-emerald-400"
                : priceDirection === "down"
                ? "text-red-400"
                : "text-zinc-200"
            }
          `}
        >
          {lastPrice !== null
            ? `₹${lastPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "--"}
        </span>

        {priceDirection === "up" && (
          <span className="ml-2 text-emerald-400">
            ↑
          </span>
        )}

        {priceDirection === "down" && (
          <span className="ml-2 text-red-400">
            ↓
          </span>
        )}

        <span className="ml-auto text-xs text-zinc-500">
          Last traded price
        </span>
      </div>

      {/* BIDS */}

      <BidsTable bids={bids} />

    </div>
  );
};