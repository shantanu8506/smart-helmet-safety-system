import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import LocationPage from './pages/LocationPage';
import AccidentHistory from './pages/AccidentHistory';
import EmergencyContacts from './pages/EmergencyContacts';
import Settings from './pages/Settings';
import SystemStatus from './pages/SystemStatus';
import { HelmetProvider } from './context/HelmetContext';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="monitoring" element={<LiveMonitoring />} />
            <Route path="location" element={<LocationPage />} />
            <Route path="history" element={<AccidentHistory />} />
            <Route path="contacts" element={<EmergencyContacts />} />
            <Route path="settings" element={<Settings />} />
            <Route path="status" element={<SystemStatus />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
