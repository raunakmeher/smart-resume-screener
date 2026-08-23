import { Button, Card, Chips, DetailList, PageHeader } from './ui'

const STEPS = [
  ['upload', 'Uploading & extracting PDF'],
  ['analyze', 'Analyzing resume'],
  ['stored', 'Stored'],
]

function CandidateProfileView({ profile }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Skills">
        <Chips items={profile.skills} tone="matched" />
      </Card>
      <Card title="Total experience">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {profile.totalExperienceYears ?? 0}
          <span className="ml-1.5 text-sm font-medium text-slate-500">years</span>
        </p>
      </Card>
      <Card title="Experience" className="lg:col-span-2">
        <DetailList items={profile.experience} />
      </Card>
      <Card title="Education">
        <DetailList items={profile.education} />
      </Card>
      <Card title="Projects">
        <Chips items={profile.projects} />
      </Card>
    </div>
  )
}

export default function ResumePanel({
  resume,
  step,
  text,
  onTextChange,
  onUpload,
  onAnalyzeText,
  textProfile,
  busy,
}) {
  const currentStep = STEPS.findIndex(([id]) => id === step)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="PDF extraction and structured analysis"
        title="Upload Candidate Resume"
        description="The PDF is stored with its extracted text, then analyzed into a structured candidate profile."
        action={
          <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={onUpload}
              disabled={busy === 'resume'}
            />
            {busy === 'resume' ? 'Processing…' : 'Upload & Analyze'}
          </label>
        }
      />

      {step && (
        <div className="flex flex-wrap gap-5 rounded-lg border border-slate-200 bg-white px-5 py-3.5">
          {STEPS.map(([id, label], index) => (
            <span
              key={id}
              className={`text-xs font-medium ${
                index <= currentStep ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              <span className="mr-1.5">{index <= currentStep ? '●' : '○'}</span>
              {label}
            </span>
          ))}
        </div>
      )}

      {resume?.profile ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Resume #{resume.resumeId} · {resume.fileName} · {resume.textLength} characters extracted
          </h3>
          <CandidateProfileView profile={resume.profile} />
        </div>
      ) : (
        <Card title="No stored resume yet">
          <p className="text-sm text-slate-500">
            Skills, experience, education, projects and total experience appear here after a PDF is uploaded and
            analyzed.
          </p>
        </Card>
      )}

      <Card
        title="Analyze pasted resume text"
        description="Runs the same extraction model without uploading or storing a resume."
      >
        <textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          rows={6}
          placeholder="Paste resume text to extract a structured profile…"
          className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm leading-relaxed text-slate-900 outline-none focus:border-emerald-500"
        />
        <div className="mt-3">
          <Button variant="secondary" onClick={onAnalyzeText} disabled={busy === 'resume-text'}>
            {busy === 'resume-text' ? 'Analyzing…' : 'Analyze text without saving'}
          </Button>
        </div>
      </Card>

      {textProfile && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Extracted profile (not saved)</h3>
          <CandidateProfileView profile={textProfile} />
        </div>
      )}
    </div>
  )
}
