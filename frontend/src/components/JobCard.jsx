import React from 'react'
import { useNavigate } from 'react-router-dom'
import './JobCard.css'

const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'accepted']

const JobCard = ({ job, onDelete, onUpdateStatus, isStatusUpdating }) => {
  const navigate = useNavigate()

  const handleDeleteClick = () => {
    onDelete(job.id, job.company_name, job.position)
  }

  const getStatusColor = (status) => {
    const colors = {
      applied: '#3b82f6',
      interview: '#f59e0b',
      offer: '#10b981',
      rejected: '#ef4444',
      accepted: '#10b981',
    }
    return colors[status] || '#6b7280'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="company-name">{job.company_name}</h3>
          <p className="position">{job.position}</p>
        </div>
        <select
          className="status-select"
          style={{ backgroundColor: getStatusColor(job.status) }}
          value={job.status || 'applied'}
          onChange={(e) => onUpdateStatus(job.id, e.target.value)}
          disabled={isStatusUpdating}
          aria-label={`Update status for ${job.company_name}`}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {job.location && (
        <p className="job-info">
          <span className="label">Location:</span> {job.location}
        </p>
      )}

      {job.salary_range && (
        <p className="job-info">
          <span className="label">Salary:</span> {job.salary_range}
        </p>
      )}

      <p className="job-info">
        <span className="label">Applied:</span> {formatDate(job.applied_date)}
      </p>

      {job.interview_date && (
        <p className="job-info">
          <span className="label">Interview:</span> {formatDate(job.interview_date)}
        </p>
      )}

      {job.description && (
        <p className="description">{job.description.substring(0, 100)}...</p>
      )}

      <div className="job-card-actions">
        <button
          type="button"
          className="btn btn-edit"
          onClick={() => navigate(`/jobs/${job.id}/edit`)}
          title="Edit"
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-icon"
          onClick={handleDeleteClick}
          title="Delete"
          aria-label="Delete"
        >
          <svg className="icon-trash" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default JobCard
