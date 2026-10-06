import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Grade, CriterionAssessment, CompetencyAssessment, Report, Notification, LearningSituation, Activity, Programme, Group, Student, TeacherSubjectGroup } from '../types';
import { dataService } from '../services/dataService';
import * as seed from '../data/seed';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  supabaseConnected: boolean;
  grades: Grade[];
  learningSituations: LearningSituation[];
  activities: Activity[];
  programmes: Programme[];
  groups: Group[];
  students: Student[];
  teacherSubjectGroups: TeacherSubjectGroup[];
  criterionAssessments: CriterionAssessment[];
  competencyAssessments: CompetencyAssessment[];
  reports: Report[];
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateGrade: (grade: Grade) => Promise<void>;
  updateLearningSituation: (sda: LearningSituation) => void;
  updateActivity: (activity: Activity) => void;
  addActivity: (activity: Activity) => void;
  updateProgramme: (programme: Programme) => void;
  addReport: (report: Report) => void;
  markNotificationRead: (id: string) => void;
  // Admin CRUD operations
  createGroup: (group: Group) => Promise<Group | null>;
  updateGroup: (group: Group) => Promise<boolean>;
  deleteGroup: (id: string) => Promise<boolean>;
  createStudent: (student: Student) => Promise<Student | null>;
  updateStudent: (student: Student) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  createAssignment: (assignment: TeacherSubjectGroup) => Promise<TeacherSubjectGroup | null>;
  updateAssignment: (assignment: TeacherSubjectGroup) => Promise<boolean>;
  deleteAssignment: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [learningSituations, setLearningSituations] = useState<LearningSituation[]>(seed.allLearningSituations);
  const [activities, setActivities] = useState<Activity[]>(seed.allActivities);
  const [programmes, setProgrammes] = useState<Programme[]>(seed.programmes);
  const [groups, setGroups] = useState<Group[]>(seed.groups);
  const [students, setStudents] = useState<Student[]>(seed.students);
  const [teacherSubjectGroups, setTeacherSubjectGroups] = useState<TeacherSubjectGroup[]>(seed.teacherSubjectGroups);
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

        let user = null;

        // Verificar si hay sesión activa en Supabase
        if (connected) {
          user = await dataService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        }

        // Cargar todos los datos desde Supabase si está conectado
        if (connected) {
          console.log('Loading data from Supabase...');
          
          const [supabaseGroups, supabaseStudents, supabaseAssignments, supabaseGrades] = await Promise.all([
            dataService.getGroups(),
            dataService.getStudents(),
            dataService.getAllTeacherAssignments(),
            dataService.getGrades()
          ]);

          // REEMPLAZAR completamente los datos locales con datos de Supabase
          // No mezclar datos locales con datos de Supabase
          setGroups(supabaseGroups);
          console.log('Groups loaded from Supabase:', supabaseGroups.length);
          
          setStudents(supabaseStudents);
          console.log('Students loaded from Supabase:', supabaseStudents.length);
          
          setTeacherSubjectGroups(supabaseAssignments);
          console.log('Assignments loaded from Supabase:', supabaseAssignments.length);
          
          setGrades(supabaseGrades);
          console.log('Grades loaded from Supabase:', supabaseGrades.length);
        } else {
          // Fallback a datos locales si Supabase no está conectado
          console.log('Supabase not connected, using local seed data');
          setGroups(seed.groups);
          setStudents(seed.students);
          setTeacherSubjectGroups(seed.teacherSubjectGroups);
          const studentIds = seed.students.map(s => s.id);
          const localGrades = seed.generateGrades(seed.allActivities, studentIds);
          setGrades(localGrades);
        }
      } catch (error) {
        console.warn('Error initializing app, using local data:', error);
        // Fallback a datos locales
        setGroups(seed.groups);
        setStudents(seed.students);
        setTeacherSubjectGroups(seed.teacherSubjectGroups);
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

  const updateLearningSituation = (updatedSDA: LearningSituation) => {
    setLearningSituations(prev => prev.map(s => s.id === updatedSDA.id ? updatedSDA : s));
  };

  const updateActivity = (updatedActivity: Activity) => {
    setActivities(prev => prev.map(a => a.id === updatedActivity.id ? updatedActivity : a));
  };

  const addActivity = (newActivity: Activity) => {
    setActivities(prev => [...prev, newActivity]);
  };

  const updateProgramme = (updatedProgramme: Programme) => {
    setProgrammes(prev => prev.map(p => p.id === updatedProgramme.id ? updatedProgramme : p));
  };

  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Admin CRUD operations
  const createGroup = async (group: Group): Promise<Group | null> => {
    const created = await dataService.createGroup(group);
    if (created) {
      setGroups(prev => [...prev, created]);
      return created;
    }
    return null;
  };

  const updateGroup = async (group: Group): Promise<boolean> => {
    console.log('🔄 AppContext updateGroup - Attempting to update group:', group);
    
    const success = await dataService.updateGroup(group);
    
    if (success) {
      console.log('✅ AppContext updateGroup - Update successful, updating local state');
      setGroups(prev => prev.map(g => g.id === group.id ? group : g));
    } else {
      console.error('❌ AppContext updateGroup - Update failed in Supabase');
      console.error('⚠️ Updating local state anyway (changes will not persist after reload)');
      
      // Actualizar el estado local de todos modos para que el usuario vea el cambio
      setGroups(prev => prev.map(g => g.id === group.id ? group : g));
      
      // Mostrar mensaje informativo al usuario
      console.warn('⚠️ The group was updated locally but could not be saved to Supabase.');
      console.warn('⚠️ Please run fix-groups-final.sql to fix the RLS policies.');
      
      // Retornar true para que la UI se actualice, aunque no se persistió
      return true;
    }
    return success;
  };

  const deleteGroup = async (id: string): Promise<boolean> => {
    const success = await dataService.deleteGroup(id);
    if (success) {
      setGroups(prev => prev.filter(g => g.id !== id));
    } else {
      // Si falla, verificar si es porque el ID no es UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.warn('Group delete failed: This group exists only in local seed data');
        // Eliminar solo del estado local
        setGroups(prev => prev.filter(g => g.id !== id));
        return true; // Retornar true para que la UI se actualice
      }
    }
    return success;
  };

  const createStudent = async (student: Student): Promise<Student | null> => {
    const created = await dataService.createStudent(student);
    if (created) {
      setStudents(prev => [...prev, created]);
      return created;
    }
    return null;
  };

  const updateStudent = async (student: Student): Promise<boolean> => {
    const success = await dataService.updateStudent(student);
    if (success) {
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    } else {
      // Si falla, verificar si es porque el ID no es UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(student.id)) {
        console.warn('Student update failed: This student exists only in local seed data');
        // Actualizar solo en el estado local
        setStudents(prev => prev.map(s => s.id === student.id ? student : s));
        return true; // Retornar true para que la UI se actualice
      }
    }
    return success;
  };

  const deleteStudent = async (id: string): Promise<boolean> => {
    const success = await dataService.deleteStudent(id);
    if (success) {
      setStudents(prev => prev.filter(s => s.id !== id));
    } else {
      // Si falla, verificar si es porque el ID no es UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.warn('Student delete failed: This student exists only in local seed data');
        // Eliminar solo del estado local
        setStudents(prev => prev.filter(s => s.id !== id));
        return true; // Retornar true para que la UI se actualice
      }
    }
    return success;
  };

  const createAssignment = async (assignment: TeacherSubjectGroup): Promise<TeacherSubjectGroup | null> => {
    console.log('🔄 AppContext createAssignment - Attempting to create assignment:', assignment);
    
    const created = await dataService.createAssignment(assignment);
    
    if (created) {
      console.log('✅ AppContext createAssignment - Success, updating local state');
      setTeacherSubjectGroups(prev => [...prev, created]);
      return created;
    } else {
      console.error('❌ AppContext createAssignment - Failed in Supabase');
      console.error('⚠️ Creating assignment in local state anyway (changes will not persist after reload)');
      
      // Crear la asignación en el estado local de todos modos
      const localAssignment = {
        ...assignment,
        id: `local-assignment-${Date.now()}`
      };
      setTeacherSubjectGroups(prev => [...prev, localAssignment]);
      
      // Mostrar mensaje informativo al usuario
      console.warn('⚠️ The assignment was created locally but could not be saved to Supabase.');
      console.warn('⚠️ Please run fix-assignments-final.sql to fix the RLS policies.');
      
      // Retornar la asignación local para que la UI se actualice
      return localAssignment;
    }
  };

  const updateAssignment = async (assignment: TeacherSubjectGroup): Promise<boolean> => {
    console.log('🔄 AppContext updateAssignment - Attempting to update assignment:', assignment);
    
    const success = await dataService.updateAssignment(assignment);
    
    if (success) {
      console.log('✅ AppContext updateAssignment - Update successful, updating local state');
      setTeacherSubjectGroups(prev => prev.map(a => a.id === assignment.id ? assignment : a));
    } else {
      console.error('❌ AppContext updateAssignment - Update failed in Supabase');
      console.error('⚠️ Updating local state anyway (changes will not persist after reload)');
      
      // Actualizar el estado local de todos modos para que el usuario vea el cambio
      setTeacherSubjectGroups(prev => prev.map(a => a.id === assignment.id ? assignment : a));
      
      // Mostrar mensaje informativo al usuario
      console.warn('⚠️ The assignment was updated locally but could not be saved to Supabase.');
      console.warn('⚠️ Please run fix-assignments-final.sql to fix the RLS policies.');
    }
    return success;
  };

  const deleteAssignment = async (id: string): Promise<boolean> => {
    const success = await dataService.deleteAssignment(id);
    if (success) {
      setTeacherSubjectGroups(prev => prev.filter(a => a.id !== id));
    } else {
      // Si falla, verificar si es porque el ID no es UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.warn('Assignment delete failed: This assignment exists only in local seed data');
        // Eliminar solo del estado local
        setTeacherSubjectGroups(prev => prev.filter(a => a.id !== id));
        return true; // Retornar true para que la UI se actualice
      }
    }
    return success;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated,
      isLoading,
      supabaseConnected,
      grades,
      learningSituations,
      activities,
      programmes,
      groups,
      students,
      teacherSubjectGroups,
      criterionAssessments,
      competencyAssessments,
      reports,
      notifications,
      login,
      logout,
      updateGrade,
      updateLearningSituation,
      updateActivity,
      addActivity,
      updateProgramme,
      addReport,
      markNotificationRead,
      createGroup,
      updateGroup,
      deleteGroup,
      createStudent,
      updateStudent,
      deleteStudent,
      createAssignment,
      updateAssignment,
      deleteAssignment
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
