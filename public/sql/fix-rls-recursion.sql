-- ============================================================
-- CORRECCIÓN: Políticas RLS sin recursión infinita
-- ============================================================

-- Eliminar la política problemática en la tabla users
DROP POLICY IF EXISTS "Admins have full access to all tables" ON users;

-- Crear políticas correctas para la tabla users
-- Política 1: Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Los administradores pueden ver todos los perfiles
-- Esta política NO consulta la tabla users, evita la recursión
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
CREATE POLICY "Admins can view all profiles" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = users.id 
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Política 3: Los administradores pueden insertar perfiles
DROP POLICY IF EXISTS "Admins can insert profiles" ON users;
CREATE POLICY "Admins can insert profiles" ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = users.id 
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Política 4: Los administradores pueden actualizar perfiles
DROP POLICY IF EXISTS "Admins can update profiles" ON users;
CREATE POLICY "Admins can update profiles" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = users.id 
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- ============================================================
-- Políticas para otras tablas (sin recursión)
-- ============================================================

-- Grupos: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage groups" ON groups;
CREATE POLICY "Admins can manage groups" ON groups
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Estudiantes: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage students" ON students;
CREATE POLICY "Admins can manage students" ON students
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Asignaciones: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage assignments" ON teacher_subject_groups;
CREATE POLICY "Admins can manage assignments" ON teacher_subject_groups
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Materias: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;
CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Actividades: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage activities" ON activities;
CREATE POLICY "Admins can manage activities" ON activities
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Calificaciones: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage grades" ON grades;
CREATE POLICY "Admins can manage grades" ON grades
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- ============================================================
-- Políticas para profesores (lectura)
-- ============================================================

-- Profesores pueden ver sus asignaciones
DROP POLICY IF EXISTS "Teachers can view own assignments" ON teacher_subject_groups;
CREATE POLICY "Teachers can view own assignments" ON teacher_subject_groups
  FOR SELECT
  USING (teacher_id = auth.uid());

-- Profesores pueden ver sus materias
DROP POLICY IF EXISTS "Teachers can view own subjects" ON subjects;
CREATE POLICY "Teachers can view own subjects" ON subjects
  FOR SELECT
  USING (
    id IN (
      SELECT subject_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Profesores pueden ver sus grupos
DROP POLICY IF EXISTS "Teachers can view own groups" ON groups;
CREATE POLICY "Teachers can view own groups" ON groups
  FOR SELECT
  USING (
    id IN (
      SELECT group_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Profesores pueden ver alumnos de sus grupos
DROP POLICY IF EXISTS "Teachers can view own students" ON students;
CREATE POLICY "Teachers can view own students" ON students
  FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- ============================================================
-- FIN DE CORRECCIÓN
-- ============================================================
