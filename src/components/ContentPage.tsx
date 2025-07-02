import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentManager } from '../hooks/useContentManager';
import ContentList from './ContentList';
import ContentForm from './ContentForm';
import ContentDetail from './ContentDetail';
import type { ContentFormData } from '../types';

const ContentPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    content,
    currentView,
    selectedContent,
    editingContent,
    isLoading,
    error,
    addContent,
    updateContent,
    deleteContent,
    goToList,
    goToCreate,
    goToEdit,
    goToDetail,
    refreshContent
  } = useContentManager();

  const handleCreateContent = async (data: ContentFormData) => {
    try {
      await addContent(data);
    } catch (error) {
      console.error('Error in handleCreateContent:', error);
    }
  };

  const handleUpdateContent = async (data: ContentFormData) => {
    if (editingContent) {
      try {
        await updateContent(editingContent.id, data);
      } catch (error) {
        console.error('Error in handleUpdateContent:', error);
      }
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      await deleteContent(contentId);
    } catch (error) {
      console.error('Error in handleDeleteContent:', error);
    }
  };

  const handleViewContent = (content: any) => {
    goToDetail(content);
  };

  const handleEditContent = (content: any) => {
    goToEdit(content);
  };

  const handleBackToList = () => {
    goToList();
  };

  // Show loading spinner for content operations
  if (isLoading && currentView === 'list') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  // Show error message if there's a content error
  if (error && currentView === 'list') {
    return (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Error:</strong> {error}
        <button
          type="button"
          className="btn-close"
          onClick={() => refreshContent()}
          aria-label="Close"
        ></button>
        <div className="mt-3">
          <button className="btn btn-outline-primary btn-sm" onClick={() => refreshContent()}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  switch (currentView) {
    case 'list':
      return (
        <ContentList
          content={content}
          onEdit={handleEditContent}
          onDelete={handleDeleteContent}
          onView={handleViewContent}
          onCreateNew={goToCreate}
          isLoading={isLoading}
        />
      );
    
    case 'create':
      return (
        <div className="container-fluid px-4">
          <ContentForm
            onSubmit={handleCreateContent}
            isLoading={isLoading}
          />
        </div>
      );
    
    case 'edit':
      return (
        <div className="container-fluid px-4">
          <ContentForm
            onSubmit={handleUpdateContent}
            initialData={editingContent ? {
              title: editingContent.title,
              description: editingContent.description,
              categoryId: editingContent.categoryId,
              subcategoryId: editingContent.subcategoryId,
              tags: editingContent.tags,
              status: editingContent.status === 'archived' ? 'draft' : editingContent.status,
              priority: editingContent.priority
            } : undefined}
            isEditing={true}
            isLoading={isLoading}
          />
        </div>
      );
    
    case 'detail':
      return (
        <div className="container-fluid px-4">
          {selectedContent && (
            <ContentDetail
              content={selectedContent}
              onEdit={handleEditContent}
              onBack={handleBackToList}
            />
          )}
        </div>
      );
    
    default:
      return (
        <div className="container-fluid px-4">
          <div className="alert alert-info">
            Vista no encontrada
          </div>
        </div>
      );
  }
};

export default ContentPage; 