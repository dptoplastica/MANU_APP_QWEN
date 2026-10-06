-- ============================================================
-- DIAGNÓSTICO Y CORRECCIÓN DE PERMISOS PARA TABLA GROUPS
-- ============================================================

-- PASO 1: Verificar estructura de la tabla groups
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'groups'
ORDER BY ordinal_position;

-- PASO 2: Ver políticas RLS actuales
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'groups';

-- PASO 3: Verificar tu usuario actual y su rol
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE id = auth.uid();

-- PASO 4: Ver todos los grupos actuales
SELECT 
  id,
  name,
  course,
  academic_year_id,
  created_at
FROM groups
ORDER BY created_at;

-- ============================================================
-- CORRECCIÓN: Eliminar políticas RLS restrictivas
-- ============================================================

-- Eliminar todas las políticas existentes de groups
DROP POLICY IF EXISTS "Groups are viewable by everyone" ON groups;
DROP POLICY IF EXISTS "Enable read access for all users" ON groups;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON groups;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON groups;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON groups;
DROP POLICY IF EXISTS "groups_select_all" ON groups;
DROP POLICY IF EXISTS "groups_insert_admin" ON groups;
DROP POLICY IF EXISTS "groups_update_admin" ON groups;
DROP POLICY IF EXISTS "groups_delete_admin" ON groups;

-- ============================================================
-- CREAR NUEVAS POLÍTICAS PERMISIVAS
-- ============================================================

-- Política 1: Todos los usuarios autenticados pueden VER grupos
CREATE POLICY "groups_select_authenticated"
ON groups
FOR SELECT
TO authenticated
USING (true);

-- Política 2: Solo administradores pueden INSERTAR grupos
CREATE POLICY "groups_insert_admin"
ON groups
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Política 3: Solo administradores pueden ACTUALIZAR grupos
CREATE POLICY "groups_update_admin"
ON groups
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Política 4: Solo administradores pueden ELIMINAR grupos
CREATE POLICY "groups_delete_admin"
ON groups
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================

-- Ver las nuevas políticas creadas
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'groups'
ORDER BY policyname;

-- Verificar que tu usuario es administrador
SELECT 
  email,
  name,
  role,
  active
FROM users
WHERE id = auth.uid();

-- Si tu usuario NO es administrador, ejecuta esto:
-- UPDATE users 
-- SET role = 'admin', active = true
-- WHERE id = auth.uid();

-- ============================================================
-- PRUEBA: Intentar actualizar un grupo manualmente
-- ============================================================

-- Descomenta y ejecuta esta línea para probar:
-- UPDATE groups 
-- SET name = '1º Bachillerato A (Prueba)'
-- WHERE id = (SELECT id FROM groups LIMIT 1);

-- Verificar el resultado
SELECT id, name, course FROM groups LIMIT 5;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
