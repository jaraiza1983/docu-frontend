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

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  subcategories: Subcategory[];
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

export interface ContentFormData {
  title: string;
  description: string;
  categoryId?: number;
  subcategoryId?: number;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  priority?: number;
}

// API Types based on the backend specification
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'creator';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Content types - Updated to match new API
export interface ApiContent {
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
  content: ApiContent;
}

// API Project types
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

export interface ApiProject {
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
  project: ApiProject;
}

// User Management Types
export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'creator';
}

export interface UpdateUserFormData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'creator';
}

export interface UserListState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  currentView: 'list' | 'create' | 'edit';
  selectedUser: User | null;
  editingUser: User | null;
} 