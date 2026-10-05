import { supabase } from '../lib/supabase';
import * as seed from '../data/seed';
import { User, Grade, Subject, Group, Student, TeacherSubjectGroup, LearningSituation, Activity } from '../types';

// ============================================================
// SERVICIO DE DATOS
// Intenta usar Supabase; si falla, usa datos locales (seed)
// ============================================================

let useSupabase = true;
let supabaseAvailable: boolean | null = null;

// Verificar si Supabase está disponible
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (supabaseAvailable !== null) return supabaseAvailable;
  
  try {
    const { error } = await supabase.from('schools').select('id').limit(1);
    supabaseAvailable = !error;
    useSupabase = supabaseAvailable;
    return supabaseAvailable;
  } catch {
    supabaseAvailable = false;
    useSupabase = false;
    return false;
  }
};

// ============================================================
// AUTENTICACIÓN
// ============================================================

export const authService = {
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (useSupabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Si Supabase falla, intentar con datos locales
          return localAuth.login(email, password);
        }
        
        // Obtener perfil del usuario
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          return {
            success: true,
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role as 'admin' | 'teacher',
              active: profile.active,
              createdAt: profile.created_at
            }
          };
        }
      } catch {
        // Fallback a local
        return localAuth.login(email, password);
      }
    }
    
    return localAuth.login(email, password);
  },

  async logout(): Promise<void> {
    if (useSupabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignorar errores
      }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!useSupabase) return null;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as 'admin' | 'teacher',
          active: profile.active,
          createdAt: profile.created_at
        };
      }
    } catch {
      // Ignorar
    }
    return null;
  }
};

// ============================================================
// AUTENTICACIÓN LOCAL (FALLBACK)
// ============================================================

const localAuth = {
  login(email: string, _password: string): { success: boolean; user?: User; error?: string } {
    const user = seed.users.find(u => u.email === email && u.active);
    if (user) {
      return { success: true, user };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  }
};

// ============================================================
// DATOS LOCALES (usados cuando Supabase no está disponible)
// ============================================================

export const localDataService = {
  getUsers: () => seed.users,
  getSubjects: () => seed.subjects,
  getGroups: () => seed.groups,
  getStudents: () => seed.students,
  getDepartments: () => seed.departments,
  getAcademicYears: () => seed.academicYears,
  getKeyCompetencies: () => seed.keyCompetencies,
  getSpecificCompetencies: () => seed.allSpecificCompetencies,
  getEvaluationCriteria: () => seed.allEvaluationCriteria,
  getBasicKnowledge: () => seed.basicKnowledgeItems,
  getLearningSituations: () => seed.allLearningSituations,
  getActivities: () => seed.allActivities,
  getProgrammes: () => seed.programmes,
  getTeacherSubjectGroups: () => seed.teacherSubjectGroups,
  getEvaluationConfigs: () => seed.evaluationConfigs,
  
  getAssignmentsForTeacher: (teacherId: string): TeacherSubjectGroup[] => {
    return seed.teacherSubjectGroups.filter(tsg => tsg.teacherId === teacherId);
  },
  
  getSubjectsForTeacher: (teacherId: string): Subject[] => {
    const assignments = seed.teacherSubjectGroups.filter(tsg => tsg.teacherId === teacherId);
    const subjectIds = [...new Set(assignments.map(a => a.subjectId))];
    return seed.subjects.filter(s => subjectIds.includes(s.id));
  },
  
  getGroupsForTeacher: (teacherId: string): Group[] => {
    const assignments = seed.teacherSubjectGroups.filter(tsg => tsg.teacherId === teacherId);
    const groupIds = [...new Set(assignments.map(a => a.groupId))];
    return seed.groups.filter(g => groupIds.includes(g.id));
  },
  
  getStudentsForGroup: (groupId: string): Student[] => {
    return seed.students.filter(s => s.groupId === groupId);
  },
  
  getActivitiesForSubjectGroup: (subjectId: string, groupId: string): Activity[] => {
    return seed.allActivities.filter(a => a.subjectId === subjectId && a.groupId === groupId);
  },
  
  getLearningSituationsForSubject: (subjectId: string): LearningSituation[] => {
    return seed.allLearningSituations.filter(s => s.subjectId === subjectId);
  },
  
  generateInitialGrades: (): Grade[] => {
    const studentIds = seed.students.map(s => s.id);
    return seed.generateGrades(seed.allActivities, studentIds);
  }
};

// ============================================================
// SERVICIO SUPABASE (cuando está disponible)
// ============================================================

export const supabaseDataService = {
  async getSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase.from('subjects').select('*');
    if (error || !data || data.length === 0) return seed.subjects;
    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      course: s.course,
      modality: s.modality,
      departmentId: s.department_id,
      region: s.region,
      academicYearId: s.academic_year_id
    }));
  },

  async getGroups(): Promise<Group[]> {
    const { data, error } = await supabase.from('groups').select('*');
    if (error || !data || data.length === 0) return seed.groups;
    return data.map((g: any) => ({
      id: g.id,
      name: g.name,
      course: g.course,
      academicYearId: g.academic_year_id
    }));
  },

  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase.from('students').select('*');
    if (error || !data || data.length === 0) return seed.students;
    return data.map((s: any) => ({
      id: s.id,
      firstName: s.first_name,
      lastName: s.last_name,
      groupId: s.group_id,
      observations: s.observations || ''
    }));
  },

  async getGrades(): Promise<Grade[]> {
    const { data, error } = await supabase.from('grades').select('*');
    if (error || !data || data.length === 0) return localDataService.generateInitialGrades();
    return data.map((g: any) => ({
      id: g.id,
      studentId: g.student_id,
      activityId: g.activity_id,
      score: g.score,
      observation: g.observation || '',
      notCompleted: g.not_completed,
      notEvaluated: g.not_evaluated,
      recovery: g.recovery
    }));
  },

  async updateGrade(grade: Grade): Promise<void> {
    // Intentar actualizar
    const { error: updateError } = await supabase
      .from('grades')
      .update({
        score: grade.score,
        observation: grade.observation,
        not_completed: grade.notCompleted,
        not_evaluated: grade.notEvaluated,
        recovery: grade.recovery,
        updated_at: new Date().toISOString()
      })
      .eq('id', grade.id);
    
    // Si no existe, intentar insertar
    if (updateError) {
      const { error: insertError } = await supabase
        .from('grades')
        .insert({
          id: grade.id,
          student_id: grade.studentId,
          activity_id: grade.activityId,
          score: grade.score,
          observation: grade.observation,
          not_completed: grade.notCompleted,
          not_evaluated: grade.notEvaluated,
          recovery: grade.recovery
        });
      
      if (insertError) {
        console.warn('Error persisting grade:', insertError.message);
      }
    }
  },

  async getTeacherAssignments(teacherId: string): Promise<TeacherSubjectGroup[]> {
    const { data, error } = await supabase
      .from('teacher_subject_groups')
      .select('*')
      .eq('teacher_id', teacherId);
    
    if (error || !data || data.length === 0) {
      return seed.teacherSubjectGroups.filter(tsg => tsg.teacherId === teacherId);
    }
    return data.map((t: any) => ({
      id: t.id,
      teacherId: t.teacher_id,
      subjectId: t.subject_id,
      groupId: t.group_id
    }));
  },

  async getAllTeacherAssignments(): Promise<TeacherSubjectGroup[]> {
    const { data, error } = await supabase
      .from('teacher_subject_groups')
      .select('*');
    
    if (error || !data || data.length === 0) {
      return seed.teacherSubjectGroups;
    }
    return data.map((t: any) => ({
      id: t.id,
      teacherId: t.teacher_id,
      subjectId: t.subject_id,
      groupId: t.group_id
    }));
  },

  async getKeyCompetencies() {
    const { data, error } = await supabase.from('key_competencies').select('*');
    if (error || !data || data.length === 0) return seed.keyCompetencies;
    return data.map((k: any) => ({
      id: k.id,
      code: k.code,
      name: k.name,
      description: k.description || ''
    }));
  },

  // CRUD para Grupos
  async createGroup(group: Group): Promise<Group | null> {
    console.log('Creating group with data:', group);
    
    const { data, error } = await supabase
      .from('groups')
      .insert({
        name: group.name,
        course: group.course,
        academic_year_id: group.academicYearId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating group:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      return null;
    }
    
    console.log('Group created successfully:', data);
    
    return {
      id: data.id,
      name: data.name,
      course: data.course,
      academicYearId: data.academic_year_id
    };
  },

  async updateGroup(group: Group): Promise<boolean> {
    // Validar que el ID sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(group.id)) {
      console.warn('Cannot update group: Invalid UUID format', group.id);
      console.warn('This group exists only in local seed data and cannot be updated in Supabase');
      return false;
    }
    
    const { error } = await supabase
      .from('groups')
      .update({
        name: group.name,
        course: group.course,
        academic_year_id: group.academicYearId
      })
      .eq('id', group.id);
    
    if (error) {
      console.error('Error updating group:', error.message);
      return false;
    }
    return true;
  },

  async deleteGroup(id: string): Promise<boolean> {
    // Validar que el ID sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn('Cannot delete group: Invalid UUID format', id);
      console.warn('This group exists only in local seed data and cannot be deleted from Supabase');
      return false;
    }
    
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting group:', error.message);
      return false;
    }
    return true;
  },

  // CRUD para Alumnos
  async createStudent(student: Student): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .insert({
        first_name: student.firstName,
        last_name: student.lastName,
        group_id: student.groupId,
        observations: student.observations
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating student:', error.message);
      return null;
    }
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      groupId: data.group_id,
      observations: data.observations || ''
    };
  },

  async updateStudent(student: Student): Promise<boolean> {
    // Validar que el ID sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(student.id)) {
      console.warn('Cannot update student: Invalid UUID format', student.id);
      console.warn('This student exists only in local seed data and cannot be updated in Supabase');
      return false;
    }
    
    const { error } = await supabase
      .from('students')
      .update({
        first_name: student.firstName,
        last_name: student.lastName,
        group_id: student.groupId,
        observations: student.observations
      })
      .eq('id', student.id);
    
    if (error) {
      console.error('Error updating student:', error.message);
      return false;
    }
    return true;
  },

  async deleteStudent(id: string): Promise<boolean> {
    // Validar que el ID sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn('Cannot delete student: Invalid UUID format', id);
      console.warn('This student exists only in local seed data and cannot be deleted from Supabase');
      return false;
    }
    
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting student:', error.message);
      return false;
    }
    return true;
  },

  // CRUD para Asignaciones Profesor-Materia-Grupo
  async createAssignment(assignment: TeacherSubjectGroup): Promise<TeacherSubjectGroup | null> {
    const { data, error } = await supabase
      .from('teacher_subject_groups')
      .insert({
        teacher_id: assignment.teacherId,
        subject_id: assignment.subjectId,
        group_id: assignment.groupId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating assignment:', error.message);
      return null;
    }
    
    return {
      id: data.id,
      teacherId: data.teacher_id,
      subjectId: data.subject_id,
      groupId: data.group_id
    };
  },

  async deleteAssignment(id: string): Promise<boolean> {
    // Validar que el ID sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn('Cannot delete assignment: Invalid UUID format', id);
      console.warn('This assignment exists only in local seed data and cannot be deleted from Supabase');
      return false;
    }
    
    const { error } = await supabase
      .from('teacher_subject_groups')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting assignment:', error.message);
      return false;
    }
    return true;
  },

  async getSpecificCompetencies() {
    const { data, error } = await supabase.from('specific_competencies').select('*');
    if (error || !data || data.length === 0) return seed.allSpecificCompetencies;
    return data.map((c: any) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      description: c.description || '',
      subjectId: c.subject_id,
      keyCompetencyIds: [] // Se cargarán por separado si es necesario
    }));
  },

  async getEvaluationCriteria() {
    const { data, error } = await supabase.from('evaluation_criteria').select('*');
    if (error || !data || data.length === 0) return seed.allEvaluationCriteria;
    return data.map((c: any) => ({
      id: c.id,
      code: c.code,
      description: c.description,
      specificCompetencyId: c.specific_competency_id,
      subjectId: c.subject_id
    }));
  }
};

// ============================================================
// SERVICIO UNIFICADO
// ============================================================

export const dataService = {
  async init(): Promise<boolean> {
    return checkSupabaseConnection();
  },

  isUsingSupabase: () => useSupabase,

  // Auth
  login: authService.login,
  logout: authService.logout,
  getCurrentUser: authService.getCurrentUser,

  // Data - usa Supabase si está disponible, sino datos locales
  async getSubjects(): Promise<Subject[]> {
    if (useSupabase) return supabaseDataService.getSubjects();
    return seed.subjects;
  },

  async getGroups(): Promise<Group[]> {
    if (useSupabase) return supabaseDataService.getGroups();
    return seed.groups;
  },

  async getStudents(): Promise<Student[]> {
    if (useSupabase) return supabaseDataService.getStudents();
    return seed.students;
  },

  async getGrades(): Promise<Grade[]> {
    if (useSupabase) return supabaseDataService.getGrades();
    return localDataService.generateInitialGrades();
  },

  async updateGrade(grade: Grade): Promise<void> {
    if (useSupabase) {
      await supabaseDataService.updateGrade(grade);
    }
    // En modo local, el estado se gestiona en el contexto
  },

  async getTeacherAssignments(teacherId: string): Promise<TeacherSubjectGroup[]> {
    if (useSupabase) return supabaseDataService.getTeacherAssignments(teacherId);
    return seed.teacherSubjectGroups.filter(tsg => tsg.teacherId === teacherId);
  },

  async getAllTeacherAssignments(): Promise<TeacherSubjectGroup[]> {
    if (useSupabase) return supabaseDataService.getAllTeacherAssignments();
    return seed.teacherSubjectGroups;
  },

  // CRUD para Grupos
  async createGroup(group: Group): Promise<Group | null> {
    if (useSupabase) return supabaseDataService.createGroup(group);
    // En modo local, simplemente retornamos el grupo con un ID generado
    return { ...group, id: `local-group-${Date.now()}` };
  },

  async updateGroup(group: Group): Promise<boolean> {
    if (useSupabase) return supabaseDataService.updateGroup(group);
    return true; // En modo local, siempre exitoso
  },

  async deleteGroup(id: string): Promise<boolean> {
    if (useSupabase) return supabaseDataService.deleteGroup(id);
    return true; // En modo local, siempre exitoso
  },

  // CRUD para Alumnos
  async createStudent(student: Student): Promise<Student | null> {
    if (useSupabase) return supabaseDataService.createStudent(student);
    return { ...student, id: `local-student-${Date.now()}` };
  },

  async updateStudent(student: Student): Promise<boolean> {
    if (useSupabase) return supabaseDataService.updateStudent(student);
    return true;
  },

  async deleteStudent(id: string): Promise<boolean> {
    if (useSupabase) return supabaseDataService.deleteStudent(id);
    return true;
  },

  // CRUD para Asignaciones
  async createAssignment(assignment: TeacherSubjectGroup): Promise<TeacherSubjectGroup | null> {
    if (useSupabase) return supabaseDataService.createAssignment(assignment);
    return { ...assignment, id: `local-assignment-${Date.now()}` };
  },

  async deleteAssignment(id: string): Promise<boolean> {
    if (useSupabase) return supabaseDataService.deleteAssignment(id);
    return true;
  },

  // Datos curriculares (Supabase si disponible, sino seed)
  async getKeyCompetencies() {
    if (useSupabase) return supabaseDataService.getKeyCompetencies();
    return seed.keyCompetencies;
  },

  async getSpecificCompetencies() {
    if (useSupabase) return supabaseDataService.getSpecificCompetencies();
    return seed.allSpecificCompetencies;
  },

  async getEvaluationCriteria() {
    if (useSupabase) return supabaseDataService.getEvaluationCriteria();
    return seed.allEvaluationCriteria;
  },

  // Datos estáticos (siempre del seed por ahora)
  getBasicKnowledge: () => seed.basicKnowledgeItems,
  getLearningSituations: () => seed.allLearningSituations,
  getActivities: () => seed.allActivities,
  getProgrammes: () => seed.programmes,
  getDepartments: () => seed.departments,
  getAcademicYears: () => seed.academicYears,
  getUsers: () => seed.users,
  getSchool: () => seed.school,
  getEvaluationConfigs: () => seed.evaluationConfigs
};
