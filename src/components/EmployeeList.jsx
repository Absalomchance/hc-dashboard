import { useState } from 'react'
import { format } from 'date-fns'
import './EmployeeList.css'

function EmployeeList({ employees }) {
  const [sortBy, setSortBy] = useState('name')
  const [filterBy, setFilterBy] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#10b981'
      case 'In Progress':
      case 'Pending Review':
        return '#f59e0b'
      case 'Not Started':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return '✅'
      case 'In Progress':
      case 'Pending Review':
        return '⏳'
      case 'Not Started':
        return '❌'
      default:
        return '❓'
    }
  }

  const filteredEmployees = employees
    .filter(employee => {
      if (filterBy === 'all') return true
      if (filterBy === 'completed') return employee.status === 'Approved'
      if (filterBy === 'progress') return employee.status === 'In Progress' || employee.status === 'Pending Review'
      if (filterBy === 'not-started') return employee.status === 'Not Started'
      return true
    })
    .filter(employee => 
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'status':
          return (a.status || '').localeCompare(b.status || '')
        case 'department':
          return (a.department || '').localeCompare(b.department || '')
        case 'date':
          return new Date(b.createdDate || 0) - new Date(a.createdDate || 0)
        default:
          return 0
      }
    })

  return (
    <div className="employee-list">
      <div className="list-header">
        <h3>Employee Performance Status</h3>
        
        <div className="list-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="progress">In Progress</option>
              <option value="not-started">Not Started</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="department">Sort by Department</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      <div className="employee-grid">
        {filteredEmployees.length === 0 ? (
          <div className="no-results">
            <p>No employees found matching your criteria.</p>
          </div>
        ) : (
          filteredEmployees.map((employee, index) => (
            <div key={index} className="employee-card">
              <div className="employee-info">
                <div className="employee-avatar">
                  {(employee.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="employee-details">
                  <h4 className="employee-name">{employee.name || 'Unknown'}</h4>
                  <p className="employee-email">{employee.email || 'No email'}</p>
                  <p className="employee-department">🏢 {employee.department || 'Unknown Department'}</p>
                  {employee.createdDate && (
                    <p className="employee-date">
                      Created: {format(new Date(employee.createdDate), 'MMM dd, yyyy')}
                    </p>
                  )}
                  {employee.recordCount > 0 && (
                    <p className="employee-records">
                      📋 {employee.recordCount} record{employee.recordCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="employee-status">
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(employee.status)}20`,
                    color: getStatusColor(employee.status),
                    border: `1px solid ${getStatusColor(employee.status)}30`
                  }}
                >
                  {getStatusIcon(employee.status)} {employee.status || 'Not Started'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="list-summary">
        <p>Showing {filteredEmployees.length} of {employees.length} employees</p>
      </div>
    </div>
  )
}

export default EmployeeList