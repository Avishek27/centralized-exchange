import { createClient } from "redis";
import { Client } from "pg";
import { ORDER_UPDATE, TRADE_ADDED, type dbMessage } from "./types/fromEngine";


async function main() {

    // ---------------- Redis ----------------

    const redisClient = createClient({
        url: process.env.REDIS_URL
    });

    await redisClient.connect();

    console.log("Connected to Redis");


    // ---------------- PostgreSQL / Neon ----------------

    const pgClient = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    await pgClient.connect();

    console.log("Connected to Neon");


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

            const query = `
                INSERT INTO trades (
                    trade_id,
                    is_buyer_maker,
                    price,
                    quantity,
                    quote_quantity,
                    trade_time,
                    market
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)

                ON CONFLICT (trade_id)
                DO NOTHING
            `;

            await pgClient.query(query, [
                tradeId,
                isBuyerMaker,
                price,
                quantity,
                quoteQuantity,
                new Date(timeStamp),
                market
            ]);

            console.log("Trade inserted:", tradeId);
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

                const query = `
                    INSERT INTO orders (
                        order_id,
                        executed_qty,
                        market,
                        price,
                        quantity,
                        side
                    )
                    VALUES ($1, $2, $3, $4, $5, $6)

                    ON CONFLICT (order_id)
                    DO UPDATE SET
                        executed_qty = EXCLUDED.executed_qty,
                        market = EXCLUDED.market,
                        price = EXCLUDED.price,
                        quantity = EXCLUDED.quantity,
                        side = EXCLUDED.side,
                        updated_at = NOW()
                `;

                await pgClient.query(query, [
                    orderId,
                    executedQty,
                    market,
                    price,
                    quantity,
                    side
                ]);

                console.log(
                    "Order inserted/updated:",
                    orderId
                );

            } else {

                // Existing maker order got filled

                const query = `
                    UPDATE orders
                    SET
                        executed_qty = executed_qty + $1,
                        updated_at = NOW()
                    WHERE order_id = $2
                `;

                await pgClient.query(query, [
                    executedQty,
                    orderId
                ]);

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