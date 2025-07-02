import { useState, useEffect } from 'react';
import { apiClient, setAuthToken, removeAuthToken, getAuthToken, setUser, getUser, removeUser } from '../services/api';
import type { User, LoginCredentials, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getAuthToken();
      const user = getUser();
      
      if (token && user) {
        // User is authenticated and we have user data
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else if (token && !user) {
        // Token exists but no user data, clear everything
        removeAuthToken();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.login(credentials);
      
      // Store the token and user data
      setAuthToken(response.access_token);
      setUser(response.user);
      
      // Set authenticated state immediately
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      });
      
      return false;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'creator';
  }): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.register(userData);
      
      // Store the token and user data
      setAuthToken(response.access_token);
      setUser(response.user);
      
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      });
      
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    removeAuthToken();
    removeUser();
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    clearError
  };
}; 