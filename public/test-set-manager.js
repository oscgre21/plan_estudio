/**
 * Test Set Manager
 * Manages test set selection and configuration across all game modules
 */

const TestSetManager = {
    STORAGE_KEY: 'selectedTestSet',
    CONFIG_FILE: 'test-sets-config.json',

    /**
     * Get all available test sets from config
     */
    async getTestSets() {
        try {
            const response = await fetch(this.CONFIG_FILE);
            if (!response.ok) {
                throw new Error('Failed to load test sets configuration');
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading test sets:', error);
            return [];
        }
    },

    /**
     * Get currently selected test set ID from localStorage
     */
    getSelectedTestSetId() {
        return localStorage.getItem(this.STORAGE_KEY) || null;
    },

    /**
     * Set the selected test set ID in localStorage
     */
    setSelectedTestSetId(testSetId) {
        localStorage.setItem(this.STORAGE_KEY, testSetId);
        console.log('✅ Test set selected:', testSetId);
    },

    /**
     * Get the full configuration of the currently selected test set
     */
    async getSelectedTestSet() {
        const selectedId = this.getSelectedTestSetId();
        if (!selectedId) {
            return null;
        }

        const testSets = await this.getTestSets();
        return testSets.find(set => set.id === selectedId) || null;
    },

    /**
     * Get the vocabulary data file path for the current test set
     */
    async getVocabularyFile() {
        const testSet = await this.getSelectedTestSet();
        if (!testSet) {
            // Default fallback
            return 'vocabulary-data.json';
        }
        return testSet.vocabularyFile;
    },

    /**
     * Get the science quiz data file path for the current test set
     */
    async getScienceQuizFile() {
        const testSet = await this.getSelectedTestSet();
        if (!testSet) {
            // Default fallback
            return 'science-quiz-data.json';
        }
        return testSet.scienceQuizFile;
    },

    /**
     * Check if a test set is selected, if not redirect to home
     */
    async ensureTestSetSelected(redirectUrl = '/') {
        const selectedId = this.getSelectedTestSetId();
        if (!selectedId) {
            alert('Please select a test set first / Por favor selecciona un set de pruebas primero');
            window.location.href = redirectUrl;
            return false;
        }

        // Verify the test set still exists in config
        const testSet = await this.getSelectedTestSet();
        if (!testSet) {
            alert('Selected test set not found. Please select again / Set de pruebas no encontrado. Por favor selecciona nuevamente');
            localStorage.removeItem(this.STORAGE_KEY);
            window.location.href = redirectUrl;
            return false;
        }

        return true;
    },

    /**
     * Display current test set name in page header
     */
    async displayCurrentTestSet(elementId = 'currentTestSetName') {
        const testSet = await this.getSelectedTestSet();
        const element = document.getElementById(elementId);

        if (element && testSet) {
            element.textContent = testSet.name;
            element.style.display = 'inline';
        }
    },

    /**
     * Clear test set selection
     */
    clearSelection() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('🗑️ Test set selection cleared');
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.TestSetManager = TestSetManager;
}
