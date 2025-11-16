# 🎬 Media Library - Sistema de Organización Multimedia por Temas

## ¿Qué es?

Media Library te permite **organizar archivos de audio y video por temas** dentro de cada Test Set. Perfecto para estudiar contenido multimedia organizado por tópicos específicos.

## 🚀 Inicio Rápido

### 1. Iniciar Servidor
```bash
npm start
```

### 2. Abrir en Navegador
```
http://localhost:3002/media-library
```

### 3. Uso Básico

1. **Selecciona un Test Set** en la página principal
2. **Abre Media Library** (tarjeta 🎬)
3. **Crea un tema** (ej: "World War I")
4. **Sube archivos** (arrastra o browse)
5. **Reproduce** haciendo clic en ▶️

## 📚 Estructura

```
Test Set: SOCIAL SCIENCE
  ├── Tema: World War I
  │   ├── 🎵 intro.mp3
  │   └── 🎬 documentary.mp4
  │
  └── Tema: Ancient Egypt
      ├── 🎬 pyramids.mp4
      └── 🎵 pharaohs.mp3
```

## ✨ Características

- ✅ Organización por temas
- ✅ Drag & drop para subir archivos
- ✅ Reproductor integrado
- ✅ Filtros (All/Audio/Video)
- ✅ Responsive (móvil/desktop)
- ✅ Límite 100MB por archivo
- ✅ Formatos: MP3, MP4, WAV, WebM, OGG, MOV

## 📖 Documentación Completa

- **[MEDIA_LIBRARY_INSTRUCTIONS.md](MEDIA_LIBRARY_INSTRUCTIONS.md)** - Guía completa de uso
- **[MEDIA_LIBRARY_IMPLEMENTATION_COMPLETE.md](MEDIA_LIBRARY_IMPLEMENTATION_COMPLETE.md)** - Detalles técnicos

## 🎯 Ejemplo de Uso

```
1. Crear tema "World War I"
2. Subir archivos:
   - intro-wwi.mp3 (explicación del tema)
   - battle-somme.mp4 (video documental)
   - timeline.mp3 (línea de tiempo)
3. Estudiar reproduciendo los archivos
```

## 🔧 Archivos Implementados

### Frontend
- `public/media-library.html` - Página principal
- `public/media-manager.js` - Lógica JavaScript

### Backend
- `media-api.js` - API endpoints
- `server.js` - Integración

### Modificados
- `public/index.html` - Nueva tarjeta
- `package.json` - Dependencia multer

## 📊 API Endpoints

```
GET    /api/media/topics/:testSetId  - Obtener temas
POST   /api/media/topics             - Crear tema
DELETE /api/media/topics/:topicId    - Eliminar tema
POST   /api/media/upload             - Subir archivo
DELETE /api/media/file/:fileId       - Eliminar archivo
```

## 🎨 Interfaz

### Vista de Temas
- Listado de todos los temas
- Botón para crear nuevo tema
- Contador de archivos por tema

### Vista de Archivos
- Zona de upload (drag & drop)
- Galería de archivos
- Filtros por tipo
- Reproductor integrado

## ✅ Estado

**Implementación:** 100% Completa
**Testing:** Pendiente
**Documentación:** Completa

---

**¿Preguntas?** Lee la documentación completa en MEDIA_LIBRARY_INSTRUCTIONS.md
