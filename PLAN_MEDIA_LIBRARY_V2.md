# Plan ACTUALIZADO: Media Library con Estructura de Temas

## 📋 Nueva Estructura

Los archivos multimedia estarán organizados por **TEMAS** dentro de cada Test Set:

```
Test Set: "SOCIAL SCIENCE JEARLE"
  └── Tema: "World War I"
      ├── 🎵 Audio: intro-wwi.mp3
      ├── 🎬 Video: wwi-documentary.mp4
      └── 🎵 Audio: timeline-wwi.mp3

  └── Tema: "Ancient Egypt"
      ├── 🎬 Video: pyramids-tour.mp4
      ├── 🎵 Audio: pharaohs.mp3
      └── 🎬 Video: hieroglyphics.mp4
```

## 🎯 Interfaz Usuario

### Vista Principal (Listado de Temas)

```
┌─────────────────────────────────────────────┐
│  🎬 Media Library                            │
│  Test Set: SOCIAL SCIENCE JEARLE            │
│  [Home] [Add New Topic]                     │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │ ➕ Add New Topic                     │  │
│  │ [Topic Name Input] [Create]          │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  📚 Your Topics:                             │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │ 📖 World War I                      │    │
│  │ 3 files (2 videos, 1 audio)         │    │
│  │ [View Files] [Delete Topic]         │    │
│  └────────────────────────────────────┘    │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │ 📖 Ancient Egypt                    │    │
│  │ 5 files (3 videos, 2 audios)        │    │
│  │ [View Files] [Delete Topic]         │    │
│  └────────────────────────────────────┘    │
│                                              │
└─────────────────────────────────────────────┘
```

### Vista de Archivos de un Tema

```
┌─────────────────────────────────────────────┐
│  🎬 Media Library > World War I              │
│  [← Back to Topics]  [Upload Files]         │
├─────────────────────────────────────────────┤
│                                              │
│  📤 Upload Files to "World War I"            │
│  ┌──────────────────────────────────────┐  │
│  │  Drag & Drop or Browse Files         │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  📂 Files in this Topic:                     │
│  [All] [🎵 Audio] [🎬 Video]                 │
│                                              │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │🎵   │ │🎬   │ │🎵   │                   │
│  │intro│ │doc  │ │time │                   │
│  │.mp3 │ │.mp4 │ │.mp3 │                   │
│  │▶ 🗑 │ │▶ 🗑 │ │▶ 🗑 │                   │
│  └─────┘ └─────┘ └─────┘                   │
│                                              │
│  🎵 Now Playing: intro-wwi.mp3               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━              │
│  ▶ ⏸ ⏹ 🔊 00:32 / 02:15                    │
│                                              │
└─────────────────────────────────────────────┘
```

## 📊 Estructura de Datos

### topics.json (por Test Set)

```json
{
  "testSetId": "jearle-social-science",
  "topics": [
    {
      "id": "topic-1",
      "name": "World War I",
      "createdAt": "2025-01-15T10:00:00Z",
      "files": [
        {
          "id": "file-1",
          "name": "intro-wwi.mp3",
          "type": "audio/mp3",
          "size": 2457600,
          "url": "/media/jearle-social-science/world-war-i/intro-wwi.mp3",
          "uploadedAt": "2025-01-15T10:30:00Z"
        },
        {
          "id": "file-2",
          "name": "wwi-documentary.mp4",
          "type": "video/mp4",
          "size": 45678900,
          "url": "/media/jearle-social-science/world-war-i/wwi-documentary.mp4",
          "uploadedAt": "2025-01-15T10:35:00Z"
        }
      ]
    },
    {
      "id": "topic-2",
      "name": "Ancient Egypt",
      "createdAt": "2025-01-15T11:00:00Z",
      "files": [...]
    }
  ]
}
```

### Estructura de Directorios

```
public/media/
└── {testSetId}/
    ├── topics.json              # Metadata de temas
    └── {topic-slug}/
        ├── video1.mp4
        ├── audio1.mp3
        └── ...
```

Ejemplo:
```
public/media/
└── jearle-social-science/
    ├── topics.json
    ├── world-war-i/
    │   ├── intro-wwi.mp3
    │   └── wwi-documentary.mp4
    └── ancient-egypt/
        ├── pyramids-tour.mp4
        └── pharaohs.mp3
```

## 🚀 Implementación

