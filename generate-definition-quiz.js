const fs = require('fs');
const path = require('path');

// Configuration
const VOCABULARY_FILE = path.join(__dirname, 'public', 'vocabulary-data.json');
const OUTPUT_FILE = path.join(__dirname, 'public', 'definition-quiz-data.json');
const AUDIO_DIR = path.join(__dirname, 'public', 'audios');
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';

// Load vocabulary data
console.log('📖 Loading vocabulary data...');
const vocabularyData = JSON.parse(fs.readFileSync(VOCABULARY_FILE, 'utf8'));

// Function to get the first sentence from explanation (English part only)
// and replace the word with "this" or appropriate pronoun
function extractQuestionFromExplanation(explanation, word) {
    // Split by period to get first sentence
    const sentences = explanation.split('.');
    let englishSentence = sentences[0].trim();

    // If explanation contains both English and Spanish, take only English part
    if (englishSentence.includes('Un ') || englishSentence.includes('Una ')) {
        // Split by common Spanish starters
        englishSentence = englishSentence.split(/\s+Un\s+/)[0];
        englishSentence = englishSentence.split(/\s+Una\s+/)[0];
        englishSentence = englishSentence.split(/\s+El\s+/)[0];
        englishSentence = englishSentence.split(/\s+La\s+/)[0];
        englishSentence = englishSentence.split(/\s+Los\s+/)[0];
        englishSentence = englishSentence.split(/\s+Las\s+/)[0];
    }

    // Replace the word and its variations with "This" at the start of sentence
    const wordLower = word.toLowerCase();
    const wordCapital = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    // Pattern: "A [word] is" or "An [word] is" -> "This is"
    englishSentence = englishSentence.replace(
        new RegExp(`^(A|An)\\s+${wordLower}\\s+is`, 'i'),
        'This is'
    );
    englishSentence = englishSentence.replace(
        new RegExp(`^(A|An)\\s+${wordCapital}\\s+is`, 'i'),
        'This is'
    );

    // Pattern: "A [word]" or "An [word]" anywhere -> "something" or "it"
    englishSentence = englishSentence.replace(
        new RegExp(`\\b(a|an)\\s+${wordLower}\\b`, 'gi'),
        'it'
    );

    // Pattern: "The [word]" -> "This"
    englishSentence = englishSentence.replace(
        new RegExp(`\\bThe\\s+${wordLower}\\b`, 'gi'),
        'This'
    );
    englishSentence = englishSentence.replace(
        new RegExp(`\\bthe\\s+${wordLower}\\b`, 'gi'),
        'this'
    );

    // Remove standalone word occurrences (case insensitive)
    englishSentence = englishSentence.replace(
        new RegExp(`\\b${wordLower}\\b`, 'gi'),
        'it'
    );
    englishSentence = englishSentence.replace(
        new RegExp(`\\b${wordCapital}\\b`, 'g'),
        'It'
    );

    return englishSentence.trim() + '.';
}

// Function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to get random words excluding the current word
function getRandomWords(currentIndex, count) {
    const availableIndices = vocabularyData
        .map((_, idx) => idx)
        .filter(idx => idx !== currentIndex);

    const shuffled = shuffleArray(availableIndices);
    return shuffled.slice(0, count);
}

// Function to get emoji from options
function getEmojiForWord(word) {
    const correctOption = word.options.find(opt => opt.isCorrect);
    return correctOption ? correctOption.emoji : '❓';
}

// Generate quiz data
console.log('🎮 Generating quiz questions...');
const quizData = vocabularyData.map((word, index) => {
    const question = extractQuestionFromExplanation(word.explanation, word.word);

    // Get 3 random wrong answers
    const wrongIndices = getRandomWords(index, 3);

    // Create options array
    const options = [
        {
            word: word.word,
            emoji: getEmojiForWord(word),
            isCorrect: true
        },
        ...wrongIndices.map(idx => ({
            word: vocabularyData[idx].word,
            emoji: getEmojiForWord(vocabularyData[idx]),
            isCorrect: false
        }))
    ];

    // Shuffle options
    const shuffledOptions = shuffleArray(options);

    // Generate audio filename
    const audioFilename = `question-${word.word.toLowerCase()}.mp3`;

    return {
        question: question,
        audioQuestion: `audios/${audioFilename}`,
        correctAnswer: word.word,
        options: shuffledOptions
    };
});

// Save quiz data
console.log('💾 Saving quiz data...');
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(quizData, null, 2), 'utf8');
console.log(`✅ Quiz data saved to: ${OUTPUT_FILE}`);
console.log(`📊 Generated ${quizData.length} questions`);

// Function to generate audio for a question
async function generateAudio(text, filename) {
    try {
        const filepath = path.join(AUDIO_DIR, filename);

        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`⏭️  Skipped (exists): ${filename}`);
            return true;
        }

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
    console.log('\n🎵 Starting audio generation...');
    console.log(`📁 Audio directory: ${AUDIO_DIR}`);

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < quizData.length; i++) {
        const item = quizData[i];
        const filename = item.audioQuestion.split('/').pop();

        const filepath = path.join(AUDIO_DIR, filename);
        if (fs.existsSync(filepath)) {
            skipped++;
            console.log(`⏭️  [${i + 1}/${quizData.length}] Skipped (exists): ${filename}`);
            continue;
        }

        console.log(`🎵 [${i + 1}/${quizData.length}] Generating: ${filename}`);
        const result = await generateAudio(item.question, filename);

        if (result) {
            successful++;
        } else {
            failed++;
        }

        // Add small delay to avoid overwhelming the TTS server
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n📊 Audio Generation Summary:');
    console.log(`✅ Successful: ${successful}`);
    console.log(`⏭️  Skipped (already exist): ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📁 Total: ${quizData.length}`);
}

// Execute audio generation
console.log('\n' + '='.repeat(60));
generateAllAudios().then(() => {
    console.log('\n✨ All done! Quiz data and audio files generated successfully!');
    console.log('='.repeat(60));
}).catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
