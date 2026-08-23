const BUCKETS = [
  ['0-19', 0, 20],
  ['20-39', 20, 40],
  ['40-59', 40, 60],
  ['60-79', 60, 80],
  ['80-100', 80, 101],
]

export default function ScoreDistribution({ scores }) {
  const counts = BUCKETS.map(([label, min, max]) => ({
    label,
    count: scores.filter((score) => score >= min && score < max).length,
  }))

  const highest = Math.max(...counts.map((bucket) => bucket.count), 1)

  return (
    <div className="flex items-end gap-3">
      {counts.map((bucket) => (
        <div key={bucket.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">{bucket.count}</span>
          <div
            className="w-full rounded-t bg-emerald-600/85"
            style={{ height: `${Math.max(4, (bucket.count / highest) * 110)}px` }}
          />
          <span className="text-[11px] text-slate-500">{bucket.label}</span>
        </div>
      ))}
    </div>
  )
}
