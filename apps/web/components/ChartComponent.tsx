"use client";

import { useEffect, useRef } from "react";

import {
  createChart,
  CandlestickSeries,
  type UTCTimestamp,
  type ISeriesApi,
} from "lightweight-charts";

import { getKLines } from "@/lib/exchange/api";
import { SignallingManager } from "@/lib/exchange/SignallingManager";
import { Trade } from "@/lib/exchange/types";

type Candle = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
};

const ChartComponent = () => {

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const candleSeriesRef =
    useRef<ISeriesApi<"Candlestick"> | null>(
      null
    );

  const currentCandleRef =
    useRef<Candle | null>(null);


  useEffect(() => {

    if (!containerRef.current) {
      return;
    }

    const container =
      containerRef.current;


    // -------------------------
    // 1. CREATE CHART
    // -------------------------

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
    });


    // -------------------------
    // 2. CREATE CANDLE SERIES
    // -------------------------

    const candleSeries =
      chart.addSeries(CandlestickSeries);

    candleSeriesRef.current =
      candleSeries;


    // -------------------------
    // 3. LOAD HISTORICAL DATA
    // -------------------------

    async function loadKlines() {

      try {

        const endTime =
          Math.floor(Date.now() / 1000);

        const startTime =
          endTime - (7 * 24 * 60 * 60);


        const klines =
          await getKLines(
            "TATA_INR",
            "1m",
            startTime,
            endTime
          );


        const candleData: Candle[] =
          klines.map((kline) => ({
            time:
              kline.start as UTCTimestamp,

            open:
              Number(kline.open),

            high:
              Number(kline.high),

            low:
              Number(kline.low),

            close:
              Number(kline.close),
          }));


        candleSeries.setData(
          candleData
        );


        // Store latest candle

        const lastCandle =
          candleData[
            candleData.length - 1
          ];

        if (lastCandle) {
          currentCandleRef.current =
            lastCandle;
        }


        chart
          .timeScale()
          .fitContent();


        console.log(
          "Historical candles loaded:",
          candleData
        );


      } catch (error) {

        console.error(
          "Failed to load klines:",
          error
        );

      }
    }


    loadKlines();


    // -------------------------
    // 4. LIVE TRADE SUBSCRIPTION
    // -------------------------

    const manager =
      SignallingManager.getInstance();


    manager.sendMessage({
      method: "SUBSCRIBE",
      params: [
        "trade@TATA_INR"
      ],
    });


    manager.registerCallback(
      "trade",

      (trade: Trade) => {

        console.log(
          "TRADE FOR CHART:",
          trade
        );


        const tradePrice =
          Number(trade.price);


        // Current time in Unix seconds

        const timestamp =
          Math.floor(
            Date.now() / 1000
          );


        // Convert timestamp into
        // beginning of minute

        const bucket =
          Math.floor(
            timestamp / 60
          ) * 60;


        const currentCandle =
          currentCandleRef.current;


        // -------------------------
        // SAME MINUTE
        // -------------------------

        if (
          currentCandle &&
          Number(
            currentCandle.time
          ) === bucket
        ) {

          const updatedCandle: Candle = {

            ...currentCandle,

            high: Math.max(
              currentCandle.high,
              tradePrice
            ),

            low: Math.min(
              currentCandle.low,
              tradePrice
            ),

            close:
              tradePrice,
          };


          currentCandleRef.current =
            updatedCandle;


          candleSeriesRef.current?.update(
            updatedCandle
          );


          return;
        }


        // -------------------------
        // NEW MINUTE
        // -------------------------

        const newCandle: Candle = {

          time:
            bucket as UTCTimestamp,

          open:
            tradePrice,

          high:
            tradePrice,

          low:
            tradePrice,

          close:
            tradePrice,
        };


        currentCandleRef.current =
          newCandle;


        candleSeriesRef.current?.update(
          newCandle
        );

      },

      "chart-trades"
    );


    // -------------------------
    // 5. CLEANUP
    // -------------------------

    return () => {

      manager.sendMessage({
        method: "UNSUBSCRIBE",
        params: [
          "trade@TATA_INR"
        ],
      });


      manager.deregisterCallback(
        "trade",
        "chart-trades"
      );


      candleSeriesRef.current =
        null;


      chart.remove();
    };


  }, []);


  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px]"
    />
  );
};

export default ChartComponent;