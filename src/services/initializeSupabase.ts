import { supabase } from '../lib/supabase';
import * as seed from '../data/seed';

/**
 * Inicializa los datos en Supabase si no existen
 * Este script crea las asignaciones de profesor-materia-grupo
 * basándose en los datos del seed
 */
export const initializeSupabaseData = async () => {
  try {
    // Verificar si ya hay datos
    const { data: existingAssignments } = await supabase
      .from('teacher_subject_groups')
      .select('id')
      .limit(1);

    if (existingAssignments && existingAssignments.length > 0) {
      console.log('Supabase ya tiene datos inicializados');
      return;
    }

    console.log('Inicializando datos en Supabase...');

    // Nota: Los usuarios deben crearse manualmente en Supabase Auth
    // Las asignaciones requieren IDs de usuario válidos de auth.users
    // Por ahora, solo inicializamos si el admin ya existe

    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@ieslopedevega.es')
      .single();

    const { data: teacherUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'profesor@ieslopedevega.es')
      .single();

    if (!adminUser || !teacherUser) {
      console.log('Usuarios no encontrados en Supabase. Use seed.sql para inicializar.');
      return;
    }

    // Crear asignaciones de profesor
    const assignments = seed.teacherSubjectGroups.map(tsg => ({
      teacher_id: tsg.teacherId === 'user-teacher1' ? teacherUser.id : adminUser.id,
      subject_id: tsg.subjectId,
      group_id: tsg.groupId
    }));

    const { error } = await supabase
      .from('teacher_subject_groups')
      .insert(assignments);

    if (error) {
      console.error('Error creando asignaciones:', error.message);
    } else {
      console.log('Asignaciones creadas correctamente');
    }

  } catch (error) {
    console.error('Error inicializando Supabase:', error);
  }
};

/**
 * Crea calificaciones de ejemplo para todas las actividades y alumnos
 */
export const seedGrades = async () => {
  try {
    // Verificar si ya hay calificaciones
    const { data: existingGrades } = await supabase
      .from('grades')
      .select('id')
      .limit(1);

    if (existingGrades && existingGrades.length > 0) {
      console.log('Ya existen calificaciones en Supabase');
      return;
    }

    console.log('Generando calificaciones de ejemplo...');

    // Obtener alumnos y actividades
    const { data: students } = await supabase.from('students').select('id');
    const { data: activities } = await supabase.from('activities').select('id');

    if (!students || !activities || students.length === 0 || activities.length === 0) {
      console.log('No hay alumnos o actividades para generar calificaciones');
      return;
    }

    // Generar calificaciones aleatorias
    const grades = [];
    for (const student of students) {
      for (const activity of activities) {
        const hasGrade = Math.random() > 0.1; // 90% tienen calificación
        if (hasGrade) {
          grades.push({
            student_id: student.id,
            activity_id: activity.id,
            score: Math.round((Math.random() * 5 + 4) * 10) / 10, // 4.0 - 9.0
            observation: '',
            not_completed: false,
            not_evaluated: false,
            recovery: false
          });
        }
      }
    }

    // Insertar en lotes de 100
    const batchSize = 100;
    for (let i = 0; i < grades.length; i += batchSize) {
      const batch = grades.slice(i, i + batchSize);
      const { error } = await supabase.from('grades').insert(batch);
      if (error) {
        console.error('Error insertando lote de calificaciones:', error.message);
      }
    }

    console.log(`${grades.length} calificaciones generadas`);

  } catch (error) {
    console.error('Error generando calificaciones:', error);
  }
};
