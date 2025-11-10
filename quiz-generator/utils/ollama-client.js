const axios = require('axios');

class OllamaClient {
    constructor(baseURL = 'http://localhost:11434', model = 'kimi-k2:1t-cloud') {
        this.baseURL = baseURL;
        this.model = model;
        this.axios = axios.create({
            baseURL: this.baseURL,
            timeout: 300000, // 5 minutes timeout for large requests
        });
    }

    /**
     * Test connection to Ollama
     */
    async testConnection() {
        try {
            const response = await this.axios.get('/api/tags');
            const models = response.data.models || [];
            const hasModel = models.some(m => m.name === this.model);

            if (!hasModel) {
                console.warn(`⚠️  Model "${this.model}" not found. Available models:`, models.map(m => m.name));
                return false;
            }

            console.log(`✅ Connected to Ollama. Model "${this.model}" is available.`);
            return true;
        } catch (error) {
            console.error('❌ Failed to connect to Ollama:', error.message);
            return false;
        }
    }

    /**
     * Generate text using Ollama
     * @param {string} prompt - The prompt to send to the model
     * @param {object} options - Additional options
     * @returns {Promise<string>} - The generated text
     */
    async generate(prompt, options = {}) {
        try {
            console.log(`🤖 Generating with ${this.model}...`);

            const response = await this.axios.post('/api/generate', {
                model: this.model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: options.temperature || 0.7,
                    top_p: options.top_p || 0.9,
                    top_k: options.top_k || 40,
                    num_predict: options.num_predict || 4000,
                }
            });

            const generatedText = response.data.response;
            console.log(`✅ Generated ${generatedText.length} characters`);

            return generatedText;
        } catch (error) {
            console.error('❌ Error generating text:', error.message);
            throw error;
        }
    }

    /**
     * Generate and parse JSON response
     * @param {string} prompt - The prompt to send
     * @param {object} options - Additional options
     * @returns {Promise<object>} - Parsed JSON object
     */
    async generateJSON(prompt, options = {}) {
        const text = await this.generate(prompt, options);

        try {
            // Try to find JSON in the response (in case there's extra text)
            const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // If no JSON found, try parsing the whole text
            return JSON.parse(text);
        } catch (error) {
            console.error('❌ Failed to parse JSON from response');
            console.error('Response was:', text.substring(0, 500));
            throw new Error('Invalid JSON response from model');
        }
    }

    /**
     * Generate with retry logic
     * @param {string} prompt - The prompt to send
     * @param {number} maxRetries - Maximum number of retries
     * @param {object} options - Additional options
     * @returns {Promise<string>} - The generated text
     */
    async generateWithRetry(prompt, maxRetries = 3, options = {}) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await this.generate(prompt, options);
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`⚠️  Retry ${i + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    /**
     * Generate JSON with retry logic
     * @param {string} prompt - The prompt to send
     * @param {number} maxRetries - Maximum number of retries
     * @param {object} options - Additional options
     * @returns {Promise<object>} - Parsed JSON object
     */
    async generateJSONWithRetry(prompt, maxRetries = 3, options = {}) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await this.generateJSON(prompt, options);
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`⚠️  JSON parse failed. Retry ${i + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
}

module.exports = OllamaClient;
