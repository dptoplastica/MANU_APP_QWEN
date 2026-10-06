-- ============================================================
-- FIX USERS TABLE PERMISSIONS
-- Este script corrige los permisos de la tabla users
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Primero, verificar si la tabla users existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    RAISE NOTICE 'La tabla users no existe. Ejecuta schema.sql primero.';
  ELSE
    RAISE NOTICE 'La tabla users existe. Procediendo con correcciones...';
  END IF;
END $$;

-- ============================================================
-- ELIMINAR POLÍTICAS RLS EXISTENTES PARA users
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;

-- ============================================================
-- CREAR POLÍTICAS RLS PERMISIVAS PARA users
-- ============================================================

-- Política 1: Permitir que cualquier usuario autenticado lea su propio perfil
CREATE POLICY "Users can view their own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política 2: Permitir que los administradores vean todos los usuarios
CREATE POLICY "Admins can view all users"
ON users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Política 3: Permitir que los usuarios actualicen su propio perfil
CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política 4: Permitir que los administradores gestionen todos los usuarios
CREATE POLICY "Admins can manage all users"
ON users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================================
-- VERIFICAR QUE LA TABLA users TIENE LA ESTRUCTURA CORRECTA
-- ============================================================

-- Verificar columnas necesarias
DO $$
BEGIN
  -- Verificar si la columna 'role' existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'teacher';
    RAISE NOTICE 'Columna role agregada a la tabla users';
  END IF;

  -- Verificar si la columna 'name' existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT '';
    RAISE NOTICE 'Columna name agregada a la tabla users';
  END IF;

  -- Verificar si la columna 'active' existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'active'
  ) THEN
    ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
    RAISE NOTICE 'Columna active agregada a la tabla users';
  END IF;
END $$;

-- ============================================================
-- CREAR USUARIOS DE PRUEBA (OPCIONAL)
-- ============================================================

-- Nota: Los usuarios deben crearse primero en Supabase Auth
-- Este script solo actualiza la tabla users con los perfiles

-- Verificar si existen usuarios en auth.users
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count = 0 THEN
    RAISE NOTICE 'No hay usuarios en auth.users. Crea usuarios en Supabase Auth primero.';
  ELSE
    RAISE NOTICE 'Hay % usuarios en auth.users', user_count;
    
    -- Insertar/actualizar perfiles para todos los usuarios de auth
    INSERT INTO users (id, email, name, role, active)
    SELECT 
      id,
      email,
      COALESCE(
        raw_user_meta_data->>'name',
        split_part(email, '@', 1) -- Usar parte antes del @ como nombre
      ),
      COALESCE(
        raw_user_meta_data->>'role',
        'teacher'
      ),
      true
    FROM auth.users
    ON CONFLICT (id) DO UPDATE
    SET 
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      role = EXCLUDED.role,
      active = true;
      
    RAISE NOTICE 'Perfiles de usuarios creados/actualizados';
  END IF;
END $$;

-- ============================================================
-- CREAR UN ADMINISTRADOR POR DEFECTO (OPCIONAL)
-- ============================================================

-- Si no hay administradores, hacer que el primer usuario sea admin
DO $$
DECLARE
  admin_count INTEGER;
  first_user_id UUID;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM users WHERE role = 'admin';
  
  IF admin_count = 0 THEN
    SELECT id INTO first_user_id FROM users LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      UPDATE users SET role = 'admin' WHERE id = first_user_id;
      RAISE NOTICE 'Primer usuario (%) convertido en administrador', first_user_id;
    ELSE
      RAISE NOTICE 'No hay usuarios para convertir en administrador';
    END IF;
  ELSE
    RAISE NOTICE 'Ya hay % administradores', admin_count;
  END IF;
END $$;

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================

-- Mostrar resumen de usuarios
SELECT 
  id,
  email,
  name,
  role,
  active,
  created_at
FROM users
ORDER BY created_at DESC;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
RAISE NOTICE 'Script de corrección de permisos completado';
