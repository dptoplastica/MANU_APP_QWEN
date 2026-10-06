-- ============================================================
-- FIX USERS TABLE - VERSIÓN SIMPLIFICADA
-- Este script usa permisos estándar de Supabase
-- Ejecutar con el rol service_role o postgres
-- ============================================================

-- Cambiar al rol con permisos completos
SET LOCAL ROLE postgres;

-- ============================================================
-- PASO 1: ELIMINAR POLÍTICAS RLS EXISTENTES
-- ============================================================
DO $$
BEGIN
  -- Eliminar todas las políticas existentes de la tabla users
  EXECUTE 'DROP POLICY IF EXISTS "Users can view their own profile" ON users';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update their own profile" ON users';
  EXECUTE 'DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users';
  EXECUTE 'DROP POLICY IF EXISTS "Admins can view all users" ON users';
  EXECUTE 'DROP POLICY IF EXISTS "Enable read access for all users" ON users';
  EXECUTE 'DROP POLICY IF EXISTS "Users can read their own profile" ON users';
  EXECUTE 'DROP POLICY IF EXISTS "Enable update for users based on id" ON users';
  EXECUTE 'DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users';
  
  RAISE NOTICE 'Políticas RLS antiguas eliminadas';
END $$;

-- ============================================================
-- PASO 2: CREAR POLÍTICAS RLS PERMISIVAS
-- ============================================================

-- Política 1: Todos los usuarios autenticados pueden leer su propio perfil
CREATE POLICY "users_select_own"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política 2: Los administradores pueden ver todos los usuarios
CREATE POLICY "admins_select_all"
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

-- Política 3: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política 4: Los administradores pueden gestionar todos los usuarios
CREATE POLICY "admins_manage_all"
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
-- PASO 3: VERIFICAR ESTRUCTURA DE LA TABLA
-- ============================================================
DO $$
BEGIN
  -- Verificar y agregar columna 'role' si no existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'teacher';
    RAISE NOTICE 'Columna role agregada';
  END IF;

  -- Verificar y agregar columna 'name' si no existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT '';
    RAISE NOTICE 'Columna name agregada';
  END IF;

  -- Verificar y agregar columna 'active' si no existe
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'active'
  ) THEN
    ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
    RAISE NOTICE 'Columna active agregada';
  END IF;
END $$;

-- ============================================================
-- PASO 4: CREAR PERFILES PARA USUARIOS EXISTENTES
-- ============================================================
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Contar usuarios en auth.users
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count > 0 THEN
    -- Insertar/actualizar perfiles para todos los usuarios de auth
    INSERT INTO users (id, email, name, role, active)
    SELECT 
      id,
      email,
      COALESCE(
        raw_user_meta_data->>'name',
        split_part(email, '@', 1)
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
      
    RAISE NOTICE 'Perfiles creados/actualizados para % usuarios', user_count;
  ELSE
    RAISE NOTICE 'No hay usuarios en auth.users';
  END IF;
END $$;

-- ============================================================
-- PASO 5: CREAR ADMINISTRADOR POR DEFECTO
-- ============================================================
DO $$
DECLARE
  admin_count INTEGER;
  first_user_id UUID;
BEGIN
  -- Contar administradores existentes
  SELECT COUNT(*) INTO admin_count FROM users WHERE role = 'admin';
  
  IF admin_count = 0 THEN
    -- Obtener el primer usuario
    SELECT id INTO first_user_id FROM users LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      UPDATE users SET role = 'admin' WHERE id = first_user_id;
      RAISE NOTICE 'Primer usuario (%) convertido en administrador', first_user_id;
    END IF;
  END IF;
END $$;

-- ============================================================
-- PASO 6: VERIFICACIÓN FINAL
-- ============================================================
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
-- Script completado exitosamente
