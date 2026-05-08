import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import enUS from '@shopify/polaris/locales/en.json';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import PreviewPage from './pages/PreviewPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <AppProvider i18n={enUS}>
      <Router>
        {isAuthenticated ? (
          <div className="flex h-screen flex-col">
            <Navbar />
            <div className="flex-1 overflow-auto bg-gray-50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/preview/:jobId" element={<PreviewPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Router>
    </AppProvider>
  );
}

export default App;
