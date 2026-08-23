const clamp = (value) => Math.max(0, Math.min(100, Number(value) || 0))

const CHIP_TONES = {
  matched: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  missing: 'border-red-200 bg-red-50 text-red-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
}

export function Pct({ value }) {
  return <>{Math.round(clamp(value))}%</>
}

export function Card({ title, description, action, children, className = '' }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles =
    variant === 'primary'
      ? 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500'
      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:text-slate-400'
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Chips({ items, tone = 'neutral', empty = 'Not returned by the backend for this request.' }) {
  if (!items?.length) return <p className="text-sm text-slate-400">{empty}</p>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={`rounded border px-2 py-1 text-xs font-medium ${CHIP_TONES[tone]}`}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export function ScoreRing({ value, label, size = 148 }) {
  const percentage = clamp(value)
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#059669 ${percentage * 3.6}deg, #e2e8f0 0deg)`,
      }}
    >
      <div
        className="grid place-items-center rounded-full bg-white text-center"
        style={{ width: size - 22, height: size - 22 }}
      >
        <div>
          <p className="text-3xl font-semibold tracking-tight text-slate-900">{Math.round(percentage)}%</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

export function ScoreBar({ label, value }) {
  const percentage = clamp(value)
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{Math.round(percentage)}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export function Empty({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mx-auto mt-1 max-w-xl text-sm text-slate-500">{description}</p>
    </div>
  )
}

export function Note({ children }) {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
      {children}
    </p>
  )
}

export function DetailList({ items }) {
  if (!items?.length) return <p className="text-sm text-slate-400">Not returned by the backend for this request.</p>
  return (
    <ul className="space-y-2 text-sm text-slate-600">
      {items.map((item, index) => (
        <li key={index} className="border-l-2 border-slate-200 pl-3">
          {typeof item === 'string' ? item : Object.values(item).filter(Boolean).join(' · ')}
        </li>
      ))}
    </ul>
  )
}
