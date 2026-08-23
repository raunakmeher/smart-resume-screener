import { Button, Card, Chips, Empty, PageHeader } from './ui'

function GapView({ gap }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Matched skills">
        <Chips items={gap.matchedSkills} tone="matched" />
      </Card>
      <Card title="Missing required skills">
        <Chips items={gap.missingRequiredSkills} tone="missing" empty="None reported." />
      </Card>
      <Card title="Missing preferred skills">
        <Chips items={gap.missingPreferredSkills} empty="None reported." />
      </Card>
      <Card title="Experience gap">
        <p className="text-sm leading-relaxed text-slate-700">{gap.experienceGap || 'None reported.'}</p>
      </Card>
      <Card title="Recommendations" className="lg:col-span-2">
        {gap.recommendations?.length ? (
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {gap.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-slate-400">No recommendations returned.</p>
        )}
      </Card>
    </div>
  )
}

export default function SkillGap({ gap, adHocGap, onAnalyze, onAnalyzeProfiles, ready, hasProfiles, busy }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Candidate against the selected job"
        title="Skill Gap"
        description="Compares the stored candidate profile with the stored job requirements."
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={onAnalyze} disabled={!ready || busy === 'gap'}>
              {busy === 'gap' ? 'Analyzing…' : 'Analyze Skill Gap'}
            </Button>
            <Button variant="secondary" onClick={onAnalyzeProfiles} disabled={!hasProfiles || busy === 'gap-adhoc'}>
              {busy === 'gap-adhoc' ? 'Analyzing…' : 'Analyze current profiles'}
            </Button>
          </div>
        }
      />

      {gap ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Stored resume and job</h3>
          <GapView gap={gap} />
        </div>
      ) : (
        <Empty
          title="No skill-gap analysis yet"
          description="Process a resume and a job description, then run the analysis for that pair."
        />
      )}

      {adHocGap && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Analysis of the profiles currently loaded in this session
          </h3>
          <GapView gap={adHocGap} />
        </div>
      )}
    </div>
  )
}
