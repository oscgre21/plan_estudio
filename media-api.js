/**
 * Media Library API Endpoints
 * Handles topics and media file management
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const multer = require('multer');

// Helper function to create slug from name
function createSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Helper function to generate unique ID
function generateId() {
    return `topic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to get topics file path
function getTopicsFilePath(testSetId) {
    return path.join(__dirname, 'public', 'media', testSetId, 'topics.json');
}

// Helper function to get topic directory
function getTopicDirectory(testSetId, topicSlug) {
    return path.join(__dirname, 'public', 'media', testSetId, topicSlug);
}

// Helper function to read topics
async function readTopics(testSetId) {
    try {
        const topicsFile = getTopicsFilePath(testSetId);
        const data = await fs.readFile(topicsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // File doesn't exist yet, return empty structure
        return {
            testSetId,
            topics: []
        };
    }
}

// Helper function to write topics
async function writeTopics(testSetId, topicsData) {
    const topicsFile = getTopicsFilePath(testSetId);

    // Ensure directory exists
    const dir = path.dirname(topicsFile);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(topicsFile, JSON.stringify(topicsData, null, 2), 'utf8');
}

// Setup routes
function setupMediaRoutes(app) {
    // ============================================================
    // GET: Get all topics for a test set
    // ============================================================
    app.get('/api/media/topics/:testSetId', async (req, res) => {
        try {
            const { testSetId } = req.params;
            const topicsData = await readTopics(testSetId);

            // Return topics array with file counts
            res.json(topicsData.topics || []);
        } catch (error) {
            console.error('Error getting topics:', error);
            res.status(500).json({ error: 'Failed to get topics' });
        }
    });

    // ============================================================
    // POST: Create new topic
    // ============================================================
    app.post('/api/media/topics', async (req, res) => {
        try {
            const { testSetId, name } = req.body;

            if (!testSetId || !name) {
                return res.status(400).json({ error: 'testSetId and name are required' });
            }

            const topicsData = await readTopics(testSetId);

            // Check if topic already exists
            const exists = topicsData.topics.some(t =>
                t.name.toLowerCase() === name.toLowerCase()
            );

            if (exists) {
                return res.status(400).json({ error: 'Topic already exists' });
            }

            // Create new topic
            const newTopic = {
                id: generateId(),
                name,
                slug: createSlug(name),
                createdAt: new Date().toISOString(),
                files: []
            };

            topicsData.topics.push(newTopic);

            // Create topic directory
            const topicDir = getTopicDirectory(testSetId, newTopic.slug);
            await fs.mkdir(topicDir, { recursive: true });

            // Save topics
            await writeTopics(testSetId, topicsData);

            res.json({ success: true, topic: newTopic });
        } catch (error) {
            console.error('Error creating topic:', error);
            res.status(500).json({ error: 'Failed to create topic' });
        }
    });

    // ============================================================
    // DELETE: Delete topic and all its files
    // ============================================================
    app.delete('/api/media/topics/:topicId', async (req, res) => {
        try {
            const { topicId } = req.params;
            const { testSetId } = req.query;

            if (!testSetId) {
                return res.status(400).json({ error: 'testSetId is required' });
            }

            const topicsData = await readTopics(testSetId);

            // Find topic
            const topic = topicsData.topics.find(t => t.id === topicId);
            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            // Delete topic directory and all files
            const topicDir = getTopicDirectory(testSetId, topic.slug);
            try {
                await fs.rm(topicDir, { recursive: true, force: true });
            } catch (error) {
                console.warn('Error deleting topic directory:', error);
            }

            // Remove topic from array
            topicsData.topics = topicsData.topics.filter(t => t.id !== topicId);

            // Save topics
            await writeTopics(testSetId, topicsData);

            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting topic:', error);
            res.status(500).json({ error: 'Failed to delete topic' });
        }
    });

    // ============================================================
    // POST: Upload media file to topic
    // ============================================================

    // Configure multer to use temp storage first
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Use temp directory first
            const tempDir = path.join(__dirname, 'public', 'media', 'temp');
            fsSync.mkdirSync(tempDir, { recursive: true });
            cb(null, tempDir);
        },
        filename: (req, file, cb) => {
            // Sanitize filename
            const timestamp = Date.now();
            const safeName = file.originalname
                .replace(/[^a-zA-Z0-9.-]/g, '_')
                .replace(/_+/g, '_');
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

    app.post('/api/media/upload', upload.single('file'), async (req, res) => {
        try {
            const { testSetId, topicId } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file provided' });
            }

            // Read topics
            const topicsData = await readTopics(testSetId);
            const topic = topicsData.topics.find(t => t.id === topicId);

            if (!topic) {
                // Delete temp file
                await fs.unlink(file.path);
                return res.status(404).json({ error: 'Topic not found' });
            }

            // Create topic directory if it doesn't exist
            const topicDir = getTopicDirectory(testSetId, topic.slug);
            await fs.mkdir(topicDir, { recursive: true });

            // Move file from temp to topic directory
            const tempPath = file.path;
            const finalPath = path.join(topicDir, file.filename);
            await fs.rename(tempPath, finalPath);

            // Create file entry
            const fileEntry = {
                id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.originalname,
                savedName: file.filename,
                type: file.mimetype,
                size: file.size,
                url: `/media/${testSetId}/${topic.slug}/${file.filename}`,
                uploadedAt: new Date().toISOString()
            };

            // Add to topic files
            if (!topic.files) {
                topic.files = [];
            }
            topic.files.push(fileEntry);

            // Save topics
            await writeTopics(testSetId, topicsData);

            res.json({
                success: true,
                file: fileEntry
            });
        } catch (error) {
            console.error('Error uploading file:', error);

            // Clean up temp file if it exists
            if (req.file && req.file.path) {
                try {
                    await fs.unlink(req.file.path);
                } catch (e) {
                    // Ignore cleanup errors
                }
            }

            res.status(500).json({ error: 'Upload failed: ' + error.message });
        }
    });

    // ============================================================
    // DELETE: Delete media file
    // ============================================================
    app.delete('/api/media/file/:fileId', async (req, res) => {
        try {
            const { fileId } = req.params;
            const { testSetId, topicId } = req.query;

            if (!testSetId || !topicId) {
                return res.status(400).json({ error: 'testSetId and topicId are required' });
            }

            // Read topics
            const topicsData = await readTopics(testSetId);
            const topic = topicsData.topics.find(t => t.id === topicId);

            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            // Find file
            const file = topic.files.find(f => f.id === fileId);
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Delete physical file
            const filePath = path.join(
                __dirname,
                'public',
                'media',
                testSetId,
                topic.slug,
                file.savedName
            );

            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.warn('Error deleting physical file:', error);
            }

            // Remove from topic files
            topic.files = topic.files.filter(f => f.id !== fileId);

            // Save topics
            await writeTopics(testSetId, topicsData);

            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(500).json({ error: 'Failed to delete file' });
        }
    });
}

// Create media directory structure
async function initializeMediaDirectory() {
    const mediaDir = path.join(__dirname, 'public', 'media');
    try {
        await fs.mkdir(mediaDir, { recursive: true });
        console.log('✅ Media directory initialized');
    } catch (error) {
        console.error('Error initializing media directory:', error);
    }
}

module.exports = {
    setupMediaRoutes,
    initializeMediaDirectory
};
