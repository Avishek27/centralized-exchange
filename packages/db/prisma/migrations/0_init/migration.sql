-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "orders" (
    "order_id" TEXT NOT NULL,
    "executed_qty" DECIMAL NOT NULL DEFAULT 0,
    "market" TEXT,
    "price" DECIMAL,
    "quantity" DECIMAL,
    "side" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "trades" (
    "trade_id" TEXT NOT NULL,
    "is_buyer_maker" BOOLEAN NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "quote_quantity" DECIMAL NOT NULL,
    "trade_time" TIMESTAMPTZ(6) NOT NULL,
    "market" TEXT NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("trade_id")
);

