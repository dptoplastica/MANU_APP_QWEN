-- ============================================================
-- VERIFICAR Y CORREGIR ASIGNACIONES EXISTENTES
-- ============================================================

-- PASO 1: Ver todas las asignaciones actuales
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  g.name as grupo,
  tsg.teacher_id,
  tsg.subject_id,
  tsg.group_id
FROM teacher_subject_groups tsg
LEFT JOIN users u ON tsg.teacher_id = u.id
LEFT JOIN subjects s ON tsg.subject_id = s.id
LEFT JOIN groups g ON tsg.group_id = g.id
ORDER BY tsg.created_at DESC;

-- PASO 2: Ver asignaciones con grupo NULL o inválido
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  tsg.group_id,
  CASE 
    WHEN tsg.group_id IS NULL THEN 'Grupo NULL'
    WHEN g.id IS NULL THEN 'Grupo no existe'
    ELSE 'Grupo válido'
  END as estado_grupo
FROM teacher_subject_groups tsg
LEFT JOIN users u ON tsg.teacher_id = u.id
LEFT JOIN subjects s ON tsg.subject_id = s.id
LEFT JOIN groups g ON tsg.group_id = g.id
WHERE tsg.group_id IS NULL OR g.id IS NULL;

-- PASO 3: Ver todos los grupos disponibles
SELECT id, name, course FROM groups ORDER BY name;

-- PASO 4: Actualizar asignaciones con grupo NULL
-- Asignar el primer grupo disponible a las asignaciones sin grupo
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups LIMIT 1)
WHERE group_id IS NULL;

-- PASO 5: Verificar que todas las asignaciones tienen grupo
SELECT 
  tsg.id,
  u.name as profesor,
  s.name as materia,
  g.name as grupo,
  CASE 
    WHEN g.id IS NULL THEN '❌ Sin grupo'
    ELSE '✅ Con grupo'
  END as estado
FROM teacher_subject_groups tsg
LEFT JOIN users u ON tsg.teacher_id = u.id
LEFT JOIN subjects s ON tsg.subject_id = s.id
LEFT JOIN groups g ON tsg.group_id = g.id
ORDER BY tsg.created_at DESC;

-- PASO 6: Si necesitas asignar grupos específicos manualmente
-- Ejemplo: Asignar "1º Bachillerato A" a "Dibujo Técnico I"
/*
UPDATE teacher_subject_groups
SET group_id = (SELECT id FROM groups WHERE name = '1º Bachillerato A')
WHERE subject_id = (SELECT id FROM subjects WHERE name = 'Dibujo Técnico I')
AND teacher_id = (SELECT id FROM users WHERE name = 'D. García López');
*/

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
