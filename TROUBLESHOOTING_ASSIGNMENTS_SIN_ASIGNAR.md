# Troubleshooting: Asignaciones Aparecen como "Sin asignar"

## Problema
Después de crear asignaciones de profesor-materia-grupo, al recargar la página aparecen como "Sin asignar" en la columna de grupo.

## Causa
Este problema ocurre por una de las siguientes razones:

1. **Las asignaciones se guardaron con `group_id` NULL en Supabase**
   - Esto sucede si el script `fix-assignments-final.sql` no se ejecutó correctamente
   - O si las políticas RLS estaban bloqueando la inserción del `group_id`

2. **Los IDs de grupos no coinciden**
   - Las asignaciones tienen `group_id` con UUIDs de Supabase
   - Pero la aplicación está buscando grupos con IDs locales (como "group-1a")
   - Esto sucede si no se ejecutó `fix-groups-simple.sql` primero

3. **Las asignaciones se crearon localmente pero no se persistieron**
   - Si `fix-assignments-final.sql` no se ejecutó, las asignaciones se crean solo en el estado local
   - Al recargar, se pierden porque no están en Supabase

## Solución Completa

### Paso 1: Ejecutar Scripts en Orden

Ejecuta estos scripts en el SQL Editor de Supabase **en este orden exacto**:

#### 1.1. Corregir Grupos (si no lo has hecho)
```sql
-- fix-groups-simple.sql
DELETE FROM groups;

INSERT INTO groups (id, name, course, academic_year_id) VALUES
  (gen_random_uuid(), '1º Bachillerato A', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '1º Bachillerato B', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '2º Bachillerato A', '2º Bachillerato', 'a0000000-0000-0000-0000-000000000010');
```

#### 1.2. Desactivar RLS en Asignaciones
```sql
-- fix-assignments-final.sql
ALTER TABLE teacher_subject_groups DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "teacher_subject_groups_select_all" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_insert_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_update_admin" ON teacher_subject_groups;
DROP POLICY IF EXISTS "teacher_subject_groups_delete_admin" ON teacher_subject_groups;
```

#### 1.3. Verificar y Corregir Datos de Asignaciones
```sql
-- fix-assignments-data.sql

-- Ver todas las asignaciones actuales
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  g.name as grupo,
  tsg.teacher_id,
  tsg.subject_id,
  tsg.group_id
FROM teacher_subject_groups tsg
LEFT JOIN users u ON tsg.teacher_id = u.id
LEFT JOIN subjects s ON tsg.subject_id = s.id
LEFT JOIN groups g ON tsg.group_id = g.id
ORDER BY tsg.created_at DESC;

-- Ver asignaciones con grupo NULL o inválido
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  tsg.group_id,
  CASE 
    WHEN tsg.group_id IS NULL THEN 'Grupo NULL'
    WHEN g.id IS NULL THEN 'Grupo no existe'
    ELSE 'Grupo válido'
  END as estado_grupo
FROM teacher_subject_groups tsg
LEFT JOIN users u ON tsg.teacher_id = u.id
LEFT JOIN subjects s ON tsg.subject_id = s.id
LEFT JOIN groups g ON tsg.group_id = g.id
WHERE tsg.group_id IS NULL OR g.id IS NULL;

-- Actualizar asignaciones con grupo NULL
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups LIMIT 1)
WHERE group_id IS NULL;

-- Verificar que todas las asignaciones tienen grupo
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  g.name as grupo,
  CASE 
    WHEN g.id IS NULL THEN '❌ Sin grupo'
    ELSE '✅ Con grupo'
  END as estado
FROM teacher_subject_groups tsg
LEFT JOIN users u ON tsg.teacher_id = u.id
LEFT JOIN subjects s ON tsg.subject_id = s.id
LEFT JOIN groups g ON tsg.group_id = g.id
ORDER BY tsg.created_at DESC;
```

### Paso 2: Eliminar Asignaciones Incorrectas

Si las asignaciones existentes tienen problemas, elimínalas y créalas de nuevo:

```sql
-- Eliminar todas las asignaciones existentes
DELETE FROM teacher_subject_groups;

-- Verificar que se eliminaron
SELECT COUNT(*) FROM teacher_subject_groups;
-- Debería retornar 0
```

### Paso 3: Recargar la Aplicación

1. Recarga la aplicación con **Ctrl+F5**
2. Ve al panel de administración
3. Ve a la pestaña "Asignaciones"
4. Crea nuevas asignaciones seleccionando profesor, materia y grupo
5. Recarga la página nuevamente
6. Verifica que las asignaciones se mantienen con el grupo correcto

### Paso 4: Asignar Grupos Específicos Manualmente (Opcional)

Si necesitas asignar grupos específicos a materias específicas:

```sql
-- Asignar "1º Bachillerato A" a "Dibujo Técnico I" para "D. García López"
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups WHERE name = '1º Bachillerato A')
WHERE subject_id = (SELECT id FROM subjects WHERE name = 'Dibujo Técnico I')
AND teacher_id = (SELECT id FROM users WHERE name = 'D. García López');

-- Asignar "1º Bachillerato A" a "Taller de Podcast" para "D. García López"
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups WHERE name = '1º Bachillerato A')
WHERE subject_id = (SELECT id FROM subjects WHERE name = 'Taller de Podcast')
AND teacher_id = (SELECT id FROM users WHERE name = 'D. García López');

-- Asignar "2º Bachillerato A" a "Taller de Cortometraje" para "D. García López"
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups WHERE name = '2º Bachillerato A')
WHERE subject_id = (SELECT id FROM subjects WHERE name = 'Taller de Cortometraje')
AND teacher_id = (SELECT id FROM users WHERE name = 'D. García López');
```

## Verificación Final

Después de ejecutar todos los scripts:

1. **Verifica que los grupos tienen UUIDs válidos:**
   ```sql
   SELECT id, name FROM groups;
   ```
   Todos los IDs deben ser UUIDs de 36 caracteres (ej: `69b4242f-4512-4640-bef9-68d3afc109d3`)

2. **Verifica que las asignaciones tienen grupos válidos:**
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
   Todas las asignaciones deben mostrar el nombre del grupo (no "NULL")

3. **En la aplicación:**
   - Ve al panel de administración
   - Ve a la pestaña "Asignaciones"
   - Todas las asignaciones deben mostrar el grupo correcto
   - Al recargar la página, las asignaciones deben mantenerse

## Diagnóstico en la Consola

Abre la consola del navegador (F12) y observa los logs al crear una asignación:

### Si funciona correctamente:
```
🔄 AppContext createAssignment - Attempting to create assignment: {...}
Supabase createAssignment - Input: {...}
✅ Supabase createAssignment - Success: {...}
✅ AppContext createAssignment - Success, updating local state
```

### Si falla:
```
🔄 AppContext createAssignment - Attempting to create assignment: {...}
Supabase createAssignment - Input: {...}
❌ Error creating assignment: {...}
❌ AppContext createAssignment - Failed in Supabase
⚠️ Creating assignment in local state anyway (changes will not persist after reload)
⚠️ The assignment was created locally but could not be saved to Supabase.
⚠️ Please run fix-assignments-final.sql to fix the RLS policies.
```

Si ves los logs de error, significa que necesitas ejecutar `fix-assignments-final.sql`.

## Problemas Comunes

### Problema: "El grupo aparece como 'Sin asignar' después de recargar"
**Causa:** La asignación se guardó con `group_id` NULL o con un ID de grupo inválido
**Solución:** Ejecuta `fix-assignments-data.sql` para corregir los datos

### Problema: "Las asignaciones desaparecen al recargar"
**Causa:** Las asignaciones se crearon localmente pero no se persistieron en Supabase
**Solución:** Ejecuta `fix-assignments-final.sql` para desactivar RLS

### Problema: "No puedo crear nuevas asignaciones"
**Causa:** Las políticas RLS están bloqueando las inserciones
**Solución:** Ejecuta `fix-assignments-final.sql`

### Problema: "El grupo no aparece en el selector"
**Causa:** Los grupos tienen IDs locales en lugar de UUIDs de Supabase
**Solución:** Ejecuta `fix-groups-simple.sql`

## Scripts SQL Disponibles

| Script | Propósito | Cuándo Usar |
|--------|-----------|-------------|
| `fix-groups-simple.sql` | Recrea grupos con UUIDs válidos | Si los grupos tienen IDs locales |
| `fix-assignments-final.sql` | Desactiva RLS en asignaciones | Si las asignaciones no se guardan |
| `fix-assignments-data.sql` | Verifica y corrige datos de asignaciones | Si las asignaciones aparecen como "Sin asignar" |

**Orden recomendado de ejecución:**
1. `fix-groups-simple.sql` (si es necesario)
2. `fix-assignments-final.sql`
3. `fix-assignments-data.sql`

## Contacto

Si después de seguir estos pasos el problema persiste:
1. Abre la consola del navegador (F12)
2. Copia todos los logs relacionados con la creación de asignaciones
3. Comparte esta información para diagnóstico adicional
