import { Card, Empty, Note, ScoreRing } from './ui'

const STAGES = [
  'Job Description',
  'Resume Processing',
  'AI Screening',
  'Hybrid Scoring',
  'Ranking',
  'Skill Gap',
]

const CAPABILITIES = [
  ['Resume PDF upload and text extraction', 'POST /api/resumes/upload'],
  ['Gemini resume extraction, stored on the resume record', 'POST /api/resumes/{id}/analyze'],
  ['Resume extraction from pasted text, not stored', 'POST /api/resumes/test-ai'],
  ['Resume text length validation, no storage or analysis', 'POST /api/resumes/text'],
  ['Job creation', 'POST /api/jobs'],
  ['Gemini job requirement extraction, stored on the job record', 'POST /api/jobs/{id}/analyze'],
  ['Job parsing preview from a description, not stored', 'POST /api/jobs/test-ai'],
  ['Stored job title and description lookup', 'GET /api/jobs/{id}'],
  ['Bias-filtered semantic screening with hybrid scoring', 'POST /api/screening/resume/{r}/job/{j}'],
  ['Semantic match driven by recruiter screening instructions, not stored', 'POST /api/resumes/test-match'],
  ['Skill-gap analysis for a stored resume and job', 'POST /api/skill-gap/resume/{r}/job/{j}'],
  ['Skill-gap analysis for supplied profiles, not stored', 'POST /api/screening/test-skill-gap'],
  ['Candidate ranking for a job with a shortlist threshold', 'GET /api/ranking/job/{id}?threshold='],
  ['Screening transparency audit', 'GET /api/bias/audit'],
]

export default function Overview({ screening }) {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Smart Resume Screener</h2>
        <p className="mt-2 text-sm text-slate-600">
          AI-assisted candidate screening with explainable, job-relevant scoring.
        </p>
      </div>

      <Card title="Processing workflow" description="Each stage maps to an implemented backend operation.">
        <ol className="flex flex-wrap gap-2">
          {STAGES.map((stage, index) => (
            <li
              key={stage}
              className="flex flex-1 min-w-[150px] items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-300 bg-white text-xs font-bold text-emerald-700">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-slate-800">{stage}</span>
            </li>
          ))}
        </ol>
      </Card>

      {screening ? (
        <Card title="Most recent screening result" description="Returned by the screening endpoint in this session.">
          <div className="flex flex-wrap items-center gap-6">
            <ScoreRing value={screening.scoring?.finalScore} label="Final score" />
            <p className="min-w-[260px] flex-1 text-sm leading-relaxed text-slate-700">
              {screening.match?.summary || 'No summary text was returned.'}
            </p>
          </div>
        </Card>
      ) : (
        <Empty
          title="No screening result yet"
          description="Process a job description and a resume, then run screening to see a result here."
        />
      )}

      <Card title="Implemented backend capabilities" description="Every screen in this dashboard maps to one of these endpoints.">
        <ul className="divide-y divide-slate-100">
          {CAPABILITIES.map(([label, endpoint]) => (
            <li key={endpoint} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span className="text-sm text-slate-700">{label}</span>
              <code className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-600">{endpoint}</code>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Note>
            The screening endpoint returns results but does not write them to the screening_results table, so the
            ranking endpoint only lists candidates that already exist in that table.
          </Note>
        </div>
      </Card>
    </div>
  )
}
