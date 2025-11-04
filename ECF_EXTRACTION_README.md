# Script de Extracción y Resumen de Productos ECF

Este script extrae datos del endpoint `ecf-transactions/all-production` y genera un resumen agrupado de productos.

## Características

- Autenticación automática con el API
- Paginación automática para obtener todas las transacciones
- Extracción de productos desde `DetallesItems`
- Agrupación por nombre de producto
- Cálculo de totales y promedios
- Generación de JSON con resumen detallado

## Instalación

El script usa solo módulos nativos de Node.js, no requiere instalación de dependencias adicionales.

## Uso

```bash
node extract-ecf-products.js
```

## Configuración

El script está configurado con:
- **URL Base**: `http://localhost:5003/api/v1`
- **Usuario**: `msfissa`
- **Password**: `Msf1ss@`

Si necesitas cambiar estas credenciales, edita las constantes al inicio del archivo:

```javascript
const BASE_URL = 'http://localhost:5003/api/v1';
const LOGIN_CREDENTIALS = {
  usernameOrEmail: 'msfissa',
  password: 'Msf1ss@'
};
```

## Proceso de Ejecución

1. **Autenticación**: Login en el endpoint `/auth/login`
2. **Extracción**: Obtiene todas las transacciones de `/ecf-transactions/all-production` usando paginación
3. **Parseo**: Analiza el campo `transaction_data` de cada transacción
4. **Extracción de Productos**: Obtiene datos de `DetallesItems.Item`:
   - `NombreItem`
   - `PrecioUnitarioItem`
   - `CantidadItem`
   - `MontoItem`
5. **Agrupación**: Agrupa productos por nombre y suma cantidades/montos
6. **Generación**: Crea el archivo `ecf-products-summary.json`

## Estructura del JSON Generado

```json
{
  "metadata": {
    "fechaGeneracion": "2025-11-04T...",
    "totalTransacciones": 150,
    "totalProductosUnicos": 25,
    "montoTotalGlobal": 150000.00,
    "cantidadTotalGlobal": 1250.00
  },
  "resumen": {
    "top10ProductosPorMonto": [
      {
        "nombre": "Producto X",
        "montoTotal": 15000.00,
        "cantidadTotal": 100.00,
        "apariciones": 45
      }
    ],
    "todosLosProductos": [...]
  },
  "productoDetallado": [
    {
      "nombre": "Producto X",
      "cantidadTotal": 100.00,
      "montoTotal": 15000.00,
      "precioUnitarioPromedio": 150.00,
      "apariciones": 45,
      "transacciones": [
        {
          "eNCF": "E320000000001",
          "cantidad": 2.00,
          "monto": 300.00
        }
      ]
    }
  ]
}
```

## Campos del Resumen

### metadata
- `fechaGeneracion`: Fecha y hora de generación del reporte
- `totalTransacciones`: Número total de transacciones procesadas
- `totalProductosUnicos`: Número de productos únicos encontrados
- `montoTotalGlobal`: Suma de todos los montos de productos
- `cantidadTotalGlobal`: Suma de todas las cantidades de productos

### productoDetallado
Para cada producto:
- `nombre`: Nombre del producto (NombreItem)
- `cantidadTotal`: Suma total de cantidades
- `montoTotal`: Suma total de montos
- `precioUnitarioPromedio`: Precio unitario promedio
- `apariciones`: Número de veces que aparece el producto
- `transacciones`: Array con detalle de cada transacción donde aparece

## Salida del Script

El script muestra en consola:
- Progreso de autenticación
- Páginas obtenidas con paginación
- Estadísticas finales
- Top 5 productos por monto

## Archivo de Salida

`ecf-products-summary.json` - Contiene el resumen completo con todos los datos procesados

## Manejo de Errores

El script maneja:
- Errores de autenticación
- Errores de conexión al API
- Transacciones con `transaction_data` inválido o corrupto
- Estructuras variables (ECF, RFCE, ACECF)

Los errores se muestran en consola con el símbolo ⚠️ o ❌ pero no detienen la ejecución completa.

## Requisitos

- Node.js v12 o superior
- Acceso al API en `http://localhost:5003`
- Credenciales válidas

## Ejemplos de Uso

### Ejecutar el script
```bash
node extract-ecf-products.js
```

### Ver el resultado
```bash
cat ecf-products-summary.json
```

### Ver solo los top productos
```bash
cat ecf-products-summary.json | grep -A 20 "top10ProductosPorMonto"
```

## Notas

- El script obtiene **todas** las transacciones de producción sin filtros
- La paginación usa el límite máximo de 100 elementos por página
- Los productos se ordenan por `montoTotal` descendente
- Los montos y cantidades se redondean a 2 decimales
