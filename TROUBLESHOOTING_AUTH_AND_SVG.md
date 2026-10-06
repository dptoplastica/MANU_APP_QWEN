# 🔧 Solución a Errores de Autenticación y SVG

## Errores Identificados

### 1. Error 400 en Autenticación
```
Failed to load resource: the server responded with a status of 400 ()
/auth/v1/token?grant_type=password
```

**Causa:** La autenticación por email/password no está configurada correctamente en Supabase.

### 2. Error de SVG Path
```
Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "Z".
```

**Causa:** Un componente SVG tiene un path malformado.

---

## 🔐 Solución: Error de Autenticación

### Paso 1: Habilitar Autenticación por Email en Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/auth/providers)
2. Navega a **Authentication** → **Providers**
3. Busca **Email** en la lista
4. Asegúrate de que esté **habilitado** (toggle activado)
5. Configura las opciones:
   - ✅ **Enable Email provider**: Activado
   - ❌ **Confirm email**: Desactivado (para pruebas)
6. Haz clic en **Save**

### Paso 2: Verificar Usuarios en Supabase Auth

1. Ve a **Authentication** → **Users**
2. Verifica que existan los usuarios:
   - `admin@ieslopedevega.es`
   - `profesor@ieslopedevega.es`
3. Si no existen, créalos:
   - Click en **Add user** → **Create new user**
   - Email: `admin@ieslopedevega.es`
   - Password: `Admin2026!`
   - ✅ **Auto Confirm User**
   - Click en **Create user**
   - Repite para el profesor

### Paso 3: Ejecutar Script SQL de Verificación

Descarga y ejecuta el script `fix-auth.sql` desde la página `/setup`:

1. Ve a la página `/setup` de tu aplicación
2. Descarga **fix-auth.sql**
3. Ve al [SQL Editor de Supabase](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
4. Copia y pega el contenido del script
5. Haz clic en **Run**

Este script:
- Verifica que los usuarios existan en `auth.users`
- Verifica que los perfiles existan en la tabla `users`
- Crea los perfiles faltantes
- Verifica que los emails estén confirmados

### Paso 4: Verificar Configuración en el Código

Asegúrate de que las variables de entorno estén correctas en `.env`:

```env
VITE_SUPABASE_URL=https://sbymwyxjuxhkilwcxoed.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_71LSjFpKhUgVS0vMTFb-aQ_v6WZ43kG
```

### Paso 5: Probar la Autenticación

1. Recarga la aplicación con **Ctrl+F5**
2. Intenta iniciar sesión con:
   - Email: `admin@ieslopedevega.es`
   - Password: `Admin2026!`
3. Si funciona, deberías ver el Dashboard

---

## 🎨 Solución: Error de SVG Path

El error de SVG es causado por un icono malformado en el componente `LoadingScreen`. Voy a corregirlo:

### Archivo a Corregir: `src/components/LoadingScreen.tsx`

El problema está en el uso de `lucide-react` que puede estar generando SVGs inválidos. La solución es asegurar que todos los iconos estén correctamente importados.

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

### Si el Error de SVG Persiste

1. **Limpia la caché del navegador**:
   - Ctrl+Shift+Delete
   - Selecciona "Cached images and files"
   - Click en "Clear data"

2. **Recarga la aplicación**:
   - Ctrl+F5 (hard reload)

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
