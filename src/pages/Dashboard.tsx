import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { school, subjects, groups, teacherSubjectGroups, allActivities, allLearningSituations } from '../data/seed';
import { BookOpen, Users, Calendar, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, grades } = useApp();

  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const myGroupIds = [...new Set(myAssignments.map(a => a.groupId))];
  const mySubjects = subjects.filter(s => mySubjectIds.includes(s.id));
  const myGroups = groups.filter(g => myGroupIds.includes(g.id));
  const myActivities = allActivities.filter(a => mySubjectIds.includes(a.subjectId) && myGroupIds.includes(a.groupId));

  const gradedCount = grades.filter(g => g.score !== null && myActivities.some(a => a.id === g.activityId)).length;
  const totalGrades = grades.filter(g => myActivities.some(a => a.id === g.activityId)).length;
  const completionPercent = totalGrades > 0 ? Math.round((gradedCount / totalGrades) * 100) : 0;

  const upcomingActivities = myActivities
    .filter(a => new Date(a.date) >= new Date('2026-09-01'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const subjectColors: Record<string, string> = {
    'sub-dt1': 'from-blue-500 to-blue-700',
    'sub-podcast': 'from-purple-500 to-purple-700',
    'sub-corto': 'from-orange-500 to-orange-700'
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Bienvenido/a, {currentUser?.name}</h1>
        <p className="text-blue-100 mt-1">{school.name} — {school.location}</p>
        <p className="text-blue-200 text-sm mt-1">Curso académico 2026/2027</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{mySubjects.length}</p>
              <p className="text-xs text-gray-500">Materias</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{myGroups.length}</p>
              <p className="text-xs text-gray-500">Grupos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{myActivities.length}</p>
              <p className="text-xs text-gray-500">Actividades</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{completionPercent}%</p>
              <p className="text-xs text-gray-500">Evaluación completada</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Subjects */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Mis materias</h2>
          </div>
          <div className="p-4 space-y-3">
            {mySubjects.map(subject => (
              <Link
                key={subject.id}
                to={`/materias/${subject.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subjectColors[subject.id] || 'from-gray-500 to-gray-700'} flex items-center justify-center`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{subject.name}</p>
                  <p className="text-xs text-gray-500">{subject.course}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Groups */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Mis grupos</h2>
          </div>
          <div className="p-4 space-y-3">
            {myGroups.map(group => (
              <Link
                key={group.id}
                to={`/grupos/${group.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{group.name}</p>
                  <p className="text-xs text-gray-500">{group.course}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Activities */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Próximas actividades</h2>
          </div>
          <div className="p-4">
            {upcomingActivities.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hay actividades próximas</p>
            ) : (
              <div className="space-y-2">
                {upcomingActivities.map(activity => {
                  const subject = subjects.find(s => s.id === activity.subjectId);
                  return (
                    <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{activity.name}</p>
                        <p className="text-xs text-gray-500">{subject?.name} • {activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Status */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Estado de evaluación</h2>
          </div>
          <div className="p-4 space-y-4">
            {['1', '2', '3'].map(period => {
              const periodActivities = myActivities.filter(a => a.evaluationPeriod === period);
              const periodGrades = grades.filter(g => periodActivities.some(a => a.id === g.activityId) && g.score !== null);
              const percent = periodActivities.length > 0 ? Math.round((periodGrades.length / (periodActivities.length * 24)) * 100) : 0;
              return (
                <div key={period}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{period}ª Evaluación</span>
                    <span className="text-sm font-medium text-gray-800">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h2 className="font-semibold text-gray-800 mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/cuaderno" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Cuaderno</span>
          </Link>
          <Link to="/evaluaciones" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-green-700">Evaluaciones</span>
          </Link>
          <Link to="/informes" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Informes</span>
          </Link>
          <Link to="/situaciones-aprendizaje" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-xs font-medium text-orange-700">SDA</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
