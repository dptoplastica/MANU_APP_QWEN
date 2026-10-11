import { User, School, AcademicYear, Department, Subject, Group, Student, TeacherSubjectGroup, Programme, KeyCompetency, SpecificCompetency, EvaluationCriterion, BasicKnowledge, LearningSituation, Activity, Grade, EvaluationConfig } from '../types';

export const school: School = {
  id: 'school-1',
  name: 'IES Lope de Vega',
  location: 'Santa María de Cayón',
  region: 'Cantabria'
};

export const academicYears: AcademicYear[] = [
  { id: 'ay-2026', name: '2026/2027', active: true },
  { id: 'ay-2027', name: '2027/2028', active: false }
];

export const users: User[] = [
  { id: 'user-admin', email: 'admin@ieslopedevega.es', name: 'Administrador del Centro', role: 'admin', active: true, createdAt: '2026-09-01' },
  { id: 'user-teacher1', email: 'profesor@ieslopedevega.es', name: 'D. García López', role: 'teacher', active: true, createdAt: '2026-09-01' }
];

export const departments: Department[] = [
  { id: 'dept-dibujo', name: 'Dibujo', schoolId: 'school-1' }
];

export const subjects: Subject[] = [
  { id: 'sub-dt1', name: 'Dibujo Técnico I', course: '1º Bachillerato', modality: 'Bachillerato', departmentId: 'dept-dibujo', region: 'Cantabria', academicYearId: 'ay-2026' },
  { id: 'sub-podcast', name: 'Taller de Podcast', course: '1º Bachillerato', modality: 'Optativa', departmentId: 'dept-dibujo', region: 'Cantabria', academicYearId: 'ay-2026' },
  { id: 'sub-corto', name: 'Taller de Cortometraje', course: '2º Bachillerato', modality: 'Optativa', departmentId: 'dept-dibujo', region: 'Cantabria', academicYearId: 'ay-2026' }
];

export const groups: Group[] = [
  { id: 'group-1a', name: '1º Bachillerato A', course: '1º Bachillerato', academicYearId: 'ay-2026' },
  { id: 'group-1b', name: '1º Bachillerato B', course: '1º Bachillerato', academicYearId: 'ay-2026' },
  { id: 'group-2a', name: '2º Bachillerato A', course: '2º Bachillerato', academicYearId: 'ay-2026' }
];

const firstNames = ['Lucía', 'Martín', 'Sofía', 'Hugo', 'María', 'Pablo', 'Carmen', 'Daniel', 'Paula', 'Alejandro', 'Valeria', 'Adrián', 'Elena', 'Diego', 'Alba', 'Mateo', 'Claudia', 'Álvaro', 'Marta', 'Leo', 'Irene', 'Marcos', 'Nerea', 'Iker', 'Sara', 'David', 'Julia', 'Mario', 'Aitana', 'Raúl'];
const lastNames = ['Fernández', 'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Díaz', 'Ruiz', 'Hernández', 'Gómez', 'Moreno', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Ramos'];

export const students: Student[] = Array.from({ length: 24 }, (_, i) => ({
  id: `student-${i + 1}`,
  firstName: firstNames[i % firstNames.length],
  lastName: lastNames[i % lastNames.length],
  groupId: i < 12 ? 'group-1a' : i < 18 ? 'group-1b' : 'group-2a',
  observations: ''
}));

export const teacherSubjectGroups: TeacherSubjectGroup[] = [
  { id: 'tsg-1', teacherId: 'user-teacher1', subjectId: 'sub-dt1', groupId: 'group-1a' },
  { id: 'tsg-2', teacherId: 'user-teacher1', subjectId: 'sub-podcast', groupId: 'group-1a' },
  { id: 'tsg-3', teacherId: 'user-teacher1', subjectId: 'sub-corto', groupId: 'group-2a' }
];

export const keyCompetencies: KeyCompetency[] = [
  { id: 'kc-ccl', code: 'CCL', name: 'Competencia en comunicación lingüística', description: 'Comunicación oral y escrita' },
  { id: 'kc-cp', code: 'CP', name: 'Competencia plurilingüe', description: 'Uso de varias lenguas' },
  { id: 'kc-stem', code: 'STEM', name: 'Competencia en ciencias, tecnología e ingeniería', description: 'Pensamiento científico-técnico' },
  { id: 'kc-cd', code: 'CD', name: 'Competencia digital', description: 'Uso seguro y crítico de tecnologías' },
  { id: 'kc-cpsaa', code: 'CPSAA', name: 'Competencia personal, social y aprender a aprender', description: 'Autogestión del aprendizaje' },
  { id: 'kc-cc', code: 'CC', name: 'Competencia ciudadana', description: 'Participación democrática' },
  { id: 'kc-ce', code: 'CE', name: 'Competencia emprendedora', description: 'Iniciativa y emprendimiento' },
  { id: 'kc-ccec', code: 'CCEC', name: 'Competencia en conciencia y expresión culturales', description: 'Expresión artística y cultural' }
];

// Dibujo Técnico I - Competencias Específicas (Actualizado según programación de referencia)
export const specificCompetenciesDT: SpecificCompetency[] = [
  { 
    id: 'sc-dt-1', 
    code: 'CE1', 
    name: 'Interpretar elementos arquitectónicos y de ingeniería', 
    description: 'Interpretar elementos o conjuntos arquitectónicos y de ingeniería, empleando recursos asociados a la percepción, estudio, construcción e investigación de formas, para analizar las estructuras geométricas y los elementos técnicos utilizados.', 
    subjectId: 'sub-dt1', 
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-cc', 'kc-ccec'],
    profileDescriptors: ['CCL1', 'CCL2', 'STEM4', 'CD1', 'CPSAA4', 'CC1', 'CEC1', 'CEC2']
  },
  { 
    id: 'sc-dt-2', 
    code: 'CE2', 
    name: 'Utilizar razonamientos geométricos', 
    description: 'Utilizar razonamientos inductivos, deductivos y lógicos en problemas de índole gráfico-matemáticos, aplicando fundamentos de la geometría plana para resolver gráficamente operaciones matemáticas, relaciones, construcciones y transformaciones.', 
    subjectId: 'sub-dt1', 
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cpsaa', 'kc-ce'],
    profileDescriptors: ['CCL2', 'STEM1', 'STEM2', 'STEM4', 'CPSAA1.1', 'CPSAA5', 'CE2']
  },
  { 
    id: 'sc-dt-3', 
    code: 'CE3', 
    name: 'Desarrollar la visión espacial', 
    description: 'Desarrollar la visión espacial, utilizando la geometría descriptiva en proyectos sencillos, considerando la importancia del dibujo en arquitectura e ingeniería para resolver problemas e interpretar y recrear gráficamente la realidad tridimensional sobre la superficie del plano.', 
    subjectId: 'sub-dt1', 
    keyCompetencyIds: ['kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-cc', 'kc-ccec'],
    profileDescriptors: ['STEM1', 'STEM3', 'CD2', 'CPSAA4', 'CC3', 'CEC2']
  },
  { 
    id: 'sc-dt-4', 
    code: 'CE4', 
    name: 'Documentar proyectos técnicos', 
    description: 'Documentar gráficamente proyectos sencillos de ingeniería o arquitectura, aplicando la normativa UNE e ISO, para comunicar de forma inequívoca la forma y dimensiones de objetos y espacios.', 
    subjectId: 'sub-dt1', 
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd', 'kc-cc', 'kc-ce', 'kc-ccec'],
    profileDescriptors: ['CCL3', 'CCL5', 'STEM4', 'CD5', 'CC1', 'CE1', 'CEC1']
  },
  { 
    id: 'sc-dt-5', 
    code: 'CE5', 
    name: 'Investigar con programas CAD', 
    description: 'Investigar, experimentar y representar digitalmente elementos, planos y esquemas técnicos mediante el uso de programas específicos CAD, apreciando su uso en las profesiones actuales, para virtualizar objetos y espacios en dos y tres dimensiones.', 
    subjectId: 'sub-dt1', 
    keyCompetencyIds: ['kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-ce'],
    profileDescriptors: ['STEM2', 'STEM3', 'CD2', 'CD5', 'CPSAA4', 'CE1', 'CE3']
  }
];

// Criterios de Evaluación Dibujo Técnico I (Actualizado según programación de referencia)
export const evaluationCriteriaDT: EvaluationCriterion[] = [
  { id: 'ec-dt-1-1', code: '1.1', description: 'Analizar, a lo largo de la historia, la relación entre las matemáticas y el dibujo geométrico, valorando su importancia en arquitectura, ingeniería y arte desde la perspectiva de género y la diversidad cultural.', specificCompetencyId: 'sc-dt-1', subjectId: 'sub-dt1', weight: 5 },
  { id: 'ec-dt-2-1', code: '2.1', description: 'Solucionar gráficamente cálculos matemáticos y transformaciones básicas aplicando conceptos de geometría plana.', specificCompetencyId: 'sc-dt-2', subjectId: 'sub-dt1', weight: 10 },
  { id: 'ec-dt-2-2', code: '2.2', description: 'Trazar gráficamente construcciones poligonales con precisión, claridad y limpieza.', specificCompetencyId: 'sc-dt-2', subjectId: 'sub-dt1', weight: 10 },
  { id: 'ec-dt-2-3', code: '2.3', description: 'Resolver gráficamente tangencias y trazar curvas aplicando sus propiedades con rigor.', specificCompetencyId: 'sc-dt-2', subjectId: 'sub-dt1', weight: 10 },
  { id: 'ec-dt-3-1', code: '3.1', description: 'Representar en sistema diédrico elementos básicos determinando su relación de pertenencia, posición y distancia.', specificCompetencyId: 'sc-dt-3', subjectId: 'sub-dt1', weight: 10 },
  { id: 'ec-dt-3-2', code: '3.2', description: 'Definir figuras planas y sólidos sencillos en sistemas axonométricos.', specificCompetencyId: 'sc-dt-3', subjectId: 'sub-dt1', weight: 5 },
  { id: 'ec-dt-3-3', code: '3.3', description: 'Representar e interpretar elementos básicos en planos acotados.', specificCompetencyId: 'sc-dt-3', subjectId: 'sub-dt1', weight: 5 },
  { id: 'ec-dt-3-4', code: '3.4', description: 'Valorar el rigor gráfico del proceso, la claridad, precisión y limpieza.', specificCompetencyId: 'sc-dt-3', subjectId: 'sub-dt1', weight: 5 },
  { id: 'ec-dt-4-1', code: '4.1', description: 'Documentar gráficamente objetos sencillos mediante vistas acotadas aplicando normativa UNE e ISO.', specificCompetencyId: 'sc-dt-4', subjectId: 'sub-dt1', weight: 10 },
  { id: 'ec-dt-4-2', code: '4.2', description: 'Utilizar el croquis y el boceto como elementos de reflexión en la búsqueda de soluciones.', specificCompetencyId: 'sc-dt-4', subjectId: 'sub-dt1', weight: 5 },
  { id: 'ec-dt-5-1', code: '5.1', description: 'Crear figuras planas y tridimensionales mediante programas de dibujo vectorial.', specificCompetencyId: 'sc-dt-5', subjectId: 'sub-dt1', weight: 10 },
  { id: 'ec-dt-5-2', code: '5.2', description: 'Recrear virtualmente piezas en 3D aplicando operaciones algebraicas entre primitivas.', specificCompetencyId: 'sc-dt-5', subjectId: 'sub-dt1', weight: 5 }
];

// Taller de Podcast - Competencias Específicas
export const specificCompetenciesPodcast: SpecificCompetency[] = [
  { id: 'sc-pp-1', code: 'CE1', name: 'Comunicación oral', description: 'Desarrollar habilidades de comunicación oral y locución', subjectId: 'sub-podcast', keyCompetencyIds: ['kc-ccl', 'kc-ccec'] },
  { id: 'sc-pp-2', code: 'CE2', name: 'Lenguaje radiofónico', description: 'Dominar el lenguaje radiofónico y sus géneros', subjectId: 'sub-podcast', keyCompetencyIds: ['kc-ccl'] },
  { id: 'sc-pp-3', code: 'CE3', name: 'Producción sonora', description: 'Producir contenidos sonoros con herramientas digitales', subjectId: 'sub-podcast', keyCompetencyIds: ['kc-cd', 'kc-ccec'] },
  { id: 'sc-pp-4', code: 'CE4', name: 'Trabajo cooperativo', description: 'Colaborar en proyectos de creación sonora', subjectId: 'sub-podcast', keyCompetencyIds: ['kc-cpsaa', 'kc-cc'] }
];

export const evaluationCriteriaPodcast: EvaluationCriterion[] = [
  { id: 'ec-pp-1-1', code: '1.1', description: 'Expresarse oralmente con claridad y corrección', specificCompetencyId: 'sc-pp-1', subjectId: 'sub-podcast' },
  { id: 'ec-pp-1-2', code: '1.2', description: 'Utilizar recursos de la locución profesional', specificCompetencyId: 'sc-pp-1', subjectId: 'sub-podcast' },
  { id: 'ec-pp-2-1', code: '2.1', description: 'Redactar guiones literarios y técnicos', specificCompetencyId: 'sc-pp-2', subjectId: 'sub-podcast' },
  { id: 'ec-pp-2-2', code: '2.2', description: 'Diferenciar y aplicar géneros radiofónicos', specificCompetencyId: 'sc-pp-2', subjectId: 'sub-podcast' },
  { id: 'ec-pp-3-1', code: '3.1', description: 'Grabar y editar audio con REAPER', specificCompetencyId: 'sc-pp-3', subjectId: 'sub-podcast' },
  { id: 'ec-pp-3-2', code: '3.2', description: 'Diseñar paisajes sonoros', specificCompetencyId: 'sc-pp-3', subjectId: 'sub-podcast' },
  { id: 'ec-pp-4-1', code: '4.1', description: 'Planificar y ejecutar un proyecto cooperativo', specificCompetencyId: 'sc-pp-4', subjectId: 'sub-podcast' }
];

// Taller de Cortometraje - Competencias Específicas
export const specificCompetenciesCorto: SpecificCompetency[] = [
  { id: 'sc-cc-1', code: 'CE1', name: 'Narrativa audiovisual', description: 'Crear narrativas audiovisuales coherentes', subjectId: 'sub-corto', keyCompetencyIds: ['kc-ccl', 'kc-ccec'] },
  { id: 'sc-cc-2', code: 'CE2', name: 'Lenguaje cinematográfico', description: 'Dominar el lenguaje cinematográfico', subjectId: 'sub-corto', keyCompetencyIds: ['kc-ccec', 'kc-stem'] },
  { id: 'sc-cc-3', code: 'CE3', name: 'Producción audiovisual', description: 'Producir piezas audiovisuales completas', subjectId: 'sub-corto', keyCompetencyIds: ['kc-cd', 'kc-ce'] },
  { id: 'sc-cc-4', code: 'CE4', name: 'Trabajo en equipo', description: 'Colaborar en producciones audiovisuales', subjectId: 'sub-corto', keyCompetencyIds: ['kc-cpsaa', 'kc-cc'] }
];

export const evaluationCriteriaCorto: EvaluationCriterion[] = [
  { id: 'ec-cc-1-1', code: '1.1', description: 'Desarrollar ideas narrativas originales', specificCompetencyId: 'sc-cc-1', subjectId: 'sub-corto' },
  { id: 'ec-cc-1-2', code: '1.2', description: 'Escribir guiones literarios y técnicos', specificCompetencyId: 'sc-cc-1', subjectId: 'sub-corto' },
  { id: 'ec-cc-2-1', code: '2.1', description: 'Aplicar tipos de plano y movimientos de cámara', specificCompetencyId: 'sc-cc-2', subjectId: 'sub-corto' },
  { id: 'ec-cc-2-2', code: '2.2', description: 'Diseñar storyboards efectivos', specificCompetencyId: 'sc-cc-2', subjectId: 'sub-corto' },
  { id: 'ec-cc-3-1', code: '3.1', description: 'Rodar secuencias con calidad técnica', specificCompetencyId: 'sc-cc-3', subjectId: 'sub-corto' },
  { id: 'ec-cc-3-2', code: '3.2', description: 'Editar y montar con DaVinci Resolve', specificCompetencyId: 'sc-cc-3', subjectId: 'sub-corto' },
  { id: 'ec-cc-4-1', code: '4.1', description: 'Coordinar un equipo de producción', specificCompetencyId: 'sc-cc-4', subjectId: 'sub-corto' }
];

// Learning Situations - Dibujo Técnico I (Actualizado según programación de referencia)
export const learningSituationsDT: LearningSituation[] = [
  {
    id: 'sda-dt-1', 
    title: 'Geometría en la ciudad: del plano al objeto', 
    programmeId: 'prog-dt1', 
    subjectId: 'sub-dt1',
    evaluationPeriod: '1', 
    timing: 'Septiembre - Octubre', 
    sessions: 12,
    context: 'Análisis de elementos arquitectónicos del entorno cántabro para comprender la geometría subyacente',
    justification: 'Conexión entre geometría plana y aplicaciones reales en arquitectura e ingeniería, contextualizando el aprendizaje en el entorno próximo del alumnado',
    finalProduct: 'Ficha técnica con croquis acotado, vistas principales y análisis geométrico de un elemento arquitectónico del entorno',
    objectives: 'Analizar formas geométricas en elementos arquitectónicos, realizar croquis acotados y elaborar documentación gráfica normalizada',
    methodology: 'Aprendizaje basado en proyectos con enfoque DUA: salida al entorno (motivación), análisis geométrico (desarrollo), elaboración de ficha técnica (síntesis)',
    resources: 'Instrumentos de dibujo tradicional, cámara fotográfica, software GeoGebra, plantillas de vistas',
    evaluationInstruments: 'Rúbrica de la ficha técnica (precisión, claridad, aplicación normativa), portafolio de croquis, observación directa',
    diversity: 'Elección del elemento según complejidad, plantillas de vistas para alumnado con dificultades espaciales, opción de presentación oral o escrita',
    reinforcementMeasures: 'Tutoriales en vídeo de trazados básicos, tutoría entre iguales, sesiones de refuerzo individualizado',
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-cc', 'kc-ccec'],
    specificCompetencyIds: ['sc-dt-1', 'sc-dt-2', 'sc-dt-4'],
    criterionIds: ['ec-dt-1-1', 'ec-dt-2-1', 'ec-dt-2-2', 'ec-dt-4-1'],
    basicKnowledgeIds: ['bk-dt-1', 'bk-dt-2', 'bk-dt-7'],
    phases: ['Fase 1 (motivación): Salida al entorno próximo para fotografiar y croquizar elementos arquitectónicos', 'Fase 2 (desarrollo): Análisis de las formas geométricas subyacentes (polígonos, tangencias, proporciones), realización de croquis acotados y vistas', 'Fase 3 (síntesis): Elaboración de la ficha técnica final con documentación gráfica normalizada'],
    challenge: 'Analizar un elemento arquitectónico del entorno (una plaza, un edificio, una fuente) y elaborar una ficha técnica completa',
    curricularJustification: '1º Bachillerato — Dibujo Técnico I; Criterios: 1.1, 2.1, 2.2, 4.1; Saberes: B1 (fundamentos geométricos), B3 (normalización)'
  },
  {
    id: 'sda-dt-2', 
    title: 'Diseña tu espacio: proyecto de un objeto funcional', 
    programmeId: 'prog-dt1', 
    subjectId: 'sub-dt1',
    evaluationPeriod: '1', 
    timing: 'Noviembre - Diciembre', 
    sessions: 14,
    context: 'Diseño de un objeto funcional (soporte para móvil, estantería modular, banco de plaza) aplicando conceptos de tangencias y geometría plana',
    justification: 'Las tangencias y construcciones geométricas son fundamentales en el diseño técnico y la ingeniería. El alumnado aplica conocimientos abstractos a un problema real y contextualizado',
    finalProduct: 'Objeto diseñado con vistas diédricas, perspectiva axonométrica y modelo 3D digital en CAD',
    objectives: 'Resolver gráficamente problemas de tangencias, representar el objeto en sistema diédrico y modelarlo en 3D con software CAD',
    methodology: 'Aprendizaje basado en retos con enfoque DUA: definición del objeto y bocetos (Fase 1), representación diédrica y acotación (Fase 2), modelado 3D y presentación (Fase 3)',
    resources: 'Instrumentos de dibujo técnico, LibreCAD/SketchUp, piezas de referencia, tutoriales de CAD',
    evaluationInstruments: 'Rúbrica del proyecto (precisión diédrica, corrección de acotación, calidad del modelo 3D), presentación oral, portafolio de bocetos',
    diversity: 'Posibilidad de trabajar con piezas prefabricadas (primitivas) para alumnado con menor dominio CAD, tutoría entre iguales en el manejo del software, elección del objeto según intereses',
    reinforcementMeasures: 'Ejercicios guiados paso a paso de tangencias, tutoriales en vídeo de CAD, sesiones de apoyo individualizado',
    keyCompetencyIds: ['kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-ce', 'kc-ccec'],
    specificCompetencyIds: ['sc-dt-2', 'sc-dt-3', 'sc-dt-4', 'sc-dt-5'],
    criterionIds: ['ec-dt-2-3', 'ec-dt-3-1', 'ec-dt-3-2', 'ec-dt-4-1', 'ec-dt-5-1', 'ec-dt-5-2'],
    basicKnowledgeIds: ['bk-dt-3', 'bk-dt-4', 'bk-dt-5', 'bk-dt-6', 'bk-dt-7'],
    phases: ['Fase 1: Definición del objeto y bocetos a mano alzada', 'Fase 2: Representación en sistema diédrico (vistas) y acotación', 'Fase 3: Modelado 3D con software CAD y presentación final'],
    challenge: 'Diseñar un objeto sencillo (un soporte para móvil, una estantería modular, un banco de plaza) y documentarlo completamente',
    curricularJustification: '1º Bachillerato — Dibujo Técnico I; Criterios: 2.3, 3.1, 3.2, 4.1, 5.1, 5.2; Saberes: B1 (tangencias), B2 (geometría proyectiva), B3 (normalización), B4 (CAD)'
  },
  {
    id: 'sda-dt-3', 
    title: 'Mujeres que dibujan el mundo: geometría con perspectiva de género', 
    programmeId: 'prog-dt1', 
    subjectId: 'sub-dt1',
    evaluationPeriod: '2', 
    timing: 'Enero - Febrero', 
    sessions: 10,
    context: 'Investigación sobre la contribución de mujeres relevantes en la historia de la geometría, la ingeniería y la arquitectura',
    justification: 'Integración de la perspectiva de género en la enseñanza del dibujo técnico, visibilizando referentes femeninos en STEM y fomentando la igualdad',
    finalProduct: 'Infografía o presentación digital sobre una mujer referente en geometría, ingeniería o arquitectura (Hipatia de Alejandría, Emily Roebling, Zaha Hadid, etc.)',
    objectives: 'Investigar la contribución técnica de mujeres en la historia de la geometría y la ingeniería, elaborando un producto digital que visibilice su trabajo',
    methodology: 'Aprendizaje basado en investigación con enfoque DUA: búsqueda guiada de información (Fase 1), análisis de la contribución técnica (Fase 2), elaboración del producto digital y presentación oral (Fase 3)',
    resources: 'Bibliografía y recursos digitales sobre mujeres en STEM, herramientas de diseño gráfico (Canva, Genially), proyector para presentaciones',
    evaluationInstruments: 'Rúbrica de la infografía/presentación (rigor histórico, claridad, inclusión de aspectos técnicos), coevaluación entre grupos, presentación oral',
    diversity: 'Posibilidad de presentación en formato escrito, oral o visual, flexibilidad en la elección de la figura a investigar, trabajo individual o en pequeños grupos',
    reinforcementMeasures: 'Guía de búsqueda de información, plantilla para la infografía, sesiones de tutoría para el diseño gráfico',
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-cc', 'kc-ccec'],
    specificCompetencyIds: ['sc-dt-1'],
    criterionIds: ['ec-dt-1-1'],
    basicKnowledgeIds: ['bk-dt-1'],
    phases: ['Fase 1: Búsqueda guiada de información sobre mujeres referentes en STEM', 'Fase 2: Selección y análisis de la contribución técnica', 'Fase 3: Elaboración del producto digital y presentación oral'],
    challenge: 'Investigar y presentar la contribución de una mujer relevante en la historia de la geometría, la ingeniería o la arquitectura',
    curricularJustification: '1º Bachillerato — Dibujo Técnico I; Criterio: 1.1; Saberes: B1 (desarrollo histórico del dibujo técnico); Elementos transversales: Igualdad de género, Competencia digital'
  },
  {
    id: 'sda-dt-4', 
    title: 'Documentación gráfica de objetos reales', 
    programmeId: 'prog-dt1', 
    subjectId: 'sub-dt1',
    evaluationPeriod: '2', 
    timing: 'Marzo - Abril', 
    sessions: 12,
    context: 'Documentación gráfica completa de objetos reales mediante vistas, cortes, secciones y acotación normalizada',
    justification: 'La normalización y documentación gráfica son imprescindibles en la comunicación técnica profesional. El alumnado aprende a comunicar de forma inequívoca la forma y dimensiones de objetos',
    finalProduct: 'Documentación gráfica completa de un objeto real: vistas normalizadas, cortes, secciones y acotación según normativa UNE-ISO',
    objectives: 'Documentar gráficamente objetos sencillos mediante vistas acotadas aplicando normativa UNE e ISO, utilizando el croquis y el boceto como elementos de reflexión',
    methodology: 'Aprendizaje basado en problemas reales con enfoque DUA: análisis del objeto y croquis (Fase 1), elaboración de vistas normalizadas (Fase 2), acotación y revisión (Fase 3)',
    resources: 'Objetos reales (piezas mecánicas, objetos cotidianos), calibre, pie de rey, instrumentos de dibujo técnico, normativa UNE-ISO de consulta',
    evaluationInstruments: 'Rúbrica de documentación gráfica (aplicación normativa, precisión de acotación, claridad de vistas), croquis previos, prueba escrita de normalización',
    diversity: 'Objetos de complejidad variable, plantillas de vistas para alumnado con dificultades, trabajo en parejas para revisión cruzada, guía de consulta de normativa',
    reinforcementMeasures: 'Ejercicios progresivos de acotación, guía visual de normas UNE-ISO, tutoriales en vídeo, sesiones de refuerzo individualizado',
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd', 'kc-cc', 'kc-ce', 'kc-ccec'],
    specificCompetencyIds: ['sc-dt-3', 'sc-dt-4'],
    criterionIds: ['ec-dt-3-1', 'ec-dt-3-4', 'ec-dt-4-1', 'ec-dt-4-2'],
    basicKnowledgeIds: ['bk-dt-5', 'bk-dt-7'],
    phases: ['Fase 1: Análisis del objeto y realización de croquis a mano alzada', 'Fase 2: Elaboración de vistas normalizadas, cortes y secciones', 'Fase 3: Acotación según normativa UNE-ISO y revisión final'],
    challenge: 'Documentar gráficamente un objeto real de forma completa y normalizada',
    curricularJustification: '1º Bachillerato — Dibujo Técnico I; Criterios: 3.1, 3.4, 4.1, 4.2; Saberes: B2 (geometría proyectiva), B3 (normalización y documentación gráfica)'
  },
  {
    id: 'sda-dt-5', 
    title: 'Proyecto integrador: virtualización de un espacio arquitectónico', 
    programmeId: 'prog-dt1', 
    subjectId: 'sub-dt1',
    evaluationPeriod: '3', 
    timing: 'Abril - Mayo', 
    sessions: 20,
    context: 'Proyecto final integrador que aplica todos los conocimientos del curso: geometría plana, sistemas de representación, normalización y CAD',
    justification: 'Integración de todas las competencias específicas mediante un proyecto real y contextualizado que simula un encargo profesional de arquitectura o ingeniería',
    finalProduct: 'Proyecto completo de virtualización de un espacio arquitectónico: planos diédricos normalizados, perspectiva axonométrica, modelo 3D en CAD y memoria técnica',
    objectives: 'Integrar todos los conocimientos del curso en un proyecto completo: representación diédrica, perspectiva axonométrica, modelado 3D y documentación gráfica normalizada',
    methodology: 'Aprendizaje basado en proyectos con enfoque DUA y simulación de encargo profesional: definición del proyecto y bocetos (Fase 1), representación diédrica y axonométrica (Fase 2), modelado 3D en CAD (Fase 3), documentación final y presentación (Fase 4)',
    resources: 'LibreCAD, SketchUp, ordenadores con software CAD, normativa UNE-ISO, bibliografía técnica, espacio de trabajo amplio',
    evaluationInstruments: 'Rúbrica del proyecto completo (precisión diédrica, calidad del modelo 3D, aplicación normativa, presentación), memoria técnica, defensa oral del proyecto, portafolio digital',
    diversity: 'Temas de proyecto a elegir según intereses (vivienda, espacio público, equipamiento), tutoría individualizada, trabajo en parejas, flexibilidad en plazos de entrega',
    reinforcementMeasures: 'Sesiones de tutoría individual, guías paso a paso para cada fase, tutoriales en vídeo de CAD, sesiones de refuerzo grupal',
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-cc', 'kc-ce', 'kc-ccec'],
    specificCompetencyIds: ['sc-dt-2', 'sc-dt-3', 'sc-dt-4', 'sc-dt-5'],
    criterionIds: ['ec-dt-2-1', 'ec-dt-3-1', 'ec-dt-3-2', 'ec-dt-4-1', 'ec-dt-5-1', 'ec-dt-5-2'],
    basicKnowledgeIds: ['bk-dt-3', 'bk-dt-5', 'bk-dt-6', 'bk-dt-7'],
    phases: ['Fase 1: Definición del proyecto, bocetos a mano alzada y planificación', 'Fase 2: Representación diédrica (vistas, cortes) y perspectiva axonométrica', 'Fase 3: Modelado 3D en software CAD', 'Fase 4: Documentación final, memoria técnica y presentación oral'],
    challenge: 'Virtualizar completamente un espacio arquitectónico desde el boceto inicial hasta el modelo 3D digital',
    curricularJustification: '1º Bachillerato — Dibujo Técnico I; Criterios: 2.1, 3.1, 3.2, 4.1, 5.1, 5.2; Saberes: B1 (tangencias), B2 (geometría proyectiva), B3 (normalización), B4 (CAD)'
  }
];

// Learning Situations - Podcast
export const learningSituationsPodcast: LearningSituation[] = [
  {
    id: 'sda-pp-1', title: 'Narrar para el oído', programmeId: 'prog-pp', subjectId: 'sub-podcast',
    evaluationPeriod: '1', timing: 'Septiembre - Octubre', sessions: 10,
    context: 'Introducción al lenguaje radiofónico y la narración sonora',
    justification: 'Base fundamental para toda producción podcast',
    finalProduct: 'Narración sonora de 3 minutos',
    objectives: 'Dominar los fundamentos de la narración oral para audio',
    methodology: 'Taller práctico con grabaciones progresivas',
    resources: 'Micrófonos, REAPER, guiones',
    evaluationInstruments: 'Grabación, rúbrica de locución',
    diversity: 'Textos de distinta dificultad',
    reinforcementMeasures: 'Ejercicios de vocalización y respiración',
    keyCompetencyIds: ['kc-ccl', 'kc-ccec'],
    specificCompetencyIds: ['sc-pp-1'],
    criterionIds: ['ec-pp-1-1', 'ec-pp-1-2'],
    basicKnowledgeIds: ['bk-pp-1']
  },
  {
    id: 'sda-pp-2', title: 'Noticias del instituto', programmeId: 'prog-pp', subjectId: 'sub-podcast',
    evaluationPeriod: '1', timing: 'Noviembre', sessions: 8,
    context: 'Creación de un boletín informativo del centro',
    justification: 'Aplicación práctica del género informativo',
    finalProduct: 'Boletín informativo podcast de 10 minutos',
    objectives: 'Producir un contenido informativo completo',
    methodology: 'Trabajo cooperativo con roles de redacción',
    resources: 'Micrófonos, REAPER, grabadora de campo',
    evaluationInstruments: 'Podcast final, rúbrica grupal',
    diversity: 'Roles adaptados a capacidades',
    reinforcementMeasures: 'Plantillas de guion',
    keyCompetencyIds: ['kc-ccl', 'kc-cc'],
    specificCompetencyIds: ['sc-pp-2', 'sc-pp-4'],
    criterionIds: ['ec-pp-2-1', 'ec-pp-2-2', 'ec-pp-4-1'],
    basicKnowledgeIds: ['bk-pp-2', 'bk-pp-3']
  },
  {
    id: 'sda-pp-3', title: 'Tertulia y debate', programmeId: 'prog-pp', subjectId: 'sub-podcast',
    evaluationPeriod: '2', timing: 'Enero - Febrero', sessions: 10,
    context: 'Producción de un programa de tertulia sobre temas de actualidad',
    justification: 'Desarrollo de la argumentación y el debate oral',
    finalProduct: 'Programa de tertulia de 15 minutos',
    objectives: 'Dominar el género de tertulia y el debate argumentativo',
    methodology: 'Simulación de programa con roles',
    resources: 'Estudio de grabación, REAPER',
    evaluationInstruments: 'Podcast, autoevaluación, coevaluación',
    diversity: 'Temas cercanos al alumnado',
    reinforcementMeasures: 'Guion estructurado con preguntas guía',
    keyCompetencyIds: ['kc-ccl', 'kc-cc', 'kc-cpsaa'],
    specificCompetencyIds: ['sc-pp-1', 'sc-pp-2'],
    criterionIds: ['ec-pp-1-1', 'ec-pp-2-2'],
    basicKnowledgeIds: ['bk-pp-2']
  },
  {
    id: 'sda-pp-4', title: 'Podcast de divulgación', programmeId: 'prog-pp', subjectId: 'sub-podcast',
    evaluationPeriod: '2', timing: 'Marzo', sessions: 10,
    context: 'Creación de un podcast divulgativo sobre un tema científico o cultural',
    justification: 'Integración de contenidos divulgativos con producción sonora',
    finalProduct: 'Episodio divulgativo con paisaje sonoro',
    objectives: 'Producir contenido divulgativo con calidad sonora profesional',
    methodology: 'Investigación + producción + edición',
    resources: 'REAPER, fuentes de investigación, micrófonos',
    evaluationInstruments: 'Podcast, rúbrica de contenido y técnica',
    diversity: 'Temas a elegir según intereses',
    reinforcementMeasures: 'Plantilla de estructura divulgativa',
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd'],
    specificCompetencyIds: ['sc-pp-2', 'sc-pp-3'],
    criterionIds: ['ec-pp-2-1', 'ec-pp-3-1', 'ec-pp-3-2'],
    basicKnowledgeIds: ['bk-pp-4', 'bk-pp-5']
  },
  {
    id: 'sda-pp-5', title: 'Proyecto final: mi podcast', programmeId: 'prog-pp', subjectId: 'sub-podcast',
    evaluationPeriod: '3', timing: 'Abril - Mayo', sessions: 14,
    context: 'Creación de un podcast completo de autoría propia',
    justification: 'Proyecto integrador que demuestra todas las competencias',
    finalProduct: 'Podcast completo de 3 episodios',
    objectives: 'Producir un podcast completo de principio a fin',
    methodology: 'Proyecto individual con tutorías',
    resources: 'Equipo completo de producción',
    evaluationInstruments: 'Podcast final, memoria del proyecto, defensa oral',
    diversity: 'Libertad temática con seguimiento individualizado',
    reinforcementMeasures: 'Plan de trabajo personalizado',
    keyCompetencyIds: ['kc-ccl', 'kc-cd', 'kc-ccec', 'kc-ce', 'kc-cpsaa'],
    specificCompetencyIds: ['sc-pp-1', 'sc-pp-2', 'sc-pp-3', 'sc-pp-4'],
    criterionIds: ['ec-pp-1-1', 'ec-pp-1-2', 'ec-pp-2-1', 'ec-pp-3-1', 'ec-pp-3-2', 'ec-pp-4-1'],
    basicKnowledgeIds: ['bk-pp-1', 'bk-pp-2', 'bk-pp-4', 'bk-pp-5', 'bk-pp-6']
  }
];

// Learning Situations - Cortometraje
export const learningSituationsCorto: LearningSituation[] = [
  {
    id: 'sda-cc-1', title: 'La idea cinematográfica', programmeId: 'prog-cc', subjectId: 'sub-corto',
    evaluationPeriod: '1', timing: 'Septiembre - Octubre', sessions: 10,
    context: 'Desarrollo de la creatividad narrativa audiovisual',
    justification: 'Todo cortometraje comienza con una idea',
    finalProduct: 'Dossier de proyecto con sinopsis, logline y argumento',
    objectives: 'Desarrollar ideas narrativas y estructurarlas',
    methodology: 'Taller de escritura creativa y análisis fílmico',
    resources: 'Proyector, cuaderno de guion, películas de referencia',
    evaluationInstruments: 'Dossier, presentación oral',
    diversity: 'Géneros a elegir según preferencias',
    reinforcementMeasures: 'Análisis guiado de cortos premiados',
    keyCompetencyIds: ['kc-ccl', 'kc-ccec'],
    specificCompetencyIds: ['sc-cc-1'],
    criterionIds: ['ec-cc-1-1'],
    basicKnowledgeIds: ['bk-cc-1']
  },
  {
    id: 'sda-cc-2', title: 'Del guion al storyboard', programmeId: 'prog-cc', subjectId: 'sub-corto',
    evaluationPeriod: '1', timing: 'Noviembre', sessions: 10,
    context: 'Traducción del texto al lenguaje visual',
    justification: 'El storyboard es el puente entre escritura y rodaje',
    finalProduct: 'Storyboard completo del cortometraje',
    objectives: 'Redactar guión técnico y diseñar storyboard',
    methodology: 'Taller de guion y dibujo técnico aplicado',
    resources: 'Plantillas de storyboard, guion técnico',
    evaluationInstruments: 'Guión técnico, storyboard, rúbrica',
    diversity: 'Niveles de detalle adaptables',
    reinforcementMeasures: 'Ejemplos de storyboards profesionales',
    keyCompetencyIds: ['kc-ccl', 'kc-ccec', 'kc-cd'],
    specificCompetencyIds: ['sc-cc-1', 'sc-cc-2'],
    criterionIds: ['ec-cc-1-2', 'ec-cc-2-2'],
    basicKnowledgeIds: ['bk-cc-2', 'bk-cc-3']
  },
  {
    id: 'sda-cc-3', title: 'Rodaje: la cámara en acción', programmeId: 'prog-cc', subjectId: 'sub-corto',
    evaluationPeriod: '2', timing: 'Enero - Febrero', sessions: 14,
    context: 'Práctica de rodaje con dominio del lenguaje cinematográfico',
    justification: 'Es necesario dominar la técnica para comunicar',
    finalProduct: 'Material rodado organizado por secuencias',
    objectives: 'Rodar secuencias con calidad técnica y narrativa',
    methodology: 'Práctica intensiva de rodaje en equipos',
    resources: 'Cámaras, trípodes, iluminación básica',
    evaluationInstruments: 'Material rodado, plan de rodaje, rúbrica técnica',
    diversity: 'Roles rotativos en el equipo',
    reinforcementMeasures: 'Prácticas previas con ejercicios cortos',
    keyCompetencyIds: ['kc-ccec', 'kc-cd', 'kc-cpsaa'],
    specificCompetencyIds: ['sc-cc-2', 'sc-cc-3'],
    criterionIds: ['ec-cc-2-1', 'ec-cc-3-1'],
    basicKnowledgeIds: ['bk-cc-4', 'bk-cc-5']
  },
  {
    id: 'sda-cc-4', title: 'Montaje y postproducción', programmeId: 'prog-cc', subjectId: 'sub-corto',
    evaluationPeriod: '2', timing: 'Marzo', sessions: 12,
    context: 'Edición y postproducción del material rodado',
    justification: 'El montaje es donde se construye el relato final',
    finalProduct: 'Cortometraje montado con sonido y créditos',
    objectives: 'Editar y montar un cortometraje completo',
    methodology: 'Taller de edición con DaVinci Resolve',
    resources: 'Ordenadores con DaVinci Resolve',
    evaluationInstruments: 'Cortometraje editado, rúbrica de montaje',
    diversity: 'Asistencia técnica personalizada',
    reinforcementMeasures: 'Tutoriales de DaVinci Resolve',
    keyCompetencyIds: ['kc-cd', 'kc-ccec'],
    specificCompetencyIds: ['sc-cc-3'],
    criterionIds: ['ec-cc-3-2'],
    basicKnowledgeIds: ['bk-cc-6']
  },
  {
    id: 'sda-cc-5', title: 'Proyecto final: nuestro cortometraje', programmeId: 'prog-cc', subjectId: 'sub-corto',
    evaluationPeriod: '3', timing: 'Abril - Mayo', sessions: 16,
    context: 'Producción completa de un cortometraje desde la idea hasta la distribución',
    justification: 'Integración de todas las competencias en un proyecto real',
    finalProduct: 'Cortometraje terminado y presentado en festival del centro',
    objectives: 'Completar una producción audiovisual integral',
    methodology: 'Producción real con roles profesionales',
    resources: 'Equipo completo de producción audiovisual',
    evaluationInstruments: 'Cortometraje final, memoria, defensa del proyecto',
    diversity: 'Equipos con roles adaptados',
    reinforcementMeasures: 'Mentoría individualizada por equipo',
    keyCompetencyIds: ['kc-ccl', 'kc-ccec', 'kc-cd', 'kc-ce', 'kc-cpsaa', 'kc-cc'],
    specificCompetencyIds: ['sc-cc-1', 'sc-cc-2', 'sc-cc-3', 'sc-cc-4'],
    criterionIds: ['ec-cc-1-1', 'ec-cc-1-2', 'ec-cc-2-1', 'ec-cc-2-2', 'ec-cc-3-1', 'ec-cc-3-2', 'ec-cc-4-1'],
    basicKnowledgeIds: ['bk-cc-1', 'bk-cc-2', 'bk-cc-3', 'bk-cc-4', 'bk-cc-5', 'bk-cc-6', 'bk-cc-7']
  }
];

// Activities - Dibujo Técnico I
export const activitiesDT: Activity[] = [
  { id: 'act-dt-1', name: 'Trazados fundamentales', description: 'Ejercicios de trazados geométricos básicos', date: '2026-09-15', sessions: 3, type: 'practical', learningSituationId: 'sda-dt-1', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-dt-1-1'], basicKnowledgeIds: ['bk-dt-1'], evaluationInstrument: 'Rúbrica', weight: 15, maxScore: 10, observations: '' },
  { id: 'act-dt-2', name: 'Polígonos en el patrimonio', description: 'Construcción de polígonos inspirados en la arquitectura cántabra', date: '2026-10-01', sessions: 4, type: 'cooperative', learningSituationId: 'sda-dt-1', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-dt-1-2', 'ec-dt-2-1'], basicKnowledgeIds: ['bk-dt-2'], evaluationInstrument: 'Rúbrica + producto', weight: 20, maxScore: 10, observations: '' },
  { id: 'act-dt-3', name: 'Problemas de tangencias', description: 'Resolución de problemas de tangencias', date: '2026-11-05', sessions: 3, type: 'individual', learningSituationId: 'sda-dt-2', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-dt-1-3'], basicKnowledgeIds: ['bk-dt-3'], evaluationInstrument: 'Prueba práctica', weight: 15, maxScore: 10, observations: '' },
  { id: 'act-dt-4', name: 'Diseño CAD de pieza', description: 'Diseño de pieza mecánica en LibreCAD', date: '2026-11-20', sessions: 4, type: 'digital', learningSituationId: 'sda-dt-2', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-dt-5-1'], basicKnowledgeIds: ['bk-dt-4'], evaluationInstrument: 'Archivo CAD', weight: 20, maxScore: 10, observations: '' },
  { id: 'act-dt-5', name: 'Sistema diédrico: ejercicios', description: 'Práctica de representación diédrica', date: '2027-01-20', sessions: 4, type: 'practical', learningSituationId: 'sda-dt-3', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '2', criterionIds: ['ec-dt-3-1'], basicKnowledgeIds: ['bk-dt-5'], evaluationInstrument: 'Cuaderno + ejercicios', weight: 20, maxScore: 10, observations: '' },
  { id: 'act-dt-6', name: 'Modelo 3D en SketchUp', description: 'Creación de modelo tridimensional', date: '2027-02-10', sessions: 5, type: 'digital', learningSituationId: 'sda-dt-3', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '2', criterionIds: ['ec-dt-3-2', 'ec-dt-5-2'], basicKnowledgeIds: ['bk-dt-6'], evaluationInstrument: 'Modelo 3D + capturas', weight: 25, maxScore: 10, observations: '' },
  { id: 'act-dt-7', name: 'Plano acotado', description: 'Acotación normalizada de pieza', date: '2027-03-10', sessions: 3, type: 'individual', learningSituationId: 'sda-dt-4', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '2', criterionIds: ['ec-dt-4-1'], basicKnowledgeIds: ['bk-dt-7'], evaluationInstrument: 'Plano', weight: 15, maxScore: 10, observations: '' },
  { id: 'act-dt-8', name: 'Proyecto final CAD', description: 'Proyecto integrador con planos normalizados', date: '2027-04-15', sessions: 8, type: 'final_product', learningSituationId: 'sda-dt-5', subjectId: 'sub-dt1', groupId: 'group-1a', evaluationPeriod: '3', criterionIds: ['ec-dt-3-1', 'ec-dt-4-1', 'ec-dt-5-1', 'ec-dt-5-2'], basicKnowledgeIds: ['bk-dt-5', 'bk-dt-6', 'bk-dt-7'], evaluationInstrument: 'Proyecto + defensa', weight: 30, maxScore: 10, observations: '' }
];

// Activities - Podcast
export const activitiesPodcast: Activity[] = [
  { id: 'act-pp-1', name: 'Ejercicios de locución', description: 'Práctica de técnicas de locución', date: '2026-09-20', sessions: 3, type: 'practical', learningSituationId: 'sda-pp-1', subjectId: 'sub-podcast', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-pp-1-1', 'ec-pp-1-2'], basicKnowledgeIds: ['bk-pp-1'], evaluationInstrument: 'Grabación', weight: 20, maxScore: 10, observations: '' },
  { id: 'act-pp-2', name: 'Narración sonora', description: 'Grabación de narración de 3 minutos', date: '2026-10-15', sessions: 4, type: 'final_product', learningSituationId: 'sda-pp-1', subjectId: 'sub-podcast', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-pp-1-1'], basicKnowledgeIds: ['bk-pp-1'], evaluationInstrument: 'Podcast + rúbrica', weight: 25, maxScore: 10, observations: '' },
  { id: 'act-pp-3', name: 'Guion del boletín', description: 'Redacción del guion del boletín informativo', date: '2026-11-10', sessions: 3, type: 'cooperative', learningSituationId: 'sda-pp-2', subjectId: 'sub-podcast', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-pp-2-1'], basicKnowledgeIds: ['bk-pp-2'], evaluationInstrument: 'Guion', weight: 15, maxScore: 10, observations: '' },
  { id: 'act-pp-4', name: 'Boletín informativo', description: 'Producción del boletín completo', date: '2026-11-25', sessions: 4, type: 'final_product', learningSituationId: 'sda-pp-2', subjectId: 'sub-podcast', groupId: 'group-1a', evaluationPeriod: '1', criterionIds: ['ec-pp-2-1', 'ec-pp-2-2', 'ec-pp-4-1'], basicKnowledgeIds: ['bk-pp-2', 'bk-pp-3'], evaluationInstrument: 'Podcast + rúbrica grupal', weight: 30, maxScore: 10, observations: '' },
  { id: 'act-pp-5', name: 'Tertulia grabada', description: 'Producción de programa de tertulia', date: '2027-02-05', sessions: 5, type: 'cooperative', learningSituationId: 'sda-pp-3', subjectId: 'sub-podcast', groupId: 'group-1a', evaluationPeriod: '2', criterionIds: ['ec-pp-1-1', 'ec-pp-2-2'], basicKnowledgeIds: ['bk-pp-2'], evaluationInstrument: 'Podcast + coevaluación', weight: 25, maxScore: 10, observations: '' },
  { id: 'act-pp-6', name: 'Podcast divulgativo', description: 'Episodio de divulgación con paisaje sonoro', date: '2027-03-15', sessions: 5, type: 'final_product', learningSituationId: 'sda-pp-4', subjectId: 'sub-podcast', groupId: 'group-1a', evaluationPeriod: '2', criterionIds: ['ec-pp-2-1', 'ec-pp-3-1', 'ec-pp-3-2'], basicKnowledgeIds: ['bk-pp-4', 'bk-pp-5'], evaluationInstrument: 'Podcast + rúbrica', weight: 30, maxScore: 10, observations: '' },
  { id: 'act-pp-7', name: 'Proyecto final podcast', description: 'Podcast completo de 3 episodios', date: '2027-05-01', sessions: 8, type: 'final_product', learningSituationId: 'sda-pp-5', subjectId: 'sub-podcast', groupId: 'group-1a', evaluationPeriod: '3', criterionIds: ['ec-pp-1-1', 'ec-pp-2-1', 'ec-pp-3-1', 'ec-pp-4-1'], basicKnowledgeIds: ['bk-pp-1', 'bk-pp-2', 'bk-pp-4'], evaluationInstrument: 'Podcast + memoria + defensa', weight: 35, maxScore: 10, observations: '' }
];

// Activities - Cortometraje
export const activitiesCorto: Activity[] = [
  { id: 'act-cc-1', name: 'Lluvia de ideas', description: 'Generación y selección de ideas narrativas', date: '2026-09-18', sessions: 3, type: 'cooperative', learningSituationId: 'sda-cc-1', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '1', criterionIds: ['ec-cc-1-1'], basicKnowledgeIds: ['bk-cc-1'], evaluationInstrument: 'Dossier de ideas', weight: 15, maxScore: 10, observations: '' },
  { id: 'act-cc-2', name: 'Dossier de proyecto', description: 'Sinopsis, logline y argumento', date: '2026-10-10', sessions: 4, type: 'individual', learningSituationId: 'sda-cc-1', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '1', criterionIds: ['ec-cc-1-1'], basicKnowledgeIds: ['bk-cc-1'], evaluationInstrument: 'Dossier + presentación', weight: 20, maxScore: 10, observations: '' },
  { id: 'act-cc-3', name: 'Guión técnico', description: 'Redacción del guión técnico completo', date: '2026-11-12', sessions: 4, type: 'individual', learningSituationId: 'sda-cc-2', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '1', criterionIds: ['ec-cc-1-2'], basicKnowledgeIds: ['bk-cc-2'], evaluationInstrument: 'Guión técnico', weight: 20, maxScore: 10, observations: '' },
  { id: 'act-cc-4', name: 'Storyboard', description: 'Diseño del storyboard completo', date: '2026-11-28', sessions: 4, type: 'practical', learningSituationId: 'sda-cc-2', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '1', criterionIds: ['ec-cc-2-2'], basicKnowledgeIds: ['bk-cc-3'], evaluationInstrument: 'Storyboard + rúbrica', weight: 20, maxScore: 10, observations: '' },
  { id: 'act-cc-5', name: 'Prácticas de cámara', description: 'Ejercicios de planos y movimientos', date: '2027-01-22', sessions: 4, type: 'practical', learningSituationId: 'sda-cc-3', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '2', criterionIds: ['ec-cc-2-1'], basicKnowledgeIds: ['bk-cc-4'], evaluationInstrument: 'Material grabado', weight: 15, maxScore: 10, observations: '' },
  { id: 'act-cc-6', name: 'Rodaje del cortometraje', description: 'Rodaje completo del proyecto', date: '2027-02-12', sessions: 6, type: 'cooperative', learningSituationId: 'sda-cc-3', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '2', criterionIds: ['ec-cc-2-1', 'ec-cc-3-1'], basicKnowledgeIds: ['bk-cc-4', 'bk-cc-5'], evaluationInstrument: 'Material rodado + plan', weight: 25, maxScore: 10, observations: '' },
  { id: 'act-cc-7', name: 'Montaje en DaVinci', description: 'Edición y montaje del cortometraje', date: '2027-03-18', sessions: 6, type: 'digital', learningSituationId: 'sda-cc-4', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '2', criterionIds: ['ec-cc-3-2'], basicKnowledgeIds: ['bk-cc-6'], evaluationInstrument: 'Cortometraje editado', weight: 25, maxScore: 10, observations: '' },
  { id: 'act-cc-8', name: 'Festival del cortometraje', description: 'Presentación pública del cortometraje', date: '2027-05-10', sessions: 4, type: 'final_product', learningSituationId: 'sda-cc-5', subjectId: 'sub-corto', groupId: 'group-2a', evaluationPeriod: '3', criterionIds: ['ec-cc-1-1', 'ec-cc-2-1', 'ec-cc-3-1', 'ec-cc-3-2', 'ec-cc-4-1'], basicKnowledgeIds: ['bk-cc-1', 'bk-cc-6', 'bk-cc-7'], evaluationInstrument: 'Corto final + memoria + defensa', weight: 35, maxScore: 10, observations: '' }
];

// Generate demo grades
export const generateGrades = (activities: Activity[], studentIds: string[]): Grade[] => {
  const grades: Grade[] = [];
  activities.forEach(activity => {
    studentIds.forEach(studentId => {
      const score = Math.random() > 0.1 ? Math.round((Math.random() * 5 + 4) * 10) / 10 : null;
      grades.push({
        id: `grade-${activity.id}-${studentId}`,
        studentId,
        activityId: activity.id,
        score,
        observation: '',
        notCompleted: score === null,
        notEvaluated: false,
        recovery: false
      });
    });
  });
  return grades;
};

export const evaluationConfigs: EvaluationConfig[] = [
  { id: 'evalcfg-1', subjectId: 'sub-dt1', activityWeight: 60, criterionWeight: 20, sdaWeight: 10, recoveryWeight: 10 },
  { id: 'evalcfg-2', subjectId: 'sub-podcast', activityWeight: 50, criterionWeight: 20, sdaWeight: 15, recoveryWeight: 15 },
  { id: 'evalcfg-3', subjectId: 'sub-corto', activityWeight: 40, criterionWeight: 20, sdaWeight: 20, recoveryWeight: 20 }
];

// Programmes
export const programmes: Programme[] = [
  {
    id: 'prog-dt1', subjectId: 'sub-dt1', academicYearId: 'ay-2026', teacherId: 'user-teacher1',
    introduction: 'La asignatura de Dibujo Técnico I constituye una base fundamental para el desarrollo del pensamiento espacial y la comunicación gráfica en 1º de Bachillerato.',
    context: 'Esta programación se contextualiza en el IES Lope de Vega de Santa María de Cayón, centro de educación secundaria de Cantabria. El alumnado de 1º de Bachillerato presenta un interés creciente por las materias técnicas y artísticas.',
    legalFramework: 'LOMLOE (Ley Orgánica 3/2020), Real Decreto por el que se establecen las enseñanzas mínimas de Bachillerato, Decreto de la Comunidad Autónoma de Cantabria por el que se establece el currículo de Bachillerato.',
    keyCompetencies: 'Se trabajan especialmente las competencias STEM, CD y CCEC, integrando el pensamiento científico-técnico con la expresión artística y el uso de herramientas digitales.',
    specificCompetencies: 'Las competencias específicas se centran en la expresión gráfica, el análisis geométrico, los sistemas de representación, la normalización y el uso de herramientas CAD.',
    evaluationCriteria: 'Los criterios de evaluación se organizan en bloques: geometría plana, sistemas de representación, normalización y herramientas digitales.',
    basicKnowledge: 'Geometría plana, trazados geométricos, tangencias, curvas técnicas, sistema diédrico, perspectiva axonométrica, normalización, acotación, CAD.',
    methodology: 'Metodología activa basada en situaciones de aprendizaje, aprendizaje por proyectos y resolución de problemas. Se combina la práctica manual con herramientas digitales.',
    diversity: 'Atención a la diversidad mediante actividades de distinto nivel de complejidad, agrupamientos flexibles y apoyo individualizado.',
    evaluation: 'Evaluación continua y formativa. Se evalúan tanto procesos como productos. Instrumentos: rúbricas, pruebas prácticas, portafolios, proyectos.',
    evaluationInstruments: 'Rúbricas, pruebas prácticas, proyectos, portafolios, observación directa, cuaderno de clase.',
    recovery: 'Cada evaluación incluye actividades de recuperación. La evaluación final permite recuperar competencias no alcanzadas.',
    complementaryActivities: 'Visita a exposiciones de dibujo técnico, concurso de diseño, participación en ferias STEM.',
    timing: 'Distribuidas en tres evaluaciones con situaciones de aprendizaje progresivas.'
  },
  {
    id: 'prog-pp', subjectId: 'sub-podcast', academicYearId: 'ay-2026', teacherId: 'user-teacher1',
    introduction: 'El Taller de Podcast es una materia optativa que desarrolla competencias comunicativas, digitales y creativas a través de la producción de contenidos sonoros.',
    context: 'Impartida en 1º de Bachillerato en el IES Lope de Vega. Aprovecha el interés del alumnado por los medios digitales y la comunicación.',
    legalFramework: 'LOMLOE, currículo de Bachillerato de Cantabria, materia optativa de centro.',
    keyCompetencies: 'Principalmente CCL, CD, CCEC y CPSAA. Se trabaja la comunicación oral, la competencia digital y la creatividad.',
    specificCompetencies: 'Comunicación oral, lenguaje radiofónico, producción sonora y trabajo cooperativo.',
    evaluationCriteria: 'Locución, redacción de guiones, géneros radiofónicos, edición de audio, trabajo en equipo.',
    basicKnowledge: 'Lenguaje radiofónico, géneros (narración, entrevista, tertulia, informativo), guion, edición con REAPER, paisaje sonoro, Creative Commons.',
    methodology: 'Aprendizaje basado en proyectos, taller de producción, trabajo cooperativo con roles rotativos.',
    diversity: 'Roles adaptados a las capacidades de cada alumno, textos de distinta complejidad.',
    evaluation: 'Evaluación continua basada en producciones sonoras progresivas. Rúbricas específicas para cada género.',
    evaluationInstruments: 'Grabaciones, podcasts, rúbricas, coevaluación, autoevaluación, memoria del proyecto.',
    recovery: 'Posibilidad de regrabar y mejorar producciones. Actividades alternativas de guion.',
    complementaryActivities: 'Visita a una emisora de radio, participación en concurso de podcast educativo.',
    timing: 'Tres evaluaciones con producciones de complejidad creciente.'
  },
  {
    id: 'prog-cc', subjectId: 'sub-corto', academicYearId: 'ay-2026', teacherId: 'user-teacher1',
    introduction: 'El Taller de Cortometraje desarrolla competencias narrativas, técnicas y creativas mediante la producción audiovisual completa.',
    context: 'Materia optativa para 2º de Bachillerato. Los alumnos ya tienen experiencia previa en comunicación y producción del taller de podcast.',
    legalFramework: 'LOMLOE, currículo de Bachillerato de Cantabria, materia optativa de centro.',
    keyCompetencies: 'CCL, CCEC, CD, CE, CPSAA, CC. Integra narrativa, técnica audiovisual, trabajo en equipo y emprendimiento.',
    specificCompetencies: 'Narrativa audiovisual, lenguaje cinematográfico, producción audiovisual y trabajo en equipo.',
    evaluationCriteria: 'Desarrollo de ideas, guion, storyboard, rodaje, montaje, trabajo en equipo.',
    basicKnowledge: 'Narrativa cinematográfica, guion literario y técnico, storyboard, tipos de plano, iluminación, sonido, montaje con DaVinci Resolve, Creative Commons.',
    methodology: 'Producción audiovisual real con roles profesionales rotativos. Aprendizaje basado en proyectos.',
    diversity: 'Equipos heterogéneos, roles adaptados, seguimiento individualizado.',
    evaluation: 'Evaluación continua de cada fase de la producción. Rúbricas técnicas y narrativas.',
    evaluationInstruments: 'Dossier, storyboard, material rodado, cortometraje final, memoria, defensa oral.',
    recovery: 'Posibilidad de rehacer fases del proyecto. Trabajo adicional para completar competencias.',
    complementaryActivities: 'Festival de cortometrajes del centro, visita a productora, participación en festivales juveniles.',
    timing: 'Tres evaluaciones: preproducción, producción y postproducción/proyecto final.'
  }
];

// All specific competencies combined
export const allSpecificCompetencies: SpecificCompetency[] = [
  ...specificCompetenciesDT,
  ...specificCompetenciesPodcast,
  ...specificCompetenciesCorto
];

// All evaluation criteria combined
export const allEvaluationCriteria: EvaluationCriterion[] = [
  ...evaluationCriteriaDT,
  ...evaluationCriteriaPodcast,
  ...evaluationCriteriaCorto
];

// All learning situations combined
export const allLearningSituations: LearningSituation[] = [
  ...learningSituationsDT,
  ...learningSituationsPodcast,
  ...learningSituationsCorto
];

// All activities combined
export const allActivities: Activity[] = [
  ...activitiesDT,
  ...activitiesPodcast,
  ...activitiesCorto
];

// Basic Knowledge items
export const basicKnowledgeItems: BasicKnowledge[] = [
  { id: 'bk-dt-1', code: 'BG1', description: 'Trazados geométricos fundamentales: rectas, ángulos, triángulos', subjectId: 'sub-dt1', criterionIds: ['ec-dt-1-1'] },
  { id: 'bk-dt-2', code: 'BG2', description: 'Polígonos: construcción y propiedades', subjectId: 'sub-dt1', criterionIds: ['ec-dt-1-2'] },
  { id: 'bk-dt-3', code: 'BG3', description: 'Tangencias: fundamentos y aplicaciones', subjectId: 'sub-dt1', criterionIds: ['ec-dt-1-3'] },
  { id: 'bk-dt-4', code: 'BG4', description: 'Herramientas CAD: LibreCAD/QCAD', subjectId: 'sub-dt1', criterionIds: ['ec-dt-5-1'] },
  { id: 'bk-dt-5', code: 'BG5', description: 'Sistema diédrico: fundamentos', subjectId: 'sub-dt1', criterionIds: ['ec-dt-3-1'] },
  { id: 'bk-dt-6', code: 'BG6', description: 'Perspectiva axonométrica', subjectId: 'sub-dt1', criterionIds: ['ec-dt-3-2'] },
  { id: 'bk-dt-7', code: 'BG7', description: 'Normalización y acotación', subjectId: 'sub-dt1', criterionIds: ['ec-dt-4-1'] },
  { id: 'bk-pp-1', code: 'BP1', description: 'Lenguaje radiofónico y locución', subjectId: 'sub-podcast', criterionIds: ['ec-pp-1-1', 'ec-pp-1-2'] },
  { id: 'bk-pp-2', code: 'BP2', description: 'Géneros radiofónicos y guion', subjectId: 'sub-podcast', criterionIds: ['ec-pp-2-1', 'ec-pp-2-2'] },
  { id: 'bk-pp-3', code: 'BP3', description: 'Grabación de campo y entrevista', subjectId: 'sub-podcast', criterionIds: ['ec-pp-2-2'] },
  { id: 'bk-pp-4', code: 'BP4', description: 'Edición de audio con REAPER', subjectId: 'sub-podcast', criterionIds: ['ec-pp-3-1'] },
  { id: 'bk-pp-5', code: 'BP5', description: 'Paisaje sonoro y diseño sonoro', subjectId: 'sub-podcast', criterionIds: ['ec-pp-3-2'] },
  { id: 'bk-pp-6', code: 'BP6', description: 'Publicación digital y Creative Commons', subjectId: 'sub-podcast', criterionIds: ['ec-pp-4-1'] },
  { id: 'bk-cc-1', code: 'BC1', description: 'Narrativa audiovisual: idea, sinopsis, argumento', subjectId: 'sub-corto', criterionIds: ['ec-cc-1-1'] },
  { id: 'bk-cc-2', code: 'BC2', description: 'Guión literario y técnico', subjectId: 'sub-corto', criterionIds: ['ec-cc-1-2'] },
  { id: 'bk-cc-3', code: 'BC3', description: 'Storyboard y planificación visual', subjectId: 'sub-corto', criterionIds: ['ec-cc-2-2'] },
  { id: 'bk-cc-4', code: 'BC4', description: 'Tipos de plano y movimientos de cámara', subjectId: 'sub-corto', criterionIds: ['ec-cc-2-1'] },
  { id: 'bk-cc-5', code: 'BC5', description: 'Iluminación y sonido en rodaje', subjectId: 'sub-corto', criterionIds: ['ec-cc-3-1'] },
  { id: 'bk-cc-6', code: 'BC6', description: 'Montaje y edición con DaVinci Resolve', subjectId: 'sub-corto', criterionIds: ['ec-cc-3-2'] },
  { id: 'bk-cc-7', code: 'BC7', description: 'Postproducción, créditos y distribución', subjectId: 'sub-corto', criterionIds: ['ec-cc-4-1'] }
];
