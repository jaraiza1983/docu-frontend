import { API_CONFIG } from '../config/api';

// Project types
export interface ProjectStatus {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectArea {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  target: string;
  conclusion?: string;
  priority: number;
  statusId: number;
  areaId: number;
  authorId: number;
  lastUpdatedById?: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  lastUpdatedBy?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  status?: ProjectStatus;
  area?: ProjectArea;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  target: string;
  conclusion?: string;
  statusId: number;
  areaId: number;
  priority?: number;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  target?: string;
  conclusion?: string;
  statusId?: number;
  areaId?: number;
  priority?: number;
}

export interface ProjectHistory {
  id: number;
  action: 'created' | 'updated' | 'status_changed' | 'area_changed' | 'conclusion_added' | 'deleted';
  changes: string;
  notes?: string;
  previousData?: string;
  newData?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  project: Project;
}

// HTTP client for projects
class ProjectApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add default headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API error responses
        const errorMessage = Array.isArray(data.message) 
          ? data.message.join(', ') 
          : data.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Project API request failed:', error);
      throw error;
    }
  }

  // Project methods
  async getProjects(params?: {
    orderBy?: 'priority' | 'createdAt' | 'updatedAt' | 'title';
    orderDirection?: 'ASC' | 'DESC';
    statusId?: number;
    areaId?: number;
  }): Promise<Project[]> {
    const queryParams = new URLSearchParams();
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    if (params?.statusId) queryParams.append('statusId', params.statusId.toString());
    if (params?.areaId) queryParams.append('areaId', params.areaId.toString());
    
    return this.request<Project[]>(`/projects?${queryParams.toString()}`);
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProjectById(id: number): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async updateProject(id: number, data: UpdateProjectRequest): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectHistory(id: number): Promise<ProjectHistory[]> {
    return this.request<ProjectHistory[]>(`/projects/${id}/history`);
  }

  // Project Status methods
  async getProjectStatuses(params?: {
    active?: boolean;
    orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<ProjectStatus[]> {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    return this.request<ProjectStatus[]>(`/project-statuses?${queryParams.toString()}`);
  }

  async getPublicProjectStatuses(params?: {
    orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<ProjectStatus[]> {
    const queryParams = new URLSearchParams();
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    return this.request<ProjectStatus[]>(`/project-statuses/public?${queryParams.toString()}`);
  }

  // Project Area methods
  async getProjectAreas(params?: {
    active?: boolean;
    orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<ProjectArea[]> {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    return this.request<ProjectArea[]>(`/project-areas?${queryParams.toString()}`);
  }

  async getPublicProjectAreas(params?: {
    orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<ProjectArea[]> {
    const queryParams = new URLSearchParams();
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    return this.request<ProjectArea[]>(`/project-areas/public?${queryParams.toString()}`);
  }
}

// Create and export project API client instance
export const projectApiClient = new ProjectApiClient(API_CONFIG.BASE_URL); 