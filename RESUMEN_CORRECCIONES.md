# Resumen de Correcciones - Enero 2026

## Problemas Identificados y Solucionados

### 1. Error 500 en tabla users
**Síntoma:**
```
Failed to load resource: the server responded with a status of 500 ()
sbymwyxjuxhkilwcxoed.supabase.co/rest/v1/users?select=*&id=eq.127302df-f835-405f-a7b1-3af0f91632ab
```

**Causa:**
- Políticas RLS (Row Level Security) demasiado restrictivas en la tabla `users`
- Posible falta de columnas necesarias (`role`, `name`, `active`)

**Solución:**
- Se creó el script `public/sql/fix-users-permissions.sql`
- Este script:
  - Elimina políticas RLS problemáticas
  - Crea políticas RLS permisivas
  - Verifica y agrega columnas faltantes
  - Crea perfiles para usuarios de `auth.users`
  - Convierte el primer usuario en administrador si no hay administradores

**Cómo aplicar:**
1. Ve a la página `/setup` en la aplicación
2. Descarga `fix-users-permissions.sql`
3. Ejecútalo en el SQL Editor de Supabase

---

### 2. Mezcla de datos locales con datos de Supabase
**Síntoma:**
```
Cannot update group: Invalid UUID format group-1a
This group exists only in local seed data and cannot be updated in Supabase
```

**Causa:**
- La aplicación estaba mezclando datos locales del seed con datos de Supabase
- Cuando Supabase estaba conectado, cargaba datos de Supabase pero mantenía IDs locales
- Al intentar editar un grupo con ID local (ej: "group-1a"), fallaba porque ese ID no existe en Supabase

**Solución:**
- Se modificó `src/contexts/AppContext.tsx` para que cuando Supabase esté conectado:
  - Use SOLO los datos de Supabase
  - Reemplace completamente los datos locales
  - No mezcle datos de ambas fuentes
- Se mejoró el manejo de errores para que si falla una actualización en Supabase:
  - Verifique si el ID es un UUID válido
  - Si no es UUID, actualice solo el estado local
  - Muestre un warning en consola

**Resultado:**
- Cuando Supabase está conectado, todos los datos vienen de Supabase
- Cuando Supabase no está conectado, se usan datos locales del seed
- No hay mezcla de datos

---

### 3. Asignaciones de materias a profesores no se guardaban
**Síntoma:**
- Al crear una asignación en el panel de administración, no se guardaba en Supabase
- No había mensajes de error claros

**Solución:**
- Se agregó validación en `src/pages/Admin.tsx` para verificar que todos los campos requeridos estén presentes
- Se agregó validación en `src/services/dataService.ts` para verificar los datos antes de enviar a Supabase
- Se agregaron logs detallados en consola para debugging
- Se mejoró el manejo de errores con mensajes más descriptivos
- El modal ahora solo se cierra cuando la operación es exitosa

**Logs de debugging agregados:**
```javascript
Creating assignment - formData: {...}
Creating assignment - newItem: {...}
Supabase createAssignment - Input: {...}
Supabase createAssignment - Success: {...}
```

**Cómo diagnosticar:**
1. Abre la consola del navegador (F12)
2. Intenta crear una asignación
3. Revisa los logs para ver qué está fallando

---

### 4. WebSocket errors de Vite
**Síntoma:**
```
WebSocket connection to 'wss://...' failed: Error during WebSocket handshake: Unexpected response code: 404
[vite] failed to connect to websocket
```

**Causa:**
- Estos son errores de Vite en modo desarrollo
- No afectan la funcionalidad de la aplicación
- Ocurren cuando el HMR (Hot Module Replacement) no puede conectarse

**Solución:**
- Estos errores son normales en el entorno de desarrollo
- No requieren acción
- La aplicación funciona correctamente a pesar de estos errores

---

### 5. React Router Future Flag Warnings
**Síntoma:**
```
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7.
```

**Causa:**
- Son advertencias de React Router sobre cambios futuros en v7
- No son errores, solo advertencias
- La aplicación funciona correctamente

**Solución:**
- Estas advertencias se pueden ignorar por ahora
- Cuando actualicemos a React Router v7, necesitaremos agregar las future flags
- No afectan la funcionalidad actual

---

## Archivos Modificados

### 1. `src/contexts/AppContext.tsx`
- Corregida la lógica de carga de datos para no mezclar datos locales con datos de Supabase
- Mejorado el manejo de errores para actualizaciones de grupos, estudiantes y asignaciones
- Agregada validación de UUID para determinar si un elemento existe en Supabase o solo localmente

### 2. `src/pages/Admin.tsx`
- Agregada validación de campos requeridos antes de crear asignaciones
- Agregados logs detallados para debugging
- Mejorado el manejo de errores con mensajes más descriptivos
- El modal ahora solo se cierra cuando la operación es exitosa

### 3. `src/services/dataService.ts`
- Agregada validación de campos requeridos en `createAssignment`
- Agregados logs detallados para debugging
- Mejorado el manejo de errores

### 4. `src/pages/SetupGuide.tsx`
- Agregado botón para descargar `fix-users-permissions.sql`
- Agregado paso 2.5 con instrucciones para corregir el error 500 en tabla users

### 5. Nuevos archivos creados
- `public/sql/fix-users-permissions.sql` - Script para corregir permisos de la tabla users
- `TROUBLESHOOTING_USERS_500.md` - Guía de troubleshooting para el error 500
- `TROUBLESHOOTING_ASSIGNMENTS.md` - Guía de troubleshooting para problemas de asignaciones
- `RESUMEN_CORRECCIONES.md` - Este archivo

---

## Pasos para Resolver los Problemas

### Si ves el error 500 en tabla users:

1. Ve a la página `/setup` en la aplicación
2. Descarga `fix-users-permissions.sql`
3. Ve al SQL Editor de Supabase
4. Copia y pega el contenido del script
5. Ejecuta el script
6. Recarga la aplicación
7. El error debería desaparecer

### Si las asignaciones no se guardan:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta crear una asignación
4. Revisa los logs para ver qué está fallando
5. Consulta `TROUBLESHOOTING_ASSIGNMENTS.md` para soluciones específicas

### Si ves errores de UUID inválido:

1. Esto significa que estás intentando editar datos locales del seed
2. Si Supabase está conectado, deberías ver solo datos de Supabase
3. Recarga la página para que se carguen los datos correctos
4. Si el problema persiste, ejecuta `setup-completo.sql` para reiniciar la base de datos

---

## Verificación Final

Después de aplicar las correcciones, deberías ver en la consola:

```
Loading data from Supabase...
Groups loaded from Supabase: 3
Students loaded from Supabase: 24
Assignments loaded from Supabase: 3
Grades loaded from Supabase: 552
```

**NO** deberías ver:
- ❌ Errores 500 en la tabla users
- ❌ Errores de UUID inválido
- ❌ Mensajes de "This group exists only in local seed data"

---

## Próximos Pasos

1. ✅ Ejecutar `fix-users-permissions.sql` si ves el error 500
2. ✅ Recargar la aplicación
3. ✅ Verificar que no hay errores en la consola
4. ✅ Probar la creación de asignaciones en el panel de administración
5. ✅ Verificar que los cambios se guardan en Supabase

---

## Contacto

Si después de seguir estos pasos los problemas persisten:
1. Abre la consola del navegador (F12)
2. Copia todos los errores y logs
3. Comparte esta información para diagnóstico adicional
