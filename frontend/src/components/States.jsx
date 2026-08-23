export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {description && <p className="mx-auto mt-1.5 max-w-lg text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-6">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm font-semibold text-red-800">Request failed</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-semibold text-red-800 underline">
          Try again
        </button>
      )}
    </div>
  )
}

export function InfoNote({ children }) {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">
      {children}
    </p>
  )
}
