import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { subjects, allActivities } from '../data/seed';
import { Users, BookOpen, ArrowLeft, User } from 'lucide-react';

export const GroupsPage: React.FC = () => {
  const { currentUser, groups, students, teacherSubjectGroups } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const myGroupIds = [...new Set(myAssignments.map(a => a.groupId))];
  const myGroups = groups.filter(g => myGroupIds.includes(g.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis grupos</h1>
        <p className="text-sm text-gray-500 mt-1">Grupos asignados al profesor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myGroups.map(group => {
          const groupStudents = students.filter(s => s.groupId === group.id);
          const groupSubjects = myAssignments
            .filter(a => a.groupId === group.id)
            .map(a => subjects.find(s => s.id === a.subjectId)?.name)
            .filter(Boolean);

          return (
            <Link
              key={group.id}
              to={`/grupos/${group.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.course}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {groupStudents.length} alumnos</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {groupSubjects.length} materias</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {groupSubjects.map((name, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{name}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, students } = useApp();
  const group = groups.find(g => g.id === id);
  if (!group) return <div className="text-center py-12 text-gray-500">Grupo no encontrado</div>;

  const groupStudents = students.filter(s => s.groupId === id);

  return (
    <div className="space-y-6">
      <Link to="/grupos" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" /> Volver a grupos
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
            <p className="text-gray-500">{group.course} • {groupStudents.length} alumnos</p>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Lista de alumnos</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {groupStudents.sort((a, b) => a.lastName.localeCompare(b.lastName)).map((student, idx) => (
            <Link
              key={student.id}
              to={`/alumnos/${student.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                {idx + 1}
              </span>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{student.lastName}, {student.firstName}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StudentsPage: React.FC = () => {
  const { currentUser, groups, students, teacherSubjectGroups } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const myGroupIds = [...new Set(myAssignments.map(a => a.groupId))];
  const myStudents = students.filter(s => myGroupIds.includes(s.groupId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Alumnos</h1>
        <p className="text-sm text-gray-500 mt-1">Alumnos de los grupos asignados</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">{myStudents.length} alumnos en total</p>
        </div>
        <div className="divide-y divide-gray-50">
          {myStudents.sort((a, b) => a.lastName.localeCompare(b.lastName)).map(student => {
            const group = groups.find(g => g.id === student.groupId);
            return (
              <Link
                key={student.id}
                to={`/alumnos/${student.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{student.lastName}, {student.firstName}</p>
                  <p className="text-xs text-gray-500">{group?.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, students, teacherSubjectGroups, grades } = useApp();
  const student = students.find(s => s.id === id);

  if (!student) return <div className="text-center py-12 text-gray-500">Alumno no encontrado</div>;

  const group = groups.find(g => g.id === student.groupId);
  const studentGrades = grades.filter(g => g.studentId === id);

  const getAverageForSubject = (subjectId: string) => {
    const subjectActivities = allActivities.filter(a => a.subjectId === subjectId);
    const relevantGrades = studentGrades.filter(g => subjectActivities.some(a => a.id === g.activityId) && g.score !== null);
    if (relevantGrades.length === 0) return null;
    const sum = relevantGrades.reduce((acc, g) => acc + (g.score || 0), 0);
    return Math.round((sum / relevantGrades.length) * 10) / 10;
  };

  const myAssignments = teacherSubjectGroups.filter(a => a.groupId === student.groupId);
  const mySubjects = [...new Set(myAssignments.map(a => a.subjectId))].map(sid => subjects.find(s => s.id === sid)).filter(Boolean);

  return (
    <div className="space-y-6">
      <Link to="/alumnos" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" /> Volver a alumnos
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{student.firstName} {student.lastName}</h1>
            <p className="text-gray-500">{group?.name}</p>
          </div>
        </div>
      </div>

      {/* Grades by Subject */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mySubjects.map(subject => {
          const avg = getAverageForSubject(subject!.id);
          return (
            <div key={subject!.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-800 text-sm">{subject!.name}</h3>
              <p className="text-3xl font-bold mt-2 text-gray-800">{avg !== null ? avg.toFixed(1) : '-'}</p>
              <p className="text-xs text-gray-500 mt-1">Media ponderada</p>
            </div>
          );
        })}
      </div>

      {/* Activity Grades */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Calificaciones por actividad</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Actividad</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Materia</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Calificación</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {studentGrades.map(grade => {
                const activity = allActivities.find(a => a.id === grade.activityId);
                const subject = subjects.find(s => s.id === activity?.subjectId);
                return (
                  <tr key={grade.id} className="border-b border-gray-50">
                    <td className="py-2 px-4 text-gray-800">{activity?.name}</td>
                    <td className="py-2 px-4 text-gray-600 text-xs">{subject?.name}</td>
                    <td className="py-2 px-4 text-center font-medium">
                      {grade.score !== null ? (
                        <span className={grade.score >= 5 ? 'text-green-700' : 'text-red-700'}>
                          {grade.score.toFixed(1)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {grade.notCompleted ? (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">No presentado</span>
                      ) : grade.score !== null ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Evaluado</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Pendiente</span>
                      )}
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
