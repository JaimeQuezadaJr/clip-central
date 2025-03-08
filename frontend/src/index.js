import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Prevent scroll restoration
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
