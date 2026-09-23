import Listings from "@/components/listings/Listings";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import StayTypeTabs from "@/components/listings/StayTypeTabs";
import { Suspense } from "react";
import NeonRoomBackground from "@/components/general/NeonRoomBackground";
import Footer from "@/components/footer/Footer";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  // Default to "short" when nothing is set
  const rawStay = searchParams.stay;
  const stay = rawStay === "long" ? "long" : "short";

  return (
    <main className="relative min-h-screen w-full bg-[#0e0d0b] text-[#f3efe7] antialiased selection:bg-[#e8c46b] selection:text-[#0e0d0b]">
      {/* Ambient background — warm charcoal with a brass + pine duo-tone, plus fine grain */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-56 -left-40 h-[38rem] w-[38rem] rounded-full bg-[#e8c46b]/[0.08] blur-[140px]" />
        <div className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-[#2f3b2e]/25 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Hero — asymmetric split: headline left, a quiet fact panel right, neon room lingering behind both */}
      <section className="relative isolate mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 overflow-hidden px-6 pt-28 pb-14 sm:px-10 sm:pt-36 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-8 lg:px-16 lg:pt-44 lg:pb-20">
        {/* Rotating neon room — lingers behind the hero copy, never above it */}
        <NeonRoomBackground className="-z-10" />

        <div className="relative z-10">
          <h1 className="font-moonhouse uppercase text-balance text-[2.75rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl md:text-[4.75rem]">
            Spaces worth
            <br />
            <span className="font-nouvelle  text-[.8em] font-normal italic text-[#e8c46b]/95">
              coming home to
            </span>
          </h1>

          <p className="mt-7 max-w-md text-balance text-[1.05rem] leading-relaxed text-[#f3efe7]/60">
            A handpicked collection of listings, thoughtfully chosen for the way
            you actually want to live.
          </p>
        </div>

        {/* Quiet fact panel — hairline-divided, informational rather than decorative */}
        <div className="relative z-10 px-7 py-6 backdrop-blur-sm lg:mb-1">
          <dl className="divide-y divide-[#dcba66]/30">
            <div className="flex items-baseline justify-between py-2.5 first:pt-0 last:pb-0">
              <dt className="text-sm text-[#f3efe7]/50">Every listing</dt>
              <dd className="text-sm text-[#f3efe7]/90">Personally verified</dd>
            </div>
            <div className="flex items-baseline justify-between py-2.5 first:pt-0 last:pb-0">
              <dt className="text-sm text-[#f3efe7]/50">Booking fees</dt>
              <dd className="text-sm text-[#f3efe7]/90">None, ever</dd>
            </div>
            <div className="flex items-baseline justify-between py-2.5 first:pt-0 last:pb-0">
              <dt className="text-sm text-[#f3efe7]/50">Cancellations</dt>
              <dd className="text-sm text-[#f3efe7]/90">Flexible by default</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Stay type tabs */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-16">
        <div className="h-px w-full bg-white/10" />
        <div className="pt-8">
          <StayTypeTabs active={stay} />
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-28 sm:px-10 lg:px-16">
        <Suspense fallback={<ListingGridSkeleton />}>
          <Listings searchParams={searchParams} />
        </Suspense>
      </section>

            {/* Footer */}
      <Footer />
    </main>
  );
}

function ListingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}