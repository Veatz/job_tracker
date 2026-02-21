import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export const jobService = {
  getAll: async () => {
    const response = await api.get('/jobs')
    return response.data.data
  },

  getById: async (id) => {
    const response = await api.get(`/jobs/${id}`)
    return response.data.data
  },

  create: async (jobData) => {
    const response = await api.post('/jobs', jobData)
    return response.data.data
  },

  update: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData)
    return response.data.data
  },

  delete: async (id) => {
    await api.delete(`/jobs/${id}`)
  },
}

export default api
