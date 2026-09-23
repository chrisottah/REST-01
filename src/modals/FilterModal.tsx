"use client";

import { useFilterModal } from "@/store/useFilterListingModal";
import Modal from "./Modal";
import { Suspense, useState } from "react";
import useCountries, { Country } from "@/custom-hooks/useCountries";
import Button from "@/components/ui/Button";
import { categories } from "@/constants/Categories";
import CategoryCard from "@/components/listings/CategoryCard";
import CountrySelect from "@/components/listings/CountrySelect";
import dynamic from "next/dynamic";
import Input from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  PRICE: 2,
};

const STEP_LABELS = ["Category", "Location", "Price"];

function FilterModalComponent() {
  const { getByValue } = useCountries();
  const searchParams = useSearchParams();
  const { isOpen, close } = useFilterModal();
  const [step, setStep] = useState(STEPS.CATEGORY);

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const router = useRouter();

  const getLocationFromParams = () => {
    const value = searchParams.get("locationValue");
    if (!value) return null;
    return getByValue(value) ?? null;
  };

  const [location, setLocation] = useState<null | Country>(
    getLocationFromParams(),
  );

  const MapComponent = dynamic(
    () => import("../components/general/map/MapComponent"),
    {
      ssr: false,
      loading: () => (
        <div className="grid h-full w-full place-items-center text-xs uppercase tracking-[0.18em] text-[#f5f3ee]/30">
          Loading map…
        </div>
      ),
    },
  );

  const onApplyFilters = () => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    if (location) params.set("locationValue", location.value);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.push(`/?${params.toString()}`);
    setStep(STEPS.CATEGORY);
    close();
  };

  const disableFilterButton =
    !category && !location && !minPrice && !maxPrice && step === STEPS.PRICE;

  const isLastStep = step === STEPS.PRICE;

  return (
    <Modal title="Filter listings" isOpen={isOpen} onClose={close}>
      {/* ────────── Progress: pills + gradient underline ────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className="group flex items-center gap-2.5"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isActive || isDone ? "bg-[#e8c46b]" : "bg-white/20"
                  }`}
                />
                <span
                  className={`text-xs uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? "text-[#f5f3ee]"
                      : isDone
                        ? "text-[#f5f3ee]/60 group-hover:text-[#f5f3ee]/90"
                        : "text-[#f5f3ee]/35 group-hover:text-[#f5f3ee]/60"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-5 h-[2px] w-full bg-white/[0.08]">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#e8c46b] via-[#f0d98a] to-[#dcf499] transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* ────────── Step content ────────── */}
      <div className="min-h-[300px]">
        {step === STEPS.CATEGORY && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((item) => (
              <CategoryCard
                key={item.slug}
                label={item.label}
                icon={item.icon}
                onClick={() => setCategory(item.slug)}
                selected={category === item.slug}
              />
            ))}
          </div>
        )}

        {step === STEPS.LOCATION && (
          <div className="space-y-4">
            <CountrySelect
              value={location}
              onChange={(value) => setLocation(value)}
            />

            <div className="h-72 overflow-hidden border border-white/[0.08]">
              <MapComponent center={location?.latlng || [51.505, -0.09]} />
            </div>
          </div>
        )}

        {step === STEPS.PRICE && (
          <div className="space-y-7 py-2">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min price"
                name="min-price"
                type="number"
                value={minPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMinPrice(e.target.value)
                }
              />
              <Input
                label="Max price"
                name="max-price"
                type="number"
                value={maxPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMaxPrice(e.target.value)
                }
              />
            </div>

            {/* Quick range presets — futuristic chips */}
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#f5f3ee]/35">
                Quick ranges
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Under $100", min: "", max: "100" },
                  { label: "$100 – $300", min: "100", max: "300" },
                  { label: "$300 – $600", min: "300", max: "600" },
                  { label: "$600+", min: "600", max: "" },
                ].map((preset) => {
                  const active =
                    minPrice === preset.min && maxPrice === preset.max;
                  return (
                    <FuturisticChip
                      key={preset.label}
                      label={preset.label}
                      active={active}
                      onClick={() => {
                        setMinPrice(preset.min);
                        setMaxPrice(preset.max);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ────────── Footer with futuristic buttons ────────── */}
      <div className="mt-10 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-6">
        <button
          type="button"
          onClick={() => {
            setCategory("");
            setLocation(null);
            setMinPrice("");
            setMaxPrice("");
          }}
          className="group relative text-[10px] uppercase tracking-[0.18em] text-[#f5f3ee]/40 transition-colors hover:text-[#f5f3ee]"
        >
          Clear all
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#e8c46b] transition-transform duration-300 group-hover:scale-x-100" />
        </button>

        <div className="flex gap-3">
          {step > STEPS.CATEGORY && (
            <FuturisticButton
              onClick={() => setStep((prev) => prev - 1)}
              variant="ghost"
            >
              Back
            </FuturisticButton>
          )}

          <FuturisticButton
            disabled={disableFilterButton}
            onClick={() =>
              isLastStep ? onApplyFilters() : setStep((prev) => prev + 1)
            }
            variant="primary"
          >
            {isLastStep ? "Apply filters" : "Next"}
          </FuturisticButton>
        </div>
      </div>
    </Modal>
  );
}

export default function FilterModal() {
  return (
    <Suspense>
      <FilterModalComponent />
    </Suspense>
  );
}

/* ═══════════════════════════════════════════════ */
/*  Futuristic Button                              */
/*  — Sharp corners, hairline border, corner ticks */
/*  — Radial glow on hover, brass scan-line        */
/* ═══════════════════════════════════════════════ */

function FuturisticButton({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative isolate overflow-hidden px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${
        isPrimary
          ? "bg-[#e8c46b] text-[#0a0a0a] hover:shadow-[0_0_24px_rgba(232,196,107,0.35)]"
          : "border border-white/15 bg-transparent text-[#f5f3ee]/70 hover:border-white/40 hover:text-[#f5f3ee]"
      }`}
    >
      {/* Corner ticks (primary only) */}
      {isPrimary && (
        <>
          <span className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-[#0a0a0a]/40" />
          <span className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-[#0a0a0a]/40" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-[#0a0a0a]/40" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-[#0a0a0a]/40" />
        </>
      )}

      {/* Scan-line sweep on hover */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent ${
          isPrimary ? "via-white/40" : "via-white/10"
        } to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full`}
      />

      <span className="relative z-10">{children}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════ */
/*  Futuristic Chip                                */
/* ═══════════════════════════════════════════════ */

function FuturisticChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative border px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
        active
          ? "border-[#e8c46b] bg-[#e8c46b]/10 text-[#e8c46b] shadow-[0_0_18px_rgba(232,196,107,0.15)]"
          : "border-white/[0.1] text-[#f5f3ee]/60 hover:border-white/30 hover:text-[#f5f3ee]"
      }`}
    >
      {label}
      {/* Dot indicator when active */}
      {active && (
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 bg-[#e8c46b]" />
      )}
    </button>
  );
}