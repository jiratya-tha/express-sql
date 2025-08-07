import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks';
import { initializeFromToken } from './store/slices/authSlice';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import UserProfile from './pages/User/UserProfile';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Initialize user data from token on app load
  useEffect(() => {
    dispatch(initializeFromToken());
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />
        
        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App; 