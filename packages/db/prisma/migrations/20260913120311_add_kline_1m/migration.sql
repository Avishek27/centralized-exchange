-- CreateTable
CREATE TABLE "klines_1m" (
    "id" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "bucket" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" DECIMAL(65,30) NOT NULL,
    "quoteVolume" DECIMAL(65,30) NOT NULL,
    "trades" INTEGER NOT NULL,

    CONSTRAINT "klines_1m_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "klines_1m_market_bucket_key" ON "klines_1m"("market", "bucket");
