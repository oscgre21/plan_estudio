const fs = require('fs');
const path = require('path');

class ScienceQuizGenerator {
    constructor(ollamaClient) {
        this.ollamaClient = ollamaClient;
        this.promptTemplate = fs.readFileSync(
            path.join(__dirname, '../prompts/science-quiz-prompt.txt'),
            'utf8'
        );
    }

    /**
     * Generate science quiz data from document text
     * @param {string} documentText - The source material
     * @param {string} examName - Name of the exam/subject
     * @returns {Promise<Array>} - Quiz data array
     */
    async generate(documentText, examName = 'Generated Quiz') {
        console.log('\n📚 Generating Science Quiz...');

        const prompt = this.promptTemplate.replace('{DOCUMENT_TEXT}', documentText);

        try {
            const quizData = await this.ollamaClient.generateJSONWithRetry(prompt, 3, {
                temperature: 0.7,
                num_predict: 8000
            });

            // Validate and clean the data
            const validatedData = this.validateAndClean(quizData, examName);

            console.log(`✅ Generated ${validatedData.length} quiz questions`);
            return validatedData;

        } catch (error) {
            console.error('❌ Error generating science quiz:', error.message);
            throw error;
        }
    }

    /**
     * Validate and clean quiz data
     */
    validateAndClean(data, examName) {
        if (!Array.isArray(data)) {
            throw new Error('Quiz data must be an array');
        }

        return data.map((item, index) => {
            // Ensure required fields
            if (!item.question) {
                throw new Error(`Question ${index + 1} missing 'question' field`);
            }

            if (!item.type) {
                throw new Error(`Question ${index + 1} missing 'type' field`);
            }

            // Set exam name if not present
            if (!item.exam) {
                item.exam = examName;
            }

            // Validate by type
            if (item.type === 'multiple-choice') {
                if (!Array.isArray(item.options) || item.options.length !== 4) {
                    throw new Error(`Question ${index + 1}: multiple-choice must have exactly 4 options`);
                }
                if (typeof item.correctAnswer !== 'number' || item.correctAnswer < 0 || item.correctAnswer > 3) {
                    throw new Error(`Question ${index + 1}: correctAnswer must be 0-3 for multiple-choice`);
                }
            } else if (item.type === 'true-false') {
                if (item.correctAnswer !== 'T' && item.correctAnswer !== 'F') {
                    throw new Error(`Question ${index + 1}: correctAnswer must be 'T' or 'F' for true-false`);
                }
            }

            // Ensure translations exist
            if (!item.questionES) {
                console.warn(`⚠️  Question ${index + 1} missing Spanish translation`);
                item.questionES = item.question;
            }

            if (!item.explanationES) {
                console.warn(`⚠️  Question ${index + 1} missing Spanish explanation`);
                item.explanationES = item.explanation || '';
            }

            // Generate audio filename if missing
            if (!item.audioQuestion) {
                const type = item.type === 'true-false' ? 'tf' : 'q';
                const slug = this.slugify(item.question.substring(0, 50));
                item.audioQuestion = `audios/english-${type}${index + 1}-${slug}.mp3`;
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
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 40);
    }

    /**
     * Save quiz data to file
     */
    saveToFile(data, outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Saved science quiz to: ${outputPath}`);
    }
}

module.exports = ScienceQuizGenerator;
