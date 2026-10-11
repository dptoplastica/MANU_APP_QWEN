# 🔧 Solución: Los Cambios No se Ven en la Vista Previa

## Problema

Después de actualizar las programaciones didácticas y crear la tabla de instrumentos de evaluación, los cambios no se reflejan en la vista previa de la aplicación.

## Causas Posibles

1. **Caché del navegador**: El navegador está mostrando una versión antigua de la aplicación
2. **Build no actualizado**: La aplicación no se ha recompilado con los últimos cambios
3. **Problema de renderizado**: El componente no se está renderizando correctamente

## Soluciones

### Solución 1: Hard Reload del Navegador (Más Común)

**En Windows/Linux:**
- Presiona `Ctrl + F5` o `Ctrl + Shift + R`

**En Mac:**
- Presiona `Cmd + Shift + R`

**En móviles:**
- Cierra completamente el navegador y vuelve a abrirlo
- O borra la caché del navegador

### Solución 2: Verificar que el Build está Actualizado

El build ya se ha ejecutado correctamente:
```
✓ built in 16.47s
```

Si necesitas recompilar manualmente:
```bash
npm run build
```

### Solución 3: Verificar en la Consola del Navegador

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Console**
3. Busca errores en rojo
4. Ve a la pestaña **Network**
5. Recarga la página
6. Verifica que los archivos JS se cargan correctamente (status 200)

### Solución 4: Verificar que el Componente se Renderiza

Abre la consola del navegador y ejecuta:

```javascript
// Verificar que el componente existe
console.log('EvaluationInstrumentsTable:', typeof EvaluationInstrumentsTable);

// Verificar que los datos están cargados
console.log('evaluationCriteriaDT:', evaluationCriteriaDT);
console.log('evaluationCriteriaPodcast:', evaluationCriteriaPodcast);
console.log('evaluationCriteriaCorto:', evaluationCriteriaCorto);
```

### Solución 5: Limpiar Caché Completamente

**Chrome/Edge:**
1. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Cached images and files"
3. Selecciona "All time"
4. Haz clic en "Clear data"
5. Recarga la aplicación

**Firefox:**
1. Presiona `Ctrl + Shift + Delete` (Windows) o `Cmd + Shift + Delete` (Mac)
2. Selecciona "Cache"
3. Haz clic en "Clear now"
4. Recarga la aplicación

### Solución 6: Verificar en Modo Incógnito

Abre una ventana de incógnito y accede a la aplicación:
- Si los cambios se ven en modo incógnito, el problema es el caché
- Si no se ven, hay un problema con el código

## Verificación de Componentes

### Archivos que Deberían Existir

1. ✅ `src/components/EvaluationInstrumentsTable.tsx`
2. ✅ `src/pages/Programmes.tsx` (actualizado)
3. ✅ `src/data/seed.ts` (actualizado)
4. ✅ `src/types/index.ts` (actualizado)

### Datos que Deberían Estar Disponibles

**Dibujo Técnico I:**
- 12 criterios de evaluación con ponderaciones
- 5 situaciones de aprendizaje enriquecidas
- 4 instrumentos de evaluación

**Taller de Podcast:**
- 8 criterios de evaluación con ponderaciones
- 5 situaciones de aprendizaje enriquecidas
- 6 instrumentos de evaluación

**Taller de Cortometraje:**
- 8 criterios de evaluación con ponderaciones
- 5 situaciones de aprendizaje enriquecidas
- 7 instrumentos de evaluación

## Diagnóstico Paso a Paso

### Paso 1: Verificar la URL

Asegúrate de estar en la página correcta:
```
/dashboard → /programaciones
```

### Paso 2: Verificar el Usuario

Debes estar logueado como profesor o administrador:
- Profesor: `profesor@ieslopedevega.es`
- Administrador: `admin@ieslopedevega.es`

### Paso 3: Verificar las Asignaciones

El usuario debe tener asignaciones activas:
- Dibujo Técnico I → 1º Bachillerato A
- Taller de Podcast → 1º Bachillerato A
- Taller de Cortometraje → 2º Bachillerato A

### Paso 4: Navegar a Programaciones

1. Ve al menú lateral
2. Haz clic en "Programaciones didácticas"
3. Deberías ver las 3 programaciones
4. Debajo de cada programación debería estar la tabla de instrumentos

## Si Nada Funciona

### Opción A: Reiniciar el Servidor de Desarrollo

```bash
# Detener el servidor (Ctrl + C)
# Luego reiniciar
npm run dev
```

### Opción B: Eliminar node_modules y Reinstalar

```bash
rm -rf node_modules
npm install
npm run dev
```

### Opción C: Verificar el Código Fuente

Abre `src/pages/Programmes.tsx` y verifica que la línea 131 contenga:
```tsx
<EvaluationInstrumentsTable subjectId={prog.subjectId} />
```

## Estado Actual del Sistema

✅ **Build completado**: 16.47s sin errores  
✅ **Componente creado**: `EvaluationInstrumentsTable.tsx`  
✅ **Datos actualizados**: `seed.ts` con nuevas programaciones  
✅ **Tipos actualizados**: `index.ts` con nuevos campos  
✅ **Página actualizada**: `Programmes.tsx` con tabla integrada  

## Contacto

Si después de seguir todos estos pasos los cambios siguen sin verse:

1. Abre la consola del navegador (F12)
2. Toma una captura de pantalla de la pestaña **Console**
3. Toma una captura de pantalla de la pestaña **Network**
4. Comparte esta información para diagnóstico adicional

---

**Fecha**: Enero 2026  
**Versión**: 1.0.0  
**Estado**: 🔧 Troubleshooting en progreso
