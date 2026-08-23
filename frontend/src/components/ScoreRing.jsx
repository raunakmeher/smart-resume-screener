import { toPercent } from '../lib/format'

export default function ScoreRing({ value, label, size = 152 }) {
  const percentage = toPercent(value)

  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(#059669 ${percentage * 3.6}deg, #e2e8f0 0deg)` }}
    >
      <div
        className="grid place-items-center rounded-full bg-white text-center"
        style={{ width: size - 22, height: size - 22 }}
      >
        <div>
          <p className="text-3xl font-semibold tracking-tight text-slate-900">{Math.round(percentage)}%</p>
          {label && (
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          )}
        </div>
      </div>
    </div>
  )
}
