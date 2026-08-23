import { useCallback, useEffect, useState } from 'react'
import { api } from './api/api'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { ErrorState } from './components/States'
import Overview from './pages/Overview'
import Resumes from './pages/Resumes'
import Jobs from './pages/Jobs'
import Screening from './pages/Screening'
import Ranking from './pages/Ranking'
import SkillGap from './pages/SkillGap'
import BiasAudit from './pages/BiasAudit'

const PAGES = [
  { id: 'overview', label: 'Overview', title: 'Overview', description: 'Stored records and session activity' },
  { id: 'resumes', label: 'Resumes', title: 'Resumes', description: 'Upload, extract and analyze candidate resumes' },
  { id: 'jobs', label: 'Jobs', title: 'Jobs', description: 'Create jobs and analyze their requirements' },
  { id: 'screening', label: 'Screening', title: 'Screening', description: 'Match a candidate against a job' },
  { id: 'ranking', label: 'Ranking', title: 'Ranking', description: 'Rank stored screening results for a job' },
  { id: 'skill-gap', label: 'Skill Gap', title: 'Skill Gap', description: 'Compare a candidate with job requirements' },
  { id: 'bias', label: 'Bias Audit', title: 'Bias Audit', description: 'Screening transparency' },
]

// List endpoints return summaries, so already loaded detail is preserved on refresh.
function mergeResumes(current, summaries) {
  return summaries.map((summary) => {
    const known = current.find((item) => item.resumeId === summary.id)
    return {
      resumeId: summary.id,
      fileName: summary.fileName,
      analyzed: summary.analyzed,
      totalExperienceYears: summary.totalExperienceYears,
      createdAt: summary.createdAt,
      textLength: known?.textLength,
      profile: known?.profile ?? null,
    }
  })
}

function mergeJobs(current, summaries) {
  return summaries.map((summary) => {
    const known = current.find((item) => item.jobId === summary.id)
    return {
      jobId: summary.id,
      title: summary.title,
      analyzed: summary.analyzed,
      hasScreeningPrompt: summary.hasScreeningPrompt,
      createdAt: summary.createdAt,
      description: known?.description,
      screeningPrompt: known?.screeningPrompt,
      detailLoaded: known?.detailLoaded ?? false,
      profile: known?.profile ?? null,
    }
  })
}

export default function App() {
  const [page, setPage] = useState('overview')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const [resumes, setResumes] = useState([])
  const [jobs, setJobs] = useState([])
  const [listsLoading, setListsLoading] = useState(true)
  const [listsAttempt, setListsAttempt] = useState(0)

  const [screenings, setScreenings] = useState([])

  const [selectedResumeId, setSelectedResumeId] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)

  const [jobForm, setJobForm] = useState({ title: '', description: '', instructions: '' })
  const [resumeText, setResumeText] = useState('')
  const [resumeTextProfile, setResumeTextProfile] = useState(null)

  const [screening, setScreening] = useState(null)
  const [screeningSource, setScreeningSource] = useState('')
  const [skillGapResult, setSkillGapResult] = useState(null)

  const [threshold, setThreshold] = useState(80)
  const [ranking, setRanking] = useState(null)

  const [audit, setAudit] = useState(null)
  const [auditLoading, setAuditLoading] = useState(true)
  const [auditAttempt, setAuditAttempt] = useState(0)

  useEffect(() => {
    let active = true

    api
      .biasAudit()
      .then((data) => active && setAudit(data))
      .catch(() => active && setAudit(null))
      .finally(() => active && setAuditLoading(false))

    return () => {
      active = false
    }
  }, [auditAttempt])

  useEffect(() => {
    let active = true

    Promise.all([api.listResumes(), api.listJobs()])
      .then(([resumeList, jobList]) => {
        if (!active) return
        setResumes((current) => mergeResumes(current, resumeList))
        setJobs((current) => mergeJobs(current, jobList))
      })
      .catch((caught) => active && setError(caught.message))
      .finally(() => active && setListsLoading(false))

    return () => {
      active = false
    }
  }, [listsAttempt])

  useEffect(() => {
    if (!selectedResumeId || !selectedJobId) return
    let active = true

    api
      .getStoredScreening(selectedResumeId, selectedJobId)
      .then((stored) => {
        if (!active) return
        setScreening(stored)
        setScreeningSource(stored ? 'stored' : '')
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [selectedResumeId, selectedJobId])

  const retryAudit = useCallback(() => {
    setAuditLoading(true)
    setAuditAttempt((attempt) => attempt + 1)
  }, [])

  const refreshLists = () => setListsAttempt((attempt) => attempt + 1)

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

  const loadResumeDetail = async (resumeId) => {
    const detail = await api.getResume(resumeId)
    setResumes((current) =>
      current.map((item) =>
        item.resumeId === resumeId
          ? { ...item, textLength: detail.textLength, analyzed: detail.analyzed, profile: detail.profile }
          : item,
      ),
    )
  }

  const loadJobDetail = async (jobId) => {
    const detail = await api.getJob(jobId)
    setJobs((current) =>
      current.map((item) =>
        item.jobId === jobId
          ? {
              ...item,
              description: detail.description,
              screeningPrompt: detail.screeningPrompt,
              analyzed: detail.analyzed,
              profile: detail.profile,
              detailLoaded: true,
            }
          : item,
      ),
    )
  }

  const ensureResumeDetail = (resumeId) => {
    const record = resumes.find((item) => item.resumeId === resumeId)
    if (!resumeId || record?.profile || !record?.analyzed) return
    run('resume-detail', () => loadResumeDetail(resumeId))
  }

  const ensureJobDetail = (jobId) => {
    const record = jobs.find((item) => item.jobId === jobId)
    if (!jobId || record?.detailLoaded) return
    run('job-detail', () => loadJobDetail(jobId))
  }

  const selectResume = (resumeId) => {
    setSelectedResumeId(resumeId)
    ensureResumeDetail(resumeId)
  }

  const selectJob = (jobId) => {
    setSelectedJobId(jobId)
    ensureJobDetail(jobId)
  }

  const handleUploadResume = (file) =>
    run('resume', async () => {
      const uploaded = await api.uploadResume(file)
      const analyzed = await api.analyzeResume(uploaded.resumeId)
      setResumes((current) => [
        {
          resumeId: uploaded.resumeId,
          fileName: uploaded.fileName,
          textLength: uploaded.textLength,
          analyzed: true,
          totalExperienceYears: analyzed.profile?.totalExperienceYears,
          profile: analyzed.profile,
        },
        ...current.filter((item) => item.resumeId !== uploaded.resumeId),
      ])
      setSelectedResumeId(uploaded.resumeId)
      refreshLists()
    })

  const handleAnalyzeResumeText = () =>
    run('resume-text', async () => {
      if (!resumeText.trim()) throw new Error('Paste resume text to analyze.')
      setResumeTextProfile(await api.analyzeResumeText(resumeText))
    })

  const handleCreateJob = () =>
    run('job', async () => {
      if (!jobForm.title.trim() || !jobForm.description.trim()) {
        throw new Error('A job title and description are both required.')
      }
      const created = await api.createJob(jobForm.title, jobForm.description, jobForm.instructions)
      const analyzed = await api.analyzeJob(created.jobId)
      setJobs((current) => [
        {
          jobId: created.jobId,
          title: created.title,
          description: jobForm.description,
          screeningPrompt: jobForm.instructions,
          hasScreeningPrompt: Boolean(jobForm.instructions.trim()),
          analyzed: true,
          detailLoaded: true,
          profile: analyzed.profile,
        },
        ...current.filter((item) => item.jobId !== created.jobId),
      ])
      setSelectedJobId(created.jobId)
      setJobForm({ title: '', description: '', instructions: '' })
      refreshLists()
    })

  const handleAnalyzeJob = (jobId) =>
    run('job-analyze', async () => {
      const analyzed = await api.analyzeJob(jobId)
      setJobs((current) =>
        current.map((item) =>
          item.jobId === jobId ? { ...item, analyzed: true, profile: analyzed.profile } : item,
        ),
      )
    })

  const handleScreen = () =>
    run('screening', async () => {
      if (!selectedResumeId || !selectedJobId) throw new Error('Select a resume and a job before screening.')
      const result = await api.screenCandidate(selectedResumeId, selectedJobId)
      setScreening(result)
      setScreeningSource('fresh')
      setScreenings((current) => [
        { resumeId: selectedResumeId, jobId: selectedJobId, match: result.match, scoring: result.scoring },
        ...current.filter((item) => item.resumeId !== selectedResumeId || item.jobId !== selectedJobId),
      ])
      setRanking((current) => (current?.jobId === selectedJobId ? null : current))
    })

  const handleSkillGap = () =>
    run('gap', async () => {
      if (!selectedResumeId || !selectedJobId) throw new Error('Select a resume and a job before analyzing.')
      const result = await api.skillGap(selectedResumeId, selectedJobId)
      setSkillGapResult(result.skillGap)
    })

  const handleRank = () =>
    run('ranking', async () => {
      if (!selectedJobId) throw new Error('Select a job before ranking candidates.')
      setRanking(await api.ranking(selectedJobId, threshold))
    })

  const activePage = PAGES.find((item) => item.id === page)
  const selectedResume = resumes.find((item) => item.resumeId === selectedResumeId)
  const selectedJob = jobs.find((item) => item.jobId === selectedJobId)

  const currentScreening =
    screening && screening.resumeId === selectedResumeId && screening.jobId === selectedJobId ? screening : null

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 max-lg:flex-col">
      <Sidebar pages={PAGES} active={page} onSelect={setPage} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={activePage.title}
          description={activePage.description}
          job={selectedJob}
          resume={selectedResume}
        />

        <main className="min-w-0 flex-1 p-6">
          {error && (
            <div className="mb-5">
              <ErrorState message={error} onRetry={() => setError('')} />
            </div>
          )}

          {page === 'overview' && (
            <Overview resumes={resumes} jobs={jobs} screenings={screenings} loading={listsLoading} />
          )}

          {page === 'resumes' && (
            <Resumes
              resumes={resumes}
              loading={listsLoading}
              selectedResumeId={selectedResumeId}
              onSelectResume={selectResume}
              onOpenResume={ensureResumeDetail}
              onUpload={handleUploadResume}
              busy={busy}
              text={resumeText}
              onTextChange={setResumeText}
              onAnalyzeText={handleAnalyzeResumeText}
              textProfile={resumeTextProfile}
            />
          )}

          {page === 'jobs' && (
            <Jobs
              form={jobForm}
              onFormChange={(field, value) => setJobForm((current) => ({ ...current, [field]: value }))}
              onCreate={handleCreateJob}
              onAnalyze={handleAnalyzeJob}
              jobs={jobs}
              loading={listsLoading}
              selectedJobId={selectedJobId}
              onSelectJob={selectJob}
              onOpenJob={ensureJobDetail}
              busy={busy}
            />
          )}

          {page === 'screening' && (
            <Screening
              resumes={resumes}
              jobs={jobs}
              selectedResumeId={selectedResumeId}
              selectedJobId={selectedJobId}
              onSelectResume={selectResume}
              onSelectJob={selectJob}
              onScreen={handleScreen}
              screening={currentScreening}
              screeningSource={screeningSource}
              busy={busy}
            />
          )}

          {page === 'ranking' && (
            <Ranking
              jobs={jobs}
              selectedJobId={selectedJobId}
              onSelectJob={selectJob}
              threshold={threshold}
              onThresholdChange={setThreshold}
              onRank={handleRank}
              ranking={ranking}
              busy={busy}
            />
          )}

          {page === 'skill-gap' && (
            <SkillGap
              resumes={resumes}
              jobs={jobs}
              selectedResumeId={selectedResumeId}
              selectedJobId={selectedJobId}
              onSelectResume={selectResume}
              onSelectJob={selectJob}
              onAnalyze={handleSkillGap}
              result={skillGapResult}
              busy={busy}
            />
          )}

          {page === 'bias' && <BiasAudit audit={audit} loading={auditLoading} onRetry={retryAudit} />}
        </main>
      </div>
    </div>
  )
}
