import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomePage } from './pages/HomePage';
import { AppsPage } from './pages/AppsPage';
import { SoftwareDetailPage } from './pages/SoftwareDetailPage';
import { TutorialsPage } from './pages/Tutorials/TutorialsPage';
import { TutorialDetailPage } from './pages/Tutorials/TutorialDetailPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AddSoftwarePage } from './pages/admin/AddSoftwarePage';
import { EditSoftwarePage } from './pages/admin/EditSoftwarePage';
import { AddTutorialPage } from './pages/admin/AddTutorialPage';
import { EditTutorialPage } from './pages/admin/EditTutorialPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="apps" element={<AppsPage />} />
          <Route path="software/:id" element={<SoftwareDetailPage />} />
          <Route path="tutorials" element={<TutorialsPage />} />
          <Route path="tutorials/:id" element={<TutorialDetailPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/software/new" element={
          <ProtectedRoute>
            <AdminLayout>
              <AddSoftwarePage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/software/:id/edit" element={
          <ProtectedRoute>
            <AdminLayout>
              <EditSoftwarePage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/tutorials/new" element={
          <ProtectedRoute>
            <AdminLayout>
              <AddTutorialPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/tutorials/:id/edit" element={
          <ProtectedRoute>
            <AdminLayout>
              <EditTutorialPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Fallback routes */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;