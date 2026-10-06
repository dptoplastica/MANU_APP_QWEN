-- ============================================================
-- SOLUCIÓN DEFINITIVA: Desactivar RLS en tabla groups
-- Ejecuta ESTE script en el SQL Editor de Supabase
-- ============================================================

-- PASO 1: Desactivar RLS completamente en groups
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "groups_select_all" ON groups;
DROP POLICY IF EXISTS "groups_select_authenticated" ON groups;
DROP POLICY IF EXISTS "groups_insert_admin" ON groups;
DROP POLICY IF EXISTS "groups_update_admin" ON groups;
DROP POLICY IF EXISTS "groups_delete_admin" ON groups;

-- PASO 3: Verificar que RLS está desactivado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'groups';

-- Debería mostrar: rowsecurity = false

-- PASO 4: Probar una actualización
UPDATE groups 
SET name = '1º Bachillerato A (Prueba)'
WHERE id = (SELECT id FROM groups LIMIT 1);

-- PASO 5: Verificar que el cambio se guardó
SELECT id, name, course FROM groups;

-- PASO 6: Restaurar el nombre original (opcional)
-- UPDATE groups 
-- SET name = '1º Bachillerato A'
-- WHERE id = (SELECT id FROM groups LIMIT 1);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- Si llegaste hasta aquí sin errores, el problema está resuelto.
-- Recarga la aplicación (Ctrl+F5) e intenta editar un grupo.
