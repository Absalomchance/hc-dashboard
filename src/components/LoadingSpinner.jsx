import './LoadingSpinner.css'

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-logo">PMS</div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner