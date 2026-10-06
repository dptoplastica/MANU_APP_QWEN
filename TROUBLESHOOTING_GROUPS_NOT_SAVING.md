# Troubleshooting: Cambios en Grupos no se Guardan

## Problema
Cuando cambias el nombre de los grupos como administrador, los cambios no se persisten y se pierden al recargar la página.

## Causa
El problema ocurre cuando los grupos tienen IDs locales (como "group-1a") en lugar de UUIDs válidos de Supabase. La aplicación valida que los IDs sean UUIDs antes de intentar actualizar en Supabase, y si no lo son, los cambios se guardan solo en el estado local de React, perdiéndose al recargar.

## Diagnóstico

### Paso 1: Abrir la consola del navegador
1. Presiona F12 para abrir las herramientas de desarrollador
2. Ve a la pestaña "Console"

### Paso 2: Intentar editar un grupo
1. Ve al panel de administración
2. Intenta cambiar el nombre de un grupo
3. Observa los logs en la consola

### Paso 3: Analizar los logs

Deberías ver algo como:
```
Updating group: {id: "group-1a", name: "Nuevo Nombre", ...}
Supabase updateGroup - Input: {id: "group-1a", ...}
Cannot update group: Invalid UUID format group-1a
This group exists only in local seed data and cannot be updated in Supabase
Update group result: false
```

Si ves estos mensajes, el problema es que los grupos tienen IDs locales.

## Soluciones

### Solución 1: Verificar que Supabase tiene grupos (RECOMENDADO)

Ejecuta esta consulta en el SQL Editor de Supabase:

```sql
SELECT id, name, course, academic_year_id FROM groups;
```

**Si no hay grupos:**
Ejecuta el script `setup-completo.sql` para crear los grupos con UUIDs válidos.

**Si hay grupos pero con IDs incorrectos:**
Elimina los grupos y vuelve a crearlos:

```sql
-- Eliminar grupos existentes
DELETE FROM groups;

-- Crear grupos con UUIDs válidos
INSERT INTO groups (id, name, course, academic_year_id) VALUES
  (gen_random_uuid(), '1º Bachillerato A', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '1º Bachillerato B', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '2º Bachillerato A', '2º Bachillerato', 'a0000000-0000-0000-0000-000000000010');
```

### Solución 2: Recargar la aplicación

Después de ejecutar las consultas SQL:
1. Cierra sesión en la aplicación
2. Recarga la página (Ctrl+F5)
3. Inicia sesión nuevamente
4. Verifica en la consola que los grupos se carguen desde Supabase:
   ```
   Loading data from Supabase...
   Supabase getGroups - Success: 3 groups loaded
   Groups loaded from Supabase: 3
   ```

### Solución 3: Verificar logs de carga

En la consola del navegador, deberías ver:
```
Loading data from Supabase...
Supabase getGroups - Loading groups...
Supabase getGroups - Success: 3 groups loaded
Supabase getGroups - Mapped groups: [{id: "uuid-valido-1", ...}, ...]
Groups loaded from Supabase: 3
```

Si ves:
```
Supabase getGroups - No groups found in database
Falling back to local seed data
```

Significa que Supabase no tiene grupos y está usando datos locales. Ejecuta la Solución 1.

## Verificación Final

Después de aplicar la solución:

1. **Verificar en Supabase:**
   ```sql
   SELECT id, name, course FROM groups;
   ```
   Los IDs deben ser UUIDs válidos (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

2. **Verificar en la aplicación:**
   - Abre la consola del navegador
   - Recarga la página
   - Deberías ver los logs de carga desde Supabase
   - Intenta editar un grupo
   - Deberías ver: `Supabase updateGroup - Success: [...]`
   - Recarga la página
   - El cambio debe persistir

## Problemas Comunes

### Error: "Cannot update group: Invalid UUID format"
**Causa:** Los grupos tienen IDs locales en lugar de UUIDs
**Solución:** Ejecuta la Solución 1 para recrear los grupos con UUIDs válidos

### Error: "Supabase getGroups - No groups found in database"
**Causa:** Supabase no tiene grupos
**Solución:** Ejecuta `setup-completo.sql` o la consulta SQL de la Solución 1

### Los cambios se pierden al recargar
**Causa:** Los cambios se guardan solo en el estado local de React
**Solución:** Verifica que los grupos tengan UUIDs válidos (Solución 1)

## Logs de Depuración

La aplicación ahora incluye logs detallados:

### Al cargar grupos:
```
Supabase getGroups - Loading groups...
Supabase getGroups - Success: X groups loaded
Supabase getGroups - Mapped groups: [...]
```

### Al actualizar un grupo:
```
Updating group: {id: "...", name: "...", ...}
Supabase updateGroup - Input: {id: "...", ...}
Supabase updateGroup - Success: [...]
Update group result: true
```

### Si hay un error:
```
Supabase getGroups - Error: {...}
Falling back to local seed data
```
o
```
Cannot update group: Invalid UUID format group-1a
This group exists only in local seed data and cannot be updated in Supabase
Update group result: false
```

## Contacto

Si después de seguir estos pasos el problema persiste:
1. Abre la consola del navegador (F12)
2. Copia todos los logs relacionados con grupos
3. Comparte esta información para diagnóstico adicional
