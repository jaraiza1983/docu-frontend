import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import ContentPage from './components/ContentPage';
import Documentation from './components/Documentation';
import Projects from './components/Projects';
import Users from './components/Users';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ContentPage />
      },
      {
        path: 'content',
        element: <ContentPage />
      },
      {
        path: 'documentation',
        element: <Documentation />
      },
      {
        path: 'projects',
        element: <Projects />
      },
      {
        path: 'users',
        element: <Users />
      }
    ]
  }
]); 