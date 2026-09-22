"use client";

import Image from "next/image";
import Logo from "./Logo";
import { LuSearch, LuPlus } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { useAuthModal } from "@/store/useAuthModalStore";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateListingModal } from "@/store/useCreateListingModal";
import { useFilterModal } from "@/store/useFilterListingModal";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const { openRegister, openLogin } = useAuthModal();
  const { open: openCreateListing } = useCreateListingModal();
  const { open: openFilterModal } = useFilterModal();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 h-18 w-full border-b border-gray-200 bg-white lg:h-24">
      <div className="mx-auto flex h-full w-[95%] items-center justify-between gap-4 md:w-[90%]">
        {/* Left — Logo */}
        <Logo />

        {/* Center — Search console (flat, segmented) */}
        <div className="hidden items-stretch border border-gray-300 md:flex">
          {/* Segment 1 */}
          <button
            onClick={openFilterModal}
            className="flex items-center gap-2 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Image
              src="/images/home.png"
              alt=""
              width={18}
              height={18}
              className="opacity-70"
            />
           
          </button>

         

          
          

          {/* Segment 3 — Add guests (unique, flat) */}
          <GuestSegment onClick={openFilterModal} />

          {/* Search square */}
          <button
            onClick={openFilterModal}
            aria-label="Search"
            className="grid aspect-square h-full w-14 place-items-center bg-gray-900 text-white transition-colors hover:bg-black"
          >
            <LuSearch size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right cluster */}
        <div className="relative flex items-center gap-3" ref={menuRef}>
          {session && !isPending && (
            <button
              onClick={openCreateListing}
              className="hidden border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 md:block"
            >
              List your home
            </button>
          )}

          <div className="flex items-center gap-2 border border-none px-1.5 py-1">
            <HamburgerButton open={open} onClick={() => setOpen((p) => !p)} />

            {session && (
              <div className="relative h-7 w-7 overflow-hidden">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="user-avatar"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="/images/image.png"
                    alt="user-avatar"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                )}
              </div>
            )}
          </div>

          {/* dropdown menu — flat */}
          {open && (
            <div className="absolute right-0 top-12 w-56 border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <ul className="text-sm text-gray-800">
                {session && !isPending && (
                  <>
                    <li
                      onClick={openCreateListing}
                      className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                      List your home
                    </li>
                    <Link href="/favorites">
                      <li className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50">
                        Favorites
                      </li>
                    </Link>
                    <Link href="/reservations">
                      <li className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50">
                        Reservations
                      </li>
                    </Link>
                    <Link href="/properties">
                      <li className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50">
                        Properties
                      </li>
                    </Link>
                    <Link href="/trips">
                      <li className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50">
                        Trips
                      </li>
                    </Link>
                  </>
                )}

                <li className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50">
                  Help Center
                </li>

                {session ? (
                  <li
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
                  >
                    Sign out
                  </li>
                ) : (
                  <>
                    <li
                      onClick={() => openRegister()}
                      className="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                      Sign up
                    </li>
                    <li
                      onClick={() => openLogin()}
                      className="cursor-pointer bg-gray-900 px-4 py-3 text-white transition-colors hover:bg-black"
                    >
                      Sign in
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* -------------------------------------------------- */
/*  Custom hamburger — 2 bars → X morph, flat, unique */
/* -------------------------------------------------- */

function HamburgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={open}
      className="relative grid h-8 w-8 cursor-pointer place-items-center transition-colors hover:bg-gray-100"
    >
      <span className="relative block h-3 w-4">
        {/* Top bar */}
        <span
          className={`absolute left-0 h-[1.5px] w-full bg-gray-800 transition-all duration-300 ease-out ${
            open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
          }`}
        />
        {/* Bottom bar */}
        <span
          className={`absolute left-0 h-[1.5px] w-full bg-gray-800 transition-all duration-300 ease-out ${
            open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
          }`}
        />
      </span>
    </button>
  );
}

/* --------------------------------------------- */
/*  Guest Segment — flat, unique, no radius      */
/* --------------------------------------------- */

function GuestSegment({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group/guest hidden items-center gap-2 border-b border-none px-4 text-sm transition-colors hover:bg-gray-50 md:flex"
    >
      

      <span className="font-medium text-gray-500 transition-colors group-hover/guest:text-gray-900">
       Any guests?
      </span>
    </button>
  );
}