const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class DocumentParser {
    /**
     * Parse a document and extract text
     * @param {string} filePath - Path to the document
     * @returns {Promise<string>} - Extracted text
     */
    static async parse(filePath) {
        const ext = path.extname(filePath).toLowerCase();

        console.log(`📄 Parsing document: ${path.basename(filePath)}`);

        switch (ext) {
            case '.txt':
                return await this.parseTXT(filePath);
            case '.pdf':
                return await this.parsePDF(filePath);
            case '.docx':
                return await this.parseDOCX(filePath);
            default:
                throw new Error(`Unsupported file type: ${ext}. Supported: .txt, .pdf, .docx`);
        }
    }

    /**
     * Parse TXT file
     */
    static async parseTXT(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            console.log(`✅ Parsed TXT file: ${content.length} characters`);
            return content;
        } catch (error) {
            throw new Error(`Failed to parse TXT: ${error.message}`);
        }
    }

    /**
     * Parse PDF file
     */
    static async parsePDF(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            console.log(`✅ Parsed PDF file: ${data.text.length} characters, ${data.numpages} pages`);
            return data.text;
        } catch (error) {
            throw new Error(`Failed to parse PDF: ${error.message}`);
        }
    }

    /**
     * Parse DOCX file
     */
    static async parseDOCX(filePath) {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            console.log(`✅ Parsed DOCX file: ${result.value.length} characters`);
            if (result.messages.length > 0) {
                console.warn('⚠️  Warnings during DOCX parsing:', result.messages);
            }
            return result.value;
        } catch (error) {
            throw new Error(`Failed to parse DOCX: ${error.message}`);
        }
    }

    /**
     * Clean and prepare text for processing
     */
    static cleanText(text) {
        return text
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/\n{3,}/g, '\n\n')  // Remove excessive newlines
            .trim();
    }

    /**
     * Get document statistics
     */
    static getStats(text) {
        const words = text.split(/\s+/).length;
        const characters = text.length;
        const lines = text.split('\n').length;

        return {
            characters,
            words,
            lines,
            estimatedReadingTime: Math.ceil(words / 200) // ~200 words per minute
        };
    }
}

module.exports = DocumentParser;
