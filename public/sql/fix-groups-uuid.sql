-- ============================================================
-- VERIFICAR Y CORREGIR GRUPOS
-- Este script verifica si los grupos tienen UUIDs válidos
-- y los recrea si es necesario
-- ============================================================

-- Paso 1: Ver grupos actuales
SELECT 
  id,
  name,
  course,
  academic_year_id,
  LENGTH(id) as id_length,
  CASE 
    WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 'UUID válido'
    ELSE 'ID inválido (no es UUID)'
  END as id_status
FROM groups
ORDER BY created_at;

-- Paso 2: Contar grupos con IDs inválidos
SELECT 
  COUNT(*) as total_groups,
  SUM(CASE WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 ELSE 0 END) as uuid_validos,
  SUM(CASE WHEN id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 ELSE 0 END) as uuid_invalidos
FROM groups;

-- ============================================================
-- SI HAY GRUPOS CON IDs INVÁLIDOS, EJECUTA ESTO:
-- ============================================================

-- Eliminar grupos con IDs inválidos
DELETE FROM groups
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Crear grupos con UUIDs válidos (si no existen)
INSERT INTO groups (id, name, course, academic_year_id)
SELECT 
  gen_random_uuid(),
  '1º Bachillerato A',
  '1º Bachillerato',
  'a0000000-0000-0000-0000-000000000010'
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE name = '1º Bachillerato A'
);

INSERT INTO groups (id, name, course, academic_year_id)
SELECT 
  gen_random_uuid(),
  '1º Bachillerato B',
  '1º Bachillerato',
  'a0000000-0000-0000-0000-000000000010'
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE name = '1º Bachillerato B'
);

INSERT INTO groups (id, name, course, academic_year_id)
SELECT 
  gen_random_uuid(),
  '2º Bachillerato A',
  '2º Bachillerato',
  'a0000000-0000-0000-0000-000000000010'
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE name = '2º Bachillerato A'
);

-- Paso 3: Verificar resultado final
SELECT 
  id,
  name,
  course,
  academic_year_id,
  'UUID válido' as id_status
FROM groups
ORDER BY created_at;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
