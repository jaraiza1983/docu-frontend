import React, { useState } from 'react';
import type { Project, ProjectStatus, ProjectArea } from '../services/projectApi';

interface ProjectListProps {
  projects: Project[];
  projectStatuses: ProjectStatus[];
  projectAreas: ProjectArea[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
  onView: (project: Project) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  projectStatuses, 
  projectAreas, 
  onEdit, 
  onDelete, 
  onView, 
  onCreateNew, 
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | ''>('');
  const [selectedArea, setSelectedArea] = useState<number | ''>('');
  const [selectedUser, setSelectedUser] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtrar y ordenar proyectos
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || project.statusId === selectedStatus;
      const matchesArea = !selectedArea || project.areaId === selectedArea;
      const matchesUser = !selectedUser || project.authorId === selectedUser;
      
      return matchesSearch && matchesStatus && matchesArea && matchesUser;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'priority':
          aValue = a.priority || 0;
          bValue = b.priority || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          aValue = a.priority || 0;
          bValue = b.priority || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusName = (statusId: number) => {
    return projectStatuses.find(status => status.id === statusId)?.name || 'Sin estado';
  };

  const getAreaName = (areaId: number) => {
    return projectAreas.find(area => area.id === areaId)?.name || 'Sin área';
  };

  // Obtener usuarios únicos de los proyectos
  const getUniqueUsers = () => {
    const users = new Map<number, { id: number; name: string; email: string }>();
    
    projects.forEach(project => {
      if (project.author) {
        users.set(project.author.id, {
          id: project.author.id,
          name: project.author.name,
          email: project.author.email
        });
      }
    });
    
    return Array.from(users.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const getStatusBadge = (statusId: number) => {
    const status = projectStatuses.find(s => s.id === statusId);
    if (!status) return <span className="badge bg-secondary">Sin estado</span>;
    
    let badgeClass = 'bg-secondary';
    if (status.priority >= 80) badgeClass = 'bg-danger';
    else if (status.priority >= 60) badgeClass = 'bg-warning';
    else if (status.priority >= 40) badgeClass = 'bg-info';
    else if (status.priority >= 20) badgeClass = 'bg-success';
    
    return (
      <span className={`badge ${badgeClass} text-white`}>
        {status.name}
      </span>
    );
  };

  const getPriorityBadge = (priority: number) => {
    let badgeClass = 'bg-secondary';
    if (priority >= 80) badgeClass = 'bg-danger';
    else if (priority >= 60) badgeClass = 'bg-warning';
    else if (priority >= 40) badgeClass = 'bg-info';
    else if (priority >= 20) badgeClass = 'bg-success';
    
    return (
      <span className={`badge ${badgeClass} text-white`}>
        <i className="bi bi-star-fill me-1"></i>
        {priority}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedArea('');
    setSelectedUser('');
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
      {/* Sidebar de Filtros - Ancho fijo */}
      <div style={{
        width: '300px',
        position: 'fixed',
        left: 0,
        top: '56px',
        bottom: 0,
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        overflowY: 'auto',
        zIndex: 100,
        padding: '1rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h6 style={{ margin: 0, fontWeight: '600' }}>
            <i className="bi bi-funnel me-2"></i>
            Filtros
          </h6>
        </div>
        
        {/* Buscar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label fw-semibold">
            <i className="bi bi-search me-1"></i>
            Buscar
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Filtro de Estado */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label fw-semibold">
            <i className="bi bi-flag me-1"></i>
            Estado
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value ? parseInt(e.target.value) : '')}
            disabled={isLoading}
          >
            <option value="">Todos los estados</option>
            {projectStatuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Área */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label fw-semibold">
            <i className="bi bi-grid me-1"></i>
            Área
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value ? parseInt(e.target.value) : '')}
            disabled={isLoading}
          >
            <option value="">Todas las áreas</option>
            {projectAreas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Usuario */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label fw-semibold">
            <i className="bi bi-person me-1"></i>
            Usuario Creador
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value ? parseInt(e.target.value) : '')}
            disabled={isLoading}
          >
            <option value="">Todos los usuarios</option>
            {getUniqueUsers().map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Opciones de Ordenamiento */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label fw-semibold">
            <i className="bi bi-sort-down me-1"></i>
            Ordenar por
          </label>
          <select
            className="form-select form-select-sm mb-2"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            disabled={isLoading}
          >
            <option value="priority">Prioridad</option>
            <option value="title">Título</option>
            <option value="createdAt">Fecha de creación</option>
            <option value="updatedAt">Fecha de actualización</option>
          </select>
          <div className="d-flex gap-1">
            <button
              className={`btn btn-sm ${sortDirection === 'desc' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSortDirection('desc')}
              disabled={isLoading}
            >
              <i className="bi bi-sort-down"></i>
            </button>
            <button
              className={`btn btn-sm ${sortDirection === 'asc' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSortDirection('asc')}
              disabled={isLoading}
            >
              <i className="bi bi-sort-up"></i>
            </button>
          </div>
        </div>

        {/* Limpiar Filtros */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            className="btn btn-outline-secondary btn-sm w-100"
            onClick={clearFilters}
            disabled={isLoading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Limpiar filtros
          </button>
        </div>

        {/* Contador de Resultados */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <small className="text-muted">
            {filteredAndSortedProjects.length} de {projects.length} proyectos
          </small>
        </div>

        {/* Botón Nuevo Proyecto */}
        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1rem' }}>
          <button
            className="btn btn-primary w-100"
            onClick={onCreateNew}
            disabled={isLoading}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* Área de Contenido Principal */}
      <div style={{
        flex: 1,
        marginLeft: '300px',
        marginTop: '56px',
        padding: '1rem'
      }}>
        {/* Tarjetas de Proyectos */}
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-end align-items-center">
              {isLoading && (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <small className="text-muted">Actualizando...</small>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-body p-0">
            {isLoading && projects.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted">Cargando proyectos...</p>
              </div>
            ) : filteredAndSortedProjects.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-folder-x fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">No se encontraron proyectos</h5>
                <p className="text-muted">No hay proyectos que coincidan con los filtros aplicados.</p>
              </div>
            ) : (
              <div className="row g-4 p-4">
                {filteredAndSortedProjects.map(project => (
                  <div key={project.id} className="col-lg-4 col-md-6 col-12">
                    <div className="card h-100 project-card">
                      <div className="card-header bg-transparent border-bottom-0 pb-0">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="card-title mb-1 text-truncate" title={project.title}>
                              <i className="bi bi-folder text-primary me-2"></i>
                              {project.title}
                            </h6>
                          </div>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              disabled={isLoading}
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => onView(project)}
                                  disabled={isLoading}
                                >
                                  <i className="bi bi-eye me-2"></i>
                                  Ver detalles
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => onEdit(project)}
                                  disabled={isLoading}
                                >
                                  <i className="bi bi-pencil me-2"></i>
                                  Editar
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => onDelete(project.id)}
                                  disabled={isLoading}
                                >
                                  <i className="bi bi-trash me-2"></i>
                                  Eliminar
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          {getStatusBadge(project.statusId)}
                          <span className="badge bg-light text-dark">
                            {getAreaName(project.areaId)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="card-body pt-0">
                        <p className="card-text text-muted small mb-3">
                          {project.description.length > 120 
                            ? `${project.description.substring(0, 120)}...` 
                            : project.description}
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-1 text-muted"></i>
                            <small className="text-muted">
                              {project.author?.name || 'Sin autor'}
                            </small>
                          </div>
                          {getPriorityBadge(project.priority || 0)}
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(project.createdAt)}
                          </small>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => onView(project)}
                              title="Ver detalles"
                              disabled={isLoading}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => onEdit(project)}
                              title="Editar"
                              disabled={isLoading}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => onDelete(project.id)}
                              title="Eliminar"
                              disabled={isLoading}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList; 