/**
 * Language Configuration for Quiz Generator
 * Supports multiple languages with primary and secondary language options
 */

const LANGUAGE_CONFIG = {
    en: {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        secondaryLanguage: 'es',
        secondaryLanguageCode: 'es',
        secondaryName: 'Spanish',
        secondaryNativeName: 'Español',
        audioPrefix: 'english',
        questionField: 'question',
        explanationField: 'explanation',
        secondaryQuestionField: 'questionES',
        secondaryExplanationField: 'explanationES',
        sentenceField: 'sentenceEN',
        secondarySentenceField: 'sentenceES'
    },
    es: {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        secondaryLanguage: 'en',
        secondaryLanguageCode: 'en',
        secondaryName: 'English',
        secondaryNativeName: 'English',
        audioPrefix: 'spanish',
        questionField: 'question',
        explanationField: 'explanation',
        secondaryQuestionField: 'questionEN',
        secondaryExplanationField: 'explanationEN',
        sentenceField: 'sentenceES',
        secondarySentenceField: 'sentenceEN'
    },
    fr: {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        secondaryLanguage: null,
        secondaryLanguageCode: null,
        secondaryName: null,
        secondaryNativeName: null,
        audioPrefix: 'french',
        questionField: 'question',
        explanationField: 'explanation',
        sentenceField: 'sentence'
    },
    de: {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        secondaryLanguage: null,
        secondaryLanguageCode: null,
        secondaryName: null,
        secondaryNativeName: null,
        audioPrefix: 'german',
        questionField: 'question',
        explanationField: 'explanation',
        sentenceField: 'sentence'
    },
    pt: {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        secondaryLanguage: null,
        secondaryLanguageCode: null,
        secondaryName: null,
        secondaryNativeName: null,
        audioPrefix: 'portuguese',
        questionField: 'question',
        explanationField: 'explanation',
        sentenceField: 'sentence'
    },
    it: {
        code: 'it',
        name: 'Italian',
        nativeName: 'Italiano',
        secondaryLanguage: null,
        secondaryLanguageCode: null,
        secondaryName: null,
        secondaryNativeName: null,
        audioPrefix: 'italian',
        questionField: 'question',
        explanationField: 'explanation',
        sentenceField: 'sentence'
    }
};

class LanguageManager {
    /**
     * Get language configuration
     * @param {string} languageCode - Language code (en, es, fr, etc.)
     * @returns {Object} Language configuration
     */
    static getLanguageConfig(languageCode) {
        const code = languageCode.toLowerCase();

        if (!LANGUAGE_CONFIG[code]) {
            throw new Error(`Unsupported language: ${languageCode}. Supported languages: ${this.getSupportedLanguages().join(', ')}`);
        }

        return LANGUAGE_CONFIG[code];
    }

    /**
     * Get list of supported language codes
     * @returns {Array<string>} Array of language codes
     */
    static getSupportedLanguages() {
        return Object.keys(LANGUAGE_CONFIG);
    }

    /**
     * Get list of supported languages with names
     * @returns {Array<Object>} Array of {code, name, nativeName}
     */
    static getSupportedLanguagesWithNames() {
        return Object.values(LANGUAGE_CONFIG).map(lang => ({
            code: lang.code,
            name: lang.name,
            nativeName: lang.nativeName
        }));
    }

    /**
     * Check if language is supported
     * @param {string} languageCode - Language code to check
     * @returns {boolean} True if supported
     */
    static isSupported(languageCode) {
        return LANGUAGE_CONFIG.hasOwnProperty(languageCode.toLowerCase());
    }

    /**
     * Get default language (English)
     * @returns {Object} Default language configuration
     */
    static getDefaultLanguage() {
        return LANGUAGE_CONFIG.en;
    }

    /**
     * Get translation instruction text for prompts
     * @param {Object} languageConfig - Language configuration
     * @returns {string} Translation instruction text
     */
    static getTranslationInstruction(languageConfig) {
        if (!languageConfig.secondaryLanguage) {
            return '';
        }

        return `4. Include translations in ${languageConfig.secondaryName} (${languageConfig.secondaryNativeName}):
   - ${languageConfig.secondaryQuestionField}: Question text in ${languageConfig.secondaryName}
   - ${languageConfig.secondaryExplanationField}: Explanation in ${languageConfig.secondaryName}`;
    }

    /**
     * Get secondary fields JSON example for prompts
     * @param {Object} languageConfig - Language configuration
     * @returns {string} Secondary fields JSON
     */
    static getSecondaryFieldsExample(languageConfig) {
        if (!languageConfig.secondaryLanguage) {
            return '';
        }

        return `  "${languageConfig.secondaryQuestionField}": "Question text in ${languageConfig.secondaryName}",
  "${languageConfig.secondaryExplanationField}": "Explanation in ${languageConfig.secondaryName}",`;
    }

    /**
     * Print supported languages
     */
    static printSupportedLanguages() {
        console.log('\n📚 Supported Languages:');
        console.log('='.repeat(60));

        Object.values(LANGUAGE_CONFIG).forEach(lang => {
            const secondary = lang.secondaryLanguage
                ? ` (with ${lang.secondaryName} translation)`
                : ' (monolingual)';
            console.log(`  ${lang.code.toUpperCase()}: ${lang.nativeName} / ${lang.name}${secondary}`);
        });

        console.log('='.repeat(60));
    }
}

module.exports = {
    LANGUAGE_CONFIG,
    LanguageManager
};
