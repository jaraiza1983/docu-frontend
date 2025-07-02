// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    ALL: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  CONTENT: {
    ALL: '/content',
    BY_ID: (id: number) => `/content/${id}`,
    HISTORY: (id: number) => `/content/${id}/history`,
    USER_HISTORY: (userId: number) => `/content/history/user/${userId}`,
    MY_HISTORY: '/content/history/my',
  },
  CATEGORIES: {
    PUBLIC: '/categories/public',
    ADMIN: '/categories',
    BY_ID: (id: number) => `/categories/${id}`,
  },
  SUBCATEGORIES: {
    ADMIN: '/subcategories',
    BY_ID: (id: number) => `/subcategories/${id}`,
  },
  PROJECTS: {
    ALL: '/projects',
    BY_ID: (id: number) => `/projects/${id}`,
    HISTORY: (id: number) => `/projects/${id}/history`,
    USER_HISTORY: (userId: number) => `/projects/history/user/${userId}`,
    MY_HISTORY: '/projects/history/my',
  },
  PROJECT_STATUSES: {
    ADMIN: '/project-statuses',
    BY_ID: (id: number) => `/project-statuses/${id}`,
  },
  PROJECT_AREAS: {
    ADMIN: '/project-areas',
    BY_ID: (id: number) => `/project-areas/${id}`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CREATOR: 'creator',
} as const;

// Content Status - Updated to match new API
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const; 