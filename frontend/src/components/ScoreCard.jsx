import { roundPercent, toPercent } from '../lib/format'

export function ProgressBar({ value, tone = 'emerald' }) {
  const fill = tone === 'amber' ? 'bg-amber-500' : tone === 'red' ? 'bg-red-500' : 'bg-emerald-600'
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${toPercent(value)}%` }} />
    </div>
  )
}

export default function ScoreCard({ label, value, emphasis = false }) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        emphasis ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{roundPercent(value)}%</p>
      <div className="mt-2">
        <ProgressBar value={value} />
      </div>
    </div>
  )
}
