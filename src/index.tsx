import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import Login from './Login';
import Dashboard from './Dashboard';
import reportWebVitals from './reportWebVitals';
import { registerLicense } from '@syncfusion/ej2-base'

const license = process.env.REACT_APP_SYNCFUSION_LICENSE;
if (license !== undefined) {
  registerLicense(license);
}

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
