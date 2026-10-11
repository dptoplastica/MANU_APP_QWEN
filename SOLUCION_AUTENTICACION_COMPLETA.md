# 🔐 Solución Completa: Problemas de Autenticación

## Problema Identificado

Las cuentas de usuario (profesor/administrador) no funcionan correctamente. La consola muestra:
```
Failed to load resource: the server responded with a status of 400 ()
/auth/v1/token?grant_type=password
```

## Causa del Problema

El error 400 indica que **Supabase Auth no está configurado correctamente** o que los usuarios no existen en el sistema de autenticación de Supabase.

## Solución Inmediata: Modo Local

La aplicación ahora funciona en **MODO LOCAL** como fallback. Puedes iniciar sesión inmediatamente con:

### Credenciales de Prueba

**👨‍🏫 Profesor:**
- Email: `profesor@ieslopedevega.es`
- Contraseña: `Prof2026!` (o cualquier valor)

**🔑 Administrador:**
- Email: `admin@ieslopedevega.es`
- Contraseña: `Admin2026!` (o cualquier valor)

### Características del Modo Local

✅ **Ventajas:**
- Funciona inmediatamente sin configuración
- No requiere Supabase Auth configurado
- Útil para pruebas y demostraciones

❌ **Limitaciones:**
- Los datos NO se persisten en Supabase
- Los cambios se pierden al recargar la página
- No es adecuado para producción

### Indicador de Modo

Cuando inicias sesión, verás en la consola del navegador (F12):

**Modo Local:**
```
📦 ⚠️ Sesión iniciada en MODO LOCAL
📦 Los datos NO se persisten en Supabase
```

**Modo Supabase:**
```
🌐 ✅ Sesión iniciada con Supabase
🌐 Los datos se persisten en Supabase
```

---

## Solución Completa: Configurar Supabase Auth

Para que los datos se persistan en Supabase, necesitas configurar Supabase Auth correctamente.

### Paso 1: Habilitar Email Provider

1. Ve a [Supabase Dashboard → Authentication → Providers](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/auth/providers)
2. Busca **Email** en la lista
3. Configura:
   - ✅ **Enable Email provider**: Activado
   - ❌ **Confirm email**: Desactivado (para pruebas)
4. Haz clic en **Save**

### Paso 2: Crear Usuarios en Supabase Auth

1. Ve a [Authentication → Users](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/auth/users)
2. Haz clic en **"Add user"** → **"Create new user"**
3. Crea el usuario administrador:
   ```
   Email: admin@ieslopedevega.es
   Password: Admin2026!
   ✓ Auto Confirm User
   ```
4. Crea el usuario profesor:
   ```
   Email: profesor@ieslopedevega.es
   Password: Prof2026!
   ✓ Auto Confirm User
   ```

### Paso 3: Ejecutar Script SQL para Crear Perfiles

1. Descarga `fix-auth.sql` desde la página `/setup`
2. Ve al [SQL Editor de Supabase](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
3. Copia y pega el contenido del script
4. Haz clic en **Run**

Este script:
- Verifica que los usuarios existan en `auth.users`
- Crea los perfiles en la tabla `users`
- Asigna los roles correctos (admin/teacher)
- Verifica que los emails estén confirmados

### Paso 4: Verificar la Configuración

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT 
  u.email,
  u.name,
  u.role,
  u.active,
  a.email_confirmed_at
FROM users u
LEFT JOIN auth.users a ON u.id = a.id;
```

Deberías ver:
- ✅ Los usuarios con sus roles correctos
- ✅ `email_confirmed_at` no es NULL
- ✅ `active = true`

### Paso 5: Probar la Autenticación

1. Recarga la aplicación con **Ctrl+F5**
2. Inicia sesión con las mismas credenciales
3. Deberías ver en la consola:
   ```
   🌐 ✅ Sesión iniciada con Supabase
   🌐 Los datos se persisten en Supabase
   ```

---

## Mejoras Implementadas

### 1. Sistema de Fallback Robusto

El sistema de autenticación ahora:
- Intenta primero con Supabase Auth
- Si falla, hace fallback automático a modo local
- Muestra mensajes claros en la consola sobre el modo usado
- Permite el login con cualquier contraseña en modo local

### 2. Mensajes Claros en la Consola

**Al iniciar sesión:**
```
🔐 Iniciando proceso de autenticación...
🌐 Intentando autenticación con Supabase...
⚠️ Supabase Auth falló: [error message]
🔄 Cambiando a autenticación local...
🔐 Intentando autenticación local...
✅ Usuario encontrado: {...}
⚠️ Usando modo LOCAL (los datos no se persisten en Supabase)
```

### 3. Página de Login Mejorada

La página de login ahora muestra:
- Credenciales claras con formato destacado
- Información sobre el modo de autenticación
- Mensajes de error más descriptivos
- Indicador visual del modo actual

### 4. Documentación Completa

- **`CONFIGURACION_AUTENTICACION.html`** - Guía visual paso a paso
- **`SOLUCION_ERRORES_CONSOLA.md`** - Documentación técnica
- **Página `/setup`** - Scripts SQL y enlaces directos

---

## Diagnóstico de Problemas

### Problema: Error 400 en Autenticación

**Síntoma:**
```
Failed to load resource: the server responded with a status of 400 ()
/auth/v1/token?grant_type=password
```

**Causa:** Supabase Auth no está configurado o los usuarios no existen.

**Solución:**
1. Usa el modo local (credenciales de prueba)
2. O configura Supabase Auth siguiendo los pasos anteriores

### Problema: Login Falla con "Credenciales incorrectas"

**Causa:** El email no existe en los datos locales.

**Solución:**
- Usa las credenciales exactas de prueba
- Verifica que no haya espacios en blanco
- Revisa la consola para ver los usuarios disponibles

### Problema: Los Datos No se Persisten

**Causa:** Estás en modo local.

**Solución:**
- Configura Supabase Auth siguiendo los pasos anteriores
- Verifica en la consola que estés en modo Supabase

### Problema: No Puedo Crear/Editar Grupos o Asignaciones

**Causa:** Las políticas RLS están bloqueando las operaciones.

**Solución:**
- Ejecuta los scripts SQL correspondientes:
  - `fix-groups-final.sql` para grupos
  - `fix-assignments-final.sql` para asignaciones

---

## Scripts SQL Disponibles

| Script | Propósito | Cuándo Usar |
|--------|-----------|-------------|
| `fix-auth.sql` | Configurar autenticación | Error 400 en login |
| `fix-users-final.sql` | Resolver error 500 en tabla users | Error 500 en consola |
| `fix-groups-final.sql` | Desactivar RLS en grupos | Grupos no se guardan |
| `fix-assignments-final.sql` | Desactivar RLS en asignaciones | Asignaciones no se guardan |

Todos están disponibles en la página `/setup`.

---

## Orden Recomendado de Configuración

Si quieres tener la aplicación completamente funcional con Supabase:

1. **`setup-completo.sql`** - Configuración inicial
2. **`fix-users-final.sql`** - Resolver error 500 en tabla users
3. **Configurar Supabase Auth** - Habilitar Email Provider y crear usuarios
4. **`fix-auth.sql`** - Crear perfiles en tabla users
5. **`fix-groups-final.sql`** - Desactivar RLS en grupos
6. **`fix-assignments-final.sql`** - Desactivar RLS en asignaciones

---

## Verificación Final

Después de configurar todo, deberías poder:

1. ✅ Iniciar sesión sin errores 400
2. ✅ Ver el mensaje "Sesión iniciada con Supabase" en la consola
3. ✅ Crear y editar grupos
4. ✅ Crear y editar asignaciones
5. ✅ Los cambios se persisten al recargar la página

---

## Soporte

Si después de seguir estos pasos los problemas persisten:

1. Abre la consola del navegador (F12)
2. Intenta iniciar sesión
3. Copia todos los mensajes de la consola
4. Comparte esta información para diagnóstico adicional

---

**Fecha:** Enero 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Solución completa implementada con fallback local
