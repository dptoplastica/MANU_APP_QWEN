-- ============================================================
-- POLÍTICAS RLS PARA ADMINISTRADOR
-- Ejecutar este script para permitir que el admin gestione todo
-- ============================================================

-- Política para que el admin pueda ver todos los grupos
DROP POLICY IF EXISTS "Admins can view all groups" ON groups;
CREATE POLICY "Admins can view all groups" ON groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todos los alumnos
DROP POLICY IF EXISTS "Admins can view all students" ON students;
CREATE POLICY "Admins can view all students" ON students
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las asignaciones
DROP POLICY IF EXISTS "Admins can view all assignments" ON teacher_subject_groups;
CREATE POLICY "Admins can view all assignments" ON teacher_subject_groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las materias
DROP POLICY IF EXISTS "Admins can view all subjects" ON subjects;
CREATE POLICY "Admins can view all subjects" ON subjects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las actividades
DROP POLICY IF EXISTS "Admins can view all activities" ON activities;
CREATE POLICY "Admins can view all activities" ON activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las calificaciones
DROP POLICY IF EXISTS "Admins can view all grades" ON grades;
CREATE POLICY "Admins can view all grades" ON grades
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las situaciones de aprendizaje
DROP POLICY IF EXISTS "Admins can view all learning_situations" ON learning_situations;
CREATE POLICY "Admins can view all learning_situations" ON learning_situations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las programaciones
DROP POLICY IF EXISTS "Admins can view all programmes" ON programmes;
CREATE POLICY "Admins can view all programmes" ON programmes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- POLÍTICAS PARA PROFESORES (INSERT/UPDATE/DELETE)
-- ============================================================

-- Permitir que los profesores inserten grupos (si tienen asignaciones)
DROP POLICY IF EXISTS "Teachers can insert groups" ON groups;
CREATE POLICY "Teachers can insert groups" ON groups
  FOR INSERT WITH CHECK (true);

-- Permitir que los profesores actualicen grupos
DROP POLICY IF EXISTS "Teachers can update groups" ON groups;
CREATE POLICY "Teachers can update groups" ON groups
  FOR UPDATE USING (true);

-- Permitir que los profesores inserten alumnos
DROP POLICY IF EXISTS "Teachers can insert students" ON students;
CREATE POLICY "Teachers can insert students" ON students
  FOR INSERT WITH CHECK (true);

-- Permitir que los profesores actualicen alumnos
DROP POLICY IF EXISTS "Teachers can update students" ON students;
CREATE POLICY "Teachers can update students" ON students
  FOR UPDATE USING (true);

-- Permitir que los profesores inserten asignaciones
DROP POLICY IF EXISTS "Teachers can insert assignments" ON teacher_subject_groups;
CREATE POLICY "Teachers can insert assignments" ON teacher_subject_groups
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- FIN DE POLÍTICAS
-- ============================================================
