import getBalance from "@/actions/getBalance";
import { auth } from "@/auth";

import BalanceActionForm from "@/components/balance/balanceActionForm";
import MarketSidebar from "@/components/market/MarketSideBar";
import MarketTopbar from "@/components/market/MarketTopBar";

const BalancePage = async () => {
  const balance = await getBalance();

  const session = await auth();

  const user = {
    name:
      session?.user?.name ??
      "User",

    email:
      session?.user?.email ??
      null,
  };

  return (
    <main
      className="
        min-h-dvh
        w-full
        bg-[#0b0d12]
        text-white
      "
    >
      <div
        className="
          grid
          min-h-dvh
          w-full
          grid-cols-1
          xl:grid-cols-[245px_minmax(0,1fr)]
        "
      >
        {/* ================= SIDEBAR ================= */}

        <aside
          className="
            hidden
            min-h-dvh
            border-r
            border-white/[0.06]
            xl:block
          "
        >
          <MarketSidebar />
        </aside>

        {/* ================= RIGHT SIDE ================= */}

        <div
          className="
            flex
            min-h-dvh
            min-w-0
            flex-col
          "
        >
          {/* TOP BAR */}

          <div
            className="
              shrink-0
              border-b
              border-white/[0.06]
            "
          >
            <MarketTopbar
              user={user}
            />
          </div>

          {/* ================= PAGE CONTENT ================= */}

          <div
            className="
              w-full
              flex-1
              px-5
              py-10
              md:px-8
              lg:px-10
              xl:px-12
            "
          >
            {/* HEADER */}

            <div className="mb-10">
              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                "
              >
                Balance
              </h1>

              <p
                className="
                  mt-2
                  text-zinc-500
                "
              >
                Manage your assets and
                account balances.
              </p>
            </div>

            {/* ================= BALANCE CARDS ================= */}

            <div
              className="
                grid
                w-full
                gap-5
                md:grid-cols-2
              "
            >
              <AssetCard
                asset="INR"
                available={
                  balance
                    .balances
                    .INR
                    .available
                }
                locked={
                  balance
                    .balances
                    .INR
                    .lockedOut
                }
              />

              <AssetCard
                asset="TATA"
                available={
                  balance
                    .balances
                    .TATA
                    .available
                }
                locked={
                  balance
                    .balances
                    .TATA
                    .lockedOut
                }
              />
            </div>

            {/* ================= DEPOSIT / WITHDRAW ================= */}

            <div
              className="
                mt-10
                flex
                w-full
                justify-center
              "
            >
              <div
                className="
                  w-full
                  max-w-xl
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-[#101219]
                  p-6
                "
              >
                <BalanceActionForm
                  balances={
                    balance.balances
                  }
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default BalancePage;


/* ==========================================
                ASSET CARD
========================================== */

const AssetCard = ({
  asset,
  available,
  locked,
}: {
  asset: "INR" | "TATA";
  available: number;
  locked: number;
}) => {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-white/[0.06]
        bg-[#101219]
        p-6
        transition
        hover:border-white/[0.10]
        md:p-7
      "
    >
      {/* ASSET HEADER */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#1b1e25]
            font-semibold
          "
        >
          {asset === "INR"
            ? "₹"
            : "T"}
        </div>

        <div>
          <p
            className="
              font-semibold
              text-zinc-100
            "
          >
            {asset}
          </p>

          <p
            className="
              mt-0.5
              text-xs
              text-zinc-500
            "
          >
            {asset === "INR"
              ? "Indian Rupee"
              : "TATA"}
          </p>
        </div>
      </div>

      {/* AVAILABLE */}

      <div className="mt-8">
        <p
          className="
            text-xs
            text-zinc-500
          "
        >
          Available
        </p>

        <p
          className="
            mt-2
            text-2xl
            font-semibold
            tracking-tight
          "
        >
          {asset === "INR"
            ? `₹${available.toLocaleString()}`
            : `${available.toLocaleString()} TATA`}
        </p>
      </div>

      {/* LOCKED */}

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-white/[0.05]
          pt-5
          text-sm
        "
      >
        <span className="text-zinc-500">
          Locked
        </span>

        <span className="text-zinc-200">
          {asset === "INR"
            ? `₹${locked.toLocaleString()}`
            : `${locked.toLocaleString()} TATA`}
        </span>
      </div>
    </div>
  );
};