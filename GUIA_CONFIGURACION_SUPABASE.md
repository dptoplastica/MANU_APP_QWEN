# GUÍA DE CONFIGURACIÓN DE SUPABASE
## IES Lope de Vega — Gestión Docente LOMLOE

Esta guía explica paso a paso cómo configurar Supabase para que la aplicación persista los datos en la nube.

---

## ESTADO ACTUAL

La aplicación está configurada para conectarse a:
- **URL:** https://sbymwyxjuxhkilwcxoed.supabase.co
- **Clave:** Publishable key (sb_publishable_71LSjFpKhUgVS0vMTFb-aQ_v6WZ43kG)

**Importante:** Aunque las credenciales están configuradas, es necesario ejecutar los scripts SQL para crear las tablas y datos iniciales.

---

## PASO 1: ACCEDER AL DASHBOARD DE SUPABASE

1. Abre tu navegador y ve a: https://supabase.com
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto correspondiente a la URL configurada

---

## PASO 2: EJECUTAR EL SCHEMA SQL

El schema crea todas las tablas necesarias para la aplicación.

1. En el dashboard de Supabase, ve a **SQL Editor** (icono de base de datos en el menú lateral)
2. Haz clic en **New Query**
3. Abre el archivo `supabase/schema.sql` en tu editor de texto
4. Copia todo el contenido y pégalo en el SQL Editor
5. Haz clic en **Run** (o presiona Ctrl+Enter)

**Qué crea el schema:**
- Tablas para centros, cursos académicos, departamentos
- Tabla de usuarios (vinculada a auth.users)
- Tablas de materias, grupos y alumnos
- Tablas de asignaciones profesor-materia-grupo
- Tablas de programación didáctica
- Tablas de estructura curricular LOMLOE (competencias, criterios, saberes)
- Tablas de situaciones de aprendizaje y actividades
- Tablas de calificaciones y evaluaciones
- Índices para optimizar consultas
- Políticas de seguridad (RLS) para control de acceso

**Tiempo estimado:** 5-10 segundos

---

## PASO 3: EJECUTAR EL SEED SQL

El seed crea los datos iniciales (materias, grupos, alumnos, competencias, criterios).

1. En el SQL Editor, crea una **New Query**
2. Abre el archivo `supabase/seed.sql` en tu editor de texto
3. Copia todo el contenido y pégalo en el SQL Editor
4. Haz clic en **Run**

**Qué crea el seed:**
- Centro educativo: IES Lope de Vega
- Curso académico: 2026/2027
- Departamento: Dibujo
- 3 materias:
  - Dibujo Técnico I (1º Bachillerato)
  - Taller de Podcast (1º Bachillerato)
  - Taller de Cortometraje (2º Bachillerato)
- 3 grupos:
  - 1º Bachillerato A
  - 1º Bachillerato B
  - 2º Bachillerato A
- 24 alumnos ficticios (12 en 1ºA, 6 en 1ºB, 6 en 2ºA)
- 8 competencias clave LOMLOE (CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC)
- Competencias específicas para cada materia
- Criterios de evaluación para cada materia
- Relaciones entre competencias y criterios

**Tiempo estimado:** 5-10 segundos

---

## PASO 4: CREAR USUARIOS EN AUTHENTICATION

Los usuarios deben crearse en el sistema de autenticación de Supabase.

1. Ve a **Authentication** → **Users** en el menú lateral
2. Haz clic en **Add user** → **Create new user**
3. Crea el **Administrador**:
   - Email: `admin@ieslopedevega.es`
   - Password: (elige una contraseña segura, ej: `Admin2026!`)
   - Auto Confirm User: ✓ (marca esta casilla)
   - Haz clic en **Create user**

4. Repite el proceso para el **Profesor**:
   - Email: `profesor@ieslopedevega.es`
   - Password: (elige una contraseña segura, ej: `Prof2026!`)
   - Auto Confirm User: ✓
   - Haz clic en **Create user**

**Importante:** Anota las contraseñas en un lugar seguro. No se pueden recuperar después.

---

## PASO 5: CREAR PERFILES DE USUARIO

Después de crear los usuarios en Authentication, necesitas crear sus perfiles en la tabla `users`.

1. Ve a **SQL Editor** → **New Query**
2. Ejecuta el siguiente SQL:

```sql
-- Crear perfiles para los usuarios creados
INSERT INTO users (id, email, name, role, active)
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'admin@ieslopedevega.es' THEN 'Administrador del Centro'
    WHEN email = 'profesor@ieslopedevega.es' THEN 'D. García López'
  END as name,
  CASE 
    WHEN email = 'admin@ieslopedevega.es' THEN 'admin'
    WHEN email = 'profesor@ieslopedevega.es' THEN 'teacher'
  END as role,
  true as active
FROM auth.users
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es');
```

3. Haz clic en **Run**

**Verificación:** Deberías ver un mensaje como "Success. No rows returned" y 2 filas afectadas.

---

## PASO 6: CREAR ASIGNACIONES PROFESOR-MATERIA-GRUPO

Ahora asigna las materias al profesor.

1. En el SQL Editor, ejecuta:

```sql
-- Asignar materias al profesor
INSERT INTO teacher_subject_groups (teacher_id, subject_id, group_id)
SELECT 
  (SELECT id FROM users WHERE email = 'profesor@ieslopedevega.es'),
  subject_id,
  group_id
FROM (VALUES
  -- Dibujo Técnico I -> 1º Bachillerato A
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid),
  -- Taller de Podcast -> 1º Bachillerato A
  ('b0000000-0000-0000-0000-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid),
  -- Taller de Cortometraje -> 2º Bachillerato A
  ('b0000000-0000-0000-0000-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid)
) AS assignments(subject_id, group_id);
```

2. Haz clic en **Run**

**Verificación:** Deberías ver 3 filas afectadas.

---

## PASO 7: VERIFICAR LA CONFIGURACIÓN

1. Abre la aplicación web
2. Inicia sesión con las credenciales:
   - **Administrador:** admin@ieslopedevega.es / Admin2026!
   - **Profesor:** profesor@ieslopedevega.es / Prof2026!

3. Verifica que:
   - El indicador en la barra lateral muestra "Supabase conectado" (punto verde)
   - Puedes ver las materias, grupos y alumnos
   - Puedes acceder al cuaderno del profesor
   - Las calificaciones se guardan correctamente

---

## PASO 8: CONFIGURAR SITUACIONES DE APRENDIZAJE Y ACTIVIDADES

Las situaciones de aprendizaje y actividades se pueden crear desde la interfaz web o mediante SQL.

**Opción A: Desde la interfaz web**
1. Inicia sesión como administrador o profesor
2. Ve a "Situaciones de aprendizaje" o "Actividades"
3. Usa los formularios para crear nuevas SDA y actividades

**Opción B: Mediante SQL (recomendado para datos iniciales)**
- Crea un script SQL con las SDA y actividades
- Ejecútalo en el SQL Editor

**Ejemplo de SDA:**
```sql
INSERT INTO learning_situations (
  title, programme_id, subject_id, evaluation_period,
  timing, sessions, context, justification, final_product
) VALUES (
  'Geometría y arte en Cantabria',
  NULL, -- O el ID de la programación si existe
  'b0000000-0000-0000-0000-000000000001', -- Dibujo Técnico I
  '1', -- 1ª evaluación
  'Septiembre - Octubre',
  12,
  'Exploración de la geometría presente en el patrimonio arquitectónico cántabro',
  'Conexión entre geometría plana y arte local para motivar el aprendizaje',
  'Mural geométrico inspirado en la arquitectura cántabra'
);
```

---

## PASO 9: GENERAR CALIFICACIONES INICIALES (OPCIONAL)

Si quieres generar calificaciones de ejemplo para probar la aplicación:

1. Ve a **SQL Editor** → **New Query**
2. Ejecuta este script para generar calificaciones aleatorias:

```sql
-- Generar calificaciones aleatorias para todos los alumnos y actividades
INSERT INTO grades (student_id, activity_id, score, observation, not_completed, not_evaluated, recovery)
SELECT 
  s.id as student_id,
  a.id as activity_id,
  CASE 
    WHEN random() > 0.1 THEN round((random() * 5 + 4)::numeric, 1) -- 90% tienen nota (4.0-9.0)
    ELSE NULL -- 10% sin calificar
  END as score,
  '' as observation,
  CASE WHEN random() > 0.9 THEN true ELSE false END as not_completed,
  false as not_evaluated,
  false as recovery
FROM students s
CROSS JOIN activities a
WHERE (SELECT COUNT(*) FROM grades) = 0; -- Solo si no hay calificaciones
```

---

## SOLUCIÓN DE PROBLEMAS

### Error: "relation already exists"
- Las tablas ya existen. Puedes ignorar este error o hacer DROP de las tablas antes de ejecutar el schema.

### Error: "duplicate key value violates unique constraint"
- Los datos ya existen. Usa `ON CONFLICT DO NOTHING` o haz DELETE antes de INSERT.

### Los usuarios no pueden iniciar sesión
- Verifica que los usuarios están creados en Authentication → Users
- Verifica que "Auto Confirm User" estaba marcado al crearlos
- Verifica que existen los perfiles en la tabla `users`

### El indicador muestra "Modo demo local"
- Supabase no está conectado. Verifica:
  - Que las variables de entorno están correctas en `.env`
  - Que has ejecutado el schema.sql
  - Que la URL y clave son correctas

### Error de permisos (RLS)
- Las políticas de seguridad están bloqueando el acceso
- Verifica que el usuario tiene el rol correcto en la tabla `users`
- Para pruebas, puedes desactivar RLS temporalmente:
  ```sql
  ALTER TABLE students DISABLE ROW LEVEL SECURITY;
  ```

---

## MANTENIMIENTO

### Backup de datos
Supabase realiza backups automáticos. También puedes exportar datos manualmente:
1. Ve a **Table Editor**
2. Selecciona la tabla
3. Haz clic en **Export** → **CSV**

### Añadir más profesores
1. Crea el usuario en Authentication → Users
2. Crea el perfil en la tabla `users`
3. Asigna materias y grupos en `teacher_subject_groups`

### Cambiar de curso académico
1. Crea un nuevo curso académico en la tabla `academic_years`
2. Crea nuevas materias, grupos y asignaciones para el nuevo curso
3. Los datos del curso anterior permanecen intactos

---

## SOPORTE

Si necesitas ayuda adicional:
- Documentación de Supabase: https://supabase.com/docs
- Guía de configuración en la app: /setup
- Revisa los logs en la consola del navegador (F12)

---

**Última actualización:** Enero 2026
**Versión de la aplicación:** 1.0.0
