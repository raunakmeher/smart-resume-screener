import Button from '../components/Button'
import Card from '../components/Card'
import SkillBadges from '../components/SkillBadges'
import { EmptyState, LoadingState } from '../components/States'
import { Select } from '../components/Inputs'

export default function SkillGap({
  resumes,
  jobs,
  selectedResumeId,
  selectedJobId,
  onSelectResume,
  onSelectJob,
  onAnalyze,
  result,
  busy,
}) {
  const resume = resumes.find((item) => item.resumeId === selectedResumeId)
  const job = jobs.find((item) => item.jobId === selectedJobId)
  const ready = Boolean(resume && job)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Skill Gap</h2>
        <p className="mt-1 text-sm text-slate-600">
          Compares a stored candidate profile with the stored requirements of a job.
        </p>
      </div>

      <Card title="Select inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="gap-resume"
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
            id="gap-job"
            label="Job"
            placeholder={jobs.length ? 'Select a job' : 'No jobs available'}
            value={selectedJobId ?? ''}
            onChange={(event) => onSelectJob(Number(event.target.value) || null)}
            options={jobs.map((item) => ({ value: item.jobId, label: `#${item.jobId} · ${item.title}` }))}
          />
        </div>
        <div className="mt-4">
          <Button onClick={onAnalyze} disabled={!ready || busy === 'gap'}>
            {busy === 'gap' ? 'Analyzing…' : 'Analyze Skill Gap'}
          </Button>
        </div>
      </Card>

      {busy === 'gap' && <LoadingState label="Comparing the candidate profile with the job requirements…" />}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Candidate skills" description={resume ? `Resume #${resume.resumeId}` : 'No resume selected'}>
          <SkillBadges
            items={resume?.profile?.skills}
            tone="success"
            empty="Select an analyzed resume to see its extracted skills."
          />
        </Card>
        <Card title="Job requirements" description={job ? `Job #${job.jobId}` : 'No job selected'}>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Required</p>
              <SkillBadges items={job?.profile?.requiredSkills} empty="Select an analyzed job." />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Preferred</p>
              <SkillBadges items={job?.profile?.preferredSkills} empty="Select an analyzed job." />
            </div>
          </div>
        </Card>
        <Card title="Gap" description="Returned by the skill-gap endpoint.">
          {result ? (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  Missing required
                </p>
                <SkillBadges items={result.missingRequiredSkills} tone="danger" empty="None reported." />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  Missing preferred
                </p>
                <SkillBadges items={result.missingPreferredSkills} tone="warning" empty="None reported." />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Matched</p>
                <SkillBadges items={result.matchedSkills} tone="success" empty="None reported." />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Run the analysis to see the reported gap.</p>
          )}
        </Card>
      </div>

      {result ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card title="Experience gap">
            <p className="text-sm leading-relaxed text-slate-700">{result.experienceGap || 'None reported.'}</p>
          </Card>
          <Card title="Recommendations">
            {result.recommendations?.length ? (
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                {result.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-400">No recommendations returned.</p>
            )}
          </Card>
        </div>
      ) : (
        <EmptyState
          title="No skill-gap analysis yet"
          description="Select a resume and a job, then run the analysis for that pair."
        />
      )}
    </div>
  )
}
