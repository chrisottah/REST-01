"use client";

import { LuX } from "react-icons/lu";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`relative z-10 w-full max-w-lg overflow-hidden border border-white/[0.08] bg-black text-[#f5f3ee] shadow-[0_30px_80px_rgba(0,0,0,0.8)] transform transition-all duration-500 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {/* Corner ticks — futuristic framing */}
        <span className="pointer-events-none absolute left-0 top-0 z-10 h-3 w-3 border-l border-t border-[#e8c46b]/40" />
        <span className="pointer-events-none absolute right-0 top-0 z-10 h-3 w-3 border-r border-t border-[#e8c46b]/40" />
        <span className="pointer-events-none absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l border-[#e8c46b]/40" />
        <span className="pointer-events-none absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r border-[#e8c46b]/40" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[#f5f3ee]">
            {title}
          </h2>

          <button
            aria-label="Close Modal"
            onClick={onClose}
            className="grid h-8 w-8 cursor-pointer place-items-center border border-white/[0.1] text-[#f5f3ee]/60 transition-colors hover:border-[#e8c46b]/60 hover:text-[#e8c46b]"
          >
            <LuX size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}