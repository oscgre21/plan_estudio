# 🚀 Guía de Inicio Rápido - Generador de Quiz

## En 5 Minutos

### 1️⃣ Instalación (primera vez)

```bash
cd quiz-generator
./install.sh
```

El script verificará e instalará todo lo necesario automáticamente.

### 2️⃣ Preparar tu documento

Coloca tu documento de estudio en cualquier formato:
- `mi-documento.txt`
- `mi-documento.pdf`
- `mi-documento.docx`

### 3️⃣ Generar el quiz

```bash
node generate-quiz.js mi-documento.pdf "Mi Primer Quiz"
```

### 4️⃣ ¡Listo!

Los archivos se generan en `../public/`:
- `science-quiz-data-mi-primer-quiz.json`
- `vocabulary-data-mi-primer-quiz.json`
- `definition-quiz-data-mi-primer-quiz.json`
- `test-sets-config.json` (actualizado)
- Archivos de audio en `../public/audios/`

---

## Ejemplos Comunes

### Generar desde un PDF
```bash
node generate-quiz.js study-notes.pdf "Biology Chapter 3"
```

### Generar sin audio (más rápido)
```bash
node generate-quiz.js study-notes.pdf "Quick Test" --skip-audio
```

### Generar solo vocabulario
```bash
node generate-quiz.js vocab-list.txt "Spanish Words" --skip-science-quiz --skip-definition-quiz
```

### Probar con el documento de ejemplo
```bash
node generate-quiz.js example-document.txt "Example Quiz"
```

---

## Verificación Rápida

### ¿Ollama está corriendo?
```bash
curl http://localhost:11434/api/tags
```

### ¿Tengo el modelo?
```bash
ollama list | grep kimi-k2
```

### ¿TTS está corriendo?
```bash
curl http://localhost:8880/v1/audio/speech
```

---

## Si algo falla

### Ollama no está corriendo
```bash
ollama serve
```

### Modelo no instalado
```bash
ollama pull kimi-k2:1t-cloud
```

### Sin servidor TTS
```bash
# Genera sin audio temporalmente
node generate-quiz.js documento.pdf "Test" --skip-audio
```

---

## Opciones Útiles

| Opción | Descripción |
|--------|-------------|
| `--skip-audio` | No genera archivos de audio |
| `--skip-science-quiz` | No genera science quiz |
| `--skip-vocabulary` | No genera vocabulario |
| `--skip-definition-quiz` | No genera definition quiz |
| `--help` | Muestra ayuda |

---

## Estructura de Comando

```bash
node generate-quiz.js [DOCUMENTO] [NOMBRE] [OPCIONES]
```

**Ejemplos:**
```bash
# Mínimo (nombre se toma del archivo)
node generate-quiz.js notes.pdf

# Con nombre personalizado
node generate-quiz.js notes.pdf "My Custom Name"

# Con opciones
node generate-quiz.js notes.pdf "Test" --skip-audio
```

---

## Workflow Típico

### Primera Generación (Testing)
```bash
# 1. Generar sin audio para ver el contenido rápido
node generate-quiz.js documento.pdf "Test" --skip-audio

# 2. Revisar los JSON generados
cat ../public/science-quiz-data-test.json | jq .

# 3. Si está bien, regenerar con audio
node generate-quiz.js documento.pdf "Test Final"
```

### Producción
```bash
# Generación completa con todo
node generate-quiz.js documento-final.pdf "Exam Name"
```

---

## Troubleshooting de 30 Segundos

| Problema | Solución |
|----------|----------|
| "Failed to connect to Ollama" | `ollama serve` |
| "Model not found" | `ollama pull kimi-k2:1t-cloud` |
| "TTS server error" | Usar `--skip-audio` |
| Proceso muy lento | Documento muy grande, dividirlo |
| JSON inválido | El modelo reintenta automáticamente 3 veces |

---

## Tips Rápidos

✅ **DO:**
- Usa documentos de 1000-5000 palabras
- Divide documentos grandes
- Primero genera sin audio para validar
- Usa nombres descriptivos sin caracteres especiales

❌ **DON'T:**
- No uses documentos de más de 10,000 palabras
- No uses caracteres especiales en nombres (#, /, \, etc.)
- No interrumpas el proceso (puede tomar 5-15 minutos)

---

## Siguiente Paso

Lee el [README.md](README.md) completo para:
- Configuración avanzada
- Personalización de prompts
- Estructura detallada de archivos
- Solución de problemas avanzada

---

**¿Necesitas ayuda?** Revisa la sección [Solución de Problemas](README.md#-solución-de-problemas) en el README.
