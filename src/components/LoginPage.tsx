import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';
import type { LoginCredentials } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    error,
    login,
    clearError
  } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const success = await login(credentials);
      return success;
    } catch (error) {
      // Error is handled by the hook
      return false;
    }
  };

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <Login
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
      onClearError={clearError}
    />
  );
};

export default LoginPage; 