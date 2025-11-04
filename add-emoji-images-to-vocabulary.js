const fs = require('fs');
const path = require('path');

// Configuración
const VOCABULARY_FILE = path.join(__dirname, 'public', 'vocabulary-dataV3.json');

// Función para obtener el codepoint de un emoji
function getEmojiCodepoint(emoji) {
    if (!emoji) return null;

    // Convertir emoji a codepoints (puede ser múltiple para emojis compuestos)
    const codepoints = [];
    for (let i = 0; i < emoji.length; i++) {
        const code = emoji.codePointAt(i);
        if (code) {
            // Filtrar variation selectors (FE0E, FE0F) - no son necesarios para Twemoji
            if (code !== 0xFE0E && code !== 0xFE0F) {
                codepoints.push(code.toString(16));
            }
            // Skip the next character if it's a surrogate pair
            if (code > 0xFFFF) i++;
        }
    }

    return codepoints.join('-');
}

// Función para obtener la URL de imagen de Twemoji
function getTwemojiUrl(emoji) {
    if (!emoji) return null;

    const codepoint = getEmojiCodepoint(emoji);
    if (!codepoint) return null;

    // Twemoji CDN URL usando jdecked/twemoji (fork mantenido activamente)
    // 72x72 es buen tamaño, también disponible: svg, 16x16, 36x36
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codepoint}.png`;
}

// Función para obtener el emoji de una palabra
function getWordEmoji(wordData) {
    // Buscar el emoji correcto (el de la opción correcta)
    if (wordData.options && wordData.options.length > 0) {
        const correctOption = wordData.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption.emoji) {
            return correctOption.emoji;
        }
        // Si no hay correcta, usar la primera
        return wordData.options[0].emoji;
    }
    return null;
}

// Cargar vocabulario
console.log('📖 Cargando vocabulary-dataV3.json...');
const vocabularyData = JSON.parse(fs.readFileSync(VOCABULARY_FILE, 'utf8'));

console.log(`📊 Total de palabras: ${vocabularyData.length}\n`);

let successful = 0;
let skipped = 0;
let failed = 0;

// Procesar cada palabra
vocabularyData.forEach((wordData, index) => {
    const word = wordData.word;
    console.log(`[${index + 1}/${vocabularyData.length}] ${word}`);

    // Obtener el emoji de la palabra
    const emoji = getWordEmoji(wordData);

    if (!emoji) {
        console.log(`  ⚠️  No se encontró emoji para: ${word}`);
        failed++;
        return;
    }

    // Agregar emoji a wordData si no existe
    if (!wordData.wordEmoji) {
        wordData.wordEmoji = emoji;
    }

    // Generar URL de Twemoji
    const imageUrl = getTwemojiUrl(emoji);

    if (imageUrl) {
        wordData.wordEmojiImage = imageUrl;
        console.log(`  ✅ ${emoji} -> ${imageUrl}`);
        successful++;
    } else {
        console.log(`  ❌ No se pudo generar URL para emoji: ${emoji}`);
        failed++;
    }
});

// Guardar JSON actualizado
console.log('\n💾 Guardando cambios...');
fs.writeFileSync(
    VOCABULARY_FILE,
    JSON.stringify(vocabularyData, null, 2),
    'utf8'
);

console.log('\n' + '='.repeat(60));
console.log('📊 Resumen:');
console.log('='.repeat(60));
console.log(`✅ URLs generadas: ${successful}`);
console.log(`⏭️  Sin cambios: ${skipped}`);
console.log(`❌ Fallidas: ${failed}`);
console.log(`📄 JSON actualizado: ${VOCABULARY_FILE}`);
console.log('='.repeat(60));
console.log('\n✅ Proceso completado!');
