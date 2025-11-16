#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import utilities
const OllamaClient = require('./utils/ollama-client');
const DocumentParser = require('./utils/document-parser');
const AudioGenerator = require('./utils/audio-generator');
const { LanguageManager } = require('./utils/language-config');

// Import generators
const ScienceQuizGenerator = require('./generators/science-quiz-generator');
const VocabularyGenerator = require('./generators/vocabulary-generator');
const DefinitionQuizGenerator = require('./generators/definition-quiz-generator');
const ConfigUpdater = require('./generators/config-updater');

// Configuration
const CONFIG = {
    ollamaURL: 'http://localhost:11434',
    ollamaModel: 'kimi-k2:1t-cloud',
    ttsEndpoint: 'http://localhost:8880/v1/audio/speech',
    outputDir: path.join(__dirname, '..', 'public'),
    audioDir: path.join(__dirname, '..', 'public', 'audios'),
    configFile: path.join(__dirname, '..', 'public', 'test-sets-config.json')
};

/**
 * Main quiz generation function
 */
async function generateQuiz(documentPath, testSetName, options = {}) {
    // Get language configuration
    const languageCode = options.language || 'en';
    const languageConfig = LanguageManager.getLanguageConfig(languageCode);

    console.log('\n' + '='.repeat(60));
    console.log('🎓 AUTOMATED QUIZ GENERATOR');
    console.log('='.repeat(60));
    console.log(`📄 Document: ${documentPath}`);
    console.log(`📝 Test Set: ${testSetName}`);
    console.log(`🌐 Language: ${languageConfig.nativeName} (${languageConfig.code})`);
    if (languageConfig.secondaryLanguage) {
        console.log(`   Secondary: ${languageConfig.secondaryNativeName} (${languageConfig.secondaryLanguage})`);
    }
    console.log('='.repeat(60));

    try {
        // Step 1: Initialize Ollama client
        console.log('\n📡 Step 1: Connecting to Ollama...');
        const ollamaClient = new OllamaClient(CONFIG.ollamaURL, CONFIG.ollamaModel);
        const connected = await ollamaClient.testConnection();
        if (!connected) {
            throw new Error('Failed to connect to Ollama. Make sure Ollama is running and the model is installed.');
        }

        // Step 2: Parse document
        console.log('\n📖 Step 2: Parsing document...');
        const documentText = await DocumentParser.parse(documentPath);
        const cleanText = DocumentParser.cleanText(documentText);
        const stats = DocumentParser.getStats(cleanText);

        console.log('\n📊 Document Statistics:');
        console.log(`   Characters: ${stats.characters}`);
        console.log(`   Words: ${stats.words}`);
        console.log(`   Lines: ${stats.lines}`);
        console.log(`   Est. Reading Time: ${stats.estimatedReadingTime} minutes`);

        // Step 3: Generate test set ID and filenames
        console.log('\n🔧 Step 3: Preparing output files...');
        const testSetId = ConfigUpdater.generateId(testSetName);
        const timestamp = Date.now();

        const filenames = {
            vocabulary: `vocabulary-data-${testSetId}.json`,
            scienceQuiz: `science-quiz-data-${testSetId}.json`,
            definitionQuiz: `definition-quiz-data-${testSetId}.json`
        };

        console.log(`   ID: ${testSetId}`);
        console.log(`   Vocabulary: ${filenames.vocabulary}`);
        console.log(`   Science Quiz: ${filenames.scienceQuiz}`);
        console.log(`   Definition Quiz: ${filenames.definitionQuiz}`);

        // Step 4: Generate Science Quiz
        if (!options.skipScienceQuiz) {
            console.log('\n📚 Step 4: Generating Science Quiz...');
            const scienceQuizGen = new ScienceQuizGenerator(ollamaClient, languageConfig);
            const scienceQuizData = await scienceQuizGen.generate(cleanText, testSetName);
            const scienceQuizPath = path.join(CONFIG.outputDir, filenames.scienceQuiz);
            scienceQuizGen.saveToFile(scienceQuizData, scienceQuizPath);

            // Generate audio for science quiz
            if (!options.skipAudio) {
                console.log('\n🎵 Generating audio for Science Quiz...');
                const audioGen = new AudioGenerator(CONFIG.audioDir, CONFIG.ttsEndpoint);
                const audioStats = await audioGen.generateScienceQuizAudios(scienceQuizData);
                audioGen.printSummary(audioStats);
            }
        }

        // Step 5: Generate Vocabulary Data
        if (!options.skipVocabulary) {
            console.log('\n📖 Step 5: Generating Vocabulary Data...');
            const vocabularyGen = new VocabularyGenerator(ollamaClient, languageConfig);
            const vocabularyData = await vocabularyGen.generate(cleanText);
            const vocabularyPath = path.join(CONFIG.outputDir, filenames.vocabulary);
            vocabularyGen.saveToFile(vocabularyData, vocabularyPath);

            // Generate audio for vocabulary
            if (!options.skipAudio) {
                console.log('\n🎵 Generating audio for Vocabulary...');
                const audioGen = new AudioGenerator(CONFIG.audioDir, CONFIG.ttsEndpoint);
                const audioStats = await audioGen.generateVocabularyAudios(vocabularyData);
                audioGen.printSummary(audioStats);
            }
        }

        // Step 6: Generate Definition Quiz
        if (!options.skipDefinitionQuiz) {
            console.log('\n🔍 Step 6: Generating Definition Quiz...');
            const definitionQuizGen = new DefinitionQuizGenerator(ollamaClient, languageConfig);
            const definitionQuizData = await definitionQuizGen.generate(cleanText);
            const definitionQuizPath = path.join(CONFIG.outputDir, filenames.definitionQuiz);
            definitionQuizGen.saveToFile(definitionQuizData, definitionQuizPath);

            // Generate audio for definition quiz
            if (!options.skipAudio) {
                console.log('\n🎵 Generating audio for Definition Quiz...');
                const audioGen = new AudioGenerator(CONFIG.audioDir, CONFIG.ttsEndpoint);
                const audioStats = await audioGen.generateDefinitionQuizAudios(definitionQuizData);
                audioGen.printSummary(audioStats);
            }
        }

        // Step 7: Update configuration
        console.log('\n⚙️  Step 7: Updating test-sets-config.json...');
        const configUpdater = new ConfigUpdater(CONFIG.configFile);
        const testSet = ConfigUpdater.createTestSet(
            testSetId,
            testSetName,
            `Generated from ${path.basename(documentPath)}`,
            filenames.vocabulary,
            filenames.scienceQuiz
        );
        configUpdater.addTestSet(testSet);

        // Final summary
        console.log('\n' + '='.repeat(60));
        console.log('✅ QUIZ GENERATION COMPLETE!');
        console.log('='.repeat(60));
        console.log(`📁 Output Directory: ${CONFIG.outputDir}`);
        console.log(`🎵 Audio Directory: ${CONFIG.audioDir}`);
        console.log('\n📝 Generated Files:');
        if (!options.skipScienceQuiz) console.log(`   ✓ ${filenames.scienceQuiz}`);
        if (!options.skipVocabulary) console.log(`   ✓ ${filenames.vocabulary}`);
        if (!options.skipDefinitionQuiz) console.log(`   ✓ ${filenames.definitionQuiz}`);
        console.log(`   ✓ Updated test-sets-config.json`);
        if (!options.skipAudio) console.log(`   ✓ Audio files generated`);
        console.log('='.repeat(60));
        console.log('\n🎉 You can now use this test set in your quiz application!');

    } catch (error) {
        console.error('\n' + '='.repeat(60));
        console.error('❌ ERROR:', error.message);
        console.error('='.repeat(60));
        if (error.stack) {
            console.error('\nStack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

/**
 * Parse command line arguments
 */
function parseArguments() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printHelp();
        process.exit(0);
    }

    // List supported languages
    if (args.includes('--list-languages')) {
        LanguageManager.printSupportedLanguages();
        process.exit(0);
    }

    const documentPath = args[0];
    const testSetName = args[1] || path.basename(documentPath, path.extname(documentPath));

    // Extract language parameter
    const languageIndex = args.findIndex(arg =>
        arg === '--language' || arg === '-l' || arg === '--lang'
    );

    let languageCode = 'en'; // Default to English
    if (languageIndex >= 0 && args[languageIndex + 1]) {
        languageCode = args[languageIndex + 1].toLowerCase();

        // Validate language
        if (!LanguageManager.isSupported(languageCode)) {
            console.error(`\n❌ Error: Unsupported language '${languageCode}'`);
            console.error(`\nSupported languages: ${LanguageManager.getSupportedLanguages().join(', ')}`);
            console.error(`\nUse --list-languages to see all available languages.\n`);
            process.exit(1);
        }
    }

    const options = {
        skipScienceQuiz: args.includes('--skip-science-quiz'),
        skipVocabulary: args.includes('--skip-vocabulary'),
        skipDefinitionQuiz: args.includes('--skip-definition-quiz'),
        skipAudio: args.includes('--skip-audio'),
        language: languageCode
    };

    return { documentPath, testSetName, options };
}

/**
 * Print help message
 */
function printHelp() {
    console.log(`
🎓 AUTOMATED QUIZ GENERATOR
================================

Generate quiz files automatically from study documents using Ollama AI.

USAGE:
  node generate-quiz.js <document-path> [test-set-name] [options]

ARGUMENTS:
  document-path    Path to study document (.txt, .pdf, .docx)
  test-set-name    Name for the test set (optional, defaults to filename)

OPTIONS:
  -l, --language, --lang <code>   Set output language (default: en)
  --list-languages                Show all supported languages
  --skip-science-quiz             Skip science quiz generation
  --skip-vocabulary               Skip vocabulary generation
  --skip-definition-quiz          Skip definition quiz generation
  --skip-audio                    Skip audio generation
  -h, --help                      Show this help message

LANGUAGE OPTIONS:
  en    English (with Spanish translation) - DEFAULT
  es    Spanish (Español, with English translation)
  fr    French (Français, monolingual)
  de    German (Deutsch, monolingual)
  pt    Portuguese (Português, monolingual)
  it    Italian (Italiano, monolingual)

EXAMPLES:
  # Generate all quizzes from a PDF in English (default)
  node generate-quiz.js study-material.pdf "Math Test"

  # Generate in Spanish with English translation
  node generate-quiz.js documento.pdf "Quiz de Matemáticas" --language es
  node generate-quiz.js documento.pdf "Quiz de Matemáticas" -l es

  # Generate in French (no translation)
  node generate-quiz.js document.pdf "Quiz de Mathématiques" --lang fr

  # Generate only vocabulary in Spanish, skip audio
  node generate-quiz.js notas.txt "Vocabulario" -l es --skip-science-quiz --skip-audio

  # List all available languages
  node generate-quiz.js --list-languages

REQUIREMENTS:
  - Ollama running locally (http://localhost:11434)
  - Model: kimi-k2:1t-cloud installed
  - TTS server running (http://localhost:8880) for audio generation

For more information, see README.md
    `);
}

/**
 * Main entry point
 */
if (require.main === module) {
    const { documentPath, testSetName, options } = parseArguments();
    generateQuiz(documentPath, testSetName, options);
}

module.exports = { generateQuiz, CONFIG };
