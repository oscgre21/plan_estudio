const fs = require('fs');
const path = require('path');
const { LanguageManager } = require('../utils/language-config');

class VocabularyGenerator {
    constructor(ollamaClient, languageConfig) {
        this.ollamaClient = ollamaClient;
        this.languageConfig = languageConfig;
        this.promptTemplate = fs.readFileSync(
            path.join(__dirname, '../prompts/vocabulary-prompt.txt'),
            'utf8'
        );
    }

    async generate(documentText) {
        console.log(`\n📖 Generating Vocabulary Data in ${this.languageConfig.nativeName}...`);

        const prompt = this.preparePrompt(documentText);

        try {
            const vocabularyData = await this.ollamaClient.generateJSONWithRetry(prompt, 3, {
                temperature: 0.7,
                num_predict: 12000
            });

            const validatedData = this.validateAndClean(vocabularyData);

            if (validatedData.length < 30) {
                console.warn(`⚠️  Warning: Only generated ${validatedData.length} vocabulary items (expected 30-40)`);
                console.warn(`   Consider using a larger document or regenerating.`);
            }

            console.log(`✅ Generated ${validatedData.length} vocabulary items`);
            return validatedData;

        } catch (error) {
            console.error('❌ Error generating vocabulary:', error.message);
            throw error;
        }
    }

    preparePrompt(documentText) {
        let prompt = this.promptTemplate
            .replace(/{DOCUMENT_TEXT}/g, documentText)
            .replace(/{PRIMARY_LANGUAGE}/g, this.languageConfig.name)
            .replace(/{PRIMARY_LANGUAGE_NATIVE}/g, this.languageConfig.nativeName)
            .replace(/{SENTENCE_FIELD}/g, this.languageConfig.sentenceField);

        if (this.languageConfig.secondaryLanguage) {
            const secondaryInfo = `- Secondary Language: ${this.languageConfig.secondaryName} (${this.languageConfig.secondaryNativeName})`;
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_INFO}/g, secondaryInfo);

            const translationInstruction = `3. Include secondary language translation:
   - Translation of word in ${this.languageConfig.secondaryName}
   - Sentence in ${this.languageConfig.secondaryName}`;
            prompt = prompt.replace(/{TRANSLATION_INSTRUCTION}/g, translationInstruction);

            const secondaryWordField = `  "${this.languageConfig.secondaryLanguageCode}": "Translation in ${this.languageConfig.secondaryName}",`;
            prompt = prompt.replace(/{SECONDARY_WORD_FIELD}/g, secondaryWordField);

            const secondarySentenceField = `  "${this.languageConfig.secondarySentenceField}": "Example sentence in ${this.languageConfig.secondaryName}.",`;
            prompt = prompt.replace(/{SECONDARY_SENTENCE_FIELD}/g, secondarySentenceField);

            const secondaryExplanation = ` Explanation in ${this.languageConfig.secondaryName}`;
            prompt = prompt.replace(/{SECONDARY_EXPLANATION}/g, secondaryExplanation);

            const secondaryRules = `- Both primary and secondary language fields are REQUIRED`;
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_RULES}/g, secondaryRules);
        } else {
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_INFO}/g, '');
            prompt = prompt.replace(/{TRANSLATION_INSTRUCTION}/g, '');
            prompt = prompt.replace(/{SECONDARY_WORD_FIELD}/g, '');
            prompt = prompt.replace(/{SECONDARY_SENTENCE_FIELD}/g, '');
            prompt = prompt.replace(/{SECONDARY_EXPLANATION}/g, '');
            prompt = prompt.replace(/{SECONDARY_LANGUAGE_RULES}/g, '');
        }

        return prompt;
    }

    validateAndClean(data) {
        if (!Array.isArray(data)) {
            throw new Error('Vocabulary data must be an array');
        }

        return data.map((item, index) => {
            if (!item.word) {
                throw new Error(`Vocabulary item ${index + 1} missing 'word' field`);
            }

            if (!item[this.languageConfig.sentenceField]) {
                throw new Error(`Vocabulary item ${index + 1} (${item.word}) missing sentence field`);
            }

            if (!Array.isArray(item.options) || item.options.length !== 4) {
                throw new Error(`Vocabulary item ${index + 1} (${item.word}) must have exactly 4 options`);
            }

            const correctOptions = item.options.filter(opt => opt.isCorrect);
            if (correctOptions.length !== 1) {
                throw new Error(`Vocabulary item ${index + 1} (${item.word}) must have exactly one correct option`);
            }

            if (!item.audioWord) {
                item.audioWord = `audios/word-${this.slugify(item.word)}.mp3`;
            }

            if (!item.audioSentence) {
                const slug = this.slugify(item[this.languageConfig.sentenceField].substring(0, 50));
                item.audioSentence = `audios/sentence-${slug}.mp3`;
            }

            if (!item.wordEmoji) {
                const correctOption = item.options.find(opt => opt.isCorrect);
                item.wordEmoji = correctOption.emoji || '📚';
            }

            if (!item.wordEmojiImage) {
                item.wordEmojiImage = this.getEmojiImageURL(item.wordEmoji);
            }

            if (!item.explanation) {
                item.explanation = item[this.languageConfig.sentenceField];
            }

            return item;
        });
    }

    getEmojiImageURL(emoji) {
        try {
            const codePoint = emoji.codePointAt(0).toString(16);
            return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codePoint}.png`;
        } catch (error) {
            return 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/1f4da.png';
        }
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
        console.log(`✅ Saved vocabulary data to: ${outputPath}`);
    }
}

module.exports = VocabularyGenerator;
