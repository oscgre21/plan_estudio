# Plan Simplificado - Filtrado por Fecha en Visualizador

## 📋 Concepto Principal

### Estrategia
1. El script extrae **TODOS** los datos incluyendo fecha de cada transacción
2. El JSON incluye `date_transaction` en cada producto/transacción
3. El **VISUALIZADOR** filtra dinámicamente en el navegador
4. Muestra **top 30 productos** por monto según el filtro de fecha aplicado

### Ventajas
- ✓ Script simple - solo extrae todo una vez
- ✓ Sin argumentos de línea de comandos
- ✓ Filtrado instantáneo en el navegador (sin recargar)
- ✓ Múltiples filtros sin regenerar JSON
- ✓ Más rápido para el usuario final

---

## 📐 Arquitectura

### PASO 1: Modificar extract-ecf-products.js

**Cambios Mínimos:**
- Mantener cada producto con su información de transacción
- Incluir array de transacciones con fechas
- No agregar por nombre todavía - dejar datos granulares

**Nueva Estructura JSON:**

```json
{
  "metadata": {
    "fechaGeneracion": "2025-11-04T...",
    "totalTransacciones": 205,
    "rangoFechas": {
      "fechaMinima": "2025-09-15T...",
      "fechaMaxima": "2025-11-04T..."
    }
  },
  "productosDetallados": [
    {
      "nombre": "MK-POLO TECNIC PLUS BLANCO LARGE",
      "cantidadTotal": 10,
      "montoTotal": 2850,
      "precioUnitarioPromedio": 285,
      "transacciones": [
        {
          "fecha": "2025-10-14T21:36:08.916Z",
          "eNCF": "E320000000031",
          "cantidad": 1,
          "monto": 285
        }
      ]
    }
  ]
}
```

### PASO 2: Actualizar Visualizador

**Nuevos Componentes UI:**

```
┌───────────────────────────────────────────────────────────────┐
│ 📅 FILTRAR POR FECHA                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                               │
│ Filtro Rápido:                                                │
│ [●] Todos    [ ] Últimos 7 días    [ ] Últimos 30 días      │
│                                                               │
│ Rango Personalizado:                                          │
│ Desde: [2025-10-01]  Hasta: [2025-10-31]  [Filtrar]         │
│                                                               │
│ 📊 Mostrando: 2025-10-14 al 2025-11-04 (21 días)            │
│     Transacciones: 45 | Productos: 120 items                 │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementación Detallada

### PARTE 1: Modificar Script (extract-ecf-products.js)

**Cambio en extractProductsFromTransaction():**

```javascript
// ANTES: Retorna productos sin fecha
function extractProductsFromTransaction(transaction) {
  return [{
    nombre: "Producto X",
    cantidad: 1,
    monto: 100
  }];
}

// DESPUÉS: Retorna productos CON fecha de transacción
function extractProductsFromTransaction(transaction) {
  return items.map(item => ({
    nombre: item.NombreItem,
    cantidad: parseFloat(item.CantidadItem || 0),
    precioUnitario: parseFloat(item.PrecioUnitarioItem || 0),
    monto: parseFloat(item.MontoItem || 0),

    // NUEVO: Información de transacción
    transactionDate: transaction.date_transaction,
    eNCF: transaction.eNCF,
    transactionId: transaction.uuid
  }));
}
```

**Nueva función de agrupación:**

```javascript
function groupProductsByName(allProducts) {
  const grouped = {};

  allProducts.forEach(product => {
    if (!grouped[product.nombre]) {
      grouped[product.nombre] = {
        nombre: product.nombre,
        cantidadTotal: 0,
        montoTotal: 0,
        transacciones: []
      };
    }

    grouped[product.nombre].cantidadTotal += product.cantidad;
    grouped[product.nombre].montoTotal += product.monto;
    grouped[product.nombre].transacciones.push({
      fecha: product.transactionDate,
      eNCF: product.eNCF,
      cantidad: product.cantidad,
      monto: product.monto
    });
  });

  return Object.values(grouped);
}
```

### PARTE 2: JavaScript del Visualizador

```javascript
// Variable global con todos los datos
let allProductsData = [];
let currentFilter = {
  dateFrom: null,
  dateTo: null
};

// Cargar datos iniciales
async function loadData() {
  const response = await fetch('ecf-products-summary.json');
  const data = await response.json();

  allProductsData = data.productosDetallados;

  // Configurar rango de fechas disponibles
  const minDate = new Date(data.metadata.rangoFechas.fechaMinima);
  const maxDate = new Date(data.metadata.rangoFechas.fechaMaxima);

  // Mostrar todos por defecto
  renderFilteredData(allProductsData);
}

// Filtrar por fecha
function filterByDateRange(dateFrom, dateTo) {
  const filtered = [];

  allProductsData.forEach(product => {
    // Filtrar transacciones del producto por fecha
    const filteredTransactions = product.transacciones.filter(tx => {
      const txDate = new Date(tx.fecha);
      return txDate >= dateFrom && txDate <= dateTo;
    });

    if (filteredTransactions.length > 0) {
      // Recalcular totales solo para las transacciones en el rango
      const cantidadTotal = filteredTransactions.reduce((sum, tx) => sum + tx.cantidad, 0);
      const montoTotal = filteredTransactions.reduce((sum, tx) => sum + tx.monto, 0);

      filtered.push({
        nombre: product.nombre,
        cantidadTotal: cantidadTotal,
        montoTotal: montoTotal,
        precioUnitarioPromedio: montoTotal / cantidadTotal,
        apariciones: filteredTransactions.length
      });
    }
  });

  // Ordenar por monto descendente
  filtered.sort((a, b) => b.montoTotal - a.montoTotal);

  // Tomar solo top 30
  return filtered.slice(0, 30);
}

// Aplicar filtro
function applyDateFilter() {
  const filterType = document.querySelector('input[name="dateFilter"]:checked').value;

  let dateFrom, dateTo;

  switch(filterType) {
    case 'all':
      dateFrom = new Date('2000-01-01');
      dateTo = new Date('2099-12-31');
      break;

    case '7days':
      dateTo = new Date();
      dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 7);
      break;

    case '30days':
      dateTo = new Date();
      dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 30);
      break;

    case 'custom':
      dateFrom = new Date(document.getElementById('dateFrom').value);
      dateTo = new Date(document.getElementById('dateTo').value);
      break;
  }

  const filteredProducts = filterByDateRange(dateFrom, dateTo);
  renderFilteredData(filteredProducts, dateFrom, dateTo);
}
```

### PARTE 3: HTML del Selector de Fechas

```html
<!-- Agregar ANTES de la sección de estadísticas -->
<div class="date-filter-section">
  <div class="section-title">Filtrar por Fecha</div>

  <div class="filter-controls">
    <div class="quick-filters">
      <label class="filter-option">
        <input type="radio" name="dateFilter" value="all" checked>
        <span>Todos los registros</span>
      </label>
      <label class="filter-option">
        <input type="radio" name="dateFilter" value="7days">
        <span>Últimos 7 días</span>
      </label>
      <label class="filter-option">
        <input type="radio" name="dateFilter" value="30days">
        <span>Últimos 30 días</span>
      </label>
      <label class="filter-option">
        <input type="radio" name="dateFilter" value="custom">
        <span>Rango personalizado</span>
      </label>
    </div>

    <div class="custom-date-range" id="customDateRange" style="display: none;">
      <label>
        Desde: <input type="date" id="dateFrom">
      </label>
      <label>
        Hasta: <input type="date" id="dateTo">
      </label>
    </div>

    <button class="apply-filter-btn" id="applyFilterBtn">
      Aplicar Filtro
    </button>
  </div>

  <div class="filter-indicator" id="filterIndicator">
    Mostrando todos los registros
  </div>
</div>
```

---

## 📊 Flujo de Usuario

1. **Usuario abre el visualizador**
   - Se carga el JSON completo una sola vez
   - Se muestra dashboard con TODOS los datos
   - Top 30 productos por monto

2. **Usuario selecciona "Últimos 7 días"**
   - JavaScript filtra transacciones de los últimos 7 días
   - Recalcula totales por producto
   - Ordena por monto
   - Toma top 30
   - Actualiza dashboard con nuevas estadísticas
   - Renderiza top 30 productos del período

3. **Usuario selecciona "Rango personalizado"**
   - Selecciona fecha inicio: 2025-10-01
   - Selecciona fecha fin: 2025-10-31
   - Click en "Aplicar Filtro"
   - Mismo proceso de filtrado
   - Muestra top 30 de octubre 2025

---

## ✅ Ventajas de Este Enfoque

- ✓ Script simple - sin argumentos de línea de comandos
- ✓ Un solo JSON con todos los datos
- ✓ Filtrado instantáneo en el navegador
- ✓ No necesita regenerar JSON para cada filtro
- ✓ Usuario puede cambiar filtros rápidamente
- ✓ Siempre muestra top 30 productos más relevantes
- ✓ Estadísticas actualizadas en tiempo real
- ✓ Fácil de mantener y debuggear

---

## ⏱️ Estimación de Tiempo

| Tarea | Tiempo |
|-------|--------|
| Modificar script | 1 hora |
| Agregar selector de fechas UI | 1 hora |
| Implementar filtrado JavaScript | 1.5 horas |
| Testing con diferentes rangos | 0.5 horas |
| Ajustes de diseño | 1 hora |
| **TOTAL** | **5 horas** |

---

## 🚀 ¿Proceder con la Implementación?

Este plan es mucho más simple y efectivo:
- **1 archivo modificado**: extract-ecf-products.js
- **1 archivo actualizado**: ecf-products-viewer.html
- **Resultado**: Filtrado dinámico con top 30 productos por fecha
