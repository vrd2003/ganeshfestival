import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, ClipboardList, FileBarChart, LayoutDashboard, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../i18n';

const Navbar = ({ isOpen, toggleSidebar }) => {
  const { language, setLanguage, t } = useLanguage();
  const navItems = [
    { path: '/', label: t('dashboard'), icon: <LayoutDashboard /> },
    { path: '/contributions', label: t('contributions'), icon: <BarChart3 /> },
    { path: '/expenditures', label: t('expenditures'), icon: <ClipboardList /> },
    { path: '/reports', label: t('reports'), icon: <FileBarChart /> }
  ];
  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button className="menu-toggle" onClick={toggleSidebar} id="menu-toggle-btn">
          <Menu />
        </button>
        <div className="mobile-brand">
          <span className="brand-icon">🙏</span>
          <span>Ganesh Festival</span>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} id="main-sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">🙏</span>
            <div className="brand-text">
              <h1>Ganpati Mandal</h1>
              <span className="brand-subtitle">{t('financialManager')}</span>
            </div>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <X />
          </button>
        </div>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                end={item.path === '/'}
                id={`nav-${item.label.toLowerCase()}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="language-switcher">
          <Languages size={16} />
          <label htmlFor="language-select">{t('language')}</label>
          <select id="language-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="en">{t('english')}</option>
            <option value="mr">{t('marathi')}</option>
          </select>
        </div>


        <div className="sidebar-footer">
          <p>गणपती बाप्पा मोरया!</p>
          <span className="footer-year">© 2026</span>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
