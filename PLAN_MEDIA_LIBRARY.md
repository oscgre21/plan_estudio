# Plan: Implementación de Media Library

## 📋 Resumen Ejecutivo

Agregar una nueva sección "Media Library" (Biblioteca Multimedia) al selector de Test Set que permita:
- ✅ Subir archivos de audio y video
- ✅ Reproducir archivos multimedia con controles
- ✅ Gestionar y organizar archivos por Test Set
- ✅ Integrar con la estructura actual del proyecto

---

## 🎯 Objetivos

1. **Crear nueva tarjeta "Media Library"** en el index.html al lado de "Science Quiz"
2. **Página de gestión multimedia** para subir y visualizar archivos
3. **Reproductor multimedia** con controles completos
4. **Almacenamiento organizado** por Test Set
5. **Integración con test-sets-config.json**

---

## 📁 Estructura Actual del Proyecto

```
Jearlenis_exam/
├── public/
│   ├── index.html              # Página principal con selector
│   ├── science_quiz.html       # Quiz de ciencias
│   ├── definition_quiz_game.html
│   ├── test-set-manager.js     # Gestión de test sets
│   ├── test-sets-config.json   # Configuración de test sets
│   ├── audios/                 # Directorio de audios
│   └── media/                  # NUEVO: Directorio de media files
│       ├── audio/
│       │   ├── jearle-social-science/
│       │   ├── aslan-english/
│       │   └── ...
│       └── video/
│           ├── jearle-social-science/
│           ├── aslan-english/
│           └── ...
```

---

## 🏗️ Arquitectura de la Solución

### 1. Nueva Tarjeta en Index.html

**Ubicación:** Entre "Science Quiz" y las demás tarjetas

**Diseño:**
```html
<a href="/media-library" class="card card-6">
    <div class="card-icon">🎬</div>
    <div class="card-title">Media Library</div>
    <div class="card-description">
        Upload and play audio/video files for studying!
        <br><br>
        ¡Sube y reproduce archivos de audio/video para estudiar!
    </div>
</a>
```

**Estilos CSS:**
```css
.card-6 {
    background: linear-gradient(135deg, #f0f8ff 0%, #e0f0ff 100%);
}
```

---

### 2. Nueva Página: media-library.html

**Estructura de la página:**

```
┌─────────────────────────────────────────┐
│         HEADER                           │
│   🎬 Media Library                       │
│   [Home Button]  [Current Test Set]     │
└─────────────────────────────────────────┘
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  📤 Upload Section               │  │
│  │  - Drag & Drop Zone              │  │
│  │  - Browse Files Button           │  │
│  │  - File Type Filter (audio/video)│  │
│  │  - Upload Progress Bar           │  │
│  └──────────────────────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  📂 Media Gallery                │  │
│  │  ┌────┐ ┌────┐ ┌────┐            │  │
│  │  │🎵  │ │🎵  │ │🎬  │            │  │
│  │  │File│ │File│ │File│            │  │
│  │  │ 1  │ │ 2  │ │ 3  │            │  │
│  │  └────┘ └────┘ └────┘            │  │
│  └──────────────────────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  🎵 Media Player                  │  │
│  │  [Preview Area]                   │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━       │  │
│  │  ▶ ⏸ ⏹ 🔊 ⏮ ⏭                   │  │
│  │  00:00 / 03:45                    │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 📝 Implementación Detallada

### Paso 1: Modificar index.html

**Archivo:** `public/index.html`

**Cambios:**

1. Agregar nueva tarjeta "Media Library" después de Science Quiz (línea ~342)
2. Agregar estilo para `.card-6`

**Código a agregar:**

```html
<a href="/media-library" class="card card-6">
    <div class="card-icon">🎬</div>
    <div class="card-title">Media Library</div>
    <div class="card-description">
        Upload and play audio/video files for your test set!
        <br><br>
        ¡Sube y reproduce archivos multimedia para tu set de pruebas!
    </div>
</a>
```

```css
.card-6 { background: linear-gradient(135deg, #f0f8ff 0%, #e0f0ff 100%); }
```

---

### Paso 2: Crear media-library.html

**Archivo:** `public/media-library.html`

**Secciones principales:**

#### A. Header
- Título: "🎬 Media Library"
- Botón de regreso a home
- Mostrar Test Set actual

#### B. Upload Section
```html
<div class="upload-section">
    <h2>📤 Upload Media Files</h2>

    <!-- Drag & Drop Zone -->
    <div class="drop-zone" id="dropZone">
        <div class="drop-zone-icon">📁</div>
        <p>Drag and drop files here</p>
        <p class="drop-zone-hint">or</p>
        <button class="browse-btn" onclick="document.getElementById('fileInput').click()">
            Browse Files
        </button>
        <input type="file" id="fileInput" accept="audio/*,video/*" multiple style="display:none">
    </div>

    <!-- Upload Progress -->
    <div class="upload-progress" id="uploadProgress" style="display:none;">
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        <p id="uploadStatus">Uploading...</p>
    </div>
</div>
```

#### C. Media Gallery
```html
<div class="media-gallery">
    <h2>📂 Your Media Files</h2>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
        <button class="tab active" onclick="filterMedia('all')">All</button>
        <button class="tab" onclick="filterMedia('audio')">🎵 Audio</button>
        <button class="tab" onclick="filterMedia('video')">🎬 Video</button>
    </div>

    <!-- Media Grid -->
    <div class="media-grid" id="mediaGrid">
        <!-- Populated by JavaScript -->
    </div>
</div>
```

#### D. Media Player
```html
<div class="media-player" id="mediaPlayer" style="display:none;">
    <h2>🎵 Now Playing</h2>

    <div class="player-container">
        <!-- Video Player -->
        <video id="videoPlayer" controls style="display:none;" width="100%">
            <source id="videoSource" src="" type="">
            Your browser does not support the video tag.
        </video>

        <!-- Audio Player -->
        <audio id="audioPlayer" controls style="display:none;" width="100%">
            <source id="audioSource" src="" type="">
            Your browser does not support the audio tag.
        </audio>

        <!-- File Info -->
        <div class="file-info">
            <h3 id="fileName">-</h3>
            <p id="fileDetails">-</p>
        </div>

        <!-- Custom Controls (optional - native controls are fine too) -->
        <div class="custom-controls">
            <button class="control-btn" onclick="playPause()">▶/⏸</button>
            <button class="control-btn" onclick="stop()">⏹</button>
            <input type="range" id="seekBar" value="0" max="100" oninput="seek()">
            <span id="timeDisplay">00:00 / 00:00</span>
            <input type="range" id="volumeBar" min="0" max="100" value="100" oninput="changeVolume()">
            <button class="control-btn" onclick="deleteMedia()">🗑️ Delete</button>
        </div>
    </div>
</div>
```

---

### Paso 3: Crear media-manager.js

**Archivo:** `public/media-manager.js`

**Funcionalidades:**

```javascript
class MediaManager {
    constructor() {
        this.currentTestSetId = null;
        this.mediaFiles = [];
        this.currentFile = null;
    }

    /**
     * Initialize Media Manager
     */
    async init() {
        // Get current test set
        this.currentTestSetId = await TestSetManager.getSelectedTestSetId();

        if (!this.currentTestSetId) {
            alert('Please select a test set first');
            window.location.href = '/';
            return;
        }

        // Load media files for current test set
        await this.loadMediaFiles();

        // Setup drag & drop
        this.setupDragAndDrop();

        // Setup file input
        this.setupFileInput();
    }

    /**
     * Load media files from server
     */
    async loadMediaFiles() {
        try {
            const response = await fetch(`/api/media/${this.currentTestSetId}`);
            this.mediaFiles = await response.json();
            this.renderMediaGrid();
        } catch (error) {
            console.error('Error loading media files:', error);
        }
    }

    /**
     * Setup drag and drop
     */
    setupDragAndDrop() {
        const dropZone = document.getElementById('dropZone');

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
    }

    /**
     * Setup file input
     */
    setupFileInput() {
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    /**
     * Handle file upload
     */
    async handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            return file.type.startsWith('audio/') || file.type.startsWith('video/');
        });

        if (validFiles.length === 0) {
            alert('Please select valid audio or video files');
            return;
        }

        for (const file of validFiles) {
            await this.uploadFile(file);
        }

        await this.loadMediaFiles();
    }

    /**
     * Upload file to server
     */
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('testSetId', this.currentTestSetId);

        try {
            // Show progress
            document.getElementById('uploadProgress').style.display = 'block';
            document.getElementById('uploadStatus').textContent = `Uploading ${file.name}...`;

            const response = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            // Update progress
            document.getElementById('uploadStatus').textContent = `✅ ${file.name} uploaded!`;

            setTimeout(() => {
                document.getElementById('uploadProgress').style.display = 'none';
            }, 2000);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Error uploading ${file.name}`);
        }
    }

    /**
     * Render media grid
     */
    renderMediaGrid() {
        const grid = document.getElementById('mediaGrid');

        if (this.mediaFiles.length === 0) {
            grid.innerHTML = '<p class="no-media">No media files yet. Upload some files to get started!</p>';
            return;
        }

        grid.innerHTML = this.mediaFiles.map(file => `
            <div class="media-card" onclick="mediaManager.playMedia('${file.id}')">
                <div class="media-icon">
                    ${file.type.startsWith('audio') ? '🎵' : '🎬'}
                </div>
                <div class="media-title">${file.name}</div>
                <div class="media-details">${this.formatFileSize(file.size)}</div>
                <div class="media-actions">
                    <button onclick="event.stopPropagation(); mediaManager.playMedia('${file.id}')">▶️</button>
                    <button onclick="event.stopPropagation(); mediaManager.deleteMedia('${file.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Play media file
     */
    playMedia(fileId) {
        const file = this.mediaFiles.find(f => f.id === fileId);
        if (!file) return;

        this.currentFile = file;

        // Show player
        document.getElementById('mediaPlayer').style.display = 'block';

        // Setup player
        if (file.type.startsWith('audio')) {
            document.getElementById('audioPlayer').style.display = 'block';
            document.getElementById('videoPlayer').style.display = 'none';
            document.getElementById('audioSource').src = file.url;
            document.getElementById('audioPlayer').load();
            document.getElementById('audioPlayer').play();
        } else {
            document.getElementById('videoPlayer').style.display = 'block';
            document.getElementById('audioPlayer').style.display = 'none';
            document.getElementById('videoSource').src = file.url;
            document.getElementById('videoPlayer').load();
            document.getElementById('videoPlayer').play();
        }

        // Update file info
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileDetails').textContent = `${file.type} • ${this.formatFileSize(file.size)}`;
    }

    /**
     * Delete media file
     */
    async deleteMedia(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const response = await fetch(`/api/media/${fileId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Delete failed');

            await this.loadMediaFiles();

            // Hide player if current file was deleted
            if (this.currentFile && this.currentFile.id === fileId) {
                document.getElementById('mediaPlayer').style.display = 'none';
            }

        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
        }
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /**
     * Filter media by type
     */
    filterMedia(type) {
        const cards = document.querySelectorAll('.media-card');

        cards.forEach(card => {
            if (type === 'all') {
                card.style.display = 'block';
            } else {
                const icon = card.querySelector('.media-icon').textContent;
                const isAudio = icon === '🎵';
                const isVideo = icon === '🎬';

                if (type === 'audio' && isAudio) {
                    card.style.display = 'block';
                } else if (type === 'video' && isVideo) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }
}

// Initialize on page load
const mediaManager = new MediaManager();
window.addEventListener('DOMContentLoaded', () => mediaManager.init());
```

---

### Paso 4: Backend API Endpoints

**Archivo:** `server.js` (o crear nuevo `media-api.js`)

**Endpoints necesarios:**

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const testSetId = req.body.testSetId;
        const fileType = file.mimetype.startsWith('audio') ? 'audio' : 'video';
        const dir = path.join(__dirname, 'public', 'media', fileType, testSetId);

        // Create directory if it doesn't exist
        await fs.mkdir(dir, { recursive: true });

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio and video files are allowed'));
        }
    }
});

// GET: Get all media files for a test set
app.get('/api/media/:testSetId', async (req, res) => {
    try {
        const { testSetId } = req.params;
        const mediaFiles = [];

        // Scan audio directory
        const audioDir = path.join(__dirname, 'public', 'media', 'audio', testSetId);
        try {
            const audioFiles = await fs.readdir(audioDir);
            for (const file of audioFiles) {
                const stats = await fs.stat(path.join(audioDir, file));
                mediaFiles.push({
                    id: `audio-${file}`,
                    name: file,
                    type: 'audio/' + path.extname(file).slice(1),
                    size: stats.size,
                    url: `/media/audio/${testSetId}/${file}`,
                    createdAt: stats.birthtime
                });
            }
        } catch (err) {
            // Directory doesn't exist yet
        }

        // Scan video directory
        const videoDir = path.join(__dirname, 'public', 'media', 'video', testSetId);
        try {
            const videoFiles = await fs.readdir(videoDir);
            for (const file of videoFiles) {
                const stats = await fs.stat(path.join(videoDir, file));
                mediaFiles.push({
                    id: `video-${file}`,
                    name: file,
                    type: 'video/' + path.extname(file).slice(1),
                    size: stats.size,
                    url: `/media/video/${testSetId}/${file}`,
                    createdAt: stats.birthtime
                });
            }
        } catch (err) {
            // Directory doesn't exist yet
        }

        // Sort by creation date (newest first)
        mediaFiles.sort((a, b) => b.createdAt - a.createdAt);

        res.json(mediaFiles);
    } catch (error) {
        console.error('Error getting media files:', error);
        res.status(500).json({ error: 'Failed to get media files' });
    }
});

// POST: Upload media file
app.post('/api/media/upload', upload.single('file'), (req, res) => {
    try {
        res.json({
            success: true,
            file: {
                name: req.file.filename,
                size: req.file.size,
                type: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// DELETE: Delete media file
app.delete('/api/media/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const [type, filename] = fileId.split('-', 2);

        // Get test set from query or session
        const testSetId = req.query.testSetId;

        const filePath = path.join(
            __dirname,
            'public',
            'media',
            type,
            testSetId,
            filename
        );

        await fs.unlink(filePath);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Delete failed' });
    }
});
```

---

### Paso 5: Actualizar test-sets-config.json

**Archivo:** `public/test-sets-config.json`

**Agregar campo opcional para media:**

```json
{
  "id": "jearle-social-science",
  "name": "SOCIAL SCIENCE JEARLE",
  "description": "Jearlenis's Social Science Test Set",
  "vocabularyFile": "vocabulary-data.json",
  "scienceQuizFile": "science-quiz-data.json",
  "mediaEnabled": true  // NUEVO: Indica si tiene media library
}
```

---

### Paso 6: CSS Completo para media-library.html

```css
/* Upload Section */
.upload-section {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 30px;
}

.drop-zone {
    border: 3px dashed #667eea;
    border-radius: 15px;
    padding: 50px;
    text-align: center;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.drop-zone:hover,
.drop-zone.drag-over {
    background: #f0f4ff;
    border-color: #5568d3;
    transform: scale(1.02);
}

.drop-zone-icon {
    font-size: 4em;
    margin-bottom: 15px;
}

.browse-btn {
    padding: 12px 30px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1em;
    cursor: pointer;
    margin-top: 15px;
}

.browse-btn:hover {
    background: #5568d3;
}

/* Media Gallery */
.media-gallery {
    margin-bottom: 30px;
}

.filter-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tab {
    padding: 10px 20px;
    border: 2px solid #667eea;
    background: white;
    color: #667eea;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab.active,
.tab:hover {
    background: #667eea;
    color: white;
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.media-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid #e0e0e0;
}

.media-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
}

.media-icon {
    font-size: 3em;
    margin-bottom: 10px;
}

.media-title {
    font-weight: bold;
    margin-bottom: 5px;
    word-break: break-word;
}

.media-details {
    color: #666;
    font-size: 0.9em;
}

.media-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 15px;
}

.media-actions button {
    padding: 8px 15px;
    border: none;
    background: #667eea;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
}

.media-actions button:hover {
    background: #5568d3;
}

/* Media Player */
.media-player {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 15px;
    margin-top: 30px;
}

.player-container {
    background: white;
    padding: 20px;
    border-radius: 10px;
}

video, audio {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 20px;
}

.file-info {
    text-align: center;
    margin-bottom: 20px;
}

.custom-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.control-btn {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
}

.control-btn:hover {
    background: #5568d3;
}

#seekBar, #volumeBar {
    flex: 1;
    min-width: 150px;
}

.no-media {
    text-align: center;
    color: #666;
    padding: 40px;
    font-size: 1.2em;
}
```

---

## 🔄 Flujo de Usuario

### Flujo 1: Subir Archivos

1. Usuario selecciona un Test Set en index.html
2. Usuario hace clic en "Media Library"
3. Usuario arrastra archivos a la zona de drop o hace clic en "Browse Files"
4. Sistema valida que sean archivos audio/video
5. Sistema sube archivos al servidor
6. Sistema muestra progreso de subida
7. Sistema actualiza la galería con los nuevos archivos

### Flujo 2: Reproducir Archivos

1. Usuario ve la galería de archivos multimedia
2. Usuario hace clic en un archivo
3. Sistema muestra el reproductor correspondiente (audio o video)
4. Usuario puede:
   - Play/Pause
   - Ajustar volumen
   - Avanzar/retroceder
   - Ver tiempo transcurrido

### Flujo 3: Eliminar Archivos

1. Usuario hace clic en botón de eliminar (🗑️)
2. Sistema muestra confirmación
3. Usuario confirma
4. Sistema elimina archivo del servidor
5. Sistema actualiza la galería

---

## 📊 Estructura de Datos

### Media File Object

```json
{
  "id": "audio-1234567890-recording.mp3",
  "name": "recording.mp3",
  "type": "audio/mp3",
  "size": 2457600,
  "url": "/media/audio/jearle-social-science/1234567890-recording.mp3",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "testSetId": "jearle-social-science"
}
```

---

## ✅ Validaciones

### Frontend
- ✅ Validar tipos de archivo (solo audio/video)
- ✅ Validar tamaño máximo (100MB)
- ✅ Validar que hay un Test Set seleccionado
- ✅ Sanitizar nombres de archivo

### Backend
- ✅ Validar MIME type
- ✅ Validar tamaño de archivo
- ✅ Crear directorios si no existen
- ✅ Manejar errores de subida/eliminación
- ✅ Evitar path traversal attacks

---

## 🔒 Seguridad

1. **Validación de tipos de archivo:** Solo audio y video
2. **Límite de tamaño:** 100MB por archivo
3. **Sanitización de nombres:** Remover caracteres especiales
4. **Organización por Test Set:** Cada test set tiene su carpeta
5. **Validación de permisos:** Solo eliminar archivos del test set actual

---

## 📱 Responsive Design

### Desktop (> 768px)
- Galería: 4-5 columnas
- Reproductor: Ancho completo
- Controles: Horizontal

### Tablet (768px - 480px)
- Galería: 2-3 columnas
- Reproductor: Ancho completo
- Controles: Horizontal

### Mobile (< 480px)
- Galería: 1-2 columnas
- Reproductor: Ancho completo
- Controles: Vertical/Apilado

---

## 🚀 Próximos Pasos de Implementación

### Fase 1: Estructura Básica (30 min)
1. ✅ Modificar index.html - agregar tarjeta Media Library
2. ✅ Crear media-library.html con estructura HTML
3. ✅ Agregar estilos CSS básicos

### Fase 2: Frontend (1 hora)
1. ✅ Crear media-manager.js
2. ✅ Implementar drag & drop
3. ✅ Implementar file browser
4. ✅ Implementar galería de archivos
5. ✅ Implementar reproductor multimedia

### Fase 3: Backend (1 hora)
1. ✅ Crear endpoints API
2. ✅ Configurar multer para uploads
3. ✅ Implementar GET /api/media/:testSetId
4. ✅ Implementar POST /api/media/upload
5. ✅ Implementar DELETE /api/media/:fileId

### Fase 4: Integración (30 min)
1. ✅ Crear directorios media/audio y media/video
2. ✅ Probar subida de archivos
3. ✅ Probar reproducción
4. ✅ Probar eliminación
5. ✅ Ajustar estilos y UX

### Fase 5: Testing (30 min)
1. ✅ Probar en diferentes navegadores
2. ✅ Probar con diferentes formatos (MP3, MP4, WAV, etc.)
3. ✅ Probar límites de tamaño
4. ✅ Probar responsive design

---

## 🎨 Mejoras Futuras (Opcional)

1. **Miniaturas de video:** Generar thumbnails para videos
2. **Metadata:** Mostrar duración, bitrate, resolución
3. **Playlists:** Crear listas de reproducción
4. **Búsqueda:** Buscar archivos por nombre
5. **Categorías:** Organizar por categorías personalizadas
6. **Compartir:** Compartir archivos entre test sets
7. **Transcripción:** Transcribir audio a texto automáticamente
8. **Subtítulos:** Agregar subtítulos a videos

---

## 📦 Dependencias Nuevas

### NPM Packages
```bash
npm install multer  # Para manejar uploads de archivos
```

### Archivos Nuevos
```
public/
├── media-library.html       # Página principal de media library
├── media-manager.js         # Lógica frontend
└── media/                   # Directorio de almacenamiento
    ├── audio/
    └── video/
```

### Modificaciones
```
public/index.html           # Agregar tarjeta Media Library
server.js                   # Agregar endpoints API
```

---

## ✅ Checklist de Implementación

- [ ] 1. Agregar tarjeta "Media Library" en index.html
- [ ] 2. Crear media-library.html
- [ ] 3. Crear media-manager.js
- [ ] 4. Agregar estilos CSS
- [ ] 5. Instalar multer en el proyecto
- [ ] 6. Agregar endpoints API en server.js
- [ ] 7. Crear directorios media/audio y media/video
- [ ] 8. Probar subida de archivos
- [ ] 9. Probar reproducción de audio
- [ ] 10. Probar reproducción de video
- [ ] 11. Probar eliminación de archivos
- [ ] 12. Probar filtros (All/Audio/Video)
- [ ] 13. Verificar responsive design
- [ ] 14. Actualizar test-sets-config.json
- [ ] 15. Documentar uso en README

---

## 📚 Documentación para Usuario Final

### Cómo usar Media Library

1. **Seleccionar Test Set**
   - En la página principal, selecciona tu Test Set
   - Haz clic en "Select / Seleccionar"

2. **Abrir Media Library**
   - Haz clic en la tarjeta "Media Library" (🎬)

3. **Subir Archivos**
   - Arrastra archivos a la zona indicada, o
   - Haz clic en "Browse Files" para seleccionar

4. **Reproducir Archivos**
   - Haz clic en cualquier archivo de la galería
   - Usa los controles del reproductor

5. **Eliminar Archivos**
   - Haz clic en el botón 🗑️ en el archivo
   - Confirma la eliminación

### Formatos Soportados

**Audio:**
- MP3
- WAV
- OGG
- M4A
- AAC

**Video:**
- MP4
- WebM
- OGG
- MOV
- AVI

### Límites
- Tamaño máximo por archivo: 100MB
- Sin límite de cantidad de archivos

---

## 🎯 Resumen

Esta implementación agrega una completa **Media Library** al sistema de Test Sets que permite:

✅ Subir archivos de audio y video
✅ Organizar archivos por Test Set
✅ Reproducir multimedia con controles completos
✅ Eliminar archivos no deseados
✅ Filtrar por tipo (audio/video)
✅ Diseño responsive y moderno
✅ Integración perfecta con la estructura existente

**Tiempo estimado de implementación:** 3-4 horas
**Nivel de complejidad:** Medio
**Impacto en código existente:** Mínimo (solo agregar una tarjeta en index.html)
