"use client";

import {
  getKLines,
} from "@/lib/exchange/api";

import {
  SignallingManager,
} from "@/lib/exchange/SignallingManager";

import {
  useEffect,
  useState,
} from "react";

type MarketStats = {
  open: number | null;
  lastPrice: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
};

const MarketBar = () => {
  const [
    stats,
    setStats,
  ] = useState<MarketStats>({
    open: null,
    lastPrice: null,
    high: null,
    low: null,
    volume: null,
  });


  /* =========================
      INITIAL 24H DATA
  ========================= */

  useEffect(() => {
    const loadStats =
      async () => {
        const endTime =
          Math.floor(
            Date.now() / 1000
          );

        const startTime =
          endTime -
          24 * 60 * 60;

        const klines =
          await getKLines(
            "TATA_INR",
            "1m",
            startTime,
            endTime
          );

        if (!klines.length) {
          return;
        }


        const first =
          klines[0];

        const last =
          klines[
            klines.length - 1
          ];

        if (!first || !last) {
          return;
        }


        const high =
          Math.max(
            ...klines.map(
              (k) =>
                Number(k.high)
            )
          );

        const low =
          Math.min(
            ...klines.map(
              (k) =>
                Number(k.low)
            )
          );

        const volume =
          klines.reduce(
            (total, k) =>
              total +
              Number(
                k.volume
              ),
            0
          );


        setStats({
          open:
            Number(
              first.open
            ),

          lastPrice:
            Number(
              last.close
            ),

          high,

          low,

          volume,
        });
      };

    loadStats();
  }, []);


  /* =========================
         LIVE TRADES
  ========================= */

  useEffect(() => {
    const manager =
      SignallingManager
        .getInstance();


    manager.registerCallback(
      "trade",

      (data) => {
        const price =
          Number(
            data.price ??
              data.data?.price
          );

        const quantity =
          Number(
            data.executedQuantity ??
              data.data
                ?.executedQuantity ??
              0
          );


        if (
          Number.isNaN(price)
        ) {
          return;
        }


        setStats(
          (previous) => ({
            ...previous,

            lastPrice:
              price,

            high:
              previous.high ===
              null
                ? price
                : Math.max(
                    previous.high,
                    price
                  ),

            low:
              previous.low ===
              null
                ? price
                : Math.min(
                    previous.low,
                    price
                  ),

            volume:
              previous.volume ===
              null
                ? quantity
                : previous.volume +
                  quantity,
          })
        );
      },

      "MARKET_BAR_TRADE"
    );


    manager.sendMessage({
      method: "SUBSCRIBE",

      params: [
        "trade@TATA_INR",
      ],
    });


    return () => {
      manager.sendMessage({
        method:
          "UNSUBSCRIBE",

        params: [
          "trade@TATA_INR",
        ],
      });

      manager.deregisterCallback(
        "trade",
        "MARKET_BAR_TRADE"
      );
    };
  }, []);


  const change =
    stats.open !== null &&
    stats.lastPrice !== null
      ? stats.lastPrice -
        stats.open
      : null;


  const changePercentage =
    change !== null &&
    stats.open
      ? (change /
          stats.open) *
        100
      : null;


  return (
    <div
      className="
        flex
        min-h-20
        w-full
        items-center
        gap-8
        overflow-x-auto
        bg-[#101219]
        px-5
        [&::-webkit-scrollbar]:hidden
      "
    >

      {/* MARKET */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-3
        "
      >

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#1b1e25]
            font-semibold
          "
        >
          T
        </div>


        <div>
          <p className="font-semibold">
            TATA / INR
          </p>

          <p
            className="
              mt-1
              text-[11px]
              text-zinc-500
            "
          >
            Spot
          </p>
        </div>

      </div>


      {/* LAST PRICE */}

      {stats.lastPrice !==
        null && (
        <MarketStat
          label="Last Price"
          value={`₹${stats.lastPrice.toLocaleString()}`}
        />
      )}


      {/* CHANGE */}

      {change !== null &&
        changePercentage !==
          null && (
          <MarketStat
            label="24H Change"
            value={`${change >= 0 ? "+" : ""}${change.toFixed(2)}`}
            secondary={`${changePercentage >= 0 ? "+" : ""}${changePercentage.toFixed(2)}%`}
            positive={
              change >= 0
            }
          />
        )}


      {/* HIGH */}

      {stats.high !== null && (
        <MarketStat
          label="24H High"
          value={`₹${stats.high.toLocaleString()}`}
        />
      )}


      {/* LOW */}

      {stats.low !== null && (
        <MarketStat
          label="24H Low"
          value={`₹${stats.low.toLocaleString()}`}
        />
      )}


      {/* VOLUME */}

      {stats.volume !==
        null && (
        <MarketStat
          label="24H Volume"
          value={`${stats.volume.toLocaleString()} TATA`}
        />
      )}

    </div>
  );
};

export default MarketBar;

const MarketStat = ({
  label,
  value,
  secondary,
  positive,
}: {
  label: string;
  value: string;
  secondary?: string;
  positive?: boolean;
}) => {
  const dynamicColor =
    positive === undefined
      ? "text-zinc-200"
      : positive
        ? "text-emerald-400"
        : "text-red-400";

  return (
    <div className="shrink-0">

      <p
        className="
          text-[10px]
          text-zinc-500
        "
      >
        {label}
      </p>

      <div
        className="
          mt-1
          flex
          gap-2
          whitespace-nowrap
        "
      >
        <span
          className={`
            text-sm
            font-medium
            ${dynamicColor}
          `}
        >
          {value}
        </span>

        {secondary && (
          <span
            className={`
              text-xs
              ${dynamicColor}
            `}
          >
            {secondary}
          </span>
        )}

      </div>

    </div>
  );
};