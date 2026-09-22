import Link from "next/link";

type StayType = "short" | "long";

const TABS: { value: StayType; label: string; hint: string }[] = [
  { value: "short", label: "Short Stay", hint: "Nightly · weekend" },
  { value: "long", label: "Long Stay", hint: "Monthly · extended" },
];

export default function StayTypeTabs({ active }: { active: StayType }) {
  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Stay type"
        className="relative flex items-stretch border border-white/10 bg-white/[0.02]"
      >
        {TABS.map(({ value, label, hint }, i) => {
          const isActive = active === value;
          return (
            <Link
              key={value}
              href={`/?stay=${value}`}
              role="tab"
              aria-selected={isActive}
              scroll={false}
              className={`group relative flex min-w-[160px] flex-col items-start gap-0.5 px-6 py-3 text-left transition-colors sm:min-w-[200px] ${
                i === 1 ? "border-l border-white/10" : ""
              } ${
                isActive
                  ? "bg-white text-black"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="text-sm font-semibold tracking-tight">
                {label}
              </span>
              <span
                className={`text-[11px] uppercase tracking-wider ${
                  isActive ? "text-black/50" : "text-white/40"
                }`}
              >
                {hint}
              </span>

              {/* active underline accent */}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-[2px] origin-left transition-transform duration-300 ${
                  isActive
                    ? "scale-x-100 bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                    : "scale-x-0 bg-white/40 group-hover:scale-x-100"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}