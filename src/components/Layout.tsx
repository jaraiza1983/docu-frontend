import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout
  } = useAuth();

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="App">
      <Navigation
        user={user!}
        onLogout={handleLogout}
      />
      
      <main className="container-fluid px-4">
        <Outlet />
      </main>

      <footer className="bg-light mt-5 py-4">
        <div className="container-fluid text-center text-muted">
          <p className="mb-0">© 2024 DocuCMS - Sistema de Gestión de Contenido</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 