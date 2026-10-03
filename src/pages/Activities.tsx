import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { subjects, groups, allActivities, allLearningSituations, teacherSubjectGroups, allEvaluationCriteria, allSpecificCompetencies } from '../data/seed';
import { Activity, Plus, Filter, Calendar, Target } from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { currentUser } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const myActivities = allActivities.filter(a => mySubjectIds.includes(a.subjectId));

  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Nombre de la actividad" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {mySubjectIds.map(sid => {
                  const sub = subjects.find(s => s.id === sid);
                  return <option key={sid} value={sid}>{sub?.name}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sesiones</label>
              <input type="number" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (%)</label>
              <input type="number" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puntuación máxima</label>
              <input type="number" min="1" max="10" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Situación de aprendizaje</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {allLearningSituations.filter(s => mySubjectIds.includes(s.subjectId)).map(sda => (
                  <option key={sda.id} value={sda.id}>{sda.title}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Descripción de la actividad" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Guardar</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50">Cancelar</button>
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
                  <Activity className="w-5 h-5" />
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
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No se encontraron actividades con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};
