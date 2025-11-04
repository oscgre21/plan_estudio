# Quick Start - Visualizador ECF

## Inicio Rápido en 3 Pasos

### 1. Extraer Datos del Endpoint

```bash
node extract-ecf-products.js
```

**Resultado:** Se generan los archivos JSON con todos los datos procesados:
- `ecf-products-summary.json` (raíz del proyecto)
- `public/ecf-products-summary.json` (servido por Express)

### 2. Iniciar el Servidor

```bash
npm start
```

o

```bash
node server.js
```

### 3. Abrir el Visualizador

Abre tu navegador en: **http://localhost:3000/ecf-viewer**

---

## Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `extract-ecf-products.js` | Script para extraer datos del API |
| `ecf-products-viewer.html` | Visualizador web |
| `ecf-products-summary.json` | Datos procesados (generado automáticamente) |
| `server.js` | Servidor Express con ruta `/ecf-viewer` |

---

## Actualizar Datos

Para obtener datos frescos del API:

```bash
# 1. Ejecuta el script de extracción
node extract-ecf-products.js

# 2. Recarga la página en el navegador
# Presiona F5 o Cmd+R
```

---

## Características del Visualizador

- ✅ Dashboard con 4 métricas clave
- ✅ Top 10 productos destacados
- ✅ Tabla interactiva con 243 productos
- ✅ Búsqueda en tiempo real
- ✅ Ordenamiento por columnas
- ✅ Paginación (10/25/50/100)
- ✅ Diseño responsivo
- ✅ Sin dependencias externas

---

## Configuración del Script de Extracción

El script está configurado para conectarse a:

- **API Base URL:** `https://dgiiapi.oscgre.com/api/v1`
- **Usuario:** `msfissa`
- **Endpoint:** `/ecf-transactions/all-production`

Para cambiar la configuración, edita `extract-ecf-products.js`:

```javascript
const BASE_URL = 'https://dgiiapi.oscgre.com/api/v1';
const LOGIN_CREDENTIALS = {
  usernameOrEmail: 'msfissa',
  password: 'Msf1ss@'
};
```

---

## Solución Rápida de Problemas

### El visualizador no carga datos

**Problema:** Pantalla de carga infinita

**Solución:**
1. Verifica que `ecf-products-summary.json` exista
2. Ejecuta: `node extract-ecf-products.js`
3. Recarga el navegador

### Error 404 en /ecf-viewer

**Problema:** Página no encontrada

**Solución:**
1. Verifica que el servidor esté corriendo: `node server.js`
2. Asegúrate de que `ecf-products-viewer.html` esté en la raíz del proyecto

### El script de extracción falla

**Problema:** Error de autenticación

**Solución:**
1. Verifica que el API esté accesible: `https://dgiiapi.oscgre.com`
2. Confirma las credenciales en `extract-ecf-products.js`
3. Revisa la consola para errores específicos

---

## Estructura del JSON Generado

```json
{
  "metadata": {
    "fechaGeneracion": "2025-11-04T...",
    "totalTransacciones": 205,
    "totalProductosUnicos": 243,
    "montoTotalGlobal": 6821312.82,
    "cantidadTotalGlobal": 30056
  },
  "resumen": {
    "top10ProductosPorMonto": [...]
  },
  "productoDetallado": [
    {
      "nombre": "PRODUCTO X",
      "cantidadTotal": 100,
      "montoTotal": 15000,
      "precioUnitarioPromedio": 150,
      "apariciones": 5
    }
  ]
}
```

---

## Rutas del Servidor

Todas las rutas disponibles después de iniciar el servidor:

```
http://localhost:3000/                   - Home
http://localhost:3000/visual-game        - Visual Word Game
http://localhost:3000/audio-game         - Audio Listening Game
http://localhost:3000/definition-quiz    - Definition Quiz
http://localhost:3000/vocabulary         - Vocabulary Trainer
http://localhost:3000/quiz               - Science Quiz
http://localhost:3000/editor             - Vocabulary Editor
http://localhost:3000/ecf-viewer         - ECF Products Viewer ⭐
```

---

## Comandos Útiles

```bash
# Extraer datos
node extract-ecf-products.js

# Iniciar servidor
npm start

# Iniciar servidor (alternativa)
node server.js

# Ver el JSON generado
cat ecf-products-summary.json | python3 -mjson.tool | less

# Verificar tamaño del JSON
ls -lh ecf-products-summary.json
```

---

## Documentación Completa

Para más detalles, consulta:

- `VISUALIZADOR_README.md` - Guía completa del visualizador
- `ECF_EXTRACTION_README.md` - Documentación del script de extracción

---

## Soporte

Para problemas o preguntas:

1. Revisa la consola del navegador (F12) para errores
2. Verifica los logs del servidor en la terminal
3. Consulta la documentación completa en los archivos README

---

**¡Listo para usar!** 🚀
