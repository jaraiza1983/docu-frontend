import React, { useState, useEffect } from 'react';
import TinyMCE from './TinyMCE';
import type { CreateProjectRequest, UpdateProjectRequest, ProjectStatus, ProjectArea } from '../services/projectApi';

interface ProjectFormProps {
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => void;
  onCancel?: () => void;
  initialData?: UpdateProjectRequest & { id?: number };
  projectStatuses: ProjectStatus[];
  projectAreas: ProjectArea[];
  isEditing?: boolean;
  isLoading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  projectStatuses, 
  projectAreas, 
  isEditing = false, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: '',
    description: '',
    target: '',
    conclusion: '',
    statusId: 0,
    areaId: 0,
    priority: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        target: initialData.target || '',
        conclusion: initialData.conclusion || '',
        statusId: initialData.statusId || 0,
        areaId: initialData.areaId || 0,
        priority: initialData.priority || 0
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof CreateProjectRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.target.trim()) {
      newErrors.target = 'El objetivo es requerido';
    }

    if (!formData.statusId) {
      newErrors.statusId = 'El estado es requerido';
    }

    if (!formData.areaId) {
      newErrors.areaId = 'El área es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="project-form">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
            </h4>
            {isLoading && (
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                  <span className="visually-hidden">Guardando...</span>
                </div>
                <small className="text-muted">Guardando...</small>
              </div>
            )}
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Título */}
              <div className="col-12">
                <label htmlFor="title" className="form-label">
                  <i className="bi bi-type-bold me-1"></i>
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ingrese el título del proyecto"
                  disabled={isLoading}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Estado y Área */}
              <div className="col-md-6">
                <label htmlFor="status" className="form-label">
                  <i className="bi bi-flag me-1"></i>
                  Estado *
                </label>
                <select
                  className={`form-select ${errors.statusId ? 'is-invalid' : ''}`}
                  id="status"
                  value={formData.statusId || ''}
                  onChange={(e) => handleInputChange('statusId', parseInt(e.target.value) || 0)}
                  disabled={isLoading}
                >
                  <option value="">Seleccione un estado</option>
                  {projectStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
                {errors.statusId && <div className="invalid-feedback">{errors.statusId}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="area" className="form-label">
                  <i className="bi bi-grid me-1"></i>
                  Área *
                </label>
                <select
                  className={`form-select ${errors.areaId ? 'is-invalid' : ''}`}
                  id="area"
                  value={formData.areaId || ''}
                  onChange={(e) => handleInputChange('areaId', parseInt(e.target.value) || 0)}
                  disabled={isLoading}
                >
                  <option value="">Seleccione un área</option>
                  {projectAreas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {errors.areaId && <div className="invalid-feedback">{errors.areaId}</div>}
              </div>

              {/* Prioridad */}
              <div className="col-md-6">
                <label htmlFor="priority" className="form-label">
                  <i className="bi bi-star me-1"></i>
                  Prioridad
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="priority"
                  min="0"
                  max="100"
                  value={formData.priority || 0}
                  onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                  placeholder="0-100"
                  disabled={isLoading}
                />
                <div className="form-text">Valor entre 0 (más baja) y 100 (más alta)</div>
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label htmlFor="description" className="form-label">
                  <i className="bi bi-text-paragraph me-1"></i>
                  Descripción del Proyecto *
                </label>
                <TinyMCE
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  disabled={isLoading}
                />
                {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
              </div>

              {/* Objetivo */}
              <div className="col-12">
                <label htmlFor="target" className="form-label">
                  <i className="bi bi-bullseye me-1"></i>
                  Objetivo del Proyecto *
                </label>
                <TinyMCE
                  value={formData.target}
                  onChange={(value) => handleInputChange('target', value)}
                  disabled={isLoading}
                />
                {errors.target && <div className="invalid-feedback d-block">{errors.target}</div>}
              </div>

              {/* Conclusión */}
              <div className="col-12">
                <label htmlFor="conclusion" className="form-label">
                  <i className="bi bi-check-circle me-1"></i>
                  Conclusión (opcional)
                </label>
                <TinyMCE
                  value={formData.conclusion || ''}
                  onChange={(value) => handleInputChange('conclusion', value)}
                  disabled={isLoading}
                />
                <div className="form-text">Conclusión o resultados del proyecto</div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel || (() => window.history.back())}
                disabled={isLoading}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                    {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Consejos de uso */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-lightbulb me-1"></i>
                Consejos para un buen proyecto
              </h6>
              <ul className="mb-0 small">
                <li>Use títulos descriptivos y claros</li>
                <li>Defina objetivos específicos y medibles</li>
                <li>Describa el alcance y las responsabilidades</li>
                <li>Establezca prioridades realistas</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-gear me-1"></i>
                Funciones del editor
              </h6>
              <ul className="mb-0 small">
                <li>Formato de texto: negrita, cursiva, subrayado</li>
                <li>Listas ordenadas y no ordenadas</li>
                <li>Inserción de enlaces e imágenes</li>
                <li>Tablas y otros elementos multimedia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm; 