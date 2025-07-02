import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from '../config/api';

// API Response types based on the actual API spec
export interface ApiResponse<T = any> {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  data?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'creator';
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'creator';
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  categoryId?: number;
  subcategoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  subcategory?: {
    id: number;
    name: string;
  };
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  priority: number;
  authorId: number;
  lastUpdatedById?: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentRequest {
  title: string;
  description: string;
  categoryId?: number;
  subcategoryId?: number;
  tags: string[];
  status?: 'draft' | 'published' | 'archived';
  priority?: number;
}

export interface UpdateContentRequest {
  title?: string;
  description?: string;
  categoryId?: number;
  subcategoryId?: number;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  priority?: number;
}

export interface ContentHistory {
  id: number;
  action: 'created' | 'updated' | 'status_changed' | 'deleted';
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
  content: Content;
}

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

// HTTP client with interceptors
class ApiClient {
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
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'creator';
  }): Promise<LoginResponse> {
    return this.request<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  // Note: getCurrentUser endpoint removed from new API spec
  // User information is available from login response

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>(API_ENDPOINTS.USERS.ALL);
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(API_ENDPOINTS.USERS.BY_ID(id));
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'creator';
  }): Promise<User> {
    return this.request<User>(API_ENDPOINTS.USERS.ALL, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: Partial<{
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'creator';
  }>): Promise<User> {
    return this.request<User>(API_ENDPOINTS.USERS.BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(API_ENDPOINTS.USERS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Content endpoints
  async getAllContent(params?: {
    orderBy?: 'priority' | 'createdAt' | 'updatedAt' | 'title';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<Content[]> {
    const queryParams = new URLSearchParams();
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    const url = queryParams.toString() ? `${API_ENDPOINTS.CONTENT.ALL}?${queryParams}` : API_ENDPOINTS.CONTENT.ALL;
    return this.request<Content[]>(url);
  }

  async getContentById(id: number): Promise<Content> {
    return this.request<Content>(API_ENDPOINTS.CONTENT.BY_ID(id));
  }

  async createContent(content: CreateContentRequest): Promise<Content> {
    return this.request<Content>(API_ENDPOINTS.CONTENT.ALL, {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async updateContent(id: number, content: UpdateContentRequest): Promise<Content> {
    return this.request<Content>(API_ENDPOINTS.CONTENT.BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(content),
    });
  }

  async deleteContent(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(API_ENDPOINTS.CONTENT.BY_ID(id), {
      method: 'DELETE',
    });
  }

  async getContentHistory(id: number): Promise<ContentHistory[]> {
    return this.request<ContentHistory[]>(API_ENDPOINTS.CONTENT.HISTORY(id));
  }

  async getUserContentHistory(userId: number): Promise<ContentHistory[]> {
    return this.request<ContentHistory[]>(API_ENDPOINTS.CONTENT.USER_HISTORY(userId));
  }

  async getMyContentHistory(): Promise<ContentHistory[]> {
    return this.request<ContentHistory[]>(API_ENDPOINTS.CONTENT.MY_HISTORY);
  }

  // Category endpoints
  async getAllCategories(params?: {
    active?: boolean;
    orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<Category[]> {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    const url = queryParams.toString() ? `${API_ENDPOINTS.CATEGORIES.ADMIN}?${queryParams}` : API_ENDPOINTS.CATEGORIES.ADMIN;
    return this.request<Category[]>(url);
  }

  async getPublicCategories(params?: {
    orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<Category[]> {
    const queryParams = new URLSearchParams();
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    const url = queryParams.toString() ? `${API_ENDPOINTS.CATEGORIES.PUBLIC}?${queryParams}` : API_ENDPOINTS.CATEGORIES.PUBLIC;
    return this.request<Category[]>(url);
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.request<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  }

  async createCategory(categoryData: {
    name: string;
    description?: string;
    isActive?: boolean;
    priority?: number;
  }): Promise<Category> {
    return this.request<Category>(API_ENDPOINTS.CATEGORIES.ADMIN, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: number, categoryData: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    priority: number;
  }>): Promise<Category> {
    return this.request<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(API_ENDPOINTS.CATEGORIES.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Subcategory methods - Updated for new API
  async getAllSubcategories(params?: {
    active?: boolean;
    orderBy?: 'priority' | 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<Subcategory[]> {
    const queryParams = new URLSearchParams();
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
    
    const url = queryParams.toString() ? `${API_ENDPOINTS.SUBCATEGORIES.ADMIN}?${queryParams}` : API_ENDPOINTS.SUBCATEGORIES.ADMIN;
    return this.request<Subcategory[]>(url);
  }

  async getSubcategoryById(id: number): Promise<Subcategory> {
    return this.request<Subcategory>(API_ENDPOINTS.SUBCATEGORIES.BY_ID(id));
  }

  async createSubcategory(subcategoryData: {
    name: string;
    description?: string;
    categoryId: number;
    isActive?: boolean;
    priority?: number;
  }): Promise<Subcategory> {
    return this.request<Subcategory>(API_ENDPOINTS.SUBCATEGORIES.ADMIN, {
      method: 'POST',
      body: JSON.stringify(subcategoryData),
    });
  }

  async updateSubcategory(id: number, subcategoryData: Partial<{
    name: string;
    description: string;
    categoryId: number;
    isActive: boolean;
    priority: number;
  }>): Promise<Subcategory> {
    return this.request<Subcategory>(API_ENDPOINTS.SUBCATEGORIES.BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(subcategoryData),
    });
  }

  async deleteSubcategory(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(API_ENDPOINTS.SUBCATEGORIES.BY_ID(id), {
      method: 'DELETE',
    });
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

// Create and export API client instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}; 