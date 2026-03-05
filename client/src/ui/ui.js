// client/src/ui/ui.js
export const ui = {
  // page wrapper (inside main area)
  page: "space-y-5",

  // headers
  pageHeaderCard:
    "rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
  pageHeaderInner: "p-6",
  h1: "text-[34px] font-extrabold tracking-tight leading-[1.05]",
  sub: "mt-1 text-sm text-white/55",

  // cards
  card: "rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
  cardPad: "p-6",
  cardPadSm: "p-5",

  // chips / badges
  chip: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/70",

  // inputs
  input:
    "w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[13px] text-white/90 outline-none placeholder:text-white/35 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10",

  // buttons
  btn: "rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-semibold text-white/85 hover:bg-white/[0.08] transition",
  btnPrimary:
    "rounded-xl bg-purple-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-purple-500 transition shadow-[0_18px_40px_rgba(124,58,237,0.25)]",
  btnDanger:
    "rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2 text-[13px] font-semibold text-white/85 hover:bg-red-500/15 transition",

  // select (custom arrow)
  select:
    "w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 pr-10 text-[13px] text-white/90 outline-none focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10",
};
