import Link from "next/link";

type StayType = "short" | "long";

const TABS: { value: StayType; label: string; hint: string }[] = [
  { value: "short", label: "Short Stay", hint: "Nightly" },
  { value: "long", label: "Long Stay", hint: "Monthly / Annually" },
];

export default function StayTypeTabs({ active }: { active: StayType }) {
  const activeIndex = TABS.findIndex((t) => t.value === active);

  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Stay type"
        className="relative grid grid-cols-2 rounded-xl border-white/12 bg-white/[0.03] p-1 backdrop-blur-xl font-brilo"
      >
        {/* sliding indicator — glass fill + gradient underline, both animate together */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] transition-transform duration-300 ease-out"
          style={{
            transform:
              activeIndex === 1 ? "translateX(calc(100% + 8px))" : "translateX(0)",
          }}
        >
          <span className="block h-full w-full rounded-lg bg-white/[0.06] shadow-[0_0_24px_rgba(220,186,102,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]" />
          <span
            className="absolute inset-x-4 bottom-0 h-[2px] rounded-full"
            style={{ background: "linear-gradient(90deg, #dcba66, #e7f399)" }}
          />
        </span>

        {TABS.map(({ value, label, hint }) => {
          const isActive = active === value;
          return (
            <Link
              key={value}
              href={`/?stay=${value}`}
              role="tab"
              aria-selected={isActive}
              scroll={false}
              className={`group relative z-10 flex min-w-[150px] flex-col items-start gap-1 rounded-lg px-6 py-3 text-left transition-colors sm:min-w-[200px] ${
                isActive ? "text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    isActive
                      ? "bg-[#dcba66] shadow-[0_0_8px_rgba(220,186,102,0.9)]"
                      : "bg-white/20 group-hover:bg-white/40"
                  }`}
                />
                {label}
              </span>
              <span
                className={`pl-[14px] text-[11px] uppercase tracking-wider ${
                  isActive ? "text-white/50" : "text-white/30"
                }`}
              >
                {hint}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}