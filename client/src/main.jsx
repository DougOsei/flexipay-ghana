import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initApiRewrite } from './utils/apiBootstrap';

initApiRewrite();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
