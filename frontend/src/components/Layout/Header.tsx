import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { addNotification } from '../../store/slices/uiSlice';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({
      type: 'success',
      message: 'Logged out successfully',
    }));
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          onClick={handleToggleSidebar}
          className="sidebar-toggle"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <Link to="/dashboard" className="logo">
          <h1>Express SQL</h1>
        </Link>
      </div>

      <div className="header-right">
        <div className="user-menu">
          <span className="user-name">Welcome, {user?.username}</span>
          <div className="user-dropdown">
            <Link to="/profile" className="dropdown-item">
              Profile
            </Link>
            <button onClick={handleLogout} className="dropdown-item logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 