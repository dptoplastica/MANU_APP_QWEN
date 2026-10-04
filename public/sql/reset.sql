-- ============================================================
-- RESET — ELIMINAR TABLAS EXISTENTES
-- IES Lope de Vega — Gestión Docente LOMLOE
-- Ejecutar ANTES de schema.sql si las tablas ya existen
-- ============================================================

-- Eliminar tablas en orden inverso (primero las que tienen dependencias)
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
-- FIN DEL RESET
-- ============================================================
-- Ahora puedes ejecutar schema.sql y seed.sql
-- ============================================================
