import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx starting...');
window.onerror = (msg, url, line) => {
  console.error('GLOBAL ERROR:', msg, 'at', url, ':', line);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
