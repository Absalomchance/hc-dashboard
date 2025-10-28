import { useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { Client } from '@microsoft/microsoft-graph-client'
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser'
import PerformanceChart from './PerformanceChart'
import StatsCards from './StatsCards'
import EmployeeList from './EmployeeList'
import DebugInfo from './DebugInfo'
import './Dashboard.css'

function Dashboard() {
  const { accounts, instance } = useMsal()
  const [performanceData, setPerformanceData] = useState([])
  const [employeeData, setEmployeeData] = useState([])
  const [departmentStats, setDepartmentStats] = useState({})
  const [overallStats, setOverallStats] = useState({})
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState({ sharePointSite: null, availableLists: [] })

  useEffect(() => {
    if (accounts.length > 0) {
      fetchData()
    }
  }, [accounts])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Initialize Graph client
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(instance, {
        account: accounts[0],
        scopes: ['Sites.Read.All', 'Directory.Read.All'],
      })
      
      const graphClient = Client.initWithMiddleware({ authProvider })

      // Fetch SharePoint list data
      const sharePointData = await fetchSharePointData(graphClient)
      
      // Fetch Active Directory users
      const adData = await fetchActiveDirectoryUsers(graphClient)
      
      // Process and combine the data
      const processedData = processPerformanceData(sharePointData, adData)
      
      setPerformanceData(processedData.chartData)
      setEmployeeData(processedData.employeeData)
      setDepartmentStats(processedData.departmentStats || {})
      setOverallStats(processedData.stats)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load dashboard data. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const fetchSharePointData = async (graphClient) => {
    try {
      // Get the SharePoint site first
      const siteResponse = await graphClient
        .api('/sites/nsaorgna.sharepoint.com:/sites/BISTeam')
        .get()
      
      console.log('SharePoint site found:', siteResponse.id)
      setDebugInfo(prev => ({ ...prev, sharePointSite: siteResponse.id }))
      
      // Get all lists to find the correct one
      const listsResponse = await graphClient
        .api(`/sites/${siteResponse.id}/lists`)
        .get()
      
      const availableLists = listsResponse.value.map(list => ({
        name: list.displayName,
        id: list.id
      }))
      
      console.log('Available lists:', availableLists)
      setDebugInfo(prev => ({ ...prev, availableLists }))
      
      // Try different variations of the list name
      const possibleNames = [
        'Performance Contract List',
        'Absalom Fanuel Performance',
        'Absalom%20Fanuel%20Performance',
        'Performance'
      ]
      
      let targetList = null
      
      // First try to find by exact name
      targetList = listsResponse.value.find(list => list.displayName === 'Performance Contract List')
      
      if (!targetList) {
        // Then try partial matches
        targetList = listsResponse.value.find(list => 
          list.displayName.includes('Performance') ||
          list.displayName.includes('Contract') ||
          list.displayName.includes('Absalom') ||
          list.displayName.includes('Fanuel')
        )
      }
      
      if (!targetList) {
        // Try by specific ID as fallback
        targetList = listsResponse.value.find(list => list.id === 'fe23ed74-0f8f-4f77-82fd-e6ed23b70a87')
      }
      
      if (!targetList) {
        console.error('Available lists:', listsResponse.value.map(l => l.displayName))
        throw new Error(`Performance Contract List not found. Available lists: ${listsResponse.value.map(l => l.displayName).join(', ')}`)
      }
      
      console.log('Found list:', targetList.displayName, 'ID:', targetList.id)
      
      // Get list items with proper field expansion
      const itemsResponse = await graphClient
        .api(`/sites/${siteResponse.id}/lists/${targetList.id}/items`)
        .expand('fields')
        .select('id,createdDateTime,createdBy,fields')
        .top(1000)
        .get()
      
      console.log('SharePoint data retrieved:', itemsResponse.value.length, 'records')
      console.log('Sample record:', itemsResponse.value[0])
      
      return itemsResponse.value || []
      
    } catch (error) {
      console.error('Error fetching SharePoint data:', error)
      throw new Error(`SharePoint connection failed: ${error.message}`)
    }
  }

  const fetchActiveDirectoryUsers = async (graphClient) => {
    try {
      // Get all users from the organization with their department information
      const response = await graphClient
        .api('/users')
        .select('id,displayName,mail,userPrincipalName,department,jobTitle,companyName')
        .filter("accountEnabled eq true") // Only active users
        .top(999) // Get maximum users
        .get()
      
      console.log('Active Directory users retrieved:', response.value.length, 'users')
      
      // Group users by department
      const usersByDepartment = {}
      response.value.forEach(user => {
        const department = user.department || 'Unknown Department'
        if (!usersByDepartment[department]) {
          usersByDepartment[department] = []
        }
        usersByDepartment[department].push(user)
      })
      
      console.log('Departments found:', Object.keys(usersByDepartment))
      return { allUsers: response.value, usersByDepartment }
      
    } catch (error) {
      console.error('Error fetching AD users:', error)
      throw new Error(`Active Directory connection failed: ${error.message}`)
    }
  }

  const processPerformanceData = (sharePointData, adData) => {
    const { allUsers, usersByDepartment } = adData
    
    console.log('Processing data. SharePoint records:', sharePointData.length, 'AD users:', allUsers.length)
    
    // Process SharePoint data to get performance records by user
    const performanceRecords = {}
    const departmentStats = {}
    
    sharePointData.forEach((item, index) => {
      try {
        const fields = item.fields
        
        // Debug: Show the first few records structure
        if (index < 3) {
          console.log(`Full record ${index + 1} structure:`, {
            item: item,
            fields: fields,
            createdBy: item.createdBy,
            fieldsKeys: Object.keys(fields || {})
          })
        } else if (index === 3) {
          console.log('Stopping detailed debug output...')
        }
        
        console.log(`Processing record ${index + 1}:`, fields)
        
        // Handle Choice column for ApprovalStatus
        const approvalStatus = fields.ApprovalStatus || 'Not Started'
        
        // Handle Person/Group column for Created By
        let createdBy = 'Unknown'
        let createdByEmail = ''
        
        // First check the main createdBy field from the API response
        if (item.createdBy?.user) {
          createdBy = item.createdBy.user.displayName || item.createdBy.user.mail || 'Unknown'
          createdByEmail = item.createdBy.user.mail || item.createdBy.user.userPrincipalName || ''
        }
        
        // Fallback to fields.Author if available
        if (createdBy === 'Unknown' && fields.Author) {
          if (typeof fields.Author === 'string') {
            createdBy = fields.Author
          } else if (fields.Author.LookupValue) {
            createdBy = fields.Author.LookupValue
          } else if (fields.Author.DisplayName) {
            createdBy = fields.Author.DisplayName
          }
          
          // Try to get email from Author field
          if (fields.Author?.Email) {
            createdByEmail = fields.Author.Email
          }
        }
        
        // Additional fallback for specific SharePoint person fields
        if (createdBy === 'Unknown' && fields.Created_x0020_By) {
          if (typeof fields.Created_x0020_By === 'string') {
            createdBy = fields.Created_x0020_By
          } else if (fields.Created_x0020_By.LookupValue) {
            createdBy = fields.Created_x0020_By.LookupValue
          }
        }
        
        console.log(`Record ${index + 1}: ${createdBy} (${createdByEmail}) - ${approvalStatus}`)
        
        // Find the user in AD to get their department
        const adUser = allUsers.find(u => 
          u.displayName?.toLowerCase() === createdBy?.toLowerCase() || 
          u.mail?.toLowerCase() === createdByEmail?.toLowerCase() ||
          u.userPrincipalName?.toLowerCase() === createdByEmail?.toLowerCase()
        )
        
        const userDepartment = adUser?.department || 'Unknown Department'
        
        // Track performance records by user
        const userKey = createdByEmail || createdBy
        if (!performanceRecords[userKey]) {
          performanceRecords[userKey] = {
            name: createdBy,
            email: createdByEmail || adUser?.mail || '',
            department: userDepartment,
            records: [],
            allApproved: true,
            hasRecords: false
          }
        }
        
        performanceRecords[userKey].records.push({
          status: approvalStatus,
          created: item.createdDateTime || new Date().toISOString()
        })
        
        performanceRecords[userKey].hasRecords = true
        
        // If any record is NOT approved, then user is not fully completed
        if (approvalStatus !== 'Approved') {
          performanceRecords[userKey].allApproved = false
        }
        
      } catch (error) {
        console.error('Error processing SharePoint record:', error, item)
      }
    })
    
    console.log('Performance records processed:', Object.keys(performanceRecords).length)
    
    // Calculate department statistics
    Object.keys(usersByDepartment).forEach(department => {
      const deptUsers = usersByDepartment[department]
      const usersWithRecords = Object.values(performanceRecords)
        .filter(record => record.department === department)
      
      // Completed: Has records AND all records are approved
      const completedUsers = usersWithRecords.filter(user => 
        user.hasRecords && user.allApproved
      ).length
      
      // In Progress: Has records BUT not all are approved
      const inProgressUsers = usersWithRecords.filter(user => 
        user.hasRecords && !user.allApproved
      ).length
      
      // Not Started: AD users in this department who have NO records at all
      const departmentUsersWithRecords = usersWithRecords.map(u => u.email?.toLowerCase() || u.name?.toLowerCase())
      const notStartedUsers = deptUsers.filter(adUser => {
        const userEmail = adUser.mail?.toLowerCase() || adUser.userPrincipalName?.toLowerCase()
        const userName = adUser.displayName?.toLowerCase()
        return !departmentUsersWithRecords.includes(userEmail) && !departmentUsersWithRecords.includes(userName)
      }).length
      
      departmentStats[department] = {
        totalEmployees: deptUsers.length,
        completed: completedUsers,
        inProgress: inProgressUsers,
        notStarted: notStartedUsers,
        completionRate: deptUsers.length > 0 ? (completedUsers / deptUsers.length * 100).toFixed(1) : 0
      }
    })
    
    // Prepare chart data for overall organization
    const totalEmployees = allUsers.length
    
    // Completed: Has records and ALL records are approved
    const totalCompleted = Object.values(performanceRecords).filter(user => 
      user.hasRecords && user.allApproved
    ).length
    
    // In Progress: Has records but NOT ALL are approved
    const totalInProgress = Object.values(performanceRecords).filter(user => 
      user.hasRecords && !user.allApproved
    ).length
    
    // Not Started: AD users who have NO records at all
    const allUsersWithRecords = Object.values(performanceRecords).map(u => 
      u.email?.toLowerCase() || u.name?.toLowerCase()
    )
    const totalNotStarted = allUsers.filter(adUser => {
      const userEmail = adUser.mail?.toLowerCase() || adUser.userPrincipalName?.toLowerCase()
      const userName = adUser.displayName?.toLowerCase()
      return !allUsersWithRecords.includes(userEmail) && !allUsersWithRecords.includes(userName)
    }).length
    
    const chartData = [
      { name: 'Completed', value: totalCompleted, color: '#4ade80' },
      { name: 'In Progress', value: totalInProgress, color: '#fbbf24' },
      { name: 'Not Started', value: totalNotStarted, color: '#f87171' }
    ]
    
    // Prepare employee data for the list
    const employeeData = []
    
    // Add users with performance records
    Object.values(performanceRecords).forEach(record => {
      let status
      if (record.hasRecords && record.allApproved) {
        status = 'Approved'
      } else if (record.hasRecords && !record.allApproved) {
        status = 'In Progress'
      } else {
        status = 'Not Started'
      }
      
      employeeData.push({
        name: record.name,
        email: record.email,
        department: record.department,
        status: status,
        createdDate: record.records[0]?.created || null,
        recordCount: record.records.length
      })
    })
    
    // Add users from AD who have NO performance records at all
    const recordedUsersIdentifiers = Object.values(performanceRecords).map(u => 
      u.email?.toLowerCase() || u.name?.toLowerCase()
    )
    
    allUsers.forEach(user => {
      const userEmail = user.mail?.toLowerCase() || user.userPrincipalName?.toLowerCase()
      const userName = user.displayName?.toLowerCase()
      
      // Only add if this user doesn't already have records
      if (!recordedUsersIdentifiers.includes(userEmail) && !recordedUsersIdentifiers.includes(userName)) {
        employeeData.push({
          name: user.displayName,
          email: user.mail || user.userPrincipalName,
          department: user.department || 'Unknown Department',
          status: 'Not Started',
          createdDate: null,
          recordCount: 0
        })
      }
    })
    
    console.log('Final processed data:', {
      totalRecords: sharePointData.length,
      totalUsers: allUsers.length,
      employeeDataCount: employeeData.length,
      departmentCount: Object.keys(departmentStats).length
    })
    
    return {
      chartData,
      employeeData,
      departmentStats,
      stats: {
        total: totalEmployees,
        completed: totalCompleted,
        inProgress: totalInProgress,
        notStarted: totalNotStarted
      }
    }
  }

  // Filter data based on selected department
  const getFilteredData = () => {
    if (selectedDepartment === 'All Departments') {
      return {
        chartData: performanceData,
        employeeList: employeeData,
        stats: overallStats
      }
    }
    
    const deptEmployees = employeeData.filter(emp => emp.department === selectedDepartment)
    const deptStats = departmentStats[selectedDepartment] || {}
    
    const deptChartData = [
      { name: 'Completed', value: deptStats.completed || 0, color: '#4ade80' },
      { name: 'In Progress', value: deptStats.inProgress || 0, color: '#fbbf24' },
      { name: 'Not Started', value: deptStats.notStarted || 0, color: '#f87171' }
    ]
    
    return {
      chartData: deptChartData,
      employeeList: deptEmployees,
      stats: deptStats
    }
  }

  const filteredData = getFilteredData()

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Loading performance data from SharePoint and Active Directory...</p>
          <p style={{ fontSize: '1rem', color: '#4b5563' }}>This may take a moment...</p>
        </div>
      </div>
    )
  }

      if (error) {
    return (
      <div className="dashboard-error">
        <h3>Connection Error</h3>
        <p>{error}</p>
        
        <DebugInfo 
          sharePointSite={debugInfo.sharePointSite}
          availableLists={debugInfo.availableLists}
          error={error}
        />
        
        <div className="error-details">
          <h4>Please check:</h4>
          <ul>
            <li>Your account has access to the "Performance Contract List"</li>
            <li>The list exists in the BISTeam site</li>
            <li>Required columns: ApprovalStatus (Choice), Created By (Person/Group)</li>
            <li>Network connectivity to Microsoft services</li>
          </ul>
        </div>
        <button onClick={fetchData} className="retry-btn">
          🔄 Retry Connection
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Performance Management Overview</h2>
        </div>
        <div className="header-controls">
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="department-filter"
          >
            <option value="All Departments">All Departments</option>
            {Object.keys(departmentStats).sort().map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <button onClick={fetchData} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </div>
      </div>
      
      <div className="department-summary">
        {selectedDepartment === 'All Departments' ? (
          <div className="summary-card">
            <h3>📊 Organization Overview</h3>
            <p>Total Employees: <strong>{overallStats.total || 0}</strong></p>
            <p>Departments: <strong>{Object.keys(departmentStats).length}</strong></p>
          </div>
        ) : (
          <div className="summary-card">
            <h3>🏢 {selectedDepartment}</h3>
            <p>Department Employees: <strong>{departmentStats[selectedDepartment]?.totalEmployees || 0}</strong></p>
            <p>Completion Rate: <strong>{departmentStats[selectedDepartment]?.completionRate || 0}%</strong></p>
          </div>
        )}
      </div>
      
      <StatsCards data={filteredData.chartData} />
      
      <div className="dashboard-content">
        <div className="chart-section">
          <PerformanceChart data={filteredData.chartData} />
        </div>
        
        <div className="list-section">
          <EmployeeList employees={filteredData.employeeList} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard