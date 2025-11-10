const fs = require('fs');
const path = require('path');

class AudioGenerator {
    constructor(audioDir, ttsEndpoint = 'http://localhost:8880/v1/audio/speech') {
        this.audioDir = audioDir;
        this.ttsEndpoint = ttsEndpoint;

        // Ensure audio directory exists
        if (!fs.existsSync(this.audioDir)) {
            fs.mkdirSync(this.audioDir, { recursive: true });
            console.log(`✅ Created audio directory: ${this.audioDir}`);
        }
    }

    /**
     * Strip HTML tags from text
     */
    stripHtml(text) {
        return text.replace(/<[^>]*>/g, '');
    }

    /**
     * Sanitize filename
     */
    sanitizeFilename(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 60);
    }

    /**
     * Generate audio file using TTS endpoint
     * @param {string} text - Text to convert to speech
     * @param {string} filename - Output filename
     * @returns {Promise<boolean>} - Success status
     */
    async generateAudio(text, filename) {
        const filepath = path.join(this.audioDir, filename);

        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`⏭️  Skipped (exists): ${filename}`);
            return true;
        }

        try {
            console.log(`🎵 Generating: ${filename}`);

            const response = await fetch(this.ttsEndpoint, {
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

    /**
     * Generate audio files for science quiz data
     * @param {Array} quizData - Quiz data array
     * @returns {Promise<Object>} - Generation statistics
     */
    async generateScienceQuizAudios(quizData) {
        console.log('\n🎵 Generating audio files for science quiz...');

        let successful = 0;
        let failed = 0;
        let skipped = 0;

        for (let i = 0; i < quizData.length; i++) {
            const item = quizData[i];

            // Skip reading sections
            if (item.type === 'reading') {
                console.log(`📖 [${i + 1}/${quizData.length}] Skipped reading section`);
                continue;
            }

            console.log(`\n--- [${i + 1}/${quizData.length}] ---`);

            // Generate audio for question
            if (item.question && item.audioQuestion) {
                const questionText = this.stripHtml(item.question);
                const audioFilename = path.basename(item.audioQuestion);

                const result = await this.generateAudio(questionText, audioFilename);
                if (result) {
                    const fileExists = fs.existsSync(path.join(this.audioDir, audioFilename));
                    if (fileExists && fs.statSync(path.join(this.audioDir, audioFilename)).size > 0) {
                        successful++;
                    } else {
                        skipped++;
                    }
                } else {
                    failed++;
                }

                // Small delay to avoid overwhelming the TTS server
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return { successful, failed, skipped };
    }

    /**
     * Generate audio files for vocabulary data
     * @param {Array} vocabularyData - Vocabulary data array
     * @returns {Promise<Object>} - Generation statistics
     */
    async generateVocabularyAudios(vocabularyData) {
        console.log('\n🎵 Generating audio files for vocabulary...');

        let successful = 0;
        let failed = 0;
        let skipped = 0;

        for (let i = 0; i < vocabularyData.length; i++) {
            const item = vocabularyData[i];

            console.log(`\n--- [${i + 1}/${vocabularyData.length}] ${item.word} ---`);

            // Generate audio for word
            if (item.audioWord) {
                const wordFilename = path.basename(item.audioWord);
                const wordResult = await this.generateAudio(item.word, wordFilename);
                if (wordResult) {
                    if (fs.existsSync(path.join(this.audioDir, wordFilename)) &&
                        fs.statSync(path.join(this.audioDir, wordFilename)).size > 0) {
                        successful++;
                    } else {
                        skipped++;
                    }
                } else {
                    failed++;
                }

                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Generate audio for sentence
            if (item.audioSentence) {
                const sentenceFilename = path.basename(item.audioSentence);
                const sentenceResult = await this.generateAudio(item.sentenceEN, sentenceFilename);
                if (sentenceResult) {
                    if (fs.existsSync(path.join(this.audioDir, sentenceFilename)) &&
                        fs.statSync(path.join(this.audioDir, sentenceFilename)).size > 0) {
                        successful++;
                    } else {
                        skipped++;
                    }
                } else {
                    failed++;
                }

                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return { successful, failed, skipped };
    }

    /**
     * Generate audio files for definition quiz data
     * @param {Array} definitionData - Definition quiz data array
     * @returns {Promise<Object>} - Generation statistics
     */
    async generateDefinitionQuizAudios(definitionData) {
        console.log('\n🎵 Generating audio files for definition quiz...');

        let successful = 0;
        let failed = 0;
        let skipped = 0;

        for (let i = 0; i < definitionData.length; i++) {
            const item = definitionData[i];

            console.log(`\n--- [${i + 1}/${definitionData.length}] ---`);

            // Generate audio for question
            if (item.audioQuestion) {
                const audioFilename = path.basename(item.audioQuestion);
                const result = await this.generateAudio(item.question, audioFilename);
                if (result) {
                    if (fs.existsSync(path.join(this.audioDir, audioFilename)) &&
                        fs.statSync(path.join(this.audioDir, audioFilename)).size > 0) {
                        successful++;
                    } else {
                        skipped++;
                    }
                } else {
                    failed++;
                }

                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return { successful, failed, skipped };
    }

    /**
     * Print generation summary
     */
    printSummary(stats) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 Audio Generation Summary:');
        console.log('='.repeat(60));
        console.log(`✅ Successful: ${stats.successful}`);
        console.log(`⏭️  Skipped (already exists): ${stats.skipped}`);
        console.log(`❌ Failed: ${stats.failed}`);
        console.log(`📁 Audio directory: ${this.audioDir}`);
        console.log('='.repeat(60));
    }
}

module.exports = AudioGenerator;
