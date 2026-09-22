export default function ListingCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-3 backdrop-blur-sm">
      {/* Image area */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-white/4">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/6 to-transparent" />
      </div>

      {/* Text lines */}
      <div className="mt-4 space-y-3 px-1 pb-1">
        <div className="h-3 w-3/4 rounded-full bg-white/6" />
        <div className="h-3 w-1/2 rounded-full bg-white/4" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-16 rounded-full bg-white/6" />
          <div className="h-4 w-10 rounded-full bg-white/4" />
        </div>
      </div>
    </div>
  );
}