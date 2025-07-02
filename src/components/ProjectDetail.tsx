import React from 'react';
import type { Project, ProjectStatus, ProjectArea } from '../services/projectApi';

interface ProjectDetailProps {
  project: Project;
  projectStatuses: ProjectStatus[];
  projectAreas: ProjectArea[];
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  projectStatuses,
  projectAreas,
  onEdit,
  onDelete,
  onBack,
  isLoading = false
}) => {
  const getStatusName = (statusId: number) => {
    return projectStatuses.find(status => status.id === statusId)?.name || 'Sin estado';
  };

  const getAreaName = (areaId: number) => {
    return projectAreas.find(area => area.id === areaId)?.name || 'Sin área';
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="project-detail">
      {/* Header con botones */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onBack}
            disabled={isLoading}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-warning"
            onClick={onEdit}
            disabled={isLoading}
          >
            <i className="bi bi-pencil me-2"></i>
            Editar
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onDelete}
            disabled={isLoading}
          >
            <i className="bi bi-trash me-2"></i>
            Eliminar
          </button>
        </div>
      </div>

      {/* Información del proyecto */}
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h3 className="mb-2">
                <i className="bi bi-folder text-primary me-2"></i>
                {project.title}
              </h3>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {getStatusBadge(project.statusId)}
                <span className="badge bg-light text-dark">
                  {getAreaName(project.areaId)}
                </span>
                {getPriorityBadge(project.priority || 0)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {/* Metadatos */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-person-circle me-2 text-muted"></i>
                <div>
                  <small className="text-muted d-block">Creado por</small>
                  <strong>{project.author?.name || 'Sin autor'}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-calendar3 me-2 text-muted"></i>
                <div>
                  <small className="text-muted d-block">Fecha de creación</small>
                  <strong>{formatDate(project.createdAt)}</strong>
                </div>
              </div>
            </div>
            {project.updatedAt !== project.createdAt && (
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-calendar-check me-2 text-muted"></i>
                  <div>
                    <small className="text-muted d-block">Última actualización</small>
                    <strong>{formatDate(project.updatedAt)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <h5 className="mb-3">
              <i className="bi bi-file-text me-2"></i>
              Descripción
            </h5>
            <div 
              className="rich-text-content"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>

          {/* Información adicional */}
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-info-circle me-2"></i>
                    Información del Proyecto
                  </h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <strong>Estado:</strong> {getStatusName(project.statusId)}
                    </li>
                    <li className="mb-2">
                      <strong>Área:</strong> {getAreaName(project.areaId)}
                    </li>
                    <li className="mb-2">
                      <strong>Prioridad:</strong> {project.priority || 0}
                    </li>
                    <li className="mb-2">
                      <strong>ID:</strong> {project.id}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 