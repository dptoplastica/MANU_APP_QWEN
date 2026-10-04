import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import * as seed from '../data/seed';
import { User, Subject, Group, Student, TeacherSubjectGroup } from '../types';
import { Shield, Users, BookOpen, GraduationCap, Link2, Calendar, Plus, Edit, Trash2, X, Save } from 'lucide-react';

export const Admin: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects' | 'groups' | 'students' | 'assignments' | 'years'>('teachers');
  
  // Estados para datos editables
  const [usersList, setUsersList] = useState<User[]>(seed.users);
  const [subjectsList, setSubjectsList] = useState<Subject[]>(seed.subjects);
  const [groupsList, setGroupsList] = useState<Group[]>(seed.groups);
  const [studentsList, setStudentsList] = useState<Student[]>(seed.students);
  const [assignmentsList, setAssignmentsList] = useState<TeacherSubjectGroup[]>(seed.teacherSubjectGroups);
  
  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'edit' | 'create'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

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

  const openCreateModal = (type: string) => {
    setModalType('create');
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (item: any, type: string) => {
    setModalType('edit');
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (modalType === 'create') {
      // Crear nuevo
      const newItem = { ...formData, id: `new-${Date.now()}` };
      
      switch (activeTab) {
        case 'teachers':
          setUsersList([...usersList, newItem]);
          break;
        case 'subjects':
          setSubjectsList([...subjectsList, newItem]);
          break;
        case 'groups':
          setGroupsList([...groupsList, newItem]);
          break;
        case 'students':
          setStudentsList([...studentsList, newItem]);
          break;
        case 'assignments':
          setAssignmentsList([...assignmentsList, newItem]);
          break;
      }
    } else {
      // Editar existente
      switch (activeTab) {
        case 'teachers':
          setUsersList(usersList.map(u => u.id === editingItem.id ? { ...editingItem, ...formData } : u));
          break;
        case 'subjects':
          setSubjectsList(subjectsList.map(s => s.id === editingItem.id ? { ...editingItem, ...formData } : s));
          break;
        case 'groups':
          setGroupsList(groupsList.map(g => g.id === editingItem.id ? { ...editingItem, ...formData } : g));
          break;
        case 'students':
          setStudentsList(studentsList.map(s => s.id === editingItem.id ? { ...editingItem, ...formData } : s));
          break;
        case 'assignments':
          setAssignmentsList(assignmentsList.map(a => a.id === editingItem.id ? { ...editingItem, ...formData } : a));
          break;
      }
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
    
    switch (activeTab) {
      case 'teachers':
        setUsersList(usersList.filter(u => u.id !== id));
        break;
      case 'subjects':
        setSubjectsList(subjectsList.filter(s => s.id !== id));
        break;
      case 'groups':
        setGroupsList(groupsList.filter(g => g.id !== id));
        break;
      case 'students':
        setStudentsList(studentsList.filter(s => s.id !== id));
        break;
      case 'assignments':
        setAssignmentsList(assignmentsList.filter(a => a.id !== id));
        break;
    }
  };

  const handleToggleActive = (id: string) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

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
            <button 
              onClick={() => openCreateModal('teacher')}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >
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
                {usersList.map(user => (
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
                        <button 
                          onClick={() => openEditModal(user, 'teacher')}
                          className="p-1 hover:bg-blue-50 rounded text-blue-600"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleActive(user.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title={user.active ? 'Desactivar' : 'Activar'}
                        >
                          {user.active ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className="text-red-500">✗</span>
                          )}
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <button 
              onClick={() => openCreateModal('subject')}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >
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
                {subjectsList.map(sub => {
                  const dept = seed.departments.find(d => d.id === sub.departmentId);
                  return (
                    <tr key={sub.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 font-medium text-gray-800">{sub.name}</td>
                      <td className="py-2 px-4 text-gray-600">{sub.course}</td>
                      <td className="py-2 px-4 text-gray-600">{sub.modality}</td>
                      <td className="py-2 px-4 text-gray-600">{dept?.name}</td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => openEditModal(sub, 'subject')}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(sub.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            <button 
              onClick={() => openCreateModal('group')}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >
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
                {groupsList.map(group => {
                  const count = studentsList.filter(s => s.groupId === group.id).length;
                  return (
                    <tr key={group.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 font-medium text-gray-800">{group.name}</td>
                      <td className="py-2 px-4 text-gray-600">{group.course}</td>
                      <td className="py-2 px-4 text-center text-gray-600">{count}</td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => openEditModal(group, 'group')}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(group.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            <h2 className="font-semibold text-gray-800">Alumnos ({studentsList.length})</h2>
            <button 
              onClick={() => openCreateModal('student')}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" /> Añadir
            </button>
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
                {studentsList.map(student => {
                  const group = groupsList.find(g => g.id === student.groupId);
                  return (
                    <tr key={student.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 text-gray-800">{student.firstName}</td>
                      <td className="py-2 px-4 text-gray-600">{student.lastName}</td>
                      <td className="py-2 px-4 text-gray-600">{group?.name}</td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => openEditModal(student, 'student')}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            <button 
              onClick={() => openCreateModal('assignment')}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >
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
                {assignmentsList.map(tsg => {
                  const teacher = usersList.find(u => u.id === tsg.teacherId);
                  const subject = subjectsList.find(s => s.id === tsg.subjectId);
                  const group = groupsList.find(g => g.id === tsg.groupId);
                  return (
                    <tr key={tsg.id} className="border-b border-gray-50">
                      <td className="py-2 px-4 text-gray-800">{teacher?.name || 'Sin asignar'}</td>
                      <td className="py-2 px-4 text-gray-600">{subject?.name || 'Sin asignar'}</td>
                      <td className="py-2 px-4 text-gray-600">{group?.name || 'Sin asignar'}</td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => openEditModal(tsg, 'assignment')}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tsg.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            {seed.academicYears.map(year => (
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalType === 'create' ? 'Crear nuevo' : 'Editar'} {
                  activeTab === 'teachers' ? 'profesor' :
                  activeTab === 'subjects' ? 'materia' :
                  activeTab === 'groups' ? 'grupo' :
                  activeTab === 'students' ? 'alumno' :
                  'asignación'
                }
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Teacher Form */}
              {activeTab === 'teachers' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Nombre del profesor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select
                      value={formData.role || 'teacher'}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="teacher">Profesor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </>
              )}

              {/* Subject Form */}
              {activeTab === 'subjects' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Nombre de la materia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                    <input
                      type="text"
                      value={formData.course || ''}
                      onChange={e => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="1º Bachillerato"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                    <input
                      type="text"
                      value={formData.modality || ''}
                      onChange={e => setFormData({ ...formData, modality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Bachillerato, Optativa, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <select
                      value={formData.departmentId || ''}
                      onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar departamento</option>
                      {seed.departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Group Form */}
              {activeTab === 'groups' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="1º Bachillerato A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                    <input
                      type="text"
                      value={formData.course || ''}
                      onChange={e => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="1º Bachillerato"
                    />
                  </div>
                </>
              )}

              {/* Student Form */}
              {activeTab === 'students' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Nombre del alumno"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Apellidos del alumno"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                    <select
                      value={formData.groupId || ''}
                      onChange={e => setFormData({ ...formData, groupId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar grupo</option>
                      {groupsList.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                      value={formData.observations || ''}
                      onChange={e => setFormData({ ...formData, observations: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Observaciones sobre el alumno"
                    />
                  </div>
                </>
              )}

              {/* Assignment Form */}
              {activeTab === 'assignments' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
                    <select
                      value={formData.teacherId || ''}
                      onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar profesor</option>
                      {usersList.filter(u => u.role === 'teacher').map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                    <select
                      value={formData.subjectId || ''}
                      onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar materia</option>
                      {subjectsList.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                    <select
                      value={formData.groupId || ''}
                      onChange={e => setFormData({ ...formData, groupId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar grupo</option>
                      {groupsList.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Save className="w-4 h-4" />
                {modalType === 'create' ? 'Crear' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
