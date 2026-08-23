import ScoreBreakdown from './ScoreBreakdown'
import { Card, Chips, ScoreRing } from './ui'

function FitBadge({ label, value }) {
  return (
    <div
      className={`rounded-md border px-3 py-2 text-xs font-medium ${
        value ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'
      }`}
    >
      {label}
      <span className="ml-2 font-semibold">{value ? '✓ Meets requirement' : 'Does not meet requirement'}</span>
    </div>
  )
}

export default function ScreeningResult({ match, scoring, heading, caption }) {
  return (
    <div className="space-y-4">
      <Card title={heading} description={caption}>
        <div className="flex flex-wrap items-center gap-8">
          <ScoreRing value={match.matchScore} label="Match score" />
          <div className="min-w-[280px] flex-1 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                AI screening summary
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                {match.summary || 'No summary text was returned.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FitBadge label="Experience fit" value={match.experienceFit} />
              <FitBadge label="Education fit" value={match.educationFit} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Matched skills">
          <Chips items={match.matchedSkills} tone="matched" />
        </Card>
        <Card title="Missing required skills">
          <Chips items={match.missingRequiredSkills} tone="missing" empty="None reported." />
        </Card>
        <Card title="Preferred skills matched">
          <Chips items={match.preferredSkillsMatched} empty="None reported." />
        </Card>
      </div>

      {scoring && <ScoreBreakdown scoring={scoring} />}
    </div>
  )
}
