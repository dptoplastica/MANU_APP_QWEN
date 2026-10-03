import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { users, subjects, groups, students, departments, teacherSubjectGroups, academicYears } from '../data/seed';
import { Shield, Users, BookOpen, GraduationCap, Link2, Calendar, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export const Admin: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects' | 'groups' | 'students' | 'assignments' | 'years'>('teachers');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No tienes permisos de administrador</p>
      </div>
    );
  }

  const tabs = [
    { id: 'teachers' as const, label: 'Profesores', icon: Users },
    { id: 'subjects' as const, label: 'Materias', icon: BookOpen },
    { id: 'groups' as const, label: 'Grupos', icon: GraduationCap },
    { id: 'students' as const, label: 'Alumnos', icon: Users },
    { id: 'assignments' as const, label: 'Asignaciones', icon: Link2 },
    { id: 'years' as const, label: 'Cursos académicos', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
        <p className="text-sm text-gray-500 mt-1">Gestión del centro educativo</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Teachers */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Profesores</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Nombre</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Rol</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-50">
                    <td className="py-2 px-4 font-medium text-gray-800">{user.name}</td>
                    <td className="py-2 px-4 text-gray-600">{user.email}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role === 'admin' ? 'Administrador' : 'Profesor'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      {user.active ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Activo</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Inactivo</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                        <button className="p-1 hover:bg-gray-100 rounded"><ToggleRight className="w-4 h-4 text-green-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subjects */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Materias</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Nombre</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Curso</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Modalidad</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Departamento</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(sub => {
                  const dept = departments.find(d => d.id === sub.departmentId);
                  return (
                    <tr key={sub.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 font-medium text-gray-800">{sub.name}</td>
                      <td className="py-2 px-4 text-gray-600">{sub.course}</td>
                      <td className="py-2 px-4 text-gray-600">{sub.modality}</td>
                      <td className="py-2 px-4 text-gray-600">{dept?.name}</td>
                      <td className="py-2 px-4 text-center">
                        <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Groups */}
      {activeTab === 'groups' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Grupos</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Nombre</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Curso</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Alumnos</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(group => {
                  const count = students.filter(s => s.groupId === group.id).length;
                  return (
                    <tr key={group.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 font-medium text-gray-800">{group.name}</td>
                      <td className="py-2 px-4 text-gray-600">{group.course}</td>
                      <td className="py-2 px-4 text-center text-gray-600">{count}</td>
                      <td className="py-2 px-4 text-center">
                        <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Students */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Alumnos ({students.length})</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                Importar CSV
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                <Plus className="w-4 h-4" /> Añadir
              </button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Nombre</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Apellidos</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Grupo</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const group = groups.find(g => g.id === student.groupId);
                  return (
                    <tr key={student.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 text-gray-800">{student.firstName}</td>
                      <td className="py-2 px-4 text-gray-600">{student.lastName}</td>
                      <td className="py-2 px-4 text-gray-600">{group?.name}</td>
                      <td className="py-2 px-4 text-center">
                        <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Asignaciones Profesor-Materia-Grupo</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Nueva asignación
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Profesor</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Materia</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Grupo</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teacherSubjectGroups.map(tsg => {
                  const teacher = users.find(u => u.id === tsg.teacherId);
                  const subject = subjects.find(s => s.id === tsg.subjectId);
                  const group = groups.find(g => g.id === tsg.groupId);
                  return (
                    <tr key={tsg.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 text-gray-800">{teacher?.name}</td>
                      <td className="py-2 px-4 text-gray-600">{subject?.name}</td>
                      <td className="py-2 px-4 text-gray-600">{group?.name}</td>
                      <td className="py-2 px-4 text-center">
                        <button className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Academic Years */}
      {activeTab === 'years' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Cursos académicos</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Nuevo curso
            </button>
          </div>
          <div className="p-4 space-y-3">
            {academicYears.map(year => (
              <div key={year.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-800">{year.name}</span>
                </div>
                {year.active && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Activo</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
