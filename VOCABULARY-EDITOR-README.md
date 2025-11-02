# 📝 Vocabulary Editor - CRUD System

A complete web-based CRUD (Create, Read, Update, Delete) system for editing the vocabulary database used in the Audio Listening Game.

## ✨ Features

- **📖 Browse all vocabulary words** - Searchable list with instant filtering
- **✏️ Edit word entries** - Modify words, translations, sentences, and explanations
- **🖼️ Update images** - Change image URLs and emoji for answer options
- **🎵 Regenerate audio** - Re-generate audio files for words and sentences with one click
- **💾 Auto-backup** - Automatic backup before saving changes
- **🔍 Live search** - Filter words as you type
- **✅ Validation** - Mark correct answers for each question

## 🚀 Getting Started

### Prerequisites

1. **Node.js** installed (v14 or higher)
2. **AllTalk TTS Server** running on port 8880
3. **npm** package manager

### Installation

Dependencies are already installed. If needed, run:

```bash
npm install
```

### Starting the Editor

#### Step 1: Start AllTalk TTS Server

Make sure your AllTalk TTS server is running on port 8880. This is required for audio regeneration.

```bash
# In your AllTalk directory
python server.py
```

#### Step 2: Start the Main Server

The vocabulary editor is now integrated into the main server:

```bash
npm start
```

Or manually:

```bash
node server.js
```

#### Step 3: Open the Editor

Open your browser and navigate to:

```
http://localhost:3000/editor
```

**Note**: The CRUD editor is now integrated into the main server (port 3000), not a separate server.

## 📖 How to Use

### Browsing Words

1. The left sidebar shows all vocabulary words
2. Use the search box to filter by English or Spanish text
3. Click on any word to edit it

### Editing a Word

1. **Basic Information**
   - Word (English)
   - Translation (Spanish)
   - Sentence in English
   - Sentence in Spanish
   - Explanation (bilingual)

2. **Audio Files**
   - Click "▶️ Play" to hear current audio
   - Click "🔄 Regenerate" to create new audio using TTS
   - Audio files are automatically saved to the `public/audios/` directory

3. **Answer Options**
   - Each word has 4 options (one correct answer)
   - Edit image URLs, emojis, and labels
   - Check "Correct Answer" to mark the right option
   - Image previews update automatically

### Saving Changes

1. **Save Individual Word**: Click "✅ Save Word" after editing
2. **Save All Changes**: Click "💾 Save All Changes" in the top bar
3. Automatic backup is created before saving

### Regenerating Audio

Click the "🔄 Regenerate" button next to:
- **Word Audio** - Regenerates pronunciation of the word
- **Sentence Audio** - Regenerates the full sentence audio

**Note**: Make sure AllTalk TTS server is running on port 8880

## 🗂️ File Structure

```
Jearlenis_exam/
├── public/
│   ├── vocabulary-data.json          # Main vocabulary database
│   ├── vocabulary-editor.html        # CRUD interface
│   ├── audios/                       # Audio files directory
│   └── vocabulary-data-backup-*.json # Auto-generated backups
├── vocabulary-editor-server.js       # Express API server
└── package.json                      # Dependencies
```

## 🔌 API Endpoints

The editor server provides these REST API endpoints:

### Save Vocabulary

```http
POST /api/save-vocabulary
Content-Type: application/json

[{vocabulary data}]
```

### Regenerate Audio

```http
POST /api/regenerate-audio
Content-Type: application/json

{
  "text": "LOCATION",
  "filename": "word-location.mp3"
}
```

### Get Vocabulary

```http
GET /api/vocabulary
```

## ⚠️ Important Notes

### Before You Start

1. ✅ **Backup**: The system creates automatic backups, but consider manual backups of important data
2. ✅ **TTS Server**: Audio regeneration requires AllTalk TTS running on port 8880
3. ✅ **Unsaved Changes**: The editor warns you before leaving with unsaved changes

### Audio Regeneration

- Uses AllTalk TTS with "af_alloy" voice
- Speed: 1x (normal)
- Format: MP3
- Files are saved to `public/audios/`

### Data Format

The vocabulary data is stored in JSON format:

```json
{
  "word": "PLANET",
  "spanish": "Planeta",
  "sentenceEN": "Earth is a planet in our Solar System.",
  "sentenceES": "La Tierra es un planeta en nuestro Sistema Solar.",
  "options": [
    {
      "emoji": "🪐",
      "label": "Planet",
      "isCorrect": true
    }
  ],
  "explanation": "A planet is a large celestial body...",
  "audioWord": "audios/word-planet.mp3",
  "audioSentence": "audios/sentence-earth-is-a-planet.mp3"
}
```

## 🛠️ Troubleshooting

### "Failed to regenerate audio"

- ✅ Check that AllTalk TTS server is running on port 8880
- ✅ Verify network connectivity to localhost:8880
- ✅ Check TTS server logs for errors

### "Failed to save changes"

- ✅ Ensure the server has write permissions to `public/` directory
- ✅ Check that `vocabulary-data.json` exists
- ✅ Verify disk space is available

### Images not loading

- ✅ Check that image URLs are valid and accessible
- ✅ Verify CORS settings if images are from external sources
- ✅ Check browser console for errors

## 🔐 Security Notes

This editor is designed for **local development use only**:

- No authentication/authorization
- Direct file system access
- Should NOT be exposed to public internet
- Run only on trusted local networks

## 📝 Development

To modify the editor:

1. **Frontend**: Edit `public/vocabulary-editor.html`
2. **Backend**: Edit `vocabulary-editor-server.js`
3. **Restart server** to see changes

## 🎯 Future Enhancements

Possible improvements:

- [ ] Add new vocabulary entries
- [ ] Delete vocabulary entries
- [ ] Bulk operations (edit multiple words)
- [ ] Import/Export functionality
- [ ] Undo/Redo functionality
- [ ] Image upload instead of URLs
- [ ] Audio preview before saving
- [ ] Statistics and analytics

## 📞 Support

If you encounter issues:

1. Check the console for error messages
2. Verify all prerequisites are met
3. Review this documentation
4. Check server logs in terminal

---

**Built with ❤️ for Jearlenis Exam Project**
