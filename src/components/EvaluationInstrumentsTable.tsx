import React from 'react';
import { evaluationCriteriaDT, evaluationCriteriaPodcast, evaluationCriteriaCorto, subjects } from '../data/seed';
import { FileText, TrendingUp } from 'lucide-react';

interface EvaluationInstrumentsTableProps {
  subjectId: string;
}

interface Instrument {
  name: string;
  weight: number;
  criteria: string[];
  description: string;
}

export const EvaluationInstrumentsTable: React.FC<EvaluationInstrumentsTableProps> = ({ subjectId }) => {
  const subject = subjects.find(s => s.id === subjectId);
  
  // Obtener criterios según la materia
  const criteria = subjectId === 'sub-dt1' ? evaluationCriteriaDT :
                   subjectId === 'sub-podcast' ? evaluationCriteriaPodcast :
                   evaluationCriteriaCorto;

  // Definir instrumentos de evaluación según la materia
  const getInstruments = (): Instrument[] => {
    if (subjectId === 'sub-dt1') {
      return [
        {
          name: 'Láminas de trazados geométricos',
          weight: 30,
          criteria: ['2.1', '2.2', '2.3', '3.1', '3.2'],
          description: 'Conjunto de láminas con trazados fundamentales, polígonos, tangencias y sistemas de representación'
        },
        {
          name: 'Pruebas escritas teórico-prácticas',
          weight: 40,
          criteria: ['1.1', '2.1', '2.2', '2.3', '3.1', '3.2', '3.3', '3.4', '4.1'],
          description: 'Exámenes que combinan preguntas teóricas con ejercicios prácticos de geometría y sistemas de representación'
        },
        {
          name: 'Proyecto integrador CAD',
          weight: 20,
          criteria: ['4.1', '4.2', '5.1', '5.2'],
          description: 'Proyecto final de virtualización de un espacio arquitectónico con planos normalizados y modelo 3D'
        },
        {
          name: 'Portafolio digital',
          weight: 10,
          criteria: ['1.1', '5.1', '5.2'],
          description: 'Recopilación organizada de trabajos digitales, ejercicios CAD y reflexiones sobre el proceso de aprendizaje'
        }
      ];
    } else if (subjectId === 'sub-podcast') {
      return [
        {
          name: 'Narración sonora individual',
          weight: 15,
          criteria: ['1.1', '1.2'],
          description: 'Grabación de narración de 3 minutos demostrando técnicas de locución y expresividad oral'
        },
        {
          name: 'Boletín informativo grupal',
          weight: 20,
          criteria: ['2.1', '2.2', '4.1'],
          description: 'Producción de boletín informativo de 10 minutos en equipo, aplicando género informativo'
        },
        {
          name: 'Programa de tertulia',
          weight: 15,
          criteria: ['1.1', '1.2', '2.2', '4.1'],
          description: 'Grabación de programa de tertulia de 15 minutos con debate argumentativo'
        },
        {
          name: 'Podcast divulgativo',
          weight: 20,
          criteria: ['2.1', '2.2', '3.1', '3.2'],
          description: 'Episodio divulgativo de 12-15 minutos con entrevista y paisaje sonoro'
        },
        {
          name: 'Proyecto final: mi podcast',
          weight: 25,
          criteria: ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'],
          description: 'Podcast completo de autoría propia con 3 episodios, identidad sonora y presentación pública'
        },
        {
          name: 'Memoria y defensa oral',
          weight: 5,
          criteria: ['4.2'],
          description: 'Documentación del proceso de creación y defensa oral del proyecto final'
        }
      ];
    } else {
      return [
        {
          name: 'Dossier de proyecto cinematográfico',
          weight: 10,
          criteria: ['1.1'],
          description: 'Documento con logline, sinopsis, argumento y personajes del cortometraje'
        },
        {
          name: 'Guión técnico y storyboard',
          weight: 15,
          criteria: ['1.2', '2.1', '2.2'],
          description: 'Planificación visual completa del cortometraje con guión técnico y storyboard detallado'
        },
        {
          name: 'Material rodado',
          weight: 20,
          criteria: ['2.1', '3.1', '4.1'],
          description: 'Secuencias rodadas con calidad técnica (encuadre, iluminación, sonido, continuidad)'
        },
        {
          name: 'Cortometraje editado',
          weight: 30,
          criteria: ['2.1', '3.2'],
          description: 'Cortometraje completo con montaje narrativo, corrección de color y diseño sonoro'
        },
        {
          name: 'Materiales de promoción',
          weight: 10,
          criteria: ['4.1', '4.2'],
          description: 'Tráiler, cartel y nota de prensa para el festival de cine'
        },
        {
          name: 'Defensa oral del proyecto',
          weight: 10,
          criteria: ['4.2'],
          description: 'Presentación y defensa oral del cortometraje ante la comunidad educativa'
        },
        {
          name: 'Memoria de producción',
          weight: 5,
          criteria: ['4.1'],
          description: 'Documentación del proceso de producción con reflexiones y aprendizaje'
        }
      ];
    }
  };

  const instruments = getInstruments();

  // Calcular peso total para verificar que suma 100%
  const totalWeight = instruments.reduce((sum, inst) => sum + inst.weight, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Instrumentos de Evaluación</h2>
              <p className="text-sm text-gray-500">{subject?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">{totalWeight}%</p>
            <p className="text-xs text-gray-500">Peso total</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Instrumento</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Peso</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Criterios Evaluados</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {instruments.map((instrument, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{instrument.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${instrument.weight}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-indigo-600">{instrument.weight}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {instrument.criteria.map((criterion, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium"
                        >
                          {criterion}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600">{instrument.description}</p>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-800">TOTAL</td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-lg font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalWeight}%
                  </span>
                </td>
                <td colSpan={2} className="py-3 px-4">
                  {totalWeight === 100 ? (
                    <span className="text-sm text-green-600 font-medium">✓ Distribución correcta</span>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">⚠ La distribución debe sumar 100%</span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Resumen visual */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Distribución Visual de Ponderaciones
          </h3>
          <div className="space-y-2">
            {instruments.map((instrument, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-48 truncate">{instrument.name}</span>
                <div className="flex-1 h-6 bg-white rounded-lg overflow-hidden border border-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-end px-2"
                    style={{ width: `${instrument.weight}%` }}
                  >
                    <span className="text-xs font-bold text-white">{instrument.weight}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Criterios de calificación */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Criterios de Calificación</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• La calificación final se obtiene mediante media ponderada de los criterios de evaluación trabajados a lo largo del curso</li>
            <li>• Se considerará superada la materia con una calificación igual o superior a <strong>5 (SUFICIENTE)</strong></li>
            <li>• Los trabajos realizados con apoyo de material tendrán un peso del <strong>30%</strong> en los criterios asociados</li>
            <li>• Las pruebas realizadas de forma autónoma tendrán un peso del <strong>70%</strong></li>
            <li>• Es imprescindible entregar todos los instrumentos de evaluación para poder hacer media</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
