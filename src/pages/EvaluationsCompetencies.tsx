import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { subjects, groups, allActivities, students, teacherSubjectGroups, allEvaluationCriteria, allSpecificCompetencies, keyCompetencies } from '../data/seed';
import { BarChart3, TrendingUp, Target, CheckCircle, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export const Evaluations: React.FC = () => {
  const { currentUser, grades } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const myGroupIds = [...new Set(myAssignments.map(a => a.groupId))];

  const [selectedSubject, setSelectedSubject] = useState(mySubjectIds[0] || '');
  const [selectedGroup, setSelectedGroup] = useState(
    myAssignments.find(a => a.subjectId === selectedSubject)?.groupId || ''
  );
  const [selectedPeriod, setSelectedPeriod] = useState('1');

  const subjectActivities = allActivities.filter(
    a => a.subjectId === selectedSubject && a.groupId === selectedGroup && a.evaluationPeriod === selectedPeriod
  );
  const groupStudents = students.filter(s => s.groupId === selectedGroup);
  const criteria = allEvaluationCriteria.filter(c => c.subjectId === selectedSubject);

  // Calculate averages per criterion
  const getCriterionAverage = (criterionId: string) => {
    const relevantActivities = subjectActivities.filter(a => a.criterionIds.includes(criterionId));
    const relevantGrades = grades.filter(g =>
      relevantActivities.some(a => a.id === g.activityId) &&
      g.score !== null &&
      groupStudents.some(s => s.id === g.studentId)
    );
    if (relevantGrades.length === 0) return 0;
    return Math.round((relevantGrades.reduce((sum, g) => sum + (g.score || 0), 0) / relevantGrades.length) * 10) / 10;
  };

  // Chart data
  const criteriaChartData = criteria.map(c => ({
    name: c.code,
    nota: getCriterionAverage(c.id),
    fullMark: 10
  }));

  // Student distribution
  const studentAverages = groupStudents.map(student => {
    const studentGrades = subjectActivities
      .map(a => grades.find(g => g.studentId === student.id && g.activityId === a.id))
      .filter(g => g && g.score !== null);
    const avg = studentGrades.length > 0
      ? studentGrades.reduce((sum, g) => sum + (g?.score || 0), 0) / studentGrades.length
      : 0;
    return { name: student.firstName, avg: Math.round(avg * 10) / 10 };
  });

  const passed = studentAverages.filter(s => s.avg >= 5).length;
  const failed = studentAverages.filter(s => s.avg > 0 && s.avg < 5).length;
  const notEvaluated = studentAverages.filter(s => s.avg === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Evaluaciones</h1>
        <p className="text-sm text-gray-500 mt-1">Análisis de resultados y evaluación por criterios</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {mySubjectIds.map(sid => {
              const sub = subjects.find(s => s.id === sid);
              return <option key={sid} value={sid}>{sub?.name}</option>;
            })}
          </select>
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {myAssignments.filter(a => a.subjectId === selectedSubject).map(a => {
              const g = groups.find(gr => gr.id === a.groupId);
              return <option key={a.groupId} value={a.groupId}>{g?.name}</option>;
            })}
          </select>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="1">1ª Evaluación</option>
            <option value="2">2ª Evaluación</option>
            <option value="3">3ª Evaluación</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">Alumnos evaluados</p>
          <p className="text-2xl font-bold text-gray-800">{groupStudents.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">Aprobados</p>
          <p className="text-2xl font-bold text-green-600">{passed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">Suspensos</p>
          <p className="text-2xl font-bold text-red-600">{failed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-500">% Aprobados</p>
          <p className="text-2xl font-bold text-blue-600">{groupStudents.length > 0 ? Math.round((passed / groupStudents.length) * 100) : 0}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Nota media por alumno
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="avg" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Nota media" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" /> Evaluación por criterios
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={criteriaChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 10]} />
                <Radar name="Nota media" dataKey="nota" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Criteria Evaluation Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Evaluación por criterios
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Criterio</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Descripción</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Nota media</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map(criterion => {
                const avg = getCriterionAverage(criterion.id);
                const level = avg >= 8 ? 'Avanzado' : avg >= 6 ? 'Adecuado' : avg >= 4 ? 'Básico' : avg > 0 ? 'En proceso' : 'No iniciado';
                const levelColor = avg >= 8 ? 'text-green-700 bg-green-50' : avg >= 6 ? 'text-blue-700 bg-blue-50' : avg >= 4 ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50';
                return (
                  <tr key={criterion.id} className="border-b border-gray-50">
                    <td className="py-2 px-4 font-medium text-gray-800">{criterion.code}</td>
                    <td className="py-2 px-4 text-gray-600">{criterion.description}</td>
                    <td className="py-2 px-4 text-center font-bold">{avg.toFixed(1)}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor}`}>{level}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const Competencies: React.FC = () => {
  const { currentUser, grades } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];

  const [selectedSubject, setSelectedSubject] = useState(mySubjectIds[0] || '');

  const subjectCompetencies = allSpecificCompetencies.filter(c => c.subjectId === selectedSubject);
  const subjectCriteria = allEvaluationCriteria.filter(c => c.subjectId === selectedSubject);
  const subjectActivities = allActivities.filter(a => a.subjectId === selectedSubject);

  // Calculate competency acquisition level
  const getCompetencyLevel = (competencyId: string) => {
    const relatedCriteria = subjectCriteria.filter(c => c.specificCompetencyId === competencyId);
    const relatedActivities = subjectActivities.filter(a =>
      a.criterionIds.some(cid => relatedCriteria.some(rc => rc.id === cid))
    );
    const relatedGrades = grades.filter(g =>
      relatedActivities.some(a => a.id === g.activityId) && g.score !== null
    );
    if (relatedGrades.length === 0) return 0;
    const avg = relatedGrades.reduce((sum, g) => sum + (g.score || 0), 0) / relatedGrades.length;
    return Math.round((avg / 10) * 100);
  };

  // Key competencies aggregation
  const getKeyCompetencyLevel = (kcId: string) => {
    const relatedSCs = subjectCompetencies.filter(sc => sc.keyCompetencyIds.includes(kcId));
    if (relatedSCs.length === 0) return 0;
    const levels = relatedSCs.map(sc => getCompetencyLevel(sc.id));
    return Math.round(levels.reduce((sum, l) => sum + l, 0) / levels.length);
  };

  const radarData = subjectCompetencies.map(sc => ({
    name: sc.code,
    nivel: getCompetencyLevel(sc.id),
    fullMark: 100
  }));

  const keyCompData = keyCompetencies.map(kc => ({
    code: kc.code,
    name: kc.name,
    level: getKeyCompetencyLevel(kc.id)
  })).filter(kc => kc.level > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Competencias</h1>
        <p className="text-sm text-gray-500 mt-1">Grado de adquisición de competencias específicas y clave</p>
      </div>

      {/* Subject filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          {mySubjectIds.map(sid => {
            const sub = subjects.find(s => s.id === sid);
            return <option key={sid} value={sid}>{sub?.name}</option>;
          })}
        </select>
      </div>

      {/* Specific Competencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Competencias específicas
          </h2>
          <div className="space-y-3">
            {subjectCompetencies.map(sc => {
              const level = getCompetencyLevel(sc.id);
              return (
                <div key={sc.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{sc.code}: {sc.name}</span>
                    <span className="text-sm font-bold text-gray-800">{level}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        level >= 80 ? 'bg-green-500' : level >= 60 ? 'bg-blue-500' : level >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" /> Gráfico de competencias
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Adquisición" dataKey="nivel" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Competencies */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Competencias clave LOMLOE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {keyCompData.map(kc => (
            <div key={kc.code} className="p-3 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-800">{kc.code}</span>
                <span className="text-sm font-bold text-blue-600">{kc.level}%</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{kc.name}</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${kc.level}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                {kc.level >= 80 ? 'Alto' : kc.level >= 60 ? 'Adecuado' : kc.level >= 40 ? 'Básico' : 'En proceso'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
