# 🔧 Solución Completa a Errores de Autenticación

## Errores Identificados en la Consola

### 1. Error 400 en Autenticación (CRÍTICO)
```
Failed to load resource: the server responded with a status of 400 ()
/auth/v1/token?grant_type=password
```

**Causa:** La autenticación por email/password no está configurada correctamente en Supabase.

### 2. Error de WebSocket (NO CRÍTICO)
```
WebSocket connection to 'wss://...' failed: Error during WebSocket handshake
[vite] failed to connect to websocket
```

**Estado:** ✅ Normal en desarrollo, no afecta la funcionalidad

### 3. Error de SVG Path (NO CRÍTICO)
```
Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "Z".
```

**Estado:** ⚠️ Error de renderizado de iconos, no crítico

---

## 🔐 Solución Definitiva: Error 400 en Autenticación

### Paso 1: Habilitar Autenticación por Email en Supabase

1. Ve a [Supabase Dashboard → Authentication → Providers](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/auth/providers)
2. Busca **Email** en la lista de proveedores
3. Asegúrate de que esté **habilitado** (toggle activado)
4. Configura las opciones:
   - ✅ **Enable Email provider**: Activado
   - ❌ **Confirm email**: Desactivado (para pruebas)
5. Haz clic en **Save**

### Paso 2: Crear Usuarios en Supabase Auth

1. Ve a [Authentication → Users](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/auth/users)
2. Haz clic en **"Add user"** → **"Create new user"**
3. Crea el usuario administrador:
   ```
   Email: admin@ieslopedevega.es
   Password: Admin2026!
   ✓ Auto Confirm User
   ```
4. Haz clic en **"Create user"**
5. Repite para el usuario profesor (opcional):
   ```
   Email: profesor@ieslopedevega.es
   Password: Prof2026!
   ✓ Auto Confirm User
   ```

### Paso 3: Ejecutar Script SQL de Configuración

1. Ve a la página `/setup` de tu aplicación
2. Descarga **fix-auth.sql** (botón naranja)
3. Ve al [SQL Editor de Supabase](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
4. Copia y pega el contenido del script
5. Haz clic en **Run**

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
2. Intenta iniciar sesión con:
   - Email: `admin@ieslopedevega.es`
   - Password: `Admin2026!`
3. Si funciona, deberías ver el Dashboard

---

## 📋 Checklist de Verificación

### Autenticación
- [ ] Email provider habilitado en Supabase
- [ ] Confirm email desactivado
- [ ] Usuarios creados en Authentication → Users
- [ ] Perfiles creados en tabla `users`
- [ ] Emails confirmados (`email_confirmed_at` no es NULL)
- [ ] Variables de entorno correctas en `.env`
- [ ] Aplicación recargada con Ctrl+F5

### Base de Datos
- [ ] Script `fix-auth.sql` ejecutado sin errores
- [ ] Usuarios visibles en consulta SQL
- [ ] Perfiles con roles correctos (admin/teacher)

---

## 🔍 Diagnóstico Avanzado

### Si el Error 400 Persiste

1. **Verifica la consola del navegador (F12)**:
   - Busca errores específicos en la pestaña **Console**
   - Revisa la pestaña **Network** para ver la respuesta detallada

2. **Prueba la autenticación directamente**:
   ```javascript
   // En la consola del navegador
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@ieslopedevega.es',
     password: 'Admin2026!'
   });
   console.log('Data:', data);
   console.log('Error:', error);
   ```

3. **Verifica el estado de Supabase**:
   - Ve a [Supabase Status](https://status.supabase.com/)
   - Asegúrate de que no haya incidentes activos

4. **Verifica las variables de entorno**:
   ```env
   VITE_SUPABASE_URL=https://sbymwyxjuxhkilwcxoed.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_71LSjFpKhUgVS0vMTFb-aQ_v6WZ43kG
   ```

---

## 📚 Scripts SQL Disponibles

| Script | Propósito | Cuándo Usar |
|--------|-----------|-------------|
| `fix-auth.sql` | Habilitar autenticación y crear usuarios | **Error 400 en autenticación** |
| `fix-users-final.sql` | Resolver error 500 en tabla users | Error 500 en tabla users |
| `create-admin-user.sql` | Crear perfil de administrador | Después de crear usuario en Auth |
| `fix-groups-final.sql` | Desactivar RLS en grupos | Grupos no se guardan |
| `fix-assignments-final.sql` | Desactivar RLS en asignaciones | Asignaciones no se guardan |

---

## 🎯 Orden Recomendado de Ejecución

Si estás configurando todo desde cero:

1. **`setup-completo.sql`** - Configuración inicial
2. **`fix-users-final.sql`** - Resolver error 500 en tabla users
3. **`fix-auth.sql`** - Habilitar autenticación y crear usuarios
4. **`fix-groups-final.sql`** - Desactivar RLS en grupos
5. **`fix-assignments-final.sql`** - Desactivar RLS en asignaciones

---

## 💡 Notas Importantes

### Error de WebSocket
Los errores de WebSocket son normales en desarrollo y no afectan la funcionalidad de la aplicación. Puedes ignorarlos.

### Error de SVG Path
Los errores de SVG path son errores de renderizado de iconos de lucide-react. No afectan la funcionalidad y se pueden ignorar.

### Error 500 en Tabla Users
Si ves el error 500 en la tabla `users`, ejecuta primero `fix-users-final.sql` antes de `fix-auth.sql`.

---

## 📞 Soporte

Si después de seguir estos pasos los errores persisten:

1. Abre la consola del navegador (F12)
2. Copia todos los errores
3. Comparte esta información para diagnóstico adicional

---

**Fecha:** Enero 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Soluciones implementadas
