# 🔴 Solución Rápida: Error de Permisos en Scripts SQL

## El Problema

Al ejecutar `fix-auth-complete.sql` recibiste este error:

```
ERROR: 42501: permission denied for table users
HINT: Grant the required privileges to the current role with: 
      GRANT SELECT ON auth.users TO authenticated;
```

## Causa

El script intenta acceder a la tabla `auth.users` pero tu rol actual en Supabase no tiene permisos suficientes.

## Solución en 2 Pasos

### Opción A: Otorgar Permisos (Recomendado si tienes permisos de admin)

#### Paso 1: Ejecutar grant-permissions.sql

1. Descarga **grant-permissions.sql** desde la página `/setup`
2. Ve al [SQL Editor de Supabase](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
3. Copia y pega TODO el contenido
4. Haz clic en **Run**

Este script otorga los permisos necesarios para acceder a `auth.users`.

#### Paso 2: Ejecutar fix-auth-complete.sql

1. Descarga **fix-auth-complete.sql** desde la página `/setup`
2. Copia y pega TODO el contenido en el SQL Editor
3. Haz clic en **Run**

Ahora debería funcionar sin errores de permisos.

---

### Opción B: Usar Script Alternativo (Si no tienes permisos de admin)

Si `grant-permissions.sql` también falla con "permission denied", usa este script alternativo que NO requiere acceso a `auth.users`:

#### Paso 1: Ejecutar fix-auth-simple.sql

1. Descarga **fix-auth-simple.sql** desde la página `/setup`
2. Ve al [SQL Editor de Supabase](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
3. Copia y pega TODO el contenido
4. Haz clic en **Run**

Este script crea los usuarios directamente en la tabla `users` sin verificar `auth.users`.

#### Paso 2: Crear Usuarios en Supabase Auth

1. Ve a [Authentication → Users](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/auth/users)
2. Crea estos usuarios:

**Administrador:**
```
Email: admin@ieslopedevega.es
Password: Admin2026!
✓ Auto Confirm User
```

**Profesor:**
```
Email: profesor@ieslopedevega.es
Password: Prof2026!
✓ Auto Confirm User
```

#### Paso 3: Recargar e Iniciar Sesión

1. Recarga la aplicación con **Ctrl+F5**
2. Inicia sesión con:
   - Email: `admin@ieslopedevega.es`
   - Password: `Admin2026!`

---

## ¿Cuál Opción Usar?

| Situación | Opción Recomendada |
|-----------|-------------------|
| Tienes permisos de administrador en Supabase | **Opción A** (grant-permissions.sql) |
| No tienes permisos de administrador | **Opción B** (fix-auth-simple.sql) |
| grant-permissions.sql falla | **Opción B** (fix-auth-simple.sql) |

---

## Scripts Disponibles

### grant-permissions.sql
- **Propósito**: Otorgar permisos para acceder a `auth.users`
- **Requiere**: Permisos de administrador
- **Úsalo cuando**: Puedes ejecutar GRANT en Supabase

### fix-auth-complete.sql
- **Propósito**: Configuración completa de autenticación
- **Requiere**: Acceso a `auth.users` (necesita grant-permissions.sql primero)
- **Úsalo cuando**: Ya ejecutaste grant-permissions.sql exitosamente

### fix-auth-simple.sql
- **Propósito**: Crear usuarios SIN acceso a `auth.users`
- **Requiere**: Solo acceso a la tabla `users`
- **Úsalo cuando**: No tienes permisos para acceder a `auth.users`

---

## Verificación

Después de ejecutar cualquiera de las opciones, verifica que los usuarios fueron creados:

```sql
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es');
```

Deberías ver 2 usuarios con roles `admin` y `teacher`.

---

## Si Todo Falla

Si ninguno de los scripts funciona debido a permisos:

1. **Usa el Modo Local**: La aplicación funciona inmediatamente sin Supabase
   - Email: `profesor@ieslopedevega.es`
   - Password: cualquier valor
   - Los datos NO se persisten, pero puedes usar la aplicación

2. **Contacta al Administrador de Supabase**: Pídele que ejecute los scripts con permisos adecuados

3. **Crea un Nuevo Proyecto de Supabase**: Si tienes permisos para crear proyectos, crea uno nuevo donde seas el propietario

---

## Estado Actual

- ✅ **grant-permissions.sql** creado y disponible
- ✅ **fix-auth-simple.sql** creado y disponible
- ✅ **Página /setup** actualizada con instrucciones claras
- ✅ **Aplicación compilada** correctamente
- ✅ **Modo Local** disponible como fallback

---

**Fecha**: Enero 2026  
**Versión**: 1.0.0  
**Estado**: ✅ Solución completa implementada
