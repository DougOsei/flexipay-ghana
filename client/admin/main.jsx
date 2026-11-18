import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from '../src/apps/AdminApp';
import '../src/index.css';
import { initApiRewrite } from '../src/utils/apiBootstrap';

initApiRewrite();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
