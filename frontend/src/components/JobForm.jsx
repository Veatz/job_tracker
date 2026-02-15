import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { jobService } from '../services/api'
import './JobForm.css'

const JobForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    description: '',
    status: 'applied',
    location: '',
    salary_range: '',
    applied_date: new Date().toISOString().split('T')[0],
    interview_date: '',
    notes: '',
    job_url: '',
    contact_email: '',
    contact_name: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      loadJob()
    }
  }, [id])

  const loadJob = async () => {
    try {
      setLoading(true)
      setError(null)
      const job = await jobService.getById(id)

      const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''
        return date.toISOString().split('T')[0]
      }

      setFormData({
        company_name: job.company_name || '',
        position: job.position || '',
        description: job.description || '',
        status: job.status || 'applied',
        location: job.location || '',
        salary_range: job.salary_range || '',
        applied_date: formatDateForInput(job.applied_date),
        interview_date: formatDateForInput(job.interview_date),
        notes: job.notes || '',
        job_url: job.job_url || '',
        contact_email: job.contact_email || '',
        contact_name: job.contact_name || '',
      })
    } catch (err) {
      setError('Failed to load job. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const submitData = { ...formData }
      const optionalFields = ['description', 'location', 'salary_range', 'interview_date', 'notes', 'job_url', 'contact_email', 'contact_name']
      optionalFields.forEach(field => {
        if (submitData[field] === '') {
          submitData[field] = null
        }
      })

      if (isEdit) {
        await jobService.update(id, submitData)
      } else {
        await jobService.create(submitData)
      }
      navigate('/')
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        (err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : null) ||
        'Failed to save job. Please try again.'
      setError(errorMessage)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="job-form">
      <h2>{isEdit ? 'Edit Job Application' : 'Add New Job Application'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company_name">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="applied_date">Applied Date *</label>
            <input
              type="date"
              id="applied_date"
              name="applied_date"
              value={formData.applied_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="salary_range">Salary Range</label>
            <input type="text" id="salary_range" name="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="e.g., $50k - $70k" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="interview_date">Interview Date</label>
            <input type="date" id="interview_date" name="interview_date" value={formData.interview_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="job_url">Job URL</label>
            <input type="url" id="job_url" name="job_url" value={formData.job_url} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact_name">Contact Name</label>
            <input type="text" id="contact_name" name="contact_name" value={formData.contact_name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="contact_email">Contact Email</label>
            <input type="email" id="contact_email" name="contact_email" value={formData.contact_email} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Job description or notes..." />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Any additional notes..." />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobForm
