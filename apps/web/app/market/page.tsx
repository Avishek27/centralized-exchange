import getBalance from "@/actions/getBalance";
import ChartManager from "@/components/ChartManager";
import { DepthComponent } from "@/components/Depth/Depth";
import MarketBar from "@/components/market/MarketBar";
import MarketSidebar from "@/components/market/MarketSideBar";
import MarketTopbar from "@/components/market/MarketTopBar";
import SwapUI from "@/components/SwapUI";
import { auth } from "@/auth";

const MarketPage = async () => {
  const balance = await getBalance();
  console.log("Balance data: ", balance);
  const session =
    await auth();

  const user = {
    name:
      session?.user?.name ??
      "User",

    email:
      session?.user?.email ??
      null,
  };

  return (
    <main className="
    min-h-dvh
    bg-[#0b0d12]
    text-white

    xl:h-dvh
    xl:overflow-hidden
  ">

      {/* ================= WHOLE APP ================= */}

      <div
        className="
          grid
          h-full
          min-w-0
          grid-cols-1
          xl:grid-cols-[245px_minmax(0,1fr)]
        "
      >

        {/* ================= SIDEBAR ================= */}

        <aside
          className="
            hidden
            h-full
            overflow-hidden
            border-r
            border-white/[0.06]
            bg-[#0b0d12]
            xl:block
          "
        >
          <MarketSidebar />
        </aside>


        {/* ================= MAIN TRADING APP ================= */}

        <div
          className="
            flex
            h-full
            min-h-0
            min-w-0
            flex-col
            overflow-hidden
          "
        >

          {/* TOP BAR */}
          <div className="h-16 shrink-0">
            <MarketTopbar user={user}/>
          </div>


          {/* MARKET BAR */}
          <div
            className="
              h-20
              shrink-0
              overflow-hidden
              border-y
              border-white/[0.06]
              bg-[#101219]
            "
          >
            <MarketBar/>
          </div>


          {/* ================= TRADING AREA ================= */}

          <div
  className="
    flex
    min-w-0
    flex-col

    xl:grid
    xl:min-h-0
    xl:flex-1
    xl:grid-cols-[minmax(0,1fr)_280px_350px]

    2xl:grid-cols-[minmax(0,1fr)_320px_390px]
  "
>

            {/* ================= CHART ================= */}

            <section
  className="
    relative
    h-[420px]
    min-w-0
    overflow-hidden
    border-b
    border-white/[0.06]

    xl:h-auto
    xl:min-h-0
    xl:border-b-0
    xl:border-r
  "
>
              <div className="h-full min-h-0 min-w-0 overflow-hidden">
                <ChartManager />
              </div>
            </section>


            {/* ================= DEPTH / ORDER BOOK ================= */}

            <section
  className="
    relative
    h-[520px]
    min-w-0
    overflow-hidden
    border-b
    border-white/[0.06]

    xl:h-auto
    xl:min-h-0
    xl:border-b-0
    xl:border-r
  "
>
              <div className="h-full min-h-0 overflow-hidden">
                <DepthComponent />
              </div>
            </section>


            {/* ================= SWAP UI ================= */}

            <section
  className="
    relative
    min-w-0

    xl:min-h-0
    xl:overflow-y-auto
  "
>
              <SwapUI balances={balance.balances} />
            </section>

          </div>

        </div>

      </div>

    </main>
  );
};

export default MarketPage;