-- ============================================================
-- SOLUCIÓN COMPLETA: Políticas RLS sin errores 403 ni recursión
-- Ejecutar este script en Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PASO 1: Deshabilitar RLS temporalmente para limpiar políticas
-- ============================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subject_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE learning_situations DISABLE ROW LEVEL SECURITY;
ALTER TABLE programmes DISABLE ROW LEVEL SECURITY;
ALTER TABLE key_competencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE specific_competencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_criteria DISABLE ROW LEVEL SECURITY;
ALTER TABLE basic_knowledge DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- PASO 2: Eliminar todas las políticas existentes
-- ============================================================

-- Users
DROP POLICY IF EXISTS "Admins have full access to all tables" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
DROP POLICY IF EXISTS "Admins can insert profiles" ON users;
DROP POLICY IF EXISTS "Admins can update profiles" ON users;

-- Groups
DROP POLICY IF EXISTS "Admins can manage groups" ON groups;
DROP POLICY IF EXISTS "Teachers can view own groups" ON groups;
DROP POLICY IF EXISTS "Teachers can insert groups" ON groups;
DROP POLICY IF EXISTS "Teachers can update groups" ON groups;

-- Students
DROP POLICY IF EXISTS "Admins can manage students" ON students;
DROP POLICY IF EXISTS "Teachers can view own students" ON students;
DROP POLICY IF EXISTS "Teachers can insert students" ON students;
DROP POLICY IF EXISTS "Teachers can update students" ON students;

-- Teacher Subject Groups
DROP POLICY IF EXISTS "Admins can manage assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Teachers can view own assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Teachers can insert assignments" ON teacher_subject_groups;

-- Subjects
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;
DROP POLICY IF EXISTS "Teachers can view own subjects" ON subjects;

-- Activities
DROP POLICY IF EXISTS "Admins can manage activities" ON activities;
DROP POLICY IF EXISTS "Teachers can view own activities" ON activities;

-- Grades
DROP POLICY IF EXISTS "Admins can manage grades" ON grades;
DROP POLICY IF EXISTS "Teachers can manage own grades" ON grades;

-- Learning Situations
DROP POLICY IF EXISTS "Admins can manage learning_situations" ON learning_situations;
DROP POLICY IF EXISTS "Teachers can view own learning_situations" ON learning_situations;

-- Programmes
DROP POLICY IF EXISTS "Admins can manage programmes" ON programmes;
DROP POLICY IF EXISTS "Teachers can view own programmes" ON programmes;

-- ============================================================
-- PASO 3: Crear nuevas políticas simplificadas
-- ============================================================

-- Función auxiliar para verificar si es administrador
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'admin@ieslopedevega.es'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- POLÍTICAS PARA ADMINISTRADOR (acceso completo)
-- ============================================================

-- Users: Admin puede hacer todo
CREATE POLICY "admin_all_users" ON users
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Groups: Admin puede hacer todo
CREATE POLICY "admin_all_groups" ON groups
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Students: Admin puede hacer todo
CREATE POLICY "admin_all_students" ON students
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Teacher Subject Groups: Admin puede hacer todo
CREATE POLICY "admin_all_assignments" ON teacher_subject_groups
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Subjects: Admin puede hacer todo
CREATE POLICY "admin_all_subjects" ON subjects
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Activities: Admin puede hacer todo
CREATE POLICY "admin_all_activities" ON activities
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Grades: Admin puede hacer todo
CREATE POLICY "admin_all_grades" ON grades
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Learning Situations: Admin puede hacer todo
CREATE POLICY "admin_all_learning_situations" ON learning_situations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Programmes: Admin puede hacer todo
CREATE POLICY "admin_all_programmes" ON programmes
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- POLÍTICAS PARA PROFESORES (acceso limitado)
-- ============================================================

-- Users: Profesor puede ver su propio perfil
CREATE POLICY "teacher_view_own_profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Groups: Profesor puede ver grupos asignados
CREATE POLICY "teacher_view_groups" ON groups
  FOR SELECT
  USING (
    id IN (
      SELECT group_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Students: Profesor puede ver estudiantes de sus grupos
CREATE POLICY "teacher_view_students" ON students
  FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Teacher Subject Groups: Profesor puede ver sus asignaciones
CREATE POLICY "teacher_view_assignments" ON teacher_subject_groups
  FOR SELECT
  USING (teacher_id = auth.uid());

-- Subjects: Profesor puede ver sus materias
CREATE POLICY "teacher_view_subjects" ON subjects
  FOR SELECT
  USING (
    id IN (
      SELECT subject_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Activities: Profesor puede ver actividades de sus materias
CREATE POLICY "teacher_view_activities" ON activities
  FOR SELECT
  USING (
    subject_id IN (
      SELECT subject_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Grades: Profesor puede gestionar calificaciones de sus estudiantes
CREATE POLICY "teacher_manage_grades" ON grades
  FOR ALL
  USING (
    student_id IN (
      SELECT s.id FROM students s
      WHERE s.group_id IN (
        SELECT group_id FROM teacher_subject_groups 
        WHERE teacher_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    student_id IN (
      SELECT s.id FROM students s
      WHERE s.group_id IN (
        SELECT group_id FROM teacher_subject_groups 
        WHERE teacher_id = auth.uid()
      )
    )
  );

-- Learning Situations: Profesor puede ver SDA de sus materias
CREATE POLICY "teacher_view_learning_situations" ON learning_situations
  FOR SELECT
  USING (
    subject_id IN (
      SELECT subject_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Programmes: Profesor puede ver programaciones de sus materias
CREATE POLICY "teacher_view_programmes" ON programmes
  FOR SELECT
  USING (
    subject_id IN (
      SELECT subject_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- ============================================================
-- POLÍTICAS PÚBLICAS (datos curriculares)
-- ============================================================

-- Key Competencies: Todos pueden ver
CREATE POLICY "public_view_key_competencies" ON key_competencies
  FOR SELECT
  USING (true);

-- Specific Competencies: Todos pueden ver
CREATE POLICY "public_view_specific_competencies" ON specific_competencies
  FOR SELECT
  USING (true);

-- Evaluation Criteria: Todos pueden ver
CREATE POLICY "public_view_evaluation_criteria" ON evaluation_criteria
  FOR SELECT
  USING (true);

-- Basic Knowledge: Todos pueden ver
CREATE POLICY "public_view_basic_knowledge" ON basic_knowledge
  FOR SELECT
  USING (true);

-- ============================================================
-- PASO 4: Rehabilitar RLS
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subject_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE specific_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE basic_knowledge ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- Este script:
-- 1. Deshabilita RLS temporalmente
-- 2. Elimina todas las políticas antiguas
-- 3. Crea una función auxiliar is_admin() para evitar recursión
-- 4. Crea políticas simplificadas para admin y profesores
-- 5. Rehabilita RLS
-- 
-- Ejecutar este script completo para resolver los errores 403
-- ============================================================
