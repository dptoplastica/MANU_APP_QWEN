# Troubleshooting: Grupos no se guardan al recargar

## Problema
Cuando modificas el nombre de los grupos en el panel de administración, los cambios se muestran correctamente en la interfaz, pero al recargar la página los cambios se pierden y vuelven a aparecer los nombres originales.

## Causas Posibles

### Causa 1: IDs inválidos
Los grupos tienen IDs locales (como "group-1a") en lugar de UUIDs válidos de Supabase. La aplicación detecta esto y actualiza solo el estado local de React, pero no puede persistir los cambios en Supabase.

**Síntomas en consola:**
```
Cannot update group: Invalid UUID format group-1a
This group exists only in local seed data and cannot be updated in Supabase
```

### Causa 2: Políticas RLS bloqueando actualizaciones
Las políticas de seguridad (Row Level Security) de Supabase están bloqueando las operaciones de UPDATE en la tabla `groups`, aunque los IDs sean UUIDs válidos.

**Síntomas en consola:**
```
✅ UUID is valid, proceeding with update...
❌ Error updating group in Supabase: {error details}
```
o
```
⚠️ Update returned no data. This might indicate:
  - The group ID does not exist in Supabase
  - RLS policies are blocking the update
  - The user does not have permission to update
```

## Soluciones

### Solución para Causa 1: IDs inválidos

**Script:** `fix-groups-simple.sql`

Este script:
1. Elimina todos los grupos existentes
2. Crea nuevos grupos con UUIDs válidos generados automáticamente
3. Mantiene los mismos nombres y cursos

**Pasos:**
1. Descarga `fix-groups-simple.sql` desde `/setup`
2. Ejecútalo en el SQL Editor de Supabase
3. Recarga la aplicación (Ctrl+F5)
4. Intenta editar un grupo nuevamente

### Solución para Causa 2: Políticas RLS

**Script:** `fix-groups-rls.sql`

Este script:
1. Verifica las políticas RLS actuales de la tabla `groups`
2. Elimina políticas restrictivas
3. Crea nuevas políticas permisivas que permiten a los administradores gestionar grupos
4. Verifica que tu usuario tenga rol de administrador

**Pasos:**
1. Descarga `fix-groups-rls.sql` desde `/setup`
2. Ejecútalo en el SQL Editor de Supabase
3. Verifica que las políticas se crearon correctamente
4. Recarga la aplicación (Ctrl+F5)
5. Intenta editar un grupo nuevamente

### Solución Recomendada: Ejecutar ambos scripts

Si no estás seguro de cuál es el problema, ejecuta ambos scripts en orden:

1. **Primero:** `fix-groups-simple.sql`
   - Esto asegura que todos los grupos tengan UUIDs válidos
   
2. **Segundo:** `fix-groups-rls.sql`
   - Esto asegura que las políticas RLS permitan las actualizaciones

3. **Recarga la aplicación** (Ctrl+F5)

4. **Prueba editar un grupo**
   - Abre la consola del navegador (F12)
   - Intenta cambiar el nombre de un grupo
   - Observa los mensajes en la consola

## Diagnóstico Detallado

### Paso 1: Verificar IDs de grupos en Supabase

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT 
  id,
  name,
  course,
  LENGTH(id::text) as id_length,
  CASE 
    WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN 'UUID válido'
    ELSE 'ID inválido'
  END as id_status
FROM groups;
```

**Resultado esperado:**
- Todos los IDs deben tener 36 caracteres
- Todos deben mostrar "UUID válido"

Si algún grupo muestra "ID inválido", ejecuta `fix-groups-simple.sql`.

### Paso 2: Verificar políticas RLS

Ejecuta esta consulta:

```sql
SELECT 
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'groups';
```

**Políticas esperadas:**
- `groups_select_all` (SELECT)
- `groups_insert_admin` (INSERT)
- `groups_update_admin` (UPDATE)
- `groups_delete_admin` (DELETE)

Si no ves estas políticas, ejecuta `fix-groups-rls.sql`.

### Paso 3: Verificar rol de usuario

Ejecuta esta consulta:

```sql
SELECT 
  id,
  email,
  name,
  role,
  active
FROM users
WHERE id = auth.uid();
```

**Resultado esperado:**
- El campo `role` debe ser `'admin'`
- El campo `active` debe ser `true`

Si tu usuario no es administrador, actualiza el rol:

```sql
UPDATE users 
SET role = 'admin' 
WHERE id = auth.uid();
```

### Paso 4: Probar actualización manual

Intenta actualizar un grupo directamente en SQL:

```sql
UPDATE groups 
SET name = 'Nombre de Prueba' 
WHERE id = (SELECT id FROM groups LIMIT 1);
```

Si esta consulta falla con un error de permisos, el problema es de políticas RLS. Ejecuta `fix-groups-rls.sql`.

## Logs de Depuración

La aplicación ahora incluye logs detallados en la consola del navegador:

### Al actualizar un grupo:
```
🔄 AppContext updateGroup - Attempting to update group: {id: "...", name: "...", ...}
🔄 Supabase updateGroup - Starting update for group: {id: "...", name: "...", ...}
✅ UUID is valid, proceeding with update...
✅ Supabase updateGroup - Success: [...]
✅ Group updated successfully: {...}
✅ AppContext updateGroup - Update successful, updating local state
```

### Si hay un error:
```
❌ Error updating group in Supabase: {error details}
❌ AppContext updateGroup - Update failed in Supabase
❌ Group ID is valid but update failed. This indicates:
  - RLS policies are blocking the update
  - User does not have admin role
  - Database connection issue
Please run fix-groups-rls.sql to fix RLS policies
```

## Verificación Final

Después de aplicar las soluciones:

1. **Recarga la aplicación** (Ctrl+F5)
2. **Abre la consola del navegador** (F12)
3. **Ve al panel de administración**
4. **Edita un grupo** (cambia el nombre)
5. **Observa los logs** en la consola
6. **Recarga la página**
7. **Verifica** que el cambio persistió

Si todo funciona correctamente, deberías ver logs de éxito y el cambio debe persistir después de recargar.

## Problemas Comunes

### Error: "new row violates row-level security policy"
**Causa:** Las políticas RLS están bloqueando la operación
**Solución:** Ejecuta `fix-groups-rls.sql`

### Error: "Cannot update group: Invalid UUID format"
**Causa:** Los grupos tienen IDs locales en lugar de UUIDs
**Solución:** Ejecuta `fix-groups-simple.sql`

### Los cambios se muestran pero no persisten
**Causa:** La actualización se hace solo en el estado local de React
**Solución:** Ejecuta ambos scripts en orden

### Error: "permission denied for table groups"
**Causa:** El usuario no tiene permisos suficientes
**Solución:** Verifica que tu usuario tenga rol 'admin' en la tabla `users`

## Contacto

Si después de seguir estos pasos el problema persiste:
1. Abre la consola del navegador (F12)
2. Copia todos los logs relacionados con la actualización de grupos
3. Comparte esta información para diagnóstico adicional
