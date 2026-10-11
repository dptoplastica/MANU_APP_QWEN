-- ============================================================
-- CORRECCIÓN DE POLÍTICAS RLS - VERSIÓN ACTUALIZADA
-- Este script es seguro para ejecutar múltiples veces
-- ============================================================

-- PASO 1: Eliminar todas las políticas existentes
-- ============================================================

-- Tabla users
DROP POLICY IF EXISTS "admin_all_users" ON users;
DROP POLICY IF EXISTS "teacher_view_own_profile" ON users;
DROP POLICY IF EXISTS "Admins have full access to all tables" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;

-- Tabla groups
DROP POLICY IF EXISTS "admin_all_groups" ON groups;
DROP POLICY IF EXISTS "teacher_view_groups" ON groups;
DROP POLICY IF EXISTS "Teachers can view own groups" ON groups;
DROP POLICY IF EXISTS "Teachers can insert groups" ON groups;
DROP POLICY IF EXISTS "Teachers can update groups" ON groups;
DROP POLICY IF EXISTS "Admins can manage groups" ON groups;

-- Tabla students
DROP POLICY IF EXISTS "admin_all_students" ON students;
DROP POLICY IF EXISTS "teacher_view_students" ON students;
DROP POLICY IF EXISTS "Teachers can view own students" ON students;
DROP POLICY IF EXISTS "Teachers can insert students" ON students;
DROP POLICY IF EXISTS "Teachers can update students" ON students;
DROP POLICY IF EXISTS "Admins can manage students" ON students;

-- Tabla teacher_subject_groups
DROP POLICY IF EXISTS "admin_all_assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_view_assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Teachers can view own assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Teachers can insert assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Admins can manage assignments" ON teacher_subject_groups;

-- Tabla subjects
DROP POLICY IF EXISTS "admin_all_subjects" ON subjects;
DROP POLICY IF EXISTS "teacher_view_subjects" ON subjects;
DROP POLICY IF EXISTS "Teachers can view own subjects" ON subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;

-- Tabla activities
DROP POLICY IF EXISTS "admin_all_activities" ON activities;
DROP POLICY IF EXISTS "teacher_view_activities" ON activities;
DROP POLICY IF EXISTS "Teachers can view own activities" ON activities;
DROP POLICY IF EXISTS "Admins can manage activities" ON activities;

-- Tabla grades
DROP POLICY IF EXISTS "admin_all_grades" ON grades;
DROP POLICY IF EXISTS "teacher_manage_grades" ON grades;
DROP POLICY IF EXISTS "Teachers can manage own grades" ON grades;
DROP POLICY IF EXISTS "Admins can manage grades" ON grades;

-- Tabla learning_situations
DROP POLICY IF EXISTS "admin_all_learning_situations" ON learning_situations;
DROP POLICY IF EXISTS "teacher_view_learning_situations" ON learning_situations;
DROP POLICY IF EXISTS "Teachers can view own learning_situations" ON learning_situations;
DROP POLICY IF EXISTS "Admins can manage learning_situations" ON learning_situations;

-- Tabla programmes
DROP POLICY IF EXISTS "admin_all_programmes" ON programmes;
DROP POLICY IF EXISTS "teacher_view_programmes" ON programmes;
DROP POLICY IF EXISTS "Teachers can view own programmes" ON programmes;
DROP POLICY IF EXISTS "Admins can manage programmes" ON programmes;

-- Tablas de datos curriculares
DROP POLICY IF EXISTS "public_view_key_competencies" ON key_competencies;
DROP POLICY IF EXISTS "public_view_specific_competencies" ON specific_competencies;
DROP POLICY IF EXISTS "public_view_evaluation_criteria" ON evaluation_criteria;
DROP POLICY IF EXISTS "public_view_basic_knowledge" ON basic_knowledge;

-- ============================================================
-- PASO 2: Crear función auxiliar is_admin()
-- ============================================================

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
-- PASO 3: Crear nuevas políticas para ADMINISTRADOR
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
-- PASO 4: Crear políticas para PROFESORES
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
-- PASO 5: Crear políticas públicas (datos curriculares)
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
-- FIN DEL SCRIPT
-- ============================================================
-- Este script es idempotente: puede ejecutarse múltiples veces
-- sin causar errores. Primero elimina las políticas existentes
-- y luego crea las nuevas.
-- ============================================================
