import React, { useState, useEffect } from 'react';
import { Download, FileText, Copy, Check, Database, Shield, AlertCircle } from 'lucide-react';

export const SqlDownloads: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const files = [
    {
      id: 'setup-completo',
      name: 'setup-completo.sql',
      path: '/sql/setup-completo.sql',
      description: 'Configuración inicial completa (elimina tablas y recrea todo)',
      color: 'green',
      priority: 1
    },
    {
      id: 'fix-403-errors',
      name: 'fix-403-errors.sql',
      path: '/sql/fix-403-errors.sql',
      description: 'Corrige errores 403 y crea políticas RLS correctas',
      color: 'orange',
      priority: 2
    },
    {
      id: 'migrate-seed-to-uuids',
      name: 'migrate-seed-to-uuids.sql',
      path: '/sql/migrate-seed-to-uuids.sql',
      description: 'Migra IDs del seed a UUIDs válidos',
      color: 'blue',
      priority: 3
    },
    {
      id: 'schema',
      name: 'schema.sql',
      path: '/sql/schema.sql',
      description: 'Solo estructura de tablas (sin datos)',
      color: 'gray',
      priority: 4
    },
    {
      id: 'seed',
      name: 'seed.sql',
      path: '/sql/seed.sql',
      description: 'Solo datos iniciales (requiere schema.sql)',
      color: 'gray',
      priority: 5
    }
  ];

  useEffect(() => {
    // Cargar contenido de todos los archivos
    files.forEach(file => {
      fetch(file.path)
        .then(r => r.text())
        .then(content => {
          setFileContents(prev => ({ ...prev, [file.id]: content }));
        })
        .catch(() => {
          setFileContents(prev => ({ ...prev, [file.id]: '-- No se pudo cargar el archivo' }));
        });
    });
  }, []);

  const copyToClipboard = (content: string, fileId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileId);
    setTimeout(() => setCopiedFile(null), 2000);
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

  const colorClasses: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hover: 'hover:bg-green-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', hover: 'hover:bg-gray-100' }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Descarga de Archivos SQL</h1>
        <p className="text-sm text-gray-500 mt-1">Archivos SQL para configurar Supabase</p>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Database className="w-5 h-5" /> ¿Cómo usar estos archivos?
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Ve al <strong>SQL Editor</strong> de tu proyecto en Supabase</li>
          <li>Descarga o copia el contenido del archivo que necesites</li>
          <li>Pega el contenido en el SQL Editor</li>
          <li>Haz clic en <strong>Run</strong> para ejecutar</li>
        </ol>
        <div className="mt-3">
          <a
            href="https://supabase.com/dashboard/project/sbymwyxjuxhkilwcxoed/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Abrir SQL Editor de Supabase →
          </a>
        </div>
      </div>

      {/* Orden recomendado */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <h2 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Orden recomendado de ejecución
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
          <li><strong>setup-completo.sql</strong> - Si necesitas empezar de cero</li>
          <li><strong>fix-403-errors.sql</strong> - Para corregir errores de permisos</li>
          <li><strong>migrate-seed-to-uuids.sql</strong> - Para migrar IDs a UUIDs</li>
        </ol>
      </div>

      {/* Lista de archivos */}
      <div className="space-y-4">
        {files.map(file => {
          const colors = colorClasses[file.color];
          const isExpanded = expandedFile === file.id;
          const content = fileContents[file.id] || '';

          return (
            <div key={file.id} className={`rounded-xl border ${colors.border} overflow-hidden`}>
              <div className={`${colors.bg} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${colors.bg} border ${colors.border} rounded-lg flex items-center justify-center`}>
                    <FileText className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{file.name}</h3>
                    <p className="text-sm text-gray-600">{file.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(content, file.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 ${colors.bg} border ${colors.border} ${colors.text} text-xs rounded-lg ${colors.hover}`}
                  >
                    {copiedFile === file.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedFile === file.id ? 'Copiado' : 'Copiar'}
                  </button>
                  <button
                    onClick={() => downloadFile(content, file.name)}
                    className={`flex items-center gap-1 px-3 py-1.5 ${colors.bg} border ${colors.border} ${colors.text} text-xs rounded-lg ${colors.hover}`}
                  >
                    <Download className="w-3 h-3" /> Descargar
                  </button>
                  <button
                    onClick={() => setExpandedFile(isExpanded ? null : file.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 ${colors.bg} border ${colors.border} ${colors.text} text-xs rounded-lg ${colors.hover}`}
                  >
                    {isExpanded ? 'Ocultar' : 'Ver'} contenido
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="bg-gray-900 p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-green-400 font-mono whitespace-pre">{content}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Información de seguridad
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Los archivos SQL se ejecutan en tu proyecto de Supabase</li>
          <li>Antes de ejecutar <code className="bg-gray-200 px-1 rounded">setup-completo.sql</code>, haz un backup</li>
          <li>Los otros archivos son seguros y pueden ejecutarse múltiples veces</li>
          <li>Si tienes dudas, consulta la documentación en <code className="bg-gray-200 px-1 rounded">GUIA_CONFIGURACION_SUPABASE.md</code></li>
        </ul>
      </div>
    </div>
  );
};
