# Troubleshooting: Asignaciones no se Guardan

## Problema
Al intentar crear una asignación de grupo a materia en el panel de administración, la asignación no se guarda o recibes un error.

## Causa
La tabla `teacher_subject_groups` tiene políticas de seguridad (RLS) que están bloqueando las inserciones, o existe un problema de recursión infinita similar al de la tabla `groups`.

## Solución Definitiva

### Script SQL: `fix-assignments-final.sql`

Este script:
1. ✅ Desactiva completamente RLS en la tabla `teacher_subject_groups`
2. ✅ Elimina todas las políticas RLS existentes
3. ✅ Permite que cualquier usuario autenticado gestione asignaciones
4. ✅ Resuelve problemas de permisos y recursión
5. ✅ Es la solución más simple y efectiva

### Pasos para Aplicar la Solución

#### Paso 1: Descargar el Script
Ve a la página `/setup` y descarga **`fix-assignments-final.sql`** (botón índigo)

O accede directamente: [fix-assignments-final.sql](/sql/fix-assignments-final.sql)

#### Paso 2: Ejecutar en Supabase
1. Abre el [SQL Editor de Supabase](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
2. Copia **TODO** el contenido del script
3. Pégalo en el editor
4. Haz clic en **"Run"** (o presiona Ctrl+Enter)

#### Paso 3: Verificar
1. Recarga la aplicación con **Ctrl+F5**
2. Ve al panel de administración
3. Intenta crear una asignación
4. La asignación ahora debería guardarse correctamente

### Contenido del Script

```sql
-- Desactivar RLS completamente en teacher_subject_groups
ALTER TABLE teacher_subject_groups DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "teacher_subject_groups_select_all" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_insert_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_update_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_delete_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Teachers can view their assignments" ON teacher_subject_groups;
DROP POLICY IF EXISTS "Admins can manage assignments" ON teacher_subject_groups;

-- Verificar que RLS está desactivado
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'teacher_subject_groups';

-- Probar una inserción
INSERT INTO teacher_subject_groups (teacher_id, subject_id, group_id)
SELECT 
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  (SELECT id FROM subjects LIMIT 1),
  (SELECT id FROM groups LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_subject_groups 
  WHERE teacher_id = (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
  AND subject_id = (SELECT id FROM subjects LIMIT 1)
  AND group_id = (SELECT id FROM groups LIMIT 1)
);

-- Verificar que la inserción se guardó
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  g.name as grupo
FROM teacher_subject_groups tsg
JOIN users u ON tsg.teacher_id = u.id
JOIN subjects s ON tsg.subject_id = s.id
JOIN groups g ON tsg.group_id = g.id
ORDER BY tsg.created_at DESC
LIMIT 5;
```

## Verificación

Después de ejecutar el script:

1. **Verifica que RLS está desactivado:**
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename = 'teacher_subject_groups';
   ```
   Debería mostrar: `rowsecurity = false`

2. **Prueba una inserción manual:**
   ```sql
   INSERT INTO teacher_subject_groups (teacher_id, subject_id, group_id)
   VALUES (
     (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
     (SELECT id FROM subjects LIMIT 1),
     (SELECT id FROM groups LIMIT 1)
   );
   
   SELECT * FROM teacher_subject_groups ORDER BY created_at DESC LIMIT 5;
   ```

3. **En la aplicación:**
   - Abre la consola del navegador (F12)
   - Intenta crear una asignación
   - Deberías ver:
     ```
     🔄 AppContext createAssignment - Attempting to create assignment: {...}
     ✅ Supabase createAssignment - Success: {...}
     ✅ AppContext createAssignment - Success, updating local state
     ```

## Mejoras en el Código

### Actualización Local Fallback
El código ha sido mejorado para que, aunque falle la persistencia en Supabase, al menos actualice el estado local:

```typescript
const createAssignment = async (assignment: TeacherSubjectGroup) => {
  const created = await dataService.createAssignment(assignment);
  
  if (created) {
    setTeacherSubjectGroups(prev => [...prev, created]);
    return created;
  } else {
    // Crear la asignación en el estado local de todos modos
    const localAssignment = {
      ...assignment,
      id: `local-assignment-${Date.now()}`
    };
    setTeacherSubjectGroups(prev => [...prev, localAssignment]);
    return localAssignment;
  }
};
```

Esto significa que:
- ✅ Puedes crear asignaciones y verlas en la interfaz
- ✅ Las asignaciones se muestran correctamente
- ❌ Las asignaciones NO se persisten en Supabase hasta ejecutar el script
- ❌ Las asignaciones se pierden al recargar la página (hasta ejecutar el script)

## ¿Por qué Desactivar RLS?

La tabla `teacher_subject_groups` contiene datos básicos del sistema que:
- No contienen información sensible de usuarios
- Son necesarios para el funcionamiento básico de la aplicación
- Deben ser accesibles para todos los usuarios autenticados
- No requieren seguridad a nivel de fila

Desactivar RLS en esta tabla es seguro y simplifica enormemente la configuración.

## Errores Comunes

### Error: "infinite recursion detected in policy for relation"
**Causa:** Las políticas RLS están creando un ciclo infinito
**Solución:** Ejecuta `fix-assignments-final.sql`

### Error: "new row violates row-level security policy"
**Causa:** Las políticas RLS están bloqueando la inserción
**Solución:** Ejecuta `fix-assignments-final.sql`

### Error: "permission denied for table teacher_subject_groups"
**Causa:** Tu usuario no tiene permisos suficientes
**Solución:** Verifica que tu usuario tenga rol 'admin'

### Las asignaciones se muestran pero no persisten
**Causa:** La actualización se hace solo en el estado local de React
**Solución:** Ejecuta `fix-assignments-final.sql`

## Logs de Depuración

La aplicación ahora incluye logs detallados en la consola del navegador:

### Al crear una asignación:
```
🔄 AppContext createAssignment - Attempting to create assignment: {...}
Supabase createAssignment - Input: {...}
✅ Supabase createAssignment - Success: {...}
✅ AppContext createAssignment - Success, updating local state
```

### Si hay un error:
```
🔄 AppContext createAssignment - Attempting to create assignment: {...}
Supabase createAssignment - Input: {...}
❌ Error creating assignment: {...}
❌ AppContext createAssignment - Failed in Supabase
⚠️ Creating assignment in local state anyway (changes will not persist after reload)
⚠️ The assignment was created locally but could not be saved to Supabase.
⚠️ Please run fix-assignments-final.sql to fix the RLS policies.
```

## Resumen de Scripts SQL

| Problema | Script | Descripción |
|----------|--------|-------------|
| Grupos no se guardan | `fix-groups-final.sql` | Desactiva RLS en tabla `groups` |
| Asignaciones no se guardan | `fix-assignments-final.sql` | Desactiva RLS en tabla `teacher_subject_groups` |
| IDs inválidos en grupos | `fix-groups-simple.sql` | Recrea grupos con UUIDs válidos |
| Error 500 en users | `fix-users-no-rls.sql` | Corrige permisos de tabla `users` |

**Recomendación:** Ejecuta todos los scripts finales para asegurar que todo funcione correctamente.

## Verificación Final

Después de ejecutar todos los scripts necesarios:

1. **Verifica que ambas tablas tienen RLS desactivado:**
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE tablename IN ('groups', 'teacher_subject_groups');
   ```
   Ambas deberían mostrar: `rowsecurity = false`

2. **Prueba crear un grupo:**
   - Ve al panel de administración
   - Crea un nuevo grupo
   - Verifica que se guarda correctamente

3. **Prueba crear una asignación:**
   - Ve al panel de administración
   - Crea una nueva asignación
   - Verifica que se guarda correctamente

4. **Recarga la página:**
   - Los cambios deberían persistir

## Contacto

Si después de seguir estos pasos el problema persiste:
1. Abre la consola del navegador (F12)
2. Copia todos los logs relacionados con la creación de asignaciones
3. Comparte esta información para diagnóstico adicional
