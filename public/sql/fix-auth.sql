-- ============================================================
-- HABILITAR AUTENTICACIÓN EN SUPABASE
-- Ejecuta ESTE script en el SQL Editor de Supabase
-- ============================================================

-- PASO 1: Verificar configuración de autenticación
-- Nota: Esto debe hacerse desde Supabase Dashboard
-- Authentication → Providers → Email
-- Asegúrate de que "Enable Email provider" esté activado
-- Y "Confirm email" esté desactivado (para pruebas)

-- PASO 2: Ver usuarios existentes en auth.users
SELECT 
  id,
  email,
  raw_user_meta_data,
  email_confirmed_at,
  created_at
FROM auth.users;

-- PASO 3: Ver perfiles en la tabla users
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users;

-- PASO 4: Crear usuario administrador si no existe
-- Primero crea el usuario en Supabase Auth:
-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Click en "Add user" → "Create new user"
-- 3. Email: admin@ieslopedevega.es
-- 4. Password: Admin2026!
-- 5. ✓ Auto Confirm User
-- 6. Click en "Create user"

-- Luego ejecuta este SQL para crear el perfil:
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

-- PASO 5: Crear usuario profesor si no existe
-- Primero crea el usuario en Supabase Auth:
-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Click en "Add user" → "Create new user"
-- 3. Email: profesor@ieslopedevega.es
-- 4. Password: Prof2026!
-- 5. ✓ Auto Confirm User
-- 6. Click en "Create user"

-- Luego ejecuta este SQL para crear el perfil:
INSERT INTO users (id, email, name, role, active)
SELECT 
  id,
  email,
  'D. García López',
  'teacher',
  true
FROM auth.users
WHERE email = 'profesor@ieslopedevega.es'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'teacher',
  active = true,
  name = 'D. García López';

-- PASO 6: Verificar que los usuarios fueron creados
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.active,
  a.email_confirmed_at,
  CASE 
    WHEN u.role = 'admin' THEN '🔑 Administrador'
    WHEN u.role = 'teacher' THEN '👨‍🏫 Profesor'
    ELSE '❓ Sin rol'
  END as tipo_usuario
FROM users u
LEFT JOIN auth.users a ON u.id = a.id
ORDER BY u.created_at DESC;

-- PASO 7: Verificar que los emails están confirmados
SELECT 
  id,
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ No confirmado'
  END as estado
FROM auth.users;

-- Si algún email no está confirmado, ejecuta esto:
/*
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es');
*/

-- ============================================================
-- INSTRUCCIONES PARA INICIAR SESIÓN
-- ============================================================

-- Después de ejecutar este script:

-- 1. Ve a la aplicación web
-- 2. En la página de login, usa:
--    Email: admin@ieslopedevega.es
--    Password: Admin2026!
-- 3. Haz clic en "Acceder"
-- 4. Deberías ver el Dashboard con acceso completo de administrador

-- ============================================================
-- CREDENCIALES DE DEMOSTRACIÓN
-- ============================================================

-- ADMINISTRADOR:
-- Email: admin@ieslopedevega.es
-- Password: Admin2026!

-- PROFESOR:
-- Email: profesor@ieslopedevega.es
-- Password: Prof2026!

-- ============================================================
-- SOLUCIÓN DE PROBLEMAS
-- ============================================================

-- Si sigues teniendo problemas de autenticación:

-- 1. Verifica que la autenticación por email esté habilitada:
--    Supabase Dashboard → Authentication → Providers → Email
--    ✓ Enable Email provider
--    ✗ Confirm email (desactivado para pruebas)

-- 2. Verifica que los usuarios existan en auth.users:
SELECT COUNT(*) as total_users FROM auth.users;

-- 3. Verifica que los perfiles existan en la tabla users:
SELECT COUNT(*) as total_profiles FROM users;

-- 4. Si los usuarios no existen, créalos manualmente desde:
--    Supabase Dashboard → Authentication → Users → Add user

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
