# 🎓 Generador Automático de Quiz con Ollama

Sistema automatizado para generar quizzes educativos a partir de documentos de estudio usando IA local (Ollama con modelo kimi-k2:1t-cloud).

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso Básico](#-uso-básico)
- [Guía Paso a Paso](#-guía-paso-a-paso)
- [Opciones Avanzadas](#-opciones-avanzadas)
- [Estructura de Archivos Generados](#-estructura-de-archivos-generados)
- [Solución de Problemas](#-solución-de-problemas)

## ✨ Características

- **Generación Automática** - Un solo comando genera todos los archivos necesarios
- **Múltiples Formatos** - Soporta documentos TXT, PDF y DOCX
- **IA Local** - Usa Ollama con modelo kimi-k2:1t-cloud (sin APIs externas)
- **Audio Integrado** - Genera archivos MP3 automáticamente para cada pregunta
- **Tres Tipos de Quiz**:
  - Science Quiz (preguntas múltiple elección y verdadero/falso)
  - Vocabulary (vocabulario con emojis)
  - Definition Quiz (definiciones con opciones)
- **Traducciones Automáticas** - Genera contenido en inglés y español
- **Validación** - Verifica estructura y consistencia de datos

## 🔧 Requisitos Previos

### 1. Node.js
Versión 18 o superior
```bash
node --version
```

### 2. Ollama
Debe estar instalado y corriendo localmente

```bash
# Instalar Ollama (si no lo tienes)
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Verificar instalación
ollama --version

# Instalar el modelo kimi-k2:1t-cloud
ollama pull kimi-k2:1t-cloud

# Verificar que el modelo está instalado
ollama list
```

### 3. Servidor TTS (Text-to-Speech)
Para generación de audio. Debe estar corriendo en `http://localhost:8880`

```bash
# Asegúrate de que tu servidor TTS esté corriendo
curl http://localhost:8880/v1/audio/speech
```

## 📦 Instalación

### Paso 1: Navegar al directorio del generador
```bash
cd quiz-generator
```

### Paso 2: Instalar dependencias
```bash
npm install
```

Las dependencias incluyen:
- `axios` - Cliente HTTP para Ollama
- `pdf-parse` - Parseo de archivos PDF
- `mammoth` - Parseo de archivos DOCX
- `chalk` - Output colorido en terminal
- `ora` - Indicadores de progreso

### Paso 3: Verificar instalación
```bash
node generate-quiz.js --help
```

## 🚀 Uso Básico

### Comando Simple
```bash
node generate-quiz.js documento.pdf "Nombre del Test"
```

### Ejemplos

**Generar quiz desde un PDF:**
```bash
node generate-quiz.js study-material.pdf "Math Chapter 5"
```

**Generar desde un archivo de texto:**
```bash
node generate-quiz.js notes.txt "Biology Vocabulary"
```

**Generar desde un DOCX:**
```bash
node generate-quiz.js lecture.docx "History Exam"
```

## 📖 Guía Paso a Paso

### Escenario: Crear un nuevo quiz desde un documento de estudio

#### Paso 1: Preparar el documento
Asegúrate de tener tu documento de estudio en formato `.txt`, `.pdf` o `.docx`

```bash
# Ejemplo: Tienes un archivo llamado "spanish-verbs.pdf"
ls spanish-verbs.pdf
```

#### Paso 2: Iniciar Ollama (si no está corriendo)
```bash
ollama serve
```

En otra terminal, verifica que el modelo esté disponible:
```bash
ollama list | grep kimi-k2
```

#### Paso 3: Iniciar el servidor TTS (si no está corriendo)
```bash
# Esto depende de cómo tengas configurado tu servidor TTS
# Asegúrate de que esté corriendo en http://localhost:8880
```

#### Paso 4: Ejecutar el generador
```bash
cd quiz-generator
node generate-quiz.js spanish-verbs.pdf "Spanish Verbs Quiz"
```

#### Paso 5: Esperar la generación
El proceso toma varios minutos dependiendo del tamaño del documento:

```
=================================================================
🎓 AUTOMATED QUIZ GENERATOR
=================================================================
📄 Document: spanish-verbs.pdf
📝 Test Set: Spanish Verbs Quiz
=================================================================

📡 Step 1: Connecting to Ollama...
✅ Connected to Ollama. Model "kimi-k2:1t-cloud" is available.

📖 Step 2: Parsing document...
✅ Parsed PDF file: 5432 characters, 3 pages

📊 Document Statistics:
   Characters: 5432
   Words: 892
   Lines: 156
   Est. Reading Time: 5 minutes

🔧 Step 3: Preparing output files...
   ID: spanish-verbs-quiz
   Vocabulary: vocabulary-data-spanish-verbs-quiz.json
   Science Quiz: science-quiz-data-spanish-verbs-quiz.json
   Definition Quiz: definition-quiz-data-spanish-verbs-quiz.json

📚 Step 4: Generating Science Quiz...
🤖 Generating with kimi-k2:1t-cloud...
✅ Generated 25 quiz questions
✅ Saved science quiz to: ../public/science-quiz-data-spanish-verbs-quiz.json

🎵 Generating audio for Science Quiz...
[Generación de audio en progreso...]

📖 Step 5: Generating Vocabulary Data...
[...]

🔍 Step 6: Generating Definition Quiz...
[...]

⚙️  Step 7: Updating test-sets-config.json...
✅ Adding new test set: "Spanish Verbs Quiz"
✅ Updated config file: ../public/test-sets-config.json

=================================================================
✅ QUIZ GENERATION COMPLETE!
=================================================================
```

#### Paso 6: Verificar los archivos generados
```bash
# Navegar al directorio public
cd ../public

# Ver los archivos generados
ls -la *spanish-verbs-quiz*.json

# Verificar que se agregó al config
cat test-sets-config.json
```

#### Paso 7: Usar el quiz en la aplicación
Abre la aplicación web y selecciona el nuevo test set "Spanish Verbs Quiz"

```bash
# Desde el directorio raíz del proyecto
open public/index.html
```

## ⚙️ Opciones Avanzadas

### Saltar Componentes Específicos

**Generar solo Science Quiz (sin vocabulario ni definiciones):**
```bash
node generate-quiz.js document.pdf "Test Name" --skip-vocabulary --skip-definition-quiz
```

**Generar sin audio (más rápido):**
```bash
node generate-quiz.js document.pdf "Test Name" --skip-audio
```

**Generar solo vocabulario:**
```bash
node generate-quiz.js document.pdf "Test Name" --skip-science-quiz --skip-definition-quiz
```

### Personalizar Configuración

Edita el archivo `generate-quiz.js` para cambiar configuraciones:

```javascript
const CONFIG = {
    ollamaURL: 'http://localhost:11434',        // URL de Ollama
    ollamaModel: 'kimi-k2:1t-cloud',           // Modelo a usar
    ttsEndpoint: 'http://localhost:8880/v1/audio/speech',  // Endpoint TTS
    outputDir: path.join(__dirname, '..', 'public'),
    audioDir: path.join(__dirname, '..', 'public', 'audios'),
    configFile: path.join(__dirname, '..', 'public', 'test-sets-config.json')
};
```

## 📁 Estructura de Archivos Generados

Después de ejecutar el generador, obtendrás:

```
public/
├── science-quiz-data-{id}.json       # Quiz principal (multiple choice, true/false)
├── vocabulary-data-{id}.json         # Datos de vocabulario
├── definition-quiz-data-{id}.json    # Quiz de definiciones
├── test-sets-config.json             # Actualizado con nuevo test set
└── audios/
    ├── english-q1-*.mp3              # Audios de preguntas
    ├── english-tf1-*.mp3             # Audios de true/false
    ├── word-*.mp3                    # Audios de palabras
    ├── sentence-*.mp3                # Audios de oraciones
    └── question-*.mp3                # Audios de definiciones
```

### Formato de science-quiz-data

```json
[
  {
    "exam": "E1 - Subject Name - Grade",
    "question": "Question text",
    "type": "multiple-choice",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Explanation",
    "questionES": "Pregunta en español",
    "explanationES": "Explicación en español",
    "audioQuestion": "audios/english-q1-description.mp3"
  }
]
```

### Formato de vocabulary-data

```json
[
  {
    "word": "WORD",
    "spanish": "Palabra",
    "sentenceEN": "Example sentence.",
    "sentenceES": "Oración de ejemplo.",
    "options": [
      {"emoji": "✅", "label": "Word", "isCorrect": true},
      {"emoji": "❌", "label": "Other", "isCorrect": false}
    ],
    "audioWord": "audios/word-word.mp3",
    "audioSentence": "audios/sentence-description.mp3",
    "wordEmoji": "✅"
  }
]
```

### Formato de definition-quiz-data

```json
[
  {
    "question": "This is a [definition].",
    "correctAnswer": "WORD",
    "options": [
      {"word": "WORD", "emoji": "✅", "isCorrect": true},
      {"word": "OTHER", "isCorrect": false}
    ],
    "audioQuestion": "audios/question-word.mp3"
  }
]
```

## 🔍 Solución de Problemas

### Error: "Failed to connect to Ollama"

**Problema:** Ollama no está corriendo o no está en el puerto esperado

**Solución:**
```bash
# Verificar si Ollama está corriendo
ps aux | grep ollama

# Iniciar Ollama
ollama serve

# Verificar en otra terminal
ollama list
```

### Error: "Model kimi-k2:1t-cloud not found"

**Problema:** El modelo no está instalado

**Solución:**
```bash
# Descargar el modelo
ollama pull kimi-k2:1t-cloud

# Verificar instalación
ollama list | grep kimi
```

### Error: "TTS server error"

**Problema:** El servidor TTS no está corriendo

**Solución:**
```bash
# Verificar que el servidor TTS esté corriendo
curl http://localhost:8880/v1/audio/speech

# Si no está corriendo, inícialo según tu configuración
# O genera sin audio:
node generate-quiz.js document.pdf "Test" --skip-audio
```

### Error: "Invalid JSON response from model"

**Problema:** El modelo no generó JSON válido

**Solución:**
- El modelo intentará hasta 3 veces automáticamente
- Si persiste, verifica que el documento tenga contenido válido
- Intenta con un documento más pequeño primero
- Revisa que el modelo esté actualizado: `ollama pull kimi-k2:1t-cloud`

### Los audios no se generan

**Problema:** El servidor TTS no responde o está mal configurado

**Solución:**
```bash
# Verificar conexión al servidor TTS
curl -X POST http://localhost:8880/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input":"test","voice":"af_alloy"}'

# Si no funciona, genera sin audio por ahora
node generate-quiz.js document.pdf "Test" --skip-audio
```

### El proceso es muy lento

**Causas comunes:**
- Documento muy grande
- Generación de muchos audios
- Modelo kimi-k2:1t-cloud es grande

**Soluciones:**
```bash
# Dividir el documento en partes más pequeñas
# Saltar la generación de audio temporalmente
node generate-quiz.js document.pdf "Test" --skip-audio

# Generar componentes por separado
node generate-quiz.js doc.pdf "Test" --skip-definition-quiz
```

## 📝 Tips y Mejores Prácticas

### 1. Preparación del Documento

✅ **Buenas prácticas:**
- Usa documentos bien estructurados con encabezados claros
- Incluye definiciones y explicaciones completas
- Mantén el documento entre 1000-5000 palabras
- Usa lenguaje claro y educativo

❌ **Evita:**
- Documentos con mucho texto sin estructura
- Imágenes escaneadas (usa OCR primero)
- Documentos con más de 10,000 palabras (divídelos)

### 2. Nombres de Test Sets

✅ **Buenos nombres:**
- "Biology Chapter 3"
- "Spanish Verbs Present Tense"
- "Math Algebra Basics"

❌ **Evita caracteres especiales:**
- "Test #1 (Advanced!)"
- "Quiz_2024/12"

### 3. Optimización

- Genera sin audio primero para validar contenido rápidamente
- Usa `--skip-audio` durante desarrollo
- Genera audio después con los scripts individuales si es necesario

### 4. Validación

Siempre verifica los archivos generados:
```bash
# Verificar JSON válido
cat public/science-quiz-data-{id}.json | jq .

# Contar preguntas
cat public/science-quiz-data-{id}.json | jq 'length'

# Ver primera pregunta
cat public/science-quiz-data-{id}.json | jq '.[0]'
```

## 🤝 Contribuir

Si encuentras bugs o quieres mejorar el generador:

1. Documenta el problema o mejora
2. Crea un issue o pull request
3. Incluye ejemplos y casos de uso

## 📄 Licencia

MIT

## 🆘 Soporte

Si necesitas ayuda:
1. Revisa esta documentación
2. Verifica la sección de Solución de Problemas
3. Asegúrate de que todos los requisitos estén instalados
4. Verifica los logs de error detalladamente

---

**Creado con ❤️ para facilitar la creación de contenido educativo**
