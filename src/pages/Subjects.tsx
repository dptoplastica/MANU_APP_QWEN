import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { subjects, departments, allLearningSituations, allActivities, teacherSubjectGroups, groups, allSpecificCompetencies, allEvaluationCriteria } from '../data/seed';
import { BookOpen, Target, Activity, Users, ArrowLeft, CheckCircle } from 'lucide-react';

export const Subjects: React.FC = () => {
  const { currentUser } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const mySubjects = subjects.filter(s => mySubjectIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis materias</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de las materias asignadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mySubjects.map(subject => {
          const dept = departments.find(d => d.id === subject.departmentId);
          const sdaCount = allLearningSituations.filter(s => s.subjectId === subject.id).length;
          const actCount = allActivities.filter(a => a.subjectId === subject.id).length;
          const groupCount = myAssignments.filter(a => a.subjectId === subject.id).length;

          return (
            <Link
              key={subject.id}
              to={`/materias/${subject.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                  <p className="text-sm text-gray-500">{subject.course}</p>
                  <p className="text-xs text-gray-400 mt-1">{dept?.name} • {subject.modality}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-700">{sdaCount}</p>
                  <p className="text-[10px] text-blue-600">SDA</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-700">{actCount}</p>
                  <p className="text-[10px] text-green-600">Actividades</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-700">{groupCount}</p>
                  <p className="text-[10px] text-purple-600">Grupos</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const SubjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const subject = subjects.find(s => s.id === id);
  if (!subject) return <div className="text-center py-12 text-gray-500">Materia no encontrada</div>;

  const sdas = allLearningSituations.filter(s => s.subjectId === id);
  const activities = allActivities.filter(a => a.subjectId === id);
  const competencies = allSpecificCompetencies.filter(c => c.subjectId === id);
  const criteria = allEvaluationCriteria.filter(c => c.subjectId === id);
  const subjectGroups = teacherSubjectGroups.filter(tsg => tsg.subjectId === id);
  const groupNames = subjectGroups.map(tsg => groups.find(g => g.id === tsg.groupId)?.name).filter(Boolean);

  return (
    <div className="space-y-6">
      <Link to="/materias" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" /> Volver a materias
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{subject.name}</h1>
            <p className="text-gray-500">{subject.course} • {subject.modality}</p>
            <p className="text-sm text-gray-400 mt-1">Grupos: {groupNames.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Competencies & Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" /> Competencias específicas
          </h2>
          <div className="space-y-2">
            {competencies.map(c => (
              <div key={c.id} className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-sm text-blue-800">{c.code}: {c.name}</p>
                <p className="text-xs text-blue-600 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Criterios de evaluación
          </h2>
          <div className="space-y-2">
            {criteria.map(c => (
              <div key={c.id} className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-sm text-green-800">{c.code}</p>
                <p className="text-xs text-green-600 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Situations */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" /> Situaciones de Aprendizaje
        </h2>
        <div className="space-y-3">
          {sdas.map(sda => (
            <Link
              key={sda.id}
              to={`/situaciones-aprendizaje/${sda.id}`}
              className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{sda.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{sda.timing} • {sda.sessions} sesiones</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {sda.evaluationPeriod}ª Eval.
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-600" /> Actividades ({activities.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Nombre</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Fecha</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Tipo</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Peso</th>
                <th className="text-left py-2 px-3 text-gray-600 font-medium">Eval.</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(act => (
                <tr key={act.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-800">{act.name}</td>
                  <td className="py-2 px-3 text-gray-600">{act.date}</td>
                  <td className="py-2 px-3 text-gray-600 capitalize">{act.type.replace('_', ' ')}</td>
                  <td className="py-2 px-3 text-gray-600">{act.weight}%</td>
                  <td className="py-2 px-3 text-gray-600">{act.evaluationPeriod}ª</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
