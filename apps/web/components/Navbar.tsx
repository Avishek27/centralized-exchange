"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import LoginButton from "./auth/login-button";
import ProfileMenu, {
  type ProfileUser,
} from "./account/profileMenu";

interface NavbarProps {
  user: ProfileUser | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const linkList = [
    { name: "Balance", href: "/balance" },
    { name: "Markets", href: "/market" },
    { name: "Home", href: "/" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const floatingStyle = isScrolled
    ? `
        border
        border-white/10
        bg-black/50
        shadow-[0_10px_40px_rgba(0,0,0,0.30)]
        backdrop-blur-xl
      `
    : `
        border
        border-transparent
        bg-transparent
      `;

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        bg-transparent
        px-4
        py-3
      "
    >
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-7xl
          items-center
          justify-between
        "
      >
        {/* ================= LOGO ================= */}

        <Link
          href="/"
          className={`
            rounded-2xl
            px-4
            py-3
            text-3xl
            font-bold
            transition-all
            duration-300
            ${floatingStyle}
          `}
        >
          Finora
        </Link>

        {/* ================= CENTER LINKS ================= */}

        <div
          className={`
            hidden
            items-center
            gap-7
            rounded-2xl
            px-6
            py-3
            transition-all
            duration-300
            md:flex
            ${floatingStyle}
          `}
        >
          {linkList.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="
                text-sm
                font-medium
                transition-colors
                hover:text-gray-400
              "
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ================= DESKTOP RIGHT ================= */}

        <div
          className={`
            hidden
            items-center
            gap-3
            rounded-2xl
            px-3
            py-2
            transition-all
            duration-300
            md:flex
            ${floatingStyle}
          `}
        >
          {user ? (
            <ProfileMenu user={user} />
          ) : (
            <>
              <LoginButton>
                Login
              </LoginButton>

              <LoginButton>
                SignUp
              </LoginButton>
            </>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}

        <button
          type="button"
          onClick={() =>
            setIsOpen(
              (prev) => !prev
            )
          }
          aria-label="Toggle navigation"
          className={`
            cursor-pointer
            rounded-xl
            p-3
            transition-all
            duration-300
            md:hidden
            ${floatingStyle}
          `}
        >
          {isOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>

        {/* ================= MOBILE MENU ================= */}

        {isOpen && (
          <div
            className="
              absolute
              left-0
              right-0
              top-[calc(100%+8px)]
              flex
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-black/90
              shadow-2xl
              backdrop-blur-xl
              md:hidden
            "
          >
            {linkList.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() =>
                  setIsOpen(false)
                }
                className="
                  border-b
                  border-white/5
                  px-6
                  py-4
                  transition-colors
                  hover:bg-white/5
                "
              >
                {link.name}
              </Link>
            ))}

            {/* MOBILE AUTH / PROFILE */}

            <div className="p-4">
              {user ? (
                <div className="flex items-center justify-end">
                  <ProfileMenu
                    user={user}
                  />
                </div>
              ) : (
                <div className="flex gap-3">
                  <LoginButton>
                    Login
                  </LoginButton>

                  <LoginButton>
                    SignUp
                  </LoginButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;