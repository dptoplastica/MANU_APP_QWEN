import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Database, CheckCircle, AlertCircle, ExternalLink, Copy, Check, Download, FileText, Eye, EyeOff } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const { supabaseConnected } = useApp();
  const [schemaContent, setSchemaContent] = useState<string>('');
  const [seedContent, setSeedContent] = useState<string>('');
  const [showSchema, setShowSchema] = useState(false);
  const [showSeed, setShowSeed] = useState(false);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const [setupCompletoContent, setSetupCompletoContent] = useState<string>('');

  useEffect(() => {
    // Cargar los archivos SQL
    fetch('/sql/schema.sql')
      .then(r => r.text())
      .then(setSchemaContent)
      .catch(() => setSchemaContent('-- No se pudo cargar schema.sql'));

    fetch('/sql/seed.sql')
      .then(r => r.text())
      .then(setSeedContent)
      .catch(() => setSeedContent('-- No se pudo cargar seed.sql'));

    fetch('/sql/setup-completo.sql')
      .then(r => r.text())
      .then(setSetupCompletoContent)
      .catch(() => setSetupCompletoContent('-- No se pudo cargar setup-completo.sql'));
  }, []);

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Guía de configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Configura Supabase para persistir los datos</p>
      </div>

      {/* Error Solution Banner */}
      {!supabaseConnected && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                ¿Error: "relation already exists"?
              </h2>
              <p className="text-sm text-red-700 mb-3">
                Si ves el error <code className="bg-red-100 px-2 py-0.5 rounded">ERROR: 42P07: relation "schools" already exists</code>, 
                significa que las tablas ya existen en tu base de datos.
              </p>
              <div className="bg-white border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-800 mb-2">✅ Solución rápida:</p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Descarga <strong>setup-completo.sql</strong> (botón verde arriba)</li>
                  <li>Copia todo el contenido en el SQL Editor de Supabase</li>
                  <li>Haz clic en <strong>Run</strong></li>
                </ol>
                <p className="text-xs text-gray-600 mt-2">
                  Este script elimina las tablas existentes y las recrea desde cero con todos los datos iniciales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className={`rounded-xl border-2 p-6 ${supabaseConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-start gap-4">
          {supabaseConnected ? (
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h2 className={`text-lg font-semibold ${supabaseConnected ? 'text-green-800' : 'text-yellow-800'}`}>
              {supabaseConnected ? '✓ Supabase conectado' : '⚠ Supabase no configurado'}
            </h2>
            <p className={`text-sm mt-1 ${supabaseConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              {supabaseConnected
                ? 'La aplicación está conectada a tu base de datos en Supabase. Los datos se persisten correctamente.'
                : 'La aplicación funciona en modo demo local. Para persistir datos, sigue los pasos siguientes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Download SQL Files */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Download className="w-5 h-5" /> Archivos SQL disponibles
        </h2>
        <p className="text-sm text-blue-800 mb-4">
          <strong>Recomendado:</strong> Si las tablas ya existen, usa <code className="bg-blue-100 px-1 rounded">setup-completo.sql</code> que las elimina y recrea desde cero.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => downloadFile(setupCompletoContent, 'setup-completo.sql')}
            className="flex items-center gap-3 p-4 bg-white border-2 border-green-400 rounded-lg hover:bg-green-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">setup-completo.sql</p>
              <p className="text-xs text-gray-500">Todo en uno (recomendado)</p>
            </div>
            <Download className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => downloadFile(schemaContent, 'schema.sql')}
            className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">schema.sql</p>
              <p className="text-xs text-gray-500">Solo tablas e índices</p>
            </div>
            <Download className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => downloadFile(seedContent, 'seed.sql')}
            className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">seed.sql</p>
              <p className="text-xs text-gray-500">Solo datos iniciales</p>
            </div>
            <Download className="w-4 h-4 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" /> Pasos para configurar Supabase
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Paso 1: Abrir SQL Editor</h3>
            <p className="text-sm text-gray-600 mb-3">
              Abre el SQL Editor de tu proyecto de Supabase:
            </p>
            <a
              href="https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" /> Abrir SQL Editor de Supabase
            </a>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Paso 2: Ejecutar setup-completo.sql (RECOMENDADO)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(setupCompletoContent, 'setup-completo')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded text-green-700"
                >
                  {copiedStep === 'setup-completo' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedStep === 'setup-completo' ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={() => downloadFile(setupCompletoContent, 'setup-completo.sql')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded text-green-700"
                >
                  <Download className="w-3 h-3" /> Descargar
                </button>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-green-800">
                <strong>✅ Este es el script que necesitas.</strong> Elimina las tablas existentes y las recrea desde cero con todos los datos iniciales.
                Resuelve el error "relation already exists".
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Copia y pega este SQL en el editor, luego haz clic en <strong>Run</strong>.
            </p>
          </div>

          {/* Step 3 - Alternative */}
          <div className="border-l-4 border-gray-300 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600">Alternativa: Ejecutar schema.sql + seed.sql por separado</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(schemaContent, 'schema')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {copiedStep === 'schema' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  {copiedStep === 'schema' ? 'Copiado' : 'Copiar schema'}
                </button>
                <button
                  onClick={() => copyToClipboard(seedContent, 'seed')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {copiedStep === 'seed' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  {copiedStep === 'seed' ? 'Copiado' : 'Copiar seed'}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Si prefieres ejecutar los scripts por separado (solo si las tablas NO existen):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => downloadFile(schemaContent, 'schema.sql')}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                <Download className="w-3 h-3" /> Descargar schema.sql
              </button>
              <button
                onClick={() => downloadFile(seedContent, 'seed.sql')}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                <Download className="w-3 h-3" /> Descargar seed.sql
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Paso 4: Crear usuarios</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ve a <strong>Authentication → Users</strong> en Supabase y crea estos usuarios:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Administrador:</p>
                  <code className="text-xs bg-white px-2 py-1 rounded border">admin@ieslopedevega.es</code>
                </div>
                <button
                  onClick={() => copyToClipboard('admin@ieslopedevega.es', 'admin-email')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {copiedStep === 'admin-email' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Profesor:</p>
                  <code className="text-xs bg-white px-2 py-1 rounded border">profesor@ieslopedevega.es</code>
                </div>
                <button
                  onClick={() => copyToClipboard('profesor@ieslopedevega.es', 'teacher-email')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {copiedStep === 'teacher-email' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 italic">
                ✓ Marca "Auto Confirm User" al crearlos. Elige contraseñas seguras.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Paso 5: Crear perfiles de usuario</h3>
              <button
                onClick={() => copyToClipboard(step5SQL, 'step5')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                {copiedStep === 'step5' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {copiedStep === 'step5' ? 'Copiado' : 'Copiar SQL'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Ejecuta este SQL para vincular los usuarios de Authentication con la tabla de perfiles:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre">{step5SQL}</pre>
            </div>
          </div>

          {/* Step 6 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Paso 6: Asignar materias al profesor</h3>
              <button
                onClick={() => copyToClipboard(step6SQL, 'step6')}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                {copiedStep === 'step6' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {copiedStep === 'step6' ? 'Copiado' : 'Copiar SQL'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Asigna las materias al profesor:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre">{step6SQL}</pre>
            </div>
          </div>

          {/* Step 7 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Paso 7: Configurar políticas de seguridad (IMPORTANTE)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(step7SQL, 'step7')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 rounded text-orange-700"
                >
                  {copiedStep === 'step7' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedStep === 'step7' ? 'Copiado' : 'Copiar SQL'}
                </button>
                <button
                  onClick={() => downloadFile(step7SQL, 'policies-admin.sql')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 rounded text-orange-700"
                >
                  <Download className="w-3 h-3" /> Descargar
                </button>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-orange-800">
                <strong>⚠️ IMPORTANTE:</strong> Este script configura las políticas de seguridad (RLS) que permiten al administrador crear, editar y eliminar grupos, alumnos y asignaciones.
                Sin ejecutar este script, el panel de administración no podrá guardar cambios.
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Ejecuta este SQL para configurar los permisos de seguridad:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-64 overflow-y-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre">{step7SQL}</pre>
            </div>
          </div>

          {/* Step 8 - FIX RLS RECURSION */}
          <div className="border-l-4 border-red-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Paso 8: CORREGIR Recursión Infinita en RLS (CRÍTICO)</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(fixRlsSQL, 'fix-rls')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded text-red-700"
                >
                  {copiedStep === 'fix-rls' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedStep === 'fix-rls' ? 'Copiado' : 'Copiar SQL'}
                </button>
                <button
                  onClick={() => downloadFile(fixRlsSQL, 'fix-rls-recursion.sql')}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded text-red-700"
                >
                  <Download className="w-3 h-3" /> Descargar
                </button>
              </div>
            </div>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 mb-3">
              <p className="text-sm text-red-800 font-bold">
                🚨 CRÍTICO: Si el diagnóstico muestra "infinite recursion detected in policy for relation users", 
                DEBES ejecutar este script para corregir el problema.
              </p>
              <p className="text-sm text-red-700 mt-2">
                Este script elimina las políticas recursivas y crea políticas correctas que no causan bucles infinitos.
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Ejecuta este SQL para corregir la recursión infinita:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-64 overflow-y-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre">{fixRlsSQL}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Configuración actual</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Supabase URL:</span>
            <code className="text-xs bg-white px-2 py-1 rounded border">sbymwyxjuxhkilwcxoed.supabase.co</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Tipo de clave:</span>
            <code className="text-xs bg-white px-2 py-1 rounded border">Publishable (sb_publishable)</code>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Estado:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${supabaseConnected ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {supabaseConnected ? 'Conectado' : 'No configurado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const step5SQL = `-- Crear perfiles para los usuarios
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
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es');`;

const step6SQL = `-- Asignar materias al profesor
INSERT INTO teacher_subject_groups (teacher_id, subject_id, group_id)
SELECT 
  (SELECT id FROM users WHERE email = 'profesor@ieslopedevega.es'),
  subject_id,
  group_id
FROM (VALUES
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid),
  ('b0000000-0000-0000-0000-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid),
  ('b0000000-0000-0000-0000-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid)
) AS assignments(subject_id, group_id);`;

const step7SQL = `-- Políticas RLS para administrador
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
  FOR INSERT WITH CHECK (true);`;

const fixRlsSQL = `-- ============================================================
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
-- Esta política NO consulta la tabla users, evita la recursión
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
-- ============================================================`;
