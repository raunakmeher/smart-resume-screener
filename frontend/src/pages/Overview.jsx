import Card from '../components/Card'
import ScoreDistribution from '../components/ScoreDistribution'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { EmptyState, LoadingState } from '../components/States'
import { ProgressBar } from '../components/ScoreCard'
import { roundPercent, toPercent } from '../lib/format'

export default function Overview({ resumes, jobs, screenings, loading }) {
  const finalScores = screenings.map((entry) => toPercent(entry.scoring?.finalScore))
  const analyzedResumes = resumes.filter((resume) => resume.analyzed).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Resumes stored"
          value={loading ? '—' : resumes.length}
          hint={loading ? 'Loading from the database' : `${analyzedResumes} analyzed`}
        />
        <StatCard
          label="Jobs stored"
          value={loading ? '—' : jobs.length}
          hint={loading ? 'Loading from the database' : `${jobs.filter((job) => job.analyzed).length} analyzed`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Jobs" description="Jobs stored in the database and available for screening and ranking.">
          {loading ? (
            <LoadingState label="Loading stored jobs…" />
          ) : jobs.length ? (
            <ul className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <li key={job.jobId} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{job.title}</p>
                    <p className="text-xs text-slate-500">Job #{job.jobId}</p>
                  </div>
                  <StatusBadge tone={job.analyzed ? 'success' : 'warning'}>
                    {job.analyzed ? 'Analyzed' : 'Not analyzed'}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No jobs yet" description="Create a job to begin screening candidates against it." />
          )}
        </Card>

        <Card title="Screening results" description="Hybrid scores returned in this session, all stored server-side.">
          {screenings.length ? (
            <ul className="divide-y divide-slate-100">
              {screenings.map((entry) => (
                <li key={`${entry.resumeId}-${entry.jobId}`} className="py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-slate-700">
                      Resume #{entry.resumeId} · Job #{entry.jobId}
                    </p>
                    <span className="text-sm font-semibold text-slate-900">
                      {roundPercent(entry.scoring?.finalScore)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={entry.scoring?.finalScore} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No candidates screened yet"
              description="Screen a resume against a job to see hybrid scoring results here."
            />
          )}
        </Card>
      </div>

      {screenings.length > 1 && (
        <Card
          title="Final score distribution"
          description={`Built from the ${finalScores.length} screening results returned in this session.`}
        >
          <ScoreDistribution scores={finalScores} />
        </Card>
      )}
    </div>
  )
}
