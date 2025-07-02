import { useState, useEffect } from 'react';
import { projectApiClient } from '../services/projectApi';
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectStatus, ProjectArea } from '../services/projectApi';

interface UseProjectsReturn {
  projects: Project[];
  projectStatuses: ProjectStatus[];
  projectAreas: ProjectArea[];
  isLoading: boolean;
  error: string | null;
  createProject: (data: CreateProjectRequest) => Promise<Project>;
  updateProject: (id: number, data: UpdateProjectRequest) => Promise<Project>;
  deleteProject: (id: number) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [projectAreas, setProjectAreas] = useState<ProjectArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [projectsData, statusesData, areasData] = await Promise.all([
        projectApiClient.getProjects({ orderBy: 'priority', orderDirection: 'DESC' }),
        projectApiClient.getPublicProjectStatuses({ orderBy: 'priority', orderDirection: 'DESC' }),
        projectApiClient.getPublicProjectAreas({ orderBy: 'priority', orderDirection: 'DESC' })
      ]);
      
      setProjects(projectsData);
      setProjectStatuses(statusesData);
      setProjectAreas(areasData);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (data: CreateProjectRequest): Promise<Project> => {
    try {
      setError(null);
      const newProject = await projectApiClient.createProject(data);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear proyecto';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProject = async (id: number, data: UpdateProjectRequest): Promise<Project> => {
    try {
      setError(null);
      const updatedProject = await projectApiClient.updateProject(id, data);
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ));
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar proyecto';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProject = async (id: number): Promise<void> => {
    try {
      setError(null);
      await projectApiClient.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar proyecto';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refreshProjects = async () => {
    await loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    projectStatuses,
    projectAreas,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects
  };
}; 