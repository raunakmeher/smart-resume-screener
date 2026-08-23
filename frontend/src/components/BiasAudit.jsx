import { Card, Empty, PageHeader } from './ui'

function AttributeList({ title, items, tone }) {
  return (
    <Card title={title}>
      <ul className="space-y-2.5">
        {items?.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
            <span className={tone === 'used' ? 'font-bold text-emerald-600' : 'font-bold text-slate-400'}>✓</span>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function BiasAudit({ audit }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Screening transparency"
        title="Bias-Aware Screening"
        description="Candidate matching uses job-relevant information."
      />

      {audit ? (
        <>
          <Card title="Audit statement">
            <p className="text-sm leading-relaxed text-slate-700">{audit.explanation}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Before matching, the backend rebuilds each candidate from skills, experience, education, projects and
              total experience only. These attributes are excluded from candidate matching.
            </p>
          </Card>
          <div className="grid gap-4 lg:grid-cols-2">
            <AttributeList title="Used for screening" items={audit.usedAttributes} tone="used" />
            <AttributeList title="Excluded from screening" items={audit.excludedAttributes} tone="excluded" />
          </div>
        </>
      ) : (
        <Empty
          title="Audit unavailable"
          description="The transparency audit could not be retrieved from the backend."
        />
      )}
    </div>
  )
}
