import React from 'react';
import type { Content } from '../types';
import { mockCategories } from '../data/mockData';

interface ContentDetailProps {
  content: Content;
  onEdit: (content: Content) => void;
  onBack: () => void;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ content, onEdit, onBack }) => {
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return 'Sin categoría';
    return mockCategories.find(cat => Number(cat.id) === categoryId)?.name || 'Sin categoría';
  };

  const getSubcategoryName = (categoryId?: number, subcategoryId?: number) => {
    if (!categoryId || !subcategoryId) return 'Sin subcategoría';
    const category = mockCategories.find(cat => Number(cat.id) === categoryId);
    return category?.subcategories.find(sub => Number(sub.id) === subcategoryId)?.name || 'Sin subcategoría';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-warning', text: 'Borrador' },
      published: { class: 'bg-success', text: 'Publicado' },
      archived: { class: 'bg-secondary', text: 'Archivado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`badge ${config.class} text-white fs-6`}>
        {config.text}
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
      <span className={`badge ${badgeClass} text-white fs-6`}>
        <i className="bi bi-star-fill me-1"></i>
        Prioridad: {priority}
      </span>
    );
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="content-detail">
      {/* Header con navegación */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la lista
        </button>
        
        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={() => onEdit(content)}
          >
            <i className="bi bi-pencil me-2"></i>
            Editar Contenido
          </button>
          
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              if (confirm('¿Está seguro de que desea eliminar este contenido? Esta acción no se puede deshacer.')) {
                // Handle delete
                console.log('Delete content:', content.id);
              }
            }}
          >
            <i className="bi bi-trash me-2"></i>
            Eliminar
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Información principal */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2 className="card-title mb-2">{content.title}</h2>
                  <div className="d-flex align-items-center gap-3">
                    {getStatusBadge(content.status)}
                    {getPriorityBadge(content.priority || 0)}
                    <span className="text-muted">
                      <i className="bi bi-person me-1"></i>
                      {typeof content.author === 'string' ? content.author : content.author?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {/* Descripción del contenido */}
              <div className="mb-4">
                <h5 className="mb-3">
                  <i className="bi bi-text-paragraph me-2"></i>
                  Descripción
                </h5>
                <div 
                  className="description-content"
                  dangerouslySetInnerHTML={{ __html: content.description }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral con metadatos */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Información del Contenido
              </h5>
            </div>
            
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-bold">Categoría</label>
                  <p className="mb-0">
                    <span className="badge bg-info text-white">
                      {getCategoryName(content.categoryId)}
                    </span>
                  </p>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-bold">Subcategoría</label>
                  <p className="mb-0">
                    <span className="badge bg-secondary text-white">
                      {getSubcategoryName(content.categoryId, content.subcategoryId)}
                    </span>
                  </p>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-bold">Estado</label>
                  <p className="mb-0">
                    {getStatusBadge(content.status)}
                  </p>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-bold">Prioridad</label>
                  <p className="mb-0">
                    {getPriorityBadge(content.priority || 0)}
                  </p>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-bold">Fecha de Creación</label>
                  <p className="mb-0 text-muted">
                    <i className="bi bi-calendar-plus me-1"></i>
                    {formatDate(content.createdAt)}
                  </p>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-bold">Última Modificación</label>
                  <p className="mb-0 text-muted">
                    <i className="bi bi-calendar-check me-1"></i>
                    {formatDate(content.updatedAt)}
                  </p>
                </div>
                
                <div className="col-12">
                  <label className="form-label fw-bold">Autor</label>
                  <p className="mb-0 text-muted">
                    <i className="bi bi-person me-1"></i>
                    {typeof content.author === 'string' ? content.author : content.author?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Etiquetas */}
          {content.tags.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-tags me-2"></i>
                  Etiquetas
                </h5>
              </div>
              
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2">
                  {content.tags.map(tag => (
                    <span key={tag} className="badge bg-light text-dark">
                      <i className="bi bi-tag me-1"></i>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Acciones rápidas */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h5>
            </div>
            
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => onEdit(content)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar Contenido
                </button>
                
                <button
                  className="btn btn-outline-success"
                  onClick={() => {
                    // Handle duplicate
                    console.log('Duplicate content:', content.id);
                  }}
                >
                  <i className="bi bi-files me-2"></i>
                  Duplicar Contenido
                </button>
                
                <button
                  className="btn btn-outline-info"
                  onClick={() => {
                    // Handle share
                    console.log('Share content:', content.id);
                  }}
                >
                  <i className="bi bi-share me-2"></i>
                  Compartir
                </button>
                
                <button
                  className="btn btn-outline-warning"
                  onClick={() => {
                    // Handle archive
                    console.log('Archive content:', content.id);
                  }}
                >
                  <i className="bi bi-archive me-2"></i>
                  Archivar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de cambios */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Historial de Cambios
              </h5>
            </div>
            
            <div className="card-body">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Contenido creado</h6>
                    <p className="text-muted mb-0">
                      <i className="bi bi-calendar me-1"></i>
                      {formatDate(content.createdAt)} por {typeof content.author === 'string' ? content.author : content.author?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                {content.updatedAt !== content.createdAt && (
                  <div className="timeline-item">
                    <div className="timeline-marker bg-primary"></div>
                    <div className="timeline-content">
                      <h6 className="mb-1">Última modificación</h6>
                      <p className="text-muted mb-0">
                        <i className="bi bi-calendar me-1"></i>
                        {formatDate(content.updatedAt)} por {typeof content.author === 'string' ? content.author : content.author?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail; 