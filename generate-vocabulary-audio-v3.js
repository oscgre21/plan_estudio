const fs = require('fs');
const path = require('path');

// Configuration
const VOCABULARY_FILE = path.join(__dirname, 'public', 'vocabulary-dataV3.json');
const AUDIO_DIR = path.join(__dirname, 'public', 'audios');
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
    console.log('✅ Created audios directory');
}

// Load vocabulary data
console.log('📖 Loading vocabulary data from V3...');
const vocabularyData = JSON.parse(fs.readFileSync(VOCABULARY_FILE, 'utf8'));

// Function to sanitize filename
function sanitizeFilename(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60);
}

// Function to generate audio using TTS endpoint
async function generateAudio(text, filename) {
    const filepath = path.join(AUDIO_DIR, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
        console.log(`⏭️  Skipped (exists): ${filename}`);
        return true;
    }

    try {
        console.log(`🎵 Generating: ${filename}`);

        const response = await fetch(TTS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: text,
                voice: "af_alloy",
                response_format: "mp3",
                download_format: "mp3",
                stream: true,
                speed: 1,
                return_download_link: true
            })
        });

        if (!response.ok) {
            throw new Error(`TTS server error: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(filepath, buffer);
        console.log(`✅ Generated: ${filename} (${buffer.length} bytes)`);

        return true;
    } catch (error) {
        console.error(`❌ Error generating ${filename}:`, error.message);
        return false;
    }
}

// Generate all audio files
async function generateAllAudios() {
    console.log('\n🎵 Starting audio generation for Vocabulary V3...');
    console.log(`📁 Audio directory: ${AUDIO_DIR}`);
    console.log(`📊 Total vocabulary words: ${vocabularyData.length}`);

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < vocabularyData.length; i++) {
        const item = vocabularyData[i];

        console.log(`\n--- [${i + 1}/${vocabularyData.length}] ${item.word} ---`);

        // Generate audio for word
        if (item.audioWord) {
            const wordFilename = path.basename(item.audioWord);
            const wordResult = await generateAudio(item.word, wordFilename);
            if (wordResult) {
                if (fs.existsSync(path.join(AUDIO_DIR, wordFilename)) &&
                    fs.statSync(path.join(AUDIO_DIR, wordFilename)).size > 0) {
                    successful++;
                } else {
                    skipped++;
                }
            } else {
                failed++;
            }

            // Small delay to avoid overwhelming the TTS server
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Generate audio for sentence
        if (item.audioSentence) {
            const sentenceFilename = path.basename(item.audioSentence);
            const sentenceResult = await generateAudio(item.sentenceEN, sentenceFilename);
            if (sentenceResult) {
                if (fs.existsSync(path.join(AUDIO_DIR, sentenceFilename)) &&
                    fs.statSync(path.join(AUDIO_DIR, sentenceFilename)).size > 0) {
                    successful++;
                } else {
                    skipped++;
                }
            } else {
                failed++;
            }

            // Small delay to avoid overwhelming the TTS server
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Generation Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successful}`);
    console.log(`⏭️  Skipped (already exists): ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📁 Audio directory: ${AUDIO_DIR}`);
    console.log('='.repeat(60));
}

// Run the generation
generateAllAudios()
    .then(() => {
        console.log('\n✅ All done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
