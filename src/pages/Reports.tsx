import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { subjects, groups, students, teacherSubjectGroups, allActivities, allLearningSituations, allEvaluationCriteria, allSpecificCompetencies, keyCompetencies, school } from '../data/seed';
import { FileText, Download, Printer, User } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Reports: React.FC = () => {
  const { currentUser, grades } = useApp();
  const myAssignments = teacherSubjectGroups.filter(tsg => tsg.teacherId === currentUser?.id);
  const myGroupIds = [...new Set(myAssignments.map(a => a.groupId))];
  const myStudents = students.filter(s => myGroupIds.includes(s.groupId));

  const [selectedStudent, setSelectedStudent] = useState(myStudents[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [reportType, setReportType] = useState<'evaluation' | 'final'>('evaluation');

  const student = students.find(s => s.id === selectedStudent);
  const studentGroup = student ? groups.find(g => g.id === student.groupId) : null;

  // Update subject when student changes
  React.useEffect(() => {
    if (student) {
      const assignment = myAssignments.find(a => a.groupId === student.groupId);
      if (assignment) setSelectedSubject(assignment.subjectId);
    }
  }, [selectedStudent]);

  const subject = subjects.find(s => s.id === selectedSubject);
  const subjectActivities = allActivities.filter(a => a.subjectId === selectedSubject && a.evaluationPeriod === selectedPeriod);
  const sdas = allLearningSituations.filter(s => s.subjectId === selectedSubject && s.evaluationPeriod === selectedPeriod);
  const criteria = allEvaluationCriteria.filter(c => c.subjectId === selectedSubject);
  const competencies = allSpecificCompetencies.filter(c => c.subjectId === selectedSubject);

  // Calculate grades
  const getStudentActivityGrade = (activityId: string) => {
    return grades.find(g => g.studentId === selectedStudent && g.activityId === activityId);
  };

  const getEvaluationAverage = () => {
    const relevantGrades = subjectActivities
      .map(a => getStudentActivityGrade(a.id))
      .filter(g => g && g.score !== null);
    if (relevantGrades.length === 0) return 0;
    const totalWeight = subjectActivities.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return 0;
    return subjectActivities.reduce((sum, a) => {
      const g = getStudentActivityGrade(a.id);
      if (g && g.score !== null) return sum + (g.score * a.weight / totalWeight);
      return sum;
    }, 0);
  };

  const getCriterionLevel = (criterionId: string) => {
    const relevantActivities = subjectActivities.filter(a => a.criterionIds.includes(criterionId));
    const relevantGrades = relevantActivities
      .map(a => getStudentActivityGrade(a.id))
      .filter(g => g && g.score !== null);
    if (relevantGrades.length === 0) return { score: 0, level: 'No evaluado' };
    const avg = relevantGrades.reduce((sum, g) => sum + (g?.score || 0), 0) / relevantGrades.length;
    const level = avg >= 8 ? 'Avanzado' : avg >= 6 ? 'Adecuado' : avg >= 4 ? 'Básico' : 'En proceso';
    return { score: Math.round(avg * 10) / 10, level };
  };

  const getCompetencyLevel = (compId: string) => {
    const relatedCriteria = criteria.filter(c => c.specificCompetencyId === compId);
    const levels = relatedCriteria.map(c => getCriterionLevel(c.id).score);
    if (levels.length === 0) return 0;
    return Math.round((levels.reduce((s, l) => s + l, 0) / levels.length) * 10);
  };

  const getKeyCompetencyLevel = (kcId: string) => {
    const relatedSCs = competencies.filter(sc => sc.keyCompetencyIds.includes(kcId));
    if (relatedSCs.length === 0) return 0;
    const levels = relatedSCs.map(sc => getCompetencyLevel(sc.id));
    return Math.round(levels.reduce((s, l) => s + l, 0) / levels.length);
  };

  const evaluationAvg = getEvaluationAverage();

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(school.name.toUpperCase(), pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${school.location} — ${school.region}`, pageWidth / 2, 28, { align: 'center' });
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(reportType === 'final' ? 'INFORME FINAL DE CURSO' : 'INFORME DE EVALUACIÓN', pageWidth / 2, 40, { align: 'center' });

    // Student info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let y = 52;
    doc.text(`Alumno/a: ${student?.firstName} ${student?.lastName}`, 14, y); y += 6;
    doc.text(`Grupo: ${studentGroup?.name}`, 14, y); y += 6;
    doc.text(`Materia: ${subject?.name}`, 14, y); y += 6;
    doc.text(`Profesor: ${currentUser?.name}`, 14, y); y += 6;
    doc.text(`Evaluación: ${selectedPeriod}ª`, 14, y); y += 10;

    // Final grade
    doc.setFont('helvetica', 'bold');
    doc.text(`Calificación: ${evaluationAvg.toFixed(1)} / 10`, 14, y); y += 10;

    // SDA table
    doc.setFont('helvetica', 'bold');
    doc.text('Situaciones de Aprendizaje', 14, y); y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Situación', 'Calificación']],
      body: sdas.map(sda => {
        const sdaActivities = subjectActivities.filter(a => a.learningSituationId === sda.id);
        const sdaGrades = sdaActivities.map(a => getStudentActivityGrade(a.id)).filter(g => g && g.score !== null);
        const avg = sdaGrades.length > 0 ? sdaGrades.reduce((s, g) => s + (g?.score || 0), 0) / sdaGrades.length : 0;
        return [sda.title, avg.toFixed(1)];
      }),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Criteria table
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text('Criterios de evaluación', 14, y); y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Código', 'Descripción', 'Nivel']],
      body: criteria.map(c => {
        const cl = getCriterionLevel(c.id);
        return [c.code, c.description.substring(0, 50), cl.level];
      }),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Competencies
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text('Competencias específicas', 14, y); y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Competencia', 'Grado de adquisición (%)']],
      body: competencies.map(sc => [`${sc.code}: ${sc.name}`, `${getCompetencyLevel(sc.id)}%`]),
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Key competencies
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text('Competencias clave', 14, y); y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Competencia', 'Grado']],
      body: keyCompetencies.map(kc => {
        const level = getKeyCompetencyLevel(kc.id);
        const levelText = level >= 80 ? 'Alto' : level >= 60 ? 'Adecuado' : level >= 40 ? 'Básico' : level > 0 ? 'En proceso' : 'No trabajada';
        return [`${kc.code}: ${kc.name}`, levelText];
      }),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`IES Lope de Vega — Curso 2026/2027 — Página ${i} de ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

    doc.save(`informe_${student?.lastName}_${student?.firstName}_${subject?.name}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Informes</h1>
          <p className="text-sm text-gray-500 mt-1">Generación de informes de evaluación</p>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {myStudents.sort((a, b) => a.lastName.localeCompare(b.lastName)).map(s => (
              <option key={s.id} value={s.id}>{s.lastName}, {s.firstName}</option>
            ))}
          </select>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {myAssignments.filter(a => a.groupId === student?.groupId).map(a => {
              const sub = subjects.find(s => s.id === a.subjectId);
              return <option key={a.subjectId} value={a.subjectId}>{sub?.name}</option>;
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
            <option value="final">Evaluación Final</option>
          </select>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value as 'evaluation' | 'final')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="evaluation">Informe de evaluación</option>
            <option value="final">Informe final de curso</option>
          </select>
          <button
            onClick={generatePDF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Generar PDF
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {student && subject && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Vista previa del informe
            </h2>
            <button onClick={() => window.print()} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
          </div>

          <div className="p-6 space-y-6" id="report-preview">
            {/* Report Header */}
            <div className="text-center border-b pb-4">
              <h3 className="text-lg font-bold text-gray-800">{school.name.toUpperCase()}</h3>
              <p className="text-sm text-gray-500">{school.location} — {school.region}</p>
              <p className="text-md font-semibold text-gray-700 mt-2">
                {reportType === 'final' ? 'Informe Final de Curso' : 'Informe de Evaluación'}
              </p>
            </div>

            {/* Student Data */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-700">Alumno/a:</span> {student.firstName} {student.lastName}</div>
              <div><span className="font-medium text-gray-700">Grupo:</span> {studentGroup?.name}</div>
              <div><span className="font-medium text-gray-700">Materia:</span> {subject.name}</div>
              <div><span className="font-medium text-gray-700">Profesor:</span> {currentUser?.name}</div>
              <div><span className="font-medium text-gray-700">Evaluación:</span> {selectedPeriod}ª</div>
              <div>
                <span className="font-medium text-gray-700">Calificación:</span>{' '}
                <span className={`font-bold text-lg ${evaluationAvg >= 5 ? 'text-green-700' : 'text-red-700'}`}>
                  {evaluationAvg.toFixed(1)}
                </span>
              </div>
            </div>

            {/* SDA Table */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Situaciones de Aprendizaje</h4>
              <table className="w-full text-sm border border-gray-200">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="text-left py-2 px-3 border-b">Situación</th>
                    <th className="text-center py-2 px-3 border-b">Calificación</th>
                  </tr>
                </thead>
                <tbody>
                  {sdas.map(sda => {
                    const sdaActivities = subjectActivities.filter(a => a.learningSituationId === sda.id);
                    const sdaGrades = sdaActivities.map(a => getStudentActivityGrade(a.id)).filter(g => g && g.score !== null);
                    const avg = sdaGrades.length > 0 ? sdaGrades.reduce((s, g) => s + (g?.score || 0), 0) / sdaGrades.length : 0;
                    return (
                      <tr key={sda.id} className="border-b border-gray-100">
                        <td className="py-2 px-3">{sda.title}</td>
                        <td className="py-2 px-3 text-center font-medium">{avg.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Criteria */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Criterios de evaluación</h4>
              <table className="w-full text-sm border border-gray-200">
                <thead>
                  <tr className="bg-green-50">
                    <th className="text-left py-2 px-3 border-b">Código</th>
                    <th className="text-left py-2 px-3 border-b">Descripción</th>
                    <th className="text-center py-2 px-3 border-b">Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map(c => {
                    const cl = getCriterionLevel(c.id);
                    return (
                      <tr key={c.id} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-medium">{c.code}</td>
                        <td className="py-2 px-3">{c.description}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            cl.level === 'Avanzado' ? 'bg-green-100 text-green-700' :
                            cl.level === 'Adecuado' ? 'bg-blue-100 text-blue-700' :
                            cl.level === 'Básico' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{cl.level}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Specific Competencies */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Competencias específicas</h4>
              <div className="space-y-2">
                {competencies.map(sc => {
                  const level = getCompetencyLevel(sc.id);
                  return (
                    <div key={sc.id} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-20">{sc.code}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${level}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-800 w-12 text-right">{level}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Competencies */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Competencias clave</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {keyCompetencies.map(kc => {
                  const level = getKeyCompetencyLevel(kc.id);
                  const levelText = level >= 80 ? 'Alto' : level >= 60 ? 'Adecuado' : level >= 40 ? 'Básico' : level > 0 ? 'En proceso' : '—';
                  return (
                    <div key={kc.id} className="p-2 border border-gray-100 rounded-lg text-center">
                      <p className="text-xs font-bold text-gray-800">{kc.code}</p>
                      <p className="text-sm font-medium text-blue-600">{levelText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
