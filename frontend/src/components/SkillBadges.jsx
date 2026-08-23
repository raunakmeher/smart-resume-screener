import StatusBadge from './StatusBadge'

export default function SkillBadges({ items, tone = 'neutral', empty = 'Not returned for this request.' }) {
  if (!items?.length) return <p className="text-sm text-slate-400">{empty}</p>

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <StatusBadge key={`${item}-${index}`} tone={tone} className="font-medium">
          {item}
        </StatusBadge>
      ))}
    </div>
  )
}
