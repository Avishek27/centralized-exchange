import { createClient } from "redis";
import { ORDER_UPDATE, TRADE_ADDED, type dbMessage } from "./types/fromEngine";
import { prisma } from "@repo/db";


const getMinuteBucket = (date: Date) => {
  const bucket = new Date(date);

  bucket.setSeconds(0);
  bucket.setMilliseconds(0);

  return bucket;
};


async function updateKline1m(
  market: string,
  price: number,
  quantity: number,
  tradeTime: Date
) {
  const bucket = getMinuteBucket(tradeTime);

  const existingKline = await prisma.kline1m.findUnique({
    where: {
      market_bucket: {
        market,
        bucket,
      },
    },
  });

  console.log("KLINE INPUT:", {
  market,
  originalPrice: price,
  convertedPrice: Number(price),
  originalQuantity: quantity,
  convertedQuantity: Number(quantity),
  tradeTime,
});
  // First trade in this minute
  if (!existingKline) {
    
    await prisma.kline1m.create({
      data: {
        market,
        bucket,

        open: price,
        high: price,
        low: price,
        close: price,

        volume: quantity,
        quoteVolume: price * quantity,

        trades: 1,
      },
    });

    console.log("New 1m candle created:", {
      market,
      bucket,
      price,
    });

    return;
  }

  // More trades occurring in the same minute
  await prisma.kline1m.update({
    where: {
      market_bucket: {
        market,
        bucket,
      },
    },

    data: {
      high: Math.max(
        Number(existingKline.high),
        price
      ),

      low: Math.min(
        Number(existingKline.low),
        price
      ),

      close: price,

      volume:
        Number(existingKline.volume) +
        quantity,

      quoteVolume:
        Number(existingKline.quoteVolume) +
        price * quantity,

      trades: {
        increment: 1,
      },
    },
  });

  console.log("1m candle updated:", {
    market,
    bucket,
    price,
  });
}



async function main() {

    // ---------------- Redis ----------------

    const redisClient = createClient({
        url: process.env.REDIS_URL
    });

    await redisClient.connect();

    console.log("Connected to Redis");



    // ---------------- DB Worker ----------------

    while (true) {

        const response =
            await redisClient.rPop("db_processor");

        if (!response) {
            continue;
        }

        const data: dbMessage =
            JSON.parse(response);


        if (data.type === TRADE_ADDED) {

            const {
                tradeId,
                isBuyerMaker,
                price,
                quantity,
                quoteQuantity,
                timeStamp,
                market
            } = data.data;

            try{
                const existingTrade = await prisma.trade.findUnique({
                    where: {
                        tradeId: tradeId.toString(),
                    },
                });

                if (!existingTrade) {
                    const tradeTime = new Date(timeStamp);
                    await prisma.trade.create({
                        data: {
                            tradeId: tradeId.toString(),
                            isBuyerMaker,
                            price,
                            quantity,
                            quoteQuantity,
                            tradeTime,
                            market,
                        },
                    });
                    await updateKline1m(
                        market,
                        Number(price),
                        Number(quantity),
                        tradeTime
                    );
                    
                }
            }catch(e){
               console.log("error",e);
            }
            
        }


        if (data.type === ORDER_UPDATE) {

            const {
                orderId,
                executedQty,
                market,
                price,
                quantity,
                side
            } = data.data;


            // Incoming/new order
            if (
                market !== undefined &&
                price !== undefined &&
                quantity !== undefined &&
                side !== undefined
            ) {

                await prisma.order.upsert({
                    where: {
                        orderId,
                    },

                    create: {
                        orderId,
                        executedQty,
                        market,
                        price,
                        quantity,
                        side,
                    },

                    update: {
                        executedQty,
                        market,
                        price,
                        quantity,
                        side,
                    },
                });

                console.log(
                    "Order inserted/updated:",
                    orderId
                );
            } else {
                // Existing maker order got filled

                await prisma.order.update({
                    where: {
                        orderId,
                    },

                    data: {
                        executedQty: {
                            increment: executedQty,
                        },
                    },
                });

                console.log(
                    "Maker order updated:",
                    orderId
                );
            }
        }
    }
}


main().catch(err => {
    console.error("DB worker crashed:", err);
});