const fs = require('fs');
const path = require('path');

// Configuration
const QUIZ_DATA_FILE = path.join(__dirname, 'public', 'science-quiz-data_V2.json');

// Load quiz data
console.log('📖 Loading quiz data from science-quiz-data_V2.json...');
const quizData = JSON.parse(fs.readFileSync(QUIZ_DATA_FILE, 'utf8'));

// Function to create slug from question text
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .substring(0, 50); // Limit to 50 characters
}

// Update quiz data with audioQuestion field
let questionCount = 0;
const updatedQuizData = quizData.map((item, index) => {
    // Skip reading sections
    if (item.type === 'reading') {
        console.log(`📖 [${index + 1}] Skipped reading section`);
        return item;
    }

    questionCount++;
    const questionSlug = createSlug(item.question);
    const audioPath = `audios/science-v2-q${questionCount}-${questionSlug}.mp3`;

    console.log(`✅ [${index + 1}] Question ${questionCount}: ${audioPath}`);

    return {
        ...item,
        audioQuestion: audioPath
    };
});

// Save updated quiz data
fs.writeFileSync(QUIZ_DATA_FILE, JSON.stringify(updatedQuizData, null, 2), 'utf8');

console.log('\n📊 Summary:');
console.log(`✅ Total items: ${quizData.length}`);
console.log(`✅ Questions updated: ${questionCount}`);
console.log(`✅ Reading sections: ${quizData.length - questionCount}`);
console.log(`\n✨ File updated successfully: ${QUIZ_DATA_FILE}`);
