const https = require('https');
const http = require('http');

// Configuración
const BASE_URL = 'http://localhost:5003/api/v1';
const LOGIN_CREDENTIALS = {
  usernameOrEmail: 'msfissa',
  password: 'Msf1ss@'
};

// Cliente HTTP que acepta certificados auto-firmados
const agent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Realiza una petición HTTP
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      agent: isHttps ? agent : undefined
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Obtiene el token de autenticación
 */
async function login() {
  console.log('🔐 Autenticando...');

  try {
    const response = await makeRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: LOGIN_CREDENTIALS
    });

    if (response.statusCode === 200 && response.data.data) {
      // El token puede estar en diferentes ubicaciones según la estructura de respuesta
      const accessToken = response.data.data.access_token || response.data.data.accessToken;
      if (accessToken) {
        console.log('✅ Autenticación exitosa');
        return accessToken;
      }
    }

    throw new Error(`Error en login: No se encontró access_token en la respuesta`);
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    throw error;
  }
}

/**
 * Obtiene todas las transacciones de producción con paginación
 */
async function getAllProductionTransactions(token) {
  console.log('\n📥 Obteniendo transacciones de producción...');

  let allTransactions = [];
  let page = 1;
  const limit = 100; // Máximo permitido
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const url = `${BASE_URL}/ecf-transactions/all-production?page=${page}&limit=${limit}`;
      const response = await makeRequest(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json'
        }
      });

      if (response.statusCode === 200) {
        // El response.data contiene el JSON parseado, y dentro hay un campo 'data' con el array
        const jsonResponse = response.data;

        const transactions = jsonResponse.data;

        if (Array.isArray(transactions) && transactions.length > 0) {
          allTransactions = allTransactions.concat(transactions);
          console.log(`  📄 Página ${page}: ${transactions.length} transacciones obtenidas`);

          // Verificar si hay más páginas
          if (transactions.length < limit) {
            hasMorePages = false;
          } else {
            page++;
          }
        } else if (Array.isArray(transactions) && transactions.length === 0) {
          // Array vacío, no hay más páginas
          console.log(`  📄 Página ${page}: No hay más transacciones`);
          hasMorePages = false;
        } else {
          console.log(`  ⚠️  Página ${page}: Respuesta inesperada, tipo: ${typeof transactions}`);
          hasMorePages = false;
        }
      } else {
        console.warn(`⚠️  Error en página ${page}:`, response.data);
        hasMorePages = false;
      }
    } catch (error) {
      console.error(`❌ Error obteniendo página ${page}:`, error.message);
      hasMorePages = false;
    }
  }

  console.log(`✅ Total de transacciones obtenidas: ${allTransactions.length}`);
  return allTransactions;
}

/**
 * Extrae productos de una transacción
 */
function extractProductsFromTransaction(transaction) {
  const products = [];

  try {
    // Parsear transaction_data si es un string
    let transactionData;
    if (typeof transaction.transaction_data === 'string') {
      transactionData = JSON.parse(transaction.transaction_data);
    } else {
      transactionData = transaction.transaction_data;
    }

    // Buscar DetallesItems en diferentes estructuras posibles
    let items = null;

    if (transactionData.ECF && transactionData.ECF.DetallesItems) {
      items = transactionData.ECF.DetallesItems.Item;
    } else if (transactionData.RFCE && transactionData.RFCE.DetallesItems) {
      items = transactionData.RFCE.DetallesItems.Item;
    } else if (transactionData.ACECF && transactionData.ACECF.DetallesItems) {
      items = transactionData.ACECF.DetallesItems.Item;
    }

    // Procesar items
    if (items) {
      // Items puede ser un array o un objeto único
      const itemsArray = Array.isArray(items) ? items : [items];

      itemsArray.forEach(item => {
        if (item.NombreItem) {
          products.push({
            nombre: item.NombreItem,
            precioUnitario: parseFloat(item.PrecioUnitarioItem || 0),
            cantidad: parseFloat(item.CantidadItem || 0),
            montoItem: parseFloat(item.MontoItem || 0),
            transactionId: transaction.uuid,
            eNCF: transaction.eNCF,
            // NUEVO: Agregar fecha de transacción
            fecha: transaction.date_transaction
          });
        }
      });
    }
  } catch (error) {
    console.warn(`⚠️  Error parseando transacción ${transaction.uuid}:`, error.message);
  }

  return products;
}

/**
 * Agrupa productos por nombre y calcula totales
 */
function groupAndSummarizeProducts(allProducts) {
  console.log('\n📊 Procesando y agrupando productos...');

  const productMap = {};

  allProducts.forEach(product => {
    const key = product.nombre;

    if (!productMap[key]) {
      productMap[key] = {
        nombre: product.nombre,
        cantidadTotal: 0,
        montoTotal: 0,
        precioUnitarioPromedio: 0,
        preciosUnitarios: [],
        apariciones: 0,
        transacciones: []
      };
    }

    productMap[key].cantidadTotal += product.cantidad;
    productMap[key].montoTotal += product.montoItem;
    productMap[key].preciosUnitarios.push(product.precioUnitario);
    productMap[key].apariciones++;
    // ACTUALIZADO: Incluir fecha en cada transacción
    productMap[key].transacciones.push({
      fecha: product.fecha,
      eNCF: product.eNCF,
      cantidad: product.cantidad,
      monto: product.montoItem
    });
  });

  // Calcular precio promedio y mantener transacciones con fechas
  const productsSummary = Object.values(productMap).map(product => {
    const avgPrice = product.preciosUnitarios.reduce((a, b) => a + b, 0) / product.preciosUnitarios.length;

    return {
      nombre: product.nombre,
      cantidadTotal: parseFloat(product.cantidadTotal.toFixed(2)),
      montoTotal: parseFloat(product.montoTotal.toFixed(2)),
      precioUnitarioPromedio: parseFloat(avgPrice.toFixed(2)),
      apariciones: product.apariciones,
      // NUEVO: Mantener array de transacciones con fechas
      transacciones: product.transacciones
    };
  });

  // Ordenar por monto total descendente
  productsSummary.sort((a, b) => b.montoTotal - a.montoTotal);

  console.log(`✅ Productos únicos encontrados: ${productsSummary.length}`);

  return productsSummary;
}

/**
 * Genera el resumen final en JSON
 */
function generateFinalReport(transactions, productsSummary) {
  const totalMontoGlobal = productsSummary.reduce((sum, p) => sum + p.montoTotal, 0);
  const totalCantidadGlobal = productsSummary.reduce((sum, p) => sum + p.cantidadTotal, 0);

  // NUEVO: Calcular rango de fechas de las transacciones
  let fechaMinima = null;
  let fechaMaxima = null;

  transactions.forEach(tx => {
    if (tx.date_transaction) {
      const txDate = new Date(tx.date_transaction);
      if (!fechaMinima || txDate < fechaMinima) {
        fechaMinima = txDate;
      }
      if (!fechaMaxima || txDate > fechaMaxima) {
        fechaMaxima = txDate;
      }
    }
  });

  return {
    metadata: {
      fechaGeneracion: new Date().toISOString(),
      totalTransacciones: transactions.length,
      totalProductosUnicos: productsSummary.length,
      montoTotalGlobal: parseFloat(totalMontoGlobal.toFixed(2)),
      cantidadTotalGlobal: parseFloat(totalCantidadGlobal.toFixed(2)),
      // NUEVO: Agregar rango de fechas
      rangoFechas: {
        fechaMinima: fechaMinima ? fechaMinima.toISOString() : null,
        fechaMaxima: fechaMaxima ? fechaMaxima.toISOString() : null
      }
    },
    resumen: {
      top10ProductosPorMonto: productsSummary.slice(0, 10).map(p => ({
        nombre: p.nombre,
        montoTotal: p.montoTotal,
        cantidadTotal: p.cantidadTotal,
        apariciones: p.apariciones
      })),
      todosLosProductos: productsSummary
    },
    // ACTUALIZADO: Mantener transacciones con fechas en productoDetallado
    productosDetallados: productsSummary
  };
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando extracción de datos ECF...\n');

  try {
    // 1. Autenticación
    const token = await login();

    // 2. Obtener todas las transacciones
    const transactions = await getAllProductionTransactions(token);

    if (transactions.length === 0) {
      console.log('⚠️  No se encontraron transacciones');
      return;
    }

    // 3. Extraer productos de todas las transacciones
    console.log('\n🔍 Extrayendo productos de transacciones...');
    let allProducts = [];
    transactions.forEach(transaction => {
      const products = extractProductsFromTransaction(transaction);
      allProducts = allProducts.concat(products);
    });
    console.log(`✅ Total de productos extraídos: ${allProducts.length}`);

    // 4. Agrupar y resumir productos
    const productsSummary = groupAndSummarizeProducts(allProducts);

    // 5. Generar reporte final
    const finalReport = generateFinalReport(transactions, productsSummary);

    // 6. Guardar resultado
    const fs = require('fs');
    const path = require('path');

    // Guardar en la raíz del proyecto
    const outputFile = 'ecf-products-summary.json';
    fs.writeFileSync(outputFile, JSON.stringify(finalReport, null, 2));

    // También guardar en public para que sea accesible desde el servidor
    const publicOutputFile = path.join('public', 'ecf-products-summary.json');
    fs.writeFileSync(publicOutputFile, JSON.stringify(finalReport, null, 2));

    console.log(`\n✅ Resumen generado exitosamente:`);
    console.log(`   - ${outputFile}`);
    console.log(`   - ${publicOutputFile}`);
    console.log('\n📈 Estadísticas:');
    console.log(`   - Total transacciones: ${finalReport.metadata.totalTransacciones}`);
    console.log(`   - Productos únicos: ${finalReport.metadata.totalProductosUnicos}`);
    console.log(`   - Monto total global: $${finalReport.metadata.montoTotalGlobal.toLocaleString()}`);
    console.log(`   - Cantidad total global: ${finalReport.metadata.cantidadTotalGlobal.toLocaleString()}`);

    console.log('\n🏆 Top 5 productos por monto:');
    finalReport.resumen.top10ProductosPorMonto.slice(0, 5).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.nombre}: $${product.montoTotal.toLocaleString()} (${product.apariciones} apariciones)`);
    });

  } catch (error) {
    console.error('\n❌ Error en la ejecución:', error.message);
    process.exit(1);
  }
}

// Ejecutar
main();
