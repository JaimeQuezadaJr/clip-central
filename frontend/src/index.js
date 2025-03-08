import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// Remove or comment out the App import if you're not using it
// import App from './App';
import TestApp from './TestApp';
import MinimalApp from './MinimalApp';

// Prevent scroll restoration
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Add error handling
const renderApp = () => {
  try {
    console.log('Starting to render application');
    
    // Render the test app instead of your main app
    ReactDOM.render(
      <React.StrictMode>
        <TestApp />
      </React.StrictMode>,
      document.getElementById('root')
    );
    
    console.log('Render completed successfully');
  } catch (error) {
    console.error('Error rendering application:', error);
    
    // Render a fallback error message directly to the DOM
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; max-width: 800px; margin: 40px auto; font-family: Arial, sans-serif; text-align: center;">
          <h1 style="color: red;">Something went wrong</h1>
          <p>Error: ${error.message || 'Unknown error'}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px;">
            Reload Page
          </button>
        </div>
      `;
    }
  }
};

// Execute the render function
renderApp();

// Log when index.js loads
console.log('index.js loaded');

try {
  console.log('Attempting to render MinimalApp');
  
  // Use the most basic rendering approach
  ReactDOM.render(
    <MinimalApp />,
    document.getElementById('root')
  );
  
  console.log('MinimalApp rendered successfully');
} catch (error) {
  console.error('Error rendering MinimalApp:', error);
  
  // Try to display an error message
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `<h1>Error: ${error.message}</h1>`;
  }
}
