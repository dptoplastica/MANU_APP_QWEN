-- ============================================================
-- OTORGAR PERMISOS PARA ACCEDER A auth.users
-- Ejecuta ESTE script PRIMERO en el SQL Editor de Supabase
-- ============================================================

-- IMPORTANTE: Este script debe ejecutarse con permisos de administrador
-- Si ves "permission denied", necesitas cambiar al rol correcto

-- PASO 1: Otorgar permisos de SELECT en auth.users
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON auth.users TO service_role;

-- PASO 2: Otorgar permisos de SELECT en la tabla users
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO service_role;

-- PASO 3: Otorgar permisos de INSERT y UPDATE en la tabla users
GRANT INSERT, UPDATE ON public.users TO authenticated;
GRANT INSERT, UPDATE ON public.users TO service_role;

-- PASO 4: Verificar que los permisos se otorgaron correctamente
SELECT 
  grantee,
  privilege_type,
  table_name
FROM information_schema.role_table_grants
WHERE table_name IN ('users')
AND grantor = current_user;

-- ============================================================
-- ALTERNATIVA: Si no tienes permisos de administrador
-- ============================================================

-- Si el script anterior falla, necesitas ejecutarlo con un rol diferente:

-- OPCIÓN 1: Usar el rol postgres (si tienes acceso)
-- SET ROLE postgres;
-- Luego ejecuta los GRANT anteriores

-- OPCIÓN 2: Pedir al administrador de Supabase que ejecute los GRANT
-- El administrador debe ir a:
-- Supabase Dashboard → Database → Roles
-- Y otorgar permisos manualmente

-- OPCIÓN 3: Usar el script alternativo fix-auth-simple.sql
-- Este script NO requiere acceso a auth.users
-- Ver fix-auth-simple.sql para más detalles

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Después de ejecutar este script, verifica que puedes acceder a auth.users:
SELECT COUNT(*) as total_users FROM auth.users;

-- Si esta consulta funciona, puedes ejecutar fix-auth-complete.sql

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
