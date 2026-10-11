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

// Taller de Podcast - Competencias Específicas (Actualizado según modelo de calidad)
export const specificCompetenciesPodcast: SpecificCompetency[] = [
  { 
    id: 'sc-pp-1', 
    code: 'CE1', 
    name: 'Comunicarse oralmente con eficacia', 
    description: 'Comunicarse oralmente con claridad, corrección y eficacia en diferentes contextos y situaciones de comunicación, utilizando los recursos propios de la locución profesional y adaptando el mensaje al formato podcast.', 
    subjectId: 'sub-podcast', 
    keyCompetencyIds: ['kc-ccl', 'kc-cpsaa', 'kc-ccec'],
    profileDescriptors: ['CCL1', 'CCL2', 'CCL3', 'CPSAA1', 'CPSAA3', 'CEC1']
  },
  { 
    id: 'sc-pp-2', 
    code: 'CE2', 
    name: 'Dominar el lenguaje radiofónico', 
    description: 'Dominar el lenguaje radiofónico y sus géneros (informativo, entretenimiento, divulgativo, narrativo), aplicando las convenciones propias de cada formato y adaptando el contenido al público objetivo.', 
    subjectId: 'sub-podcast', 
    keyCompetencyIds: ['kc-ccl', 'kc-cpsaa', 'kc-cc'],
    profileDescriptors: ['CCL1', 'CCL2', 'CCL4', 'CPSAA2', 'CC1', 'CC2']
  },
  { 
    id: 'sc-pp-3', 
    code: 'CE3', 
    name: 'Producir contenidos sonoros digitales', 
    description: 'Producir contenidos sonoros de calidad mediante el uso de herramientas digitales de grabación y edición de audio (REAPER), aplicando técnicas de diseño sonoro y paisajes sonoros para crear experiencias auditivas inmersivas.', 
    subjectId: 'sub-podcast', 
    keyCompetencyIds: ['kc-cd', 'kc-ccec', 'kc-stem'],
    profileDescriptors: ['CD1', 'CD2', 'CD3', 'CD5', 'CEC1', 'CEC2', 'STEM3']
  },
  { 
    id: 'sc-pp-4', 
    code: 'CE4', 
    name: 'Colaborar en proyectos de creación sonora', 
    description: 'Colaborar eficazmente en proyectos de creación sonora en equipo, asumiendo diferentes roles (guionista, locutor, técnico de sonido, editor), gestionando el tiempo y los recursos, y respetando las contribuciones de todos los miembros del equipo.', 
    subjectId: 'sub-podcast', 
    keyCompetencyIds: ['kc-cpsaa', 'kc-cc', 'kc-ce', 'kc-ccl'],
    profileDescriptors: ['CPSAA1', 'CPSAA2', 'CPSAA4', 'CC1', 'CC2', 'CC3', 'CE1', 'CE2', 'CCL3']
  }
];

export const evaluationCriteriaPodcast: EvaluationCriterion[] = [
  { id: 'ec-pp-1-1', code: '1.1', description: 'Expresarse oralmente con claridad, corrección y fluidez, adaptando el registro al formato podcast y al público objetivo.', specificCompetencyId: 'sc-pp-1', subjectId: 'sub-podcast', weight: 15 },
  { id: 'ec-pp-1-2', code: '1.2', description: 'Utilizar recursos de la locución profesional (entonación, ritmo, pausas, énfasis) para mejorar la comunicación oral y captar la atención del oyente.', specificCompetencyId: 'sc-pp-1', subjectId: 'sub-podcast', weight: 10 },
  { id: 'ec-pp-2-1', code: '2.1', description: 'Redactar guiones literarios y técnicos completos y coherentes, estructurando el contenido según las convenciones del género radiofónico elegido.', specificCompetencyId: 'sc-pp-2', subjectId: 'sub-podcast', weight: 15 },
  { id: 'ec-pp-2-2', code: '2.2', description: 'Diferenciar y aplicar correctamente los diferentes géneros radiofónicos (informativo, entrevista, tertulia, narrativo, divulgativo) adaptando el lenguaje y la estructura a cada formato.', specificCompetencyId: 'sc-pp-2', subjectId: 'sub-podcast', weight: 10 },
  { id: 'ec-pp-3-1', code: '3.1', description: 'Grabar audio de calidad técnica adecuada y editar mediante software especializado (REAPER), aplicando técnicas de corte, mezcla, ecualización y masterización.', specificCompetencyId: 'sc-pp-3', subjectId: 'sub-podcast', weight: 15 },
  { id: 'ec-pp-3-2', code: '3.2', description: 'Diseñar e integrar paisajes sonoros y elementos de audio (música, efectos sonoros, ambientes) para crear experiencias auditivas inmersivas y coherentes con el contenido.', specificCompetencyId: 'sc-pp-3', subjectId: 'sub-podcast', weight: 10 },
  { id: 'ec-pp-4-1', code: '4.1', description: 'Planificar, organizar y ejecutar un proyecto de creación sonora en equipo, asumiendo responsabilidades, gestionando el tiempo y respetando las aportaciones de todos los miembros.', specificCompetencyId: 'sc-pp-4', subjectId: 'sub-podcast', weight: 15 },
  { id: 'ec-pp-4-2', code: '4.2', description: 'Evaluar críticamente el propio trabajo y el de los compañeros, identificando aspectos mejorables y proponiendo soluciones creativas.', specificCompetencyId: 'sc-pp-4', subjectId: 'sub-podcast', weight: 10 }
];

// Taller de Cortometraje - Competencias Específicas (Actualizado según modelo de calidad)
export const specificCompetenciesCorto: SpecificCompetency[] = [
  { 
    id: 'sc-cc-1', 
    code: 'CE1', 
    name: 'Crear narrativas audiovisuales coherentes', 
    description: 'Crear narrativas audiovisuales coherentes y originales, desarrollando ideas desde la concepción inicial hasta la estructura final, aplicando técnicas de guion literario y técnico, y construyendo personajes y tramas con profundidad dramática.', 
    subjectId: 'sub-corto', 
    keyCompetencyIds: ['kc-ccl', 'kc-ccec', 'kc-ce'],
    profileDescriptors: ['CCL1', 'CCL2', 'CCL3', 'CCL4', 'CEC1', 'CEC2', 'CE1', 'CE2']
  },
  { 
    id: 'sc-cc-2', 
    code: 'CE2', 
    name: 'Dominar el lenguaje cinematográfico', 
    description: 'Dominar el lenguaje cinematográfico y sus recursos expresivos (planos, ángulos, movimientos de cámara, iluminación, composición), aplicándolos de forma creativa y significativa para comunicar ideas, emociones y significados.', 
    subjectId: 'sub-corto', 
    keyCompetencyIds: ['kc-ccec', 'kc-stem', 'kc-cd'],
    profileDescriptors: ['CEC1', 'CEC2', 'CEC3', 'STEM3', 'CD2', 'CD3']
  },
  { 
    id: 'sc-cc-3', 
    code: 'CE3', 
    name: 'Producir piezas audiovisuales completas', 
    description: 'Producir piezas audiovisuales completas (cortometrajes, videoclips, documentales) gestionando todas las fases del proceso (preproducción, producción, postproducción), utilizando equipos y software especializado (DaVinci Resolve, Shotcut) con rigor técnico y creativo.', 
    subjectId: 'sub-corto', 
    keyCompetencyIds: ['kc-cd', 'kc-ce', 'kc-stem', 'kc-cpsaa'],
    profileDescriptors: ['CD1', 'CD2', 'CD3', 'CD4', 'CD5', 'CE1', 'CE2', 'CE3', 'STEM3', 'CPSAA1']
  },
  { 
    id: 'sc-cc-4', 
    code: 'CE4', 
    name: 'Colaborar en producciones audiovisuales', 
    description: 'Colaborar eficazmente en equipos de producción audiovisual, asumiendo diferentes roles (director, guionista, cámara, sonido, montaje, producción), coordinando tareas, gestionando conflictos y respetando las contribuciones de todos los miembros del equipo.', 
    subjectId: 'sub-corto', 
    keyCompetencyIds: ['kc-cpsaa', 'kc-cc', 'kc-ccl', 'kc-ce'],
    profileDescriptors: ['CPSAA1', 'CPSAA2', 'CPSAA3', 'CPSAA4', 'CC1', 'CC2', 'CC3', 'CCL3', 'CE1', 'CE2']
  }
];

export const evaluationCriteriaCorto: EvaluationCriterion[] = [
  { id: 'ec-cc-1-1', code: '1.1', description: 'Desarrollar ideas narrativas originales y coherentes, estructurándolas según las convenciones del guion cinematográfico (planteamiento, nudo, desenlace).', specificCompetencyId: 'sc-cc-1', subjectId: 'sub-corto', weight: 10 },
  { id: 'ec-cc-1-2', code: '1.2', description: 'Escribir guiones literarios y técnicos completos y profesionales, incluyendo diálogos, descripciones, acotaciones y especificaciones técnicas.', specificCompetencyId: 'sc-cc-1', subjectId: 'sub-corto', weight: 15 },
  { id: 'ec-cc-2-1', code: '2.1', description: 'Aplicar correctamente tipos de plano, ángulos y movimientos de cámara, utilizando el lenguaje cinematográfico de forma expresiva y significativa.', specificCompetencyId: 'sc-cc-2', subjectId: 'sub-corto', weight: 15 },
  { id: 'ec-cc-2-2', code: '2.2', description: 'Diseñar storyboards efectivos y detallados que planifiquen visualmente cada secuencia del cortometraje.', specificCompetencyId: 'sc-cc-2', subjectId: 'sub-corto', weight: 10 },
  { id: 'ec-cc-3-1', code: '3.1', description: 'Rodar secuencias con calidad técnica adecuada (enfocado, estable, bien iluminado, sonido limpio), aplicando técnicas de dirección de fotografía y sonido.', specificCompetencyId: 'sc-cc-3', subjectId: 'sub-corto', weight: 15 },
  { id: 'ec-cc-3-2', code: '3.2', description: 'Editar y montar el material grabado mediante software especializado (DaVinci Resolve, Shotcut), aplicando técnicas de montaje narrativo, ritmo, transiciones y corrección de color.', specificCompetencyId: 'sc-cc-3', subjectId: 'sub-corto', weight: 15 },
  { id: 'ec-cc-4-1', code: '4.1', description: 'Coordinar un equipo de producción audiovisual, planificando el rodaje, gestionando recursos y tiempos, y resolviendo problemas técnicos y creativos.', specificCompetencyId: 'sc-cc-4', subjectId: 'sub-corto', weight: 10 },
  { id: 'ec-cc-4-2', code: '4.2', description: 'Evaluar críticamente el propio trabajo y el del equipo, identificando aspectos mejorables y proponiendo soluciones creativas y técnicas.', specificCompetencyId: 'sc-cc-4', subjectId: 'sub-corto', weight: 10 }
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

// Learning Situations - Podcast (Actualizado según modelo de calidad)
export const learningSituationsPodcast: LearningSituation[] = [
  {
    id: 'sda-pp-1', 
    title: 'Narrar para el oído: el arte del podcast narrativo', 
    programmeId: 'prog-pp', 
    subjectId: 'sub-podcast',
    evaluationPeriod: '1', 
    timing: 'Septiembre - Octubre', 
    sessions: 12,
    context: 'Introducción al lenguaje radiofónico y la narración sonora, explorando las técnicas de locución profesional y la construcción de relatos auditivos',
    justification: 'La narración oral es la base fundamental de toda producción podcast. El alumnado desarrolla habilidades de comunicación oral, dicción, ritmo y expresividad, competencias esenciales para cualquier formato radiofónico',
    finalProduct: 'Narración sonora profesional de 3 minutos sobre un tema de libre elección (cuento, relato personal, crónica periodística)',
    objectives: 'Dominar los fundamentos de la narración oral para audio: dicción, ritmo, entonación, pausas, énfasis y conexión emocional con el oyente',
    methodology: 'Taller práctico con enfoque DUA: análisis de narraciones profesionales (motivación), ejercicios progresivos de locución (desarrollo), grabación y edición de narración final (síntesis)',
    resources: 'Micrófonos profesionales, software REAPER, guiones modelo, ejemplos de narraciones profesionales, cabina de grabación',
    evaluationInstruments: 'Rúbrica de locución (dicción, ritmo, expresividad, calidad técnica), grabación final, autoevaluación reflexiva',
    diversity: 'Textos de distinta dificultad y extensión, opción de narración individual o en dúo, flexibilidad en la elección temática, guiones con indicaciones detalladas para alumnado con dificultades',
    reinforcementMeasures: 'Ejercicios de vocalización y respiración, tutoriales en vídeo de técnicas de locución, sesiones de práctica guiada, retroalimentación individualizada',
    keyCompetencyIds: ['kc-ccl', 'kc-cpsaa', 'kc-ccec'],
    specificCompetencyIds: ['sc-pp-1'],
    criterionIds: ['ec-pp-1-1', 'ec-pp-1-2'],
    basicKnowledgeIds: ['bk-pp-1'],
    phases: ['Fase 1 (motivación): Análisis de narraciones profesionales de podcast y radio, identificación de técnicas de locución', 'Fase 2 (desarrollo): Ejercicios progresivos de dicción, ritmo, entonación y expresividad oral', 'Fase 3 (síntesis): Grabación y edición de narración sonora de 3 minutos con paisaje sonoro'],
    challenge: 'Crear una narración sonora profesional de 3 minutos que capture la atención del oyente desde el primer segundo',
    curricularJustification: '1º Bachillerato — Taller de Podcast; Criterios: 1.1, 1.2; Saberes: Lenguaje radiofónico, técnicas de locución, narración oral'
  },
  {
    id: 'sda-pp-2', 
    title: 'Voces del IES: boletín informativo del centro', 
    programmeId: 'prog-pp', 
    subjectId: 'sub-podcast',
    evaluationPeriod: '1', 
    timing: 'Noviembre - Diciembre', 
    sessions: 10,
    context: 'Creación de un boletín informativo podcast que recoja la actualidad del centro educativo, dando voz al alumnado, profesorado y comunidad educativa',
    justification: 'El género informativo es uno de los pilares del periodismo radiofónico. El alumnado aprende a investigar, redactar y producir contenido informativo de interés comunitario, desarrollando competencias de comunicación, trabajo en equipo y ciudadanía',
    finalProduct: 'Boletín informativo podcast de 10 minutos con 3-4 noticias del centro, entrevistas breves y sección de opinión',
    objectives: 'Producir un contenido informativo completo aplicando las convenciones del género informativo: estructura, lenguaje objetivo, fuentes contrastadas y rigor periodístico',
    methodology: 'Trabajo cooperativo con enfoque DUA y simulación de redacción periodística: asignación de roles (director/a, redactores/as, locutores/as, técnicos/as), investigación de noticias (Fase 1), redacción de guiones (Fase 2), grabación y edición (Fase 3)',
    resources: 'Micrófonos, grabadora de campo, software REAPER, plantillas de guion informativo, ejemplos de boletines profesionales',
    evaluationInstruments: 'Rúbrica del podcast informativo (estructura, lenguaje periodístico, calidad técnica, trabajo en equipo), guiones, autoevaluación y coevaluación grupal',
    diversity: 'Roles adaptados a capacidades e intereses (redacción, locución, edición, producción), temas de noticia a elegir según afinidades, tutoría entre iguales',
    reinforcementMeasures: 'Plantillas de guion con estructura clara, ejemplos de noticias modelo, sesiones de tutoría grupal, retroalimentación continua',
    keyCompetencyIds: ['kc-ccl', 'kc-cpsaa', 'kc-cc', 'kc-cd'],
    specificCompetencyIds: ['sc-pp-2', 'sc-pp-4'],
    criterionIds: ['ec-pp-2-1', 'ec-pp-2-2', 'ec-pp-4-1', 'ec-pp-4-2'],
    basicKnowledgeIds: ['bk-pp-2', 'bk-pp-3'],
    phases: ['Fase 1: Investigación de noticias del centro, entrevistas a protagonistas y selección de temas', 'Fase 2: Redacción de guiones informativos con estructura periodística (titular, entrada, desarrollo, cierre)', 'Fase 3: Grabación en estudio, edición y mezcla del boletín completo'],
    challenge: 'Producir un boletín informativo profesional de 10 minutos que informe a la comunidad educativa con rigor periodístico',
    curricularJustification: '1º Bachillerato — Taller de Podcast; Criterios: 2.1, 2.2, 4.1, 4.2; Saberes: Género informativo, redacción periodística, trabajo cooperativo'
  },
  {
    id: 'sda-pp-3', 
    title: 'La voz de la juventud: tertulia y debate radiofónico', 
    programmeId: 'prog-pp', 
    subjectId: 'sub-podcast',
    evaluationPeriod: '2', 
    timing: 'Enero - Febrero', 
    sessions: 12,
    context: 'Producción de un programa de tertulia radiofónica sobre temas de actualidad social, cultural y educativa, donde el alumnado ejerce su derecho a la palabra y desarrolla el pensamiento crítico',
    justification: 'La tertulia y el debate son géneros radiofónicos que fomentan la argumentación, el respeto a las opiniones ajenas y el pensamiento crítico. El alumnado desarrolla competencias comunicativas, ciudadanas y personales esenciales para la participación democrática',
    finalProduct: 'Programa de tertulia de 15 minutos con 3-4 tertulianos/as, presentador/a, escaleta estructurada y sección de conclusiones',
    objectives: 'Dominar el género de tertulia y debate argumentativo: turnos de palabra, argumentación sólida, respeto a opiniones divergentes, síntesis y conclusiones',
    methodology: 'Simulación de programa radiofónico con enfoque DUA y roles rotativos: preparación del tema y documentación (Fase 1), ensayo de tertulia con escaleta (Fase 2), grabación y edición del programa final (Fase 3)',
    resources: 'Estudio de grabación, micrófonos, software REAPER, escaletas modelo, ejemplos de tertulias profesionales',
    evaluationInstruments: 'Rúbrica de tertulia (argumentación, respeto, participación equilibrada, calidad técnica), escaleta, autoevaluación y coevaluación',
    diversity: 'Temas cercanos a los intereses del alumnado (educación, cultura, medio ambiente, tecnología), roles adaptados a perfiles (presentador/a, tertuliano/a, moderador/a), guion estructurado con preguntas guía',
    reinforcementMeasures: 'Escaleta con preguntas guía y tiempos asignados, ensayos previos con retroalimentación, tutoría entre iguales, modelos de tertulia para análisis',
    keyCompetencyIds: ['kc-ccl', 'kc-cpsaa', 'kc-cc', 'kc-ccec'],
    specificCompetencyIds: ['sc-pp-1', 'sc-pp-2', 'sc-pp-4'],
    criterionIds: ['ec-pp-1-1', 'ec-pp-1-2', 'ec-pp-2-2', 'ec-pp-4-1'],
    basicKnowledgeIds: ['bk-pp-2'],
    phases: ['Fase 1: Documentación sobre el tema, preparación de argumentos y elaboración de escaleta', 'Fase 2: Ensayo de tertulia con roles, práctica de turnos de palabra y argumentación', 'Fase 3: Grabación y edición del programa final con introducción, desarrollo y conclusiones'],
    challenge: 'Producir una tertulia radiofónica de 15 minutos donde el alumnado debata con rigor, respeto y espíritu crítico sobre un tema de actualidad',
    curricularJustification: '1º Bachillerato — Taller de Podcast; Criterios: 1.1, 1.2, 2.2, 4.1; Saberes: Género de tertulia, argumentación oral, debate respetuoso'
  },
  {
    id: 'sda-pp-4', 
    title: 'Ciencia en tus oídos: podcast de divulgación científica', 
    programmeId: 'prog-pp', 
    subjectId: 'sub-podcast',
    evaluationPeriod: '2', 
    timing: 'Marzo - Abril', 
    sessions: 14,
    context: 'Creación de un podcast divulgativo sobre un tema científico, tecnológico o cultural, combinando rigor informativo con creatividad sonora para hacer accesible el conocimiento especializado',
    justification: 'La divulgación científica es una competencia clave en la sociedad del conocimiento. El alumnado aprende a investigar, sintetizar y comunicar contenidos complejos de forma accesible y atractiva, desarrollando competencias digitales, comunicativas y STEM',
    finalProduct: 'Episodio divulgativo de 12-15 minutos con entrevista a un/a experto/a, explicaciones claras, ejemplos ilustrativos y paisaje sonoro inmersivo',
    objectives: 'Producir contenido divulgativo con calidad sonora profesional: investigación rigurosa, guion estructurado, entrevista experta, edición creativa y diseño de paisaje sonoro',
    methodology: 'Investigación + producción + edición con enfoque DUA: selección del tema y documentación científica (Fase 1), redacción del guion y preparación de entrevista (Fase 2), grabación de entrevista y locución (Fase 3), edición con paisaje sonoro (Fase 4)',
    resources: 'Software REAPER, fuentes de investigación científica (artículos, libros, webs especializadas), micrófonos, grabadora de campo para entrevista, librería de efectos sonoros',
    evaluationInstruments: 'Rúbrica de contenido divulgativo (rigor científico, claridad expositiva, estructura) y técnica (calidad de audio, paisaje sonoro, edición), podcast final, memoria de investigación',
    diversity: 'Temas a elegir según intereses (biología, física, tecnología, historia, arte, medio ambiente), flexibilidad en el formato (entrevista, narración, debate), plantilla de estructura divulgativa',
    reinforcementMeasures: 'Plantilla de estructura divulgativa con secciones claras, guía de fuentes fiables, tutoriales de edición avanzada, sesiones de tutoría individualizada',
    keyCompetencyIds: ['kc-ccl', 'kc-stem', 'kc-cd', 'kc-cpsaa', 'kc-ccec'],
    specificCompetencyIds: ['sc-pp-2', 'sc-pp-3'],
    criterionIds: ['ec-pp-2-1', 'ec-pp-2-2', 'ec-pp-3-1', 'ec-pp-3-2'],
    basicKnowledgeIds: ['bk-pp-4', 'bk-pp-5'],
    phases: ['Fase 1: Selección del tema científico, investigación en fuentes fiables y síntesis de contenidos', 'Fase 2: Redacción del guion divulgativo con estructura clara (introducción, desarrollo, ejemplos, conclusiones) y preparación de entrevista a experto/a', 'Fase 3: Grabación de entrevista y locución explicativa', 'Fase 4: Edición con paisaje sonoro, música, efectos y mezcla final'],
    challenge: 'Crear un episodio divulgativo de 12-15 minutos que explique un tema científico complejo de forma accesible, rigurosa y atractiva para el público general',
    curricularJustification: '1º Bachillerato — Taller de Podcast; Criterios: 2.1, 2.2, 3.1, 3.2; Saberes: Género divulgativo, investigación científica, diseño sonoro, edición avanzada'
  },
  {
    id: 'sda-pp-5', 
    title: 'Mi voz, mi podcast: proyecto final de autoría', 
    programmeId: 'prog-pp', 
    subjectId: 'sub-podcast',
    evaluationPeriod: '3', 
    timing: 'Abril - Mayo', 
    sessions: 18,
    context: 'Proyecto final integrador donde cada alumno/a crea un podcast completo de autoría propia, aplicando todas las competencias desarrolladas a lo largo del curso',
    justification: 'El proyecto final permite al alumnado demostrar la adquisición integral de todas las competencias específicas, desde la comunicación oral hasta la producción técnica, pasando por la planificación y el trabajo autónomo. Es un producto auténtico que puede tener proyección real',
    finalProduct: 'Podcast completo de autoría propia con 3 episodios temáticos (15-20 minutos cada uno), identidad sonora, cabecera, promoción y presentación pública',
    objectives: 'Producir un podcast completo de principio a fin: concepción del proyecto, planificación, guionización, grabación, edición, diseño de identidad sonora y presentación pública',
    methodology: 'Proyecto individual con tutorías y enfoque DUA: concepción del proyecto y plan de trabajo (Fase 1), producción de los 3 episodios (Fase 2), diseño de identidad sonora y promoción (Fase 3), presentación pública y defensa del proyecto (Fase 4)',
    resources: 'Equipo completo de producción (micrófonos, cabina, software REAPER), librería de música y efectos, plataformas de distribución (iVoox, Spotify), materiales de promoción',
    evaluationInstruments: 'Rúbrica del proyecto completo (calidad técnica, contenido, creatividad, identidad sonora, presentación), podcast final, memoria del proyecto, defensa oral, portafolio de proceso',
    diversity: 'Libertad temática total según intereses personales, seguimiento individualizado con tutorías semanales, plan de trabajo personalizado, flexibilidad en plazos y formato',
    reinforcementMeasures: 'Plan de trabajo personalizado con hitos semanales, tutorías individuales, retroalimentación continua, sesiones de refuerzo técnico, modelos de podcast profesionales',
    keyCompetencyIds: ['kc-ccl', 'kc-cd', 'kc-ccec', 'kc-ce', 'kc-cpsaa', 'kc-cc'],
    specificCompetencyIds: ['sc-pp-1', 'sc-pp-2', 'sc-pp-3', 'sc-pp-4'],
    criterionIds: ['ec-pp-1-1', 'ec-pp-1-2', 'ec-pp-2-1', 'ec-pp-2-2', 'ec-pp-3-1', 'ec-pp-3-2', 'ec-pp-4-1', 'ec-pp-4-2'],
    basicKnowledgeIds: ['bk-pp-1', 'bk-pp-2', 'bk-pp-4', 'bk-pp-5', 'bk-pp-6'],
    phases: ['Fase 1: Concepción del proyecto, definición de temática y público objetivo, elaboración del plan de trabajo', 'Fase 2: Producción de los 3 episodios (guion, grabación, edición) con tutorías semanales', 'Fase 3: Diseño de identidad sonora (cabecera, sintonía, elementos característicos) y materiales de promoción', 'Fase 4: Presentación pública del podcast ante la comunidad educativa y defensa oral del proyecto'],
    challenge: 'Crear un podcast completo de autoría propia con 3 episodios temáticos, identidad sonora definida y presentación pública ante la comunidad educativa',
    curricularJustification: '1º Bachillerato — Taller de Podcast; Criterios: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2; Saberes: Todos los bloques integrados; Producto final auténtico con proyección real'
  }
];

// Learning Situations - Cortometraje (Actualizado según modelo de calidad)
export const learningSituationsCorto: LearningSituation[] = [
  {
    id: 'sda-cc-1', 
    title: 'La chispa creativa: de la idea al proyecto cinematográfico', 
    programmeId: 'prog-cc', 
    subjectId: 'sub-corto',
    evaluationPeriod: '1', 
    timing: 'Septiembre - Octubre', 
    sessions: 12,
    context: 'Desarrollo de la creatividad narrativa audiovisual mediante el análisis de cortometrajes de referencia y la generación de ideas originales',
    justification: 'Todo cortometraje comienza con una idea potente. El alumnado aprende a generar, desarrollar y estructurar ideas narrativas, aplicando técnicas de escritura creativa y análisis fílmico para construir relatos con profundidad dramática',
    finalProduct: 'Dossier de proyecto cinematográfico completo con logline, sinopsis, argumento, personajes principales y referencias visuales',
    objectives: 'Desarrollar ideas narrativas originales y estructurarlas según las convenciones del guion cinematográfico: logline, sinopsis, argumento y personajes',
    methodology: 'Taller de escritura creativa y análisis fílmico con enfoque DUA: visionado y análisis de cortometrajes premiados (motivación), ejercicios de generación de ideas (desarrollo), elaboración del dossier de proyecto (síntesis)',
    resources: 'Proyector, cortometrajes de referencia (Oscar, Goya, festivales), cuaderno de guion, bibliografía sobre narrativa cinematográfica, pizarra digital',
    evaluationInstruments: 'Rúbrica del dossier de proyecto (originalidad, estructura narrativa, profundidad de personajes, claridad expositiva), presentación oral del proyecto, portafolio de ideas',
    diversity: 'Géneros cinematográficos a elegir según preferencias (drama, comedia, thriller, ciencia ficción, documental creativo), flexibilidad en la extensión del dossier, trabajo individual o en parejas',
    reinforcementMeasures: 'Análisis guiado de cortos premiados con fichas de análisis, plantillas de estructura narrativa, tutorías individuales para desarrollo de ideas, modelos de dossier',
    keyCompetencyIds: ['kc-ccl', 'kc-ccec', 'kc-ce', 'kc-cpsaa'],
    specificCompetencyIds: ['sc-cc-1'],
    criterionIds: ['ec-cc-1-1'],
    basicKnowledgeIds: ['bk-cc-1'],
    phases: ['Fase 1 (motivación): Visionado y análisis de cortometrajes premiados, identificación de elementos narrativos clave', 'Fase 2 (desarrollo): Ejercicios de generación de ideas (brainstorming, mindmapping, free writing), desarrollo de personajes y tramas', 'Fase 3 (síntesis): Elaboración del dossier de proyecto con logline, sinopsis, argumento y referencias visuales'],
    challenge: 'Generar y desarrollar una idea narrativa original para un cortometraje, estructurándola profesionalmente en un dossier de proyecto',
    curricularJustification: '2º Bachillerato — Taller de Cortometraje; Criterio: 1.1; Saberes: Narrativa audiovisual, escritura creativa, análisis fílmico, estructura del guion'
  },
  {
    id: 'sda-cc-2', 
    title: 'Del papel a la imagen: guion técnico y storyboard', 
    programmeId: 'prog-cc', 
    subjectId: 'sub-corto',
    evaluationPeriod: '1', 
    timing: 'Noviembre - Diciembre', 
    sessions: 14,
    context: 'Traducción del guion literario al lenguaje visual mediante el guion técnico y el storyboard, planificando visualmente cada plano, ángulo y movimiento de cámara',
    justification: 'El storyboard es el puente esencial entre la escritura y el rodaje. El alumnado aprende a pensar visualmente, planificando cada secuencia con precisión técnica y creatividad artística, desarrollando competencias de comunicación visual y planificación',
    finalProduct: 'Guión técnico profesional y storyboard completo del cortometraje con todos los planos detallados, indicaciones de cámara, sonido y montaje',
    objectives: 'Redactar un guion técnico completo y diseñar un storyboard detallado que planifique visualmente cada secuencia del cortometraje',
    methodology: 'Taller de guion y dibujo técnico aplicado con enfoque DUA: análisis de storyboards profesionales (motivación), redacción del guion técnico escena por escena (desarrollo), diseño del storyboard con plantillas (síntesis)',
    resources: 'Plantillas de storyboard profesionales, software de dibujo (opcional), guion literario previo, ejemplos de storyboards de películas reconocidas, regla, rotuladores',
    evaluationInstruments: 'Rúbrica del guion técnico (completitud, precisión técnica, formato profesional) y del storyboard (claridad visual, coherencia narrativa, detalle), presentación oral del proyecto visual',
    diversity: 'Niveles de detalle adaptables en el storyboard (desde esquemático hasta detallado), opción de dibujo a mano o digital, plantillas con diferentes niveles de complejidad, trabajo individual o en parejas',
    reinforcementMeasures: 'Ejemplos de storyboards profesionales comentados, tutoriales de dibujo técnico aplicado al cine, plantillas con guías visuales, sesiones de tutoría para planificación visual',
    keyCompetencyIds: ['kc-ccl', 'kc-ccec', 'kc-cd', 'kc-stem'],
    specificCompetencyIds: ['sc-cc-1', 'sc-cc-2'],
    criterionIds: ['ec-cc-1-2', 'ec-cc-2-1', 'ec-cc-2-2'],
    basicKnowledgeIds: ['bk-cc-2', 'bk-cc-3'],
    phases: ['Fase 1: Análisis de storyboards profesionales de películas reconocidas, identificación de elementos visuales clave', 'Fase 2: Redacción del guion técnico escena por escena con indicaciones de plano, ángulo, movimiento y sonido', 'Fase 3: Diseño del storyboard completo con dibujos de cada plano, flechas de movimiento y notas técnicas'],
    challenge: 'Traducir completamente un guion literario a lenguaje visual mediante un guion técnico profesional y un storyboard detallado',
    curricularJustification: '2º Bachillerato — Taller de Cortometraje; Criterios: 1.2, 2.1, 2.2; Saberes: Guión técnico, storyboard, lenguaje cinematográfico, planificación visual'
  },
  {
    id: 'sda-cc-3', 
    title: 'Luces, cámara, acción: el rodaje profesional', 
    programmeId: 'prog-cc', 
    subjectId: 'sub-corto',
    evaluationPeriod: '2', 
    timing: 'Enero - Febrero', 
    sessions: 16,
    context: 'Práctica intensiva de rodaje aplicando el lenguaje cinematográfico y las técnicas de dirección de fotografía y sonido para capturar las secuencias planificadas en el storyboard',
    justification: 'El rodaje es el momento de la verdad donde la planificación se convierte en realidad. El alumnado aplica todos los conocimientos técnicos y narrativos en situaciones reales de producción, desarrollando competencias técnicas, creativas y de trabajo en equipo',
    finalProduct: 'Material rodado de alta calidad técnica organizado por secuencias según el plan de rodaje, con sonido limpio y iluminación profesional',
    objectives: 'Rodar todas las secuencias del cortometraje con calidad técnica profesional: planos bien encuadrados, iluminación adecuada, sonido limpio y continuidad narrativa',
    methodology: 'Práctica intensiva de rodaje en equipos con enfoque DUA y simulación de rodaje profesional: ensayos previos con ejercicios técnicos (preparación), rodaje por secuencias según plan (producción), revisión del material y toma de adicionales (post-producción inmediata)',
    resources: 'Cámaras de vídeo profesionales o DSLR, trípodes, equipos de iluminación (key, fill, back), micrófonos de solapa y boom, claqueta, monitores de vídeo',
    evaluationInstruments: 'Rúbrica técnica del material rodado (encuadre, iluminación, sonido, continuidad), plan de rodaje ejecutado, observación del trabajo en equipo, autoevaluación por roles',
    diversity: 'Roles rotativos en el equipo (director/a, cámara, sonido, iluminación, script, producción), adaptación de la complejidad técnica según el nivel del alumnado, tutoría entre iguales',
    reinforcementMeasures: 'Prácticas previas con ejercicios técnicos cortos (iluminación de 3 puntos, grabación de sonido), guías técnicas de referencia, sesiones de ensayo antes del rodaje oficial',
    keyCompetencyIds: ['kc-ccec', 'kc-cd', 'kc-cpsaa', 'kc-cc', 'kc-stem'],
    specificCompetencyIds: ['sc-cc-2', 'sc-cc-3', 'sc-cc-4'],
    criterionIds: ['ec-cc-2-1', 'ec-cc-3-1', 'ec-cc-4-1'],
    basicKnowledgeIds: ['bk-cc-4', 'bk-cc-5'],
    phases: ['Fase 1 (preparación): Ensayos técnicos de iluminación, sonido y cámara, revisión final del plan de rodaje', 'Fase 2 (producción): Rodaje por secuencias según el plan, con roles profesionales rotativos', 'Fase 3 (revisión): Visionado del material rodado, identificación de tomas válidas y planificación de adicionales si es necesario'],
    challenge: 'Rodar todas las secuencias del cortometraje con calidad técnica profesional, gestionando el equipo, el tiempo y los recursos como un equipo de producción real',
    curricularJustification: '2º Bachillerato — Taller de Cortometraje; Criterios: 2.1, 3.1, 4.1; Saberes: Dirección de fotografía, sonido directo, dirección de actores, trabajo en equipo de producción'
  },
  {
    id: 'sda-cc-4', 
    title: 'La magia del montaje: edición y postproducción', 
    programmeId: 'prog-cc', 
    subjectId: 'sub-corto',
    evaluationPeriod: '2', 
    timing: 'Marzo - Abril', 
    sessions: 14,
    context: 'Edición y postproducción completa del material rodado: montaje narrativo, corrección de color, diseño sonoro, música y créditos',
    justification: 'El montaje es el alma del cine: es donde se construye el relato final. El alumnado aprende el arte y la técnica de la edición, desarrollando competencias digitales, creativas y narrativas esenciales para la comunicación audiovisual',
    finalProduct: 'Cortometraje completamente editado y masterizado con montaje narrativo, corrección de color, diseño sonoro, música original o licenciada, títulos y créditos profesionales',
    objectives: 'Editar y montar el cortometraje completo aplicando técnicas profesionales de montaje narrativo, corrección de color, diseño sonoro y masterización final',
    methodology: 'Taller de edición profesional con DaVinci Resolve y enfoque DUA: organización del material y visionado de rushes (Fase 1), montaje narrativo escena por escena (Fase 2), corrección de color y diseño sonoro (Fase 3), masterización y exportación final (Fase 4)',
    resources: 'Ordenadores con DaVinci Resolve o Shotcut, material rodado organizado, librerías de música y efectos sonoros, monitores calibrados, altavoces de calidad',
    evaluationInstruments: 'Rúbrica del cortometraje editado (montaje narrativo, ritmo, corrección de color, diseño sonoro, masterización), comparación con el storyboard original, memoria técnica de postproducción',
    diversity: 'Asistencia técnica personalizada según el nivel de dominio del software, tutoriales diferenciados por nivel (básico, intermedio, avanzado), trabajo en parejas para apoyo mutuo',
    reinforcementMeasures: 'Tutoriales en vídeo de DaVinci Resolve organizados por temas, guías paso a paso de cada proceso, sesiones de tutoría individual, ejemplos de montajes profesionales comentados',
    keyCompetencyIds: ['kc-cd', 'kc-ccec', 'kc-stem', 'kc-cpsaa'],
    specificCompetencyIds: ['sc-cc-2', 'sc-cc-3'],
    criterionIds: ['ec-cc-2-1', 'ec-cc-3-2'],
    basicKnowledgeIds: ['bk-cc-6'],
    phases: ['Fase 1: Organización del material, visionado de rushes y selección de mejores tomas', 'Fase 2: Montaje narrativo escena por escena según el storyboard, construcción del ritmo', 'Fase 3: Corrección de color, diseño sonoro, incorporación de música y efectos', 'Fase 4: Masterización final, exportación en formatos profesionales, títulos y créditos'],
    challenge: 'Editar y masterizar un cortometraje completo con calidad técnica profesional, construyendo el relato final mediante el montaje narrativo',
    curricularJustification: '2º Bachillerato — Taller de Cortometraje; Criterios: 2.1, 3.2; Saberes: Montaje narrativo, corrección de color, diseño sonoro, postproducción profesional'
  },
  {
    id: 'sda-cc-5', 
    title: 'Festival de cine del IES: producción y distribución', 
    programmeId: 'prog-cc', 
    subjectId: 'sub-corto',
    evaluationPeriod: '3', 
    timing: 'Abril - Mayo', 
    sessions: 20,
    context: 'Producción completa de un cortometraje desde la concepción hasta la distribución, culminando con un festival de cine del centro donde se proyectan las obras ante la comunidad educativa',
    justification: 'El proyecto final integra todas las competencias específicas en una producción audiovisual real y completa. El festival de cine proporciona un contexto auténtico de exhibición y reconocimiento del trabajo realizado, motivando al alumnado y dando proyección real a sus creaciones',
    finalProduct: 'Cortometraje terminado (5-10 minutos) con calidad profesional, materiales de promoción (tráiler, cartel, nota de prensa) y presentación pública en el Festival de Cine del IES',
    objectives: 'Completar una producción audiovisual integral gestionando todas las fases (preproducción, producción, postproducción, distribución) y presentando el resultado en un festival de cine real',
    methodology: 'Producción profesional con roles especializados y enfoque DUA: planificación final y preparación del rodaje (Fase 1), rodaje del cortometraje (Fase 2), postproducción completa (Fase 3), materiales de promoción y organización del festival (Fase 4), presentación pública y defensa del proyecto (Fase 5)',
    resources: 'Equipo completo de producción audiovisual (cámaras, iluminación, sonido), software de edición (DaVinci Resolve), materiales de promoción (diseño gráfico, vídeo), espacio para el festival, equipo de proyección',
    evaluationInstruments: 'Rúbrica del cortometraje final (narrativa, técnica, creatividad, postproducción), materiales de promoción, memoria de producción, defensa oral del proyecto, evaluación del trabajo en equipo',
    diversity: 'Equipos de 4-6 personas con roles adaptados a competencias e intereses (director/a, guionista, director/a de fotografía, sonido, montaje, producción), mentoría individualizada por equipo, flexibilidad en la temática y género',
    reinforcementMeasures: 'Mentoría individualizada por equipo, checklists de producción por fases, sesiones de seguimiento semanal, retroalimentación continua, apoyo técnico especializado',
    keyCompetencyIds: ['kc-ccl', 'kc-ccec', 'kc-cd', 'kc-ce', 'kc-cpsaa', 'kc-cc', 'kc-stem'],
    specificCompetencyIds: ['sc-cc-1', 'sc-cc-2', 'sc-cc-3', 'sc-cc-4'],
    criterionIds: ['ec-cc-1-1', 'ec-cc-1-2', 'ec-cc-2-1', 'ec-cc-2-2', 'ec-cc-3-1', 'ec-cc-3-2', 'ec-cc-4-1', 'ec-cc-4-2'],
    basicKnowledgeIds: ['bk-cc-1', 'bk-cc-2', 'bk-cc-3', 'bk-cc-4', 'bk-cc-5', 'bk-cc-6', 'bk-cc-7'],
    phases: ['Fase 1: Planificación final del rodaje, casting, localizaciones, plan de producción', 'Fase 2: Rodaje del cortometraje según el storyboard y plan de rodaje', 'Fase 3: Postproducción completa (montaje, color, sonido, música, créditos)', 'Fase 4: Creación de materiales de promoción (tráiler, cartel, nota de prensa) y organización del festival', 'Fase 5: Presentación pública en el Festival de Cine del IES y defensa oral del proyecto'],
    challenge: 'Producir un cortometraje completo de 5-10 minutos con calidad profesional y presentarlo en el Festival de Cine del IES ante la comunidad educativa',
    curricularJustification: '2º Bachillerato — Taller de Cortometraje; Criterios: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2; Saberes: Todos los bloques integrados; Producto final auténtico con exhibición pública real'
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
