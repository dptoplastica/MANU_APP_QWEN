# Troubleshooting: Asignaciones de Materias a Profesores

## Problema
Al intentar crear una asignación de materia a profesor en el panel de administración, la operación falla o no se guarda.

## Causas Posibles y Soluciones

### 1. Datos Incompletos
**Síntoma:** Aparece el mensaje "Error: Debes seleccionar un profesor, una materia y un grupo."

**Solución:**
- Asegúrate de seleccionar los tres campos: Profesor, Materia y Grupo
- Verifica que los selectores no estén vacíos

### 2. Error de Supabase
**Síntoma:** Aparece el mensaje "Error al crear la asignación. Verifica la consola del navegador para más detalles."

**Solución:**
1. Abre la consola del navegador (F12)
2. Intenta crear la asignación nuevamente
3. Revisa los logs en la consola:
   - `Creating assignment - formData:` muestra los datos del formulario
   - `Creating assignment - newItem:` muestra los datos que se van a enviar
   - `Supabase createAssignment - Input:` muestra los datos que recibe Supabase
   - `Error creating assignment:` muestra el error específico de Supabase

### 3. Permisos de Supabase (RLS)
**Síntoma:** El error en consola muestra "new row violates row-level security policy"

**Solución:**
1. Verifica que las políticas RLS estén configuradas correctamente en Supabase
2. Ejecuta este SQL en el SQL Editor de Supabase para agregar políticas permisivas:

```sql
-- Permitir que los administradores gestionen asignaciones
CREATE POLICY "Admins can manage assignments"
ON teacher_subject_groups
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Permitir que los profesores vean sus propias asignaciones
CREATE POLICY "Teachers can view their assignments"
ON teacher_subject_groups
FOR SELECT
USING (
  teacher_id = auth.uid()
);
```

### 4. IDs Inválidos
**Síntoma:** El error muestra "invalid input syntax for type uuid"

**Solución:**
- Verifica que los profesores, materias y grupos existan en la base de datos
- Los IDs deben ser UUIDs válidos (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- Si estás usando datos de seed, asegúrate de que hayan sido cargados correctamente

### 5. Duplicados
**Síntoma:** El error muestra "duplicate key value violates unique constraint"

**Solución:**
- Verifica que no exista ya una asignación idéntica (mismo profesor, materia y grupo)
- La tabla `teacher_subject_groups` tiene una restricción UNIQUE en la combinación de estos tres campos

## Diagnóstico Paso a Paso

### Paso 1: Verificar Datos en Supabase
Ejecuta estas consultas en el SQL Editor de Supabase:

```sql
-- Ver profesores disponibles
SELECT id, name, email FROM users WHERE role = 'teacher';

-- Ver materias disponibles
SELECT id, name FROM subjects;

-- Ver grupos disponibles
SELECT id, name FROM groups;

-- Ver asignaciones existentes
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

### Paso 2: Probar Inserción Manual
Intenta crear una asignación manualmente en Supabase:

```sql
-- Reemplaza estos IDs con valores reales de tu base de datos
INSERT INTO teacher_subject_groups (teacher_id, subject_id, group_id)
VALUES (
  'ID_DEL_PROFESOR',
  'ID_DE_LA_MATERIA',
  'ID_DEL_GRUPO'
);
```

Si esta inserción falla, el problema está en la base de datos, no en la aplicación.

### Paso 3: Verificar Políticas RLS
Ejecuta esta consulta para ver las políticas actuales:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'teacher_subject_groups';
```

## Logs de Depuración

La aplicación ahora incluye logs detallados en la consola del navegador:

1. **En el panel de administración:**
   - `Creating assignment - formData:` Datos del formulario
   - `Creating assignment - newItem:` Datos procesados

2. **En el servicio de datos:**
   - `Supabase createAssignment - Input:` Datos enviados a Supabase
   - `Supabase createAssignment - Success:` Respuesta exitosa
   - `Error creating assignment:` Error específico

## Contacto y Soporte

Si el problema persiste después de seguir estos pasos:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta crear una asignación
4. Copia todos los mensajes de error y logs
5. Comparte esta información para diagnóstico

## Notas Adicionales

- Las asignaciones solo se pueden crear si el profesor, la materia y el grupo existen
- No se pueden crear asignaciones duplicadas (mismo profesor + materia + grupo)
- Los cambios se sincronizan con Supabase en tiempo real
- Si Supabase no está disponible, los cambios se guardan localmente (modo demo)
