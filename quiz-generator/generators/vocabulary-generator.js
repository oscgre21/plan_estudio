const fs = require('fs');
const path = require('path');

class VocabularyGenerator {
    constructor(ollamaClient) {
        this.ollamaClient = ollamaClient;
        this.promptTemplate = fs.readFileSync(
            path.join(__dirname, '../prompts/vocabulary-prompt.txt'),
            'utf8'
        );
    }

    /**
     * Generate vocabulary data from document text
     * @param {string} documentText - The source material
     * @returns {Promise<Array>} - Vocabulary data array
     */
    async generate(documentText) {
        console.log('\n📖 Generating Vocabulary Data...');

        const prompt = this.promptTemplate.replace('{DOCUMENT_TEXT}', documentText);

        try {
            const vocabularyData = await this.ollamaClient.generateJSONWithRetry(prompt, 3, {
                temperature: 0.7,
                num_predict: 6000
            });

            // Validate and clean the data
            const validatedData = this.validateAndClean(vocabularyData);

            console.log(`✅ Generated ${validatedData.length} vocabulary items`);
            return validatedData;

        } catch (error) {
            console.error('❌ Error generating vocabulary:', error.message);
            throw error;
        }
    }

    /**
     * Validate and clean vocabulary data
     */
    validateAndClean(data) {
        if (!Array.isArray(data)) {
            throw new Error('Vocabulary data must be an array');
        }

        return data.map((item, index) => {
            // Ensure required fields
            if (!item.word) {
                throw new Error(`Vocabulary item ${index + 1} missing 'word' field`);
            }

            if (!item.spanish) {
                console.warn(`⚠️  Item ${index + 1} (${item.word}) missing Spanish translation`);
                item.spanish = item.word;
            }

            if (!item.sentenceEN) {
                throw new Error(`Vocabulary item ${index + 1} (${item.word}) missing 'sentenceEN' field`);
            }

            if (!item.sentenceES) {
                console.warn(`⚠️  Item ${index + 1} (${item.word}) missing Spanish sentence`);
                item.sentenceES = item.sentenceEN;
            }

            // Validate options
            if (!Array.isArray(item.options) || item.options.length !== 4) {
                throw new Error(`Vocabulary item ${index + 1} (${item.word}) must have exactly 4 options`);
            }

            const correctOptions = item.options.filter(opt => opt.isCorrect);
            if (correctOptions.length !== 1) {
                throw new Error(`Vocabulary item ${index + 1} (${item.word}) must have exactly one correct option`);
            }

            // Generate audio filenames if missing
            if (!item.audioWord) {
                item.audioWord = `audios/word-${this.slugify(item.word)}.mp3`;
            }

            if (!item.audioSentence) {
                const slug = this.slugify(item.sentenceEN.substring(0, 50));
                item.audioSentence = `audios/sentence-${slug}.mp3`;
            }

            // Ensure wordEmoji exists
            if (!item.wordEmoji) {
                const correctOption = item.options.find(opt => opt.isCorrect);
                item.wordEmoji = correctOption.emoji || '📚';
            }

            // Generate wordEmojiImage if missing
            if (!item.wordEmojiImage) {
                item.wordEmojiImage = this.getEmojiImageURL(item.wordEmoji);
            }

            // Ensure explanation exists
            if (!item.explanation) {
                item.explanation = `${item.sentenceEN} ${item.sentenceES}`;
            }

            return item;
        });
    }

    /**
     * Get Twemoji CDN URL for an emoji
     */
    getEmojiImageURL(emoji) {
        try {
            const codePoint = emoji.codePointAt(0).toString(16);
            return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codePoint}.png`;
        } catch (error) {
            return 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/1f4da.png'; // Default book emoji
        }
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
     * Save vocabulary data to file
     */
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
