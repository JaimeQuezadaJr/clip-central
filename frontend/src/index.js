import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Prevent scroll restoration - using window.history to avoid ESLint errors
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
