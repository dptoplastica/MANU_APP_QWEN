# 🚨 SOLUCIÓN INMEDIATA: Error de Recursión Infinita en RLS

## Problema Identificado

El diagnóstico muestra:
```
❌ Error obteniendo perfil: infinite recursion detected in policy for relation "users"
```

## Causa

La política de seguridad RLS en la tabla `users` está creando un bucle infinito porque intenta verificar el rol del usuario consultando la misma tabla `users`.

## ✅ Solución (3 pasos)

### Paso 1: Abrir SQL Editor de Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed
2. Haz clic en **SQL Editor** en el menú lateral
3. Haz clic en **New Query**

### Paso 2: Copiar y Ejecutar el Script de Corrección

Copia **TODO** el siguiente SQL y pégalo en el SQL Editor:

```sql
-- ============================================================
-- CORRECCIÓN: Políticas RLS sin recursión infinita
-- ============================================================

-- Eliminar la política problemática en la tabla users
DROP POLICY IF EXISTS "Admins have full access to all tables" ON users;

-- Crear políticas correctas para la tabla users
-- Política 1: Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Los administradores pueden ver todos los perfiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
CREATE POLICY "Admins can view all profiles" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = users.id 
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Política 3: Los administradores pueden insertar perfiles
DROP POLICY IF EXISTS "Admins can insert profiles" ON users;
CREATE POLICY "Admins can insert profiles" ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = users.id 
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Política 4: Los administradores pueden actualizar perfiles
DROP POLICY IF EXISTS "Admins can update profiles" ON users;
CREATE POLICY "Admins can update profiles" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = users.id 
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- ============================================================
-- Políticas para otras tablas (sin recursión)
-- ============================================================

-- Grupos: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage groups" ON groups;
CREATE POLICY "Admins can manage groups" ON groups
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Estudiantes: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage students" ON students;
CREATE POLICY "Admins can manage students" ON students
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Asignaciones: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage assignments" ON teacher_subject_groups;
CREATE POLICY "Admins can manage assignments" ON teacher_subject_groups
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Materias: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;
CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Actividades: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage activities" ON activities;
CREATE POLICY "Admins can manage activities" ON activities
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- Calificaciones: Admins pueden hacer todo
DROP POLICY IF EXISTS "Admins can manage grades" ON grades;
CREATE POLICY "Admins can manage grades" ON grades
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = (SELECT id FROM users WHERE id = auth.uid())
      AND auth.users.email = 'admin@ieslopedevega.es'
    )
  );

-- ============================================================
-- Políticas para profesores (lectura)
-- ============================================================

-- Profesores pueden ver sus asignaciones
DROP POLICY IF EXISTS "Teachers can view own assignments" ON teacher_subject_groups;
CREATE POLICY "Teachers can view own assignments" ON teacher_subject_groups
  FOR SELECT
  USING (teacher_id = auth.uid());

-- Profesores pueden ver sus materias
DROP POLICY IF EXISTS "Teachers can view own subjects" ON subjects;
CREATE POLICY "Teachers can view own subjects" ON subjects
  FOR SELECT
  USING (
    id IN (
      SELECT subject_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Profesores pueden ver sus grupos
DROP POLICY IF EXISTS "Teachers can view own groups" ON groups;
CREATE POLICY "Teachers can view own groups" ON groups
  FOR SELECT
  USING (
    id IN (
      SELECT group_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- Profesores pueden ver alumnos de sus grupos
DROP POLICY IF EXISTS "Teachers can view own students" ON students;
CREATE POLICY "Teachers can view own students" ON students
  FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM teacher_subject_groups 
      WHERE teacher_id = auth.uid()
    )
  );

-- ============================================================
-- FIN DE CORRECCIÓN
-- ============================================================
```

### Paso 3: Ejecutar el Script

1. Haz clic en el botón **Run** (o presiona Ctrl+Enter)
2. Espera a que termine la ejecución
3. Deberías ver: **"Success. No rows returned"**

## ✅ Verificar que Funciona

1. Vuelve a la aplicación
2. Abre el **Panel de Diagnóstico** (botón azul en esquina inferior derecha)
3. Haz clic en **"Probar operaciones CRUD"**
4. Ahora deberías ver: **"✅ TODO FUNCIONA CORRECTAMENTE"**

## 🎯 Probar el Panel de Administración

1. Ve a **Administración** → **Grupos**
2. Haz clic en **Añadir**
3. Completa el formulario:
   - Nombre: "2º Bachillerato B"
   - Curso: "2º Bachillerato"
   - Curso Académico: "2026/2027"
4. Haz clic en **Crear**
5. El grupo debe aparecer inmediatamente en la lista ✅

## 📝 Alternativa: Usar la Guía de Configuración

También puedes acceder al script desde la aplicación:

1. Ve a **Configuración** → **Guía de configuración**
2. Busca el **Paso 8: CORREGIR Recursión Infinita en RLS**
3. Haz clic en **Copiar SQL** o **Descargar**
4. Pégalo en el SQL Editor de Supabase y ejecútalo

## 🔍 Si Sigue Sin Funcionar

Si después de ejecutar el script sigues teniendo problemas:

1. **Verifica que el script se ejecutó correctamente** en Supabase
2. **Recarga la página** de la aplicación (Ctrl+F5)
3. **Cierra sesión y vuelve a entrar**
4. **Revisa la consola del navegador** (F12) para ver errores detallados

## 📚 Archivos de Referencia

- `public/sql/fix-rls-recursion.sql` - Script SQL completo
- `src/pages/SetupGuide.tsx` - Guía de configuración actualizada
- `DIAGNOSTICO.md` - Documentación del panel de diagnóstico

---

**Nota:** Este script reemplaza las políticas anteriores y crea nuevas políticas que NO causan recursión infinita. Es seguro ejecutarlo múltiples veces.
