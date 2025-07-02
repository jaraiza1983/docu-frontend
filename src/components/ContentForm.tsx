import React, { useState, useEffect } from 'react';
import TinyMCE from './TinyMCE';
import type { ContentFormData } from '../types';
import { useCategories } from '../hooks/useCategories';

interface ContentFormProps {
  onSubmit: (data: ContentFormData) => void;
  initialData?: ContentFormData;
  isEditing?: boolean;
  isLoading?: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, initialData, isEditing = false, isLoading = false }) => {
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    categoryId: 0,
    subcategoryId: 0,
    tags: [],
    status: 'draft',
    priority: 0
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Debug effect to monitor form data changes
  useEffect(() => {
    console.log('=== FORM DATA CHANGED ===');
    console.log('Current formData:', formData);
    console.log('Categories available:', categories.length);
    console.log('Subcategories for current category:', getSubcategories());
  }, [formData, categories]);

  const handleInputChange = (field: keyof ContentFormData, value: string | string[] | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset subcategoryId when category changes
      if (field === 'categoryId') {
        newData.subcategoryId = 0;
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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

    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    if (formData.categoryId && !formData.subcategoryId) {
      newErrors.subcategoryId = 'La subcategoría es requerida';
    }

    if (!formData.priority || formData.priority < 1 || formData.priority > 100) {
      newErrors.priority = 'La prioridad debe estar entre 1 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('=== CONTENT FORM SUBMIT ===');
    console.log('Form submitted');
    console.log('Form data:', formData);
    console.log('Form errors:', errors);
    
    e.preventDefault();
    
    console.log('Validating form...');
    if (validateForm()) {
      console.log('Form validation passed, calling onSubmit...');
      console.log('onSubmit function:', onSubmit);
      onSubmit(formData);
      console.log('onSubmit called');
    } else {
      console.log('Form validation failed');
    }
  };

  const getSubcategories = () => {
    if (!formData.categoryId) return [];
    const category = categories.find(cat => cat.id === formData.categoryId);
    console.log('=== DEBUG SUBCATEGORIES ===');
    console.log('Selected categoryId:', formData.categoryId, 'Type:', typeof formData.categoryId);
    console.log('All categories:', categories);
    console.log('Found category:', category);
    console.log('Category subcategories:', category?.subcategories);
    console.log('Returning subcategories:', category?.subcategories || []);
    return category?.subcategories || [];
  };

  // Show loading state for categories
  if (categoriesLoading) {
    return (
      <div className="content-form">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando categorías...</span>
            </div>
            <p className="text-muted">Cargando categorías...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state for categories
  if (categoriesError) {
    return (
      <div className="content-form">
        <div className="card">
          <div className="card-body">
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Error al cargar categorías:</strong> {categoriesError}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-form">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {isEditing ? 'Edit Content' : 'Create New Content'}
            </h4>
            {isLoading && (
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                  <span className="visually-hidden">Saving...</span>
                </div>
                <small className="text-muted">Saving...</small>
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
                  <i className="bi bi-type me-1"></i>
                  Title *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter content title"
                  disabled={isLoading}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Categoría y Subcategoría */}
              <div className="col-md-6">
                <label htmlFor="categoryId" className="form-label">
                  <i className="bi bi-folder me-1"></i>
                  Category *
                </label>
                <select
                  className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                  id="categoryId"
                  value={formData.categoryId || ''}
                  onChange={(e) => handleInputChange('categoryId', e.target.value ? Number(e.target.value) : 0)}
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="subcategoryId" className="form-label">
                  <i className="bi bi-folder2 me-1"></i>
                  Subcategory *
                </label>
                <select
                  className={`form-select ${errors.subcategoryId ? 'is-invalid' : ''}`}
                  id="subcategoryId"
                  value={formData.subcategoryId || ''}
                  onChange={(e) => handleInputChange('subcategoryId', e.target.value ? Number(e.target.value) : 0)}
                  disabled={isLoading || !formData.categoryId}
                >
                  <option value="">Select a subcategory</option>
                  {(() => {
                    const subcategories = getSubcategories();
                    console.log('=== RENDERING SUBCATEGORIES ===');
                    console.log('Subcategories to render:', subcategories);
                    console.log('Form categoryId:', formData.categoryId);
                    console.log('Form subcategoryId:', formData.subcategoryId);
                    return subcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ));
                  })()}
                </select>
                {errors.subcategoryId && <div className="invalid-feedback">{errors.subcategoryId}</div>}
              </div>

              {/* Estado */}
              <div className="col-md-6">
                <label htmlFor="status" className="form-label">
                  <i className="bi bi-flag me-1"></i>
                  Status *
                </label>
                <select
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>

              {/* Prioridad */}
              <div className="col-md-6">
                <label htmlFor="priority" className="form-label">
                  <i className="bi bi-arrow-up-circle me-1"></i>
                  Priority *
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
                  id="priority"
                  min="1"
                  max="100"
                  value={formData.priority !== undefined && formData.priority !== null ? formData.priority : ''}
                  onChange={(e) => handleInputChange('priority', e.target.value ? Number(e.target.value) : 0)}
                  placeholder="Enter priority (1-100)"
                  disabled={isLoading}
                />
                {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
                <div className="form-text">Enter a number between 1 (lowest) and 100 (highest)</div>
              </div>

              {/* Etiquetas */}
              <div className="col-md-6">
                <label htmlFor="tags" className="form-label">
                  <i className="bi bi-tags me-1"></i>
                  Tags
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.tags ? 'is-invalid' : ''}`}
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tags separated by commas"
                  disabled={isLoading}
                />
                {errors.tags && <div className="invalid-feedback">{errors.tags}</div>}
                <div className="form-text">Separate tags with commas (e.g., tag1, tag2, tag3)</div>
                
                {/* Display current tags */}
                {formData.tags.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">Current tags:</small>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {formData.tags.map(tag => (
                        <span key={tag} className="badge bg-primary">
                          {tag}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-1"
                            style={{ fontSize: '0.5rem' }}
                            onClick={() => handleRemoveTag(tag)}
                            aria-label={`Remove ${tag}`}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label htmlFor="description" className="form-label">
                  <i className="bi bi-text-paragraph me-1"></i>
                  Description *
                </label>
                <TinyMCE
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  disabled={isLoading}
                />
                {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                    {isEditing ? 'Update Content' : 'Create Content'}
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
                Tips for good content
              </h6>
              <ul className="mb-0 small">
                <li>Use descriptive and clear titles</li>
                <li>Organize content with headers</li>
                <li>Include relevant tags for easy search</li>
                <li>Review content before publishing</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-gear me-1"></i>
                Editor features
              </h6>
              <ul className="mb-0 small">
                <li>Text formatting: bold, italic, underline</li>
                <li>Ordered and unordered lists</li>
                <li>Insert links and images</li>
                <li>Tables and other multimedia elements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentForm; 