"use client";

import {
    ClipboardList,
  LogOut,
  User,
  Wallet,
} from "lucide-react";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
  


import { logout } from "@/actions/logout";

export type ProfileUser = {
  name: string;
  email?: string | null;
};

interface ProfileMenuProps {
  user: ProfileUser;
}

const ProfileMenu = ({
  user,
}: ProfileMenuProps) => {
  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(
      null
    );
     if (!user) {
    return null;
  }

  const initial =
    user.name
      ?.trim()
      .charAt(0)
      .toUpperCase() || "U";


  /* Close when clicking outside */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  return (
    <div
      ref={menuRef}
      className="relative"
    >

      {/* AVATAR */}

      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/[0.08]
          bg-[#1b1e25]
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-[#242832]
        "
      >
        {initial}
      </button>


      {/* DROPDOWN */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-[calc(100%+12px)]
            z-[100]
            w-64
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#111319]
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            backdrop-blur-xl
          "
        >

          {/* USER */}

          <div
            className="
              border-b
              border-white/[0.06]
              px-4
              py-4
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#242832]
                  font-semibold
                "
              >
                {initial}
              </div>

              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  {user.name}
                </p>

                {user.email && (
                  <p
                    className="
                      mt-0.5
                      truncate
                      text-xs
                      text-zinc-500
                    "
                  >
                    {user.email}
                  </p>
                )}

              </div>

            </div>
          </div>


          {/* LINKS */}

          <div className="p-2">

            <Link
              href="/balance"
              onClick={() =>
                setOpen(false)
              }
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                text-zinc-400
                transition
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              <Wallet size={17} />

              Balance
            </Link>

            <Link
  href="/orders"
  onClick={() =>
    setOpen(false)
  }
  className="
    flex
    items-center
    gap-3
    rounded-xl
    px-3
    py-2.5
    text-sm
    text-zinc-400
    transition
    hover:bg-white/[0.05]
    hover:text-white
  "
>
  <ClipboardList size={17} />

  Orders
</Link>
            <Link
              href="/profile"
              onClick={() =>
                setOpen(false)
              }
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                text-zinc-400
                transition
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              <User size={17} />

              Profile
            </Link>

          </div>


          {/* LOGOUT */}

          <div
            className="
              border-t
              border-white/[0.06]
              p-2
            "
          >
            <form action={logout}>
              <button
                type="submit"
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  text-red-400
                  transition
                  hover:bg-red-500/10
                "
              >
                <LogOut size={17} />

                Log out
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};

export default ProfileMenu;