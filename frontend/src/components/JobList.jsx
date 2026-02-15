import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobService } from '../services/api'
import JobCard from './JobCard'
import DeleteModal from './DeleteModal'
import './JobList.css'

const JobList = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null, jobTitle: '' })
  const navigate = useNavigate()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const data = await jobService.getAll()
      setJobs(data)
      setError(null)
    } catch (err) {
      setError('Failed to load jobs. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id, companyName, position) => {
    setDeleteModal({
      isOpen: true,
      jobId: id,
      jobTitle: `${companyName} - ${position}`
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.jobId) return

    try {
      await jobService.delete(deleteModal.jobId)
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' })
      loadJobs()
    } catch (err) {
      setError('Failed to delete job. Please try again.')
      console.error(err)
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' })
  }

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter(job => job.status === filter)

  const statusCounts = {
    all: jobs.length,
    applied: jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    accepted: jobs.filter(j => j.status === 'accepted').length,
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="job-list">
      <div className="job-list-header">
        <h2>Job Applications</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/jobs/new')}
        >
          Add New Job
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        {['all', 'applied', 'interview', 'offer', 'rejected', 'accepted'].map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="count">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <p>No job applications found.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/jobs/new')}
          >
            Add Your First Job
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        jobTitle={deleteModal.jobTitle}
      />
    </div>
  )
}

export default JobList
