import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { useCategories } from '../hooks/useCategories';
import type { Content, ApiContent } from '../types';

const Documentation: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number>(0);
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener categorías del API
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // Cargar contenido desde la API
  // Se filtran solo los contenidos con status "publicado" en el frontend
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiContent = await apiClient.getAllContent();
        const convertedContent = apiContent.map(convertApiContentToLocal);
        setContent(convertedContent);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el contenido';
        setError(errorMessage);
        console.error('Error loading content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Helper function to convert API content to local content format
  const convertApiContentToLocal = (apiContent: ApiContent): Content => {
    return {
      id: apiContent.id,
      title: apiContent.title,
      description: apiContent.description,
      categoryId: apiContent.categoryId,
      subcategoryId: apiContent.subcategoryId,
      tags: apiContent.tags,
      status: apiContent.status,
      priority: apiContent.priority,
      authorId: apiContent.authorId,
      lastUpdatedById: apiContent.lastUpdatedById,
      author: apiContent.author,
      lastUpdatedBy: apiContent.lastUpdatedBy,
      createdAt: apiContent.createdAt,
      updatedAt: apiContent.updatedAt
    };
  };

  // Obtener contenido filtrado por subcategoría
  const getContentBySubcategory = (subcategoryId: number): Content[] => {
    return content.filter(content => 
      content.subcategoryId === subcategoryId && 
      content.status === 'published'
    );
  };

  // Obtener nombre de categoría
  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'No category';
  };

  // Obtener nombre de subcategoría
  const getSubcategoryName = (categoryId: number, subcategoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.subcategories.find(sub => sub.id === subcategoryId)?.name || 'No subcategory';
  };

  // Función para hacer scroll al contenido seleccionado
  const scrollToContent = (contentId: number) => {
    const element = document.getElementById(`content-${contentId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Mostrar loading state para categorías
  if (categoriesLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        minHeight: 'calc(100vh - 56px)',
        marginTop: '56px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading categories...</span>
            </div>
            <p className="text-muted">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error state para categorías
  if (categoriesError) {
    return (
      <div style={{ 
        display: 'flex', 
        minHeight: 'calc(100vh - 56px)',
        marginTop: '56px'
      }}>
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ margin: '1rem' }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error loading categories:</strong> {categoriesError}
          <button
            type="button"
            className="btn-close"
            onClick={() => window.location.reload()}
            aria-label="Close"
          ></button>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Obtener contenido para mostrar
  const getContentToDisplay = () => {
    if (!selectedSubcategory) {
      return {
        title: 'DocuCMS System',
        content: (
          <div style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <i className="bi bi-folder2-open display-1 text-muted mb-3"></i>
              <h3 className="text-muted">Select a category</h3>
              <p className="text-muted">Navigate through the sidebar menu to explore available content.</p>
            </div>
          </div>
        ),
        contentList: []
      };
    }

    const subcategoryContent = getContentBySubcategory(selectedSubcategory);
    const categoryName = getCategoryName(selectedCategory);
    const subcategoryName = getSubcategoryName(selectedCategory, selectedSubcategory);

    if (subcategoryContent.length === 0) {
      return {
        title: `${subcategoryName} - ${categoryName}`,
        content: (
          <div style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <i className="bi bi-inbox display-1 text-muted mb-3"></i>
              <h3 className="text-muted">No content available</h3>
              <p className="text-muted">The subcategory <strong>{subcategoryName}</strong> doesn't have content yet.</p>
              <div className="mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/content')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create new content
                </button>
              </div>
            </div>
          </div>
        ),
        contentList: []
      };
    }

    return {
      title: `${subcategoryName} - ${categoryName}`,
      content: (
        <div style={{ padding: '2rem' }}>
          {subcategoryContent.map(item => (
            <div key={item.id} className="card mb-4" id={`content-${item.id}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{item.title}</h5>
                <span className={`badge bg-${item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary'}`}>
                  {item.status === 'published' ? 'Published' : item.status === 'draft' ? 'Draft' : 'Archived'}
                </span>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="content-description">
                      <div dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">
                        <i className="bi bi-person me-1"></i>{typeof item.author === 'string' ? item.author : item.author?.name || 'Unknown'} | 
                        <i className="bi bi-calendar me-1"></i>{new Date(item.createdAt).toLocaleDateString('en-US')} | 
                        <i className="bi bi-clock me-1"></i>{new Date(item.updatedAt).toLocaleDateString('en-US')}
                      </small>
                    </div>
                    <div className="content-meta mt-3">
                      <div className="mb-3">
                        <strong>Tags:</strong><br />
                        {item.tags.length > 0 ? 
                          item.tags.map(tag => (
                            <span key={tag} className="badge bg-light text-dark me-1 mb-1">{tag}</span>
                          )) : 
                          <span className="text-muted">No tags</span>
                        }
                      </div>
                      <div className="mb-3">
                        <strong>Content ID:</strong><br />
                        <code className="small">{item.id}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
      contentList: subcategoryContent
    };
  };

  const currentContent = getContentToDisplay();

  // Mostrar loading state
  if (isLoading && content.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        minHeight: 'calc(100vh - 56px)',
        marginTop: '56px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading documentation content...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error state
  if (error && content.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        minHeight: 'calc(100vh - 56px)',
        marginTop: '56px'
      }}>
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ margin: '1rem' }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => window.location.reload()}
            aria-label="Close"
          ></button>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: 'calc(100vh - 56px)',
      marginTop: '56px'
    }}>
      {/* Left Sidebar - Categories */}
      <div style={{
        width: '300px',
        position: 'fixed',
        left: 0,
        top: '56px',
        bottom: 0,
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        overflowY: 'auto',
        zIndex: 100
      }}>
        <div style={{
          backgroundColor: '#e9ecef',
          padding: '1rem',
          borderBottom: '1px solid #dee2e6',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <h6 style={{ margin: 0, fontWeight: '600' }}>
            <i className="bi bi-folder me-2"></i>
            Categories
          </h6>
        </div>
        
        <nav style={{ padding: '1rem' }}>
          {categories.map(category => (
            <div key={category.id} style={{ marginBottom: '0.5rem' }}>
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  color: selectedCategory === category.id ? '#1976d2' : '#495057',
                  backgroundColor: selectedCategory === category.id ? '#e3f2fd' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '0.25rem',
                  margin: '0.125rem 0',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem',
                  borderLeft: selectedCategory === category.id ? '3px solid #1976d2' : 'none',
                  marginLeft: selectedCategory === category.id ? '-0.5rem' : '0',
                  paddingLeft: selectedCategory === category.id ? '1.25rem' : '0.75rem'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category.id);
                  setSelectedSubcategory(0);
                }}
              >
                <i className="bi bi-folder me-2"></i>
                {category.name}
                <span className="badge bg-secondary ms-auto">
                  {category.subcategories?.length || 0}
                </span>
              </a>
              
              {category.subcategories && category.subcategories.length > 0 && (
                <div style={{ marginLeft: '1rem', paddingLeft: '0.25rem' }}>
                  {category.subcategories.map(subcategory => (
                    <a
                      key={subcategory.id}
                      href="#"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        color: selectedSubcategory === subcategory.id ? '#1976d2' : '#6c757d',
                        backgroundColor: selectedSubcategory === subcategory.id ? '#e3f2fd' : 'transparent',
                        textDecoration: 'none',
                        borderRadius: '0.25rem',
                        margin: '0.125rem 0',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem',
                        borderLeft: selectedSubcategory === subcategory.id ? '3px solid #1976d2' : 'none',
                        marginLeft: selectedSubcategory === subcategory.id ? '-0.5rem' : '0',
                        paddingLeft: selectedSubcategory === subcategory.id ? '1.25rem' : '0.75rem'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(category.id);
                        setSelectedSubcategory(subcategory.id);
                      }}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      {subcategory.name}
                      <span className="badge bg-light text-dark ms-auto">
                        {getContentBySubcategory(subcategory.id).length}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right Sidebar - Content Navigation */}
      <div style={{
        width: '280px',
        position: 'fixed',
        right: 0,
        top: '56px',
        bottom: 0,
        backgroundColor: '#f8f9fa',
        borderLeft: '1px solid #dee2e6',
        overflowY: 'auto',
        zIndex: 100
      }}>
        <div style={{
          backgroundColor: '#e9ecef',
          padding: '1rem',
          borderBottom: '1px solid #dee2e6',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <h6 style={{ margin: 0, fontWeight: '600' }}>
            <i className="bi bi-list me-2"></i>
            Content
          </h6>
        </div>
        
        <div style={{ padding: '1rem' }}>
          {currentContent.contentList.map((item, index) => (
            <a
              key={item.id}
              href={`#content-${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                color: '#495057',
                textDecoration: 'none',
                borderRadius: '0.25rem',
                margin: '0.125rem 0',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.color = '#495057';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#495057';
              }}
              onClick={(e) => {
                e.preventDefault();
                scrollToContent(item.id);
              }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '50%',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginRight: '0.75rem'
              }}>
                {index + 1}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>{item.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: '300px',
        marginRight: '280px',
        padding: '1rem',
        overflowY: 'auto'
      }}>
        <div>
          {currentContent.content}
        </div>
      </div>
    </div>
  );
};

export default Documentation; 