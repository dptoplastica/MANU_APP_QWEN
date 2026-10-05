import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Subjects, SubjectDetail } from './pages/Subjects';
import { GroupsPage, GroupDetail, StudentsPage, StudentDetail } from './pages/GroupsStudents';
import { Gradebook } from './pages/Gradebook';
import { LearningSituations, LearningSituationDetail } from './pages/LearningSituations';
import { ActivitiesPage } from './pages/Activities';
import { Evaluations, Competencies } from './pages/EvaluationsCompetencies';
import { Reports } from './pages/Reports';
import { Programmes } from './pages/Programmes';
import { Admin } from './pages/Admin';
import { SettingsPage } from './pages/Settings';
import { SetupGuide } from './pages/SetupGuide';
import { SqlDownloads } from './pages/SqlDownloads';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useApp();
  
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/materias" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
      <Route path="/materias/:id" element={<ProtectedRoute><SubjectDetail /></ProtectedRoute>} />
      <Route path="/grupos" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
      <Route path="/grupos/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
      <Route path="/alumnos" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
      <Route path="/alumnos/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
      <Route path="/programaciones" element={<ProtectedRoute><Programmes /></ProtectedRoute>} />
      <Route path="/situaciones-aprendizaje" element={<ProtectedRoute><LearningSituations /></ProtectedRoute>} />
      <Route path="/situaciones-aprendizaje/:id" element={<ProtectedRoute><LearningSituationDetail /></ProtectedRoute>} />
      <Route path="/actividades" element={<ProtectedRoute><ActivitiesPage /></ProtectedRoute>} />
      <Route path="/cuaderno" element={<ProtectedRoute><Gradebook /></ProtectedRoute>} />
      <Route path="/evaluaciones" element={<ProtectedRoute><Evaluations /></ProtectedRoute>} />
      <Route path="/competencias" element={<ProtectedRoute><Competencies /></ProtectedRoute>} />
      <Route path="/informes" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/configuracion" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/setup" element={<ProtectedRoute><SetupGuide /></ProtectedRoute>} />
      <Route path="/sql-downloads" element={<ProtectedRoute><SqlDownloads /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
