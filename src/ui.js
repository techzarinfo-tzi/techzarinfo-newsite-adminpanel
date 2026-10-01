// Shared Tailwind classes, styled after the website's pill buttons and light-blue cards.
const btn =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export const btnPrimary = `${btn} bg-linear-to-br from-brand to-navy text-white shadow-md shadow-brand/25 hover:from-brand-hover hover:to-navy-deep`;
export const btnDark = `${btn} bg-navy text-white shadow-md hover:bg-navy-mid`;
export const btnGhost = `${btn} border border-sky-line bg-white text-navy hover:border-brand/40 hover:bg-sky-tint`;

export const card = "rounded-2xl border border-sky-line bg-white shadow-sm shadow-navy/5";

export const input =
  "w-full rounded-xl border border-sky-line bg-white px-4 py-2.5 text-[15px] text-navy placeholder:text-muted/70 outline-none transition focus:border-brand/60 focus:ring-4 focus:ring-brand/15";

export const errorBox = "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800";
