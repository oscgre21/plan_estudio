const fs = require('fs');
const path = require('path');

// Files to process
const FILES = [
    path.join(__dirname, 'public', 'science-quiz-data.json'),
    path.join(__dirname, 'public', 'science-quiz-data_V2.json')
];

const AUDIO_DIR = path.join(__dirname, 'public', 'audios');
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Function to strip HTML tags from text
function stripHtml(text) {
    return text
        .replace(/<h3>/g, '\n')
        .replace(/<\/h3>/g, '\n')
        .replace(/<p>/g, '\n')
        .replace(/<\/p>/g, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/\n\n+/g, '\n\n')
        .trim();
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
        console.log(`   Text length: ${text.length} characters`);

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

// Main function
async function generateAllReadingAudios() {
    console.log('='.repeat(60));
    console.log('🎵 Starting audio generation for reading sections...');
    console.log('='.repeat(60));

    let totalSuccessful = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const filePath of FILES) {
        console.log(`\n📖 Processing: ${path.basename(filePath)}`);

        const quizData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (let i = 0; i < quizData.length; i++) {
            const item = quizData[i];

            if (item.type === 'reading' && item.audioContent) {
                console.log(`\n--- Reading Section [${i + 1}] ---`);

                const contentText = stripHtml(item.content);
                const audioFilename = path.basename(item.audioContent);

                const result = await generateAudio(contentText, audioFilename);

                if (result) {
                    if (fs.existsSync(path.join(AUDIO_DIR, audioFilename))) {
                        const fileSize = fs.statSync(path.join(AUDIO_DIR, audioFilename)).size;
                        if (fileSize > 0) {
                            totalSuccessful++;
                        } else {
                            totalSkipped++;
                        }
                    }
                } else {
                    totalFailed++;
                }

                // Longer delay for reading sections (they're longer texts)
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Audio Generation Summary:');
    console.log(`✅ Successful: ${totalSuccessful}`);
    console.log(`⏭️  Skipped (already exist): ${totalSkipped}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log('='.repeat(60));
}

// Execute
generateAllReadingAudios().then(() => {
    console.log('\n✨ All done! Reading section audios generated!');
}).catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
