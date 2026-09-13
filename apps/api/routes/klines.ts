import { Router } from "express";
import { prisma } from "@repo/db";

export const klines = Router();


klines.get("/",async (req,res) => {
    const { market,interval,startTime,endTime } = req.query;
    console.log(
  "DATABASE URL AVAILABLE:",
  !!process.env.DATABASE_URL
);
    if (
        typeof market !== "string" ||
        typeof interval !== "string" ||
        typeof startTime !== "string" ||
        typeof endTime !== "string"
    ) {
        return res.status(400).json({
            error: "Invalid query parameters"
        });
    }
    if (interval !== "1m") {
        return res.status(400).json({
            error: "Only 1m interval is supported"
        });
    }
    
    const start = new Date(
        Number(startTime) * 1000
    );

    const end = new Date(
        Number(endTime) * 1000
    );

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        return res.status(400).json({
            error: "Invalid startTime or endTime"
        });
    }
try {
    const klines = await prisma.kline1m.findMany({
      where: {
        market,
        bucket: {
          gte: start,
          lte: end,
        },
      },

      orderBy: {
        bucket: "asc",
      },
    });

    return res.json(
      klines.map((kline) => ({
        start: Math.floor(
          kline.bucket.getTime() / 1000
        ),

        open: kline.open.toString(),
        high: kline.high.toString(),
        low: kline.low.toString(),
        close: kline.close.toString(),

        volume: kline.volume.toString(),
        quoteVolume: kline.quoteVolume.toString(),

        trades: kline.trades,
      }))
    );

  } catch (error) {
    console.error(
      "Error fetching klines:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch klines"
    });
  }

})