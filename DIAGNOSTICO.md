# Diagnóstico de problemas en entorno de desarrollo

## Problema reportado
Los cambios del panel de administración no se guardan cuando se ejecuta desde:
https://sturdy-adventure-x59ggrvq45r25r.github.dev/

## Herramienta de diagnóstico añadida

He añadido un **Panel de Diagnóstico** que aparece como un botón azul "🔧 Diagnóstico" en la esquina inferior derecha de la aplicación (visible cuando estás autenticado).

### Cómo usar el panel de diagnóstico

1. **Inicia sesión** como administrador (admin@ieslopedevega.es)
2. **Busca el botón azul** "🔧 Diagnóstico" en la esquina inferior derecha
3. **Haz clic** para abrir el panel
4. **Verifica el estado**:
   - ✅ Conexión Supabase: Debe mostrar "Conectado"
   - ✅ Autenticación: Debe mostrar "Autenticado"
   - ✅ Usuario actual: Debe mostrar tu nombre y rol
5. **Haz clic en "Probar operaciones CRUD"** para ejecutar un test completo

### Qué hace el test

El test realiza 5 verificaciones:
1. ✅ Conexión básica a Supabase
2. ✅ Verificación de autenticación
3. ✅ Obtención del perfil de usuario
4. ✅ Creación de un grupo de prueba
5. ✅ Eliminación del grupo de prueba

Si todo funciona, verás: "TODO FUNCIONA CORRECTAMENTE"

## Posibles causas del problema

### 1. Variables de entorno no configuradas
El entorno de GitHub Codespaces puede no tener las variables de entorno configuradas.

**Solución:**
```bash
# En el terminal de Codespaces, crea el archivo .env
cat > .env << EOF
VITE_SUPABASE_URL=https://sbymwyxjuxhkilwcxoed.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_71LSjFpKhUgVS0vMTFb-aQ_v6WZ43kG
EOF
```

Luego reinicia el servidor de desarrollo.

### 2. Políticas RLS no configuradas
Las políticas de seguridad de Supabase pueden estar bloqueando las operaciones.

**Solución:**
1. Ve a la **Guía de configuración** (menú lateral)
2. Busca el **Paso 7: Configurar políticas de seguridad**
3. Copia el SQL y ejecútalo en el SQL Editor de Supabase

### 3. Usuario no autenticado en Supabase
El usuario puede estar autenticado en la aplicación pero no en Supabase Auth.

**Solución:**
1. Cierra sesión completamente
2. Inicia sesión de nuevo
3. Verifica en el panel de diagnóstico que "Autenticación" muestra "✅ Autenticado"

### 4. Perfil de usuario no existe en Supabase
El usuario existe en Supabase Auth pero no tiene un perfil en la tabla `users`.

**Solución:**
Ejecuta este SQL en Supabase:
```sql
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
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es')
ON CONFLICT (id) DO NOTHING;
```

## Pasos de diagnóstico

### Paso 1: Verificar conexión
1. Abre el panel de diagnóstico
2. Verifica que "Conexión Supabase" muestra ✅
3. Si muestra ❌, el problema es de conexión

### Paso 2: Verificar autenticación
1. Verifica que "Autenticación" muestra ✅
2. Si muestra ❌, cierra sesión e inicia de nuevo

### Paso 3: Probar operaciones CRUD
1. Haz clic en "Probar operaciones CRUD"
2. Espera a que termine el test
3. Lee el resultado:
   - Si todo está ✅, el problema es otro
   - Si hay ❌, el mensaje te dirá qué política RLS falta

### Paso 4: Revisar consola del navegador
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta crear un grupo desde el panel de administración
4. Busca mensajes de error o logs

## Información que necesito

Para ayudarte mejor, por favor comparte:

1. **Captura del panel de diagnóstico** mostrando:
   - Estado de conexión Supabase
   - Estado de autenticación
   - Resultado del test CRUD

2. **Mensajes de la consola** (F12 → Console):
   - Cualquier error en rojo
   - Logs que empiecen con "Creating group" o "Error creating group"

3. **Resultado del test CRUD**:
   - ¿Qué paso falla?
   - ¿Cuál es el mensaje de error exacto?

## Solución rápida

Si el problema es que las políticas RLS no están configuradas, ejecuta este SQL en Supabase:

```sql
-- Políticas para administradores
DROP POLICY IF EXISTS "Admins can view all groups" ON groups;
CREATE POLICY "Admins can view all groups" ON groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view all students" ON students;
CREATE POLICY "Admins can view all students" ON students
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view all assignments" ON teacher_subject_groups;
CREATE POLICY "Admins can view all assignments" ON teacher_subject_groups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Políticas para profesores (crear/editar)
DROP POLICY IF EXISTS "Teachers can insert groups" ON groups;
CREATE POLICY "Teachers can insert groups" ON groups
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Teachers can update groups" ON groups;
CREATE POLICY "Teachers can update groups" ON groups
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Teachers can insert students" ON students;
CREATE POLICY "Teachers can insert students" ON students
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Teachers can update students" ON students;
CREATE POLICY "Teachers can update students" ON students
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Teachers can insert assignments" ON teacher_subject_groups;
CREATE POLICY "Teachers can insert assignments" ON teacher_subject_groups
  FOR INSERT WITH CHECK (true);
```

## Archivos de ayuda

- `SOLUCION_ADMIN.md` - Solución completa al problema
- `public/sql/policies-admin.sql` - Script SQL completo de políticas
- `src/components/DiagnosticPanel.tsx` - Componente de diagnóstico
- `src/services/dataService.ts` - Servicio con logs de depuración
