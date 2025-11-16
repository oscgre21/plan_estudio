/**
 * Media Manager - Manages topics and media files
 */
class MediaManager {
    constructor() {
        this.currentTestSetId = null;
        this.currentTestSetName = null;
        this.topics = [];
        this.currentTopic = null;
        this.currentFile = null;
    }

    /**
     * Initialize Media Manager
     */
    async init() {
        try {
            // Get current test set
            const testSet = await TestSetManager.getSelectedTestSet();

            if (!testSet) {
                alert('Please select a test set first\n\nPor favor selecciona un set de pruebas primero');
                window.location.href = '/';
                return;
            }

            this.currentTestSetId = testSet.id;
            this.currentTestSetName = testSet.name;

            // Update header
            document.getElementById('testSetName').textContent = `Test Set: ${testSet.name}`;

            // Load topics
            await this.loadTopics();

            // Setup drag & drop
            this.setupDragAndDrop();

            // Setup file input
            this.setupFileInput();

        } catch (error) {
            console.error('Error initializing Media Manager:', error);
            alert('Error loading Media Library');
        }
    }

    /**
     * Load topics from server
     */
    async loadTopics() {
        try {
            const response = await fetch(`/api/media/topics/${this.currentTestSetId}`);

            if (!response.ok) {
                throw new Error('Failed to load topics');
            }

            this.topics = await response.json();
            this.renderTopics();

        } catch (error) {
            console.error('Error loading topics:', error);
            this.topics = [];
            this.renderTopics();
        }
    }

    /**
     * Render topics grid
     */
    renderTopics() {
        const grid = document.getElementById('topicsGrid');

        if (this.topics.length === 0) {
            grid.innerHTML = `
                <div class="no-topics">
                    <div class="no-topics-icon">📚</div>
                    <p>No topics yet</p>
                    <p style="font-size: 1em; color: #999; margin-top: 10px;">
                        Create your first topic above to organize your media files!
                    </p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.topics.map(topic => {
            const fileCount = topic.files ? topic.files.length : 0;
            const audioCount = topic.files ? topic.files.filter(f => f.type.startsWith('audio')).length : 0;
            const videoCount = topic.files ? topic.files.filter(f => f.type.startsWith('video')).length : 0;

            return `
                <div class="topic-card">
                    <div class="topic-card-icon">📖</div>
                    <div class="topic-card-title">${this.escapeHtml(topic.name)}</div>
                    <div class="topic-card-info">
                        ${fileCount} file${fileCount !== 1 ? 's' : ''}<br>
                        ${videoCount} video${videoCount !== 1 ? 's' : ''}, ${audioCount} audio${audioCount !== 1 ? 's' : ''}
                    </div>
                    <div class="topic-card-actions">
                        <button class="btn btn-primary" onclick="mediaManager.viewTopicFiles('${topic.id}')">
                            View Files
                        </button>
                        <button class="btn btn-danger" onclick="mediaManager.deleteTopic('${topic.id}')">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Create new topic
     */
    async createTopic() {
        const input = document.getElementById('newTopicInput');
        const topicName = input.value.trim();

        if (!topicName) {
            alert('Please enter a topic name\n\nPor favor ingresa un nombre de tema');
            return;
        }

        try {
            const response = await fetch('/api/media/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testSetId: this.currentTestSetId,
                    name: topicName
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create topic');
            }

            // Clear input
            input.value = '';

            // Reload topics
            await this.loadTopics();

            alert(`✅ Topic "${topicName}" created successfully!`);

        } catch (error) {
            console.error('Error creating topic:', error);
            alert('Error creating topic');
        }
    }

    /**
     * Delete topic
     */
    async deleteTopic(topicId) {
        const topic = this.topics.find(t => t.id === topicId);
        if (!topic) return;

        const fileCount = topic.files ? topic.files.length : 0;

        let confirmMsg = `Are you sure you want to delete "${topic.name}"?`;
        if (fileCount > 0) {
            confirmMsg += `\n\nThis will also delete ${fileCount} file(s).`;
        }

        if (!confirm(confirmMsg)) return;

        try {
            const response = await fetch(`/api/media/topics/${topicId}?testSetId=${this.currentTestSetId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete topic');
            }

            await this.loadTopics();

            alert(`✅ Topic "${topic.name}" deleted successfully!`);

        } catch (error) {
            console.error('Error deleting topic:', error);
            alert('Error deleting topic');
        }
    }

    /**
     * View topic files
     */
    viewTopicFiles(topicId) {
        const topic = this.topics.find(t => t.id === topicId);
        if (!topic) return;

        this.currentTopic = topic;

        // Update UI
        document.getElementById('currentTopicName').textContent = topic.name;
        document.getElementById('uploadTopicName').textContent = topic.name;

        // Switch views
        document.getElementById('topicsView').classList.remove('active');
        document.getElementById('filesView').classList.add('active');

        // Render files
        this.renderMediaFiles();
    }

    /**
     * Show topics view
     */
    showTopicsView() {
        document.getElementById('filesView').classList.remove('active');
        document.getElementById('topicsView').classList.add('active');
        this.currentTopic = null;

        // Hide player
        document.getElementById('mediaPlayer').style.display = 'none';
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
        if (!this.currentTopic) {
            alert('Please select a topic first');
            return;
        }

        const validFiles = Array.from(files).filter(file => {
            return file.type.startsWith('audio/') || file.type.startsWith('video/');
        });

        if (validFiles.length === 0) {
            alert('Please select valid audio or video files\n\nPor favor selecciona archivos de audio o video válidos');
            return;
        }

        // Check file sizes
        const maxSize = 100 * 1024 * 1024; // 100MB
        const oversizedFiles = validFiles.filter(f => f.size > maxSize);

        if (oversizedFiles.length > 0) {
            alert(`The following files are too large (max 100MB):\n${oversizedFiles.map(f => f.name).join('\n')}`);
            return;
        }

        for (const file of validFiles) {
            await this.uploadFile(file);
        }

        // Reload topics to get updated file counts
        await this.loadTopics();

        // Refresh current topic
        const updatedTopic = this.topics.find(t => t.id === this.currentTopic.id);
        if (updatedTopic) {
            this.currentTopic = updatedTopic;
            this.renderMediaFiles();
        }
    }

    /**
     * Upload file to server
     */
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('testSetId', this.currentTestSetId);
        formData.append('topicId', this.currentTopic.id);

        try {
            // Show progress
            document.getElementById('uploadProgress').style.display = 'block';
            document.getElementById('uploadStatus').textContent = `Uploading ${file.name}...`;
            document.getElementById('progressFill').style.width = '0%';

            const response = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            // Update progress
            document.getElementById('progressFill').style.width = '100%';
            document.getElementById('uploadStatus').textContent = `✅ ${file.name} uploaded successfully!`;

            setTimeout(() => {
                document.getElementById('uploadProgress').style.display = 'none';
                document.getElementById('progressFill').style.width = '0%';
            }, 2000);

        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Error uploading ${file.name}`);
            document.getElementById('uploadProgress').style.display = 'none';
        }
    }

    /**
     * Render media files
     */
    renderMediaFiles() {
        const grid = document.getElementById('mediaGrid');

        if (!this.currentTopic || !this.currentTopic.files || this.currentTopic.files.length === 0) {
            grid.innerHTML = `
                <div class="no-media">
                    <div class="no-media-icon">📁</div>
                    <p>No media files yet</p>
                    <p style="font-size: 1em; color: #999; margin-top: 10px;">
                        Upload some files to get started!
                    </p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.currentTopic.files.map(file => `
            <div class="media-card" data-type="${file.type.split('/')[0]}">
                <div class="media-icon">
                    ${file.type.startsWith('audio') ? '🎵' : '🎬'}
                </div>
                <div class="media-title">${this.escapeHtml(file.name)}</div>
                <div class="media-details">${this.formatFileSize(file.size)}</div>
                <div class="media-actions">
                    <button onclick="mediaManager.playMedia('${file.id}')">▶️</button>
                    <button onclick="mediaManager.deleteMedia('${file.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Filter media by type
     */
    filterMedia(type) {
        // Update active tab
        document.querySelectorAll('.filter-tabs .tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Filter cards
        const cards = document.querySelectorAll('.media-card');

        cards.forEach(card => {
            if (type === 'all') {
                card.style.display = 'block';
            } else {
                const cardType = card.getAttribute('data-type');
                card.style.display = cardType === type ? 'block' : 'none';
            }
        });
    }

    /**
     * Play media file
     */
    playMedia(fileId) {
        const file = this.currentTopic.files.find(f => f.id === fileId);
        if (!file) return;

        this.currentFile = file;

        // Show player
        document.getElementById('mediaPlayer').style.display = 'block';

        // Setup player
        const audioPlayer = document.getElementById('audioPlayer');
        const videoPlayer = document.getElementById('videoPlayer');

        if (file.type.startsWith('audio')) {
            audioPlayer.style.display = 'block';
            videoPlayer.style.display = 'none';
            document.getElementById('audioSource').src = file.url;
            document.getElementById('audioSource').type = file.type;
            audioPlayer.load();
            audioPlayer.play();
        } else {
            videoPlayer.style.display = 'block';
            audioPlayer.style.display = 'none';
            document.getElementById('videoSource').src = file.url;
            document.getElementById('videoSource').type = file.type;
            videoPlayer.load();
            videoPlayer.play();
        }

        // Update file info
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileDetails').textContent = `${file.type} • ${this.formatFileSize(file.size)}`;

        // Scroll to player
        document.getElementById('mediaPlayer').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Delete media file
     */
    async deleteMedia(fileId) {
        const file = this.currentTopic.files.find(f => f.id === fileId);
        if (!file) return;

        if (!confirm(`Are you sure you want to delete "${file.name}"?\n\n¿Estás seguro de eliminar "${file.name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/media/file/${fileId}?testSetId=${this.currentTestSetId}&topicId=${this.currentTopic.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            // Reload topics
            await this.loadTopics();

            // Refresh current topic
            const updatedTopic = this.topics.find(t => t.id === this.currentTopic.id);
            if (updatedTopic) {
                this.currentTopic = updatedTopic;
                this.renderMediaFiles();
            }

            // Hide player if current file was deleted
            if (this.currentFile && this.currentFile.id === fileId) {
                document.getElementById('mediaPlayer').style.display = 'none';
            }

            alert(`✅ File deleted successfully!`);

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
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Global functions (called from HTML)
const mediaManager = new MediaManager();

function createTopic() {
    mediaManager.createTopic();
}

function showTopicsView() {
    mediaManager.showTopicsView();
}

function filterMedia(type) {
    mediaManager.filterMedia(type);
}
