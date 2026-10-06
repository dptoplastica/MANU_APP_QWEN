import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import * as seed from '../data/seed';
import { User, Subject, Group, Student, TeacherSubjectGroup } from '../types';
import { Shield, Users, BookOpen, GraduationCap, Link2, Calendar, Plus, Edit, Trash2, X, Save, Upload, FileText, Download } from 'lucide-react';

export const Admin: React.FC = () => {
  const { 
    currentUser,
    groups: contextGroups,
    students: contextStudents,
    teacherSubjectGroups: contextAssignments,
    createGroup,
    updateGroup,
    deleteGroup,
    createStudent,
    updateStudent,
    deleteStudent,
    createAssignment,
    updateAssignment,
    deleteAssignment
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects' | 'groups' | 'students' | 'assignments' | 'years'>('teachers');
  
  // Estados para datos editables
  const [usersList, setUsersList] = useState<User[]>(seed.users);
  const [subjectsList, setSubjectsList] = useState<Subject[]>(seed.subjects);
  const [groupsList, setGroupsList] = useState<Group[]>(contextGroups);
  const [studentsList, setStudentsList] = useState<Student[]>(contextStudents);
  const [assignmentsList, setAssignmentsList] = useState<TeacherSubjectGroup[]>(contextAssignments);

  // Sincronizar estados locales con el contexto cuando cambien
  useEffect(() => {
    setGroupsList(contextGroups);
  }, [contextGroups]);

  useEffect(() => {
    setStudentsList(contextStudents);
  }, [contextStudents]);

  useEffect(() => {
    setAssignmentsList(contextAssignments);
  }, [contextAssignments]);
  
  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'edit' | 'create'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Estados para importación CSV
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvData, setCsvData] = useState<Array<{nombre: string; apellidos: string; grupo: string}>>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [selectedGroupForImport, setSelectedGroupForImport] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    if (modalType === 'create') {
      // Crear nuevo
      const newItem = { ...formData, id: `new-${Date.now()}` };
      
      switch (activeTab) {
        case 'teachers':
          setUsersList([...usersList, newItem]);
          closeModal();
          break;
        case 'subjects':
          setSubjectsList([...subjectsList, newItem]);
          closeModal();
          break;
        case 'groups':
          console.log('Creating group:', newItem);
          const createdGroup = await createGroup(newItem as Group);
          console.log('Created group result:', createdGroup);
          if (createdGroup) {
            setGroupsList([...groupsList, createdGroup]);
            closeModal();
          } else {
            alert('Error al crear el grupo. Verifica que todos los campos estén completos y que tengas permisos de administrador.');
          }
          break;
        case 'students':
          const createdStudent = await createStudent(newItem as Student);
          if (createdStudent) {
            setStudentsList([...studentsList, createdStudent]);
            closeModal();
          } else {
            alert('Error al crear el alumno. Verifica que todos los campos estén completos.');
          }
          break;
        case 'assignments':
          console.log('Creating assignment - formData:', formData);
          console.log('Creating assignment - newItem:', newItem);
          
          // Validar que todos los campos requeridos estén presentes
          if (!newItem.teacherId || !newItem.subjectId || !newItem.groupId) {
            alert('Error: Debes seleccionar un profesor, una materia y un grupo.');
            return;
          }
          
          const createdAssignment = await createAssignment(newItem as TeacherSubjectGroup);
          console.log('Created assignment result:', createdAssignment);
          if (createdAssignment) {
            setAssignmentsList([...assignmentsList, createdAssignment]);
            closeModal();
          } else {
            alert('Error al crear la asignación. Verifica la consola del navegador para más detalles.');
          }
          break;
      }
    } else {
      // Editar existente
      switch (activeTab) {
        case 'teachers':
          setUsersList(usersList.map(u => u.id === editingItem.id ? { ...editingItem, ...formData } : u));
          closeModal();
          break;
        case 'subjects':
          setSubjectsList(subjectsList.map(s => s.id === editingItem.id ? { ...editingItem, ...formData } : s));
          closeModal();
          break;
        case 'groups':
          const updatedGroup = { ...editingItem, ...formData };
          console.log('Updating group:', updatedGroup);
          const successUpdateGroup = await updateGroup(updatedGroup);
          console.log('Update group result:', successUpdateGroup);
          setGroupsList(groupsList.map(g => g.id === editingItem.id ? updatedGroup : g));
          closeModal();
          break;
        case 'students':
          const updatedStudent = { ...editingItem, ...formData };
          const successUpdateStudent = await updateStudent(updatedStudent);
          if (successUpdateStudent) {
            setStudentsList(studentsList.map(s => s.id === editingItem.id ? updatedStudent : s));
            closeModal();
          }
          break;
        case 'assignments':
          const updatedAssignment = { ...editingItem, ...formData };
          console.log('Updating assignment:', updatedAssignment);
          const successUpdateAssignment = await updateAssignment(updatedAssignment);
          console.log('Update assignment result:', successUpdateAssignment);
          setAssignmentsList(assignmentsList.map(a => a.id === editingItem.id ? updatedAssignment : a));
          closeModal();
          break;
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
    
    switch (activeTab) {
      case 'teachers':
        setUsersList(usersList.filter(u => u.id !== id));
        break;
      case 'subjects':
        setSubjectsList(subjectsList.filter(s => s.id !== id));
        break;
      case 'groups':
        const successDeleteGroup = await deleteGroup(id);
        if (successDeleteGroup) {
          setGroupsList(groupsList.filter(g => g.id !== id));
        }
        break;
      case 'students':
        const successDeleteStudent = await deleteStudent(id);
        if (successDeleteStudent) {
          setStudentsList(studentsList.filter(s => s.id !== id));
        }
        break;
      case 'assignments':
        const successDeleteAssignment = await deleteAssignment(id);
        if (successDeleteAssignment) {
          setAssignmentsList(assignmentsList.filter(a => a.id !== id));
        }
        break;
    }
  };

  const handleToggleActive = (id: string) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  // Funciones para importación CSV
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    const data: Array<{nombre: string; apellidos: string; grupo: string}> = [];

    if (lines.length < 2) {
      errors.push('El archivo CSV debe tener al menos una cabecera y una fila de datos');
      setCsvErrors(errors);
      setCsvData([]);
      return;
    }

    // Detectar separador (coma, punto y coma, tabulación)
    const firstLine = lines[0];
    let separator = ',';
    if (firstLine.includes(';')) separator = ';';
    else if (firstLine.includes('\t')) separator = '\t';

    // Parsear cabecera
    const headers = lines[0].split(separator).map(h => h.trim().toLowerCase());
    
    // Buscar índices de columnas
    const nombreIdx = headers.findIndex(h => h.includes('nombre') || h.includes('name'));
    const apellidosIdx = headers.findIndex(h => h.includes('apellido') || h.includes('surname') || h.includes('last'));
    const grupoIdx = headers.findIndex(h => h.includes('grupo') || h.includes('group') || h.includes('clase'));

    if (nombreIdx === -1) {
      errors.push('No se encontró la columna "nombre" en el CSV');
    }
    if (apellidosIdx === -1) {
      errors.push('No se encontró la columna "apellidos" en el CSV');
    }

    if (errors.length > 0) {
      setCsvErrors(errors);
      setCsvData([]);
      return;
    }

    // Parsear datos
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(separator).map(c => c.trim());
      
      if (columns.length < Math.max(nombreIdx, apellidosIdx) + 1) {
        errors.push(`Línea ${i + 1}: formato incorrecto`);
        continue;
      }

      const nombre = columns[nombreIdx] || '';
      const apellidos = columns[apellidosIdx] || '';
      const grupo = grupoIdx !== -1 ? columns[grupoIdx] || '' : '';

      if (!nombre || !apellidos) {
        errors.push(`Línea ${i + 1}: nombre y apellidos son obligatorios`);
        continue;
      }

      data.push({ nombre, apellidos, grupo });
    }

    setCsvErrors(errors);
    setCsvData(data);
  };

  const handleImportCSV = () => {
    if (csvData.length === 0) return;

    const newStudents: Student[] = csvData.map((row, index) => {
      // Buscar grupo por nombre o usar el seleccionado
      let groupId = selectedGroupForImport;
      
      if (row.grupo && !selectedGroupForImport) {
        const foundGroup = groupsList.find(g => 
          g.name.toLowerCase().includes(row.grupo.toLowerCase()) ||
          row.grupo.toLowerCase().includes(g.name.toLowerCase())
        );
        if (foundGroup) {
          groupId = foundGroup.id;
        }
      }

      return {
        id: `student-imported-${Date.now()}-${index}`,
        firstName: row.nombre,
        lastName: row.apellidos,
        groupId: groupId || groupsList[0]?.id || '',
        observations: 'Importado desde CSV'
      };
    });

    setStudentsList([...studentsList, ...newStudents]);
    setShowImportModal(false);
    setCsvData([]);
    setCsvErrors([]);
    setSelectedGroupForImport('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadCSVTemplate = () => {
    const template = 'nombre,apellidos,grupo\nLucía,Fernández,1º Bachillerato A\nMartín,García,1º Bachillerato A\nSofía,Rodríguez,1º Bachillerato B';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_alumnos.csv';
    link.click();
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
            <div className="flex gap-2">
              <button 
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                <Upload className="w-4 h-4" /> Importar CSV
              </button>
              <button 
                onClick={() => openCreateModal('student')}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
              >
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Curso Académico</label>
                    <select
                      value={formData.academicYearId || ''}
                      onChange={e => setFormData({ ...formData, academicYearId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar curso académico</option>
                      {seed.academicYears.map(year => (
                        <option key={year.id} value={year.id}>{year.name}</option>
                      ))}
                    </select>
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

      {/* Modal de Importación CSV */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Importar alumnos desde CSV</h3>
                <p className="text-sm text-gray-500 mt-1">Sube un archivo CSV con la lista de alumnos</p>
              </div>
              <button onClick={() => {
                setShowImportModal(false);
                setCsvData([]);
                setCsvErrors([]);
                setSelectedGroupForImport('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Instrucciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Formato del archivo CSV
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  El archivo CSV debe tener las siguientes columnas (la cabecera es obligatoria):
                </p>
                <code className="block bg-blue-100 text-blue-900 px-3 py-2 rounded text-xs font-mono mb-2">
                  nombre,apellidos,grupo
                </code>
                <p className="text-xs text-blue-700">
                  • Separadores aceptados: coma (,), punto y coma (;) o tabulación<br/>
                  • La columna "grupo" es opcional (se puede asignar manualmente abajo)<br/>
                  • Se detectarán automáticamente los nombres de columnas similares
                </p>
                <button
                  onClick={downloadCSVTemplate}
                  className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  <Download className="w-3 h-3" /> Descargar plantilla de ejemplo
                </button>
              </div>

              {/* Input de archivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar archivo CSV</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-file-input"
                  />
                  <label htmlFor="csv-file-input" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-green-600">Haz clic para seleccionar</span> o arrastra un archivo CSV
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Formato: .csv</p>
                  </label>
                </div>
              </div>

              {/* Errores */}
              {csvErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Errores encontrados:</h4>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {csvErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Vista previa de datos */}
              {csvData.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">
                      Vista previa ({csvData.length} alumnos encontrados)
                    </h4>
                  </div>

                  {/* Selector de grupo por defecto */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grupo por defecto (si no se especifica en el CSV)
                    </label>
                    <select
                      value={selectedGroupForImport}
                      onChange={e => setSelectedGroupForImport(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Detectar automáticamente del CSV</option>
                      {groupsList.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tabla de vista previa */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">#</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Nombre</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Apellidos</th>
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Grupo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.map((row, idx) => {
                          const matchedGroup = row.grupo 
                            ? groupsList.find(g => 
                                g.name.toLowerCase().includes(row.grupo.toLowerCase()) ||
                                row.grupo.toLowerCase().includes(g.name.toLowerCase())
                              )
                            : null;
                          
                          return (
                            <tr key={idx} className="border-t border-gray-100">
                              <td className="py-2 px-3 text-gray-500">{idx + 1}</td>
                              <td className="py-2 px-3 text-gray-800">{row.nombre}</td>
                              <td className="py-2 px-3 text-gray-800">{row.apellidos}</td>
                              <td className="py-2 px-3">
                                {row.grupo ? (
                                  matchedGroup ? (
                                    <span className="text-green-700 text-xs">{matchedGroup.name}</span>
                                  ) : (
                                    <span className="text-orange-600 text-xs">
                                      "{row.grupo}" (no encontrado)
                                    </span>
                                  )
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    {selectedGroupForImport 
                                      ? groupsList.find(g => g.id === selectedGroupForImport)?.name 
                                      : 'Sin asignar'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setCsvData([]);
                  setCsvErrors([]);
                  setSelectedGroupForImport('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportCSV}
                disabled={csvData.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                Importar {csvData.length > 0 ? `${csvData.length} alumnos` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
