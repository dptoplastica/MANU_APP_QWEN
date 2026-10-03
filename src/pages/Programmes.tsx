import React from 'react';
import { useApp } from '../contexts/AppContext';
import { programmes, subjects, departments, teacherSubjectGroups } from '../data/seed';
import { ClipboardList, BookOpen } from 'lucide-react';

export const Programmes: React.FC = () => {
  const { currentUser } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const mySubjectIds = [...new Set(myAssignments.map(a => a.subjectId))];
  const myProgrammes = programmes.filter(p => mySubjectIds.includes(p.subjectId));

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
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 text-lg">{subject?.name}</h2>
                    <p className="text-sm text-gray-500">{subject?.course} • {dept?.name}</p>
                  </div>
                </div>
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
    </div>
  );
};
