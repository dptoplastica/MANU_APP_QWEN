# IES Lope de Vega — Gestión Docente y Evaluación LOMLOE

Aplicación web educativa para la gestión docente, programación didáctica, situaciones de aprendizaje, actividades, evaluación y cuaderno del profesor, adaptada a la normativa LOMLOE de la Comunidad Autónoma de Cantabria.

## Características

- ✅ Autenticación de usuarios (admin/profesor)
- ✅ Dashboard personalizado
- ✅ Gestión de materias, grupos y alumnos
- ✅ Programaciones didácticas LOMLOE
- ✅ Situaciones de Aprendizaje (SDA)
- ✅ Actividades con vinculación curricular
- ✅ Cuaderno del profesor digital
- ✅ Sistema de evaluación por criterios
- ✅ Evaluación de competencias específicas y clave
- ✅ Generación de informes PDF
- ✅ Panel de administración
- ✅ Diseño responsive (móvil, tablet, escritorio)
- ✅ Exportación CSV de calificaciones
- ✅ Preparado para Supabase (PostgreSQL)

## Materias incluidas

1. **Dibujo Técnico I** — 1º Bachillerato
2. **Taller de Podcast** — 1º Bachillerato (Optativa)
3. **Taller de Cortometraje** — 2º Bachillerato (Optativa)

## Requisitos

- Node.js 18+ y npm
- Cuenta gratuita en [Supabase](https://supabase.com) (opcional, la app funciona con datos demo)
- Cuenta en [Vercel](https://vercel.com) para despliegue (opcional)

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd gestion-docente-lomloe

# 2. Instalar dependencias
npm install

# 3. Copiar el archivo de variables de entorno
cp .env.example .env

# 4. Editar .env con tus credenciales de Supabase (opcional)
# Si no configuras Supabase, la app funcionará con datos de demostración

# 5. Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Credenciales de demostración

| Rol | Email | Contraseña |
|-----|-------|------------|
| Profesor | profesor@ieslopedevega.es | (cualquier valor) |
| Administrador | admin@ieslopedevega.es | (cualquier valor) |

## Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear una cuenta
2. Crear un nuevo proyecto
3. Anotar la URL del proyecto y la clave `anon` (pública)

### 2. Configurar variables de entorno

Editar `.env`:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
```

### 3. Crear la base de datos

Ejecutar el SQL del archivo `supabase/schema.sql` en el editor SQL de Supabase.

### 4. Configurar autenticación

En Supabase → Authentication → Settings:
- Habilitar "Email" como proveedor
- Desactivar "Confirm email" para pruebas

## Estructura del proyecto

```
src/
├── App.tsx                    # Router principal
├── main.tsx                   # Punto de entrada
├── index.css                  # Estilos globales
├── types/
│   └── index.ts              # Tipos TypeScript
├── data/
│   └── seed.ts               # Datos de demostración
├── contexts/
│   └── AppContext.tsx         # Estado global
├── components/
│   └── Layout.tsx             # Layout con sidebar
└── pages/
    ├── Login.tsx              # Página de login
    ├── Dashboard.tsx          # Panel principal
    ├── Subjects.tsx           # Materias
    ├── GroupsStudents.tsx     # Grupos y alumnos
    ├── Gradebook.tsx          # Cuaderno del profesor
    ├── LearningSituations.tsx # Situaciones de aprendizaje
    ├── Activities.tsx         # Actividades
    ├── EvaluationsCompetencies.tsx # Evaluaciones y competencias
    ├── Reports.tsx            # Informes PDF
    ├── Programmes.tsx         # Programaciones didácticas
    ├── Admin.tsx              # Panel de administración
    └── Settings.tsx           # Configuración
```

## Despliegue en Vercel

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno en Vercel
3. Deploy automático

## Normativa

Esta aplicación está adaptada a:

- **LOMLOE** (Ley Orgánica 3/2020)
- **Currículo de Bachillerato de Cantabria**
- **Competencias clave LOMLOE**: CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC

### Modelo curricular

```
COMPETENCIAS CLAVE
    ↓
COMPETENCIAS ESPECÍFICAS
    ↓
CRITERIOS DE EVALUACIÓN
    ↓
SABERES BÁSICOS
    ↓
SITUACIONES DE APRENDIZAJE
    ↓
ACTIVIDADES
    ↓
EVIDENCIAS
    ↓
CALIFICACIÓN
    ↓
GRADO DE ADQUISICIÓN DE COMPETENCIAS
```

## Protección de datos

La aplicación está diseñada teniendo en cuenta el RGPD y la LOPDGDD:
- Minimización de datos
- Control de acceso por roles
- Trazabilidad
- Exportación y eliminación de datos

**Importante:** Es responsabilidad del centro adaptar el uso a sus obligaciones concretas de protección de datos.

## Licencia

Proyecto educativo de código abierto.

## Centro

**IES Lope de Vega**  
Santa María de Cayón, Cantabria  
Curso 2026/2027
