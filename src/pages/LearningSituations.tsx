import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { allLearningSituations, subjects, allActivities, allSpecificCompetencies, allEvaluationCriteria, keyCompetencies, teacherSubjectGroups } from '../data/seed';
import { Target, ArrowLeft, Activity, BookOpen, CheckCircle } from 'lucide-react';

export const LearningSituations: React.FC = () => {
  const { currentUser } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const mySDAs = allLearningSituations.filter(s => mySubjectIds.includes(s.subjectId));

  const groupedByPeriod = {
    '1': mySDAs.filter(s => s.evaluationPeriod === '1'),
    '2': mySDAs.filter(s => s.evaluationPeriod === '2'),
    '3': mySDAs.filter(s => s.evaluationPeriod === '3')
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Situaciones de Aprendizaje</h1>
        <p className="text-sm text-gray-500 mt-1">Organizadas por evaluación</p>
      </div>

      {Object.entries(groupedByPeriod).map(([period, sdas]) => (
        <div key={period} className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">{period}ª Evaluación</h2>
          </div>
          <div className="p-4 space-y-3">
            {sdas.map(sda => {
              const subject = subjects.find(s => s.id === sda.subjectId);
              const actCount = allActivities.filter(a => a.learningSituationId === sda.id).length;
              return (
                <Link
                  key={sda.id}
                  to={`/situaciones-aprendizaje/${sda.id}`}
                  className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{sda.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{subject?.name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{sda.timing}</span>
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">{sda.sessions} sesiones</span>
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full">{actCount} actividades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            {sdas.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay situaciones de aprendizaje</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export const LearningSituationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const sda = allLearningSituations.find(s => s.id === id);
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
