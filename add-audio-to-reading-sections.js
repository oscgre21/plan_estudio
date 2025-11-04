const fs = require('fs');
const path = require('path');

// Files to process
const FILES = [
    {
        path: path.join(__dirname, 'public', 'science-quiz-data.json'),
        prefix: 'v1'
    },
    {
        path: path.join(__dirname, 'public', 'science-quiz-data_V2.json'),
        prefix: 'v2'
    }
];

// Function to create slug from text
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .substring(0, 40); // Limit to 40 characters
}

// Process each file
FILES.forEach(file => {
    console.log(`\n📖 Processing: ${file.path}`);

    const quizData = JSON.parse(fs.readFileSync(file.path, 'utf8'));
    let readingCount = 0;

    const updatedQuizData = quizData.map((item, index) => {
        if (item.type === 'reading') {
            readingCount++;
            const contentSlug = createSlug(item.content);
            const audioPath = `audios/science-${file.prefix}-reading${readingCount}-${contentSlug}.mp3`;

            console.log(`✅ [${index + 1}] Reading ${readingCount}: ${audioPath}`);

            return {
                ...item,
                audioContent: audioPath
            };
        }
        return item;
    });

    // Save updated file
    fs.writeFileSync(file.path, JSON.stringify(updatedQuizData, null, 2), 'utf8');
    console.log(`✨ Updated ${readingCount} reading sections in ${file.path}`);
});

console.log('\n✅ All files updated successfully!');
