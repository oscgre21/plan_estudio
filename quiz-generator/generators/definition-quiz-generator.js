const fs = require('fs');
const path = require('path');

class DefinitionQuizGenerator {
    constructor(ollamaClient) {
        this.ollamaClient = ollamaClient;
        this.promptTemplate = fs.readFileSync(
            path.join(__dirname, '../prompts/definition-quiz-prompt.txt'),
            'utf8'
        );
    }

    /**
     * Generate definition quiz data from document text
     * @param {string} documentText - The source material
     * @returns {Promise<Array>} - Definition quiz data array
     */
    async generate(documentText) {
        console.log('\n🔍 Generating Definition Quiz...');

        const prompt = this.promptTemplate.replace('{DOCUMENT_TEXT}', documentText);

        try {
            const quizData = await this.ollamaClient.generateJSONWithRetry(prompt, 3, {
                temperature: 0.7,
                num_predict: 12000  // Increased for 30-40 questions
            });

            // Validate and clean the data
            const validatedData = this.validateAndClean(quizData);

            // Check if we have enough questions
            if (validatedData.length < 30) {
                console.warn(`⚠️  Warning: Only generated ${validatedData.length} definition questions (expected 30-40)`);
                console.warn(`   Consider using a larger document or regenerating.`);
            }

            console.log(`✅ Generated ${validatedData.length} definition quiz questions`);
            return validatedData;

        } catch (error) {
            console.error('❌ Error generating definition quiz:', error.message);
            throw error;
        }
    }

    /**
     * Validate and clean quiz data
     */
    validateAndClean(data) {
        if (!Array.isArray(data)) {
            throw new Error('Definition quiz data must be an array');
        }

        return data.map((item, index) => {
            // Ensure required fields
            if (!item.question) {
                throw new Error(`Question ${index + 1} missing 'question' field`);
            }

            if (!item.correctAnswer) {
                throw new Error(`Question ${index + 1} missing 'correctAnswer' field`);
            }

            // Validate options
            if (!Array.isArray(item.options) || item.options.length !== 4) {
                throw new Error(`Question ${index + 1} must have exactly 4 options`);
            }

            const correctOptions = item.options.filter(opt => opt.isCorrect);
            if (correctOptions.length !== 1) {
                throw new Error(`Question ${index + 1} must have exactly one correct option`);
            }

            // Verify correctAnswer matches correct option
            const correctOption = item.options.find(opt => opt.isCorrect);
            if (correctOption.word !== item.correctAnswer) {
                console.warn(`⚠️  Question ${index + 1}: correctAnswer doesn't match correct option. Fixing...`);
                item.correctAnswer = correctOption.word;
            }

            // Generate audio filename if missing
            if (!item.audioQuestion) {
                const slug = this.slugify(item.correctAnswer);
                item.audioQuestion = `audios/question-${slug}.mp3`;
            }

            return item;
        });
    }

    /**
     * Create URL-friendly slug from text
     */
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 40);
    }

    /**
     * Save definition quiz data to file
     */
    saveToFile(data, outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Saved definition quiz to: ${outputPath}`);
    }
}

module.exports = DefinitionQuizGenerator;
