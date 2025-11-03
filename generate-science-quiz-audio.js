const fs = require('fs');
const path = require('path');

// Configuration
const QUIZ_DATA_FILE = path.join(__dirname, 'public', 'science-quiz-data.json');
const AUDIO_DIR = path.join(__dirname, 'public', 'audios');
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
    console.log('✅ Created audios directory');
}

// Load quiz data
console.log('📖 Loading quiz data...');
const quizData = JSON.parse(fs.readFileSync(QUIZ_DATA_FILE, 'utf8'));

// Function to sanitize filename
function sanitizeFilename(text) {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
}

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

// Function to update quiz data with audio filenames
function updateQuizDataWithAudio(audioMap) {
    console.log('\n📝 Updating quiz data with audio filenames...');

    const updatedData = quizData.map((item, index) => {
        if (item.type === 'reading') {
            return item; // Skip reading sections
        }

        const questionAudio = audioMap.questions[index];
        const explanationAudio = audioMap.explanations[index];

        return {
            ...item,
            audioQuestion: questionAudio ? `audios/${questionAudio}` : undefined,
            audioExplanation: explanationAudio ? `audios/${explanationAudio}` : undefined
        };
    });

    fs.writeFileSync(QUIZ_DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf8');
    console.log('✅ Quiz data updated with audio filenames');
}

// Generate all audio files
async function generateAllAudios() {
    console.log('\n🎵 Starting audio generation...');
    console.log(`📁 Audio directory: ${AUDIO_DIR}`);
    console.log(`📊 Total items: ${quizData.length}`);

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    const audioMap = {
        questions: {},
        explanations: {}
    };

    for (let i = 0; i < quizData.length; i++) {
        const item = quizData[i];

        // Skip reading sections
        if (item.type === 'reading') {
            console.log(`📖 [${i + 1}/${quizData.length}] Skipped reading section`);
            continue;
        }

        console.log(`\n--- [${i + 1}/${quizData.length}] ---`);

        // Generate audio for question
        if (item.question) {
            const questionText = stripHtml(item.question);
            const questionFilename = `science-q${i + 1}-${sanitizeFilename(questionText)}.mp3`;
            audioMap.questions[i] = questionFilename;

            const questionResult = await generateAudio(questionText, questionFilename);
            if (questionResult) {
                if (fs.existsSync(path.join(AUDIO_DIR, questionFilename))) {
                    if (fs.statSync(path.join(AUDIO_DIR, questionFilename)).size > 0) {
                        successful++;
                    } else {
                        skipped++;
                    }
                }
            } else {
                failed++;
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Generate audio for explanation
        if (item.explanation) {
            const explanationText = stripHtml(item.explanation);
            const explanationFilename = `science-e${i + 1}-${sanitizeFilename(explanationText)}.mp3`;
            audioMap.explanations[i] = explanationFilename;

            const explanationResult = await generateAudio(explanationText, explanationFilename);
            if (explanationResult) {
                if (fs.existsSync(path.join(AUDIO_DIR, explanationFilename))) {
                    if (fs.statSync(path.join(AUDIO_DIR, explanationFilename)).size > 0) {
                        successful++;
                    } else {
                        skipped++;
                    }
                }
            } else {
                failed++;
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    console.log('\n📊 Audio Generation Summary:');
    console.log(`✅ Successful: ${successful}`);
    console.log(`⏭️  Skipped (already exist): ${skipped}`);
    console.log(`❌ Failed: ${failed}`);

    // Update quiz data with audio filenames
    updateQuizDataWithAudio(audioMap);
}

// Execute audio generation
console.log('='.repeat(60));
generateAllAudios().then(() => {
    console.log('\n✨ All done! Audio files generated and quiz data updated!');
    console.log('='.repeat(60));
}).catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
