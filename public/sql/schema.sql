-- ============================================================
-- BASE DE DATOS — GESTIÓN DOCENTE LOMLOE
-- IES Lope de Vega — Santa María de Cayón
-- Schema para Supabase (PostgreSQL)
-- ============================================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLAS PRINCIPALES
-- ============================================================

-- Centros educativos
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cursos académicos
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- "2026/2027"
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departamentos
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios (autenticación gestionada por Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materias
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  modality TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  region TEXT NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grupos
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alumnos
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  observations TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asignaciones profesor-materia-grupo
CREATE TABLE teacher_subject_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id, group_id)
);

-- ============================================================
-- PROGRAMACIÓN DIDÁCTICA
-- ============================================================

CREATE TABLE programmes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  introduction TEXT DEFAULT '',
  context TEXT DEFAULT '',
  legal_framework TEXT DEFAULT '',
  key_competencies TEXT DEFAULT '',
  specific_competencies TEXT DEFAULT '',
  evaluation_criteria TEXT DEFAULT '',
  basic_knowledge TEXT DEFAULT '',
  methodology TEXT DEFAULT '',
  diversity TEXT DEFAULT '',
  evaluation TEXT DEFAULT '',
  evaluation_instruments TEXT DEFAULT '',
  recovery TEXT DEFAULT '',
  complementary_activities TEXT DEFAULT '',
  timing TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ESTRUCTURA CURRICULAR LOMLOE
-- ============================================================

-- Competencias clave
CREATE TABLE key_competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE, -- CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competencias específicas
CREATE TABLE specific_competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relación competencia específica <-> competencia clave
CREATE TABLE specific_competency_key_competencies (
  specific_competency_id UUID REFERENCES specific_competencies(id) ON DELETE CASCADE,
  key_competency_id UUID REFERENCES key_competencies(id) ON DELETE CASCADE,
  PRIMARY KEY (specific_competency_id, key_competency_id)
);

-- Criterios de evaluación
CREATE TABLE evaluation_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  specific_competency_id UUID REFERENCES specific_competencies(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saberes básicos
CREATE TABLE basic_knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relación saber básico <-> criterio
CREATE TABLE basic_knowledge_criteria (
  basic_knowledge_id UUID REFERENCES basic_knowledge(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES evaluation_criteria(id) ON DELETE CASCADE,
  PRIMARY KEY (basic_knowledge_id, criterion_id)
);

-- ============================================================
-- SITUACIONES DE APRENDIZAJE
-- ============================================================

CREATE TABLE learning_situations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  programme_id UUID REFERENCES programmes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  evaluation_period TEXT NOT NULL CHECK (evaluation_period IN ('1', '2', '3', 'final')),
  timing TEXT DEFAULT '',
  sessions INTEGER DEFAULT 1,
  context TEXT DEFAULT '',
  justification TEXT DEFAULT '',
  final_product TEXT DEFAULT '',
  objectives TEXT DEFAULT '',
  methodology TEXT DEFAULT '',
  resources TEXT DEFAULT '',
  evaluation_instruments TEXT DEFAULT '',
  diversity TEXT DEFAULT '',
  reinforcement_measures TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relaciones de SDA con competencias y criterios
CREATE TABLE learning_situation_key_competencies (
  learning_situation_id UUID REFERENCES learning_situations(id) ON DELETE CASCADE,
  key_competency_id UUID REFERENCES key_competencies(id) ON DELETE CASCADE,
  PRIMARY KEY (learning_situation_id, key_competency_id)
);

CREATE TABLE learning_situation_specific_competencies (
  learning_situation_id UUID REFERENCES learning_situations(id) ON DELETE CASCADE,
  specific_competency_id UUID REFERENCES specific_competencies(id) ON DELETE CASCADE,
  PRIMARY KEY (learning_situation_id, specific_competency_id)
);

CREATE TABLE learning_situation_criteria (
  learning_situation_id UUID REFERENCES learning_situations(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES evaluation_criteria(id) ON DELETE CASCADE,
  PRIMARY KEY (learning_situation_id, criterion_id)
);

CREATE TABLE learning_situation_basic_knowledge (
  learning_situation_id UUID REFERENCES learning_situations(id) ON DELETE CASCADE,
  basic_knowledge_id UUID REFERENCES basic_knowledge(id) ON DELETE CASCADE,
  PRIMARY KEY (learning_situation_id, basic_knowledge_id)
);

-- ============================================================
-- ACTIVIDADES
-- ============================================================

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  date DATE,
  sessions INTEGER DEFAULT 1,
  type TEXT NOT NULL CHECK (type IN ('theoretical', 'practical', 'individual', 'cooperative', 'digital', 'final_product', 'recovery')),
  learning_situation_id UUID REFERENCES learning_situations(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  evaluation_period TEXT NOT NULL CHECK (evaluation_period IN ('1', '2', '3', 'final')),
  evaluation_instrument TEXT DEFAULT '',
  weight NUMERIC(5,2) DEFAULT 10,
  max_score NUMERIC(5,2) DEFAULT 10,
  observations TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relaciones actividad <-> criterio
CREATE TABLE activity_criteria (
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES evaluation_criteria(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, criterion_id)
);

-- Relaciones actividad <-> saber básico
CREATE TABLE activity_basic_knowledge (
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  basic_knowledge_id UUID REFERENCES basic_knowledge(id) ON DELETE CASCADE,
  PRIMARY KEY (activity_id, basic_knowledge_id)
);

-- ============================================================
-- CALIFICACIONES Y EVALUACIÓN
-- ============================================================

-- Calificaciones por actividad
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  score NUMERIC(4,2),
  observation TEXT DEFAULT '',
  not_completed BOOLEAN DEFAULT FALSE,
  not_evaluated BOOLEAN DEFAULT FALSE,
  recovery BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, activity_id)
);

-- Evaluación por criterios
CREATE TABLE criterion_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  criterion_id UUID REFERENCES evaluation_criteria(id) ON DELETE CASCADE,
  level TEXT CHECK (level IN ('not_started', 'in_process', 'basic', 'adequate', 'advanced')),
  score NUMERIC(4,2),
  evaluation_period TEXT NOT NULL CHECK (evaluation_period IN ('1', '2', '3', 'final')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, criterion_id, evaluation_period)
);

-- Evaluación de competencias específicas
CREATE TABLE competency_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  specific_competency_id UUID REFERENCES specific_competencies(id) ON DELETE CASCADE,
  acquisition_level NUMERIC(5,2) CHECK (acquisition_level >= 0 AND acquisition_level <= 100),
  evaluation_period TEXT NOT NULL CHECK (evaluation_period IN ('1', '2', '3', 'final')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, specific_competency_id, evaluation_period)
);

-- Configuración de evaluación
CREATE TABLE evaluation_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  activity_weight NUMERIC(5,2) DEFAULT 60,
  criterion_weight NUMERIC(5,2) DEFAULT 20,
  sda_weight NUMERIC(5,2) DEFAULT 10,
  recovery_weight NUMERIC(5,2) DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Informes
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  evaluation_period TEXT NOT NULL CHECK (evaluation_period IN ('1', '2', '3', 'final')),
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  final_score NUMERIC(4,2),
  observations TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_students_group ON students(group_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_activity ON grades(activity_id);
CREATE INDEX idx_activities_subject ON activities(subject_id);
CREATE INDEX idx_activities_group ON activities(group_id);
CREATE INDEX idx_activities_period ON activities(evaluation_period);
CREATE INDEX idx_criteria_subject ON evaluation_criteria(subject_id);
CREATE INDEX idx_specific_comp_subject ON specific_competencies(subject_id);
CREATE INDEX idx_learning_sit_subject ON learning_situations(subject_id);
CREATE INDEX idx_teacher_sg_teacher ON teacher_subject_groups(teacher_id);
CREATE INDEX idx_teacher_sg_subject ON teacher_subject_groups(subject_id);
CREATE INDEX idx_teacher_sg_group ON teacher_subject_groups(group_id);
CREATE INDEX idx_criterion_assessments_student ON criterion_assessments(student_id);
CREATE INDEX idx_competency_assessments_student ON competency_assessments(student_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subject_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE specific_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE basic_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE criterion_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE competency_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para profesores: solo ven sus propios datos
CREATE POLICY "Teachers can view their assignments" ON teacher_subject_groups
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can view their subjects" ON subjects
  FOR SELECT USING (
    id IN (SELECT subject_id FROM teacher_subject_groups WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Teachers can view their groups" ON groups
  FOR SELECT USING (
    id IN (SELECT group_id FROM teacher_subject_groups WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Teachers can view students in their groups" ON students
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM teacher_subject_groups WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Teachers can manage grades for their students" ON grades
  FOR ALL USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN teacher_subject_groups tsg ON s.group_id = tsg.group_id
      WHERE tsg.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view activities for their subjects" ON activities
  FOR SELECT USING (
    subject_id IN (SELECT subject_id FROM teacher_subject_groups WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Teachers can view their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Políticas para administradores: acceso completo
CREATE POLICY "Admins have full access to all tables" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================
