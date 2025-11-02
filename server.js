const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration for CRUD API
const TTS_ENDPOINT = 'http://localhost:8880/v1/audio/speech';
const AUDIO_DIR = path.join(__dirname, 'public', 'audios');
const VOCABULARY_FILE = path.join(__dirname, 'public', 'vocabulary-data.json');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from quiz_images directory
app.use('/quiz_images', express.static(path.join(__dirname, 'quiz_images')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/visual-game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'visual_word_game.html'));
});

app.get('/vocabulary', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vocabulary_trainer.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'science_quiz.html'));
});

app.get('/audio-game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'audio_listening_game.html'));
});

app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vocabulary-editor.html'));
});

// ============================================================
// CRUD API Endpoints for Vocabulary Editor
// ============================================================

// API endpoint to save vocabulary
app.post('/api/save-vocabulary', (req, res) => {
    try {
        const vocabularyData = req.body;

        // Validate data
        if (!Array.isArray(vocabularyData)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        // Create backup
        const backupPath = path.join(__dirname, 'public', `vocabulary-data-backup-${Date.now()}.json`);
        if (fs.existsSync(VOCABULARY_FILE)) {
            fs.copyFileSync(VOCABULARY_FILE, backupPath);
            console.log(`✅ Backup created: ${backupPath}`);
        }

        // Save new data
        fs.writeFileSync(VOCABULARY_FILE, JSON.stringify(vocabularyData, null, 2), 'utf8');
        console.log(`✅ Vocabulary data saved successfully`);

        res.json({ success: true, message: 'Vocabulary saved successfully', backup: backupPath });
    } catch (error) {
        console.error('Error saving vocabulary:', error);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to regenerate audio
app.post('/api/regenerate-audio', async (req, res) => {
    try {
        const { text, filename } = req.body;

        if (!text || !filename) {
            return res.status(400).json({ error: 'Text and filename are required' });
        }

        console.log(`🎵 Regenerating audio for: "${text}" -> ${filename}`);

        const filepath = path.join(AUDIO_DIR, filename);

        // Delete existing file
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            console.log(`🗑️  Deleted existing: ${filename}`);
        }

        // Generate new audio
        const response = await fetch(TTS_ENDPOINT, {
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

        res.json({ success: true, message: 'Audio regenerated successfully', filename });
    } catch (error) {
        console.error('Error regenerating audio:', error);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get vocabulary
app.get('/api/vocabulary', (req, res) => {
    try {
        const data = fs.readFileSync(VOCABULARY_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading vocabulary:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// Start server
// ============================================================
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   🌟 Jearlenis Science Quiz Server is Running! 🌟        ║
    ║                                                           ║
    ║   Server: http://localhost:${PORT}                          ║
    ║                                                           ║
    ║   Available Routes:                                       ║
    ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
    ║   📚 Home (Menu):          http://localhost:${PORT}/           ║
    ║   🎨 Visual Word Game:     http://localhost:${PORT}/visual-game║
    ║   🎧 Audio Listening Game: http://localhost:${PORT}/audio-game ║
    ║   📖 Vocabulary Trainer:   http://localhost:${PORT}/vocabulary ║
    ║   ✅ Science Quiz:         http://localhost:${PORT}/quiz       ║
    ║   📝 Vocabulary Editor:    http://localhost:${PORT}/editor     ║
    ║                                                           ║
    ║   API Endpoints (CRUD):                                   ║
    ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
    ║   POST /api/save-vocabulary   - Save vocabulary changes   ║
    ║   POST /api/regenerate-audio  - Regenerate audio file    ║
    ║   GET  /api/vocabulary        - Get vocabulary data      ║
    ║                                                           ║
    ║   Press CTRL+C to stop the server                         ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
});
