# Plan: Mostrar Solo Palabras en Preguntas Fill-in-the-Blank

## Objetivo
Para preguntas de tipo "fill in the blank" (con ___), mostrar solo las palabras en las opciones, sin emojis.

## Análisis Actual

### Estructura de Datos
En `definition-quiz-data-V3.json`:
```json
{
  "question": "Skateboarding has been my favorite sport ____ six months.",
  "correctAnswer": "FOR",
  "options": [
    {
      "word": "FOR",
      "emoji": "⏱️",
      "isCorrect": true
    }
  ]
}
```

### Renderizado Actual (definition_quiz_game.html línea 1018-1021)
```javascript
optionDiv.innerHTML = `
    <div class="option-emoji">${emoji}</div>
    <div class="option-word">${word}</div>
`;
```

## Solución Propuesta

### Opción 1: Detectar Preguntas Fill-in-the-Blank (RECOMENDADA)
1. **Detectar automáticamente** si la pregunta contiene "___"
2. **Modificar el renderizado** condicionalmente:
   - Si tiene "___" → mostrar solo palabra
   - Si NO tiene "___" → mostrar emoji + palabra

### Opción 2: Agregar Campo Tipo en JSON
1. Agregar campo `"type": "fill-blank"` en el JSON
2. Usar este campo para decidir cómo renderizar

## Implementación Recomendada (Opción 1)

### Paso 1: Modificar `definition_quiz_game.html`

**Ubicación**: Línea ~1015-1021

**Código Actual**:
```javascript
const emoji = option.emoji || '❓';
const word = option.word || '';

optionDiv.innerHTML = `
    <div class="option-emoji">${emoji}</div>
    <div class="option-word">${word}</div>
`;
```

**Código Nuevo**:
```javascript
const emoji = option.emoji || '❓';
const word = option.word || '';

// Detectar si es pregunta fill-in-the-blank
const isFillBlank = currentQuestion.question.includes('___');

if (isFillBlank) {
    // Solo mostrar palabra para preguntas fill-in-the-blank
    optionDiv.innerHTML = `
        <div class="option-word-only">${word}</div>
    `;
} else {
    // Mostrar emoji + palabra para otras preguntas
    optionDiv.innerHTML = `
        <div class="option-emoji">${emoji}</div>
        <div class="option-word">${word}</div>
    `;
}
```

### Paso 2: Agregar CSS para `.option-word-only`

**Ubicación**: Sección de estilos (después de línea 203)

```css
.option-word-only {
    font-size: 1.5em;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
    padding: 20px;
}
```

### Paso 3: Ajustar altura de opciones

**Modificar CSS de `.option`** para que se vea bien con ambos estilos:

```css
.option {
    min-height: 120px; /* En lugar de altura fija */
    display: flex;
    align-items: center;
    justify-content: center;
}
```

## Preguntas Afectadas

Buscar en `definition-quiz-data-V3.json` todas las preguntas con "___":

1. Preguntas de SINCE vs FOR (con ___)
2. Preguntas de ADVERB OF EMPHASIS (con ___)
3. Preguntas de PASSIVE VOICE (con ___)

**Estimación**: ~14-20 preguntas afectadas de ~31 total

## Ventajas de la Solución

✅ **Automática**: No requiere modificar el JSON
✅ **Flexible**: Detecta automáticamente el tipo de pregunta
✅ **Mantenible**: Un solo cambio en el código HTML
✅ **Retrocompatible**: No afecta preguntas existentes sin "___"
✅ **Visual**: Las palabras son más claras para gramática

## Resultado Esperado

### Antes:
```
⏱️
FOR
```

### Después (para preguntas con ___):
```
FOR
```

### Sin cambios (para preguntas sin ___):
```
🏛️
SITE
```

## Archivos a Modificar

1. ✅ `public/definition_quiz_game.html` (líneas ~1015-1021 y CSS)

## Testing

Probar con:
1. Pregunta fill-in-the-blank: "Skateboarding has been my favorite sport ___ six months."
2. Pregunta normal: "This is a place that archaeologists want to excavate or explore."

---

## ¿Proceder con la implementación?

Si apruebas este plan, procederé a modificar el archivo `definition_quiz_game.html`.
