const fs = require('fs');
const path = require('path');

class ConfigUpdater {
    constructor(configPath) {
        this.configPath = configPath;
    }

    /**
     * Add new test set to configuration
     * @param {Object} testSet - Test set configuration
     * @returns {boolean} - Success status
     */
    addTestSet(testSet) {
        try {
            console.log('\n⚙️  Updating test-sets-config.json...');

            // Read existing config
            let config = [];
            if (fs.existsSync(this.configPath)) {
                const content = fs.readFileSync(this.configPath, 'utf8');
                config = JSON.parse(content);
            }

            // Check if ID already exists
            const existingIndex = config.findIndex(item => item.id === testSet.id);

            if (existingIndex >= 0) {
                console.log(`⚠️  Test set with ID "${testSet.id}" already exists. Updating...`);
                config[existingIndex] = testSet;
            } else {
                console.log(`✅ Adding new test set: "${testSet.name}"`);
                config.push(testSet);
            }

            // Save updated config
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf8');
            console.log(`✅ Updated config file: ${this.configPath}`);

            return true;
        } catch (error) {
            console.error('❌ Error updating config:', error.message);
            return false;
        }
    }

    /**
     * Create test set configuration object
     * @param {string} id - Unique identifier
     * @param {string} name - Display name
     * @param {string} description - Description
     * @param {string} vocabularyFile - Vocabulary data filename
     * @param {string} scienceQuizFile - Science quiz filename
     * @returns {Object} - Test set configuration
     */
    static createTestSet(id, name, description, vocabularyFile, scienceQuizFile) {
        return {
            id: id,
            name: name,
            description: description,
            vocabularyFile: vocabularyFile,
            scienceQuizFile: scienceQuizFile
        };
    }

    /**
     * Generate ID from name
     * @param {string} name - Test set name
     * @returns {string} - Generated ID
     */
    static generateId(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    /**
     * List all test sets
     */
    listTestSets() {
        try {
            if (!fs.existsSync(this.configPath)) {
                console.log('No test sets configured yet.');
                return [];
            }

            const content = fs.readFileSync(this.configPath, 'utf8');
            const config = JSON.parse(content);

            console.log('\n📋 Configured Test Sets:');
            console.log('='.repeat(60));
            config.forEach((testSet, index) => {
                console.log(`${index + 1}. ${testSet.name} (${testSet.id})`);
                console.log(`   Description: ${testSet.description}`);
                console.log(`   Vocabulary: ${testSet.vocabularyFile}`);
                console.log(`   Quiz: ${testSet.scienceQuizFile}`);
                console.log('');
            });
            console.log('='.repeat(60));

            return config;
        } catch (error) {
            console.error('❌ Error reading config:', error.message);
            return [];
        }
    }
}

module.exports = ConfigUpdater;
