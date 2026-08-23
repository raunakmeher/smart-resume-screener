import StatusBadge from './StatusBadge'

export default function Topbar({ title, description, job, resume }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {job ? (
          <StatusBadge tone="success">
            Job #{job.jobId} · {job.title}
          </StatusBadge>
        ) : (
          <StatusBadge>No job selected</StatusBadge>
        )}
        {resume ? (
          <StatusBadge tone="success">
            Resume #{resume.resumeId} · {resume.fileName}
          </StatusBadge>
        ) : (
          <StatusBadge>No resume selected</StatusBadge>
        )}
      </div>
    </header>
  )
}
