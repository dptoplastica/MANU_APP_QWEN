-- ============================================================
-- CREAR USUARIO ADMINISTRADOR
-- Ejecuta ESTE script en el SQL Editor de Supabase
-- ============================================================

-- PASO 1: Ver usuarios existentes en auth.users
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users;

-- PASO 2: Ver perfiles existentes en la tabla users
SELECT 
  id,
  email,
  name,
  role,
  active,
  created_at
FROM users;

-- PASO 3: Crear perfil de administrador para el primer usuario de auth.users
-- (Si ya tienes un usuario en auth.users, este script lo convertirá en admin)
INSERT INTO users (id, email, name, role, active)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'admin',
  true
FROM auth.users
WHERE id NOT IN (SELECT id FROM users)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  active = true,
  name = EXCLUDED.name;

-- PASO 4: Si NO tienes usuarios en auth.users, crea uno manualmente
-- Nota: Los usuarios deben crearse en Supabase Auth (Authentication -> Users)
-- Este script solo crea el perfil en la tabla users

-- PASO 5: Verificar que ahora tienes un administrador
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE role = 'admin';

-- PASO 6: Si quieres crear credenciales específicas
-- Email: admin@ieslopedevega.es
-- Password: Admin2026!

-- Ve a Supabase Dashboard -> Authentication -> Users
-- Haz clic en "Add user" -> "Create new user"
-- Email: admin@ieslopedevega.es
-- Password: Admin2026!
-- Auto Confirm User: ✓ (marca esta casilla)
-- Haz clic en "Create user"

-- Luego ejecuta este SQL para crear el perfil:
/*
INSERT INTO users (id, email, name, role, active)
SELECT 
  id,
  email,
  'Administrador del Centro',
  'admin',
  true
FROM auth.users
WHERE email = 'admin@ieslopedevega.es'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  active = true,
  name = 'Administrador del Centro';
*/

-- PASO 7: Ver todos los usuarios con sus roles
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.active,
  CASE 
    WHEN u.role = 'admin' THEN '🔑 Administrador'
    WHEN u.role = 'teacher' THEN '👨‍🏫 Profesor'
    ELSE '❓ Sin rol'
  END as tipo_usuario
FROM users u
ORDER BY u.created_at DESC;

-- ============================================================
-- INSTRUCCIONES PARA INICIAR SESIÓN
-- ============================================================

-- Después de ejecutar este script:

-- 1. Ve a la aplicación web
-- 2. En la página de login, usa:
--    Email: admin@ieslopedevega.es (o el email que creaste)
--    Password: Admin2026! (o la contraseña que estableciste)
-- 3. Haz clic en "Acceder"
-- 4. Deberías ver el Dashboard con acceso completo de administrador

-- ============================================================
-- CREDENCIALES DE DEMOSTRACIÓN
-- ============================================================

-- Si quieres usar las credenciales de demostración:

-- ADMINISTRADOR:
-- Email: admin@ieslopedevega.es
-- Password: Admin2026!

-- PROFESOR:
-- Email: profesor@ieslopedevega.es
-- Password: Prof2026!

-- Para crear estos usuarios:
-- 1. Ve a Supabase Dashboard -> Authentication -> Users
-- 2. Crea cada usuario con "Add user" -> "Create new user"
-- 3. Marca "Auto Confirm User"
-- 4. Luego ejecuta este script para crear los perfiles

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
