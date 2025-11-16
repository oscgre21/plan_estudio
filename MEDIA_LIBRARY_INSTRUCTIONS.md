# Media Library - Instrucciones de Uso

## 🎬 ¿Qué es Media Library?

Media Library es una funcionalidad que te permite **organizar archivos de audio y video por temas** dentro de cada Test Set. Es perfecta para estudiar contenido multimedia organizado por tópicos específicos.

## 📚 Estructura Organizacional

```
Test Set (ej: "SOCIAL SCIENCE JEARLE")
  │
  ├── Tema 1: "World War I"
  │   ├── 🎵 intro-wwi.mp3
  │   ├── 🎬 wwi-documentary.mp4
  │   └── 🎵 timeline-wwi.mp3
  │
  ├── Tema 2: "Ancient Egypt"
  │   ├── 🎬 pyramids-tour.mp4
  │   ├── 🎵 pharaohs.mp3
  │   └── 🎬 hieroglyphics.mp4
  │
  └── Tema 3: "Renaissance"
      ├── 🎵 art-renaissance.mp3
      └── 🎬 michelangelo.mp4
```

## 🚀 Cómo Usar

### 1. Seleccionar Test Set

Primero, debes seleccionar un Test Set en la página principal:

1. Ve a http://localhost:3002/
2. En el selector "Select Test Set", elige tu test set
3. Haz clic en "Select / Seleccionar"

### 2. Abrir Media Library

Haz clic en la tarjeta **"Media Library"** (🎬) en la página principal.

### 3. Crear un Tema

1. En la sección "➕ Add New Topic", ingresa el nombre del tema
   - Ejemplo: "World War I", "Ancient Egypt", "Cell Biology"
2. Haz clic en **"Create Topic"**
3. El tema aparecerá en la lista de temas

### 4. Subir Archivos a un Tema

1. Haz clic en **"View Files"** en el tema donde quieres subir archivos
2. En la sección de upload puedes:
   - **Arrastrar y soltar** archivos en la zona indicada, o
   - Hacer clic en **"Browse Files"** para seleccionar archivos

3. Archivos soportados:
   - **Audio:** MP3, WAV, OGG, M4A, AAC
   - **Video:** MP4, WebM, OGG, MOV
   - **Tamaño máximo:** 100MB por archivo

4. El archivo se subirá automáticamente

### 5. Ver y Reproducir Archivos

1. Los archivos aparecerán en la galería con iconos:
   - 🎵 = Audio
   - 🎬 = Video

2. Puedes filtrar por tipo:
   - **All:** Muestra todos los archivos
   - **🎵 Audio:** Solo archivos de audio
   - **🎬 Video:** Solo archivos de video

3. Para reproducir:
   - Haz clic en el botón **▶️** del archivo
   - El reproductor se abrirá abajo con controles completos

### 6. Eliminar Archivos

1. Haz clic en el botón **🗑️** del archivo que quieres eliminar
2. Confirma la eliminación

### 7. Eliminar un Tema

1. En la vista de temas, haz clic en **"Delete"** del tema
2. Confirma la eliminación
3. **Nota:** Esto eliminará también todos los archivos del tema

### 8. Volver a la Lista de Temas

Haz clic en **"📚 Topics"** en la breadcrumb (arriba) para volver a la lista de temas.

## 💡 Ejemplos de Uso

### Ejemplo 1: Organizar contenido de Historia

```
Test Set: SOCIAL SCIENCE JEARLE

Tema: "World War I"
  ├── explicacion-wwi.mp3 (audio explicativo)
  ├── batalla-somme.mp4 (video documental)
  └── linea-tiempo.mp3 (timeline narrada)

Tema: "Ancient Rome"
  ├── fundacion-roma.mp3
  ├── coliseo-tour.mp4
  └── emperadores.mp3
```

### Ejemplo 2: Organizar contenido de Ciencias

```
Test Set: BIOLOGY EXAM

Tema: "Cell Structure"
  ├── cell-parts.mp3 (explicación de partes)
  ├── mitosis-animation.mp4 (animación del proceso)
  └── membrane-function.mp3

Tema: "Photosynthesis"
  ├── photosynthesis-intro.mp3
  ├── light-reactions.mp4
  └── calvin-cycle.mp3
```

### Ejemplo 3: Organizar clases grabadas

```
Test Set: ENGLISH LESSONS

Tema: "Lesson 1 - Present Simple"
  ├── lecture-part1.mp4
  ├── lecture-part2.mp4
  └── exercises-audio.mp3

Tema: "Lesson 2 - Past Simple"
  ├── lecture.mp4
  ├── examples.mp3
  └── pronunciation-guide.mp3
```

## 🎯 Consejos de Uso

### Para Mejores Resultados:

1. **Nombres descriptivos:**
   - ✅ Bueno: "World War I - Causes and Effects"
   - ❌ Malo: "Tema 1"

2. **Nombres de archivos claros:**
   - ✅ Bueno: "wwi-battle-of-somme.mp4"
   - ❌ Malo: "video1.mp4"

3. **Organización por temas:**
   - Agrupa contenido relacionado en el mismo tema
   - Un tema = un tópico específico

4. **Formatos recomendados:**
   - **Audio:** MP3 (mejor compatibilidad)
   - **Video:** MP4 (mejor compatibilidad)

5. **Tamaño de archivos:**
   - Para videos largos, considera dividirlos en partes
   - Mantén archivos bajo 50MB cuando sea posible

## 📂 Estructura de Archivos en el Servidor

Los archivos se guardan en:

```
public/media/
└── {test-set-id}/
    ├── topics.json              # Metadata de temas
    └── {topic-slug}/            # Carpeta del tema
        ├── archivo1.mp4
        ├── archivo2.mp3
        └── ...
```

Ejemplo:
```
public/media/
└── jearle-social-science/
    ├── topics.json
    ├── world-war-i/
    │   ├── 1737382000-intro-wwi.mp3
    │   └── 1737382100-documentary.mp4
    └── ancient-egypt/
        ├── 1737382200-pyramids.mp4
        └── 1737382300-pharaohs.mp3
```

## 🔒 Seguridad

- ✅ Solo se aceptan archivos de audio y video
- ✅ Límite de 100MB por archivo
- ✅ Nombres de archivos sanitizados automáticamente
- ✅ Organización por Test Set (no se mezclan entre sets)
- ✅ Timestamps añadidos a nombres para evitar conflictos

## ❓ Solución de Problemas

### El archivo no se sube

1. Verifica que sea un archivo de audio o video válido
2. Verifica que no exceda 100MB
3. Verifica que hayas seleccionado un tema primero
4. Verifica que el servidor esté corriendo

### No veo mis temas

1. Verifica que hayas seleccionado un Test Set
2. Recarga la página
3. Verifica la consola del navegador para errores

### El reproductor no funciona

1. Verifica que el formato del archivo sea soportado
2. Prueba con otro navegador
3. Verifica que el archivo se haya subido correctamente

### Error al eliminar

1. Verifica que tengas permisos de escritura en la carpeta
2. Verifica que el archivo no esté en uso
3. Intenta de nuevo

## 🎓 Caso de Uso Completo: Preparación para Examen

### Escenario:
Jearlenis tiene un examen de Social Science sobre la Primera Guerra Mundial.

### Pasos:

1. **Crear Test Set** (ya hecho): "SOCIAL SCIENCE JEARLE"

2. **Crear Temas:**
   - "WWI - Causes" (causas)
   - "WWI - Major Battles" (batallas principales)
   - "WWI - Consequences" (consecuencias)

3. **Subir Material de Estudio:**

   **Tema: "WWI - Causes"**
   - causes-explanation.mp3 (profesor explicando)
   - alliances-video.mp4 (video sobre alianzas)
   - timeline-intro.mp3 (línea de tiempo narrada)

   **Tema: "WWI - Major Battles"**
   - battle-of-somme.mp4 (documental)
   - battle-maps.mp3 (audio describiendo mapas)
   - trench-warfare.mp4 (video sobre trincheras)

   **Tema: "WWI - Consequences"**
   - treaty-versailles.mp3 (explicación del tratado)
   - aftermath-video.mp4 (video de consecuencias)
   - summary.mp3 (resumen general)

4. **Estudiar:**
   - Día 1: Escuchar todo el material de "Causes"
   - Día 2: Ver videos de "Major Battles"
   - Día 3: Repasar "Consequences"
   - Día 4: Repasar todo seleccionando archivos aleatorios

5. **Beneficios:**
   - ✅ Todo organizado por tema
   - ✅ Fácil acceso y reproducción
   - ✅ Puede estudiar en cualquier orden
   - ✅ Puede repetir secciones difíciles

## 📱 Uso en Dispositivos Móviles

La interfaz es **responsive** y funciona en:
- 📱 Teléfonos móviles
- 📟 Tablets
- 💻 Computadoras

## 🎉 ¡Listo!

Ahora puedes organizar todo tu contenido multimedia de estudio de forma profesional y acceder a él fácilmente.

---

**Recuerda:** Los archivos están organizados por Test Set, así que asegúrate de tener el Test Set correcto seleccionado antes de trabajar en Media Library.
