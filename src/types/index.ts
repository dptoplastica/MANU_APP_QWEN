// ============================================================
// TIPOS PRINCIPALES - GESTIÓN DOCENTE LOMLOE
// IES Lope de Vega — Santa María de Cayón
// ============================================================

export type UserRole = 'admin' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  location: string;
  region: string;
}

export interface AcademicYear {
  id: string;
  name: string; // "2026/2027"
  active: boolean;
}

export interface Department {
  id: string;
  name: string;
  schoolId: string;
}

export interface Subject {
  id: string;
  name: string;
  course: string; // "1º Bachillerato"
  modality: string;
  departmentId: string;
  region: string;
  academicYearId: string;
}

export interface Group {
  id: string;
  name: string;
  course: string;
  academicYearId: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  groupId: string;
  observations: string;
}

export interface TeacherSubjectGroup {
  id: string;
  teacherId: string;
  subjectId: string;
  groupId: string;
}

export interface Programme {
  id: string;
  subjectId: string;
  academicYearId: string;
  teacherId: string;
  introduction: string;
  context: string;
  legalFramework: string;
  keyCompetencies: string;
  specificCompetencies: string;
  evaluationCriteria: string;
  basicKnowledge: string;
  methodology: string;
  diversity: string;
  evaluation: string;
  evaluationInstruments: string;
  recovery: string;
  complementaryActivities: string;
  timing: string;
}

export interface KeyCompetency {
  id: string;
  code: string; // CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC
  name: string;
  description: string;
}

export interface SpecificCompetency {
  id: string;
  code: string; // CE1, CE2, CE3...
  name: string;
  description: string;
  subjectId: string;
  keyCompetencyIds: string[];
}

export interface EvaluationCriterion {
  id: string;
  code: string; // 1.1, 1.2, 2.1...
  description: string;
  specificCompetencyId: string;
  subjectId: string;
}

export interface BasicKnowledge {
  id: string;
  code: string;
  description: string;
  subjectId: string;
  criterionIds: string[];
}

export type EvaluationPeriod = '1' | '2' | '3' | 'final';

export interface LearningSituation {
  id: string;
  title: string;
  programmeId: string;
  subjectId: string;
  evaluationPeriod: EvaluationPeriod;
  timing: string;
  sessions: number;
  context: string;
  justification: string;
  finalProduct: string;
  objectives: string;
  methodology: string;
  resources: string;
  evaluationInstruments: string;
  diversity: string;
  reinforcementMeasures: string;
  keyCompetencyIds: string[];
  specificCompetencyIds: string[];
  criterionIds: string[];
  basicKnowledgeIds: string[];
}

export type ActivityType = 'theoretical' | 'practical' | 'individual' | 'cooperative' | 'digital' | 'final_product' | 'recovery';

export interface Activity {
  id: string;
  name: string;
  description: string;
  date: string;
  sessions: number;
  type: ActivityType;
  learningSituationId: string;
  subjectId: string;
  groupId: string;
  evaluationPeriod: EvaluationPeriod;
  criterionIds: string[];
  basicKnowledgeIds: string[];
  evaluationInstrument: string;
  weight: number;
  maxScore: number;
  observations: string;
}

export interface Grade {
  id: string;
  studentId: string;
  activityId: string;
  score: number | null;
  observation: string;
  notCompleted: boolean;
  notEvaluated: boolean;
  recovery: boolean;
}

export interface CriterionAssessment {
  id: string;
  studentId: string;
  criterionId: string;
  level: 'not_started' | 'in_process' | 'basic' | 'adequate' | 'advanced';
  score: number | null;
  evaluationPeriod: EvaluationPeriod;
}

export interface CompetencyAssessment {
  id: string;
  studentId: string;
  specificCompetencyId: string;
  acquisitionLevel: number; // 0-100
  evaluationPeriod: EvaluationPeriod;
}

export interface Report {
  id: string;
  studentId: string;
  subjectId: string;
  evaluationPeriod: EvaluationPeriod;
  teacherId: string;
  finalScore: number | null;
  observations: string;
  createdAt: string;
}

export interface EvaluationConfig {
  id: string;
  subjectId: string;
  activityWeight: number;
  criterionWeight: number;
  sdaWeight: number;
  recoveryWeight: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}
