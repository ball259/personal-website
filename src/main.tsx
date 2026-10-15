import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ensureSeeded } from './api/db'

import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import ProjectDetail from './pages/ProjectDetail'

import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import ProfileAdmin from './admin/ProfileAdmin'
import SkillsAdmin from './admin/SkillsAdmin'
import ProjectsAdmin from './admin/ProjectsAdmin'
import PostsAdmin from './admin/PostsAdmin'
import PostEdit from './admin/PostEdit'
import SettingsAdmin from './admin/SettingsAdmin'

ensureSeeded()

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/blog', element: <BlogList /> },
  { path: '/blog/:id', element: <BlogDetail /> },
  { path: '/projects/:id', element: <ProjectDetail /> },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profile', element: <ProfileAdmin /> },
      { path: 'skills', element: <SkillsAdmin /> },
      { path: 'projects', element: <ProjectsAdmin /> },
      { path: 'posts', element: <PostsAdmin /> },
      { path: 'posts/new', element: <PostEdit /> },
      { path: 'posts/:id', element: <PostEdit /> },
      { path: 'settings', element: <SettingsAdmin /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
