import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TenantProvider } from './contexts/TenantContext'
import { BrowserRouter as Router } from 'react-router-dom'

console.log('main.tsx is running');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  rootElement.innerHTML = '<div>Loading app...</div>';

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        <TenantProvider>
          <App />
        </TenantProvider>
      </Router>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Error rendering the app:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>שגיאה בטעינת האפליקציה</h1>
    <p>אנא בדוק את קונסול הדפדפן לפרטים נוספים.</p>
    <pre>${error instanceof Error ? error.stack : JSON.stringify(error)}</pre>
  </div>`;
}