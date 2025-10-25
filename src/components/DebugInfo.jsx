import './DebugInfo.css'

function DebugInfo({ sharePointSite, availableLists, error }) {
  if (!error) return null

  return (
    <div className="debug-info">
      <h4>🔍 Debug Information</h4>
      
      <div className="debug-section">
        <h5>SharePoint Connection:</h5>
        <p>✅ Site Connected: {sharePointSite || 'Not connected'}</p>
      </div>
      
      {availableLists && availableLists.length > 0 && (
        <div className="debug-section">
          <h5>Available Lists Found:</h5>
          <ul>
            {availableLists.map((list, index) => (
              <li key={index}>
                <strong>{list.name}</strong> (ID: {list.id})
              </li>
            ))}
          </ul>
          <p>💡 <strong>Tip:</strong> If you see your list above, the name might be slightly different than expected.</p>
        </div>
      )}
      
      <div className="debug-section">
        <h5>Expected List:</h5>
        <p>Looking for: <strong>"Performance Contract List"</strong></p>
        <p>Expected ID: <code>fe23ed74-0f8f-4f77-82fd-e6ed23b70a87</code></p>
      </div>
      
      <div className="debug-section">
        <h5>Quick Fixes:</h5>
        <ul>
          <li>Verify the exact list name in SharePoint</li>
          <li>Check that your account has access to the list</li>
          <li>Ensure the list is in the "BISTeam" site</li>
        </ul>
      </div>
    </div>
  )
}

export default DebugInfo