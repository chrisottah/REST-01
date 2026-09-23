import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { label: "Short stay", href: "/?stay=short" },
      { label: "Long stay", href: "/?stay=long" },
      { label: "All listings", href: "/" },
      { label: "Favorites", href: "/favorites" },
    ],
  },
  {
    heading: "Host",
    links: [
      { label: "List your home", href: "/properties" },
      { label: "Your properties", href: "/properties" },
      { label: "Reservations", href: "/reservations" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4l16 16" />
        <path d="M20 4L4 20" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10v9" />
        <circle cx="4" cy="6" r="1.2" />
        <path d="M10 19v-5a3 3 0 0 1 6 0v5" />
        <path d="M10 10v9" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-white/[0.08] bg-black text-[#f5f3ee]">
      {/* Corner ticks — matches navbar / modal futuristic language */}
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#e8c46b]/40" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[#e8c46b]/40" />

      {/* ───────── Main grid ───────── */}
      <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-12">
          {/* Brand block — spans full width on mobile */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-block text-sm font-medium uppercase tracking-[0.24em] text-[#f5f3ee]"
            >
              Cribting
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f5f3ee]/50">
              A handpicked collection of short and long stay homes —
              thoughtfully chosen for the way you actually want to live.
            </p>

            {/* Socials */}
            <ul className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center border border-white/[0.1] text-[#f5f3ee]/60 transition-colors hover:border-[#e8c46b]/60 hover:text-[#e8c46b]"
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#f5f3ee]/35">
                {heading}
              </h3>

              <ul className="mt-5 space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group inline-flex items-center text-sm text-[#f5f3ee]/70 transition-colors hover:text-[#f5f3ee]"
                    >
                      <span className="relative">
                        {label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#e8c46b] transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ───────── Bottom bar ───────── */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.08] pt-6 sm:mt-16 sm:flex-row sm:items-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f5f3ee]/40">
            © {year} A6X Systems — All rights reserved
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-xs uppercase tracking-[0.18em] text-[#f5f3ee]/40 transition-colors hover:text-[#f5f3ee]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}