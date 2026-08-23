import { Card, ScoreBar, ScoreRing } from './ui'

export default function ScoreBreakdown({ scoring }) {
  const components = [
    ['Required Skill Score', scoring.requiredSkillScore],
    ['Semantic Score', scoring.semanticScore],
    ['Experience Score', scoring.experienceScore],
    ['Preferred Skill Score', scoring.preferredSkillScore],
  ]

  return (
    <Card
      title="Hybrid Score"
      description="Final score combines job-specific deterministic signals with semantic matching."
    >
      <div className="flex flex-wrap items-center gap-8">
        <ScoreRing value={scoring.finalScore} label="Final score" />
        <div className="min-w-[260px] flex-1 space-y-4">
          {components.map(([label, value]) => (
            <ScoreBar key={label} label={label} value={value} />
          ))}
        </div>
      </div>
    </Card>
  )
}
