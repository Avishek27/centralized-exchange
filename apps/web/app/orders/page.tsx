import {
  auth,
} from "@/auth";

import {
  redirect,
} from "next/navigation";

import getOpenOrders from "@/actions/getOpenOrders";

import MarketSidebar from "@/components/market/MarketSideBar";
import MarketTopbar from "@/components/market/MarketTopBar";
import OpenOrdersTable from "@/components/orders/openOrdersTable";



const OrdersPage =
  async () => {

    const session =
      await auth();

    if (!session?.user) {
      redirect(
        "/auth/login"
      );
    }


    const user = {
      name:
        session.user.name ??
        "User",

      email:
        session.user.email ??
        null,
    };


    const orders =
      await getOpenOrders(
        "TATA_INR"
      );


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

          {/* SIDEBAR */}

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


          {/* RIGHT */}

          <div
            className="
              flex
              min-h-dvh
              min-w-0
              flex-col
            "
          >

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

              <div
                className="
                  mb-8
                  flex
                  items-end
                  justify-between
                "
              >

                <div>

                  <h1
                    className="
                      text-3xl
                      font-semibold
                      tracking-tight
                    "
                  >
                    Orders
                  </h1>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-zinc-500
                    "
                  >
                    View and manage
                    your active orders.
                  </p>

                </div>


                <div
                  className="
                    rounded-lg
                    border
                    border-white/[0.06]
                    bg-[#101219]
                    px-3
                    py-2
                    text-xs
                    text-zinc-400
                  "
                >
                  TATA / INR
                </div>

              </div>


              <OpenOrdersTable
                initialOrders={
                  orders
                }
              />

            </div>

          </div>

        </div>

      </main>
    );
  };

export default OrdersPage;