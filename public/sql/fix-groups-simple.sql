-- ============================================================
-- FIX GROUPS - VERSIÓN SIMPLE
-- Elimina todos los grupos y los recrea con UUIDs válidos
-- ============================================================

-- Paso 1: Eliminar todos los grupos existentes
DELETE FROM groups;

-- Paso 2: Crear grupos con UUIDs válidos
INSERT INTO groups (id, name, course, academic_year_id) VALUES
  (gen_random_uuid(), '1º Bachillerato A', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '1º Bachillerato B', '1º Bachillerato', 'a0000000-0000-0000-0000-000000000010'),
  (gen_random_uuid(), '2º Bachillerato A', '2º Bachillerato', 'a0000000-0000-0000-0000-000000000010');

-- Paso 3: Verificar resultado
SELECT id, name, course, academic_year_id FROM groups;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
