const fs = require('fs');
const path = require('path');

// Configuration
const QUIZ_DATA_FILE = path.join(__dirname, 'public', 'science-quiz-data-v3.json');
const AUDIO_DIR = path.join(__dirname, 'public', 'audios');
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
    console.log('✅ Created audios directory');
}

// Load quiz data
console.log('📖 Loading quiz data from science-quiz-data-v3.json...');
const quizData = JSON.parse(fs.readFileSync(QUIZ_DATA_FILE, 'utf8'));

// Function to strip HTML tags from text
function stripHtml(text) {
    return text.replace(/<[^>]*>/g, '');
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

// Generate all audio files for questions
async function generateAllAudios() {
    console.log('\n🎵 Starting audio generation for V3 (science-quiz-data-v3.json)...');
    console.log(`📁 Audio directory: ${AUDIO_DIR}`);
    console.log(`📊 Total items: ${quizData.length}`);

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < quizData.length; i++) {
        const item = quizData[i];

        // Skip reading sections
        if (item.type === 'reading') {
            console.log(`📖 [${i + 1}/${quizData.length}] Skipped reading section`);
            continue;
        }

        console.log(`\n--- [${i + 1}/${quizData.length}] ---`);

        // Generate audio for question (only if audioQuestion field exists)
        if (item.question && item.audioQuestion) {
            const questionText = stripHtml(item.question);
            const audioFilename = path.basename(item.audioQuestion);

            const result = await generateAudio(questionText, audioFilename);
            if (result) {
                if (fs.existsSync(path.join(AUDIO_DIR, audioFilename))) {
                    const fileSize = fs.statSync(path.join(AUDIO_DIR, audioFilename)).size;
                    if (fileSize > 0) {
                        successful++;
                        console.log(`   ✅ Question audio created (${fileSize} bytes)`);
                    } else {
                        failed++;
                        console.log(`   ❌ Question audio file is empty`);
                    }
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
