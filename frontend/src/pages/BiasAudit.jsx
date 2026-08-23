import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import { EmptyState, LoadingState } from '../components/States'

function AttributeList({ items, tone }) {
  return (
    <ul className="space-y-2.5">
      {items?.map((item) => (
        <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
          <span className={tone === 'used' ? 'font-bold text-emerald-600' : 'font-bold text-slate-400'}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function BiasAudit({ audit, loading, onRetry }) {
  if (loading) return <LoadingState label="Loading the screening transparency audit…" />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Bias Audit</h2>
          <p className="mt-1 text-sm text-slate-600">Candidate screening passes through the bias filter.</p>
        </div>
        <StatusBadge tone={audit ? 'success' : 'neutral'}>
          {audit ? 'Audit available' : 'Audit unavailable'}
        </StatusBadge>
      </div>

      {audit ? (
        <>
          <Card title="Audit statement">
            <p className="text-sm leading-relaxed text-slate-700">{audit.explanation}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Before screening and skill-gap analysis, the backend rebuilds the candidate from skills, experience,
              education, projects and total experience only. The attributes listed on the right are excluded from
              candidate matching.
            </p>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Used for screening" description="Attributes reported by the audit endpoint.">
              <AttributeList items={audit.usedAttributes} tone="used" />
            </Card>
            <Card title="Excluded from screening" description="Attributes the audit endpoint reports as excluded.">
              <AttributeList items={audit.excludedAttributes} tone="excluded" />
            </Card>
          </div>
        </>
      ) : (
        <EmptyState
          title="Audit unavailable"
          description="The transparency audit could not be retrieved from the backend."
          action={
            <button onClick={onRetry} className="text-sm font-semibold text-emerald-700 underline">
              Retry
            </button>
          }
        />
      )}
    </div>
  )
}
