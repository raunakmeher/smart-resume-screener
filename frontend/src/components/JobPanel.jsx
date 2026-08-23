import { Button, Card, Chips, DetailList, Note, PageHeader } from './ui'

function JobProfileView({ profile }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Required skills">
        <Chips items={profile.requiredSkills} tone="matched" />
      </Card>
      <Card title="Preferred skills">
        <Chips items={profile.preferredSkills} />
      </Card>
      <Card title="Minimum experience">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {profile.minimumExperienceYears ?? 0}
          <span className="ml-1.5 text-sm font-medium text-slate-500">years</span>
        </p>
      </Card>
      <Card title="Education">
        <p className="text-sm text-slate-700">{profile.education || 'Not specified in the job description.'}</p>
      </Card>
      <Card title="Responsibilities" className="lg:col-span-2">
        <DetailList items={profile.responsibilities} />
      </Card>
    </div>
  )
}

export default function JobPanel({
  title,
  description,
  instructions,
  onTitleChange,
  onDescriptionChange,
  onInstructionsChange,
  onProcess,
  onPreview,
  job,
  preview,
  busy,
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Structured requirement extraction"
        title="Job Description"
        description="Store a job and extract its required skills, preferred skills, minimum experience, education and responsibilities."
      />

      <Card
        title="Job details"
        description="The title and description are the only fields the job API accepts."
      >
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
            Job title
            <input
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Software Engineer - Java Backend"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
            Job description
            <textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              rows={9}
              placeholder="Paste the full job description…"
              className="resize-y rounded-md border border-slate-300 px-3 py-2 text-sm font-normal leading-relaxed text-slate-900 outline-none focus:border-emerald-500"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onProcess} disabled={busy === 'job'}>
              {busy === 'job' ? 'Processing job…' : 'Process Job'}
            </Button>
            <Button variant="secondary" onClick={onPreview} disabled={busy === 'job-preview'}>
              {busy === 'job-preview' ? 'Parsing…' : 'Parse without saving'}
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="Recruiter screening instructions"
        description="Sent to the model as recruiter guidance during candidate matching."
        className="border-emerald-200 bg-emerald-50/40"
      >
        <textarea
          value={instructions}
          onChange={(event) => onInstructionsChange(event.target.value)}
          rows={5}
          placeholder="Prioritize candidates with strong practical Java and Spring Boot backend experience…"
          className="w-full resize-y rounded-md border border-emerald-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 outline-none focus:border-emerald-600"
        />
        <div className="mt-3">
          <Note>
            The job API cannot store a screening prompt, and stored screening reads the prompt from the job record.
            These instructions are therefore used by the instruction-based match on the Screening page, which returns
            a semantic match without hybrid scoring or storage.
          </Note>
        </div>
      </Card>

      {job?.profile && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Stored job profile · Job #{job.jobId} · {job.title}
          </h3>
          <JobProfileView profile={job.profile} />
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Parsed preview (not saved)</h3>
          <JobProfileView profile={preview} />
        </div>
      )}
    </div>
  )
}
