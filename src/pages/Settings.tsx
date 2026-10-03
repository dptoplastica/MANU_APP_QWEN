import React from 'react';
import { useApp } from '../contexts/AppContext';
import { school } from '../data/seed';
import { Settings as SettingsIcon, Shield, Database, Info, Download, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">Ajustes de la aplicación</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-gray-600" /> Configuración general
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Centro educativo</label>
              <input type="text" value={school.name} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localización</label>
              <input type="text" value={`${school.location}, ${school.region}`} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curso académico</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>2026/2027</option>
                <option>2027/2028</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comunidad autónoma</label>
              <input type="text" value={school.region} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Config */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Configuración de evaluación</h2>
        <p className="text-sm text-gray-500 mb-4">El profesor puede configurar el peso de cada elemento en la calificación final.</p>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700 w-48">Peso de actividades</label>
            <input type="range" min="0" max="100" defaultValue="60" className="flex-1" />
            <span className="text-sm font-medium text-gray-800 w-12">60%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700 w-48">Peso de criterios</label>
            <input type="range" min="0" max="100" defaultValue="20" className="flex-1" />
            <span className="text-sm font-medium text-gray-800 w-12">20%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700 w-48">Peso de SDA</label>
            <input type="range" min="0" max="100" defaultValue="10" className="flex-1" />
            <span className="text-sm font-medium text-gray-800 w-12">10%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700 w-48">Peso de recuperación</label>
            <input type="range" min="0" max="100" defaultValue="10" className="flex-1" />
            <span className="text-sm font-medium text-gray-800 w-12">10%</span>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" /> Privacidad y protección de datos
        </h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Información sobre tratamiento de datos</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• <strong>Datos almacenados:</strong> Datos académicos de alumnos (nombre, apellidos, calificaciones)</li>
              <li>• <strong>Finalidad:</strong> Gestión docente y evaluación del proceso de enseñanza-aprendizaje</li>
              <li>• <strong>Responsable:</strong> IES Lope de Vega — Santa María de Cayón</li>
              <li>• <strong>Acceso:</strong> Únicamente el profesorado asignado a cada grupo</li>
              <li>• <strong>Base legal:</strong> Cumplimiento de una misión de interés público (educación)</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="font-medium text-yellow-800 mb-2">Aviso importante</h3>
            <p className="text-yellow-700">
              Esta aplicación está preparada para cumplir con el RGPD y la LOPDGDD, pero es responsabilidad del centro educativo
              adaptar su uso a las políticas y obligaciones concretas de protección de datos. Consulte con el DPD del centro.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" /> Exportar datos
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
              <Trash2 className="w-4 h-4" /> Eliminar datos
            </button>
          </div>
        </div>
      </div>

      {/* Technical Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-600" /> Información técnica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Versión</p>
            <p className="font-medium text-gray-800">1.0.0</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Base de datos</p>
            <p className="font-medium text-gray-800">Supabase (PostgreSQL)</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Backend</p>
            <p className="font-medium text-gray-800">API REST + RLS</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Frontend</p>
            <p className="font-medium text-gray-800">React + TypeScript + Tailwind</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-600" /> Mi cuenta
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 w-32">Nombre:</span>
            <span className="font-medium text-gray-800">{currentUser?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 w-32">Email:</span>
            <span className="font-medium text-gray-800">{currentUser?.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 w-32">Rol:</span>
            <span className="font-medium text-gray-800 capitalize">{currentUser?.role === 'admin' ? 'Administrador' : 'Profesor'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
