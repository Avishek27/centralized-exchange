import { Client } from "pg";

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function initDb() {
  await pgClient.connect();

  console.log("Connected to Neon");

  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      executed_qty NUMERIC NOT NULL DEFAULT 0,
      market TEXT,
      price NUMERIC,
      quantity NUMERIC,
      side TEXT CHECK (side IN ('buy', 'sell')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS trades (
      trade_id TEXT PRIMARY KEY,
      is_buyer_maker BOOLEAN NOT NULL,
      price NUMERIC NOT NULL,
      quantity NUMERIC NOT NULL,
      quote_quantity NUMERIC NOT NULL,
      trade_time TIMESTAMPTZ NOT NULL,
      market TEXT NOT NULL
    );
  `);

  console.log("Tables created");

  await pgClient.end();
}

initDb();