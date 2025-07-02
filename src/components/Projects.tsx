import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import ProjectDetail from './ProjectDetail';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../services/projectApi';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    projects,
    projectStatuses,
    projectAreas,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject
  } = useProjects();

  const handleCreateNew = () => {
    setSelectedProject(null);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setViewMode('detail');
  };

  const handleDelete = async (projectId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await deleteProject(projectId);
        // Si estamos viendo el proyecto que se eliminó, volver a la lista
        if (selectedProject?.id === projectId) {
          setViewMode('list');
          setSelectedProject(null);
        }
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        alert('Error al eliminar el proyecto');
      }
    }
  };

  const handleFormSubmit = async (projectData: any) => {
    try {
      if (isEditing && selectedProject) {
        await updateProject(selectedProject.id, projectData);
      } else {
        await createProject(projectData);
      }
      setViewMode('list');
      setSelectedProject(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
      alert('Error al guardar el proyecto');
    }
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedProject(null);
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedProject(null);
  };

  if (error) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar proyectos</h4>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)' }}>
      {viewMode === 'list' && (
        <ProjectList
          projects={projects}
          projectStatuses={projectStatuses}
          projectAreas={projectAreas}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onCreateNew={handleCreateNew}
          isLoading={isLoading}
        />
      )}

      {viewMode === 'form' && (
        <div style={{ 
          marginLeft: '300px', 
          marginTop: '56px',
          padding: '1rem',
          minHeight: 'calc(100vh - 56px)'
        }}>
          <ProjectForm
            initialData={selectedProject || undefined}
            projectStatuses={projectStatuses}
            projectAreas={projectAreas}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEditing={isEditing}
            isLoading={isLoading}
          />
        </div>
      )}

      {viewMode === 'detail' && selectedProject && (
        <div style={{ 
          marginLeft: '300px', 
          marginTop: '56px',
          padding: '1rem',
          minHeight: 'calc(100vh - 56px)'
        }}>
          <ProjectDetail
            project={selectedProject}
            projectStatuses={projectStatuses}
            projectAreas={projectAreas}
            onEdit={() => handleEdit(selectedProject)}
            onDelete={() => handleDelete(selectedProject.id)}
            onBack={handleBackToList}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Projects; 