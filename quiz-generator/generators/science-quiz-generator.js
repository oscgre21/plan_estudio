const fs = require('fs');
const path = require('path');
const { LanguageManager } = require('../utils/language-config');

class ScienceQuizGenerator {
    constructor(ollamaClient, languageConfig) {
        this.ollamaClient = ollamaClient;
        this.languageConfig = languageConfig;
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
        console.log(`\n📚 Generating Science Quiz in ${this.languageConfig.nativeName}...`);

        const prompt = this.preparePrompt(documentText);

        try {
            const quizData = await this.ollamaClient.generateJSONWithRetry(prompt, 3, {
                temperature: 0.7,
                num_predict: 16000  // Increased for 30-50 questions
            });

            // Validate and clean the data
            const validatedData = this.validateAndClean(quizData, examName);

            // Check if we have enough questions
            if (validatedData.length < 30) {
                console.warn(`⚠️  Warning: Only generated ${validatedData.length} quiz questions (expected 30-50)`);
                console.warn(`   Consider using a larger document or regenerating.`);
            }

            console.log(`✅ Generated ${validatedData.length} quiz questions`);
            return validatedData;

        } catch (error) {
            console.error('❌ Error generating science quiz:', error.message);
            throw error;
        }
    }

    /**
     * Prepare prompt with language-specific placeholders replaced
     */
    preparePrompt(documentText) {
        let prompt = this.promptTemplate
            .replace(/{DOCUMENT_TEXT}/g, documentText)
            .replace(/{PRIMARY_LANGUAGE}/g, this.languageConfig.name)
            .replace(/{PRIMARY_LANGUAGE_NATIVE}/g, this.languageConfig.nativeName)
            .replace(/{AUDIO_PREFIX}/g, this.languageConfig.audioPrefix);

        // Add secondary language info if available
        if (this.languageConfig.secondaryLanguage) {
            const secondaryInfo = `- Secondary Language: ${this.languageConfig.secondaryName} (${this.languageConfig.secondaryNativeName})`;
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_INFO}/g, secondaryInfo);

            // Add translation instruction
            const translationInstruction = LanguageManager.getTranslationInstruction(this.languageConfig);
            prompt = prompt.replace(/{TRANSLATION_INSTRUCTION}/g, translationInstruction);

            // Add secondary fields example
            const secondaryFields = LanguageManager.getSecondaryFieldsExample(this.languageConfig);
            prompt = prompt.replace(/{SECONDARY_FIELDS_EXAMPLE}/g, secondaryFields);

            // Add secondary language rules
            const secondaryRules = `- Secondary language fields (${this.languageConfig.secondaryQuestionField}, ${this.languageConfig.secondaryExplanationField}) are REQUIRED`;
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_RULES}/g, secondaryRules);
        } else {
            // Remove placeholders for monolingual generation
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_INFO}/g, '');
            prompt = prompt.replace(/{TRANSLATION_INSTRUCTION}/g, '');
            prompt = prompt.replace(/{SECONDARY_FIELDS_EXAMPLE}/g, '');
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_RULES}/g, '');
        }

        return prompt;
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

            // Ensure secondary language fields exist if configured
            if (this.languageConfig.secondaryLanguage) {
                if (!item[this.languageConfig.secondaryQuestionField]) {
                    console.warn(`⚠️  Question ${index + 1} missing secondary language question (${this.languageConfig.secondaryQuestionField})`);
                    item[this.languageConfig.secondaryQuestionField] = item.question;
                }

                if (!item[this.languageConfig.secondaryExplanationField]) {
                    console.warn(`⚠️  Question ${index + 1} missing secondary language explanation (${this.languageConfig.secondaryExplanationField})`);
                    item[this.languageConfig.secondaryExplanationField] = item.explanation || '';
                }
            }

            // Generate audio filename if missing
            if (!item.audioQuestion) {
                const type = item.type === 'true-false' ? 'tf' : 'q';
                const slug = this.slugify(item.question.substring(0, 50));
                item.audioQuestion = `audios/${this.languageConfig.audioPrefix}-${type}${index + 1}-${slug}.mp3`;
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
