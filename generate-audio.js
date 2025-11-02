const fs = require('fs');
const path = require('path');
const https = require('http');

// Configuration
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';
const AUDIO_DIR = path.join(__dirname, 'public', 'audios');
const VOCABULARY_FILE = path.join(__dirname, 'public', 'vocabulary-data.json');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
    console.log('✅ Created audios directory');
}

// Function to sanitize filename
function sanitizeFilename(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
}

// Function to generate audio using TTS endpoint
async function generateAudio(text, filename) {
    const filepath = path.join(AUDIO_DIR, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
        console.log(`⏭️  Skipped (exists): ${filename}`);
        return filepath;
    }

    try {
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(filepath, buffer);
        console.log(`✅ Generated: ${filename}`);

        return filepath;
    } catch (error) {
        console.error(`❌ Failed to generate ${filename}:`, error.message);
        return null;
    }
}

// Main function
async function main() {
    console.log('🎵 Starting audio generation for Visual Word Game...\n');

    // Load vocabulary data
    const vocabularyData = JSON.parse(fs.readFileSync(VOCABULARY_FILE, 'utf8'));
    console.log(`📚 Loaded ${vocabularyData.length} vocabulary words\n`);

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    // Process each word
    for (let i = 0; i < vocabularyData.length; i++) {
        const word = vocabularyData[i];
        console.log(`\n[${i + 1}/${vocabularyData.length}] Processing: ${word.word}`);

        // Generate audio for the word
        const wordFilename = `word-${sanitizeFilename(word.word)}.mp3`;
        const wordPath = await generateAudio(word.word, wordFilename);

        if (wordPath) {
            word.audioWord = `audios/${wordFilename}`;
            if (fs.existsSync(wordPath)) {
                const stats = fs.statSync(wordPath);
                if (stats.size > 0) {
                    successCount++;
                } else {
                    skipCount++;
                }
            } else {
                skipCount++;
            }
        } else {
            failCount++;
        }

        // Small delay to avoid overwhelming the TTS service
        await new Promise(resolve => setTimeout(resolve, 100));

        // Generate audio for the sentence
        const sentenceFilename = `sentence-${sanitizeFilename(word.sentenceEN)}.mp3`;
        const sentencePath = await generateAudio(word.sentenceEN, sentenceFilename);

        if (sentencePath) {
            word.audioSentence = `audios/${sentenceFilename}`;
            if (fs.existsSync(sentencePath)) {
                const stats = fs.statSync(sentencePath);
                if (stats.size > 0) {
                    successCount++;
                } else {
                    skipCount++;
                }
            } else {
                skipCount++;
            }
        } else {
            failCount++;
        }

        // Small delay between words
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Save updated vocabulary data with audio paths
    fs.writeFileSync(
        VOCABULARY_FILE,
        JSON.stringify(vocabularyData, null, 2),
        'utf8'
    );

    console.log('\n\n' + '='.repeat(50));
    console.log('🎉 Audio Generation Complete!');
    console.log('='.repeat(50));
    console.log(`✅ Successfully generated: ${successCount} audios`);
    console.log(`⏭️  Skipped (already exist): ${skipCount} audios`);
    console.log(`❌ Failed: ${failCount} audios`);
    console.log(`📁 Audio files location: ${AUDIO_DIR}`);
    console.log(`📝 Updated vocabulary file: ${VOCABULARY_FILE}`);
    console.log('='.repeat(50));
}

// Run the script
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
