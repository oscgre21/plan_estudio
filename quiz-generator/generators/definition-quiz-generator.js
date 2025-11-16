const fs = require('fs');
const path = require('path');

class DefinitionQuizGenerator {
    constructor(ollamaClient, languageConfig) {
        this.ollamaClient = ollamaClient;
        this.languageConfig = languageConfig;
        this.promptTemplate = fs.readFileSync(
            path.join(__dirname, '../prompts/definition-quiz-prompt.txt'),
            'utf8'
        );
    }

    async generate(documentText) {
        console.log(`\n🔍 Generating Definition Quiz in ${this.languageConfig.nativeName}...`);

        const prompt = this.preparePrompt(documentText);

        try {
            const quizData = await this.ollamaClient.generateJSONWithRetry(prompt, 3, {
                temperature: 0.7,
                num_predict: 12000
            });

            const validatedData = this.validateAndClean(quizData);

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

    preparePrompt(documentText) {
        let prompt = this.promptTemplate
            .replace(/{DOCUMENT_TEXT}/g, documentText)
            .replace(/{PRIMARY_LANGUAGE}/g, this.languageConfig.name)
            .replace(/{PRIMARY_LANGUAGE_NATIVE}/g, this.languageConfig.nativeName);

        if (this.languageConfig.secondaryLanguage) {
            const secondaryInfo = `- Secondary Language: ${this.languageConfig.secondaryName} (${this.languageConfig.secondaryNativeName})`;
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_INFO}/g, secondaryInfo);

            const translationInstruction = `6. Optionally include translations in ${this.languageConfig.secondaryName}`;
            prompt = prompt.replace(/{TRANSLATION_INSTRUCTION}/g, translationInstruction);

            const secondaryRules = `- Primary language content is mandatory`;
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_RULES}/g, secondaryRules);
        } else {
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_INFO}/g, '');
            prompt = prompt.replace(/{TRANSLATION_INSTRUCTION}/g, '');
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_RULES}/g, '');
        }

        return prompt;
    }

    validateAndClean(data) {
        if (!Array.isArray(data)) {
            throw new Error('Definition quiz data must be an array');
        }

        return data.map((item, index) => {
            if (!item.question) {
                throw new Error(`Question ${index + 1} missing 'question' field`);
            }

            if (!item.correctAnswer) {
                throw new Error(`Question ${index + 1} missing 'correctAnswer' field`);
            }

            if (!Array.isArray(item.options) || item.options.length !== 4) {
                throw new Error(`Question ${index + 1} must have exactly 4 options`);
            }

            const correctOptions = item.options.filter(opt => opt.isCorrect);
            if (correctOptions.length !== 1) {
                throw new Error(`Question ${index + 1} must have exactly one correct option`);
            }

            const correctOption = item.options.find(opt => opt.isCorrect);
            if (correctOption.word !== item.correctAnswer) {
                console.warn(`⚠️  Question ${index + 1}: correctAnswer doesn't match correct option. Fixing...`);
                item.correctAnswer = correctOption.word;
            }

            if (!item.audioQuestion) {
                const slug = this.slugify(item.correctAnswer);
                item.audioQuestion = `audios/question-${slug}.mp3`;
            }

            return item;
        });
    }

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 40);
    }

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
