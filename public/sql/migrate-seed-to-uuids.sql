-- ============================================================
-- MIGRACIÓN: Reemplazar IDs del seed con UUIDs reales
-- Versión corregida con conversión UUID a texto
-- ============================================================

-- 1. Crear tabla temporal para mapear IDs antiguos a nuevos UUIDs
CREATE TEMP TABLE id_mapping (
  old_id TEXT,
  new_id UUID
);

-- 2. Migrar grupos
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM groups 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en students primero
UPDATE students
SET group_id = m.new_id
FROM id_mapping m
WHERE group_id::text = m.old_id;

-- Actualizar referencias en teacher_subject_groups
UPDATE teacher_subject_groups
SET group_id = m.new_id
FROM id_mapping m
WHERE group_id::text = m.old_id;

-- Ahora actualizar los IDs de groups
UPDATE groups
SET id = m.new_id
FROM id_mapping m
WHERE groups.id::text = m.old_id;

-- Limpiar mapeo de grupos
DELETE FROM id_mapping;

-- 3. Migrar estudiantes
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM students 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en grades
UPDATE grades
SET student_id = m.new_id
FROM id_mapping m
WHERE student_id::text = m.old_id;

-- Actualizar IDs de students
UPDATE students
SET id = m.new_id
FROM id_mapping m
WHERE students.id::text = m.old_id;

-- Limpiar mapeo de estudiantes
DELETE FROM id_mapping;

-- 4. Migrar materias (subjects)
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM subjects 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en teacher_subject_groups
UPDATE teacher_subject_groups
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id::text = m.old_id;

-- Actualizar referencias en programmes
UPDATE programmes
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id::text = m.old_id;

-- Actualizar referencias en specific_competencies
UPDATE specific_competencies
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id::text = m.old_id;

-- Actualizar referencias en evaluation_criteria
UPDATE evaluation_criteria
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id::text = m.old_id;

-- Actualizar referencias en basic_knowledge
UPDATE basic_knowledge
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id::text = m.old_id;

-- Actualizar referencias en learning_situations
UPDATE learning_situations
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id::text = m.old_id;

-- Actualizar referencias en activities
UPDATE activities
SET subject_id = m.new_id
FROM id_mapping m
WHERE subject_id::text = m.old_id;

-- Actualizar IDs de subjects
UPDATE subjects
SET id = m.new_id
FROM id_mapping m
WHERE subjects.id::text = m.old_id;

-- Limpiar mapeo de materias
DELETE FROM id_mapping;

-- 5. Migrar teacher_subject_groups
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM teacher_subject_groups 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar IDs de teacher_subject_groups
UPDATE teacher_subject_groups
SET id = m.new_id
FROM id_mapping m
WHERE teacher_subject_groups.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 6. Migrar learning_situations
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM learning_situations 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en activities
UPDATE activities
SET learning_situation_id = m.new_id
FROM id_mapping m
WHERE learning_situation_id::text = m.old_id;

-- Actualizar IDs de learning_situations
UPDATE learning_situations
SET id = m.new_id
FROM id_mapping m
WHERE learning_situations.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 7. Migrar activities
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM activities 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en grades
UPDATE grades
SET activity_id = m.new_id
FROM id_mapping m
WHERE activity_id::text = m.old_id;

-- Actualizar IDs de activities
UPDATE activities
SET id = m.new_id
FROM id_mapping m
WHERE activities.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 8. Migrar specific_competencies
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM specific_competencies 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en evaluation_criteria
UPDATE evaluation_criteria
SET specific_competency_id = m.new_id
FROM id_mapping m
WHERE specific_competency_id::text = m.old_id;

-- Actualizar referencias en specific_competency_key_competencies
UPDATE specific_competency_key_competencies
SET specific_competency_id = m.new_id
FROM id_mapping m
WHERE specific_competency_id::text = m.old_id;

-- Actualizar IDs de specific_competencies
UPDATE specific_competencies
SET id = m.new_id
FROM id_mapping m
WHERE specific_competencies.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 9. Migrar evaluation_criteria
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM evaluation_criteria 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en activity_criteria
UPDATE activity_criteria
SET criterion_id = m.new_id
FROM id_mapping m
WHERE criterion_id::text = m.old_id;

-- Actualizar referencias en basic_knowledge_criteria
UPDATE basic_knowledge_criteria
SET criterion_id = m.new_id
FROM id_mapping m
WHERE criterion_id::text = m.old_id;

-- Actualizar IDs de evaluation_criteria
UPDATE evaluation_criteria
SET id = m.new_id
FROM id_mapping m
WHERE evaluation_criteria.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 10. Migrar basic_knowledge
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM basic_knowledge 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en activity_basic_knowledge
UPDATE activity_basic_knowledge
SET basic_knowledge_id = m.new_id
FROM id_mapping m
WHERE basic_knowledge_id::text = m.old_id;

-- Actualizar referencias en basic_knowledge_criteria
UPDATE basic_knowledge_criteria
SET basic_knowledge_id = m.new_id
FROM id_mapping m
WHERE basic_knowledge_id::text = m.old_id;

-- Actualizar IDs de basic_knowledge
UPDATE basic_knowledge
SET id = m.new_id
FROM id_mapping m
WHERE basic_knowledge.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 11. Migrar programmes
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM programmes 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar IDs de programmes
UPDATE programmes
SET id = m.new_id
FROM id_mapping m
WHERE programmes.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 12. Migrar key_competencies
INSERT INTO id_mapping (old_id, new_id)
SELECT id::text, gen_random_uuid() 
FROM key_competencies 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Actualizar referencias en specific_competency_key_competencies
UPDATE specific_competency_key_competencies
SET key_competency_id = m.new_id
FROM id_mapping m
WHERE key_competency_id::text = m.old_id;

-- Actualizar IDs de key_competencies
UPDATE key_competencies
SET id = m.new_id
FROM id_mapping m
WHERE key_competencies.id::text = m.old_id;

-- Limpiar mapeo
DELETE FROM id_mapping;

-- 13. Eliminar tabla temporal
DROP TABLE IF EXISTS id_mapping;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
SELECT 'Migración completada. Verificando IDs...' as mensaje;

SELECT 'groups' as tabla, COUNT(*) as ids_invalidos 
FROM groups 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
UNION ALL
SELECT 'students', COUNT(*) 
FROM students 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
UNION ALL
SELECT 'subjects', COUNT(*) 
FROM subjects 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
UNION ALL
SELECT 'teacher_subject_groups', COUNT(*) 
FROM teacher_subject_groups 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Deberías ver 0 en todas las filas si la migración fue exitosa
