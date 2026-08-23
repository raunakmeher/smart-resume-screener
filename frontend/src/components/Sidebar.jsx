export default function Sidebar({ pages, active, onSelect }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[#0b1f35] px-3 py-6 max-lg:w-full max-lg:py-4">
      <div className="mb-8 flex items-center gap-2.5 px-2 max-lg:mb-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-500/60 text-sm font-bold text-emerald-400">
          SR
        </span>
        <span className="text-sm font-semibold text-white">SmartResume</span>
      </div>

      <nav className="grid gap-0.5 max-lg:grid-cols-4 max-sm:grid-cols-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onSelect(page.id)}
            className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              active === page.id
                ? 'bg-white/10 font-semibold text-white shadow-[inset_3px_0_0_0_#10b981]'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
            }`}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <p className="mt-auto px-2 pt-8 text-[11px] leading-relaxed text-slate-500 max-lg:hidden">
        Screening uses job-relevant candidate information only.
      </p>
    </aside>
  )
}
