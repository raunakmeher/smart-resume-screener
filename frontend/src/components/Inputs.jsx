const FIELD_CLASS =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500'

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-700">
      {children}
    </label>
  )
}

export function TextField({ label, hint, id, className = '', ...props }) {
  return (
    <div className="grid gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input id={id} className={`${FIELD_CLASS} ${className}`} {...props} />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function TextArea({ label, hint, id, className = '', ...props }) {
  return (
    <div className="grid gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <textarea id={id} className={`${FIELD_CLASS} resize-y leading-relaxed ${className}`} {...props} />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function Select({ label, hint, id, options, placeholder, ...props }) {
  return (
    <div className="grid gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <select id={id} className={FIELD_CLASS} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
