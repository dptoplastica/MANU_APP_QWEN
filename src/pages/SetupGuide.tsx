import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Database, CheckCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const { supabaseConnected } = useApp();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Guía de configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Instrucciones para configurar Supabase</p>
      </div>

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
                : 'La aplicación está funcionando en modo demo local. Para persistir datos, configura Supabase siguiendo las instrucciones.'}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Steps */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" /> Pasos para configurar Supabase
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Paso 1: Ejecutar el schema SQL</h3>
            <p className="text-sm text-gray-600 mb-3">
              Abre el SQL Editor en tu proyecto de Supabase y ejecuta el archivo <code className="bg-gray-100 px-2 py-0.5 rounded">supabase/schema.sql</code>
            </p>
            <a
              href="https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" /> Abrir SQL Editor
            </a>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Paso 2: Ejecutar el seed SQL</h3>
            <p className="text-sm text-gray-600 mb-3">
              Después del schema, ejecuta <code className="bg-gray-100 px-2 py-0.5 rounded">supabase/seed.sql</code> para crear los datos iniciales (materias, grupos, alumnos, competencias, criterios).
            </p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-2">Contenido del seed:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Centro educativo (IES Lope de Vega)</li>
                <li>• 3 materias (Dibujo Técnico I, Taller de Podcast, Taller de Cortometraje)</li>
                <li>• 3 grupos (1º Bach A, 1º Bach B, 2º Bach A)</li>
                <li>• 24 alumnos ficticios</li>
                <li>• 8 competencias clave LOMLOE</li>
                <li>• Competencias específicas y criterios de evaluación para cada materia</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Paso 3: Crear usuarios en Authentication</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ve a Authentication → Users en Supabase y crea los usuarios manualmente:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Administrador:</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border">admin@ieslopedevega.es</code>
                  <button
                    onClick={() => copyToClipboard('admin@ieslopedevega.es')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Copiar"
                  >
                    <Copy className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Profesor:</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border">profesor@ieslopedevega.es</code>
                  <button
                    onClick={() => copyToClipboard('profesor@ieslopedevega.es')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Copiar"
                  >
                    <Copy className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">
                Establece una contraseña segura para cada usuario. Desactiva "Confirm email" en Authentication → Settings para pruebas.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Paso 4: Crear perfiles en tabla users</h3>
            <p className="text-sm text-gray-600 mb-3">
              Después de crear los usuarios en Authentication, ejecuta este SQL para crear sus perfiles:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
{`-- Obtener los IDs de los usuarios creados
-- y crear sus perfiles en la tabla users

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
WHERE email IN ('admin@ieslopedevega.es', 'profesor@ieslopedevega.es');`}
              </pre>
            </div>
          </div>

          {/* Step 5 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-2">Paso 5: Crear asignaciones profesor-materia-grupo</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ejecuta este SQL para asignar las materias al profesor:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
{`-- Asignar materias al profesor
INSERT INTO teacher_subject_groups (teacher_id, subject_id, group_id)
SELECT 
  (SELECT id FROM users WHERE email = 'profesor@ieslopedevega.es'),
  subject_id,
  group_id
FROM (VALUES
  ('b0000000-0000-0000-0000-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid), -- Dibujo Técnico I -> 1º Bach A
  ('b0000000-0000-0000-0000-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid), -- Podcast -> 1º Bach A
  ('b0000000-0000-0000-0000-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid)  -- Cortometraje -> 2º Bach A
) AS assignments(subject_id, group_id);`}
              </pre>
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

      {/* Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2">¿Necesitas ayuda?</h3>
        <p className="text-sm text-blue-700 mb-3">
          Si tienes problemas con la configuración, consulta la documentación oficial de Supabase:
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://supabase.com/docs/guides/database"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-blue-700 text-sm rounded-lg hover:bg-blue-50 border border-blue-200"
          >
            <ExternalLink className="w-3 h-3" /> Documentación de base de datos
          </a>
          <a
            href="https://supabase.com/docs/guides/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-blue-700 text-sm rounded-lg hover:bg-blue-50 border border-blue-200"
          >
            <ExternalLink className="w-3 h-3" /> Documentación de autenticación
          </a>
        </div>
      </div>
    </div>
  );
};
