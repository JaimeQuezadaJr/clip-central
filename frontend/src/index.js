import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Prevent scroll restoration
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Check if we're using React 18 or React 17
const rootElement = document.getElementById('root');

// Add console logs to debug
console.log('Starting React render process');
console.log('Root element found:', !!rootElement);

try {
  // React 18 uses createRoot
  if (ReactDOM.createRoot) {
    console.log('Using React 18 rendering');
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } 
  // React 17 uses render
  else {
    console.log('Using React 17 rendering');
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      rootElement
    );
  }
  console.log('React render call completed');
} catch (error) {
  console.error('Error during React rendering:', error);
  // Display error on page
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; max-width: 600px; margin: 40px auto; text-align: center; font-family: sans-serif;">
        <h2 style="color: #e53e3e;">React Rendering Error</h2>
        <p>${error.message || 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 20px;">
          Reload Page
        </button>
      </div>
    `;
  }
}
