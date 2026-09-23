import clsx from "clsx";
import { IconType } from "react-icons";

interface CategoryCardProps {
  label: string;
  icon: IconType;
  selected?: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  label,
  icon: Icon,
  selected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group relative flex flex-col items-start gap-3 border p-5 text-left transition-all duration-300",
        selected
          ? "border-[#e8c46b] bg-[#e8c46b]/[0.06] text-[#e8c46b] shadow-[0_0_20px_rgba(232,196,107,0.15)]"
          : "border-white/[0.1] text-[#f5f3ee]/60 hover:border-white/30 hover:text-[#f5f3ee]"
      )}
    >
      {/* Corner ticks when selected — futuristic signal */}
      {selected && (
        <>
          <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#e8c46b]" />
          <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-[#e8c46b]" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#e8c46b]" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#e8c46b]" />
        </>
      )}

      <Icon size={28} />

      <span className="text-base font-medium tracking-tight">{label}</span>
    </button>
  );
}