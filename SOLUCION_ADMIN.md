# Solución: Panel de Administración no guarda cambios

## Problema

El panel de administración no puede crear, editar o eliminar grupos, alumnos y asignaciones porque las políticas de seguridad (RLS) de Supabase no permiten estas operaciones.

## Causa

Supabase tiene habilitado Row Level Security (RLS) en todas las tablas, lo que significa que por defecto nadie puede acceder a los datos. Las políticas actuales solo permiten a los profesores ver sus propios datos, pero no hay políticas que permitan al administrador gestionar todos los datos.

## Solución

Ejecuta el script de políticas de seguridad en el SQL Editor de Supabase:

### Opción 1: Desde la aplicación

1. Inicia sesión como administrador
2. Ve a **Configuración** → **Guía de configuración**
3. Busca el **Paso 7: Configurar políticas de seguridad**
4. Haz clic en **Copiar SQL** o **Descargar**
5. Ve al SQL Editor de Supabase
6. Pega el SQL y haz clic en **Run**

### Opción 2: Manualmente

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new)
2. Copia el contenido del archivo `public/sql/policies-admin.sql`
3. Pégalo en el SQL Editor
4. Haz clic en **Run**

## Script SQL

```sql
-- Políticas RLS para administrador
-- Ejecutar este script para permitir que el admin gestione todos los datos

-- Política para que el admin pueda ver todos los grupos
DROP POLICY IF EXISTS "Admins can view all groups" ON groups;
CREATE POLICY "Admins can view all groups" ON groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todos los alumnos
DROP POLICY IF EXISTS "Admins can view all students" ON students;
CREATE POLICY "Admins can view all students" ON students
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las asignaciones
DROP POLICY IF EXISTS "Admins can view all assignments" ON teacher_subject_groups;
CREATE POLICY "Admins can view all assignments" ON teacher_subject_groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las materias
DROP POLICY IF EXISTS "Admins can view all subjects" ON subjects;
CREATE POLICY "Admins can view all subjects" ON subjects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las actividades
DROP POLICY IF EXISTS "Admins can view all activities" ON activities;
CREATE POLICY "Admins can view all activities" ON activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política para que el admin pueda ver todas las calificaciones
DROP POLICY IF EXISTS "Admins can view all grades" ON grades;
CREATE POLICY "Admins can view all grades" ON grades
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Permitir que los profesores inserten grupos
DROP POLICY IF EXISTS "Teachers can insert groups" ON groups;
CREATE POLICY "Teachers can insert groups" ON groups
  FOR INSERT WITH CHECK (true);

-- Permitir que los profesores actualicen grupos
DROP POLICY IF EXISTS "Teachers can update groups" ON groups;
CREATE POLICY "Teachers can update groups" ON groups
  FOR UPDATE USING (true);

-- Permitir que los profesores inserten alumnos
DROP POLICY IF EXISTS "Teachers can insert students" ON students;
CREATE POLICY "Teachers can insert students" ON students
  FOR INSERT WITH CHECK (true);

-- Permitir que los profesores actualicen alumnos
DROP POLICY IF EXISTS "Teachers can update students" ON students;
CREATE POLICY "Teachers can update students" ON students
  FOR UPDATE USING (true);

-- Permitir que los profesores inserten asignaciones
DROP POLICY IF EXISTS "Teachers can insert assignments" ON teacher_subject_groups;
CREATE POLICY "Teachers can insert assignments" ON teacher_subject_groups
  FOR INSERT WITH CHECK (true);
```

## Verificación

Después de ejecutar el script:

1. Inicia sesión como administrador (admin@ieslopedevega.es)
2. Ve a **Administración** → **Grupos**
3. Haz clic en **Añadir**
4. Completa el formulario:
   - Nombre: "2º Bachillerato B"
   - Curso: "2º Bachillerato"
   - Curso Académico: "2026/2027"
5. Haz clic en **Crear**
6. El grupo debe aparecer en la lista inmediatamente
7. Abre la consola del navegador (F12) y verifica que no haya errores

## Depuración

Si el problema persiste, abre la consola del navegador (F12) y verifica:

1. **Error de conexión**: Si ves "Supabase not initialized", verifica que las variables de entorno estén correctas
2. **Error de permisos**: Si ves "new row violates row-level security policy", ejecuta el script de políticas
3. **Error de datos**: Si ves "invalid input syntax", verifica que todos los campos del formulario estén completos

## Archivos relacionados

- `public/sql/policies-admin.sql` - Script de políticas de seguridad
- `src/services/dataService.ts` - Servicio de datos con logs de depuración
- `src/pages/Admin.tsx` - Panel de administración
- `src/pages/SetupGuide.tsx` - Guía de configuración con el Paso 7

## Notas de seguridad

Las políticas configuradas permiten:
- **Administradores**: Ver, crear, editar y eliminar todos los datos
- **Profesores**: Ver sus propios datos y crear/editar grupos, alumnos y asignaciones

Para un entorno de producción, considera restringir más los permisos según tus necesidades específicas.
