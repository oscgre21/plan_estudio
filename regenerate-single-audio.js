const fs = require('fs');
const path = require('path');

// Configuration
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';
const AUDIO_DIR = path.join(__dirname, 'public', 'audios');

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
async function generateAudio(text, filename, forceRegenerate = true) {
    const filepath = path.join(AUDIO_DIR, filename);

    // Delete existing file if force regenerate
    if (forceRegenerate && fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`🗑️  Deleted existing: ${filename}`);
    }

    try {
        console.log(`🎵 Generating audio for: "${text}"`);

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
        console.log(`✅ Generated: ${filename} (${buffer.length} bytes)`);

        return filepath;
    } catch (error) {
        console.error(`❌ Failed to generate ${filename}:`, error.message);
        return null;
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node regenerate-single-audio.js "TEXT_TO_SPEAK" [filename.mp3]');
        console.log('');
        console.log('Examples:');
        console.log('  node regenerate-single-audio.js "LOCATION"');
        console.log('  node regenerate-single-audio.js "LOCATION" word-location.mp3');
        console.log('  node regenerate-single-audio.js "The location is important" sentence-location-is-important.mp3');
        process.exit(1);
    }

    const textToSpeak = args[0];
    let filename = args[1];

    // Generate filename if not provided
    if (!filename) {
        filename = `word-${sanitizeFilename(textToSpeak)}.mp3`;
    }

    console.log('🎵 Starting single audio regeneration...\n');
    console.log(`📝 Text: "${textToSpeak}"`);
    console.log(`📁 Filename: ${filename}\n`);

    const result = await generateAudio(textToSpeak, filename, true);

    console.log('\n' + '='.repeat(50));
    if (result) {
        console.log('🎉 Audio Regeneration Complete!');
        console.log(`📁 File location: ${result}`);
    } else {
        console.log('❌ Audio Regeneration Failed!');
    }
    console.log('='.repeat(50));
}

// Run the script
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
