export default function Sidebar({ pages, active, onSelect }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-slate-900 px-3 py-6 max-md:w-full">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-md border border-emerald-500/60 text-sm font-bold text-emerald-400">
          S
        </span>
        <span className="text-sm font-semibold leading-tight text-white">
          Smart Resume
          <br />
          Screener
        </span>
      </div>

      <nav className="grid gap-0.5 max-md:grid-cols-3">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onSelect(page.id)}
            className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
              active === page.id
                ? 'bg-slate-800 font-semibold text-white shadow-[inset_3px_0_0_0_#10b981]'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
            }`}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <p className="mt-auto px-2 pt-8 text-[11px] leading-relaxed text-slate-500 max-md:hidden">
        Screening uses job-relevant candidate information only.
      </p>
    </aside>
  )
}
