-- ============================================================
-- MIGRACIÓN: Reemplazar IDs del seed con UUIDs reales
-- Ejecutar en Supabase SQL Editor
-- ============================================================
-- ADVERTENCIA: Este script modificará los IDs en la base de datos.
-- Asegúrate de hacer un backup antes de ejecutar.
-- ============================================================

-- 1. Crear tabla temporal para mapear IDs antiguos a nuevos UUIDs
CREATE TEMP TABLE IF NOT EXISTS id_mapping (
  old_id TEXT,
  new_id UUID
);

-- Limpiar tabla temporal si ya existe
DELETE FROM id_mapping;

-- 2. Migrar grupos
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM groups 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en students primero
UPDATE students
SET group_id = m.new_id
FROM id_mapping m
WHERE group_id = m.old_id;

-- Actualizar referencias en teacher_subject_groups
UPDATE teacher_subject_groups
SET group_id = m.new_id
FROM id_mapping m
WHERE group_id = m.old_id;

-- Ahora actualizar los IDs de groups
UPDATE groups
SET id = m.new_id
FROM id_mapping m
WHERE groups.id = m.old_id;

-- Limpiar mapeo de grupos
DELETE FROM id_mapping;

-- 3. Migrar estudiantes
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM students 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en grades
UPDATE grades
SET student_id = m.new_id
FROM id_mapping m
WHERE student_id = m.old_id;

-- Actualizar IDs de students
UPDATE students
SET id = m.new_id
FROM id_mapping m
WHERE students.id = m.old_id;

-- Limpiar mapeo de estudiantes
DELETE FROM id_mapping;

-- 4. Migrar materias (subjects)
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM subjects 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en teacher_subject_groups
UPDATE teacher_subject_groups
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id = m.old_id;

-- Actualizar referencias en programmes
UPDATE programmes
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id = m.old_id;

-- Actualizar referencias en specific_competencies
UPDATE specific_competencies
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id = m.old_id;

-- Actualizar referencias en evaluation_criteria
UPDATE evaluation_criteria
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id = m.old_id;

-- Actualizar referencias en basic_knowledge
UPDATE basic_knowledge
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id = m.old_id;

-- Actualizar referencias en learning_situations
UPDATE learning_situations
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id = m.old_id;

-- Actualizar referencias en activities
UPDATE activities
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id = m.old_id;

-- Actualizar IDs de subjects
UPDATE subjects
SET id = m.new_id
FROM id_mapping m
WHERE subjects.id = m.old_id;

-- Limpiar mapeo de materias
DELETE FROM id_mapping;

-- 5. Migrar teacher_subject_groups
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM teacher_subject_groups 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar IDs de teacher_subject_groups
UPDATE teacher_subject_groups
SET id = m.new_id
FROM id_mapping m
WHERE teacher_subject_groups.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 6. Migrar learning_situations
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM learning_situations 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en activities
UPDATE activities
SET learning_situation_id = m.new_id
FROM id_mapping m
WHERE learning_situation_id = m.old_id;

-- Actualizar IDs de learning_situations
UPDATE learning_situations
SET id = m.new_id
FROM id_mapping m
WHERE learning_situations.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 7. Migrar activities
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM activities 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en grades
UPDATE grades
SET activity_id = m.new_id
FROM id_mapping m
WHERE activity_id = m.old_id;

-- Actualizar IDs de activities
UPDATE activities
SET id = m.new_id
FROM id_mapping m
WHERE activities.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 8. Migrar specific_competencies
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM specific_competencies 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en evaluation_criteria
UPDATE evaluation_criteria
SET specific_competency_id = m.new_id
FROM id_mapping m
WHERE specific_competency_id = m.old_id;

-- Actualizar referencias en specific_competency_key_competencies
UPDATE specific_competency_key_competencies
SET specific_competency_id = m.new_id
FROM id_mapping m
WHERE specific_competency_id = m.old_id;

-- Actualizar IDs de specific_competencies
UPDATE specific_competencies
SET id = m.new_id
FROM id_mapping m
WHERE specific_competencies.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 9. Migrar evaluation_criteria
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM evaluation_criteria 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en activity_criteria
UPDATE activity_criteria
SET criterion_id = m.new_id
FROM id_mapping m
WHERE criterion_id = m.old_id;

-- Actualizar referencias en basic_knowledge_criteria
UPDATE basic_knowledge_criteria
SET criterion_id = m.new_id
FROM id_mapping m
WHERE criterion_id = m.old_id;

-- Actualizar IDs de evaluation_criteria
UPDATE evaluation_criteria
SET id = m.new_id
FROM id_mapping m
WHERE evaluation_criteria.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 10. Migrar basic_knowledge
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM basic_knowledge 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en activity_basic_knowledge
UPDATE activity_basic_knowledge
SET basic_knowledge_id = m.new_id
FROM id_mapping m
WHERE basic_knowledge_id = m.old_id;

-- Actualizar referencias en basic_knowledge_criteria
UPDATE basic_knowledge_criteria
SET basic_knowledge_id = m.new_id
FROM id_mapping m
WHERE basic_knowledge_id = m.old_id;

-- Actualizar IDs de basic_knowledge
UPDATE basic_knowledge
SET id = m.new_id
FROM id_mapping m
WHERE basic_knowledge.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 11. Migrar programmes
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM programmes 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar IDs de programmes
UPDATE programmes
SET id = m.new_id
FROM id_mapping m
WHERE programmes.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 12. Migrar key_competencies
INSERT INTO id_mapping (old_id, new_id)
SELECT id, gen_random_uuid() 
FROM key_competencies 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en specific_competency_key_competencies
UPDATE specific_competency_key_competencies
SET key_competency_id = m.new_id
FROM id_mapping m
WHERE key_competency_id = m.old_id;

-- Actualizar IDs de key_competencies
UPDATE key_competencies
SET id = m.new_id
FROM id_mapping m
WHERE key_competencies.id = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 13. Eliminar tabla temporal
DROP TABLE IF EXISTS id_mapping;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- Ejecutar estas consultas para verificar que todos los IDs son UUIDs válidos:

SELECT 'groups' as table_name, COUNT(*) as invalid_ids 
FROM groups 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
UNION ALL
SELECT 'students', COUNT(*) 
FROM students 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
UNION ALL
SELECT 'subjects', COUNT(*) 
FROM subjects 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
UNION ALL
SELECT 'teacher_subject_groups', COUNT(*) 
FROM teacher_subject_groups 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Deberías ver 0 en todas las filas si la migración fue exitosa

-- ============================================================
-- FIN DE MIGRACIÓN
-- ============================================================
