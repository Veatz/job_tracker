import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <Link to="/">Job Tracker</Link>
          </h1>
          <nav className="nav">
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              All Jobs
            </Link>
            <Link
              to="/jobs/new"
              className={location.pathname === '/jobs/new' ? 'active' : ''}
            >
              Add Job
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
