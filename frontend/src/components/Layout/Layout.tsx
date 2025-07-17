import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppSelector } from '../../hooks/reduxHooks';
import './Layout.css';

const Layout: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 