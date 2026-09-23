"use client";

import Image from "next/image";
import Logo from "./Logo";
import { LuSearch, LuPlus, LuGlobe } from "react-icons/lu";
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
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 h-18 w-full bg-[#0e0d0b]/85 backdrop-blur-xl lg:h-24">
      {/* hairline edge that gains a soft gradient charge once you scroll */}
      <div
        className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(220,186,102,0.55), rgba(111,123,209,0.5), transparent)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

      <div className="mx-auto flex h-full w-[95%] items-center justify-between gap-4 md:w-[90%]">
        {/* Left — Logo */}
        <Logo />

        {/* Center — Search console: dark bezel, hairline dividers, one gradient accent */}
        <div className="hidden items-stretch overflow-hidden rounded-lg border-b md:flex font-brilo leading-6">
          {/* Segment 1 — Anywhere */}
          <button
            onClick={openFilterModal}
            className="group/where flex items-center gap-2 pl-5 pr-4 text-sm font-medium text-white/65 transition-colors hover:text-white"
          >
            <LuGlobe
              size={16}
              strokeWidth={1.75}
              className=" text-white/50 transition-colors group-hover/where:text-[#dcba66]"
            />
            <span>Anywhere</span>
          </button>

          <span className="my-2.5 w-px bg-white/10" />

          {/* Segment 2 — Add guests: bottom border only, no box */}
          <GuestSegment onClick={openFilterModal} />

          <span className="my-2.5 w-px bg-white/10" />

          {/* Search — the one bold accent moment */}
          <button
            onClick={openFilterModal}
            aria-label="Search"
            className="m-1.5 grid aspect-square w-11 place-items-center rounded-md text-[#0a0a0b]  transition-shadow hover:shadow-[0_0_28px_rgba(111,123,209,0.45)]"
            style={{
              background: "transparent",
            }}
          >
            <LuSearch size={16} strokeWidth={2.5} color={"white"} cursor={"pointer"}   />
          </button>
        </div>

        {/* Right cluster */}
        <div className="relative flex items-center gap-3" ref={menuRef}>
          {session && !isPending && (
            <button
              onClick={openCreateListing}
              className="hidden items-center gap-1.5 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:border-white/25 hover:text-white md:flex"
            >
              <LuPlus size={15} strokeWidth={2.25} />
              List your home
            </button>
          )}

          <div className="flex items-center gap-2.5 rounded-lg  border-white/12 py-1.5 pl-3 pr-1.5">
            <HamburgerButton open={open} onClick={() => setOpen((p) => !p)} />

            {session && (
              <div className="relative h-7 w-7 overflow-hidden rounded-md border border-white/15 bg-white/5">
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
                    className="object-cover opacity-70"
                  />
                )}
              </div>
            )}
          </div>

          {/* dropdown menu — dark glass */}
          {open && (
            <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-xl border border-white/12 bg-[#0a0a0b]/95 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
              <ul className="text-sm text-white/85">
                {session && !isPending && (
                  <>
                    <li
                      onClick={openCreateListing}
                      className="cursor-pointer border-b border-white/8 px-5 py-3 transition-colors hover:bg-white/[0.06]"
                    >
                      List your home
                    </li>
                    <Link href="/favorites">
                      <li className="cursor-pointer border-b border-white/8 px-5 py-3 transition-colors hover:bg-white/[0.06]">
                        Favorites
                      </li>
                    </Link>
                    <Link href="/reservations">
                      <li className="cursor-pointer border-b border-white/8 px-5 py-3 transition-colors hover:bg-white/[0.06]">
                        Reservations
                      </li>
                    </Link>
                    <Link href="/properties">
                      <li className="cursor-pointer border-b border-white/8 px-5 py-3 transition-colors hover:bg-white/[0.06]">
                        Properties
                      </li>
                    </Link>
                    <Link href="/trips">
                      <li className="cursor-pointer border-b border-white/8 px-5 py-3 transition-colors hover:bg-white/[0.06]">
                        Trips
                      </li>
                    </Link>
                  </>
                )}

                <li className="cursor-pointer border-b border-white/8 px-5 py-3 text-white/60 transition-colors hover:bg-white/[0.06]">
                  Help Center
                </li>

                {session ? (
                  <li
                    onClick={handleLogout}
                    className="cursor-pointer px-5 py-3 text-red-400 transition-colors hover:bg-red-400/10"
                  >
                    Sign out
                  </li>
                ) : (
                  <>
                    <li
                      onClick={() => openRegister()}
                      className="cursor-pointer border-b border-white/8 px-5 py-3 transition-colors hover:bg-white/[0.06]"
                    >
                      Sign up
                    </li>
                    <li
                      onClick={() => openLogin()}
                      className="cursor-pointer px-5 py-3 font-medium text-[#0a0a0b] transition-opacity hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #dcba66, #6f7bd1)",
                      }}
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
/*  Custom hamburger — 2 bars → X morph                */
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
      className="relative grid h-7 w-7 cursor-pointer place-items-center rounded-md transition-colors hover:bg-white/8"
    >
      <span className="relative block h-3 w-4">
        {/* Top bar */}
        <span
          className={`absolute left-0 h-[1.5px] w-full bg-white transition-all duration-300 ease-out ${
            open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
          }`}
        />
        {/* Bottom bar */}
        <span
          className={`absolute left-0 h-[1.5px] w-full bg-white transition-all duration-300 ease-out ${
            open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
          }`}
        />
      </span>
    </button>
  );
}

/* --------------------------------------------- */
/*  Guest Segment — bottom border only, no box    */
/* --------------------------------------------- */

function GuestSegment({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="hidden items-center border-b border-white/20 px-4 pb-[3px] pt-[3px] text-sm font-medium text-white/50 transition-colors hover:border-white/50 hover:text-white md:flex"
    >
      Any guests?
    </button>
  );
}