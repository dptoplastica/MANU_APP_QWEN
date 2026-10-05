import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { subjects, departments, teacherSubjectGroups } from '../data/seed';
import { ClipboardList, Edit, X, Save } from 'lucide-react';
import { Programme } from '../types';

export const Programmes: React.FC = () => {
  const { currentUser, programmes, updateProgramme } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const myProgrammes = programmes.filter(p => mySubjectIds.includes(p.subjectId));

  const [editingProgramme, setEditingProgramme] = useState<Programme | null>(null);
  const [editForm, setEditForm] = useState<Partial<Programme>>({});
  const [activeSection, setActiveSection] = useState<string>('introduction');

  const openEditModal = (prog: Programme) => {
    setEditingProgramme(prog);
    setEditForm({ ...prog });
    setActiveSection('introduction');
  };

  const closeEditModal = () => {
    setEditingProgramme(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    if (editingProgramme && editForm) {
      updateProgramme({ ...editingProgramme, ...editForm } as Programme);
      closeEditModal();
    }
  };

  const sections = [
    { id: 'introduction', label: 'Introducción', field: 'introduction' },
    { id: 'context', label: 'Contextualización', field: 'context' },
    { id: 'legalFramework', label: 'Marco normativo', field: 'legalFramework' },
    { id: 'keyCompetencies', label: 'Competencias clave', field: 'keyCompetencies' },
    { id: 'specificCompetencies', label: 'Competencias específicas', field: 'specificCompetencies' },
    { id: 'evaluationCriteria', label: 'Criterios de evaluación', field: 'evaluationCriteria' },
    { id: 'basicKnowledge', label: 'Saberes básicos', field: 'basicKnowledge' },
    { id: 'methodology', label: 'Metodología', field: 'methodology' },
    { id: 'diversity', label: 'Atención a la diversidad', field: 'diversity' },
    { id: 'evaluation', label: 'Evaluación', field: 'evaluation' },
    { id: 'evaluationInstruments', label: 'Instrumentos de evaluación', field: 'evaluationInstruments' },
    { id: 'recovery', label: 'Recuperación', field: 'recovery' },
    { id: 'complementaryActivities', label: 'Actividades complementarias', field: 'complementaryActivities' },
    { id: 'timing', label: 'Temporalización', field: 'timing' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Programaciones Didácticas</h1>
        <p className="text-sm text-gray-500 mt-1">Programaciones LOMLOE de las materias asignadas</p>
      </div>

      <div className="space-y-4">
        {myProgrammes.map(prog => {
          const subject = subjects.find(s => s.id === prog.subjectId);
          const dept = departments.find(d => d.id === subject?.departmentId);
          return (
            <div key={prog.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 text-lg">{subject?.name}</h2>
                    <p className="text-sm text-gray-500">{subject?.course} • {dept?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(prog)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" /> Editar
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Introducción</h4>
                    <p className="text-sm text-gray-600">{prog.introduction}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Contextualización</h4>
                    <p className="text-sm text-gray-600">{prog.context}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Marco normativo</h4>
                    <p className="text-sm text-gray-600">{prog.legalFramework}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Metodología</h4>
                    <p className="text-sm text-gray-600">{prog.methodology}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Evaluación</h4>
                    <p className="text-sm text-gray-600">{prog.evaluation}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Instrumentos de evaluación</h4>
                    <p className="text-sm text-gray-600">{prog.evaluationInstruments}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Atención a la diversidad</h4>
                    <p className="text-sm text-gray-600">{prog.diversity}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Recuperación</h4>
                    <p className="text-sm text-gray-600">{prog.recovery}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Competencias clave</h4>
                    <p className="text-sm text-gray-600">{prog.keyCompetencies}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Actividades complementarias</h4>
                    <p className="text-sm text-gray-600">{prog.complementaryActivities}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingProgramme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Editar Programación Didáctica</h3>
                <p className="text-sm text-gray-500">{subjects.find(s => s.id === editingProgramme.subjectId)?.name}</p>
              </div>
              <button onClick={closeEditModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex max-h-[75vh]">
              {/* Sidebar de secciones */}
              <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto p-3 space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Contenido */}
              <div className="flex-1 p-6 overflow-y-auto">
                {sections.map(section => {
                  if (activeSection !== section.id) return null;
                  const field = section.field as keyof Programme;
                  return (
                    <div key={section.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {section.label}
                      </label>
                      <textarea
                        value={(editForm[field] as string) || ''}
                        onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                        rows={10}
                        placeholder={`Escribe el contenido de ${section.label.toLowerCase()}...`}
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Este contenido aparecerá en la programación didáctica de la materia.
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-xl">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Save className="w-4 h-4" />
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
