const BASE_URL = import.meta.env.VITE_API_URL ?? ''
const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, options)
  } catch {
    throw new Error('The backend could not be reached. Check that the API is running.')
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || data?.details || `Request failed with status ${response.status}`)
  }

  return data
}

function postJson(path, payload) {
  return request(path, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(payload) })
}

// Returns null instead of throwing when the record does not exist yet.
async function requestOptional(path) {
  try {
    return await request(path)
  } catch (caught) {
    if (caught.message.includes('404')) return null
    throw caught
  }
}

export const api = {
  uploadResume(file) {
    const body = new FormData()
    body.append('file', file)
    return request('/api/resumes/upload', { method: 'POST', body })
  },
  analyzeResume: (resumeId) => request(`/api/resumes/${resumeId}/analyze`, { method: 'POST' }),
  analyzeResumeText: (text) => postJson('/api/resumes/test-ai', { text }),
  listResumes: () => request('/api/resumes'),
  getResume: (resumeId) => request(`/api/resumes/${resumeId}`),

  createJob: (title, description, screeningPrompt) =>
    postJson('/api/jobs', { title, description, screeningPrompt }),
  analyzeJob: (jobId) => request(`/api/jobs/${jobId}/analyze`, { method: 'POST' }),
  listJobs: () => request('/api/jobs'),
  getJob: (jobId) => request(`/api/jobs/${jobId}`),

  screenCandidate: (resumeId, jobId) =>
    request(`/api/screening/resume/${resumeId}/job/${jobId}`, { method: 'POST' }),
  getStoredScreening: (resumeId, jobId) =>
    requestOptional(`/api/screening/resume/${resumeId}/job/${jobId}`),

  skillGap: (resumeId, jobId) =>
    request(`/api/skill-gap/resume/${resumeId}/job/${jobId}`, { method: 'POST' }),
  skillGapForProfiles: (candidate, job) => postJson('/api/screening/test-skill-gap', { candidate, job }),

  ranking: (jobId, threshold) => request(`/api/ranking/job/${jobId}?threshold=${threshold}`),

  biasAudit: () => request('/api/bias/audit'),
}
