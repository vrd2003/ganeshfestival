import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import Contributions from './pages/Contributions';
import Expenditures from './pages/Expenditures';
import Reports from './pages/Reports';
import { LanguageProvider } from './i18n';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <LanguageProvider>
      <Router>
        <div className="app-layout">
          <Navbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="main-content">
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contributions" element={<Contributions />} />
              <Route path="/expenditures" element={<Expenditures />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
