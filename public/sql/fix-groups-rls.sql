-- ============================================================
-- FIX GROUPS RLS POLICIES
-- Este script corrige las políticas RLS de la tabla groups
-- para permitir que los administradores gestionen los grupos
-- ============================================================

-- Paso 1: Ver políticas RLS actuales
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'groups';

-- Paso 2: Eliminar políticas RLS existentes de groups
DROP POLICY IF EXISTS "Groups are viewable by everyone" ON groups;
DROP POLICY IF EXISTS "Groups are viewable by authenticated users" ON groups;
DROP POLICY IF EXISTS "Admins can manage all groups" ON groups;
DROP POLICY IF EXISTS "Users can view groups" ON groups;
DROP POLICY IF EXISTS "Enable read access for all users" ON groups;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON groups;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON groups;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON groups;

-- Paso 3: Crear políticas RLS permisivas para groups

-- Política 1: Todos los usuarios autenticados pueden ver grupos
CREATE POLICY "groups_select_all"
ON groups
FOR SELECT
TO authenticated
USING (true);

-- Política 2: Los administradores pueden insertar grupos
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

-- Política 3: Los administradores pueden actualizar grupos
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

-- Política 4: Los administradores pueden eliminar grupos
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

-- Paso 4: Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'groups'
ORDER BY policyname;

-- Paso 5: Verificar que el usuario actual es administrador
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE id = auth.uid();

-- Paso 6: Probar insertar un grupo de prueba
-- (Descomenta esta línea para probar)
-- INSERT INTO groups (id, name, course, academic_year_id)
-- VALUES (gen_random_uuid(), 'Grupo de Prueba', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010');

-- Paso 7: Verificar que el grupo se insertó
SELECT id, name, course, academic_year_id FROM groups ORDER BY created_at DESC LIMIT 5;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
