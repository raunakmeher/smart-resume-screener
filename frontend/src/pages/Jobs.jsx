import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import SkillBadges from '../components/SkillBadges'
import StatusBadge from '../components/StatusBadge'
import { EmptyState, LoadingState } from '../components/States'
import { TextArea, TextField } from '../components/Inputs'


function JobProfileView({ profile }) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Required skills</p>
          <SkillBadges items={profile.requiredSkills} tone="success" empty="None extracted." />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Preferred skills</p>
          <SkillBadges items={profile.preferredSkills} empty="None extracted." />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Minimum experience</p>
          <p className="text-xl font-semibold tracking-tight text-slate-900">
            {profile.minimumExperienceYears ?? 0}
            <span className="ml-1.5 text-sm font-medium text-slate-500">years</span>
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Education</p>
          <p className="text-sm text-slate-700">{profile.education || 'Not specified in the description.'}</p>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Responsibilities</p>
        {profile.responsibilities?.length ? (
          <ul className="space-y-2">
            {profile.responsibilities.map((item, index) => (
              <li key={index} className="border-l-2 border-slate-200 pl-3 text-sm text-slate-600">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">None extracted.</p>
        )}
      </div>
    </div>
  )
}

export default function Jobs({
  form,
  onFormChange,
  onCreate,
  onAnalyze,
  jobs,
  loading,
  selectedJobId,
  onSelectJob,
  onOpenJob,
  busy,
}) {
  const [openId, setOpenId] = useState(null)

  const openJobId = openId ?? selectedJobId
  const openJob = jobs.find((job) => job.jobId === openJobId)

  const toggleDetails = (jobId) => {
    if (openJobId === jobId) {
      setOpenId(null)
      return
    }
    setOpenId(jobId)
    onOpenJob(jobId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Jobs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Create a job, then analyze its description into a structured hiring profile.
        </p>
      </div>

      <Card title="New job" description="The title, description and screening instructions are stored with the job.">
        <div className="grid gap-4">
          <TextField
            id="job-title"
            label="Job title"
            value={form.title}
            onChange={(event) => onFormChange('title', event.target.value)}
            placeholder="Java Backend Engineer"
          />
          <TextArea
            id="job-description"
            label="Job description"
            rows={8}
            value={form.description}
            onChange={(event) => onFormChange('description', event.target.value)}
            placeholder="Paste the full job description…"
          />
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
            <TextArea
              id="job-instructions"
              label="Recruiter screening instructions"
              rows={5}
              value={form.instructions}
              onChange={(event) => onFormChange('instructions', event.target.value)}
              placeholder="Prioritize candidates with strong practical Java and Spring Boot backend experience…"
              className="border-emerald-300"
              hint="These instructions are used during candidate screening."
            />
          </div>
          <Button onClick={onCreate} disabled={busy === 'job'}>
            {busy === 'job' ? 'Creating and analyzing…' : 'Create Job'}
          </Button>
        </div>
      </Card>

      {(busy === 'job' || busy === 'job-analyze') && (
        <LoadingState label="Extracting the structured job profile with the analysis endpoint…" />
      )}

      <Card title="Stored jobs" description="Select the job used across screening, ranking and skill-gap analysis.">
        {loading ? (
          <LoadingState label="Loading stored jobs…" />
        ) : jobs.length ? (
          <ul className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <li key={job.jobId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{job.title}</p>
                  <p className="text-xs text-slate-500">Job #{job.jobId}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={job.analyzed ? 'success' : 'warning'}>
                    {job.analyzed ? 'Analyzed' : 'Not analyzed'}
                  </StatusBadge>
                  {job.hasScreeningPrompt && <StatusBadge tone="success">Instructions stored</StatusBadge>}
                  {!job.analyzed && (
                    <Button variant="secondary" onClick={() => onAnalyze(job.jobId)} disabled={busy === 'job-analyze'}>
                      Analyze
                    </Button>
                  )}
                  {selectedJobId === job.jobId ? (
                    <StatusBadge tone="success">Selected</StatusBadge>
                  ) : (
                    <Button variant="secondary" onClick={() => onSelectJob(job.jobId)}>
                      Select
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => toggleDetails(job.jobId)}>
                    {openJobId === job.jobId ? 'Hide details' : 'View details'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No jobs yet" description="Create a job to start screening candidates against it." />
        )}
      </Card>

      {openJob && (
        <>
          <Card
            title={`Recruiter screening instructions · job #${openJob.jobId}`}
            description="Stored on the job and passed to the matching model during screening."
            className="border-emerald-200"
          >
            {openJob.detailLoaded ? (
              <p className="text-sm leading-relaxed text-slate-700">
                {openJob.screeningPrompt?.trim() || 'No screening instructions are stored for this job.'}
              </p>
            ) : (
              <LoadingState label="Loading the stored job…" />
            )}
          </Card>

          {openJob.detailLoaded && openJob.description && (
            <Card title={`Job description · #${openJob.jobId}`} description="The description stored with this job.">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{openJob.description}</p>
            </Card>
          )}

          <Card
            title={`AI-analyzed job profile · #${openJob.jobId}`}
            description="Extracted by the job analysis endpoint and stored on the job record."
          >
            {openJob.profile ? (
              <JobProfileView profile={openJob.profile} />
            ) : busy === 'job-detail' ? (
              <LoadingState label="Loading the stored job profile…" />
            ) : (
              <EmptyState
                title="Job not analyzed yet"
                description="Run the analysis to extract required skills, preferred skills, minimum experience, education and responsibilities."
              />
            )}
          </Card>
        </>
      )}
    </div>
  )
}
