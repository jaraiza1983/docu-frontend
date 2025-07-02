import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface NavigationProps {
  user: User;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Inicializar tooltips de Bootstrap
  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl: any) {
      return new (window as any).bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <i className="bi bi-journal-text me-2"></i>
          CMS DocuFrontend
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto">
            <NavLink 
              to="/content" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              title="Content Management"
            >
              <i className="bi bi-file-text"></i>
            </NavLink>
            
            <NavLink 
              to="/projects" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              title="Project Management"
            >
              <i className="bi bi-kanban"></i>
            </NavLink>
            
            <NavLink 
              to="/documentation" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              title="Documentation"
            >
              <i className="bi bi-book"></i>
            </NavLink>
            
            {user?.role === 'admin' && (
              <NavLink 
                to="/users" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title="User Management"
              >
                <i className="bi bi-people"></i>
              </NavLink>
            )}
          </div>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                {user.name}
                <span className={`badge ms-2 ${user.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                  {user.role === 'admin' ? 'Admin' : 'Creator'}
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <span className="dropdown-item-text">
                    <i className="bi bi-envelope me-2"></i>
                    {user.email}
                  </span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item text-danger" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 