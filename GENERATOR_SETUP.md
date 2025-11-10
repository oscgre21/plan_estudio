# 🎓 Sistema Generador de Quiz - Documentación Completa

## 📋 Resumen del Sistema

Este sistema permite generar automáticamente archivos de quiz a partir de documentos de estudio utilizando IA local (Ollama con modelo kimi-k2:1t-cloud).

## 🎯 ¿Qué hace?

### Entrada
- Un documento de estudio (TXT, PDF, o DOCX)
- Un nombre para el test set

### Salida
- ✅ `science-quiz-data-{id}.json` - Quiz completo con preguntas múltiple elección y verdadero/falso
- ✅ `vocabulary-data-{id}.json` - Vocabulario con emojis y audios
- ✅ `definition-quiz-data-{id}.json` - Quiz de definiciones
- ✅ `test-sets-config.json` - Actualizado con el nuevo test set
- ✅ Archivos MP3 de audio para todas las preguntas

## 📁 Estructura del Proyecto

```
Jearlenis_exam/
├── quiz-generator/              # 🆕 Sistema generador de quiz
│   ├── generate-quiz.js         # Script principal
│   ├── package.json             # Dependencias
│   ├── install.sh              # Script de instalación
│   ├── README.md                # Documentación completa
│   ├── QUICK_START.md          # Guía rápida
│   ├── example-document.txt     # Documento de ejemplo
│   │
│   ├── generators/              # Generadores especializados
│   │   ├── science-quiz-generator.js
│   │   ├── vocabulary-generator.js
│   │   ├── definition-quiz-generator.js
│   │   └── config-updater.js
│   │
│   ├── prompts/                 # Prompts para Ollama
│   │   ├── science-quiz-prompt.txt
│   │   ├── vocabulary-prompt.txt
│   │   └── definition-quiz-prompt.txt
│   │
│   └── utils/                   # Utilidades
│       ├── ollama-client.js     # Cliente Ollama
│       ├── document-parser.js   # Parser de documentos
│       └── audio-generator.js   # Generador de audio
│
├── public/                      # Archivos de salida
│   ├── test-sets-config.json   # Configuración de test sets
│   ├── science-quiz-data-*.json
│   ├── vocabulary-data-*.json
│   ├── definition-quiz-data-*.json
│   └── audios/                  # Archivos MP3
│
└── [otros archivos del proyecto...]
```

## 🚀 Instalación Rápida

### Opción 1: Script Automático (Recomendado)

```bash
cd quiz-generator
./install.sh
```

El script:
- ✅ Verifica Node.js y npm
- ✅ Verifica Ollama y modelo kimi-k2:1t-cloud
- ✅ Instala dependencias npm
- ✅ Crea directorios necesarios
- ✅ Verifica servidor TTS

### Opción 2: Manual

```bash
# 1. Instalar dependencias
cd quiz-generator
npm install

# 2. Verificar Ollama
ollama serve
ollama pull kimi-k2:1t-cloud

# 3. Verificar que todo funciona
node generate-quiz.js --help
```

## 📖 Uso

### Comando Básico

```bash
node generate-quiz.js <documento> "<nombre-del-test>"
```

### Ejemplos Prácticos

#### 1. Generar desde un PDF
```bash
node generate-quiz.js study-material.pdf "Biology Chapter 5"
```

#### 2. Generar desde texto
```bash
node generate-quiz.js notes.txt "History Exam"
```

#### 3. Generar sin audio (más rápido para testing)
```bash
node generate-quiz.js document.pdf "Test" --skip-audio
```

#### 4. Generar solo vocabulario
```bash
node generate-quiz.js vocab.txt "Spanish Words" --skip-science-quiz --skip-definition-quiz
```

#### 5. Probar con documento de ejemplo
```bash
node generate-quiz.js example-document.txt "Example Quiz"
```

## 🔧 Requisitos del Sistema

### Software Necesario

| Componente | Versión | URL | Obligatorio |
|------------|---------|-----|-------------|
| Node.js | 18+ | https://nodejs.org/ | ✅ Sí |
| Ollama | Latest | https://ollama.com/ | ✅ Sí |
| Modelo kimi-k2:1t-cloud | Latest | `ollama pull kimi-k2:1t-cloud` | ✅ Sí |
| Servidor TTS | - | http://localhost:8880 | ❌ No (opcional para audio) |

### Verificación del Sistema

```bash
# Node.js
node --version  # Debe mostrar v18.x.x o superior

# Ollama
ollama --version
ollama list | grep kimi-k2  # Debe mostrar kimi-k2:1t-cloud

# Servidor TTS (opcional)
curl http://localhost:8880/v1/audio/speech
```

## ⚙️ Configuración

### Configuración Básica

La configuración por defecto en `generate-quiz.js`:

```javascript
const CONFIG = {
    ollamaURL: 'http://localhost:11434',
    ollamaModel: 'kimi-k2:1t-cloud',
    ttsEndpoint: 'http://localhost:8880/v1/audio/speech',
    outputDir: '../public',
    audioDir: '../public/audios',
    configFile: '../public/test-sets-config.json'
};
```

### Personalizar Prompts

Los prompts están en `prompts/`:
- `science-quiz-prompt.txt` - Para quiz principal
- `vocabulary-prompt.txt` - Para vocabulario
- `definition-quiz-prompt.txt` - Para definiciones

Puedes editarlos para cambiar:
- Cantidad de preguntas
- Estilo de preguntas
- Nivel de dificultad
- Formato de explicaciones

## 📊 Proceso de Generación

### Flujo Completo

```
1. 📄 Parsear documento
   └─> Extraer texto de TXT/PDF/DOCX

2. 🤖 Conectar con Ollama
   └─> Verificar modelo kimi-k2:1t-cloud

3. 📚 Generar Science Quiz
   └─> 20-40 preguntas (multiple-choice + true/false)
   └─> 🎵 Generar audios

4. 📖 Generar Vocabulario
   └─> 10-20 palabras con emojis
   └─> 🎵 Generar audios (palabra + oración)

5. 🔍 Generar Definition Quiz
   └─> 10-20 definiciones
   └─> 🎵 Generar audios

6. ⚙️ Actualizar test-sets-config.json
   └─> Agregar nuevo test set

7. ✅ Completado
```

### Tiempos Estimados

| Tamaño del Documento | Sin Audio | Con Audio |
|---------------------|-----------|-----------|
| Pequeño (< 2000 palabras) | 3-5 min | 8-12 min |
| Mediano (2000-5000 palabras) | 5-10 min | 15-25 min |
| Grande (5000-10000 palabras) | 10-20 min | 30-45 min |

## 🎯 Casos de Uso

### Caso 1: Profesor creando examen de vocabulario

```bash
# Paso 1: Preparar lista de vocabulario en Word
# vocabulary-list.docx

# Paso 2: Generar solo vocabulario
node generate-quiz.js vocabulary-list.docx "Unit 5 Vocab" \
  --skip-science-quiz --skip-definition-quiz

# Paso 3: Usar en la aplicación
# Los estudiantes practican con el nuevo vocabulario
```

### Caso 2: Material de estudio completo

```bash
# Paso 1: Escanear y hacer OCR del capítulo del libro
# chapter3.pdf

# Paso 2: Generar todo
node generate-quiz.js chapter3.pdf "Chapter 3 - Archaeology"

# Paso 3: Los estudiantes tienen:
# - Quiz completo
# - Vocabulario
# - Definiciones
# - Todo con audio
```

### Caso 3: Revisión rápida sin audio

```bash
# Para validar contenido rápidamente
node generate-quiz.js notes.txt "Quick Review" --skip-audio

# Revisar los JSON generados
cat ../public/science-quiz-data-quick-review.json

# Si está bien, regenerar con audio
node generate-quiz.js notes.txt "Final Review"
```

## 📋 Opciones de Línea de Comando

| Opción | Descripción | Ejemplo |
|--------|-------------|---------|
| `--skip-audio` | No genera archivos de audio | `--skip-audio` |
| `--skip-science-quiz` | No genera science quiz | `--skip-science-quiz` |
| `--skip-vocabulary` | No genera vocabulario | `--skip-vocabulary` |
| `--skip-definition-quiz` | No genera definition quiz | `--skip-definition-quiz` |
| `--help` | Muestra ayuda | `--help` |

### Combinaciones Útiles

```bash
# Solo science quiz
node generate-quiz.js doc.pdf "Test" --skip-vocabulary --skip-definition-quiz

# Solo vocabulario con audio
node generate-quiz.js doc.pdf "Vocab" --skip-science-quiz --skip-definition-quiz

# Todo sin audio (rápido)
node generate-quiz.js doc.pdf "Test" --skip-audio

# Vocabulario sin audio
node generate-quiz.js doc.pdf "Vocab" --skip-science-quiz --skip-definition-quiz --skip-audio
```

## 🔍 Solución de Problemas

### Problemas Comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| "Failed to connect to Ollama" | Ollama no está corriendo | `ollama serve` |
| "Model not found" | Modelo no instalado | `ollama pull kimi-k2:1t-cloud` |
| "TTS server error" | Servidor TTS no disponible | Usar `--skip-audio` |
| "Invalid JSON" | Respuesta mal formateada | Se reintenta automáticamente |
| Proceso muy lento | Documento muy grande | Dividir en partes |

### Verificación de Servicios

```bash
# Verificar Ollama
curl http://localhost:11434/api/tags

# Verificar modelo
ollama list | grep kimi-k2

# Verificar TTS
curl -X POST http://localhost:8880/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"input":"test","voice":"af_alloy"}'
```

## 📚 Documentación Adicional

### Archivos de Documentación

- **[README.md](quiz-generator/README.md)** - Documentación completa y detallada
- **[QUICK_START.md](quiz-generator/QUICK_START.md)** - Guía de inicio rápido (5 minutos)
- **[GENERATOR_SETUP.md](GENERATOR_SETUP.md)** - Este archivo (overview general)

### Orden de Lectura Recomendado

1. 🚀 **QUICK_START.md** - Para empezar rápidamente
2. 📖 **README.md** - Para entender todo el sistema
3. 📋 **GENERATOR_SETUP.md** - Para referencia general

## 💡 Tips y Mejores Prácticas

### Preparación de Documentos

✅ **Bueno:**
- Documentos bien estructurados con títulos claros
- Contenido educativo con definiciones
- 1000-5000 palabras
- Formato limpio (TXT, PDF limpio, DOCX)

❌ **Evitar:**
- PDFs escaneados sin OCR
- Documentos con mucho ruido o formato
- Más de 10,000 palabras (dividir)
- Imágenes sin texto alternativo

### Nombres de Test Sets

✅ **Bueno:**
- "Biology Chapter 3"
- "Spanish Verbs Present"
- "Math Algebra Basics"

❌ **Evitar:**
- "Test #1!"
- "Quiz_2024/12"
- Caracteres especiales

### Workflow Recomendado

```bash
# 1. Testing rápido (sin audio)
node generate-quiz.js doc.pdf "Test" --skip-audio

# 2. Revisar JSON
cat ../public/science-quiz-data-test.json | jq . | less

# 3. Si está bien, generar versión final con audio
node generate-quiz.js doc.pdf "Final Name"

# 4. Verificar en la aplicación
open ../public/index.html
```

## 🎓 Estructura de Datos Generados

### science-quiz-data-{id}.json

```json
[
  {
    "exam": "Subject - Grade",
    "question": "Question text",
    "type": "multiple-choice",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Explanation",
    "questionES": "Spanish question",
    "explanationES": "Spanish explanation",
    "audioQuestion": "audios/english-q1-description.mp3"
  }
]
```

### vocabulary-data-{id}.json

```json
[
  {
    "word": "WORD",
    "spanish": "Palabra",
    "sentenceEN": "Example sentence.",
    "sentenceES": "Oración ejemplo.",
    "options": [
      {"emoji": "✅", "label": "Word", "isCorrect": true}
    ],
    "audioWord": "audios/word-word.mp3",
    "audioSentence": "audios/sentence-example.mp3"
  }
]
```

### definition-quiz-data-{id}.json

```json
[
  {
    "question": "This is a definition.",
    "correctAnswer": "WORD",
    "options": [
      {"word": "WORD", "emoji": "✅", "isCorrect": true}
    ],
    "audioQuestion": "audios/question-word.mp3"
  }
]
```

## 🚦 Inicio Rápido para Nuevos Usuarios

### 3 Comandos para Empezar

```bash
# 1. Instalar
cd quiz-generator && ./install.sh

# 2. Probar con ejemplo
node generate-quiz.js example-document.txt "My First Quiz"

# 3. Ver resultado
cat ../public/test-sets-config.json
```

### ¿Qué Sigue?

1. Lee [QUICK_START.md](quiz-generator/QUICK_START.md) para ejemplos prácticos
2. Genera tu primer quiz con tu propio documento
3. Revisa [README.md](quiz-generator/README.md) para personalización avanzada

## 📞 Soporte

### Antes de Pedir Ayuda

1. ✅ Revisa [Solución de Problemas](#-solución-de-problemas)
2. ✅ Verifica que todos los requisitos están instalados
3. ✅ Lee los mensajes de error completos
4. ✅ Intenta con el documento de ejemplo

### Reportar Problemas

Incluye:
- Comando exacto ejecutado
- Mensaje de error completo
- Versiones (`node --version`, `ollama --version`)
- Tamaño y tipo de documento

---

## 📄 Licencia

MIT

---

**Creado para simplificar la creación de contenido educativo con IA local**

**Última actualización:** 2025
