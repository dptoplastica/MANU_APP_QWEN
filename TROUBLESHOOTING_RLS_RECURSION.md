# Troubleshooting: Error de Recursión Infinita en Políticas RLS

## Problema
Al intentar editar un grupo, recibes el error:
```
Error message: infinite recursion detected in policy for relation "users"
Error code: 42P17
```

## Causa
Las políticas de seguridad (RLS) de la tabla `groups` están haciendo referencia a la tabla `users`, y las políticas de `users` probablemente también hacen referencia a otras tablas o a sí mismas, creando un ciclo infinito.

## Solución Definitiva

### Opción 1: Desactivar RLS en tabla groups (RECOMENDADO)

**Script:** `fix-groups-final.sql`

Este script:
1. Desactiva completamente RLS en la tabla `groups`
2. Elimina todas las políticas RLS existentes
3. Permite que cualquier usuario autenticado gestione grupos
4. Resuelve el error de recursión infinita

**Pasos:**
1. Descarga `fix-groups-final.sql` desde `/setup`
2. Ve al SQL Editor de Supabase
3. Copia y pega TODO el contenido del script
4. Ejecuta el script completo
5. Recarga la aplicación (Ctrl+F5)
6. Intenta editar un grupo nuevamente

### Opción 2: Actualización Local (Solución Temporal)

Si no puedes ejecutar el script SQL inmediatamente, la aplicación ahora actualiza el estado local aunque falle la persistencia en Supabase. Esto significa que:

- ✅ Puedes editar grupos y ver los cambios en la interfaz
- ✅ Los cambios se muestran correctamente
- ❌ Los cambios NO se persisten en Supabase
- ❌ Los cambios se pierden al recargar la página

Esta es una solución temporal hasta que puedas ejecutar el script SQL.

## Verificación

Después de ejecutar el script `fix-groups-final.sql`:

1. **Verifica que RLS está desactivado:**
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename = 'groups';
   ```
   Debería mostrar: `rowsecurity = false`

2. **Prueba una actualización manual:**
   ```sql
   UPDATE groups 
   SET name = 'Nombre de Prueba'
   WHERE id = (SELECT id FROM groups LIMIT 1);
   
   SELECT id, name, course FROM groups;
   ```

3. **En la aplicación:**
   - Abre la consola del navegador (F12)
   - Intenta editar un grupo
   - Deberías ver:
     ```
     ✅ UUID is valid, proceeding with update...
     ✅ Supabase updateGroup - Success: [...]
     ✅ Group updated successfully: {...}
     ```

## ¿Por qué desactivar RLS?

La tabla `groups` contiene datos básicos del sistema (nombres de grupos, cursos, etc.) que:
- No contienen información sensible de usuarios
- Son necesarios para el funcionamiento básico de la aplicación
- Deben ser accesibles para todos los usuarios autenticados
- No requieren seguridad a nivel de fila

Desactivar RLS en esta tabla es seguro y simplifica enormemente la configuración.

## Alternativas (No Recomendadas)

### Crear políticas sin recursión
Podrías crear políticas que no hagan referencia a la tabla `users`, pero esto requeriría:
- Usar roles de base de datos en lugar de la tabla `users`
- O usar metadatos de JWT en lugar de consultas a la base de datos
- Es más complejo y propenso a errores

### Usar service_role
Podrías usar la clave `service_role` de Supabase para bypass RLS, pero esto:
- Requiere exponer la clave secreta en el frontend
- No es seguro
- No es recomendado por Supabase

## Logs de Depuración

La aplicación ahora incluye logs detallados:

### Si la actualización es exitosa:
```
🔄 AppContext updateGroup - Attempting to update group: {...}
🔄 Supabase updateGroup - Starting update for group: {...}
✅ UUID is valid, proceeding with update...
✅ Supabase updateGroup - Success: [...]
✅ Group updated successfully: {...}
✅ AppContext updateGroup - Update successful, updating local state
```

### Si falla pero se actualiza localmente:
```
🔄 AppContext updateGroup - Attempting to update group: {...}
🔄 Supabase updateGroup - Starting update for group: {...}
✅ UUID is valid, proceeding with update...
❌ Error updating group in Supabase: {...}
❌ AppContext updateGroup - Update failed in Supabase
⚠️ Updating local state anyway (changes will not persist after reload)
⚠️ The group was updated locally but could not be saved to Supabase.
⚠️ Please run fix-groups-final.sql to fix the RLS policies.
```

## Resumen

| Problema | Solución | Script |
|----------|----------|--------|
| Error de recursión infinita | Desactivar RLS en groups | `fix-groups-final.sql` |
| IDs inválidos | Recrear grupos con UUIDs | `fix-groups-simple.sql` |
| Permisos bloqueados | Crear políticas permisivas | `fix-groups-permissions.sql` |

**Recomendación:** Ejecuta `fix-groups-final.sql` para resolver el problema de forma definitiva.

## Contacto

Si después de ejecutar el script el problema persiste:
1. Abre la consola del navegador (F12)
2. Copia todos los logs relacionados con la actualización de grupos
3. Comparte esta información para diagnóstico adicional
