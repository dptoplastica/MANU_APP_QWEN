import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { subjects, allActivities } from '../data/seed';
import { BookMarked, Download, Filter, Calendar } from 'lucide-react';

export const Gradebook: React.FC = () => {
  const { currentUser, grades, updateGrade, groups, students, teacherSubjectGroups } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);

  const [selectedSubject, setSelectedSubject] = useState(myAssignments[0]?.subjectId || '');
  const [selectedGroup, setSelectedGroup] = useState(
    myAssignments.find(a => a.subjectId === myAssignments[0]?.subjectId)?.groupId || ''
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1');
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const groupSubjects = myAssignments.filter(a => a.subjectId === selectedSubject);
  const availableGroups = groups.filter(g => groupSubjects.some(a => a.groupId === g.id));

  // Actividades de la evaluación seleccionada
  const periodActivities = allActivities.filter(
    a => a.subjectId === selectedSubject && a.groupId === selectedGroup && a.evaluationPeriod === selectedPeriod
  );

  // Todas las actividades de la materia (para evaluación final)
  const allSubjectActivities = allActivities.filter(
    a => a.subjectId === selectedSubject && a.groupId === selectedGroup
  );

  const groupStudents = students.filter(s => s.groupId === selectedGroup);

  const getStudentGrade = (studentId: string, activityId: string) => {
    return grades.find(g => g.studentId === studentId && g.activityId === activityId);
  };

  // Calcular media de una evaluación específica
  const getPeriodAverage = (studentId: string, period: string) => {
    const activities = allSubjectActivities.filter(a => a.evaluationPeriod === period);
    const studentGrades = activities
      .map(a => getStudentGrade(studentId, a.id))
      .filter(g => g && g.score !== null);
    
    if (studentGrades.length === 0) return null;
    
    const totalWeight = activities.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return null;
    
    const weightedSum = activities.reduce((sum, a) => {
      const grade = getStudentGrade(studentId, a.id);
      if (grade && grade.score !== null) {
        return sum + (grade.score * a.weight / totalWeight);
      }
      return sum;
    }, 0);
    
    return Math.round(weightedSum * 10) / 10;
  };

  // Calcular nota final (media ponderada de las 3 evaluaciones)
  const getFinalAverage = (studentId: string) => {
    const eval1 = getPeriodAverage(studentId, '1');
    const eval2 = getPeriodAverage(studentId, '2');
    const eval3 = getPeriodAverage(studentId, '3');
    
    const evaluations = [eval1, eval2, eval3].filter(e => e !== null) as number[];
    if (evaluations.length === 0) return null;
    
    const sum = evaluations.reduce((acc, e) => acc + e, 0);
    return Math.round((sum / evaluations.length) * 10) / 10;
  };

  // Media de la evaluación actual
  const getStudentAverage = (studentId: string) => {
    if (selectedPeriod === 'final') {
      return getFinalAverage(studentId);
    }
    return getPeriodAverage(studentId, selectedPeriod);
  };

  const handleGradeChange = (studentId: string, activityId: string, value: string) => {
    const existingGrade = getStudentGrade(studentId, activityId);
    if (existingGrade) {
      const score = value === '' ? null : parseFloat(value);
      updateGrade({
        ...existingGrade,
        score: score !== null && !isNaN(score) ? Math.min(10, Math.max(0, score)) : null,
        notCompleted: score === null,
        notEvaluated: false
      });
    }
  };

  const subjectName = subjects.find(s => s.id === selectedSubject)?.name || '';
  const groupName = groups.find(g => g.id === selectedGroup)?.name || '';

  // Export to CSV
  const exportCSV = () => {
    const isFinal = selectedPeriod === 'final';
    
    if (isFinal) {
      // Exportar evaluación final con medias por evaluación
      const headers = ['Alumno', '1ª Evaluación', '2ª Evaluación', '3ª Evaluación', 'Nota Final'];
      const rows = groupStudents.map(student => {
        const eval1 = getPeriodAverage(student.id, '1');
        const eval2 = getPeriodAverage(student.id, '2');
        const eval3 = getPeriodAverage(student.id, '3');
        const final = getFinalAverage(student.id);
        return [
          `${student.lastName}, ${student.firstName}`,
          eval1?.toString() || '-',
          eval2?.toString() || '-',
          eval3?.toString() || '-',
          final?.toString() || '-'
        ];
      });
      const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cuaderno_final_${subjectName}_${groupName}.csv`;
      link.click();
    } else {
      // Exportar evaluación específica
      const headers = ['Alumno', ...periodActivities.map(a => a.name), 'Media'];
      const rows = groupStudents.map(student => {
        const studentGrades = periodActivities.map(a => {
          const g = getStudentGrade(student.id, a.id);
          return g?.score !== null && g?.score !== undefined ? g.score.toString() : '-';
        });
        const avg = getStudentAverage(student.id);
        return [`${student.lastName}, ${student.firstName}`, ...studentGrades, avg?.toString() || '-'];
      });
      const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cuaderno_${selectedPeriod}eval_${subjectName}_${groupName}.csv`;
      link.click();
    }
  };

  const isFinalView = selectedPeriod === 'final';
  const displayActivities = isFinalView ? [] : periodActivities;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cuaderno del profesor</h1>
          <p className="text-sm text-gray-500 mt-1">Registro de calificaciones por evaluación</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value);
              const firstGroup = myAssignments.find(a => a.subjectId === e.target.value)?.groupId || '';
              setSelectedGroup(firstGroup);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {[...new Set(myAssignments.map(a => a.subjectId))].map(subId => {
              const sub = subjects.find(s => s.id === subId);
              return <option key={subId} value={subId}>{sub?.name}</option>;
            })}
          </select>
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {availableGroups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1ª Evaluación</option>
            <option value="2">2ª Evaluación</option>
            <option value="3">3ª Evaluación</option>
            <option value="final">Evaluación Final</option>
          </select>
        </div>
      </div>

      {/* Vista de Evaluación Final */}
      {isFinalView && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-800">Evaluación Final — {subjectName} — {groupName}</h2>
            <span className="text-xs text-gray-400 ml-auto">{groupStudents.length} alumnos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                  <th className="sticky left-0 bg-indigo-50 z-10 text-left py-3 px-4 font-medium text-gray-700 min-w-[200px]">
                    Alumno
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[120px]">
                    <div className="text-xs">1ª Evaluación</div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[120px]">
                    <div className="text-xs">2ª Evaluación</div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 min-w-[120px]">
                    <div className="text-xs">3ª Evaluación</div>
                  </th>
                  <th className="sticky right-0 bg-indigo-50 z-10 text-center py-3 px-4 font-bold text-gray-800 min-w-[100px]">
                    Nota Final
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupStudents.map((student, idx) => {
                  const eval1 = getPeriodAverage(student.id, '1');
                  const eval2 = getPeriodAverage(student.id, '2');
                  const eval3 = getPeriodAverage(student.id, '3');
                  const final = getFinalAverage(student.id);

                  return (
                    <tr key={student.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-indigo-50/30`}>
                      <td className="sticky left-0 z-10 py-2 px-4 font-medium text-gray-800 bg-inherit">
                        {student.lastName}, {student.firstName}
                      </td>
                      <td className="text-center py-2 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          eval1 !== null
                            ? eval1 >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            : 'text-gray-400'
                        }`}>
                          {eval1 !== null ? eval1.toFixed(1) : '-'}
                        </span>
                      </td>
                      <td className="text-center py-2 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          eval2 !== null
                            ? eval2 >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            : 'text-gray-400'
                        }`}>
                          {eval2 !== null ? eval2.toFixed(1) : '-'}
                        </span>
                      </td>
                      <td className="text-center py-2 px-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          eval3 !== null
                            ? eval3 >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            : 'text-gray-400'
                        }`}>
                          {eval3 !== null ? eval3.toFixed(1) : '-'}
                        </span>
                      </td>
                      <td className="sticky right-0 z-10 text-center py-2 px-4 font-bold bg-inherit">
                        <span className={`px-3 py-1.5 rounded text-sm font-bold ${
                          final !== null
                            ? final >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            : 'text-gray-400'
                        }`}>
                          {final !== null ? final.toFixed(1) : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen estadístico */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500 text-xs">Alumnos</p>
                <p className="text-lg font-bold text-gray-800">{groupStudents.length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Media 1ª Eval.</p>
                <p className="text-lg font-bold text-blue-600">
                  {(() => {
                    const avgs = groupStudents.map(s => getPeriodAverage(s.id, '1')).filter(e => e !== null) as number[];
                    return avgs.length > 0 ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1) : '-';
                  })()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Media 2ª Eval.</p>
                <p className="text-lg font-bold text-blue-600">
                  {(() => {
                    const avgs = groupStudents.map(s => getPeriodAverage(s.id, '2')).filter(e => e !== null) as number[];
                    return avgs.length > 0 ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1) : '-';
                  })()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Media 3ª Eval.</p>
                <p className="text-lg font-bold text-blue-600">
                  {(() => {
                    const avgs = groupStudents.map(s => getPeriodAverage(s.id, '3')).filter(e => e !== null) as number[];
                    return avgs.length > 0 ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1) : '-';
                  })()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">% Aprobados</p>
                <p className="text-lg font-bold text-green-600">
                  {(() => {
                    const finals = groupStudents.map(s => getFinalAverage(s.id)).filter(e => e !== null) as number[];
                    if (finals.length === 0) return '-';
                    const passed = finals.filter(f => f >= 5).length;
                    return `${Math.round((passed / finals.length) * 100)}%`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Evaluación Específica */}
      {!isFinalView && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-800">{subjectName} — {groupName}</h2>
            <span className="text-xs text-gray-400 ml-auto">{displayActivities.length} actividades • {groupStudents.length} alumnos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="sticky left-0 bg-gray-50 z-10 text-left py-3 px-4 font-medium text-gray-700 min-w-[180px]">
                    Alumno
                  </th>
                  {displayActivities.map(activity => (
                    <th key={activity.id} className="text-center py-3 px-2 font-medium text-gray-700 min-w-[80px]">
                      <div className="truncate text-xs" title={activity.name}>{activity.name.substring(0, 12)}...</div>
                      <div className="text-[10px] text-gray-400">{activity.weight}%</div>
                    </th>
                  ))}
                  <th className="sticky right-0 bg-gray-50 z-10 text-center py-3 px-4 font-bold text-gray-800 min-w-[70px]">
                    Media
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupStudents.map((student, idx) => {
                  const avg = getStudentAverage(student.id);
                  return (
                    <tr key={student.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30`}>
                      <td className="sticky left-0 z-10 py-2 px-4 font-medium text-gray-800 bg-inherit">
                        {student.lastName}, {student.firstName}
                      </td>
                      {displayActivities.map(activity => {
                        const grade = getStudentGrade(student.id, activity.id);
                        const cellId = `${student.id}-${activity.id}`;
                        const isEditing = editingCell === cellId;

                        return (
                          <td key={activity.id} className="text-center py-1 px-1">
                            {isEditing ? (
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                defaultValue={grade?.score ?? ''}
                                autoFocus
                                onBlur={(e) => {
                                  handleGradeChange(student.id, activity.id, e.target.value);
                                  setEditingCell(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab') {
                                    handleGradeChange(student.id, activity.id, (e.target as HTMLInputElement).value);
                                    setEditingCell(null);
                                  }
                                  if (e.key === 'Escape') setEditingCell(null);
                                }}
                                className="w-14 text-center py-1 px-1 border border-blue-400 rounded text-sm focus:ring-2 focus:ring-blue-300"
                              />
                            ) : (
                              <button
                                onClick={() => setEditingCell(cellId)}
                                className={`w-14 py-1 px-1 rounded text-sm transition-colors ${
                                  grade?.score !== null && grade?.score !== undefined
                                    ? grade.score >= 5
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                    : grade?.notCompleted
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                {grade?.score !== null && grade?.score !== undefined ? grade.score.toFixed(1) : grade?.notCompleted ? 'NP' : '-'}
                              </button>
                            )}
                          </td>
                        );
                      })}
                      <td className="sticky right-0 z-10 text-center py-2 px-4 font-bold bg-inherit">
                        <span className={`px-2 py-1 rounded text-sm ${
                          avg !== null
                            ? avg >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            : 'text-gray-400'
                        }`}>
                          {avg !== null ? avg.toFixed(1) : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="p-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded"></span> Aprobado (≥5)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded"></span> Suspenso (&lt;5)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 rounded"></span> No presentado</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded"></span> Sin calificar</span>
            <span className="text-gray-400 ml-auto">Click en una celda para editar</span>
          </div>
        </div>
      )}
    </div>
  );
};
