-- ============================================================
-- CREAR USUARIOS ADMINISTRADOR Y PROFESOR (VERSIÓN SIMPLE)
-- Este script NO requiere acceso a auth.users
-- Ejecuta ESTE script en el SQL Editor de Supabase
-- ============================================================

-- IMPORTANTE: Este script crea usuarios directamente en la tabla users
-- Los usuarios deben existir en Supabase Auth (Authentication → Users)
-- pero este script NO verifica auth.users

-- PASO 1: Ver usuarios existentes en la tabla users
SELECT 
  id,
  email,
  name,
  role,
  active,
  created_at
FROM users
ORDER BY created_at DESC;

-- PASO 2: Crear o actualizar el usuario administrador
-- Usamos un ID fijo para el administrador
INSERT INTO users (id, email, name, role, active, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@ieslopedevega.es',
  'Administrador del Centro',
  'admin',
  true,
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- PASO 3: Crear o actualizar el usuario profesor
-- Usamos un ID fijo para el profesor
INSERT INTO users (id, email, name, role, active, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'profesor@ieslopedevega.es',
  'D. García López',
  'teacher',
  true,
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  active = EXCLUDED.active;

-- PASO 4: Verificar que los usuarios fueron creados correctamente
SELECT 
  id,
  email,
  name,
  role,
  active,
  created_at
FROM users
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es')
ORDER BY created_at DESC;

-- PASO 5: Ver todos los usuarios con sus roles
SELECT 
  id,
  email,
  name,
  role,
  active,
  CASE 
    WHEN role = 'admin' THEN '🔑 Administrador'
    WHEN role = 'teacher' THEN '👨‍🏫 Profesor'
    ELSE '❓ Sin rol'
  END as tipo_usuario
FROM users
ORDER BY role, name;

-- ============================================================
-- INSTRUCCIONES PARA INICIAR SESIÓN
-- ============================================================

-- DESPUÉS de ejecutar este script:

-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Crea estos usuarios (si no existen):
--    - admin@ieslopedevega.es / Admin2026!
--    - profesor@ieslopedevega.es / Prof2026!
-- 3. Marca "Auto Confirm User" para ambos
-- 4. Recarga la aplicación con Ctrl+F5
-- 5. Inicia sesión con las credenciales

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
-- VERIFICACIÓN FINAL
-- ============================================================

-- Verifica que los usuarios están activos y con roles correctos:
SELECT 
  email,
  name,
  role,
  active,
  CASE 
    WHEN active = true AND role IS NOT NULL THEN '✅ Listo para usar'
    WHEN active = false THEN '❌ Usuario inactivo'
    ELSE '❌ Sin rol asignado'
  END as estado
FROM users
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es');

-- ============================================================
-- SOLUCIÓN DE PROBLEMAS
-- ============================================================

-- Si ves "permission denied for table users":
-- Ejecuta primero grant-permissions.sql

-- Si los usuarios no aparecen en Supabase Auth:
-- 1. Ve a Authentication → Users
-- 2. Crea los usuarios manualmente
-- 3. Asegúrate de que los emails coincidan exactamente

-- Si el login falla:
-- 1. Verifica que los emails estén confirmados en Supabase Auth
-- 2. Verifica que las contraseñas sean correctas
-- 3. Usa el modo local como fallback

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
