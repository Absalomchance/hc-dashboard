# Performance Management System Dashboard

A modern React-based dashboard for Human Capital Department to track and visualize performance agreement progress in real-time.

## Features

- **Real-time Performance Tracking**: Connects to SharePoint lists to display live performance agreement status
- **Azure AD Integration**: Secure authentication using Microsoft Azure Active Directory
- **Interactive Visualizations**: Beautiful charts and graphs using Recharts library
- **Employee Analytics**: Individual and department-wide performance insights
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Active Directory Integration**: Shows department employee counts and completion rates

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Azure AD App Registration (see SETUP.md for details)
- Access to SharePoint list at: `https://nsaorgna.sharepoint.com/sites/BISTeam/Lists/Absalom%20Fanuel%20Performance/`

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Azure AD settings:**
   - Open `src/config.js`
   - Replace `YOUR_CLIENT_ID` with your Azure App Registration client ID
   - Replace `YOUR_TENANT_ID` with your Azure AD tenant ID

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### Deployment to cPanel

1. Run `npm run build`
2. Upload the contents of the `dist` folder to your cPanel `public_html` directory
3. Update Azure AD redirect URIs to include your production domain

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx       # Main dashboard component
│   ├── Login.jsx          # Authentication component
│   ├── Header.jsx         # Navigation header
│   ├── PerformanceChart.jsx # Charts and visualizations
│   ├── StatsCards.jsx     # Statistics overview cards
│   └── EmployeeList.jsx   # Employee status listing
├── config.js              # Configuration settings
├── App.jsx               # Main application component
└── main.jsx              # Application entry point
```

## Configuration

### SharePoint Integration
The dashboard connects to your SharePoint list and expects these columns:
- **ApprovalStatus**: Choice field with values like "Approved", "In Progress", "Pending Review"
- **Created By**: Person field (automatically populated)
- **Created**: Date field (automatically populated)

### Azure AD Setup
See `SETUP.md` for detailed Azure AD App Registration instructions.

## Dashboard Views

1. **Statistics Overview**: Total employees, completion rates, and progress metrics
2. **Performance Charts**: Visual representation of approval status distribution
3. **Employee List**: Searchable, filterable list of all employees and their status
4. **Real-time Updates**: Refresh button to get latest data from SharePoint

## Technology Stack

- **Frontend**: React 18, Vite
- **Authentication**: Microsoft MSAL (Azure AD)
- **Data Source**: Microsoft Graph API, SharePoint
- **Visualizations**: Recharts
- **Styling**: Custom CSS with responsive design
- **Routing**: React Router

## Support

For setup assistance, see `SETUP.md` or check the browser console for error messages.

## License

Internal use for NSA organization.
