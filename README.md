# 🌟 Jearlenis Science Quiz - Interactive Learning Platform

Interactive science quiz and vocabulary learning platform for kids, featuring visual word games, vocabulary trainers, and comprehensive quizzes.

## 📚 Features

### 1. **Visual Word Game** 🎨
- Learn vocabulary by matching words with images and animated GIFs
- 30+ words covering Solar System and Geography topics
- Interactive feedback with explanations
- Click-to-reveal translations (English/Spanish)
- Keyboard and mouse support

### 2. **Vocabulary Trainer** 📖
- **Flashcards**: Flip cards to learn word meanings
- **Planet Classification Game**: Drag and drop planets (inner vs outer)
- **Geography Concepts**: Learn hemispheres, continents, and more
- **Match Game**: Pair English words with Spanish translations

### 3. **Science Quiz** ✅
- Full exam simulation with real questions
- True/False questions (keyboard shortcuts: T/F)
- Multiple Choice questions (keyboard shortcuts: A/B/C/D)
- Instant feedback with detailed explanations
- Progress tracking and scoring

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher) and npm, OR
- Docker (recommended for easy setup)

### Option 1: Run with Docker (Recommended)

1. Build the Docker image:
   ```bash
   docker build -t jearlenis-quiz .
   ```

2. Run the container:
   ```bash
   docker run -d -p 3000:3000 --name jearlenis-quiz-container jearlenis-quiz
   ```

3. Open your browser and go to:
   ```
   http://localhost:3000
   ```

4. To stop the container:
   ```bash
   docker stop jearlenis-quiz-container
   ```

5. To remove the container:
   ```bash
   docker rm jearlenis-quiz-container
   ```

### Option 2: Run with Node.js

1. Navigate to the project directory:
   ```bash
   cd Jearlenis_exam
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

### Development Mode

For development with auto-restart on file changes:
```bash
npm run dev
```

## 📂 Project Structure

```
Jearlenis_exam/
├── server.js              # Express server configuration
├── package.json           # Project dependencies
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore file
├── README.md             # This file
├── public/               # Static files served by the server
│   ├── index.html        # Home page with navigation menu
│   ├── visual_word_game.html    # Visual word learning game (90 words, 6 rounds)
│   ├── vocabulary_trainer.html  # Vocabulary practice games
│   └── science_quiz.html        # Full science quiz
└── quiz_images/          # Image assets for quizzes
    ├── globe.jpeg
    ├── hemispheres.jpeg
    └── world_map.jpeg
```

## 🌐 Available Routes

Once the server is running, access these URLs:

- **Home (Menu)**: `http://localhost:3000/`
- **Visual Word Game**: `http://localhost:3000/visual-game`
- **Vocabulary Trainer**: `http://localhost:3000/vocabulary`
- **Science Quiz**: `http://localhost:3000/quiz`

## 🎮 How to Use

### Recommended Learning Path:

1. **Start with Visual Word Game**
   - Learn vocabulary by seeing images and animations
   - Click on English words to see Spanish translations
   - Practice with 6 rounds of 15 words each (90 words total)
   - Topics: Solar System (Basics, Actions, Descriptions) + Geography (Basics, Locations, Weather)

2. **Practice with Vocabulary Trainer**
   - Use flashcards to memorize words
   - Play the planet classification game
   - Match English words with Spanish translations

3. **Take the Science Quiz**
   - Test your knowledge with the full exam
   - Use keyboard shortcuts for faster answers
   - Review explanations for any mistakes

## ⌨️ Keyboard Shortcuts

### Visual Word Game:
- Click images to select answers
- Click on word to toggle translation

### Science Quiz:
- **True/False**: Press `T` for True, `F` for False
- **Multiple Choice**: Press `A`, `B`, `C`, or `D`
- **Navigation**: Click "Next" or "Previous" buttons

## 🛠️ Technical Details

### Technologies Used:
- **Backend**: Node.js with Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with gradients and animations
- **Assets**: Emojis, animated GIFs, static images

### Port Configuration:
The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:
```bash
PORT=8080 npm start
```

## 🔧 Troubleshooting

### Server won't start:
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is already in use

### Images not loading:
- Make sure the `quiz_images` folder is in the project root
- Check browser console for any errors (F12)

### Games not working:
- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Try a different browser (Chrome, Firefox, Safari)

## 📝 Notes

- All games are bilingual (English/Spanish)
- Games work offline once loaded
- No user data is collected or stored
- Optimized for desktop and tablet screens

## 🎯 Learning Topics Covered

### Solar System:
- Planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)
- Concepts: Star, Planet, Orbit, Rotate, Revolve, Axis
- Inner vs Outer planets

### Geography:
- Hemispheres (Northern, Southern, Eastern, Western)
- Lines: Equator, Prime Meridian, Longitude, Latitude
- Continents and Oceans
- Weather vs Climate
- Seasons

## 🤝 Support

If you encounter any issues or have questions:
1. Check the console logs for errors
2. Restart the server
3. Clear browser cache
4. Ensure all dependencies are installed

## 📜 License

This project is for educational purposes.

---

Made with ❤️ for Jearlenis | Powered by Claude Code
