const BASE_URL = import.meta.env.VITE_API_URL ?? ''
const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || data?.details || `Request failed with status ${response.status}`)
  }

  return data
}

function postJson(path, payload) {
  return request(path, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(payload) })
}

export const api = {
  uploadResume(file) {
    const body = new FormData()
    body.append('file', file)
    return request('/api/resumes/upload', { method: 'POST', body })
  },
  analyzeResume: (resumeId) => request(`/api/resumes/${resumeId}/analyze`, { method: 'POST' }),
  analyzeResumeText: (text) => postJson('/api/resumes/test-ai', { text }),
  createJob: (title, description) => postJson('/api/jobs', { title, description }),
  analyzeJob: (jobId) => request(`/api/jobs/${jobId}/analyze`, { method: 'POST' }),
  previewJob: (description) => postJson('/api/jobs/test-ai', { description }),
  getJob: (jobId) => request(`/api/jobs/${jobId}`),
  screenCandidate: (resumeId, jobId) =>
    request(`/api/screening/resume/${resumeId}/job/${jobId}`, { method: 'POST' }),
  matchWithInstructions: (candidate, job, screeningPrompt) =>
    postJson('/api/resumes/test-match', { candidate, job, screeningPrompt }),
  skillGap: (resumeId, jobId) =>
    request(`/api/skill-gap/resume/${resumeId}/job/${jobId}`, { method: 'POST' }),
  skillGapForProfiles: (candidate, job) => postJson('/api/screening/test-skill-gap', { candidate, job }),
  ranking: (jobId, threshold) => request(`/api/ranking/job/${jobId}?threshold=${threshold}`),
  biasAudit: () => request('/api/bias/audit'),
}
