-- ============================================================
-- CONFIGURACIÓN COMPLETA DE AUTENTICACIÓN
-- Este script crea los usuarios en Supabase Auth y en la tabla users
-- Ejecuta ESTE script en el SQL Editor de Supabase
-- ============================================================

-- IMPORTANTE: Este script asume que ya has creado los usuarios en Supabase Auth
-- desde el dashboard (Authentication → Users → Add user)

-- PASO 1: Ver usuarios existentes en auth.users
SELECT 
  id,
  email,
  raw_user_meta_data,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at;

-- PASO 2: Ver perfiles existentes en la tabla users
SELECT 
  id,
  email,
  name,
  role,
  active,
  created_at
FROM users
ORDER BY created_at;

-- PASO 3: Crear perfil de administrador
-- Este script crea el perfil en la tabla users para el usuario admin
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

-- PASO 4: Crear perfil de profesor
-- Este script crea el perfil en la tabla users para el usuario profesor
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

-- PASO 5: Confirmar emails si no están confirmados
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es')
AND email_confirmed_at IS NULL;

-- PASO 6: Verificar que todo esté correcto
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.active,
  a.email_confirmed_at,
  CASE 
    WHEN a.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email no confirmado'
  END as estado_email,
  CASE 
    WHEN u.role = 'admin' THEN '🔑 Administrador'
    WHEN u.role = 'teacher' THEN '👨‍🏫 Profesor'
    ELSE '❓ Sin rol'
  END as tipo_usuario
FROM users u
LEFT JOIN auth.users a ON u.id = a.id
ORDER BY u.created_at DESC;

-- PASO 7: Verificar que los usuarios puedan iniciar sesión
-- Esta consulta muestra información de autenticación
SELECT 
  id,
  email,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Puede iniciar sesión'
    ELSE '❌ Necesita confirmar email'
  END as estado_auth,
  created_at
FROM auth.users
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es');

-- ============================================================
-- INSTRUCCIONES DE USO
-- ============================================================

-- DESPUÉS de ejecutar este script:

-- 1. Recarga la aplicación con Ctrl+F5
-- 2. Inicia sesión con:
--    Email: admin@ieslopedevega.es
--    Password: Admin2026!
-- 3. Deberías ver en la consola:
--    🌐 ✅ Sesión iniciada con Supabase
--    🌐 Los datos se persisten en Supabase

-- ============================================================
-- SOLUCIÓN DE PROBLEMAS
-- ============================================================

-- Si los usuarios no aparecen en auth.users:
-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Crea los usuarios manualmente con "Add user"
-- 3. Vuelve a ejecutar este script

-- Si los perfiles no se crean en la tabla users:
-- 1. Verifica que los usuarios existan en auth.users
-- 2. Ejecuta este script nuevamente
-- 3. Verifica que no haya errores de permisos

-- Si el login falla con error 400:
-- 1. Verifica que Email Provider esté habilitado
-- 2. Verifica que los emails estén confirmados
-- 3. Usa el modo local como fallback (credenciales de prueba)

-- ============================================================
-- CREDENCIALES
-- ============================================================

-- ADMINISTRADOR:
-- Email: admin@ieslopedevega.es
-- Password: Admin2026!

-- PROFESOR:
-- Email: profesor@ieslopedevega.es
-- Password: Prof2026!

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
