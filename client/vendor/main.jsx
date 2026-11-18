import React from 'react';
import ReactDOM from 'react-dom/client';
import VendorApp from '../src/apps/VendorApp';
import '../src/index.css';
import { initApiRewrite } from '../src/utils/apiBootstrap';

initApiRewrite();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VendorApp />
  </React.StrictMode>
);
