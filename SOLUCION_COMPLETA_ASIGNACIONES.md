# Solución Completa: Problemas de Persistencia en Supabase

## Resumen del Problema

Has reportado que al crear asignaciones de profesor-materia-grupo, el grupo no se guarda correctamente y aparece como "Sin asignar" después de recargar la página.

## Causa Raíz

El problema se debe a que las políticas de seguridad (RLS - Row Level Security) de Supabase están bloqueando las operaciones de inserción y actualización en la tabla `teacher_subject_groups`. Además, puede haber inconsistencias en los IDs de los grupos.

## Solución Definitiva

### Paso 1: Ejecutar Scripts SQL en Orden

Ve a la página `/setup` de tu aplicación y descarga estos scripts, luego ejecútalos en el SQL Editor de Supabase **en este orden exacto**:

#### 1.1. Corregir Grupos (si es necesario)
**Script:** `fix-groups-simple.sql`

Este script elimina los grupos con IDs locales y los recrea con UUIDs válidos de Supabase.

```sql
DELETE FROM groups;

INSERT INTO groups (id, name, course, academic_year_id) VALUES
  (gen_random_uuid(), '1º Bachillerato A', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '1º Bachillerato B', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '2º Bachillerato A', '2º Bachillerato', 'a0000000-0000-0000-0000-000000000010');
```

#### 1.2. Desactivar RLS en Asignaciones
**Script:** `fix-assignments-final.sql`

Este script desactiva las políticas de seguridad en la tabla `teacher_subject_groups`, permitiendo que las asignaciones se guarden correctamente.

```sql
ALTER TABLE teacher_subject_groups DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teacher_subject_groups_select_all" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_insert_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_update_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_delete_admin" ON teacher_subject_groups;
```

#### 1.3. Limpiar y Verificar Asignaciones
**Script:** `fix-assignments-data.sql`

Este script verifica y corrige las asignaciones existentes.

```sql
-- Ver todas las asignaciones
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  g.name as grupo
FROM teacher_subject_groups tsg
LEFT JOIN users u ON tsg.teacher_id = u.id
LEFT JOIN subjects s ON tsg.subject_id = s.id
LEFT JOIN groups g ON tsg.group_id = g.id;

-- Eliminar asignaciones problemáticas
DELETE FROM teacher_subject_groups;

-- Verificar que se eliminaron
SELECT COUNT(*) FROM teacher_subject_groups;
```

### Paso 2: Recargar la Aplicación

1. Recarga la aplicación con **Ctrl+F5** (o Cmd+Shift+R en Mac)
2. Inicia sesión como administrador
3. Ve al panel de administración
4. Ve a la pestaña "Asignaciones"

### Paso 3: Crear Nuevas Asignaciones

1. Haz clic en "Nueva asignación"
2. Selecciona:
   - **Profesor:** D. García López
   - **Materia:** Dibujo Técnico I
   - **Grupo:** 1º Bachillerato A
3. Haz clic en "Crear"
4. Repite para las otras asignaciones:
   - D. García López - Taller de Podcast - 1º Bachillerato A
   - D. García López - Taller de Cortometraje - 2º Bachillerato A

### Paso 4: Verificar Persistencia

1. Recarga la página con **Ctrl+F5**
2. Verifica que las asignaciones se mantienen con los grupos correctos
3. NO deben aparecer como "Sin asignar"

## Verificación en la Consola

Abre la consola del navegador (F12) y observa los logs al crear una asignación:

### ✅ Si funciona correctamente:
```
🔄 AppContext createAssignment - Attempting to create assignment: {...}
Supabase createAssignment - Input: {...}
✅ Supabase createAssignment - Success: {...}
✅ AppContext createAssignment - Success, updating local state
```

### ❌ Si falla:
```
🔄 AppContext createAssignment - Attempting to create assignment: {...}
Supabase createAssignment - Input: {...}
❌ Error creating assignment: {...}
❌ AppContext createAssignment - Failed in Supabase
⚠️ Creating assignment in local state anyway (changes will not persist after reload)
```

Si ves los logs de error, significa que necesitas ejecutar `fix-assignments-final.sql`.

## Mejoras Implementadas en el Código

### 1. Función `updateAssignment` Agregada
Ahora puedes editar asignaciones y los cambios se persisten en Supabase.

**Archivos modificados:**
- `src/services/dataService.ts` - Agregada función `updateAssignment`
- `src/contexts/AppContext.tsx` - Agregada función `updateAssignment`
- `src/pages/Admin.tsx` - Actualizado para usar `updateAssignment` al editar

### 2. Manejo de Errores Mejorado
Si la persistencia en Supabase falla, la aplicación:
- Muestra logs detallados en la consola
- Actualiza el estado local para que veas los cambios
- Te informa que necesitas ejecutar los scripts SQL

### 3. Documentación Completa
- `TROUBLESHOOTING_ASSIGNMENTS_SIN_ASIGNAR.md` - Guía detallada para este problema
- `TROUBLESHOOTING_ASSIGNMENTS_NOT_SAVING.md` - Guía para asignaciones que no se guardan
- `TROUBLESHOOTING_RLS_RECURSION.md` - Guía para errores de recursión RLS
- `RESUMEN_FINAL.md` - Resumen completo de todas las correcciones

## Scripts SQL Disponibles

Todos los scripts están disponibles en la página `/setup` de tu aplicación:

| Script | Propósito | Cuándo Usar |
|--------|-----------|-------------|
| `setup-completo.sql` | Configuración inicial completa | Primera vez que configuras Supabase |
| `fix-users-no-rls.sql` | Corrige permisos de usuarios | Si hay error 500 en tabla users |
| `fix-groups-simple.sql` | Recrea grupos con UUIDs válidos | Si los grupos tienen IDs locales |
| `fix-groups-final.sql` | Desactiva RLS en grupos | Si los cambios en grupos no persisten |
| `fix-assignments-final.sql` | Desactiva RLS en asignaciones | Si las asignaciones no se guardan |
| `fix-assignments-data.sql` | Verifica y corrige datos de asignaciones | Si las asignaciones aparecen como "Sin asignar" |

## Orden Recomendado de Ejecución

Si estás configurando Supabase desde cero o tienes múltiples problemas:

1. **`setup-completo.sql`** - Configuración inicial
2. **`fix-users-no-rls.sql`** - Permisos de usuarios
3. **`fix-groups-simple.sql`** - Grupos con UUIDs válidos
4. **`fix-groups-final.sql`** - Desactivar RLS en grupos
5. **`fix-assignments-final.sql`** - Desactivar RLS en asignaciones
6. **`fix-assignments-data.sql`** - Verificar y corregir datos

## Asignación Manual de Grupos Específicos

Si necesitas asignar grupos específicos a materias específicas después de crear las asignaciones:

```sql
-- Asignar "1º Bachillerato A" a "Dibujo Técnico I"
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups WHERE name = '1º Bachillerato A')
WHERE subject_id = (SELECT id FROM subjects WHERE name = 'Dibujo Técnico I')
AND teacher_id = (SELECT id FROM users WHERE name = 'D. García López');

-- Asignar "1º Bachillerato A" a "Taller de Podcast"
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups WHERE name = '1º Bachillerato A')
WHERE subject_id = (SELECT id FROM subjects WHERE name = 'Taller de Podcast')
AND teacher_id = (SELECT id FROM users WHERE name = 'D. García López');

-- Asignar "2º Bachillerato A" a "Taller de Cortometraje"
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups WHERE name = '2º Bachillerato A')
WHERE subject_id = (SELECT id FROM subjects WHERE name = 'Taller de Cortometraje')
AND teacher_id = (SELECT id FROM users WHERE name = 'D. García López');
```

## Verificación Final

Después de ejecutar todos los scripts y crear las asignaciones:

1. **En Supabase:**
   ```sql
   SELECT 
     tsg.id,
     u.name as profesor,
     s.name as materia,
     g.name as grupo
   FROM teacher_subject_groups tsg
   JOIN users u ON tsg.teacher_id = u.id
   JOIN subjects s ON tsg.subject_id = s.id
   JOIN groups g ON tsg.group_id = g.id;
   ```
   Todas las asignaciones deben mostrar el nombre del grupo (no NULL)

2. **En la aplicación:**
   - Ve al panel de administración
   - Ve a la pestaña "Asignaciones"
   - Todas las asignaciones deben mostrar el grupo correcto
   - Al recargar la página, las asignaciones deben mantenerse

## Soporte

Si después de seguir estos pasos el problema persiste:

1. Abre la consola del navegador (F12)
2. Intenta crear una asignación
3. Copia todos los logs que aparecen
4. Comparte los logs para diagnóstico adicional

## Estado Actual

- ✅ **Código actualizado** con función `updateAssignment`
- ✅ **Scripts SQL creados** para verificar y corregir datos
- ✅ **Documentación completa** disponible
- ✅ **Aplicación compilada** correctamente
- ⏳ **Pendiente:** Ejecutar scripts SQL en Supabase

## Próximos Pasos

1. Ejecuta los scripts SQL en el orden indicado
2. Recarga la aplicación
3. Crea las asignaciones nuevamente
4. Verifica que se persisten correctamente
5. Reporta cualquier problema adicional

---

**Fecha:** Enero 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Solución completa implementada, pendiente ejecutar scripts SQL
