import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { subjects, groups, allLearningSituations, teacherSubjectGroups, allEvaluationCriteria, allSpecificCompetencies, basicKnowledgeItems } from '../data/seed';
import { Activity as ActivityIcon, Plus, Filter, Calendar, Target, Edit, X, Save } from 'lucide-react';
import { Activity } from '../types';

export const ActivitiesPage: React.FC = () => {
  const { currentUser, activities, updateActivity, addActivity } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const myActivities = activities.filter(a => mySubjectIds.includes(a.subjectId));

  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editForm, setEditForm] = useState<Partial<Activity>>({});
  
  // Estado para el formulario de nueva actividad
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    sessions: 1,
    type: 'theoretical',
    learningSituationId: '',
    subjectId: mySubjectIds[0] || '',
    groupId: '',
    evaluationPeriod: '1',
    criterionIds: [],
    basicKnowledgeIds: [],
    evaluationInstrument: '',
    weight: 10,
    maxScore: 10,
    observations: ''
  });

  const filteredActivities = myActivities.filter(a => {
    if (filterSubject !== 'all' && a.subjectId !== filterSubject) return false;
    if (filterPeriod !== 'all' && a.evaluationPeriod !== filterPeriod) return false;
    return true;
  });

  const typeLabels: Record<string, string> = {
    theoretical: 'Teórica',
    practical: 'Práctica',
    individual: 'Individual',
    cooperative: 'Cooperativa',
    digital: 'Digital',
    final_product: 'Producto final',
    recovery: 'Recuperación'
  };

  const typeColors: Record<string, string> = {
    theoretical: 'bg-blue-100 text-blue-700',
    practical: 'bg-green-100 text-green-700',
    individual: 'bg-yellow-100 text-yellow-700',
    cooperative: 'bg-purple-100 text-purple-700',
    digital: 'bg-cyan-100 text-cyan-700',
    final_product: 'bg-orange-100 text-orange-700',
    recovery: 'bg-red-100 text-red-700'
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setEditForm({ ...activity });
  };

  const closeEditModal = () => {
    setEditingActivity(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    if (editingActivity && editForm) {
      updateActivity({ ...editingActivity, ...editForm } as Activity);
      closeEditModal();
    }
  };

  const toggleArrayItem = (field: 'criterionIds' | 'basicKnowledgeIds', itemId: string) => {
    const currentArray = editForm[field] || [];
    const newArray = currentArray.includes(itemId)
      ? currentArray.filter(id => id !== itemId)
      : [...currentArray, itemId];
    setEditForm({ ...editForm, [field]: newArray });
  };

  const handleCreateActivity = () => {
    if (!newActivity.name || !newActivity.subjectId || !newActivity.groupId) {
      alert('Por favor, completa los campos obligatorios: Nombre, Materia y Grupo');
      return;
    }

    const activity: Activity = {
      id: `act-new-${Date.now()}`,
      name: newActivity.name || '',
      description: newActivity.description || '',
      date: newActivity.date || new Date().toISOString().split('T')[0],
      sessions: newActivity.sessions || 1,
      type: newActivity.type || 'theoretical',
      learningSituationId: newActivity.learningSituationId || '',
      subjectId: newActivity.subjectId || '',
      groupId: newActivity.groupId || '',
      evaluationPeriod: newActivity.evaluationPeriod || '1',
      criterionIds: newActivity.criterionIds || [],
      basicKnowledgeIds: newActivity.basicKnowledgeIds || [],
      evaluationInstrument: newActivity.evaluationInstrument || '',
      weight: newActivity.weight || 10,
      maxScore: newActivity.maxScore || 10,
      observations: newActivity.observations || ''
    };

    addActivity(activity);
    
    // Reset form
    setNewActivity({
      name: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      sessions: 1,
      type: 'theoretical',
      learningSituationId: '',
      subjectId: mySubjectIds[0] || '',
      groupId: '',
      evaluationPeriod: '1',
      criterionIds: [],
      basicKnowledgeIds: [],
      evaluationInstrument: '',
      weight: 10,
      maxScore: 10,
      observations: ''
    });
    setShowForm(false);
  };

  // Obtener grupos disponibles para la materia seleccionada
  const availableGroupsForNew = groups.filter(g => 
    myAssignments.some(a => a.subjectId === newActivity.subjectId && a.groupId === g.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Actividades</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de actividades por materia y evaluación</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva actividad
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Todas las materias</option>
            {mySubjectIds.map(sid => {
              const sub = subjects.find(s => s.id === sid);
              return <option key={sid} value={sid}>{sub?.name}</option>;
            })}
          </select>
          <select
            value={filterPeriod}
            onChange={e => setFilterPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Todas las evaluaciones</option>
            <option value="1">1ª Evaluación</option>
            <option value="2">2ª Evaluación</option>
            <option value="3">3ª Evaluación</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filteredActivities.length} actividades</span>
        </div>
      </div>

      {/* New Activity Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Crear nueva actividad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input 
                type="text" 
                value={newActivity.name || ''}
                onChange={e => setNewActivity({ ...newActivity, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                placeholder="Nombre de la actividad" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materia *</label>
              <select 
                value={newActivity.subjectId || ''}
                onChange={e => {
                  const subjectId = e.target.value;
                  const firstGroup = myAssignments.find(a => a.subjectId === subjectId)?.groupId || '';
                  setNewActivity({ ...newActivity, subjectId, groupId: firstGroup });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Seleccionar materia</option>
                {mySubjectIds.map(sid => {
                  const sub = subjects.find(s => s.id === sid);
                  return <option key={sid} value={sid}>{sub?.name}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo *</label>
              <select 
                value={newActivity.groupId || ''}
                onChange={e => setNewActivity({ ...newActivity, groupId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Seleccionar grupo</option>
                {availableGroupsForNew.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Evaluación</label>
              <select 
                value={newActivity.evaluationPeriod || '1'}
                onChange={e => setNewActivity({ ...newActivity, evaluationPeriod: e.target.value as '1' | '2' | '3' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="1">1ª Evaluación</option>
                <option value="2">2ª Evaluación</option>
                <option value="3">3ª Evaluación</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input 
                type="date" 
                value={newActivity.date || ''}
                onChange={e => setNewActivity({ ...newActivity, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select 
                value={newActivity.type || 'theoretical'}
                onChange={e => setNewActivity({ ...newActivity, type: e.target.value as Activity['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sesiones</label>
              <input 
                type="number" 
                min="1" 
                value={newActivity.sessions || 1}
                onChange={e => setNewActivity({ ...newActivity, sessions: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={newActivity.weight || 10}
                onChange={e => setNewActivity({ ...newActivity, weight: parseFloat(e.target.value) || 10 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación máxima</label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={newActivity.maxScore || 10}
                onChange={e => setNewActivity({ ...newActivity, maxScore: parseFloat(e.target.value) || 10 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instrumento de evaluación</label>
              <input 
                type="text" 
                value={newActivity.evaluationInstrument || ''}
                onChange={e => setNewActivity({ ...newActivity, evaluationInstrument: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Ej: Rúbrica, prueba práctica, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Situación de aprendizaje</label>
              <select 
                value={newActivity.learningSituationId || ''}
                onChange={e => setNewActivity({ ...newActivity, learningSituationId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Sin asignar</option>
                {allLearningSituations
                  .filter(s => s.subjectId === newActivity.subjectId)
                  .map(sda => (
                    <option key={sda.id} value={sda.id}>{sda.title}</option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea 
                rows={2} 
                value={newActivity.description || ''}
                onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                placeholder="Descripción de la actividad" 
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleCreateActivity}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
            <button 
              onClick={() => setShowForm(false)} 
              className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-3">
        {filteredActivities.map(activity => {
          const subject = subjects.find(s => s.id === activity.subjectId);
          const sda = allLearningSituations.find(s => s.id === activity.learningSituationId);
          const criteria = activity.criterionIds.map(cid => allEvaluationCriteria.find(c => c.id === cid)).filter(Boolean);

          return (
            <div key={activity.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[activity.type] || 'bg-gray-100'}`}>
                  <ActivityIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-gray-800">{activity.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{subject?.name} • {sda?.title}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[activity.type]}`}>
                        {typeLabels[activity.type]}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {activity.evaluationPeriod}ª Eval.
                      </span>
                      <button
                        onClick={() => openEditModal(activity)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {activity.date}</span>
                    <span>{activity.sessions} sesiones</span>
                    <span>Peso: {activity.weight}%</span>
                    <span>Máx: {activity.maxScore} pts</span>
                  </div>
                  {criteria.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {criteria.map(c => (
                        <span key={c!.id} className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] rounded">
                          {c!.code}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No se encontraron actividades con los filtros seleccionados</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Editar Actividad</h3>
                <p className="text-sm text-gray-500">{editingActivity.name}</p>
              </div>
              <button onClick={closeEditModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={editForm.type || 'theoretical'}
                    onChange={e => setEditForm({ ...editForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={editForm.date || ''}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evaluación</label>
                  <select
                    value={editForm.evaluationPeriod || '1'}
                    onChange={e => setEditForm({ ...editForm, evaluationPeriod: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1ª Evaluación</option>
                    <option value="2">2ª Evaluación</option>
                    <option value="3">3ª Evaluación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sesiones</label>
                  <input
                    type="number"
                    value={editForm.sessions || 1}
                    onChange={e => setEditForm({ ...editForm, sessions: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (%)</label>
                  <input
                    type="number"
                    value={editForm.weight || 0}
                    onChange={e => setEditForm({ ...editForm, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación máxima</label>
                  <input
                    type="number"
                    value={editForm.maxScore || 10}
                    onChange={e => setEditForm({ ...editForm, maxScore: parseFloat(e.target.value) || 10 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instrumento de evaluación</label>
                  <input
                    type="text"
                    value={editForm.evaluationInstrument || ''}
                    onChange={e => setEditForm({ ...editForm, evaluationInstrument: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Rúbrica, prueba práctica, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={editForm.observations || ''}
                  onChange={e => setEditForm({ ...editForm, observations: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* Criterios de evaluación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criterios de evaluación</label>
                <div className="flex flex-wrap gap-2">
                  {allEvaluationCriteria
                    .filter(c => c.subjectId === editingActivity.subjectId)
                    .map(c => {
                      const isSelected = editForm.criterionIds?.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleArrayItem('criterionIds', c.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {c.code}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Saberes básicos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saberes básicos</label>
                <div className="flex flex-wrap gap-2">
                  {basicKnowledgeItems
                    .filter(bk => bk.subjectId === editingActivity.subjectId)
                    .map(bk => {
                      const isSelected = editForm.basicKnowledgeIds?.includes(bk.id);
                      return (
                        <button
                          key={bk.id}
                          type="button"
                          onClick={() => toggleArrayItem('basicKnowledgeIds', bk.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {bk.code}
                        </button>
                      );
                    })}
                </div>
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
