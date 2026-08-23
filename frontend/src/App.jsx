import { useEffect, useState } from 'react'
import { api } from './api'
import BiasAudit from './components/BiasAudit'
import CandidateRanking from './components/CandidateRanking'
import JobPanel from './components/JobPanel'
import Overview from './components/Overview'
import ResumePanel from './components/ResumePanel'
import ScreeningResult from './components/ScreeningResult'
import Sidebar from './components/Sidebar'
import SkillGap from './components/SkillGap'
import { Button, Card, Empty, Note, PageHeader } from './components/ui'

const PAGES = [
  { id: 'overview', label: 'Overview' },
  { id: 'job', label: 'Job Description' },
  { id: 'resumes', label: 'Resumes' },
  { id: 'screening', label: 'Screening' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'skill-gap', label: 'Skill Gap' },
  { id: 'bias', label: 'Bias & Transparency' },
]

export default function App() {
  const [page, setPage] = useState('overview')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  const [job, setJob] = useState(null)
  const [jobPreview, setJobPreview] = useState(null)

  const [resume, setResume] = useState(null)
  const [resumeStep, setResumeStep] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [resumeTextProfile, setResumeTextProfile] = useState(null)

  const [screening, setScreening] = useState(null)
  const [instructionMatch, setInstructionMatch] = useState(null)
  const [gap, setGap] = useState(null)
  const [adHocGap, setAdHocGap] = useState(null)

  const [ranking, setRanking] = useState(null)
  const [threshold, setThreshold] = useState(70)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const [audit, setAudit] = useState(null)

  useEffect(() => {
    api.biasAudit().then(setAudit).catch(() => setAudit(null))
  }, [])

  const run = async (key, action) => {
    setBusy(key)
    setError('')
    try {
      await action()
    } catch (caught) {
      setError(caught.message || 'The request could not be completed.')
    } finally {
      setBusy('')
    }
  }

  const resumeReady = Boolean(resume?.resumeId)
  const jobReady = Boolean(job?.jobId)
  const screeningReady = resumeReady && jobReady
  const profilesReady = Boolean(resume?.profile && job?.profile)

  const handleProcessJob = () =>
    run('job', async () => {
      if (!jobTitle.trim() || !jobDescription.trim()) {
        throw new Error('A job title and description are both required.')
      }
      const created = await api.createJob(jobTitle, jobDescription)
      const analyzed = await api.analyzeJob(created.jobId)
      setJob({ jobId: created.jobId, title: created.title, description: jobDescription, profile: analyzed.profile })
      setScreening(null)
      setInstructionMatch(null)
      setGap(null)
      setAdHocGap(null)
      setRanking(null)
    })

  const handlePreviewJob = () =>
    run('job-preview', async () => {
      if (!jobDescription.trim()) throw new Error('Enter a job description to parse.')
      setJobPreview(await api.previewJob(jobDescription))
    })

  const handleUploadResume = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    run('resume', async () => {
      setResumeStep('upload')
      const uploaded = await api.uploadResume(file)
      setResumeStep('analyze')
      const analyzed = await api.analyzeResume(uploaded.resumeId)
      setResume({ ...uploaded, profile: analyzed.profile })
      setResumeStep('stored')
      setScreening(null)
      setInstructionMatch(null)
      setGap(null)
      setAdHocGap(null)
    }).catch(() => setResumeStep(''))
  }

  const handleAnalyzeResumeText = () =>
    run('resume-text', async () => {
      if (!resumeText.trim()) throw new Error('Paste resume text to analyze.')
      setResumeTextProfile(await api.analyzeResumeText(resumeText))
    })

  const handleScreen = () =>
    run('screening', async () => {
      if (!screeningReady) throw new Error('Process a job description and a resume before screening.')
      setScreening(await api.screenCandidate(resume.resumeId, job.jobId))
      setPage('screening')
    })

  const handleInstructionMatch = () =>
    run('instruction-match', async () => {
      if (!profilesReady) throw new Error('A processed resume profile and job profile are required.')
      setInstructionMatch(await api.matchWithInstructions(resume.profile, job.profile, instructions))
    })

  const handleSkillGap = () =>
    run('gap', async () => {
      if (!screeningReady) throw new Error('Process a job description and a resume before analyzing skill gaps.')
      const result = await api.skillGap(resume.resumeId, job.jobId)
      setGap(result.skillGap)
    })

  const handleAdHocSkillGap = () =>
    run('gap-adhoc', async () => {
      if (!profilesReady) throw new Error('A processed resume profile and job profile are required.')
      setAdHocGap(await api.skillGapForProfiles(resume.profile, job.profile))
    })

  const handleLoadRanking = () =>
    run('ranking', async () => {
      if (!jobReady) throw new Error('Process a job description before loading its ranking.')
      setRanking(await api.ranking(job.jobId, threshold))
      setSelectedCandidate(null)
    })

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 max-md:flex-col">
      <Sidebar pages={PAGES} active={page} onSelect={setPage} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Current job</p>
              <p className="text-sm font-semibold text-slate-900">{job ? job.title : 'No job processed yet'}</p>
            </div>
            <span
              className={`rounded px-2 py-1 text-xs font-semibold ${
                jobReady ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {jobReady ? 'JD Processed' : 'Awaiting job'}
            </span>
            {resumeReady && (
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                Resume #{resume.resumeId}
              </span>
            )}
          </div>
          <Button onClick={handleScreen} disabled={!screeningReady || busy === 'screening'}>
            {busy === 'screening' ? 'Screening…' : 'Run Screening'}
          </Button>
        </header>

        <main className="min-w-0 flex-1 px-6 py-6">
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-md border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          {page === 'overview' && <Overview screening={screening} />}

          {page === 'job' && (
            <JobPanel
              title={jobTitle}
              description={jobDescription}
              instructions={instructions}
              onTitleChange={setJobTitle}
              onDescriptionChange={setJobDescription}
              onInstructionsChange={setInstructions}
              onProcess={handleProcessJob}
              onPreview={handlePreviewJob}
              job={job}
              preview={jobPreview}
              busy={busy}
            />
          )}

          {page === 'resumes' && (
            <ResumePanel
              resume={resume}
              step={resumeStep}
              text={resumeText}
              onTextChange={setResumeText}
              onUpload={handleUploadResume}
              onAnalyzeText={handleAnalyzeResumeText}
              textProfile={resumeTextProfile}
              busy={busy}
            />
          )}

          {page === 'screening' && (
            <div className="space-y-6">
              <PageHeader
                eyebrow="Bias-filtered semantic matching and hybrid scoring"
                title="Candidate Screening"
                description="Screens the stored resume against the stored job, then combines deterministic and semantic scores."
                action={
                  <Button onClick={handleScreen} disabled={!screeningReady || busy === 'screening'}>
                    {busy === 'screening' ? 'Screening…' : 'Screen Candidate'}
                  </Button>
                }
              />

              <Card title="Selected inputs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                    <p className="text-xs font-semibold text-slate-500">Job</p>
                    <p className="mt-0.5 text-slate-800">
                      {job ? `#${job.jobId} · ${job.title}` : 'No job processed yet'}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                    <p className="text-xs font-semibold text-slate-500">Resume</p>
                    <p className="mt-0.5 text-slate-800">
                      {resume ? `#${resume.resumeId} · ${resume.fileName}` : 'No resume processed yet'}
                    </p>
                  </div>
                </div>
              </Card>

              {screening ? (
                <ScreeningResult
                  match={screening.match || {}}
                  scoring={screening.scoring}
                  heading="Screening result"
                  caption="Personal identifiers are removed from the candidate profile before matching."
                />
              ) : (
                <Empty
                  title="No screening result yet"
                  description="Process a job description and a resume, then run screening for that pair."
                />
              )}

              <Card
                title="Match using recruiter screening instructions"
                description="Sends the current resume and job profiles together with the instructions written on the Job Description page."
                action={
                  <Button
                    variant="secondary"
                    onClick={handleInstructionMatch}
                    disabled={!profilesReady || busy === 'instruction-match'}
                  >
                    {busy === 'instruction-match' ? 'Matching…' : 'Run instruction match'}
                  </Button>
                }
              >
                <Note>
                  This endpoint returns a semantic match only. It applies no hybrid scoring, no bias filtering step and
                  stores nothing, so its result is separate from the screening result above.
                </Note>
                {instructionMatch && (
                  <div className="mt-4">
                    <ScreeningResult
                      match={instructionMatch}
                      heading="Instruction-based match"
                      caption="Semantic match guided by the recruiter screening instructions."
                    />
                  </div>
                )}
              </Card>
            </div>
          )}

          {page === 'ranking' && (
            <CandidateRanking
              job={job}
              ranking={ranking}
              threshold={threshold}
              onThresholdChange={setThreshold}
              onLoad={handleLoadRanking}
              selected={selectedCandidate}
              onSelect={setSelectedCandidate}
              busy={busy}
            />
          )}

          {page === 'skill-gap' && (
            <SkillGap
              gap={gap}
              adHocGap={adHocGap}
              onAnalyze={handleSkillGap}
              onAnalyzeProfiles={handleAdHocSkillGap}
              ready={screeningReady}
              hasProfiles={profilesReady}
              busy={busy}
            />
          )}

          {page === 'bias' && <BiasAudit audit={audit} />}
        </main>
      </div>
    </div>
  )
}
