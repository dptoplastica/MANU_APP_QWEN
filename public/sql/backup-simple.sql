-- ============================================================
-- BACKUP SIMPLIFICADO - EJECUTAR POR SECCIONES
-- ============================================================
-- INSTRUCCIONES:
-- 1. Copia cada sección por separado
-- 2. Ejecútala en el SQL Editor de Supabase
-- 3. Copia el resultado y guárdalo en un archivo de texto
-- ============================================================

-- ============================================================
-- SECCIÓN 1: schools
-- ============================================================
SELECT 
  'INSERT INTO schools (id, name, location, region) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || replace(location, '''', '''''') || ''', ' ||
  '''' || replace(region, '''', '''''') || ''');'
FROM schools;

-- ============================================================
-- SECCIÓN 2: academic_years
-- ============================================================
SELECT 
  'INSERT INTO academic_years (id, name, active) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  active || ');'
FROM academic_years;

-- ============================================================
-- SECCIÓN 3: departments
-- ============================================================
SELECT 
  'INSERT INTO departments (id, name, school_id) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || school_id || ''');'
FROM departments;

-- ============================================================
-- SECCIÓN 4: key_competencies
-- ============================================================
SELECT 
  'INSERT INTO key_competencies (id, code, name, description) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(code, '''', '''''') || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(description, ''), '''', '''''') || ''');'
FROM key_competencies;

-- ============================================================
-- SECCIÓN 5: subjects
-- ============================================================
SELECT 
  'INSERT INTO subjects (id, name, course, modality, department_id, region, academic_year_id) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || replace(course, '''', '''''') || ''', ' ||
  '''' || replace(modality, '''', '''''') || ''', ' ||
  '''' || department_id || ''', ' ||
  '''' || replace(region, '''', '''''') || ''', ' ||
  '''' || academic_year_id || ''');'
FROM subjects;

-- ============================================================
-- SECCIÓN 6: groups
-- ============================================================
SELECT 
  'INSERT INTO groups (id, name, course, academic_year_id) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || replace(course, '''', '''''') || ''', ' ||
  '''' || academic_year_id || ''');'
FROM groups;

-- ============================================================
-- SECCIÓN 7: students
-- ============================================================
SELECT 
  'INSERT INTO students (id, first_name, last_name, group_id, observations) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(first_name, '''', '''''') || ''', ' ||
  '''' || replace(last_name, '''', '''''') || ''', ' ||
  '''' || group_id || ''', ' ||
  '''' || replace(COALESCE(observations, ''), '''', '''''') || ''');'
FROM students;

-- ============================================================
-- SECCIÓN 8: teacher_subject_groups
-- ============================================================
SELECT 
  'INSERT INTO teacher_subject_groups (id, teacher_id, subject_id, group_id) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || teacher_id || ''', ' ||
  '''' || subject_id || ''', ' ||
  '''' || group_id || ''');'
FROM teacher_subject_groups;

-- ============================================================
-- SECCIÓN 9: specific_competencies
-- ============================================================
SELECT 
  'INSERT INTO specific_competencies (id, code, name, description, subject_id) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(code, '''', '''''') || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(description, ''), '''', '''''') || ''', ' ||
  '''' || subject_id || ''');'
FROM specific_competencies;

-- ============================================================
-- SECCIÓN 10: evaluation_criteria
-- ============================================================
SELECT 
  'INSERT INTO evaluation_criteria (id, code, description, specific_competency_id, subject_id) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(code, '''', '''''') || ''', ' ||
  '''' || replace(description, '''', '''''') || ''', ' ||
  '''' || specific_competency_id || ''', ' ||
  '''' || subject_id || ''');'
FROM evaluation_criteria;

-- ============================================================
-- SECCIÓN 11: basic_knowledge
-- ============================================================
SELECT 
  'INSERT INTO basic_knowledge (id, code, description, subject_id) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(code, '''', '''''') || ''', ' ||
  '''' || replace(description, '''', '''''') || ''', ' ||
  '''' || subject_id || ''');'
FROM basic_knowledge;

-- ============================================================
-- SECCIÓN 12: learning_situations
-- ============================================================
SELECT 
  'INSERT INTO learning_situations (id, title, programme_id, subject_id, evaluation_period, timing, sessions, context, justification, final_product, objectives, methodology, resources, evaluation_instruments, diversity, reinforcement_measures) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(title, '''', '''''') || ''', ' ||
  CASE WHEN programme_id IS NULL THEN 'NULL' ELSE '''' || programme_id || '''' END || ', ' ||
  '''' || subject_id || ''', ' ||
  '''' || evaluation_period || ''', ' ||
  '''' || replace(COALESCE(timing, ''), '''', '''''') || ''', ' ||
  sessions || ', ' ||
  '''' || replace(COALESCE(context, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(justification, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(final_product, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(objectives, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(methodology, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(resources, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(evaluation_instruments, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(diversity, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(reinforcement_measures, ''), '''', '''''') || ''');'
FROM learning_situations;

-- ============================================================
-- SECCIÓN 13: activities
-- ============================================================
SELECT 
  'INSERT INTO activities (id, name, description, date, sessions, type, learning_situation_id, subject_id, group_id, evaluation_period, evaluation_instrument, weight, max_score, observations) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || replace(name, '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(description, ''), '''', '''''') || ''', ' ||
  CASE WHEN date IS NULL THEN 'NULL' ELSE '''' || date || '''' END || ', ' ||
  sessions || ', ' ||
  '''' || type || ''', ' ||
  CASE WHEN learning_situation_id IS NULL THEN 'NULL' ELSE '''' || learning_situation_id || '''' END || ', ' ||
  '''' || subject_id || ''', ' ||
  '''' || group_id || ''', ' ||
  '''' || evaluation_period || ''', ' ||
  '''' || replace(COALESCE(evaluation_instrument, ''), '''', '''''') || ''', ' ||
  weight || ', ' ||
  max_score || ', ' ||
  '''' || replace(COALESCE(observations, ''), '''', '''''') || ''');'
FROM activities;

-- ============================================================
-- SECCIÓN 14: programmes
-- ============================================================
SELECT 
  'INSERT INTO programmes (id, subject_id, academic_year_id, teacher_id, introduction, context, legal_framework, key_competencies, specific_competencies, evaluation_criteria, basic_knowledge, methodology, diversity, evaluation, evaluation_instruments, recovery, complementary_activities, timing) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || subject_id || ''', ' ||
  '''' || academic_year_id || ''', ' ||
  CASE WHEN teacher_id IS NULL THEN 'NULL' ELSE '''' || teacher_id || '''' END || ', ' ||
  '''' || replace(COALESCE(introduction, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(context, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(legal_framework, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(key_competencies, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(specific_competencies, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(evaluation_criteria, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(basic_knowledge, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(methodology, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(diversity, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(evaluation, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(evaluation_instruments, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(recovery, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(complementary_activities, ''), '''', '''''') || ''', ' ||
  '''' || replace(COALESCE(timing, ''), '''', '''''') || ''');'
FROM programmes;

-- ============================================================
-- SECCIÓN 15: grades
-- ============================================================
SELECT 
  'INSERT INTO grades (id, student_id, activity_id, score, observation, not_completed, not_evaluated, recovery) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || student_id || ''', ' ||
  '''' || activity_id || ''', ' ||
  CASE WHEN score IS NULL THEN 'NULL' ELSE score::text END || ', ' ||
  '''' || replace(COALESCE(observation, ''), '''', '''''') || ''', ' ||
  not_completed || ', ' ||
  not_evaluated || ', ' ||
  recovery || ');'
FROM grades;

-- ============================================================
-- FIN DEL BACKUP
-- ============================================================
-- INSTRUCCIONES FINALES:
-- 1. Ejecuta cada sección por separado
-- 2. Copia los resultados de cada sección
-- 3. Pega todo en un archivo llamado backup_YYYY-MM-DD.sql
-- 4. Guarda el archivo en un lugar seguro
-- ============================================================
