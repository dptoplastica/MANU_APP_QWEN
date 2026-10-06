-- ============================================================
-- SOLUCIÓN DEFINITIVA: Desactivar RLS en tabla teacher_subject_groups
-- Ejecuta ESTE script en el SQL Editor de Supabase
-- ============================================================

-- PASO 1: Desactivar RLS completamente en teacher_subject_groups
ALTER TABLE teacher_subject_groups DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "teacher_subject_groups_select_all" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_insert_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_update_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_delete_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Teachers can view their assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Admins can manage assignments" ON teacher_subject_groups;

-- PASO 3: Verificar que RLS está desactivado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'teacher_subject_groups';

-- Debería mostrar: rowsecurity = false

-- PASO 4: Probar una inserción
INSERT INTO teacher_subject_groups (teacher_id, subject_id, group_id)
SELECT 
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  (SELECT id FROM subjects LIMIT 1),
  (SELECT id FROM groups LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_subject_groups 
  WHERE teacher_id = (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
  AND subject_id = (SELECT id FROM subjects LIMIT 1)
  AND group_id = (SELECT id FROM groups LIMIT 1)
);

-- PASO 5: Verificar que la inserción se guardó
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  g.name as grupo
FROM teacher_subject_groups tsg
JOIN users u ON tsg.teacher_id = u.id
JOIN subjects s ON tsg.subject_id = s.id
JOIN groups g ON tsg.group_id = g.id
ORDER BY tsg.created_at DESC
LIMIT 5;

-- PASO 6: Eliminar la asignación de prueba (opcional)
-- DELETE FROM teacher_subject_groups 
-- WHERE id = (SELECT id FROM teacher_subject_groups ORDER BY created_at DESC LIMIT 1);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- Si llegaste hasta aquí sin errores, el problema está resuelto.
-- Recarga la aplicación (Ctrl+F5) e intenta crear una asignación.
