
import LoginButton from "@/components/auth/login-button"
import { DepthComponent } from "@/components/Depth/Depth"
import Navbar from "@/components/Navbar"
import TradeComponent from "@/components/Trades"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"
import {
  Check,
} from "lucide-react";
import Link from "next/link"
import HomeNavbar from "@/components/HomeNavBar"

export default function Page() {
  return (
    <main className="h-full bg- black text-white">
      <div className="space-y-3">
       <HomeNavbar/>
       <section className="mx-auto flex max-w-7xl flex-col items-center px-5 pt-16 text-center md:pt-20 lg:pt-16">

        {/* Heading */}
        <h1 className="max-w-7xl text-6xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-7xl lg:leading-[1.05]">

          Modern{" "}

          <span className="text-red-500">
            finance.
          </span>
            
        </h1>
         <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
          Your assets, your exchange, your control.
          Trade, manage balances and explore markets
          with everything working together in one place.
        </p>
        </section>
        <section className="w-full bg-black px-5 py-24 md:px-10 lg:px-16 lg:py-32">
  <div className="mx-auto max-w-7xl">

    <div className="mb-20 text-center">
      <h2 className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl md:text-6xl">
        Built for{" "}
        <span className="text-red-500">
          traders.
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg md:text-xl">
        Trade, manage balances and execute orders from one
        unified exchange experience.
      </p>
    </div>

    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">

      {/* LEFT IMAGE CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111319] shadow-[0_30px_80px_rgba(0,0,0,0.4)]">

        
        <div className="relative w-full aspect-video">
  <Image
    src="/images/trading_dashboard.png"
    alt="Trading dashboard"
    fill
    sizes="100vw"
    className="object-contain"
  />
</div>

      </div>


      {/* RIGHT CONTENT */}
      <div className="lg:pl-4">

        <p className="mb-6 text-sm font-semibold tracking-[0.12em] text-zinc-400">
          BUILT AROUND YOUR PORTFOLIO
        </p>

        <h3 className="max-w-xl text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
          Your assets.
          <br />
          Your trading power.
        </h3>

        <p className="mt-7 max-w-xl text-base leading-8 text-zinc-400 md:text-lg">
          Manage INR and TATA balances in one place.
          Add funds, place buy and sell orders and track
          your portfolio in real time.
        </p>

        <div className="mt-10 space-y-5">

          <FeaturePoint>
            Add INR and TATA balances directly to your account
          </FeaturePoint>

          <FeaturePoint>
            Track available and locked balances after every order
          </FeaturePoint>

          <FeaturePoint>
            Buy and sell through the matching engine
          </FeaturePoint>

        </div>

      </div>

    </div>

  </div>
</section>
{/* ================= FOOTER ================= */}

<footer className="border-t border-white/[0.06] bg-[#0b0c10] px-5 py-14 md:px-10 lg:px-16">

  <div className="mx-auto max-w-7xl">

    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

      {/* Brand */}
      <div>

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 font-bold text-black">
            F
          </div>

          <span className="text-xl font-bold">
            Finora
          </span>
        </Link>

        <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-500">
          A modern exchange platform for exploring markets,
          managing balances and placing trades in real time.
        </p>

      </div>


      {/* Product */}
      <FooterColumn
        title="Product"
        links={[
          {
            label: "Markets",
            href: "/markets",
          },
          {
            label: "Trade",
            href: "/market/TATA_INR",
          },
          {
            label: "Balance",
            href: "/balance",
          },
          {
            label: "Orders",
            href: "/orders",
          },
        ]}
      />


      {/* Account */}
      <FooterColumn
        title="Account"
        links={[
          {
            label: "Log in",
            href: "/auth/login",
          },
          {
            label: "Sign up",
            href: "/auth/register",
          },
          {
            label: "Portfolio",
            href: "/balance",
          },
        ]}
      />


      {/* Resources */}
      <FooterColumn
        title="Resources"
        links={[
          {
            label: "Documentation",
            href: "#",
          },
          {
            label: "About",
            href: "#",
          },
          {
            label: "GitHub",
            href: "#",
          },
          {
            label: "Contact",
            href: "#",
          },
        ]}
      />

    </div>


    {/* Bottom section */}
    <div className="mt-14 flex flex-col gap-5 border-t border-white/6 pt-7 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">

      <p>
        © {new Date().getFullYear()} Finora.
        All rights reserved.
      </p>


      <div className="flex flex-wrap gap-6">

        <Link
          href="#"
          className="transition-colors hover:text-zinc-300"
        >
          Privacy
        </Link>

        <Link
          href="#"
          className="transition-colors hover:text-zinc-300"
        >
          Terms
        </Link>

        <Link
          href="#"
          className="transition-colors hover:text-zinc-300"
        >
          Security
        </Link>

      </div>

    </div>

  </div>

</footer>
      </div>
    </main>
  )
}


/**
 *  <div className="text-muted-foreground font-mono text-xs">
          (Press <kbd>d</kbd> to toggle dark mode)
          
        </div>
 */
function FeaturePoint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">

        <Check
          size={16}
          className="text-emerald-400"
        />

      </div>

      <p className="text-sm font-medium text-zinc-200 md:text-base">
        {children}
      </p>

    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;

  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>

      <h3 className="mb-5 text-sm font-semibold text-zinc-300">
        {title}
      </h3>

      <div className="flex flex-col gap-3">

        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="w-fit text-sm text-zinc-500 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        ))}

      </div>

    </div>
  );
}