-- ============================================================
-- SETUP COMPLETO — TODO EN UNO
-- IES Lope de Vega — Gestión Docente LOMLOE
-- Este script elimina las tablas existentes y las recrea desde cero
-- ============================================================

-- ============================================================
-- PARTE 1: RESET — ELIMINAR TABLAS EXISTENTES
-- ============================================================

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS evaluation_configs CASCADE;
DROP TABLE IF EXISTS competency_assessments CASCADE;
DROP TABLE IF EXISTS criterion_assessments CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS activity_basic_knowledge CASCADE;
DROP TABLE IF EXISTS activity_criteria CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS learning_situation_basic_knowledge CASCADE;
DROP TABLE IF EXISTS learning_situation_criteria CASCADE;
DROP TABLE IF EXISTS learning_situation_specific_competencies CASCADE;
DROP TABLE IF EXISTS learning_situation_key_competencies CASCADE;
DROP TABLE IF EXISTS learning_situations CASCADE;
DROP TABLE IF EXISTS basic_knowledge_criteria CASCADE;
DROP TABLE IF EXISTS basic_knowledge CASCADE;
DROP TABLE IF EXISTS evaluation_criteria CASCADE;
DROP TABLE IF EXISTS specific_competency_key_competencies CASCADE;
DROP TABLE IF EXISTS specific_competencies CASCADE;
DROP TABLE IF EXISTS key_competencies CASCADE;
DROP TABLE IF EXISTS programmes CASCADE;
DROP TABLE IF EXISTS teacher_subject_groups CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS academic_years CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- ============================================================
-- PARTE 2: CREAR TABLAS (SCHEMA)
-- ============================================================

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  name TEXT NOT NULL UNIQUE,
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

-- Usuarios
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

-- Programación didáctica
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

-- Competencias clave
CREATE TABLE key_competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
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

-- Situaciones de aprendizaje
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

-- Relaciones de SDA
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

-- Actividades
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

-- Calificaciones
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

-- Índices
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

-- Row Level Security
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

-- Políticas RLS
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

CREATE POLICY "Admins have full access to all tables" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- PARTE 3: DATOS INICIALES (SEED)
-- ============================================================

-- Centro educativo
INSERT INTO schools (id, name, location, region) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'IES Lope de Vega', 'Santa María de Cayón', 'Cantabria');

-- Cursos académicos
INSERT INTO academic_years (id, name, active) VALUES
  ('a0000000-0000-0000-0000-000000000010', '2026/2027', TRUE),
  ('a0000000-0000-0000-0000-000000000011', '2027/2028', FALSE);

-- Departamento
INSERT INTO departments (id, name, school_id) VALUES
  ('a0000000-0000-0000-0000-000000000020', 'Dibujo', 'a0000000-0000-0000-0000-000000000001');

-- Competencias clave LOMLOE
INSERT INTO key_competencies (id, code, name, description) VALUES
  ('a0000000-0000-0000-0000-000000000101', 'CCL', 'Competencia en comunicación lingüística', 'Comunicación oral y escrita'),
  ('a0000000-0000-0000-0000-000000000102', 'CP', 'Competencia plurilingüe', 'Uso de varias lenguas'),
  ('a0000000-0000-0000-0000-000000000103', 'STEM', 'Competencia en ciencias, tecnología e ingeniería', 'Pensamiento científico-técnico'),
  ('a0000000-0000-0000-0000-000000000104', 'CD', 'Competencia digital', 'Uso seguro y crítico de tecnologías'),
  ('a0000000-0000-0000-0000-000000000105', 'CPSAA', 'Competencia personal, social y aprender a aprender', 'Autogestión del aprendizaje'),
  ('a0000000-0000-0000-0000-000000000106', 'CC', 'Competencia ciudadana', 'Participación democrática'),
  ('a0000000-0000-0000-0000-000000000107', 'CE', 'Competencia emprendedora', 'Iniciativa y emprendimiento'),
  ('a0000000-0000-0000-0000-000000000108', 'CCEC', 'Competencia en conciencia y expresión culturales', 'Expresión artística y cultural');

-- Materias
INSERT INTO subjects (id, name, course, modality, department_id, region, academic_year_id) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Dibujo Técnico I', '1º Bachillerato', 'Bachillerato', 'a0000000-0000-0000-0000-000000000020', 'Cantabria', 'a0000000-0000-0000-0000-000000000010'),
  ('b0000000-0000-0000-0000-000000000002', 'Taller de Podcast', '1º Bachillerato', 'Optativa', 'a0000000-0000-0000-0000-000000000020', 'Cantabria', 'a0000000-0000-0000-0000-000000000010'),
  ('b0000000-0000-0000-0000-000000000003', 'Taller de Cortometraje', '2º Bachillerato', 'Optativa', 'a0000000-0000-0000-0000-000000000020', 'Cantabria', 'a0000000-0000-0000-0000-000000000010');

-- Grupos
INSERT INTO groups (id, name, course, academic_year_id) VALUES
  ('c0000000-0000-0000-0000-000000000001', '1º Bachillerato A', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  ('c0000000-0000-0000-0000-000000000002', '1º Bachillerato B', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  ('c0000000-0000-0000-0000-000000000003', '2º Bachillerato A', '2º Bachillerato', 'a0000000-0000-0000-0000-000000000010');

-- Alumnos (datos ficticios)
INSERT INTO students (id, first_name, last_name, group_id, observations) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Lucía', 'Fernández', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000002', 'Martín', 'García', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000003', 'Sofía', 'Rodríguez', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000004', 'Hugo', 'Martínez', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000005', 'María', 'López', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000006', 'Pablo', 'González', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000007', 'Carmen', 'Pérez', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000008', 'Daniel', 'Sánchez', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000009', 'Paula', 'Díaz', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000010', 'Alejandro', 'Ruiz', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000011', 'Valeria', 'Hernández', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000012', 'Adrián', 'Gómez', 'c0000000-0000-0000-0000-000000000001', ''),
  ('d0000000-0000-0000-0000-000000000013', 'Elena', 'Moreno', 'c0000000-0000-0000-0000-000000000002', ''),
  ('d0000000-0000-0000-0000-000000000014', 'Diego', 'Álvarez', 'c0000000-0000-0000-0000-000000000002', ''),
  ('d0000000-0000-0000-0000-000000000015', 'Alba', 'Romero', 'c0000000-0000-0000-0000-000000000002', ''),
  ('d0000000-0000-0000-0000-000000000016', 'Mateo', 'Alonso', 'c0000000-0000-0000-0000-000000000002', ''),
  ('d0000000-0000-0000-0000-000000000017', 'Claudia', 'Gutiérrez', 'c0000000-0000-0000-0000-000000000002', ''),
  ('d0000000-0000-0000-0000-000000000018', 'Álvaro', 'Navarro', 'c0000000-0000-0000-0000-000000000002', ''),
  ('d0000000-0000-0000-0000-000000000019', 'Marta', 'Torres', 'c0000000-0000-0000-0000-000000000003', ''),
  ('d0000000-0000-0000-0000-000000000020', 'Leo', 'Ramos', 'c0000000-0000-0000-0000-000000000003', ''),
  ('d0000000-0000-0000-0000-000000000021', 'Irene', 'Fernández', 'c0000000-0000-0000-0000-000000000003', ''),
  ('d0000000-0000-0000-0000-000000000022', 'Marcos', 'García', 'c0000000-0000-0000-0000-000000000003', ''),
  ('d0000000-0000-0000-0000-000000000023', 'Nerea', 'Rodríguez', 'c0000000-0000-0000-0000-000000000003', ''),
  ('d0000000-0000-0000-0000-000000000024', 'Iker', 'Martínez', 'c0000000-0000-0000-0000-000000000003', '');

-- Competencias específicas — Dibujo Técnico I
INSERT INTO specific_competencies (id, code, name, description, subject_id) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'CE1', 'Expresión gráfica', 'Utilizar técnicas de expresión gráfica para representar objetos y espacios', 'b0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000002', 'CE2', 'Análisis geométrico', 'Analizar formas y estructuras mediante el razonamiento geométrico', 'b0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000003', 'CE3', 'Sistemas de representación', 'Aplicar sistemas de representación para definir objetos en el espacio', 'b0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000004', 'CE4', 'Normalización', 'Aplicar la normalización en la representación técnica', 'b0000000-0000-0000-0000-000000000001'),
  ('e0000000-0000-0000-0000-000000000005', 'CE5', 'Herramientas digitales', 'Utilizar herramientas digitales CAD para el diseño técnico', 'b0000000-0000-0000-0000-000000000001');

-- Relaciones CE <-> KC (Dibujo Técnico)
INSERT INTO specific_competency_key_competencies (specific_competency_id, key_competency_id) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000103'),
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000108'),
  ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000103'),
  ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000103'),
  ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000104'),
  ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000103'),
  ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000104'),
  ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000103'),
  ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000104'),
  ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000107');

-- Criterios de evaluación — Dibujo Técnico I
INSERT INTO evaluation_criteria (id, code, description, specific_competency_id, subject_id) VALUES
  ('f0000000-0000-0000-0000-000000000001', '1.1', 'Realizar trazados geométricos fundamentales', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000002', '1.2', 'Construir polígonos regulares e irregulares', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000003', '1.3', 'Resolver tangencias entre elementos geométricos', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000004', '2.1', 'Aplicar transformaciones geométricas en el plano', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000005', '2.2', 'Analizar proporcionalidad y escalas', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000006', '3.1', 'Representar objetos en sistema diédrico', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000007', '3.2', 'Obtener perspectivas axonométricas', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000008', '4.1', 'Aplicar normas de acotación y normalización', 'e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000009', '5.1', 'Diseñar piezas utilizando software CAD', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000010', '5.2', 'Modelar objetos en 3D con herramientas digitales', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001');

-- Competencias específicas — Taller de Podcast
INSERT INTO specific_competencies (id, code, name, description, subject_id) VALUES
  ('e0000000-0000-0000-0000-000000000011', 'CE1', 'Comunicación oral', 'Desarrollar habilidades de comunicación oral y locución', 'b0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000012', 'CE2', 'Lenguaje radiofónico', 'Dominar el lenguaje radiofónico y sus géneros', 'b0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000013', 'CE3', 'Producción sonora', 'Producir contenidos sonoros con herramientas digitales', 'b0000000-0000-0000-0000-000000000002'),
  ('e0000000-0000-0000-0000-000000000014', 'CE4', 'Trabajo cooperativo', 'Colaborar en proyectos de creación sonora', 'b0000000-0000-0000-0000-000000000002');

-- Relaciones CE <-> KC (Podcast)
INSERT INTO specific_competency_key_competencies (specific_competency_id, key_competency_id) VALUES
  ('e0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000101'),
  ('e0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000108'),
  ('e0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000101'),
  ('e0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000104'),
  ('e0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000108'),
  ('e0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000105'),
  ('e0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000106');

-- Criterios de evaluación — Taller de Podcast
INSERT INTO evaluation_criteria (id, code, description, specific_competency_id, subject_id) VALUES
  ('f0000000-0000-0000-0000-000000000011', '1.1', 'Expresarse oralmente con claridad y corrección', 'e0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000012', '1.2', 'Utilizar recursos de la locución profesional', 'e0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000013', '2.1', 'Redactar guiones literarios y técnicos', 'e0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000014', '2.2', 'Diferenciar y aplicar géneros radiofónicos', 'e0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000015', '3.1', 'Grabar y editar audio con REAPER', 'e0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000016', '3.2', 'Diseñar paisajes sonoros', 'e0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000017', '4.1', 'Planificar y ejecutar un proyecto cooperativo', 'e0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000002');

-- Competencias específicas — Taller de Cortometraje
INSERT INTO specific_competencies (id, code, name, description, subject_id) VALUES
  ('e0000000-0000-0000-0000-000000000021', 'CE1', 'Narrativa audiovisual', 'Crear narrativas audiovisuales coherentes', 'b0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000022', 'CE2', 'Lenguaje cinematográfico', 'Dominar el lenguaje cinematográfico', 'b0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000023', 'CE3', 'Producción audiovisual', 'Producir piezas audiovisuales completas', 'b0000000-0000-0000-0000-000000000003'),
  ('e0000000-0000-0000-0000-000000000024', 'CE4', 'Trabajo en equipo', 'Colaborar en producciones audiovisuales', 'b0000000-0000-0000-0000-000000000003');

-- Relaciones CE <-> KC (Cortometraje)
INSERT INTO specific_competency_key_competencies (specific_competency_id, key_competency_id) VALUES
  ('e0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000101'),
  ('e0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000108'),
  ('e0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000108'),
  ('e0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000103'),
  ('e0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000104'),
  ('e0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000107'),
  ('e0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000105'),
  ('e0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000106');

-- Criterios de evaluación — Taller de Cortometraje
INSERT INTO evaluation_criteria (id, code, description, specific_competency_id, subject_id) VALUES
  ('f0000000-0000-0000-0000-000000000021', '1.1', 'Desarrollar ideas narrativas originales', 'e0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000022', '1.2', 'Escribir guiones literarios y técnicos', 'e0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000023', '2.1', 'Aplicar tipos de plano y movimientos de cámara', 'e0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000024', '2.2', 'Diseñar storyboards efectivos', 'e0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000025', '3.1', 'Rodar secuencias con calidad técnica', 'e0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000026', '3.2', 'Editar y montar con DaVinci Resolve', 'e0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000027', '4.1', 'Coordinar un equipo de producción', 'e0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000003');

-- ============================================================
-- FIN DEL SETUP COMPLETO
-- ============================================================
