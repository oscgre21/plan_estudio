# Visualizador de Productos ECF - Guía de Uso

## Descripción

Interfaz web moderna e interactiva para visualizar los datos extraídos del endpoint `ecf-transactions/all-production`. El visualizador presenta los datos de manera atractiva con estadísticas, gráficos y tablas interactivas.

## Archivos

- **ecf-products-viewer.html** - Visualizador web completo (HTML + CSS + JS inline)
- **ecf-products-summary.json** - Datos fuente generados por el script de extracción

## Características Principales

### 1. Dashboard de Estadísticas
Muestra métricas clave en tarjetas visuales:
- Total de transacciones procesadas
- Número de productos únicos
- Monto total global en RD$
- Cantidad total de productos

### 2. Top 10 Productos
- Visualización en tarjetas destacadas con gradientes
- Muestra los 10 productos con mayor monto
- Información resumida: monto, cantidad y número de apariciones
- Efecto hover interactivo

### 3. Tabla Interactiva de Productos
- **Búsqueda en tiempo real** - Filtra productos por nombre
- **Ordenamiento de columnas** - Click en encabezados para ordenar
- **Paginación** - Selecciona 10, 25, 50 o 100 items por página
- **Formato de números** - Montos en RD$ con separadores de miles
- **Diseño responsivo** - Se adapta a cualquier dispositivo

## Uso

### Abrir el Visualizador

1. Asegúrate de que ambos archivos estén en el mismo directorio:
   - `ecf-products-viewer.html`
   - `ecf-products-summary.json`

2. Abre el archivo HTML en cualquier navegador:
   ```bash
   # Desde terminal (macOS)
   open ecf-products-viewer.html

   # Desde terminal (Linux)
   xdg-open ecf-products-viewer.html

   # Desde terminal (Windows)
   start ecf-products-viewer.html
   ```

   O simplemente haz doble clic en el archivo HTML.

### Navegación

#### Dashboard de Estadísticas
- Las tarjetas muestran métricas generales
- Pasa el cursor sobre las tarjetas para efecto hover
- El monto total está resaltado en verde

#### Top 10 Productos
- Tarjetas ordenadas por ranking (1-10)
- Cada tarjeta muestra:
  - Nombre del producto
  - Monto total
  - Cantidad de unidades
  - Número de apariciones en transacciones
- Efecto de escala al pasar el cursor

#### Tabla de Productos

**Búsqueda:**
- Escribe en el campo de búsqueda para filtrar productos
- La búsqueda es instantánea (sin necesidad de presionar Enter)
- Busca por nombre de producto

**Ordenamiento:**
- Click en cualquier encabezado de columna para ordenar
- Click nuevamente para invertir el orden
- Indicadores visuales (↑ ↓) muestran la columna y dirección activa

**Paginación:**
- Usa el selector "Mostrar: 10/25/50/100" para cambiar items por página
- Botones "Anterior" y "Siguiente" para navegar
- Contador de página actual y total

**Columnas:**
- **Producto** - Nombre del producto
- **Cantidad** - Total de unidades vendidas
- **Monto Total** - Suma de todos los montos (en verde)
- **Precio Promedio** - Precio unitario promedio
- **Apariciones** - Veces que aparece en transacciones

## Diseño Responsivo

### Desktop (>1024px)
- Dashboard en 4 columnas
- Top 10 en grid de 3 columnas
- Tabla con todas las columnas visibles

### Tablet (768px - 1024px)
- Dashboard en 2 columnas
- Top 10 en 2 columnas
- Tabla con scroll horizontal si es necesario

### Mobile (<768px)
- Dashboard en 1 columna (stack vertical)
- Top 10 en 1 columna
- Tabla se convierte en tarjetas verticales para mejor visualización

## Características Técnicas

### Tecnologías
- HTML5 semántico
- CSS3 con Flexbox y Grid
- JavaScript Vanilla (ES6+)
- No requiere frameworks ni librerías externas

### Compatibilidad
- Chrome (90+)
- Firefox (88+)
- Safari (14+)
- Edge (90+)

### Rendimiento
- Carga inicial rápida (<1 segundo)
- Búsqueda y filtrado instantáneos
- Animaciones suaves con CSS transitions
- Paginación para evitar renderizar 243 productos simultáneamente

## Formato de Datos

### Formato de Montos
- Prefijo: RD$
- Separador de miles: coma (,)
- Decimales: 2 dígitos
- Ejemplo: RD$ 1,234,567.89

### Formato de Cantidades
- Separador de miles: coma (,)
- Decimales: máximo 2 (si aplica)
- Ejemplo: 12,345 o 12,345.50

## Solución de Problemas

### El visualizador no carga datos

**Problema:** Pantalla de carga infinita o mensaje de error

**Soluciones:**
1. Verifica que `ecf-products-summary.json` esté en el mismo directorio
2. Asegúrate de que el archivo JSON sea válido (puedes validarlo en jsonlint.com)
3. Abre la consola del navegador (F12) para ver errores específicos
4. Si abres desde `file://`, algunos navegadores pueden bloquear la carga por seguridad:
   - Usa un servidor local: `python3 -m http.server 8000`
   - O ajusta configuración de seguridad del navegador

### La búsqueda no funciona

**Problema:** No filtra al escribir

**Solución:**
- Asegúrate de que los datos se hayan cargado correctamente
- Recarga la página (Ctrl+R o Cmd+R)
- Verifica que JavaScript esté habilitado en tu navegador

### El diseño se ve mal en móvil

**Problema:** Elementos desalineados o texto muy pequeño

**Solución:**
- Asegúrate de usar un navegador actualizado
- Prueba rotar el dispositivo (portrait/landscape)
- Usa el zoom del navegador para ajustar

## Actualizar Datos

Para actualizar los datos visualizados:

1. Ejecuta el script de extracción para regenerar el JSON:
   ```bash
   node extract-ecf-products.js
   ```

2. El nuevo archivo `ecf-products-summary.json` se generará automáticamente

3. Recarga el visualizador en el navegador (F5 o Cmd+R)

## Personalización

### Cambiar Colores

Edita las variables CSS al inicio del `<style>`:
- Primario: `#2563eb` (azul)
- Secundario: `#10b981` (verde)
- Gradientes: `.header` y `.product-card`

### Cambiar Items por Página

Modifica el valor `selected` en:
```html
<select id="pageSize">
    <option value="25" selected>25</option>
</select>
```

### Ajustar Ordenamiento Inicial

Cambia estas variables en el JavaScript:
```javascript
let sortColumn = 'montoTotal';  // Columna inicial
let sortDirection = 'desc';     // 'asc' o 'desc'
```

## Despliegue

### Servidor Local

Para probar localmente con un servidor:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (si tienes http-server instalado)
npx http-server -p 8000
```

Luego abre: `http://localhost:8000/ecf-products-viewer.html`

### Servidor Web

Para desplegar en producción:

1. Sube ambos archivos al servidor web
2. Asegúrate de que estén en el mismo directorio
3. Configura el servidor para servir archivos estáticos
4. Accede mediante la URL del servidor

**Nota:** El visualizador es completamente estático, no requiere backend.

## Características Avanzadas

### Estados de Carga
- Spinner animado mientras carga el JSON
- Mensajes de error si falla la carga
- Indicadores de estado en todas las operaciones

### Animaciones
- Fade-in al cargar la página
- Hover effects en tarjetas y filas de tabla
- Transiciones suaves en todos los cambios de estado
- Spinner rotatorio en carga

### Accesibilidad
- HTML semántico
- Contraste de colores adecuado
- Navegación por teclado en controles
- Tamaños de fuente legibles

## Soporte

Para reportar problemas o sugerir mejoras:
1. Verifica la consola del navegador (F12)
2. Asegúrate de usar un navegador compatible
3. Confirma que el JSON esté bien formado

## Limitaciones

- Requiere JavaScript habilitado
- Necesita navegador moderno (no soporta IE11)
- El JSON debe estar en el mismo directorio (CORS)
- Máximo recomendado: ~10,000 productos (por rendimiento)

## Próximas Mejoras Sugeridas

- Gráficos de barras con Chart.js
- Exportar datos a Excel/CSV
- Filtros avanzados por rango de montos
- Comparación de periodos
- Dark mode
- Impresión optimizada
