import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import HomeNavbar from "@/components/HomeNavBar";

export default function Page() {
    return (
        <main className="min-h-screen bg-[#0b0c10] text-white">

            <HomeNavbar />

            {/* ================= HERO ================= */}
            <section
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-7xl
                    flex-col
                    items-center
                    px-5
                    pb-16
                    pt-16
                    text-center

                    sm:pb-20
                    sm:pt-20

                    md:px-8
                    md:pb-24
                    md:pt-24

                    lg:pb-28
                    lg:pt-28
                "
            >
                <h1
                    className="
                        max-w-5xl

                        text-5xl
                        font-bold
                        tracking-[-0.05em]

                        sm:text-6xl
                        md:text-7xl
                        lg:text-8xl
                        lg:leading-[1.02]
                    "
                >
                    Modern{" "}
                    <span className="text-red-500">
                        finance.
                    </span>
                </h1>

                <p
                    className="
                        mt-6
                        max-w-2xl

                        text-base
                        leading-7
                        text-zinc-400

                        sm:text-lg
                        sm:leading-8

                        md:mt-8
                        md:text-xl
                    "
                >
                    Your assets, your exchange, your control.
                    Trade, manage balances and explore markets
                    with everything working together in one place.
                </p>
            </section>


            {/* ================= TRADING SECTION ================= */}
            <section
                className="
                    w-full
                    bg-black

                    px-5
                    py-16

                    sm:py-20
                    md:px-10
                    md:py-24

                    lg:px-16
                    lg:py-28
                "
            >
                <div className="mx-auto max-w-7xl">

                    {/* Section heading */}
                    <div className="mb-12 text-center md:mb-16 lg:mb-20">

                        <h2
                            className="
                                text-4xl
                                font-bold
                                tracking-[-0.04em]

                                sm:text-5xl
                                md:text-6xl
                            "
                        >
                            Built for{" "}
                            <span className="text-red-500">
                                traders.
                            </span>
                        </h2>

                        <p
                            className="
                                mx-auto
                                mt-5
                                max-w-3xl

                                text-base
                                leading-7
                                text-zinc-400

                                sm:text-lg
                                md:mt-6
                                md:text-xl
                            "
                        >
                            Trade, manage balances and execute orders
                            from one unified exchange experience.
                        </p>

                    </div>


                    {/* Content */}
                    <div
                        className="
                            grid
                            items-center
                            gap-12

                            lg:grid-cols-2
                            lg:gap-20
                        "
                    >

                        {/* DASHBOARD IMAGE */}
                        <div
                            className="
                                relative
                                overflow-hidden

                                rounded-2xl
                                border
                                border-white/[0.08]

                                bg-[#111319]

                                shadow-[0_30px_80px_rgba(0,0,0,0.4)]

                                sm:rounded-3xl
                            "
                        >
                            <div className="relative aspect-[16/10] w-full">

                                <Image
                                    src="/images/trading_dashboard.png"
                                    alt="Finora trading dashboard"
                                    fill
                                    priority
                                    sizes="
                                        (max-width: 1024px) 100vw,
                                        50vw
                                    "
                                    className="object-contain"
                                />

                            </div>
                        </div>


                        {/* RIGHT CONTENT */}
                        <div className="lg:pl-4">

                            <p
                                className="
                                    mb-4
                                    text-xs
                                    font-semibold
                                    tracking-[0.14em]
                                    text-zinc-500

                                    sm:text-sm
                                "
                            >
                                BUILT AROUND YOUR PORTFOLIO
                            </p>


                            <h3
                                className="
                                    max-w-xl

                                    text-3xl
                                    font-bold
                                    tracking-[-0.035em]

                                    sm:text-4xl
                                    md:text-5xl
                                "
                            >
                                Your assets.
                                <br />
                                Your trading power.
                            </h3>


                            <p
                                className="
                                    mt-5
                                    max-w-xl

                                    text-base
                                    leading-7
                                    text-zinc-400

                                    md:mt-7
                                    md:text-lg
                                    md:leading-8
                                "
                            >
                                Manage INR and TATA balances in one place.
                                Add funds, place buy and sell orders and track
                                your portfolio in real time.
                            </p>


                            <div className="mt-8 space-y-5 md:mt-10">

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
            <footer
                className="
                    border-t
                    border-white/[0.06]
                    bg-[#0b0c10]

                    px-5
                    py-12

                    md:px-10
                    md:py-14

                    lg:px-16
                "
            >
                <div className="mx-auto max-w-7xl">

                    <div
                        className="
                            grid
                            gap-10

                            sm:grid-cols-2
                            lg:grid-cols-4
                            lg:gap-12
                        "
                    >

                        {/* Brand */}
                        <div>
                            <Link
                                href="/"
                                className="flex items-center gap-3"
                            >
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center

                                        rounded-xl
                                        bg-red-500

                                        font-bold
                                        text-black
                                    "
                                >
                                    F
                                </div>

                                <span className="text-xl font-bold">
                                    Finora
                                </span>
                            </Link>

                            <p
                                className="
                                    mt-5
                                    max-w-xs

                                    text-sm
                                    leading-6
                                    text-zinc-500
                                "
                            >
                                A modern exchange platform for exploring
                                markets, managing balances and placing trades
                                in real time.
                            </p>
                        </div>


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


                    {/* Bottom */}
                    <div
                        className="
                            mt-12
                            flex
                            flex-col
                            gap-5

                            border-t
                            border-white/[0.06]

                            pt-7

                            text-sm
                            text-zinc-600

                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

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

        </main>
    );
}


function FeaturePoint({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 sm:gap-4">

            <div
                className="
                    mt-0.5
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center

                    rounded-full
                    bg-emerald-500/10
                "
            >
                <Check
                    size={16}
                    className="text-emerald-400"
                />
            </div>

            <p
                className="
                    text-sm
                    font-medium
                    leading-6
                    text-zinc-200

                    md:text-base
                "
            >
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
                        className="
                            w-fit
                            text-sm
                            text-zinc-500

                            transition-colors
                            hover:text-white
                        "
                    >
                        {link.label}
                    </Link>
                ))}

            </div>

        </div>
    );
}