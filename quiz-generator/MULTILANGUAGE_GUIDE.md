# 🌐 Guía de Soporte Multiidioma - Quiz Generator

## 🎯 Nueva Funcionalidad

El generador de quiz ahora soporta **múltiples idiomas** como idioma principal de salida. Puedes generar quizzes completamente en español, inglés, francés, alemán, portugués o italiano.

---

## 🚀 Uso Básico

### Sintaxis

```bash
node generate-quiz.js <documento> "<nombre>" --language <código>
node generate-quiz.js <documento> "<nombre>" -l <código>
```

### Ejemplos Rápidos

```bash
# Inglés (default - con traducción al español)
node generate-quiz.js document.pdf "Biology Quiz"

# Español (con traducción al inglés)
node generate-quiz.js documento.pdf "Quiz de Biología" --language es

# Francés (solo francés, sin traducciones)
node generate-quiz.js document.pdf "Quiz de Biologie" -l fr

# Alemán
node generate-quiz.js dokument.pdf "Biologie Quiz" -l de
```

---

## 📚 Idiomas Soportados

| Código | Idioma | Nombre Nativo | Traducción Secundaria |
|--------|--------|---------------|----------------------|
| `en` | English | English | ✅ Spanish (Español) |
| `es` | Spanish | Español | ✅ English (Inglés) |
| `fr` | French | Français | ❌ Ninguna |
| `de` | German | Deutsch | ❌ Ninguna |
| `pt` | Portuguese | Português | ❌ Ninguna |
| `it` | Italian | Italiano | ❌ Ninguna |

### Ver Idiomas Disponibles

```bash
node generate-quiz.js --list-languages
```

Salida:
```
📚 Supported Languages:
============================================================
  EN: English / English (with Spanish translation)
  ES: Español / Spanish (with English translation)
  FR: Français / French (monolingual)
  DE: Deutsch / German (monolingual)
  PT: Português / Portuguese (monolingual)
  IT: Italiano / Italian (monolingual)
============================================================
```

---

## 📊 Estructura de Salida por Idioma

### Inglés (English) - `--language en`

**Idioma principal:** Inglés
**Idioma secundario:** Español

```json
{
  "question": "What is photosynthesis?",
  "explanation": "Photosynthesis is the process...",
  "questionES": "¿Qué es la fotosíntesis?",
  "explanationES": "La fotosíntesis es el proceso...",
  "audioQuestion": "audios/english-q1-photosynthesis.mp3"
}
```

### Español (Spanish) - `--language es`

**Idioma principal:** Español
**Idioma secundario:** Inglés

```json
{
  "question": "¿Qué es la fotosíntesis?",
  "explanation": "La fotosíntesis es el proceso...",
  "questionEN": "What is photosynthesis?",
  "explanationEN": "Photosynthesis is the process...",
  "audioQuestion": "audios/spanish-q1-fotosintesis.mp3"
}
```

### Francés (French) - `--language fr`

**Idioma principal:** Francés
**Sin idioma secundario**

```json
{
  "question": "Qu'est-ce que la photosynthèse?",
  "explanation": "La photosynthèse est le processus...",
  "audioQuestion": "audios/french-q1-photosynthese.mp3"
}
```

---

## 🎯 Casos de Uso

### Caso 1: Quiz Bilingüe (Inglés-Español)

```bash
# Generar en inglés con traducciones al español
node generate-quiz.js biology-notes.pdf "Biology Chapter 5" --language en
```

**Resultado:**
- Preguntas en **inglés** (principal)
- Traducción al **español** (campos `questionES`, `explanationES`)
- Audio con prefijo `english-`
- Ideal para estudiantes de habla hispana aprendiendo inglés

### Caso 2: Quiz Bilingüe (Español-Inglés)

```bash
# Generar en español con traducciones al inglés
node generate-quiz.js biologia-apuntes.pdf "Biología Capítulo 5" -l es
```

**Resultado:**
- Preguntas en **español** (principal)
- Traducción al **inglés** (campos `questionEN`, `explanationEN`)
- Audio con prefijo `spanish-`
- Ideal para estudiantes angloparlantes aprendiendo español

### Caso 3: Quiz Monolingüe (Francés)

```bash
# Generar solo en francés
node generate-quiz.js notes-biologie.pdf "Biologie Chapitre 5" --lang fr
```

**Resultado:**
- Todo el contenido en **francés**
- Sin traducciones
- Audio con prefijo `french-`
- Ideal para estudiantes nativos de francés

### Caso 4: Solo Vocabulario en Español

```bash
# Generar solo vocabulario en español
node generate-quiz.js vocabulario.txt "Vocabulario Científico" \
  -l es \
  --skip-science-quiz \
  --skip-definition-quiz
```

**Resultado:**
- Vocabulario en español con traducción al inglés
- Sin science quiz ni definition quiz
- Más rápido de generar

---

## 🔧 Configuración Técnica

### Archivos de Configuración

**[utils/language-config.js](utils/language-config.js)**
- Configuración centralizada de idiomas
- Fácil agregar nuevos idiomas
- Mapeo de campos según idioma

### Estructura de Configuración

```javascript
{
  code: 'es',
  name: 'Spanish',
  nativeName: 'Español',
  secondaryLanguage: 'en',           // Código del idioma secundario
  secondaryName: 'English',
  audioPrefix: 'spanish',            // Prefijo para archivos de audio
  questionField: 'question',         // Campo principal de pregunta
  secondaryQuestionField: 'questionEN',  // Campo secundario
  sentenceField: 'sentenceES'        // Para vocabulario
}
```

---

## 📝 Prompts Dinámicos

Los prompts ahora son dinámicos y se adaptan automáticamente según el idioma seleccionado:

### Placeholders en Prompts

- `{PRIMARY_LANGUAGE}` → "Spanish", "English", etc.
- `{PRIMARY_LANGUAGE_NATIVE}` → "Español", "English", etc.
- `{SECONDARY_LANGUAGE_INFO}` → Info del idioma secundario
- `{TRANSLATION_INSTRUCTION}` → Instrucciones de traducción
- `{AUDIO_PREFIX}` → Prefijo para archivos de audio

### Ejemplo de Prompt Procesado (Español)

```
LANGUAGE SETTINGS:
- Primary Language: Spanish (Español)
- Secondary Language: English (English)

INSTRUCTIONS:
1. Analyze the study material carefully
2. Generate 30-50 questions in Spanish
3. ALL content MUST be in Spanish
4. Include translations in English:
   - questionEN: Question text in English
   - explanationEN: Explanation in English
...
```

---

## 🎵 Archivos de Audio

Los archivos de audio se generan con prefijos según el idioma:

| Idioma | Prefijo | Ejemplo |
|--------|---------|---------|
| English | `english-` | `audios/english-q1-photosynthesis.mp3` |
| Spanish | `spanish-` | `audios/spanish-q1-fotosintesis.mp3` |
| French | `french-` | `audios/french-q1-photosynthese.mp3` |
| German | `german-` | `audios/german-q1-photosynthese.mp3` |
| Portuguese | `portuguese-` | `audios/portuguese-q1-fotossintese.mp3` |
| Italian | `italian-` | `audios/italian-q1-fotosintesi.mp3` |

---

## ⚙️ Agregar Nuevos Idiomas

Para agregar un nuevo idioma, edita `utils/language-config.js`:

```javascript
nl: {  // Holandés (Dutch)
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    secondaryLanguage: null,  // o 'en' para bilingüe
    audioPrefix: 'dutch',
    questionField: 'question',
    explanationField: 'explanation',
    sentenceField: 'sentence'
}
```

---

## 🔄 Comparación: Antes vs Ahora

### ❌ Antes (Sin Soporte Multiidioma)

```bash
# Solo podías generar en inglés con español
node generate-quiz.js document.pdf "Quiz"

# Siempre producía:
{
  "question": "What is...",  # Siempre en inglés
  "questionES": "¿Qué es..."  # Siempre español como secundario
}
```

### ✅ Ahora (Con Soporte Multiidioma)

```bash
# Puedes elegir el idioma principal
node generate-quiz.js documento.pdf "Quiz" --language es

# Produce:
{
  "question": "¿Qué es...",  # En español (principal)
  "questionEN": "What is..."  # Inglés como secundario
}

# O solo francés
node generate-quiz.js document.pdf "Quiz" -l fr

# Produce:
{
  "question": "Qu'est-ce que...",  # Solo francés
  # Sin traducciones
}
```

---

## 💡 Tips y Mejores Prácticas

### 1. Elige el Idioma Según tu Audiencia

- **Estudiantes bilingües EN/ES:** Usa `--language en` o `--language es`
- **Estudiantes monolingües:** Usa el idioma nativo sin secundario

### 2. Documentos en el Idioma Objetivo

Para mejores resultados, el documento fuente debe estar en el idioma que quieres generar:

```bash
# Documento en español → Generar en español
node generate-quiz.js apuntes-español.pdf "Quiz" -l es

# Documento en francés → Generar en francés
node generate-quiz.js notes-français.pdf "Quiz" -l fr
```

### 3. Validar Salida

Siempre revisa los JSON generados para verificar que el idioma sea correcto:

```bash
# Generar
node generate-quiz.js doc.pdf "Test" -l es

# Verificar
cat ../public/science-quiz-data-test.json | jq '.[0]'
```

### 4. Audio Requiere TTS Compatible

Asegúrate de que tu servidor TTS soporte el idioma seleccionado. Si no:

```bash
# Genera sin audio
node generate-quiz.js doc.pdf "Quiz" -l fr --skip-audio
```

---

## 🐛 Solución de Problemas

### Error: "Unsupported language"

```bash
❌ Error: Unsupported language 'jp'
```

**Solución:** Verifica los idiomas soportados con `--list-languages`

### Contenido en Idioma Incorrecto

Si el modelo genera contenido en el idioma equivocado:

1. Verifica que el documento fuente esté en el idioma objetivo
2. El modelo puede necesitar más contexto
3. Intenta con un documento más grande

### Audio No Se Genera

Si los audios no se generan:

1. Verifica que el servidor TTS soporte el idioma
2. Usa `--skip-audio` temporalmente
3. Genera audio después con scripts individuales

---

## 📊 Estadísticas de Generación

Con el idioma configurado, verás:

```
=================================================================
🎓 AUTOMATED QUIZ GENERATOR
=================================================================
📄 Document: documento.pdf
📝 Test Set: Quiz de Biología
🌐 Language: Español (es)
   Secondary: English (en)
=================================================================

📚 Generating Science Quiz in Español...
✅ Generated 35 quiz questions

📖 Generating Vocabulary Data in Español...
✅ Generated 32 vocabulary items

🔍 Generating Definition Quiz in Español...
✅ Generated 38 definition quiz questions
```

---

## 🎉 Resumen

**Funcionalidad Completa:**
- ✅ 6 idiomas soportados (EN, ES, FR, DE, PT, IT)
- ✅ Idiomas bilingües (EN↔ES)
- ✅ Idiomas monolingües (FR, DE, PT, IT)
- ✅ CLI intuitivo y fácil de usar
- ✅ Prompts dinámicos
- ✅ Audio con prefijos por idioma
- ✅ Completamente retrocompatible

**Uso Simple:**
```bash
# Español
node generate-quiz.js doc.pdf "Quiz" -l es

# Francés
node generate-quiz.js doc.pdf "Quiz" -l fr

# Inglés (default)
node generate-quiz.js doc.pdf "Quiz"
```

---

Para más información, consulta [README.md](README.md) o ejecuta:

```bash
node generate-quiz.js --help
```
