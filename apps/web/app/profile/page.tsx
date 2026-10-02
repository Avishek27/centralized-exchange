import { auth } from "@/auth";
import MarketSidebar from "@/components/market/MarketSideBar";
import MarketTopbar from "@/components/market/MarketTopBar";

import {
  CircleUserRound,
  Mail,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

import Link from "next/link";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = {
    name: session.user.name ?? "User",
    email: session.user.email ?? null,
  };

  const userId =
    session.user.id ?? null;

  const initial =
    user.name
      ?.trim()
      .charAt(0)
      .toUpperCase() ||
    user.email
      ?.trim()
      .charAt(0)
      .toUpperCase() ||
    "U";

  return (
    <main className="min-h-dvh bg-[#0b0d12] text-white">
      <div
        className="
          grid
          min-h-dvh
          grid-cols-1
          xl:grid-cols-[245px_minmax(0,1fr)]
        "
      >
        {/* ================= SIDEBAR ================= */}

        <aside
          className="
            hidden
            border-r
            border-white/[0.06]
            xl:block
          "
        >
          <MarketSidebar />
        </aside>

        {/* ================= MAIN ================= */}

        <div className="min-w-0">
          <div
            className="
              border-b
              border-white/[0.06]
            "
          >
            <MarketTopbar user={user} />
          </div>

          <div
            className="
              mx-auto
              w-full
              max-w-6xl
              px-5
              py-10
              md:px-8
              lg:py-12
            "
          >
            {/* ================= PAGE TITLE ================= */}

            <div className="mb-8">
              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                "
              >
                Profile
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                View your Finora account information.
              </p>
            </div>

            {/* ================= PROFILE HEADER ================= */}

            <section
              className="
                mb-6
                rounded-2xl
                border
                border-white/[0.06]
                bg-[#101219]
                p-6
                md:p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-5">

                  {/* AVATAR */}

                  <div
                    className="
                      flex
                      h-20
                      w-20
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/[0.08]
                      bg-[#1a1d24]
                      text-2xl
                      font-semibold
                    "
                  >
                    {initial}
                  </div>

                  {/* USER */}

                  <div>
                    <h2
                      className="
                        text-xl
                        font-semibold
                        md:text-2xl
                      "
                    >
                      {user.name}
                    </h2>

                    {user.email && (
                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-500
                        "
                      >
                        {user.email}
                      </p>
                    )}

                    <div
                      className="
                        mt-3
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-emerald-400
                      "
                    >
                      <ShieldCheck size={14} />
                      Authenticated
                    </div>
                  </div>
                </div>

                <Link
                  href="/balance"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-zinc-200
                  "
                >
                  <Wallet size={16} />
                  View Balance
                </Link>
              </div>
            </section>

            {/* ================= DETAILS ================= */}

            <div
              className="
                grid
                gap-6
                lg:grid-cols-[minmax(0,1fr)_340px]
              "
            >
              {/* ACCOUNT INFORMATION */}

              <section
                className="
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-[#101219]
                  p-6
                "
              >
                <div className="mb-6">
                  <h3 className="font-semibold">
                    Account information
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Information associated with your account.
                  </p>
                </div>

                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/[0.05]
                  "
                >
                  <ProfileRow
                    icon={<UserRound size={18} />}
                    label="Name"
                    value={user.name}
                  />

                  <ProfileRow
                    icon={<Mail size={18} />}
                    label="Email"
                    value={
                      user.email ??
                      "Not available"
                    }
                  />

                  {userId && (
                    <ProfileRow
                      icon={
                        <CircleUserRound size={18} />
                      }
                      label="User ID"
                      value={userId}
                      last
                    />
                  )}
                </div>
              </section>

              {/* ACCOUNT CARD */}

              <section
                className="
                  h-fit
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-[#101219]
                  p-6
                "
              >
                <h3 className="font-semibold">
                  Account
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-zinc-500
                  "
                >
                  Your account is authenticated and can access
                  trading and balance features.
                </p>

                <div
                  className="
                    mt-6
                    space-y-3
                  "
                >
                  <Link
                    href="/market"
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-white/[0.06]
                      bg-[#161920]
                      px-4
                      py-3
                      text-sm
                      transition
                      hover:bg-[#1c2028]
                    "
                  >
                    <span>Trading terminal</span>
                    <span className="text-zinc-500">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/balance"
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-white/[0.06]
                      bg-[#161920]
                      px-4
                      py-3
                      text-sm
                      transition
                      hover:bg-[#1c2028]
                    "
                  >
                    <span>Manage balance</span>
                    <span className="text-zinc-500">
                      →
                    </span>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;


const ProfileRow = ({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) => {
  return (
    <div
      className={`
        flex
        items-center
        gap-4
        px-4
        py-4

        ${
          !last
            ? "border-b border-white/[0.05]"
            : ""
        }
      `}
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-[#1b1e25]
          text-zinc-400
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-xs
            text-zinc-500
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-all
            text-sm
            font-medium
            text-zinc-200
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
};