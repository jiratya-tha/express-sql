import React from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { useHealthCheckQuery, useGetAllUsersQuery } from '../../store/api/apiSlice';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: healthData, isLoading: healthLoading } = useHealthCheckQuery();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.username}!</p>
      </div>

      <div className="dashboard-grid">
        {/* User Info Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Your Account</h3>
            <span className="card-icon">👤</span>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">Username:</span>
              <span className="value">{user?.username}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Member since:</span>
              <span className="value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>System Status</h3>
            <span className="card-icon">🛠️</span>
          </div>
          <div className="card-content">
            {healthLoading ? (
              <div className="loading">Loading system status...</div>
            ) : (
              <div className="info-row">
                <span className="label">API Status:</span>
                <span className={`status ${healthData?.status === 'OK' ? 'online' : 'offline'}`}>
                  {healthData?.status === 'OK' ? '🟢 Online' : '🔴 Offline'}
                </span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Last Check:</span>
              <span className="value">
                {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Users Overview Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Users Overview</h3>
            <span className="card-icon">👥</span>
          </div>
          <div className="card-content">
            {usersLoading ? (
              <div className="loading">Loading users data...</div>
            ) : (
              <div className="info-row">
                <span className="label">Total Users:</span>
                <span className="value highlight">{usersData?.data?.length || 0}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
            <span className="card-icon">⚡</span>
          </div>
          <div className="card-content">
            <div className="action-buttons">
              <button className="action-btn">
                <span>📝</span>
                Edit Profile
              </button>
              <button className="action-btn">
                <span>📦</span>
                Manage Products
              </button>
              <button className="action-btn">
                <span>📊</span>
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 