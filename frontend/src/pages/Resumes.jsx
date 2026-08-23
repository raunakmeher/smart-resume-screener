import { useRef, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import SkillBadges from '../components/SkillBadges'
import StatusBadge from '../components/StatusBadge'
import { EmptyState, LoadingState } from '../components/States'
import { TextArea } from '../components/Inputs'

function ProfileDetails({ profile }) {
  return (
    <div className="grid gap-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Skills</p>
        <SkillBadges items={profile.skills} tone="success" empty="No skills were extracted." />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Experience</p>
          {profile.experience?.length ? (
            <ul className="space-y-2.5">
              {profile.experience.map((item, index) => (
                <li key={index} className="border-l-2 border-slate-200 pl-3">
                  <p className="text-sm font-medium text-slate-800">{item.title || 'Role not stated'}</p>
                  {item.company && <p className="text-xs text-slate-500">{item.company}</p>}
                  {item.summary && <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No experience entries were extracted.</p>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Education</p>
            {profile.education?.length ? (
              <ul className="space-y-2.5">
                {profile.education.map((item, index) => (
                  <li key={index} className="border-l-2 border-slate-200 pl-3">
                    <p className="text-sm font-medium text-slate-800">
                      {[item.degree, item.fieldOfStudy].filter(Boolean).join(' · ') || 'Degree not stated'}
                    </p>
                    {item.institution && <p className="text-xs text-slate-500">{item.institution}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No education entries were extracted.</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Total experience</p>
            <p className="text-xl font-semibold tracking-tight text-slate-900">
              {profile.totalExperienceYears ?? 0}
              <span className="ml-1.5 text-sm font-medium text-slate-500">years</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Projects</p>
        <SkillBadges items={profile.projects} empty="No projects were extracted." />
      </div>
    </div>
  )
}

export default function Resumes({
  resumes,
  loading,
  selectedResumeId,
  onSelectResume,
  onOpenResume,
  onUpload,
  busy,
  text,
  onTextChange,
  onAnalyzeText,
  textProfile,
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [openId, setOpenId] = useState(null)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (file) onUpload(file)
  }

  const openResumeId = openId ?? selectedResumeId
  const openResume = resumes.find((item) => item.resumeId === openResumeId)

  const toggleDetails = (resumeId) => {
    if (openResumeId === resumeId) {
      setOpenId(null)
      return
    }
    setOpenId(resumeId)
    onOpenResume(resumeId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Resumes</h2>
          <p className="mt-1 text-sm text-slate-600">Upload and analyze candidate resumes.</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} disabled={busy === 'resume'}>
          + Upload Resume
        </Button>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        className={`rounded-lg border-2 border-dashed px-5 py-10 text-center transition-colors ${
          dragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
        <p className="text-sm font-semibold text-slate-800">Drag a resume here</p>
        <p className="mt-1 text-sm text-slate-500">PDF files only. The text is extracted server-side, then analyzed.</p>
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy === 'resume'}>
            Browse files
          </Button>
        </div>
      </div>

      {busy === 'resume' && <LoadingState label="Uploading, extracting PDF text and analyzing the resume…" />}

      <Card title="Stored resumes" description="Select a resume to use it for screening and skill-gap analysis.">
        {loading ? (
          <LoadingState label="Loading stored resumes…" />
        ) : resumes.length ? (
          <ul className="divide-y divide-slate-100">
            {resumes.map((resume) => (
              <li key={resume.resumeId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{resume.fileName}</p>
                  <p className="text-xs text-slate-500">
                    Resume #{resume.resumeId}
                    {resume.totalExperienceYears != null && ` · ${resume.totalExperienceYears} years experience`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={resume.analyzed ? 'success' : 'warning'}>
                    {resume.analyzed ? 'Analyzed' : 'Stored, not analyzed'}
                  </StatusBadge>
                  {selectedResumeId === resume.resumeId ? (
                    <StatusBadge tone="success">Selected</StatusBadge>
                  ) : (
                    <Button variant="secondary" onClick={() => onSelectResume(resume.resumeId)}>
                      Select
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => toggleDetails(resume.resumeId)}>
                    {openResumeId === resume.resumeId ? 'Hide details' : 'View details'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No resumes yet" description="Upload a resume to begin." />
        )}
      </Card>

      {openResume && (
        <Card
          title={`Parsed resume · #${openResume.resumeId}`}
          description={
            openResume.textLength != null
              ? `${openResume.textLength} characters extracted from the PDF.`
              : 'Only fields returned by the backend are shown.'
          }
        >
          {openResume.profile ? (
            <ProfileDetails profile={openResume.profile} />
          ) : busy === 'resume-detail' ? (
            <LoadingState label="Loading the parsed resume…" />
          ) : (
            <EmptyState
              title="Resume not analyzed yet"
              description="This resume is stored with its extracted text, but no structured profile has been generated for it."
            />
          )}
        </Card>
      )}

      <Card
        title="Analyze pasted resume text"
        description="Runs the same extraction model without uploading or storing a resume."
      >
        <TextArea
          id="resume-text"
          rows={6}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste resume text…"
        />
        <div className="mt-3">
          <Button variant="secondary" onClick={onAnalyzeText} disabled={busy === 'resume-text'}>
            {busy === 'resume-text' ? 'Analyzing…' : 'Analyze text'}
          </Button>
        </div>
        {textProfile && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <ProfileDetails profile={textProfile} />
          </div>
        )}
      </Card>
    </div>
  )
}
