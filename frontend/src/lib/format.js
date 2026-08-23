export const toPercent = (value) => Math.max(0, Math.min(100, Number(value) || 0))

export const roundPercent = (value) => Math.round(toPercent(value))
