import Listings from "@/components/listings/Listings";
import ListingCardSkeleton from "@/components/skeletons/ListingCardSkeleton";
import StayTypeTabs from "@/components/listings/StayTypeTabs";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  // Default to "short" when nothing is set
  const rawStay = searchParams.stay;
  const stay = rawStay === "long" ? "long" : "short";

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0b] text-white antialiased selection:bg-white selection:text-black">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-130 w-205 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-500/30 via-fuchsia-500/20 to-cyan-400/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-105 w-105 rounded-full bg-emerald-400/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      </div>

      {/* Hero */}
      <section className="flex w-full flex-col items-center px-6 pt-32 pb-10 text-center sm:px-10 sm:pt-40 sm:pb-12 lg:px-16">
        <h1 className="max-w-4xl text-balance bg-linear-to-b from-white via-white to-white/90 bg-clip-text text-5xl font-semibold leading-[1.05] tracking-tight text-transparent sm:text-6xl md:text-7xl">
          Discover spaces worth
          <br />
          <span className="italic font-light text-white">
            coming home to.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
          A handpicked collection of listings, thoughtfully designed for the way
          you actually want to live.
        </p>
      </section>

      {/* Stay type tabs */}
      <section className="w-full px-6 pb-10 sm:px-10 lg:px-16">
        <StayTypeTabs active={stay} />
      </section>

      {/* Listings */}
      <section className="w-full px-6 pb-24 sm:px-10 lg:px-16">
        <Suspense fallback={<ListingGridSkeleton />}>
          <Listings searchParams={searchParams} />
        </Suspense>
      </section>
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