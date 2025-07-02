import { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import ContentList from './components/ContentList';
import ContentForm from './components/ContentForm';
import ContentDetail from './components/ContentDetail';
import Documentation from './components/Documentation';
import Login from './components/Login';
import Projects from './components/Projects';
import Users from './components/Users';
import { useContentManager } from './hooks/useContentManager';
import { useAuth } from './hooks/useAuth';
import type { ContentFormData } from './types';

type ViewMode = 'content-list' | 'content-create' | 'content-edit' | 'content-detail' | 'documentation' | 'projects' | 'users';

function App() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
    login,
    logout,
    clearError: clearAuthError
  } = useAuth();

  const {
    content,
    currentView: contentView,
    selectedContent,
    editingContent,
    isLoading: contentLoading,
    error: contentError,
    addContent,
    updateContent,
    deleteContent,
    goToList,
    goToCreate,
    goToEdit,
    goToDetail,
    goToDocumentation,
    refreshContent
  } = useContentManager();

  const [viewMode, setViewMode] = useState<ViewMode>('content-list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateContent = async (data: ContentFormData) => {
    console.log('=== APP HANDLE CREATE CONTENT ===');
    console.log('Data received:', data);
    console.log('Data type:', typeof data);
    
    try {
      console.log('Calling addContent...');
      await addContent(data);
      console.log('addContent completed successfully');
    } catch (error) {
      console.error('=== APP CREATE CONTENT ERROR ===');
      console.error('Error in handleCreateContent:', error);
      // Error is already handled in the hook, just log it
    }
  };

  const handleUpdateContent = async (data: ContentFormData) => {
    if (editingContent) {
      try {
        await updateContent(editingContent.id, data);
      } catch (error) {
        // Error is already handled in the hook, just log it
        console.error('Error in handleUpdateContent:', error);
      }
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      await deleteContent(contentId);
    } catch (error) {
      // Error is already handled in the hook, just log it
      console.error('Error in handleDeleteContent:', error);
    }
  };

  const handleViewContent = (content: any) => {
    goToDetail(content);
  };

  const handleEditContent = (content: any) => {
    goToEdit(content);
  };

  const handleLogin = async (credentials: any) => {
    return await login(credentials);
  };

  const handleLogout = () => {
    logout();
    goToList(); // Reset to list view after logout
  };

  const handleNavigation = (view: string) => {
    switch (view) {
      case 'list':
        setViewMode('content-list');
        goToList();
        break;
      case 'create':
        setViewMode('content-create');
        goToCreate();
        break;
      case 'documentation':
        setViewMode('documentation');
        goToDocumentation();
        break;
      case 'projects':
        setViewMode('projects');
        break;
      case 'users':
        setViewMode('users');
        break;
      default:
        break;
    }
  };

  const renderCurrentView = () => {
    // Handle projects view separately
    if (viewMode === 'projects') {
      return <Projects />;
    }

    // Handle users view separately
    if (viewMode === 'users') {
      return <Users />;
    }

    // Show loading spinner for content operations
    if (contentLoading && contentView === 'list') {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading content...</p>
          </div>
        </div>
      );
    }

    // Show error message if there's a content error
    if (contentError && contentView === 'list') {
      return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {contentError}
          <button
            type="button"
            className="btn-close"
            onClick={() => refreshContent()}
            aria-label="Close"
          ></button>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => refreshContent()}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (contentView) {
      case 'list':
        return (
          <ContentList
            content={content}
            onEdit={handleEditContent}
            onDelete={handleDeleteContent}
            onView={handleViewContent}
            onCreateNew={() => handleNavigation('create')}
            isLoading={contentLoading}
          />
        );
      
      case 'create':
        return (
          <div className="container-fluid px-4">
            <ContentForm
              onSubmit={handleCreateContent}
              isLoading={contentLoading}
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
                status: editingContent.status === 'archived' ? 'draft' : editingContent.status
              } : undefined}
              isEditing={true}
              isLoading={contentLoading}
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
                onBack={goToList}
              />
            )}
          </div>
        );
      
      case 'documentation':
        return (
          <div className="container-fluid px-4">
            <Documentation />
          </div>
        );
      
      default:
        return (
          <div className="container-fluid px-4">
            <div className="alert alert-info">
              View not found
            </div>
          </div>
        );
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
        isLoading={authLoading}
        error={authError}
        onClearError={clearAuthError}
      />
    );
  }

  // Show main CMS when authenticated
  return (
    <div className="App">
      <Navigation
        user={user!}
        onLogout={handleLogout}
      />
      
      <main className="container-fluid px-4">
        {renderCurrentView()}
      </main>

      <footer className="bg-light mt-5 py-4">
        <div className="container-fluid text-center text-muted">
          <p className="mb-0">© 2024 DocuCMS - Content Management System</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
