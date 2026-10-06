-- ============================================================
-- SOLUCIÓN DIRECTA: Permitir actualizaciones en tabla groups
-- Ejecuta ESTE script completo en el SQL Editor de Supabase
-- ============================================================

-- PASO 1: Ver tu usuario actual
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE id = auth.uid();

-- PASO 2: Si tu rol NO es 'admin', ejecuta esto:
UPDATE users 
SET role = 'admin', active = true
WHERE id = auth.uid();

-- PASO 3: Desactivar RLS temporalmente para la tabla groups
-- (Esto permite todas las operaciones sin restricciones)
ALTER TABLE groups DISABLE ROW LEVEL SECURITY;

-- PASO 4: Verificar que RLS está desactivado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'groups';

-- Debería mostrar: rowsecurity = false

-- PASO 5: Probar una actualización manual
UPDATE groups 
SET name = '1º Bachillerato A (Prueba)'
WHERE id = (SELECT id FROM groups LIMIT 1);

-- PASO 6: Verificar que el cambio se guardó
SELECT id, name, course FROM groups;

-- PASO 7: Si la actualización funcionó, reactivar RLS con políticas permisivas
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir SELECT a todos los autenticados
DROP POLICY IF EXISTS "groups_select_all" ON groups;
CREATE POLICY "groups_select_all"
ON groups
FOR SELECT
TO authenticated
USING (true);

-- Crear política para permitir INSERT a administradores
DROP POLICY IF EXISTS "groups_insert_admin" ON groups;
CREATE POLICY "groups_insert_admin"
ON groups
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Crear política para permitir UPDATE a administradores
DROP POLICY IF EXISTS "groups_update_admin" ON groups;
CREATE POLICY "groups_update_admin"
ON groups
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Crear política para permitir DELETE a administradores
DROP POLICY IF EXISTS "groups_delete_admin" ON groups;
CREATE POLICY "groups_delete_admin"
ON groups
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- PASO 8: Verificación final
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'groups';

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- Si llegaste hasta aquí sin errores, el problema debería estar resuelto.
-- Recarga la aplicación (Ctrl+F5) e intenta editar un grupo.
