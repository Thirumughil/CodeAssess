import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

console.log('Main.jsx starting...');
window.onerror = (msg, url, line, col, error) => {
  console.error('GLOBAL ERROR:', msg, '\nAt:', url, ':', line, ':', col, '\nStack:', error?.stack);
};

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
