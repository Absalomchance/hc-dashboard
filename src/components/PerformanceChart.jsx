import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import './PerformanceChart.css'

function PerformanceChart({ data }) {
  const COLORS = {
    'Completed': '#4ade80',
    'In Progress': '#fbbf24',
    'Not Started': '#f87171'
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="percentage">
            {`${((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="performance-chart">
      <h3>Performance Agreement Status</h3>
      
      <div className="charts-container">
        <div className="bar-chart-container">
          <h4>Status Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" fill="#1e3a8a">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PerformanceChart