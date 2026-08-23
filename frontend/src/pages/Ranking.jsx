import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import ScoreCard, { ProgressBar } from '../components/ScoreCard'
import ScoreDistribution from '../components/ScoreDistribution'
import SkillBadges from '../components/SkillBadges'
import StatusBadge from '../components/StatusBadge'
import { EmptyState, InfoNote, LoadingState } from '../components/States'
import { Select, TextField } from '../components/Inputs'
import { roundPercent, toPercent } from '../lib/format'

const COLUMNS = [
  'Rank',
  'Resume',
  'Final Score',
  'Required Skill',
  'Semantic',
  'Experience',
  'Preferred Skill',
  'Status',
]

function CandidateDetail({ candidate, onClose }) {
  return (
    <Card
      title={`Resume #${candidate.resumeId} · rank ${candidate.rank}`}
      description="Stored screening result for this candidate and job."
      action={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <ScoreCard label="Required Skill" value={candidate.requiredSkillScore} />
        <ScoreCard label="Semantic" value={candidate.semanticScore} />
        <ScoreCard label="Experience" value={candidate.experienceScore} />
        <ScoreCard label="Preferred Skill" value={candidate.preferredSkillScore} />
        <ScoreCard label="Final Score" value={candidate.finalScore} emphasis />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Matched skills</p>
          <SkillBadges items={candidate.matchedSkills} tone="success" empty="None stored." />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Missing required skills
          </p>
          <SkillBadges items={candidate.missingRequiredSkills} tone="danger" empty="None stored." />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">AI summary</p>
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

export default function Ranking({ jobs, selectedJobId, onSelectJob, threshold, onThresholdChange, onRank, ranking, busy }) {
  const [selected, setSelected] = useState(null)
  const job = jobs.find((item) => item.jobId === selectedJobId)
  const candidates = ranking?.candidates ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Ranking</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ranks every stored screening result for a job by final hybrid score, highest first.
        </p>
      </div>

      <Card title="Ranking request">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            id="ranking-job"
            label="Job"
            placeholder={jobs.length ? 'Select a job' : 'No jobs available'}
            value={selectedJobId ?? ''}
            onChange={(event) => onSelectJob(Number(event.target.value) || null)}
            options={jobs.map((item) => ({ value: item.jobId, label: `#${item.jobId} · ${item.title}` }))}
          />
          <TextField
            id="ranking-threshold"
            label="Shortlist threshold (%)"
            type="number"
            min="0"
            max="100"
            value={threshold}
            onChange={(event) => onThresholdChange(event.target.value)}
            hint="Sent with this request only; the backend does not store it on the job."
          />
          <div className="flex items-start pt-6">
            <Button onClick={onRank} disabled={!job || busy === 'ranking'}>
              {busy === 'ranking' ? 'Ranking…' : 'Rank Candidates'}
            </Button>
          </div>
        </div>
      </Card>

      {busy === 'ranking' && <LoadingState label="Loading stored screening results for this job…" />}

      {ranking ? (
        candidates.length ? (
          <>
            <Card
              title={`${ranking.candidateCount} candidate${ranking.candidateCount === 1 ? '' : 's'}`}
              description="Select a row to open the stored screening explanation."
              bodyClassName=""
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                      {COLUMNS.map((column) => (
                        <th key={column} className="px-4 py-3">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {candidates.map((candidate) => (
                      <tr
                        key={candidate.resumeId}
                        onClick={() => setSelected(candidate)}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900">{candidate.rank}</td>
                        <td className="px-4 py-3">#{candidate.resumeId}</td>
                        <td className="w-44 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-9 font-semibold text-slate-900">
                              {roundPercent(candidate.finalScore)}%
                            </span>
                            <ProgressBar
                              value={candidate.finalScore}
                              tone={candidate.shortlisted ? 'emerald' : 'amber'}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">{roundPercent(candidate.requiredSkillScore)}%</td>
                        <td className="px-4 py-3">{roundPercent(candidate.semanticScore)}%</td>
                        <td className="px-4 py-3">{roundPercent(candidate.experienceScore)}%</td>
                        <td className="px-4 py-3">{roundPercent(candidate.preferredSkillScore)}%</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={candidate.shortlisted ? 'success' : 'warning'}>
                            {candidate.shortlisted ? 'Shortlisted' : 'Below threshold'}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {candidates.length > 1 && (
              <Card title="Final score distribution" description="Built from the stored results returned above.">
                <ScoreDistribution scores={candidates.map((candidate) => toPercent(candidate.finalScore))} />
              </Card>
            )}

            {selected && <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />}
          </>
        ) : (
          <EmptyState
            title="No candidates have been screened for this job yet"
            description="Screen one or more resumes against this job, then rank candidates again."
          />
        )
      ) : (
        <EmptyState
          title="No ranking loaded"
          description="Rank candidates to load the stored screening results for the selected job."
        />
      )}

      <InfoNote>
        Ranking lists every stored screening result for this job, ordered by final score. Shortlist status is computed
        by the backend by comparing each stored final score with the threshold sent in the request, which is not saved
        on the job.
      </InfoNote>
    </div>
  )
}
