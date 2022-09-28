import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { registerLicense, enableRipple } from '@syncfusion/ej2-base'
import reportWebVitals from './reportWebVitals';
import './index.css';
import { AuthProvider, Dashboard } from './common';
import Login from './login';

const license = process.env.REACT_APP_SYNCFUSION_LICENSE;
if (license !== undefined) {
  registerLicense(license);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

enableRipple(true);

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
root.render(
  // StrictMode is disabled because it causes the Syncfusion Grid component to fail to render.
  // This seems to be related to changes in React 18 that unmounts and remounts components.
  // See: https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
  // Syncfusion may need to update their components to better support unmounting and remounting.
  // <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
