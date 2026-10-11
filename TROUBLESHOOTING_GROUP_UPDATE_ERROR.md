# Troubleshooting: Error al Actualizar Grupos

## Problema
Al intentar editar un grupo en el panel de administración, recibes el error:
```
Error al actualizar el grupo. Verifica la consola del navegador para más detalles.
```

## Causa
Este error ocurre porque las políticas de seguridad (RLS - Row Level Security) de Supabase están bloqueando las operaciones de actualización en la tabla `groups`, o tu usuario no tiene el rol de administrador.

## Solución Rápida

### Paso 1: Ejecutar el script de diagnóstico y corrección

1. Ve a la página `/setup` en tu aplicación
2. Descarga el script **`fix-groups-permissions.sql`** (botón rojo)
3. Ve al SQL Editor de Supabase: https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new
4. Copia y pega TODO el contenido del script
5. Ejecuta el script completo

### Paso 2: Verificar tu rol de usuario

El script te mostrará tu usuario actual y su rol. Si no eres administrador, ejecuta:

```sql
UPDATE users 
SET role = 'admin', active = true
WHERE id = auth.uid();
```

### Paso 3: Probar la actualización

1. Recarga la aplicación (Ctrl+F5)
2. Ve al panel de administración
3. Intenta editar un grupo
4. Los cambios ahora deberían guardarse correctamente

## ¿Qué hace el script?

El script `fix-groups-permissions.sql` realiza las siguientes acciones:

1. **Diagnóstico:**
   - Verifica la estructura de la tabla `groups`
   - Muestra las políticas RLS actuales
   - Verifica tu usuario y su rol
   - Lista todos los grupos existentes

2. **Corrección:**
   - Elimina políticas RLS restrictivas
   - Crea nuevas políticas permisivas:
     - `groups_select_authenticated`: Todos los usuarios autenticados pueden VER grupos
     - `groups_insert_admin`: Solo administradores pueden INSERTAR grupos
     - `groups_update_admin`: Solo administradores pueden ACTUALIZAR grupos
     - `groups_delete_admin`: Solo administradores pueden ELIMINAR grupos

3. **Verificación:**
   - Muestra las nuevas políticas creadas
   - Te permite probar una actualización manualmente

## Diagnóstico Manual

Si prefieres diagnosticar el problema manualmente, ejecuta estas consultas en el SQL Editor:

### 1. Verificar tu usuario y rol
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
- `role` debe ser `'admin'`
- `active` debe ser `true`

### 2. Ver políticas RLS de groups
```sql
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'groups';
```

**Políticas esperadas:**
- `groups_select_authenticated` (SELECT)
- `groups_insert_admin` (INSERT)
- `groups_update_admin` (UPDATE)
- `groups_delete_admin` (DELETE)

### 3. Probar actualización manual
```sql
-- Intentar actualizar un grupo
UPDATE groups 
SET name = 'Nombre de Prueba'
WHERE id = (SELECT id FROM groups LIMIT 1);

-- Verificar el resultado
SELECT id, name, course FROM groups LIMIT 5;
```

Si esta consulta falla con un error de permisos, el problema es de políticas RLS.

## Errores Comunes

### Error: "new row violates row-level security policy"
**Causa:** Las políticas RLS están bloqueando la operación
**Solución:** Ejecuta `fix-groups-permissions.sql`

### Error: "permission denied for table groups"
**Causa:** Tu usuario no tiene permisos suficientes
**Solución:** Verifica que tu usuario tenga rol 'admin'

### Error: "Could not find the 'updated_at' column"
**Causa:** El código intenta actualizar una columna que no existe
**Solución:** Este error ya fue corregido en el código. Recarga la aplicación (Ctrl+F5)

## Verificación Final

Después de aplicar la solución:

1. **Recarga la aplicación** (Ctrl+F5)
2. **Abre la consola del navegador** (F12)
3. **Ve al panel de administración**
4. **Edita un grupo** (cambia el nombre)
5. **Observa los logs** en la consola:

**Logs esperados (éxito):**
```
🔄 AppContext updateGroup - Attempting to update group: {...}
🔄 Supabase updateGroup - Starting update for group: {...}
✅ UUID is valid, proceeding with update...
✅ Supabase updateGroup - Success: [...]
✅ Group updated successfully: {...}
✅ AppContext updateGroup - Update successful, updating local state
```

6. **Recarga la página**
7. **Verifica** que el cambio persistió

## Si el Problema Persiste

Si después de ejecutar el script el problema continúa:

1. **Verifica que ejecutaste TODO el script** (no solo una parte)
2. **Verifica que tu usuario es administrador:**
   ```sql
   SELECT role FROM users WHERE id = auth.uid();
   ```
3. **Verifica las políticas RLS:**
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'groups';
   ```
4. **Intenta actualizar manualmente:**
   ```sql
   UPDATE groups SET name = 'Test' WHERE id = (SELECT id FROM groups LIMIT 1);
   ```

## Contacto

Si después de seguir estos pasos el problema persiste:
1. Abre la consola del navegador (F12)
2. Copia todos los logs relacionados con la actualización de grupos
3. Comparte esta información para diagnóstico adicional

## Scripts Relacionados

- **`fix-groups-permissions.sql`** - Diagnóstico completo y corrección de permisos (RECOMENDADO)
- **`fix-groups-rls.sql`** - Solo corrige políticas RLS
- **`fix-groups-simple.sql`** - Solo corrige IDs inválidos

Si no estás seguro de cuál usar, ejecuta `fix-groups-permissions.sql` que incluye todas las correcciones necesarias.
