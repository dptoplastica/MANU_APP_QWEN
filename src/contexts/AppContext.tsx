import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Grade, CriterionAssessment, CompetencyAssessment, Report, Notification } from '../types';
import * as seed from '../data/seed';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  grades: Grade[];
  criterionAssessments: CriterionAssessment[];
  competencyAssessments: CompetencyAssessment[];
  reports: Report[];
  notifications: Notification[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateGrade: (grade: Grade) => void;
  addReport: (report: Report) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [criterionAssessments] = useState<CriterionAssessment[]>([]);
  const [competencyAssessments] = useState<CompetencyAssessment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications] = useState<Notification[]>([
    { id: 'n1', userId: 'user-teacher1', message: 'Nueva actividad pendiente de corrección: Trazados fundamentales', read: false, createdAt: '2026-10-01' },
    { id: 'n2', userId: 'user-teacher1', message: 'Plazo de entrega de calificaciones 1ª evaluación: 20 de diciembre', read: false, createdAt: '2026-12-01' },
    { id: 'n3', userId: 'user-teacher1', message: 'Programación didáctica actualizada correctamente', read: true, createdAt: '2026-09-15' }
  ]);

  // Load initial grades
  useEffect(() => {
    const studentIds = seed.students.map(s => s.id);
    const initialGrades = seed.generateGrades(seed.allActivities, studentIds);
    setGrades(initialGrades);
  }, []);

  const login = (email: string, _password: string): boolean => {
    const user = seed.users.find(u => u.email === email && u.active);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateGrade = (updatedGrade: Grade) => {
    setGrades(prev => prev.map(g => g.id === updatedGrade.id ? updatedGrade : g));
  };

  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
  };

  const markNotificationRead = (id: string) => {
    // Would update notifications state
    console.log('Mark notification read:', id);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      grades,
      criterionAssessments,
      competencyAssessments,
      reports,
      notifications,
      login,
      logout,
      updateGrade,
      addReport,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
