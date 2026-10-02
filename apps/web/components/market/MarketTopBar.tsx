"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import ProfileMenu, {
  type ProfileUser,
} from "../account/profileMenu";

import BalanceModal from "../balance/balanceModal";

interface MarketTopbarProps {
  user: ProfileUser;
}

const MarketTopbar = ({
  user,
}: MarketTopbarProps) => {
  const [search, setSearch] =
    useState("");

  const [
    balanceModal,
    setBalanceModal,
  ] = useState<
    "deposit" | "withdraw" | null
  >(null);

  return (
    <>
      <header
        className="
          flex
          h-16
          w-full
          items-center
          justify-between
          gap-3
          bg-[#0b0d12]
          px-3
          sm:px-4
          md:px-6
        "
      >
        {/* ================= LEFT ================= */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-4
          "
        >
          {/* FINORA - MOBILE / TABLET */}

          <Link
            href="/"
            className="
              shrink-0
              text-xl
              font-bold
              tracking-tight
              text-white
              xl:hidden
            "
          >
            Finora
          </Link>

          {/* SEARCH */}

          <div
            className="
              hidden
              w-full
              max-w-xl
              items-center
              gap-3
              rounded-xl
              bg-[#14171d]
              px-4
              py-2.5
              md:flex
            "
          >
            <Search
              size={18}
              className="
                shrink-0
                text-zinc-500
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search markets"
              className="
                min-w-0
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-zinc-500
              "
            />
          </div>
        </div>

        {/* ================= RIGHT / ACTIONS ================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* DEPOSIT */}

          <button
            type="button"
            onClick={() =>
              setBalanceModal(
                "deposit"
              )
            }
            className="
              rounded-xl
              bg-emerald-500/15
              px-2.5
              py-2
              text-[11px]
              font-semibold
              text-emerald-400
              transition
              hover:bg-emerald-500/20

              sm:px-4
              sm:py-2.5
              sm:text-sm
            "
          >
            Deposit
          </button>

          {/* WITHDRAW */}

          <button
            type="button"
            onClick={() =>
              setBalanceModal(
                "withdraw"
              )
            }
            className="
              rounded-xl
              bg-blue-500/15
              px-2.5
              py-2
              text-[11px]
              font-semibold
              text-blue-400
              transition
              hover:bg-blue-500/20

              sm:px-4
              sm:py-2.5
              sm:text-sm
            "
          >
            Withdraw
          </button>

          {/* BELL - HIDE ON VERY SMALL SCREEN */}

          <button
            type="button"
            className="
              hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-zinc-500
              transition
              hover:bg-white/[0.05]
              hover:text-white
              sm:flex
            "
          >
            <Bell size={19} />
          </button>

          {/* PROFILE */}

          <ProfileMenu
            user={user}
          />
        </div>
      </header>

      {/* ================= BALANCE MODAL ================= */}

      <BalanceModal
        open={
          balanceModal !== null
        }
        mode={
          balanceModal ??
          "deposit"
        }
        onClose={() =>
          setBalanceModal(null)
        }
      />
    </>
  );
};

export default MarketTopbar;