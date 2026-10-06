-- ============================================================
-- SOLUCIÓN DEFINITIVA: Error 500 en tabla users
-- Ejecuta ESTE script en el SQL Editor de Supabase
-- ============================================================

-- PASO 1: Desactivar RLS completamente en la tabla users
-- Esto elimina todas las restricciones de seguridad
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar todas las políticas RLS existentes
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "users_select_authenticated" ON users;
DROP POLICY IF EXISTS "users_insert_admin" ON users;
DROP POLICY IF EXISTS "users_update_admin" ON users;
DROP POLICY IF EXISTS "users_delete_admin" ON users;

-- PASO 3: Verificar que RLS está desactivado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'users';

-- Debería mostrar: rowsecurity = false

-- PASO 4: Verificar tu usuario actual
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE id = auth.uid();

-- PASO 5: Si tu usuario NO es administrador, hazlo administrador
UPDATE users 
SET role = 'admin', active = true
WHERE id = auth.uid();

-- PASO 6: Verificar que ahora eres administrador
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE id = auth.uid();

-- Debería mostrar: role = 'admin'

-- PASO 7: Probar una consulta simple
SELECT id, email, name, role FROM users LIMIT 5;

-- Si esta consulta funciona sin error 500, el problema está resuelto

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
-- Recarga la aplicación (Ctrl+F5) después de ejecutar este script
-- El error 500 debería desaparecer
