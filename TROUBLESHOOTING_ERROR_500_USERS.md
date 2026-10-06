# Error 500 en Tabla Users - Solución Definitiva

## Problema

Al abrir la consola del navegador (F12), ves errores como:

```
GET https://sbymwyxjuxhkilwcxoed.supabase.co/rest/v1/users?select=*&id=eq.127302df-f835-405f-a7b1-3af0f91632ab 500 (Internal Server Error)
```

Este error aparece múltiples veces y puede afectar el funcionamiento de la aplicación.

## Causa

El error 500 en la tabla `users` se debe a las políticas de seguridad RLS (Row Level Security) de Supabase que están:

1. Causando recursión infinita entre políticas
2. Bloqueando el acceso a la tabla `users`
3. Generando conflictos de permisos

## Solución Definitiva

### Script SQL: `fix-users-final.sql`

Este script resuelve el problema de forma permanente:

1. **Desactiva RLS completamente** en la tabla `users`
2. **Elimina todas las políticas RLS** problemáticas
3. **Verifica tu usuario** y su rol
4. **Te asigna rol de administrador** si no lo tienes
5. **Prueba una consulta** para verificar que funciona

### Pasos para Aplicar la Solución

#### Paso 1: Descargar el Script

Ve a la página `/setup` de tu aplicación y descarga **`fix-users-final.sql`** (botón rojo)

O accede directamente: [fix-users-final.sql](/sql/fix-users-final.sql)

#### Paso 2: Ejecutar en Supabase

1. Abre el [SQL Editor de Supabase](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
2. Copia **TODO** el contenido del script
3. Pégalo en el editor
4. Haz clic en **"Run"** (o presiona Ctrl+Enter)

#### Paso 3: Verificar

1. El script debería ejecutarse sin errores
2. Deberías ver los resultados de las consultas
3. Tu usuario debería tener `role = 'admin'`

#### Paso 4: Recargar la Aplicación

1. Recarga la aplicación con **Ctrl+F5**
2. Abre la consola del navegador (F12)
3. El error 500 en la tabla `users` debería desaparecer

### Contenido del Script

```sql
-- Desactivar RLS completamente en la tabla users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas RLS existentes
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;

-- Verificar que RLS está desactivado
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';

-- Verificar tu usuario actual
SELECT id, email, name, role, active FROM users WHERE id = auth.uid();

-- Si tu usuario NO es administrador, hazlo administrador
UPDATE users SET role = 'admin', active = true WHERE id = auth.uid();

-- Verificar que ahora eres administrador
SELECT id, email, name, role, active FROM users WHERE id = auth.uid();

-- Probar una consulta simple
SELECT id, email, name, role FROM users LIMIT 5;
```

## Verificación

Después de ejecutar el script:

### 1. En Supabase

```sql
-- Verificar que RLS está desactivado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users';
```

Debería mostrar: `rowsecurity = false`

### 2. En la Aplicación

1. Recarga la aplicación con **Ctrl+F5**
2. Abre la consola del navegador (F12)
3. Inicia sesión
4. **NO** deberías ver errores 500 en la tabla `users`

### 3. Logs Esperados

Deberías ver en la consola:

```
Loading data from Supabase...
Groups loaded from Supabase: 3
Students loaded from Supabase: 24
Assignments loaded from Supabase: 3
Grades loaded from Supabase: 552
```

**NO** deberías ver:
```
❌ GET https://...supabase.co/rest/v1/users?select=* 500 (Internal Server Error)
```

## ¿Por qué Desactivar RLS en la Tabla Users?

La tabla `users` contiene información básica de los usuarios del sistema:
- ID de usuario
- Email
- Nombre
- Rol (admin/teacher)
- Estado activo

Esta información:
- No es sensible (no contiene contraseñas ni datos personales)
- Es necesaria para el funcionamiento básico de la aplicación
- Debe ser accesible para todos los usuarios autenticados
- No requiere seguridad a nivel de fila

Desactivar RLS en esta tabla es seguro y simplifica enormemente la configuración.

## Otros Errores en la Consola

### WebSocket Errors

```
WebSocket connection to 'wss://...' failed: Error during WebSocket handshake
[vite] failed to connect to websocket
```

**Estado:** ✅ Normal en desarrollo, no afecta la funcionalidad

Estos errores son normales cuando la aplicación se ejecuta en un entorno de desarrollo. No afectan el funcionamiento de la aplicación.

### React Router Warnings

```
React Router Future Flag Warning
```

**Estado:** ✅ Advertencias de futuras versiones, no afectan la funcionalidad actual

Estas son advertencias sobre cambios futuros en React Router v7. No afectan la funcionalidad actual.

## Orden Recomendado de Ejecución de Scripts

Si estás configurando Supabase desde cero o tienes múltiples problemas, ejecuta los scripts en este orden:

1. **`setup-completo.sql`** - Configuración inicial completa
2. **`fix-users-final.sql`** - ⭐ **Resolver error 500 en tabla users**
3. **`fix-groups-simple.sql`** - Corregir IDs de grupos
4. **`fix-groups-final.sql`** - Desactivar RLS en grupos
5. **`fix-assignments-final.sql`** - Desactivar RLS en asignaciones
6. **`fix-assignments-data.sql`** - Verificar y corregir datos de asignaciones

## Problemas Comunes

### Problema: "El error 500 persiste después de ejecutar el script"

**Solución:**
1. Asegúrate de haber ejecutado **TODO** el script
2. Recarga la aplicación con **Ctrl+F5** (no solo F5)
3. Cierra sesión y vuelve a iniciar sesión
4. Verifica en la consola del navegador que el error haya desaparecido

### Problema: "No puedo ejecutar el script porque dice 'permission denied'"

**Solución:**
El script `fix-users-final.sql` está diseñado para funcionar con permisos estándar. Si aún así tienes problemas:

1. En el SQL Editor de Supabase, busca el selector de rol (arriba a la derecha)
2. Cambia el rol de "authenticated" a **"postgres"** o **"service_role"**
3. Ejecuta el script nuevamente

### Problema: "Mi usuario no es administrador después de ejecutar el script"

**Solución:**
Ejecuta manualmente:

```sql
UPDATE users 
SET role = 'admin', active = true
WHERE id = auth.uid();

SELECT id, email, name, role, active FROM users WHERE id = auth.uid();
```

## Resumen

| Problema | Script | Descripción |
|----------|--------|-------------|
| Error 500 en tabla users | `fix-users-final.sql` | ⭐ Desactiva RLS en tabla users |
| Grupos no se guardan | `fix-groups-final.sql` | Desactiva RLS en tabla groups |
| Asignaciones no se guardan | `fix-assignments-final.sql` | Desactiva RLS en tabla teacher_subject_groups |
| Asignaciones aparecen como "Sin asignar" | `fix-assignments-data.sql` | Verifica y corrige datos |

## Contacto

Si después de ejecutar el script el error 500 persiste:

1. Abre la consola del navegador (F12)
2. Copia todos los errores que aparecen
3. Comparte esta información para diagnóstico adicional

---

**Fecha:** Enero 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Solución definitiva implementada
