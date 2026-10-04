import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { subjects, allActivities, allSpecificCompetencies, allEvaluationCriteria, keyCompetencies, teacherSubjectGroups, basicKnowledgeItems } from '../data/seed';
import { Target, ArrowLeft, Activity, BookOpen, CheckCircle, Edit, X, Save, Plus } from 'lucide-react';
import { LearningSituation } from '../types';

export const LearningSituations: React.FC = () => {
  const { currentUser, learningSituations, updateLearningSituation } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [editingSDA, setEditingSDA] = useState<LearningSituation | null>(null);
  const [editForm, setEditForm] = useState<Partial<LearningSituation>>({});
  
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const mySubjects = subjects.filter(s => mySubjectIds.includes(s.id));
  const mySDAs = learningSituations.filter(s => mySubjectIds.includes(s.subjectId));

  // Filtrar SDA por materia seleccionada
  const filteredSDAs = selectedSubject === 'all' 
    ? mySDAs 
    : mySDAs.filter(s => s.subjectId === selectedSubject);

  // Agrupar por evaluación
  const groupedByPeriod = {
    '1': filteredSDAs.filter(s => s.evaluationPeriod === '1'),
    '2': filteredSDAs.filter(s => s.evaluationPeriod === '2'),
    '3': filteredSDAs.filter(s => s.evaluationPeriod === '3')
  };

  // Colores para cada materia
  const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
    'sub-dt1': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    'sub-podcast': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    'sub-corto': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
  };

  const openEditModal = (sda: LearningSituation) => {
    setEditingSDA(sda);
    setEditForm({ ...sda });
  };

  const closeEditModal = () => {
    setEditingSDA(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    if (editingSDA && editForm) {
      updateLearningSituation({ ...editingSDA, ...editForm } as LearningSituation);
      closeEditModal();
    }
  };

  const toggleArrayItem = (field: 'keyCompetencyIds' | 'specificCompetencyIds' | 'criterionIds' | 'basicKnowledgeIds', itemId: string) => {
    const currentArray = editForm[field] || [];
    const newArray = currentArray.includes(itemId)
      ? currentArray.filter(id => id !== itemId)
      : [...currentArray, itemId];
    setEditForm({ ...editForm, [field]: newArray });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Situaciones de Aprendizaje</h1>
        <p className="text-sm text-gray-500 mt-1">Organizadas por materia y evaluación</p>
      </div>

      {/* Tabs de materias */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSubject === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todas las materias
          </button>
          {mySubjects.map(subject => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubject === subject.id
                  ? `${subjectColors[subject.id]?.bg || 'bg-gray-100'} ${subjectColors[subject.id]?.text || 'text-gray-700'}`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {/* SDA agrupadas por evaluación */}
      {Object.entries(groupedByPeriod).map(([period, sdas]) => (
        <div key={period} className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">{period}ª Evaluación</h2>
            <span className="text-sm text-gray-500">{sdas.length} SDA{sdas.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="p-4 space-y-3">
            {sdas.map(sda => {
              const subject = subjects.find(s => s.id === sda.subjectId);
              const actCount = allActivities.filter(a => a.learningSituationId === sda.id).length;
              const colors = subjectColors[sda.subjectId] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
              
              return (
                <div
                  key={sda.id}
                  className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <Link to={`/situaciones-aprendizaje/${sda.id}`} className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Target className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-gray-800">{sda.title}</h3>
                            {selectedSubject === 'all' && (
                              <p className={`text-sm ${colors.text} mt-1 font-medium`}>{subject?.name}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full font-medium whitespace-nowrap`}>
                            {period}ª Eval.
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{sda.timing}</span>
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">{sda.sessions} sesiones</span>
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full">{actCount} actividades</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => { e.preventDefault(); openEditModal(sda); }}
                      className="ml-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {sdas.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay situaciones de aprendizaje en esta evaluación
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Mensaje si no hay SDA en total */}
      {filteredSDAs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay situaciones de aprendizaje para esta materia</p>
        </div>
      )}

      {/* Modal de edición */}
      {editingSDA && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Editar Situación de Aprendizaje</h3>
                <p className="text-sm text-gray-500">{editingSDA.title}</p>
              </div>
              <button onClick={closeEditModal} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evaluación</label>
                  <select
                    value={editForm.evaluationPeriod || '1'}
                    onChange={e => setEditForm({ ...editForm, evaluationPeriod: e.target.value as '1' | '2' | '3' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1ª Evaluación</option>
                    <option value="2">2ª Evaluación</option>
                    <option value="3">3ª Evaluación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temporalización</label>
                  <input
                    type="text"
                    value={editForm.timing || ''}
                    onChange={e => setEditForm({ ...editForm, timing: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Septiembre - Octubre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de sesiones</label>
                  <input
                    type="number"
                    value={editForm.sessions || 0}
                    onChange={e => setEditForm({ ...editForm, sessions: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Textos largos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contextualización</label>
                <textarea
                  value={editForm.context || ''}
                  onChange={e => setEditForm({ ...editForm, context: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Justificación</label>
                <textarea
                  value={editForm.justification || ''}
                  onChange={e => setEditForm({ ...editForm, justification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto final</label>
                <textarea
                  value={editForm.finalProduct || ''}
                  onChange={e => setEditForm({ ...editForm, finalProduct: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos</label>
                <textarea
                  value={editForm.objectives || ''}
                  onChange={e => setEditForm({ ...editForm, objectives: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metodología</label>
                <textarea
                  value={editForm.methodology || ''}
                  onChange={e => setEditForm({ ...editForm, methodology: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recursos</label>
                <textarea
                  value={editForm.resources || ''}
                  onChange={e => setEditForm({ ...editForm, resources: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instrumentos de evaluación</label>
                <textarea
                  value={editForm.evaluationInstruments || ''}
                  onChange={e => setEditForm({ ...editForm, evaluationInstruments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Atención a la diversidad</label>
                  <textarea
                    value={editForm.diversity || ''}
                    onChange={e => setEditForm({ ...editForm, diversity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medidas de refuerzo</label>
                  <textarea
                    value={editForm.reinforcementMeasures || ''}
                    onChange={e => setEditForm({ ...editForm, reinforcementMeasures: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>

              {/* Competencias clave */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competencias clave</label>
                <div className="flex flex-wrap gap-2">
                  {keyCompetencies.map(kc => {
                    const isSelected = editForm.keyCompetencyIds?.includes(kc.id);
                    return (
                      <button
                        key={kc.id}
                        type="button"
                        onClick={() => toggleArrayItem('keyCompetencyIds', kc.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {kc.code}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Competencias específicas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competencias específicas</label>
                <div className="flex flex-wrap gap-2">
                  {allSpecificCompetencies
                    .filter(sc => sc.subjectId === editingSDA.subjectId)
                    .map(sc => {
                      const isSelected = editForm.specificCompetencyIds?.includes(sc.id);
                      return (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => toggleArrayItem('specificCompetencyIds', sc.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {sc.code}: {sc.name}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Criterios de evaluación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Criterios de evaluación</label>
                <div className="flex flex-wrap gap-2">
                  {allEvaluationCriteria
                    .filter(c => c.subjectId === editingSDA.subjectId)
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
                    .filter(bk => bk.subjectId === editingSDA.subjectId)
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

export const LearningSituationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { learningSituations } = useApp();
  const sda = learningSituations.find(s => s.id === id);
  if (!sda) return <div className="text-center py-12 text-gray-500">Situación de aprendizaje no encontrada</div>;

  const subject = subjects.find(s => s.id === sda.subjectId);
  const activities = allActivities.filter(a => a.learningSituationId === id);
  const competencies = sda.specificCompetencyIds.map(cid => allSpecificCompetencies.find(c => c.id === cid)).filter(Boolean);
  const criteria = sda.criterionIds.map(cid => allEvaluationCriteria.find(c => c.id === cid)).filter(Boolean);
  const keyComps = sda.keyCompetencyIds.map(kid => keyCompetencies.find(k => k.id === kid)).filter(Boolean);

  return (
    <div className="space-y-6">
      <Link to="/situaciones-aprendizaje" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" /> Volver a situaciones de aprendizaje
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-xl flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{sda.title}</h1>
            <p className="text-gray-500">{subject?.name} • {sda.evaluationPeriod}ª Evaluación</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{sda.timing}</span>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">{sda.sessions} sesiones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Contextualización</h3>
          <p className="text-sm text-gray-600">{sda.context}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Justificación</h3>
          <p className="text-sm text-gray-600">{sda.justification}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Producto final</h3>
          <p className="text-sm text-gray-600">{sda.finalProduct}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Objetivos</h3>
          <p className="text-sm text-gray-600">{sda.objectives}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Metodología</h3>
          <p className="text-sm text-gray-600">{sda.methodology}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Recursos</h3>
          <p className="text-sm text-gray-600">{sda.resources}</p>
        </div>
      </div>

      {/* Competencies */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Competencias clave</h2>
        <div className="flex flex-wrap gap-2">
          {keyComps.map(kc => (
            <span key={kc!.id} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full font-medium">
              {kc!.code}: {kc!.name}
            </span>
          ))}
        </div>
      </div>

      {/* Specific Competencies */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Competencias específicas</h2>
        <div className="space-y-2">
          {competencies.map(c => (
            <div key={c!.id} className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-sm text-blue-800">{c!.code}: {c!.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" /> Criterios de evaluación
        </h2>
        <div className="space-y-2">
          {criteria.map(c => (
            <div key={c!.id} className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-sm text-green-800">{c!.code}: {c!.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-600" /> Actividades ({activities.length})
        </h2>
        <div className="space-y-2">
          {activities.map(act => (
            <div key={act.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">{act.name}</p>
                <p className="text-xs text-gray-500">{act.type.replace('_', ' ')} • {act.sessions} sesiones • Peso: {act.weight}%</p>
              </div>
              <span className="text-xs text-gray-400">{act.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diversity & Reinforcement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Atención a la diversidad</h3>
          <p className="text-sm text-gray-600">{sda.diversity}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Medidas de refuerzo</h3>
          <p className="text-sm text-gray-600">{sda.reinforcementMeasures}</p>
        </div>
      </div>
    </div>
  );
};
