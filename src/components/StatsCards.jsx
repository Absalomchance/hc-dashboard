import './StatsCards.css'

function StatsCards({ data }) {
  const totalEmployees = data.reduce((sum, item) => sum + item.value, 0)
  const completedCount = data.find(item => item.name === 'Completed')?.value || 0
  const inProgressCount = data.find(item => item.name === 'In Progress')?.value || 0
  const notStartedCount = data.find(item => item.name === 'Not Started')?.value || 0
  
  const completionRate = totalEmployees > 0 ? ((completedCount / totalEmployees) * 100).toFixed(1) : 0

  const cards = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: '👥',
      color: '#3b82f6'
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: '✅',
      color: '#10b981',
      percentage: totalEmployees > 0 ? ((completedCount / totalEmployees) * 100).toFixed(1) : 0
    },
    {
      title: 'In Progress',
      value: inProgressCount,
      icon: '⏳',
      color: '#f59e0b',
      percentage: totalEmployees > 0 ? ((inProgressCount / totalEmployees) * 100).toFixed(1) : 0
    },
    {
      title: 'Not Started',
      value: notStartedCount,
      icon: '⚠️',
      color: '#ef4444',
      percentage: totalEmployees > 0 ? ((notStartedCount / totalEmployees) * 100).toFixed(1) : 0
    }
  ]

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card" style={{ borderTopColor: card.color }}>
          <div className="stat-icon" style={{ backgroundColor: `${card.color}20` }}>
            {card.icon}
          </div>
          <div className="stat-content">
            <h3 className="stat-title">{card.title}</h3>
            <div className="stat-value">{card.value}</div>
            {card.percentage && (
              <div className="stat-percentage" style={{ color: card.color }}>
                {card.percentage}% of total
              </div>
            )}
          </div>
        </div>
      ))}
      
      <div className="completion-rate-card">
        <h4>Overall Completion Rate</h4>
        <div className="completion-rate">
          <div className="rate-circle">
            <span className="rate-value">{completionRate}%</span>
          </div>
          <p>Performance agreements completed</p>
        </div>
      </div>
    </div>
  )
}

export default StatsCards