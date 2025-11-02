const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
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

// Start server
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
    ║   📖 Vocabulary Trainer:   http://localhost:${PORT}/vocabulary ║
    ║   ✅ Science Quiz:         http://localhost:${PORT}/quiz       ║
    ║                                                           ║
    ║   Press CTRL+C to stop the server                         ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
});
