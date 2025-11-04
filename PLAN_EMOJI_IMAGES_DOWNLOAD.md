# Plan: Descargar Imágenes de Emojis desde Emojiall.com

## Objetivo
Crear un script automatizado que:
1. Busque cada palabra del vocabulario en https://www.emojiall.com/es/search_results
2. Descargue una imagen del emoji correspondiente
3. Guarde las imágenes en una carpeta del proyecto
4. Actualice el JSON con las rutas de las imágenes

## Análisis de la URL

### Estructura de Búsqueda
```
https://www.emojiall.com/es/search_results?keywords=TOMB
https://www.emojiall.com/es/search_results?keywords=POMPEII
https://www.emojiall.com/es/search_results?keywords=SITE
```

### Parámetros
- **Base URL**: `https://www.emojiall.com/es/search_results`
- **Query Param**: `keywords={PALABRA}`

## Estructura del Proyecto

### Carpetas a Crear
```
public/
  emoji-images/          <- Nueva carpeta para imágenes
    tomb.png
    pompeii.png
    site.png
    ...
```

### Archivo JSON Actualizado
```json
{
  "word": "TOMB",
  "wordEmoji": "⚰️",
  "wordEmojiImage": "emoji-images/tomb.png",  // <- NUEVO
  "spanish": "Tumba",
  ...
}
```

## Implementación

### Script: `download-emoji-images.js`

```javascript
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuración
const VOCABULARY_FILE = path.join(__dirname, 'public', 'vocabulary-dataV3.json');
const EMOJI_IMAGES_DIR = path.join(__dirname, 'public', 'emoji-images');
const BASE_URL = 'https://www.emojiall.com/es/search_results';

// Crear carpeta si no existe
if (!fs.existsSync(EMOJI_IMAGES_DIR)) {
    fs.mkdirSync(EMOJI_IMAGES_DIR, { recursive: true });
}

// Cargar vocabulario
const vocabularyData = JSON.parse(fs.readFileSync(VOCABULARY_FILE, 'utf8'));

// Función para sanitizar nombre de archivo
function sanitizeFilename(word) {
    return word.toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Función para hacer request HTTP
async function fetchPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Función para extraer URL de imagen del HTML
function extractEmojiImageUrl(html) {
    // Buscar la primera imagen de emoji en los resultados
    // Patrón típico: <img src="https://...emoji.png" ...>

    // Opción 1: Buscar imagen con clase específica
    const imgRegex1 = /<img[^>]*class="[^"]*emoji[^"]*"[^>]*src="([^"]+)"/i;

    // Opción 2: Buscar cualquier imagen PNG en CDN
    const imgRegex2 = /src="(https:\/\/[^"]*emoji[^"]*\.png)"/i;

    // Opción 3: Buscar imagen en la lista de resultados
    const imgRegex3 = /<img[^>]*src="(https:\/\/[^"]+\.png)"[^>]*alt="[^"]*emoji/i;

    let match = html.match(imgRegex1) || html.match(imgRegex2) || html.match(imgRegex3);

    if (match && match[1]) {
        return match[1];
    }

    return null;
}

// Función para descargar imagen
async function downloadImage(imageUrl, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const client = imageUrl.startsWith('https') ? https : http;

        client.get(imageUrl, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

// Función principal para procesar una palabra
async function processWord(wordData, index, total) {
    const word = wordData.word;
    const filename = sanitizeFilename(word) + '.png';
    const filepath = path.join(EMOJI_IMAGES_DIR, filename);

    console.log(`\n[${index + 1}/${total}] Procesando: ${word}`);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
        console.log(`  ⏭️  Ya existe: ${filename}`);
        return `emoji-images/${filename}`;
    }

    try {
        // 1. Buscar en emojiall.com
        const searchUrl = `${BASE_URL}?keywords=${encodeURIComponent(word)}`;
        console.log(`  🔍 Buscando: ${searchUrl}`);

        const html = await fetchPage(searchUrl);

        // 2. Extraer URL de imagen
        const imageUrl = extractEmojiImageUrl(html);

        if (!imageUrl) {
            console.log(`  ❌ No se encontró imagen para: ${word}`);
            return null;
        }

        console.log(`  📸 Imagen encontrada: ${imageUrl}`);

        // 3. Descargar imagen
        await downloadImage(imageUrl, filepath);
        console.log(`  ✅ Descargada: ${filename}`);

        // Pequeño delay para no sobrecargar el servidor
        await new Promise(resolve => setTimeout(resolve, 1000));

        return `emoji-images/${filename}`;

    } catch (error) {
        console.error(`  ❌ Error procesando ${word}:`, error.message);
        return null;
    }
}

// Función principal
async function main() {
    console.log('🚀 Iniciando descarga de imágenes de emojis...\n');
    console.log(`📁 Directorio de destino: ${EMOJI_IMAGES_DIR}`);
    console.log(`📊 Total de palabras: ${vocabularyData.length}\n`);

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    // Procesar cada palabra
    for (let i = 0; i < vocabularyData.length; i++) {
        const wordData = vocabularyData[i];
        const imagePath = await processWord(wordData, i, vocabularyData.length);

        if (imagePath) {
            // Actualizar JSON con la ruta de la imagen
            wordData.wordEmojiImage = imagePath;

            if (fs.existsSync(path.join(__dirname, 'public', imagePath))) {
                successful++;
            } else {
                skipped++;
            }
        } else {
            failed++;
        }
    }

    // Guardar JSON actualizado
    fs.writeFileSync(
        VOCABULARY_FILE,
        JSON.stringify(vocabularyData, null, 2),
        'utf8'
    );

    console.log('\n' + '='.repeat(60));
    console.log('📊 Resumen:');
    console.log('='.repeat(60));
    console.log(`✅ Exitosas: ${successful}`);
    console.log(`⏭️  Existentes: ${skipped}`);
    console.log(`❌ Fallidas: ${failed}`);
    console.log(`📁 Carpeta: ${EMOJI_IMAGES_DIR}`);
    console.log(`📄 JSON actualizado: ${VOCABULARY_FILE}`);
    console.log('='.repeat(60));
}

// Ejecutar
main()
    .then(() => {
        console.log('\n✅ Proceso completado!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Error fatal:', error);
        process.exit(1);
    });
```

## Consideraciones Importantes

### 1. Web Scraping
- ⚠️ **Legalidad**: Verificar términos de servicio de emojiall.com
- ⚠️ **Rate Limiting**: Incluir delays entre requests (1 segundo)
- ⚠️ **User Agent**: Puede ser necesario agregar headers

### 2. Extracción de Imágenes
- La estructura HTML puede cambiar
- Necesitamos patterns flexibles para encontrar imágenes
- Backup: Si no encuentra imagen, usar emoji Unicode actual

### 3. Alternativas

#### Opción A: Usar API de Emoji (si existe)
Algunas páginas tienen APIs públicas

#### Opción B: Usar CDN de Emojis
```javascript
// Twemoji (Twitter Emoji)
https://cdn.jsdelivr.net/npm/twemoji@latest/dist/72x72/{codepoint}.png

// Noto Emoji (Google)
https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/128/emoji_u{codepoint}.png
```

#### Opción C: Emojipedia
```
https://emojipedia.org/{emoji-name}
```

### 4. Mejora: Mapeo Manual
Para palabras difíciles, crear un mapeo manual:

```javascript
const EMOJI_MAPPING = {
    'TOMB': 'coffin',      // ⚰️
    'POMPEII': 'volcano',  // 🌋
    'THE SPHINX': 'statue', // 🗿
    'OLYMPICS': 'medal',   // 🏅
    // ...
};
```

## Modificación del HTML para Usar Imágenes

### En `vocabulary_trainer.html` o similar:

```javascript
// Antes (usando emoji Unicode)
optionDiv.innerHTML = `
    <div class="option-emoji">${emoji}</div>
    <div class="option-word">${word}</div>
`;

// Después (usando imagen)
const emojiHTML = wordData.wordEmojiImage
    ? `<img src="${wordData.wordEmojiImage}" class="option-emoji-img" alt="${word}"/>`
    : `<div class="option-emoji">${emoji}</div>`;

optionDiv.innerHTML = `
    ${emojiHTML}
    <div class="option-word">${word}</div>
`;
```

### CSS para las imágenes:

```css
.option-emoji-img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    margin-bottom: 10px;
}
```

## Flujo de Trabajo

1. ✅ Crear script `download-emoji-images.js`
2. ✅ Ejecutar: `node download-emoji-images.js`
3. ✅ Verificar imágenes en `public/emoji-images/`
4. ✅ Verificar JSON actualizado con `wordEmojiImage`
5. ✅ Modificar HTML/CSS para usar imágenes
6. ✅ Probar en navegador

## Ventajas

✅ Imágenes de alta calidad
✅ Consistencia visual
✅ Mejor rendimiento (cache)
✅ Offline support
✅ Control total del diseño

## Desventajas

⚠️ Requiere web scraping
⚠️ Mantenimiento de imágenes
⚠️ Tamaño del proyecto aumenta
⚠️ Dependencia de sitio externo

## ¿Proceder?

Si apruebas este plan, crearé el script y lo ejecutaremos.

**Alternativa Recomendada**: Usar CDN de emojis (Twemoji) en lugar de scraping.
