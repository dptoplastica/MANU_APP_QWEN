# Solución al Error de UUID Inválido

## Problema Identificado

El error en la consola muestra:
```
Error updating group: invalid input syntax for type uuid: "group-1a"
```

### Causa Raíz

Los datos iniciales (seed) usan IDs simples como:
- `"group-1a"` 
- `"student-1"`
- `"sub-dt1"`

Pero Supabase requiere **UUIDs válidos** con formato:
- `123e4567-e89b-12d3-a456-426614174000`

Cuando intentas editar o eliminar un grupo/alumno del seed local, el código envía el ID simple a Supabase, que lo rechaza porque no es un UUID válido.

## Solución Implementada

### 1. Validación de UUID en el Servicio de Datos

Se ha añadido validación en todas las funciones CRUD:

```typescript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(id)) {
  console.warn('Cannot update/delete: Invalid UUID format');
  return false;
}
```

### 2. Fallback a Estado Local

Cuando la validación falla (ID no es UUID válido), el contexto:
- Muestra una advertencia en la consola
- Actualiza/elimina solo en el estado local de React
- Retorna `true` para que la UI se actualice correctamente

### 3. Creación de Nuevos Registros

Cuando creas un **nuevo** grupo/alumno/asignación:
- El código NO envía el campo `id` a Supabase
- Supabase genera automáticamente un UUID válido
- El registro se guarda correctamente en la base de datos

## Comportamiento Actual

### ✅ Funciona Correctamente

1. **Crear nuevos grupos/alumnos/asignaciones**
   - Se guardan en Supabase con UUID generado automáticamente
   - Persisten entre sesiones
   - Visibles para todos los usuarios

2. **Editar/eliminar registros creados por el usuario**
   - Tienen UUIDs válidos
   - Se sincronizan con Supabase
   - Persisten entre sesiones

### ⚠️ Limitación Conocida

3. **Editar/eliminar registros del seed local**
   - Tienen IDs simples (no UUIDs)
   - Solo se pueden editar/eliminar en la sesión actual
   - No se sincronizan con Supabase
   - Se restauran al recargar la página

## Solución Completa (Opcional)

Si necesitas que **todos** los datos iniciales sean editables y persistentes, necesitas migrar el seed a Supabase con UUIDs reales.

### Script de Migración

Ejecuta este SQL en Supabase para reemplazar los datos del seed con UUIDs reales:

```sql
-- ============================================================
-- MIGRACIÓN: Reemplazar IDs del seed con UUIDs reales
-- ============================================================

-- 1. Crear tabla temporal para mapear IDs antiguos a nuevos UUIDs
CREATE TEMP TABLE id_mapping (
  old_id TEXT,
  new_id UUID
);

-- 2. Migrar grupos
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() FROM groups WHERE id NOT LIKE '%-%-%-%-%';

UPDATE groups g
SET id = m.new_id
FROM id_mapping m
WHERE g.id = m.old_id;

-- 3. Migrar estudiantes (actualizar referencias a grupos)
UPDATE students s
SET group_id = m.new_id
FROM id_mapping m
WHERE s.group_id = m.old_id;

-- 4. Generar nuevos UUIDs para estudiantes
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() FROM students WHERE id NOT LIKE '%-%-%-%-%';

UPDATE students s
SET id = m.new_id
FROM id_mapping m
WHERE s.id = m.old_id;

-- 5. Migrar materias
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() FROM subjects WHERE id NOT LIKE '%-%-%-%-%';

UPDATE subjects s
SET id = m.new_id
FROM id_mapping m
WHERE s.id = m.old_id;

-- 6. Actualizar referencias en teacher_subject_groups
UPDATE teacher_subject_groups tsg
SET 
  subject_id = m.new_id
FROM id_mapping m
WHERE tsg.subject_id = m.old_id;

UPDATE teacher_subject_groups tsg
SET 
  group_id = m.new_id
FROM id_mapping m
WHERE tsg.group_id = m.old_id;

-- 7. Generar nuevos UUIDs para teacher_subject_groups
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() FROM teacher_subject_groups WHERE id NOT LIKE '%-%-%-%-%';

UPDATE teacher_subject_groups tsg
SET id = m.new_id
FROM id_mapping m
WHERE tsg.id = m.old_id;

-- 8. Limpiar tabla temporal
DROP TABLE id_mapping;

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
```

**⚠️ ADVERTENCIA:** Este script modificará los IDs en la base de datos. Asegúrate de:
1. Hacer un backup antes de ejecutar
2. Ejecutar en un entorno de pruebas primero
3. Actualizar el código frontend para usar los nuevos UUIDs

## Recomendación

Para la mayoría de los casos de uso, la solución actual es suficiente:

- **Usuarios administradores** pueden crear nuevos grupos, alumnos y asignaciones que se guardan en Supabase
- **Datos del seed** sirven como ejemplo/demo pero no son editables de forma persistente
- **Nuevos datos** creados por el usuario son completamente funcionales y persistentes

Si necesitas editar los datos iniciales, te recomiendo:
1. Crear nuevos registros desde el panel de administración
2. Eliminar los registros del seed que no necesites
3. O ejecutar el script de migración (bajo tu responsabilidad)

## Verificación

Para verificar que todo funciona correctamente:

1. Inicia sesión como administrador
2. Ve a **Administración** → **Grupos**
3. Haz clic en **Añadir**
4. Crea un nuevo grupo:
   - Nombre: "3º ESO A"
   - Curso: "3º ESO"
   - Curso Académico: "2026/2027"
5. El grupo debe aparecer en la lista
6. Recarga la página
7. El grupo debe seguir ahí ✅

Si el grupo persiste después de recargar, la integración con Supabase funciona correctamente.

## Archivos Modificados

- `src/services/dataService.ts` - Validación de UUID en funciones CRUD
- `src/contexts/AppContext.tsx` - Fallback a estado local para IDs no válidos
- `public/sql/migrate-seed-to-uuids.sql` - Script de migración (opcional)

---

**Última actualización:** 2026-01-23
**Estado:** ✅ Solucionado
