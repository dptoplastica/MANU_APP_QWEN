import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Grade, CriterionAssessment, CompetencyAssessment, Report, Notification } from '../types';
import { dataService } from '../services/dataService';
import * as seed from '../data/seed';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  supabaseConnected: boolean;
  grades: Grade[];
  criterionAssessments: CriterionAssessment[];
  competencyAssessments: CompetencyAssessment[];
  reports: Report[];
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateGrade: (grade: Grade) => Promise<void>;
  addReport: (report: Report) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [criterionAssessments] = useState<CriterionAssessment[]>([]);
  const [competencyAssessments] = useState<CompetencyAssessment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', userId: 'user-teacher1', message: 'Nueva actividad pendiente de corrección: Trazados fundamentales', read: false, createdAt: '2026-10-01' },
    { id: 'n2', userId: 'user-teacher1', message: 'Plazo de entrega de calificaciones 1ª evaluación: 20 de diciembre', read: false, createdAt: '2026-12-01' },
    { id: 'n3', userId: 'user-teacher1', message: 'Programación didáctica actualizada correctamente', read: true, createdAt: '2026-09-15' },
    { id: 'n4', userId: 'user-admin', message: 'Nueva actividad pendiente de corrección: Trazados fundamentales', read: false, createdAt: '2026-10-01' },
    { id: 'n5', userId: 'user-admin', message: 'Plazo de entrega de calificaciones 1ª evaluación: 20 de diciembre', read: false, createdAt: '2026-12-01' },
    { id: 'n6', userId: 'user-admin', message: 'Programación didáctica actualizada correctamente', read: true, createdAt: '2026-09-15' }
  ]);

  // Inicializar: verificar Supabase y cargar datos
  useEffect(() => {
    const init = async () => {
      try {
        // Verificar conexión con Supabase
        const connected = await dataService.init();
        setSupabaseConnected(connected);

        // Verificar si hay sesión activa en Supabase
        if (connected) {
          const user = await dataService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        }

        // Cargar calificaciones
        const initialGrades = await dataService.getGrades();
        setGrades(initialGrades);
      } catch (error) {
        console.warn('Error initializing app, using local data:', error);
        // Fallback a datos locales
        const studentIds = seed.students.map(s => s.id);
        const localGrades = seed.generateGrades(seed.allActivities, studentIds);
        setGrades(localGrades);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await dataService.login(email, password);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await dataService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateGrade = async (updatedGrade: Grade) => {
    // Actualizar estado local inmediatamente
    setGrades(prev => prev.map(g => g.id === updatedGrade.id ? updatedGrade : g));
    
    // Persistir en Supabase si está conectado
    if (supabaseConnected) {
      try {
        await dataService.updateGrade(updatedGrade);
      } catch (error) {
        console.warn('Error persisting grade to Supabase:', error);
      }
    }
  };

  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      isLoading,
      supabaseConnected,
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
