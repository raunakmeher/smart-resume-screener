import { Button, Card, Chips, Empty, Note, PageHeader, Pct, ScoreBar, ScoreRing } from './ui'

const COLUMNS = ['Rank', 'Candidate', 'Final Score', 'Required Skills', 'Semantic', 'Experience', 'Preferred Skills', 'Status']

function CandidateDetail({ candidate, onClose }) {
  const components = [
    ['Required Skill Score', candidate.requiredSkillScore],
    ['Semantic Score', candidate.semanticScore],
    ['Experience Score', candidate.experienceScore],
    ['Preferred Skill Score', candidate.preferredSkillScore],
  ]

  return (
    <Card
      title={`Candidate detail · Resume #${candidate.resumeId}`}
      description="Stored screening result for this candidate and job."
      action={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-8">
        <ScoreRing value={candidate.finalScore} label="Final score" />
        <div className="min-w-[260px] flex-1 space-y-4">
          {components.map(([label, value]) => (
            <ScoreBar key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-700">Matched skills</p>
          <Chips items={candidate.matchedSkills} tone="matched" />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-700">Missing required skills</p>
          <Chips items={candidate.missingRequiredSkills} tone="missing" empty="None reported." />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">AI explanation</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
          {candidate.summary || 'No summary text was stored for this result.'}
        </p>
      </div>

      <p className="mt-5 text-xs text-slate-500">
        The ranking endpoint returns rank, scores, matched skills, missing required skills and the summary. Candidate
        names, experience fit and education fit are not part of that response.
      </p>
    </Card>
  )
}

export default function CandidateRanking({
  job,
  ranking,
  threshold,
  onThresholdChange,
  onLoad,
  selected,
  onSelect,
  busy,
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Stored screening results for the selected job"
        title="Candidate Ranking"
        description="Candidates are ordered by final hybrid score, highest first."
        action={
          <Button onClick={onLoad} disabled={!job || busy === 'ranking'}>
            {busy === 'ranking' ? 'Loading…' : 'Load Ranking'}
          </Button>
        }
      />

      <Card title="Shortlist threshold" description="Sent with each ranking request to decide shortlist status.">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="number"
              min="0"
              max="100"
              value={threshold}
              onChange={(event) => onThresholdChange(event.target.value)}
              className="w-20 rounded-md border border-slate-300 px-2.5 py-1.5 text-center text-sm outline-none focus:border-emerald-500"
            />
            %
          </label>
          <p className="text-sm text-slate-600">
            Candidates scoring at or above <b>{threshold}%</b> are marked shortlisted by the backend. The backend does
            not store a per-job threshold, so this value applies to the current request only.
          </p>
        </div>
      </Card>

      {ranking ? (
        ranking.candidates?.length ? (
          <>
            <Card
              title={`${ranking.candidateCount} candidate${ranking.candidateCount === 1 ? '' : 's'} ranked`}
              description="Select a row to open the stored screening explanation."
            >
              <div className="-mx-5 -my-4 overflow-x-auto">
                <table className="w-full min-w-[820px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {COLUMNS.map((column) => (
                        <th key={column} className="px-4 py-3">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {ranking.candidates.map((candidate) => (
                      <tr
                        key={candidate.resumeId}
                        onClick={() => onSelect(candidate)}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900">{candidate.rank}</td>
                        <td className="px-4 py-3">Resume #{candidate.resumeId}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <Pct value={candidate.finalScore} />
                        </td>
                        <td className="px-4 py-3">
                          <Pct value={candidate.requiredSkillScore} />
                        </td>
                        <td className="px-4 py-3">
                          <Pct value={candidate.semanticScore} />
                        </td>
                        <td className="px-4 py-3">
                          <Pct value={candidate.experienceScore} />
                        </td>
                        <td className="px-4 py-3">
                          <Pct value={candidate.preferredSkillScore} />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-1 text-xs font-semibold ${
                              candidate.shortlisted
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {candidate.shortlisted ? 'Shortlisted' : 'Below threshold'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            {selected && <CandidateDetail candidate={selected} onClose={() => onSelect(null)} />}
          </>
        ) : (
          <Empty
            title="No stored screening results for this job"
            description="Ranking reads the screening_results table, and the current screening endpoint returns results without writing them there, so this list stays empty until that persistence exists."
          />
        )
      ) : (
        <Empty
          title="Ranking not loaded"
          description="Process a job description, then load its ranking to see stored candidate results."
        />
      )}

      <Note>
        Ranking is a read of previously stored screening results. Running a screening in this session does not add a
        row, because the backend does not persist screening output.
      </Note>
    </div>
  )
}
