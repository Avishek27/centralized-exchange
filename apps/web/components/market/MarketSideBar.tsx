"use client";

import {
  CandlestickChart,
  ClipboardList,
  Home,
  WalletCards,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MarketSidebar = () => {
  const pathname =
    usePathname();

  const links = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Trade",
      href: "/market",
      icon: CandlestickChart,
    },
    {
      name: "Balance",
      href: "/balance",
      icon: WalletCards,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: ClipboardList,
    },
  ];

  return (
    <aside
      className="
        flex
        h-full
        flex-col
        bg-[#0b0d12]
        px-3
        py-5
      "
    >

      {/* LOGO */}

      <Link
        href="/"
        className="
          mb-10
          px-3
          text-2xl
          font-bold
          tracking-tight
        "
      >
        Finora
      </Link>


      {/* NAVIGATION */}

      <nav className="space-y-1">

        {links.map(
          ({
            name,
            href,
            icon: Icon,
          }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    href
                  );

            return (
              <Link
                key={name}
                href={href}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition

                  ${
                    active
                      ? `
                        bg-[#1a1d24]
                        text-white
                      `
                      : `
                        text-zinc-500
                        hover:bg-white/[0.04]
                        hover:text-zinc-200
                      `
                  }
                `}
              >
                <Icon
                  size={19}
                />

                {name}
              </Link>
            );
          }
        )}

      </nav>


      {/* BOTTOM */}

      <div
        className="
          mt-auto
          border-t
          border-white/[0.06]
          px-3
          pt-5
        "
      >
        <p
          className="
            text-xs
            leading-5
            text-zinc-600
          "
        >
          Finora Exchange
          <br />
          TATA / INR
        </p>
      </div>

    </aside>
  );
};

export default MarketSidebar;