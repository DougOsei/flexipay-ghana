import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// When the frontend is hosted separately from the API (e.g. GitHub Pages + Render),
// VITE_API_URL points at the backend. All existing `fetch('/api/...')` calls are
// transparently rewritten so no component code needs to change.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
if (API_URL) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api')) {
      input = API_URL + input;
    }
    return nativeFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
