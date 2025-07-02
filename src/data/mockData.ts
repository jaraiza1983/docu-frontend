import type { Category, Subcategory, Content } from '../types';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Frontend Development',
    description: 'Frontend technologies and frameworks',
    isActive: true,
    priority: 90,
    subcategories: [
      { id: 1, name: 'Frontend', categoryId: 1, priority: 85, isActive: true },
      { id: 2, name: 'Backend', categoryId: 1, priority: 80, isActive: true },
      { id: 3, name: 'Full Stack', categoryId: 1, priority: 75, isActive: true }
    ]
  },
  {
    id: 2,
    name: 'Database',
    description: 'Database technologies and management',
    isActive: true,
    priority: 85,
    subcategories: [
      { id: 4, name: 'SQL', categoryId: 2, priority: 90, isActive: true },
      { id: 5, name: 'NoSQL', categoryId: 2, priority: 70, isActive: true },
      { id: 6, name: 'ORM', categoryId: 2, priority: 65, isActive: true }
    ]
  },
  {
    id: 3,
    name: 'DevOps',
    description: 'DevOps and deployment practices',
    isActive: true,
    priority: 80,
    subcategories: [
      { id: 7, name: 'Docker', categoryId: 3, priority: 85, isActive: true },
      { id: 8, name: 'Kubernetes', categoryId: 3, priority: 75, isActive: true },
      { id: 9, name: 'CI/CD', categoryId: 3, priority: 70, isActive: true }
    ]
  },
  {
    id: 4,
    name: 'Security',
    description: 'Security best practices and protocols',
    isActive: true,
    priority: 95,
    subcategories: [
      { id: 10, name: 'Autenticación', categoryId: 4, priority: 90, isActive: true },
      { id: 11, name: 'Autorización', categoryId: 4, priority: 85, isActive: true },
      { id: 12, name: 'Criptografía', categoryId: 4, priority: 80, isActive: true }
    ]
  }
];

export const mockContent: Content[] = [
  {
    id: 1,
    title: 'React Best Practices',
    description: '<p>This guide covers the best practices for developing React applications, including component structure, state management, and performance optimization.</p>',
    categoryId: 1,
    subcategoryId: 1,
    tags: ['react', 'frontend', 'javascript'],
    status: 'published',
    priority: 75,
    authorId: 1,
    author: {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'creator'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 2,
    title: 'Node.js API Development',
    description: '<p>Learn how to build robust REST APIs using Node.js, Express, and MongoDB. This guide includes authentication, validation, and error handling.</p>',
    categoryId: 1,
    subcategoryId: 2,
    tags: ['nodejs', 'api', 'backend', 'express'],
    status: 'published',
    priority: 60,
    authorId: 2,
    author: {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      role: 'creator'
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: 3,
    title: 'Database Design Principles',
    description: '<p>Essential principles for designing efficient and scalable databases. Covers normalization, indexing, and query optimization.</p>',
    categoryId: 2,
    subcategoryId: 4,
    tags: ['database', 'sql', 'design'],
    status: 'draft',
    priority: 90,
    authorId: 3,
    author: {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@example.com',
      role: 'creator'
    },
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-15T13:20:00Z'
  },
  {
    id: 4,
    title: 'Docker Containerization',
    description: '<p>Complete guide to containerizing applications with Docker. Learn about Dockerfiles, Docker Compose, and best practices for production deployment.</p>',
    categoryId: 3,
    subcategoryId: 7,
    tags: ['docker', 'containers', 'devops'],
    status: 'published',
    priority: 75,
    authorId: 4,
    author: {
      id: 4,
      name: 'Ana Rodríguez',
      email: 'ana@example.com',
      role: 'creator'
    },
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-16T15:10:00Z'
  },
  {
    id: 5,
    title: 'Authentication Security',
    description: '<p>Comprehensive guide to implementing secure authentication systems. Covers JWT, OAuth, password hashing, and security best practices.</p>',
    categoryId: 4,
    subcategoryId: 10,
    tags: ['security', 'authentication', 'jwt', 'oauth'],
    status: 'published',
    priority: 100,
    authorId: 5,
    author: {
      id: 5,
      name: 'Luis Martínez',
      email: 'luis@example.com',
      role: 'creator'
    },
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-14T17:30:00Z'
  },
  {
    id: 6,
    title: 'Kubernetes Orchestration',
    description: '<p>Advanced Kubernetes concepts for orchestrating containerized applications. Includes deployment strategies, scaling, and monitoring.</p>',
    categoryId: 3,
    subcategoryId: 8,
    tags: ['kubernetes', 'orchestration', 'containers', 'devops'],
    status: 'draft',
    priority: 85,
    authorId: 6,
    author: {
      id: 6,
      name: 'Sofia Chen',
      email: 'sofia@example.com',
      role: 'creator'
    },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  }
]; 