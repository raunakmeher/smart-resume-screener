import Button from '../components/Button'
import Card from '../components/Card'
import ScoreCard from '../components/ScoreCard'
import ScoreRing from '../components/ScoreRing'
import SkillBadges from '../components/SkillBadges'
import StatusBadge from '../components/StatusBadge'
import { EmptyState, LoadingState } from '../components/States'
import { Select } from '../components/Inputs'

function FitRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3.5 py-2.5">
      <span className="text-sm text-slate-700">{label}</span>
      <StatusBadge tone={value ? 'success' : 'warning'}>
        {value ? 'Meets requirement' : 'Does not meet requirement'}
      </StatusBadge>
    </div>
  )
}

function MatchView({ match, scoring }) {
  return (
    <div className="space-y-4">
      <Card title="Match result" description="Returned by the matching model for this candidate and job.">
        <div className="flex flex-wrap items-center gap-8">
          <ScoreRing value={match.matchScore} label="Match score" />
          <div className="min-w-[280px] flex-1 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">AI summary</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                {match.summary || 'No summary text was returned.'}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <FitRow label="Experience fit" value={match.experienceFit} />
              <FitRow label="Education fit" value={match.educationFit} />
            </div>
          </div>
        </div>
      </Card>

      {scoring && (
        <Card
          title="Hybrid scoring"
          description="The final score combines deterministic skill and experience signals with the semantic match score."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <ScoreCard label="Required Skill" value={scoring.requiredSkillScore} />
            <ScoreCard label="Semantic" value={scoring.semanticScore} />
            <ScoreCard label="Experience" value={scoring.experienceScore} />
            <ScoreCard label="Preferred Skill" value={scoring.preferredSkillScore} />
            <ScoreCard label="Final Score" value={scoring.finalScore} emphasis />
          </div>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Matched skills">
          <SkillBadges items={match.matchedSkills} tone="success" empty="None reported." />
        </Card>
        <Card title="Missing required skills">
          <SkillBadges items={match.missingRequiredSkills} tone="danger" empty="None reported." />
        </Card>
        <Card title="Preferred skills matched">
          <SkillBadges items={match.preferredSkillsMatched} empty="None reported." />
        </Card>
      </div>
    </div>
  )
}

export default function Screening({
  resumes,
  jobs,
  selectedResumeId,
  selectedJobId,
  onSelectResume,
  onSelectJob,
  onScreen,
  screening,
  screeningSource,
  busy,
}) {
  const resume = resumes.find((item) => item.resumeId === selectedResumeId)
  const job = jobs.find((item) => item.jobId === selectedJobId)
  const ready = Boolean(resume && job)
  const stored = Boolean(screening) && screeningSource === 'stored'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Screening</h2>
        <p className="mt-1 text-sm text-slate-600">
          Screen a stored resume against a stored job. Personal identifiers are removed from the candidate profile
          before matching.
        </p>
      </div>

      <Card title="Select inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="screening-resume"
            label="Resume"
            placeholder={resumes.length ? 'Select a resume' : 'No resumes available'}
            value={selectedResumeId ?? ''}
            onChange={(event) => onSelectResume(Number(event.target.value) || null)}
            options={resumes.map((item) => ({
              value: item.resumeId,
              label: `#${item.resumeId} · ${item.fileName}`,
            }))}
          />
          <Select
            id="screening-job"
            label="Job"
            placeholder={jobs.length ? 'Select a job' : 'No jobs available'}
            value={selectedJobId ?? ''}
            onChange={(event) => onSelectJob(Number(event.target.value) || null)}
            options={jobs.map((item) => ({ value: item.jobId, label: `#${item.jobId} · ${item.title}` }))}
          />
        </div>
        <div className="mt-4">
          <Button onClick={onScreen} disabled={!ready || busy === 'screening'}>
            {busy === 'screening' ? 'Screening…' : stored ? 'Screen Again' : 'Screen Candidate'}
          </Button>
        </div>
      </Card>

      <Card
        title="Recruiter screening instructions"
        description={
          job
            ? `Stored with job #${job.jobId} and passed to the matching model during screening.`
            : 'Stored with the job and passed to the matching model during screening.'
        }
        className="border-emerald-200"
      >
        {!job ? (
          <p className="text-sm leading-relaxed text-slate-700">
            Select a job to see its stored screening instructions.
          </p>
        ) : job.detailLoaded ? (
          <p className="text-sm leading-relaxed text-slate-700">
            {job.screeningPrompt?.trim() || 'No screening instructions are stored for this job.'}
          </p>
        ) : (
          <LoadingState label="Loading the stored instructions…" />
        )}
      </Card>

      {busy === 'screening' && <LoadingState label="Filtering the candidate profile, matching and scoring…" />}

      {screening ? (
        <>
          {stored ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <StatusBadge>Stored result loaded</StatusBadge>
              <p className="text-sm text-slate-700">
                This pair was screened previously. Screen again to replace the saved result for resume #
                {screening.resumeId} and job #{screening.jobId}.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <StatusBadge tone="success">Result stored</StatusBadge>
              <p className="text-sm text-emerald-900">
                Saved for resume #{screening.resumeId} and job #{screening.jobId}. It is now included in this
                job&apos;s ranking.
              </p>
            </div>
          )}
          <MatchView match={screening.match || {}} scoring={screening.scoring} />
        </>
      ) : (
        <EmptyState
          title="No screening result yet"
          description="Select a resume and a job, then screen the candidate to see the hybrid scoring result."
        />
      )}
    </div>
  )
}
