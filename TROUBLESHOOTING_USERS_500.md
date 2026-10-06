# Troubleshooting: Error 500 en tabla users

## Problema
```
Failed to load resource: the server responded with a status of 500 ()
sbymwyxjuxhkilwcxoed.supabase.co/rest/v1/users?select=*&id=eq.127302df-f835-405f-a7b1-3af0f91632ab
```

## Causa
El error 500 en la tabla `users` generalmente se debe a:
1. **Políticas RLS (Row Level Security)** que bloquean el acceso
2. **La tabla `users` no existe** o tiene una estructura incorrecta
3. **Falta la columna `role`** en la tabla `users`
4. **Permisos insuficientes** para el usuario autenticado

## Solución

### Paso 1: Ejecutar el script de corrección de permisos

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed
2. Ve a **SQL Editor**
3. Copia y pega el contenido del archivo `public/sql/fix-users-permissions.sql`
4. Ejecuta el script

Este script:
- Elimina políticas RLS problemáticas
- Crea políticas RLS permisivas para la tabla `users`
- Verifica que las columnas necesarias existan (`role`, `name`, `active`)
- Crea perfiles para todos los usuarios de `auth.users`
- Convierte el primer usuario en administrador si no hay administradores

### Paso 2: Verificar la estructura de la tabla users

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

Deberías ver al menos estas columnas:
- `id` (uuid)
- `email` (text)
- `name` (text)
- `role` (text)
- `active` (boolean)
- `created_at` (timestamp)

Si falta alguna columna, ejecuta:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'teacher';
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
```

### Paso 3: Verificar las políticas RLS

Ejecuta esta consulta para ver las políticas actuales:

```sql
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users';
```

Deberías ver al menos estas políticas:
- `Users can view their own profile` (SELECT)
- `Admins can view all users` (SELECT)
- `Users can update their own profile` (UPDATE)
- `Admins can manage all users` (ALL)

Si faltan políticas, ejecuta el script `fix-users-permissions.sql` nuevamente.

### Paso 4: Verificar que existen usuarios

Ejecuta esta consulta:

```sql
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.active,
  COUNT(a.id) as auth_exists
FROM users u
LEFT JOIN auth.users a ON u.id = a.id
GROUP BY u.id, u.email, u.name, u.role, u.active;
```

Si no hay usuarios, necesitas crearlos:

1. Ve a **Authentication** → **Users** en Supabase
2. Haz clic en **Add user** → **Create new user**
3. Crea un usuario con email y contraseña
4. Luego ejecuta este SQL para crear el perfil:

```sql
INSERT INTO users (id, email, name, role, active)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'admin', -- o 'teacher'
  true
FROM auth.users
WHERE email = 'tu-email@ejemplo.com'
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;
```

### Paso 5: Desactivar RLS temporalmente (solo para debugging)

Si nada funciona, puedes desactivar RLS temporalmente para diagnosticar:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

⚠️ **ADVERTENCIA**: Esto hace que la tabla sea accesible públicamente. Solo usa esto para debugging y vuelve a activar RLS después:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Verificación

Después de ejecutar el script, verifica que todo funciona:

1. Recarga la aplicación
2. Abre la consola del navegador (F12)
3. Inicia sesión
4. Deberías ver:
   ```
   Loading data from Supabase...
   Groups loaded from Supabase: X
   Students loaded from Supabase: X
   Assignments loaded from Supabase: X
   Grades loaded from Supabase: X
   ```
5. **NO** deberías ver errores 500 en la consola

## Errores Comunes

### Error: "relation users does not exist"
**Solución**: Ejecuta `schema.sql` primero para crear la tabla.

### Error: "column role does not exist"
**Solución**: Ejecuta el script `fix-users-permissions.sql` que agrega las columnas faltantes.

### Error: "new row violates row-level security policy"
**Solución**: Las políticas RLS son muy restrictivas. Ejecuta `fix-users-permissions.sql` para crear políticas más permisivas.

### Error: "could not find user with id"
**Solución**: El usuario existe en `auth.users` pero no en la tabla `users`. Ejecuta:

```sql
INSERT INTO users (id, email, name, role, active)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'teacher',
  true
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

## Contacto

Si el problema persiste después de seguir estos pasos:
1. Abre la consola del navegador (F12)
2. Copia todos los errores
3. Comparte los errores para diagnóstico
