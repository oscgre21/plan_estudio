# API de Integración DGII

## Tabla de Contenidos
- [Introducción](#introducción)
- [Autenticación](#autenticación)
- [Empresas](#empresas)
- [Transacciones ECF](#transacciones-ecf)
- [Códigos de Error](#códigos-de-error)
- [Ejemplos de Integración](#ejemplos-de-integración)

---

## Introducción

Esta API permite la integración con el sistema de gestión de documentos fiscales electrónicos (ECF) de la Dirección General de Impuestos Internos (DGII) de la República Dominicana.

### URL Base
```
http://localhost:3001/api/v1
```

### Formato de Respuesta
Todas las respuestas de la API siguen la estructura `GResponse`:

```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {},
  "message": "Mensaje descriptivo",
  "messages": [],
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

---

## Autenticación

### Login
Obtiene un token JWT para autenticarse en la API.

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900,
    "user": {
      "uuid": "abc123...",
      "username": "admin",
      "email": "admin@example.com"
    }
  },
  "message": "Login exitoso",
  "messages": [],
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

**Errores Comunes:**
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Datos de entrada incorrectos

---

### Verificar Autenticación
Verifica si el token es válido.

**Endpoint:** `GET /auth/check_auth`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "authenticated": true,
    "user": {
      "uuid": "abc123...",
      "username": "admin"
    }
  },
  "message": "Usuario autenticado",
  "messages": [],
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

**Nota Importante de Seguridad:**
- Todos los endpoints de esta API requieren autenticación mediante JWT token
- Debe incluir el header `Authorization: Bearer {access_token}` en todas las solicitudes
- **Excepción:** Solo el endpoint `/auth/login` es público y no requiere token
- Los tokens expiran en 15 minutos y deben ser renovados

---

## Empresas

### Crear Nueva Empresa
Crea una nueva empresa en el sistema con sus datos básicos y opcionalmente su logo.

**Endpoint:** `POST /integration/empresa`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
nombre_empresa: MI EMPRESA S.R.L.
rnc: 123456789
password: mipassword123
certificate_password: certpassword456
RazonSocialEmisor: MI EMPRESA S.R.L.
NombreComercial: MI EMPRESA
DireccionEmisor: Calle Principal #123, Santo Domingo
Telefono: 809-555-1234
CorreoElectronico: ventas@miempresa.com
activo: true
logo: [archivo]
```

**Campos Disponibles:**

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| `nombre_empresa` | string | Nombre de la empresa | ✅ Sí |
| `rnc` | string | RNC de la empresa (9 dígitos) | ✅ Sí |
| `password` | string | Contraseña general de la empresa | No |
| `certificate_password` | string | Contraseña del certificado digital | No |
| `RazonSocialEmisor` | string | Razón Social del Emisor (para facturas) | No |
| `NombreComercial` | string | Nombre Comercial (para facturas) | No |
| `DireccionEmisor` | string | Dirección del Emisor (para facturas) | No |
| `Telefono` | string | Teléfono de contacto | No |
| `CorreoElectronico` | string | Correo electrónico de contacto | No |
| `activo` | boolean | Indica si la empresa está activa | No (default: true) |
| `logo` | file | Logo de la empresa (PNG/JPG, máx 5MB) | No |

**Ejemplo con cURL:**
```bash
curl -X POST "http://localhost:3001/api/v1/integration/empresa" \
  -H "Authorization: Bearer {access_token}" \
  -F "nombre_empresa=MI EMPRESA S.R.L." \
  -F "rnc=123456789" \
  -F "password=mipassword123" \
  -F "certificate_password=certpassword456" \
  -F "RazonSocialEmisor=MI EMPRESA S.R.L." \
  -F "NombreComercial=MI EMPRESA" \
  -F "DireccionEmisor=Calle Principal #123, Santo Domingo" \
  -F "Telefono=809-555-1234" \
  -F "CorreoElectronico=ventas@miempresa.com" \
  -F "activo=true" \
  -F "logo=@/ruta/al/logo.png"
```

**Ejemplo con JavaScript:**
```javascript
const formData = new FormData();
formData.append('nombre_empresa', 'MI EMPRESA S.R.L.');
formData.append('rnc', '123456789');
formData.append('password', 'mipassword123');
formData.append('certificate_password', 'certpassword456');
formData.append('RazonSocialEmisor', 'MI EMPRESA S.R.L.');
formData.append('NombreComercial', 'MI EMPRESA');
formData.append('DireccionEmisor', 'Calle Principal #123, Santo Domingo');
formData.append('Telefono', '809-555-1234');
formData.append('CorreoElectronico', 'ventas@miempresa.com');
formData.append('activo', 'true');
// Si hay logo
// formData.append('logo', logoFile);

const response = await fetch('http://localhost:3001/api/v1/integration/empresa', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

**Ejemplo con Python:**
```python
import requests

url = "http://localhost:3001/api/v1/integration/empresa"
headers = {
    "Authorization": f"Bearer {access_token}"
}

data = {
    'nombre_empresa': 'MI EMPRESA S.R.L.',
    'rnc': '123456789',
    'password': 'mipassword123',
    'certificate_password': 'certpassword456',
    'RazonSocialEmisor': 'MI EMPRESA S.R.L.',
    'NombreComercial': 'MI EMPRESA',
    'DireccionEmisor': 'Calle Principal #123, Santo Domingo',
    'Telefono': '809-555-1234',
    'CorreoElectronico': 'ventas@miempresa.com',
    'activo': 'true'
}

# Si hay logo
# files = {'logo': open('/ruta/al/logo.png', 'rb')}
# response = requests.post(url, headers=headers, data=data, files=files)

response = requests.post(url, headers=headers, data=data)
print(response.json())
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "nombre_empresa": "MI EMPRESA S.R.L.",
    "rnc": "123456789",
    "RazonSocialEmisor": "MI EMPRESA S.R.L.",
    "NombreComercial": "MI EMPRESA",
    "DireccionEmisor": "Calle Principal #123, Santo Domingo",
    "Telefono": "809-555-1234",
    "CorreoElectronico": "ventas@miempresa.com",
    "activo": true,
    "EnviromentMode": "CerteCF",
    "created_at": "2025-10-01T16:00:00.000Z",
    "updated_at": "2025-10-01T16:00:00.000Z"
  },
  "message": "Empresa creada exitosamente",
  "messages": [],
  "timestamp": "2025-10-01T16:00:00.000Z"
}
```

**Respuesta con Error (409 - RNC Duplicado):**
```json
{
  "statusCode": 409,
  "isValid": false,
  "isSuccess": false,
  "message": "Ya existe una empresa con el RNC 123456789",
  "messages": ["Ya existe una empresa con el RNC 123456789"],
  "timestamp": "2025-10-01T16:00:00.000Z"
}
```

**Respuesta con Error (400 - Logo Inválido):**
```json
{
  "statusCode": 400,
  "isValid": false,
  "isSuccess": false,
  "message": "El logo no puede superar los 5MB",
  "messages": ["El logo no puede superar los 5MB"],
  "timestamp": "2025-10-01T16:00:00.000Z"
}
```

**Códigos de Error:**
- `400 Bad Request`: Datos inválidos, logo con formato incorrecto o tamaño excedido
- `401 Unauthorized`: Token inválido o expirado
- `409 Conflict`: RNC duplicado - Ya existe una empresa con ese RNC
- `500 Internal Server Error`: Error interno al crear la empresa

**⚠️ Notas Importantes:**
- El RNC debe ser único en el sistema
- El RNC debe tener exactamente 9 dígitos numéricos
- Por defecto, la empresa se crea en modo `CERT` (CerteCF)
- El logo es opcional pero recomendado para facturas
- La contraseña del certificado se usará cuando se suba el certificado digital
- Una vez creada, deberá subir el certificado digital (.p12) para poder firmar documentos
- **Los campos `RazonSocialEmisor`, `NombreComercial`, `DireccionEmisor`, `Telefono` y `CorreoElectronico` son opcionales pero recomendados** ya que aparecerán en las facturas electrónicas generadas
- Si no se proporcionan al crear, pueden agregarse luego con el endpoint PUT de actualización

**Flujo Típico de Configuración:**
1. ✅ Crear empresa (este endpoint)
2. 📤 Subir certificado digital (POST `/{uuid}/certificado`)
3. 🔧 Configurar datos adicionales (PUT `/integration/empresa`)
4. ✍️ Firmar XML de postulación (POST `/{uuid}/sign-xml`)
5. 📋 Crear transacciones ECF

---

### Listar Todas las Empresas
Obtiene la lista de todas las empresas registradas en el sistema con paginación. La respuesta incluye el campo `total` con el número total de registros que coinciden con los filtros aplicados, útil para implementar paginadores.

**Endpoint:** `GET /integration/empresa`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Query (todos opcionales):**
- `page` (number): Número de página (por defecto: 1)
- `pageSize` (number): Cantidad de resultados por página (por defecto: 10)
- `search` (string): Término de búsqueda para filtrar por nombre de empresa o RNC

**Ejemplos:**
```bash
# Listar todas las empresas con valores por defecto
GET /integration/empresa

# Listar con paginación específica
GET /integration/empresa?page=1&pageSize=10

# Buscar empresas con un término
GET /integration/empresa?search=empresa&page=1&pageSize=10

# Segunda página con 20 resultados por página
GET /integration/empresa?page=2&pageSize=20
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "nombre_empresa": "MI EMPRESA S.R.L.",
      "rnc": "123456789",
      "RazonSocialEmisor": "MI EMPRESA",
      "NombreComercial": "MI EMPRESA",
      "DireccionEmisor": "Santo Domingo, República Dominicana",
      "Telefono": "809-555-1234",
      "CorreoElectronico": "ventas@miempresa.com",
      "activo": true,
      "EnviromentMode": "PROD",
      "logo_path": "uploads/logos/550e8400.../logo.png",
      "created_at": "2025-09-01T10:00:00.000Z",
      "updated_at": "2025-09-29T16:00:00.000Z"
    },
    {
      "uuid": "660f9511-f3ac-52f5-b827-557766551111",
      "nombre_empresa": "EMPRESA DEMO S.A.",
      "rnc": "987654321",
      "RazonSocialEmisor": "EMPRESA DEMO",
      "NombreComercial": "DEMO",
      "DireccionEmisor": "Santiago, República Dominicana",
      "Telefono": "809-555-5678",
      "CorreoElectronico": "contacto@demo.com",
      "activo": true,
      "EnviromentMode": "DEV",
      "logo_path": "uploads/logos/660f9511.../logo.png",
      "created_at": "2025-08-15T14:30:00.000Z",
      "updated_at": "2025-09-28T10:00:00.000Z"
    }
  ],
  "message": "Empresas obtenidas exitosamente",
  "messages": [],
  "total": 50,
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

**Campos de la Respuesta:**
- `data`: Array con las empresas de la página actual
- `total`: Número total de registros que coinciden con el filtro (sin paginación)
- `message`: Mensaje descriptivo de la operación
- `messages`: Array de mensajes adicionales (vacío si no hay errores)
- `timestamp`: Fecha y hora de la respuesta

**Cálculos para el Paginador:**
Con los valores de la respuesta, puedes calcular:
- **Total de páginas:** `Math.ceil(total / pageSize)` → `Math.ceil(50 / 10) = 5 páginas`
- **Página actual:** El valor del parámetro `page`
- **Hay más páginas:** `page * pageSize < total`
- **Rango de registros:** `"Mostrando ${(page-1)*pageSize + 1} - ${Math.min(page*pageSize, total)} de ${total}"`

**Ejemplo de Paginador:**
```javascript
// Respuesta de la API
const response = {
  data: [...], // 10 empresas
  total: 50
};

const page = 1;
const pageSize = 10;

// Cálculos
const totalPages = Math.ceil(response.total / pageSize); // 5
const hasNextPage = page * pageSize < response.total; // true
const hasPreviousPage = page > 1; // false
const rangeStart = (page - 1) * pageSize + 1; // 1
const rangeEnd = Math.min(page * pageSize, response.total); // 10

console.log(`Mostrando ${rangeStart} - ${rangeEnd} de ${response.total}`);
// Output: "Mostrando 1 - 10 de 50"
```

**Errores Comunes:**
- `401 Unauthorized`: Token inválido o expirado
- `500 Internal Server Error`: Error al obtener las empresas

---

### Obtener Empresa por UUID
Obtiene la información detallada de una empresa.

**Endpoint:** `GET /integration/empresa/{uuid}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Ruta:**
- `uuid` (string, requerido): UUID de la empresa

**Ejemplo:**
```bash
GET /integration/empresa/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "nombre_empresa": "MI EMPRESA S.R.L.",
    "rnc": "123456789",
    "RazonSocialEmisor": "MI EMPRESA",
    "NombreComercial": "MI EMPRESA",
    "DireccionEmisor": "Santo Domingo, República Dominicana",
    "Telefono": "809-555-1234",
    "CorreoElectronico": "ventas@miempresa.com",
    "activo": true,
    "path_certificado": "certificates/550e8400.../certificado.p12",
    "EnviromentMode": "PROD",
    "logo_path": "uploads/logos/550e8400.../logo.png",
    "created_at": "2025-09-01T10:00:00.000Z",
    "updated_at": "2025-09-29T16:00:00.000Z"
  },
  "message": "Empresa encontrada",
  "messages": [],
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

**Errores Comunes:**
- `404 Not Found`: Empresa no encontrada
- `400 Bad Request`: UUID inválido
- `401 Unauthorized`: Token inválido o expirado

---

### Actualizar Empresa
Actualiza los datos de una empresa existente, incluyendo su ambiente de ejecución.

**Endpoint:** `PUT /integration/empresa`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
uuid: 550e8400-e29b-41d4-a716-446655440000
nombre_empresa: MI EMPRESA ACTUALIZADA S.R.L.
RazonSocialEmisor: MI EMPRESA ACTUALIZADA
NombreComercial: MI EMPRESA
DireccionEmisor: Calle Principal #123, Santo Domingo
Telefono: 809-555-9999
CorreoElectronico: info@miempresa.com
EnviromentMode: PROD
logo: [archivo]
```

**Campos Disponibles:**

| Campo | Tipo | Descripción | Valores | Requerido |
|-------|------|-------------|---------|-----------|
| `uuid` | string | UUID de la empresa | - | ✅ Sí |
| `nombre_empresa` | string | Nombre de la empresa | - | No |
| `rnc` | string | RNC de la empresa | 9 dígitos | No |
| `password` | string | Contraseña general | - | No |
| `RazonSocialEmisor` | string | Razón Social del Emisor | - | No |
| `NombreComercial` | string | Nombre Comercial | - | No |
| `DireccionEmisor` | string | Dirección del Emisor | - | No |
| `Telefono` | string | Teléfono | - | No |
| `CorreoElectronico` | string | Correo Electrónico | - | No |
| `EnviromentMode` | string | Ambiente de ejecución | `PROD`, `CERT`, `DEV` | No |
| `logo` | file | Logo de la empresa | PNG/JPG (máx 5MB) | No |

**Valores de Ambiente:**
- `PROD`: Ambiente de producción → `eCF` (facturas reales en DGII)
- `CERT`: Ambiente de certificación → `CerteCF` (pruebas certificadas con DGII)
- `DEV`: Ambiente de desarrollo → `TesteCF` (pruebas de desarrollo)

**Ejemplo con cURL:**
```bash
curl -X PUT "http://localhost:3001/api/v1/integration/empresa" \
  -H "Authorization: Bearer {access_token}" \
  -F "uuid=550e8400-e29b-41d4-a716-446655440000" \
  -F "nombre_empresa=MI EMPRESA ACTUALIZADA S.R.L." \
  -F "EnviromentMode=PROD" \
  -F "Telefono=809-555-9999" \
  -F "logo=@/ruta/al/logo.png"
```

**Ejemplo con JavaScript:**
```javascript
const formData = new FormData();
formData.append('uuid', '550e8400-e29b-41d4-a716-446655440000');
formData.append('nombre_empresa', 'MI EMPRESA ACTUALIZADA S.R.L.');
formData.append('EnviromentMode', 'PROD');
formData.append('Telefono', '809-555-9999');
// Si hay logo
// formData.append('logo', logoFile);

const response = await fetch('http://localhost:3001/api/v1/integration/empresa', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

**Ejemplo con Python:**
```python
import requests

url = "http://localhost:3001/api/v1/integration/empresa"
headers = {
    "Authorization": f"Bearer {access_token}"
}

data = {
    'uuid': '550e8400-e29b-41d4-a716-446655440000',
    'nombre_empresa': 'MI EMPRESA ACTUALIZADA S.R.L.',
    'EnviromentMode': 'PROD',
    'Telefono': '809-555-9999'
}

# Si hay logo
# files = {'logo': open('/ruta/al/logo.png', 'rb')}
# response = requests.put(url, headers=headers, data=data, files=files)

response = requests.put(url, headers=headers, data=data)
print(response.json())
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "nombre_empresa": "MI EMPRESA ACTUALIZADA S.R.L.",
    "rnc": "123456789",
    "RazonSocialEmisor": "MI EMPRESA ACTUALIZADA",
    "NombreComercial": "MI EMPRESA",
    "DireccionEmisor": "Calle Principal #123, Santo Domingo",
    "Telefono": "809-555-9999",
    "CorreoElectronico": "info@miempresa.com",
    "activo": true,
    "EnviromentMode": "PROD",
    "ultima_actualizacion": "2025-10-01T14:30:00.000Z",
    "created_at": "2025-09-01T10:00:00.000Z",
    "updated_at": "2025-10-01T14:30:00.000Z"
  },
  "message": "Empresa actualizada exitosamente",
  "messages": [],
  "timestamp": "2025-10-01T14:30:00.000Z"
}
```

**Errores Comunes:**
- `404 Not Found`: Empresa no encontrada con el UUID proporcionado
- `400 Bad Request`: Datos inválidos o RNC duplicado
- `401 Unauthorized`: Token inválido o expirado
- `400 Bad Request`: Logo con formato inválido (solo PNG/JPG) o tamaño excedido (máx 5MB)

**⚠️ Importante:**
- El cambio de ambiente (`EnviromentMode`) afecta inmediatamente a todas las nuevas transacciones ECF
- Usar `PROD` solo cuando esté listo para generar facturas reales ante DGII
- Se recomienda probar primero en `CERT` antes de pasar a `PROD`

---

### Subir Certificado Digital
Sube el certificado digital (.p12) de la empresa necesario para firmar documentos XML y transacciones ECF.

**Endpoint:** `POST /integration/empresa/{uuid}/certificado`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Parámetros de Ruta:**
- `uuid` (string, requerido): UUID de la empresa

**Body (form-data):**
```
file: [archivo .p12]
certificate_password: password_del_certificado
```

**Campos Disponibles:**

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| `file` | file | Archivo de certificado .p12 | ✅ Sí |
| `certificate_password` | string | Contraseña del certificado | No (usa la del registro si no se proporciona) |

**Ejemplo con cURL:**
```bash
curl -X POST "http://localhost:3001/api/v1/integration/empresa/550e8400-e29b-41d4-a716-446655440000/certificado" \
  -H "Authorization: Bearer {access_token}" \
  -F "file=@/ruta/al/certificado.p12" \
  -F "certificate_password=miPasswordSeguro123"
```

**Ejemplo con JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', certificateFile); // certificateFile es un objeto File
formData.append('certificate_password', 'miPasswordSeguro123');

const response = await fetch('http://localhost:3001/api/v1/integration/empresa/550e8400-e29b-41d4-a716-446655440000/certificado', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

**Ejemplo con Python:**
```python
import requests

url = "http://localhost:3001/api/v1/integration/empresa/550e8400-e29b-41d4-a716-446655440000/certificado"
headers = {
    "Authorization": f"Bearer {access_token}"
}

data = {
    'certificate_password': 'miPasswordSeguro123'
}

files = {
    'file': open('/ruta/al/certificado.p12', 'rb')
}

response = requests.post(url, headers=headers, data=data, files=files)
print(response.json())
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "nombre_empresa": "MI EMPRESA S.R.L.",
    "rnc": "123456789",
    "path_certificado": "certificates/550e8400-e29b-41d4-a716-446655440000/certificado.p12",
    "certificate_password": "***",
    "updated_at": "2025-10-01T16:30:00.000Z"
  },
  "message": "Certificado subido exitosamente",
  "messages": [],
  "timestamp": "2025-10-01T16:30:00.000Z"
}
```

**Respuestas de Error:**

**Error 400 - Contraseña Incorrecta:**
```json
{
  "statusCode": 400,
  "isValid": false,
  "isSuccess": false,
  "message": "La contraseña del certificado es incorrecta",
  "messages": ["La contraseña del certificado es incorrecta"],
  "timestamp": "2025-10-03T09:17:20.000Z"
}
```

**Error 400 - Formato Inválido:**
```json
{
  "statusCode": 400,
  "isValid": false,
  "isSuccess": false,
  "message": "El archivo no es un certificado PKCS#12 válido (.p12 o .pfx)",
  "messages": ["El archivo no es un certificado PKCS#12 válido (.p12 o .pfx)"],
  "timestamp": "2025-10-03T09:17:20.000Z"
}
```

**Error 410 - Certificado Expirado:**
```json
{
  "statusCode": 410,
  "isValid": false,
  "isSuccess": false,
  "message": "El certificado ha expirado",
  "messages": ["El certificado ha expirado"],
  "timestamp": "2025-10-03T09:17:20.000Z"
}
```

**Errores Comunes:**
- `400 Bad Request`: No se proporcionó archivo, formato inválido, contraseña incorrecta, archivo vacío
- `403 Forbidden`: Sin permisos para leer el archivo
- `404 Not Found`: Empresa no encontrada con el UUID proporcionado
- `410 Gone`: Certificado expirado
- `401 Unauthorized`: Token inválido o expirado
- `500 Internal Server Error`: Error al guardar el certificado

**⚠️ Notas Importantes:**
- El certificado debe ser un archivo PKCS#12 (.p12 o .pfx)
- El certificado debe estar emitido por una autoridad certificadora reconocida por DGII
- La contraseña del certificado se encripta antes de almacenarse
- Un certificado válido es **obligatorio** para firmar documentos y crear transacciones ECF
- El certificado tiene fecha de vencimiento, debe renovarse periódicamente
- Se recomienda guardar un respaldo del certificado en lugar seguro

**Validaciones del Certificado:**
- ✅ Formato válido PKCS#12
- ✅ Contraseña correcta
- ✅ Certificado no vencido
- ✅ Certificado no revocado
- ✅ Emitido por CA autorizada

**Casos de Uso:**
- 🔐 Configuración inicial de empresa para facturación electrónica
- 🔄 Renovación de certificado vencido
- 🔧 Actualización de certificado por cambio de proveedor
- 🛡️ Reemplazo de certificado comprometido

---

### Firmar Archivo XML
Firma un archivo XML usando el certificado digital de la empresa. Este endpoint es útil para firmar documentos XML necesarios en procesos de postulación o declaraciones juradas ante DGII.

**Endpoint:** `POST /integration/empresa/{uuid}/sign-xml`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Parámetros de Ruta:**
- `uuid` (string, requerido): UUID de la empresa

**Body (form-data):**
```
file: [archivo XML]
code: Postulacion
descripcion: Documento de postulación para certificación DGII
```

**Campos Disponibles:**

| Campo | Tipo | Descripción | Valores | Requerido |
|-------|------|-------------|---------|-----------|
| `file` | file | Archivo XML a firmar | Formato .xml | ✅ Sí |
| `code` | string | Código del tipo de firma | `Postulacion`, `DeclaracionJurada` | No (default: `Postulacion`) |
| `descripcion` | string | Descripción del archivo | - | No |

**Tipos de Firma Disponibles:**
- `Postulacion`: Para documentos de postulación ante DGII (certificación de empresa)
- `DeclaracionJurada`: Para declaraciones juradas

**Ejemplo con cURL:**
```bash
curl -X POST "http://localhost:3001/api/v1/integration/empresa/550e8400-e29b-41d4-a716-446655440000/sign-xml" \
  -H "Authorization: Bearer {access_token}" \
  -F "file=@/ruta/al/documento.xml" \
  -F "code=Postulacion" \
  -F "descripcion=Documento de postulación DGII" \
  --output documento_firmado.xml
```

**Ejemplo con JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', xmlFile); // xmlFile es un objeto File
formData.append('code', 'Postulacion');
formData.append('descripcion', 'Documento de postulación DGII');

const response = await fetch('http://localhost:3001/api/v1/integration/empresa/550e8400-e29b-41d4-a716-446655440000/sign-xml', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  body: formData
});

// La respuesta es el archivo XML firmado
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'documento_firmado.xml';
a.click();
```

**Ejemplo con Python:**
```python
import requests

url = "http://localhost:3001/api/v1/integration/empresa/550e8400-e29b-41d4-a716-446655440000/sign-xml"
headers = {
    "Authorization": f"Bearer {access_token}"
}

data = {
    'code': 'Postulacion',
    'descripcion': 'Documento de postulación DGII'
}

files = {
    'file': open('/ruta/al/documento.xml', 'rb')
}

response = requests.post(url, headers=headers, data=data, files=files)

# Guardar el XML firmado
if response.status_code == 200:
    with open('documento_firmado.xml', 'wb') as f:
        f.write(response.content)
    print("XML firmado descargado exitosamente")
else:
    print(response.json())
```

**Respuesta Exitosa (200):**
El endpoint retorna el archivo XML firmado directamente como descarga con el siguiente header:
```
Content-Type: application/xml
Content-Disposition: attachment; filename="nombre_firmado.xml"
```

El contenido de la respuesta es el XML firmado digitalmente:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
  <!-- Contenido del documento original -->
  <ds:Signature>
    <ds:SignedInfo>
      <!-- Información de la firma digital -->
    </ds:SignedInfo>
    <ds:SignatureValue>
      <!-- Valor de la firma -->
    </ds:SignatureValue>
    <ds:KeyInfo>
      <!-- Información del certificado -->
    </ds:KeyInfo>
  </ds:Signature>
</Document>
```

**Respuesta con Error (400):**
```json
{
  "isValid": false,
  "messages": ["No se ha proporcionado ningún archivo"]
}
```

**Errores Comunes:**
- `400 Bad Request`: No se proporcionó archivo o UUID inválido
- `404 Not Found`: Empresa no encontrada
- `401 Unauthorized`: Token inválido o expirado
- `500 Internal Server Error`: Error al firmar el XML (certificado inválido, archivo XML malformado)

**⚠️ Notas Importantes:**
- La empresa debe tener un certificado digital válido (.p12) configurado
- El certificado debe estar vigente y no revocado
- El archivo XML debe tener una estructura válida
- El XML firmado incluirá la firma digital al final del documento
- Este proceso es necesario para la postulación inicial ante DGII
- La respuesta es un archivo binario (XML), no JSON

**Casos de Uso:**
- 📝 Firmar documentos de postulación para certificación DGII
- 📋 Firmar declaraciones juradas
- 🔒 Validar integridad de documentos XML antes de enviarlos a DGII
- ✅ Preparar documentos para procesos de homologación

---

## Transacciones ECF

### Crear Transacción ECF
Crea una nueva transacción de documento fiscal electrónico (ECF) y la envía a DGII.

**Endpoint:** `POST /{empresa_uuid}/ecf-transactions`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Parámetros de Ruta:**
- `empresa_uuid` (string, requerido): UUID de la empresa

**Body:**
```json
{
  "data": {
    "ECF": {
      "Encabezado": {
        "Version": "1.0",
        "IdDoc": {
          "TipoeCF": "32",
          "eNCF": "E320000000001",
          "IndicadorMontoGravado": "0",
          "TipoIngresos": "01",
          "TipoPago": "1"
        },
        "Emisor": {
          "RNCEmisor": "123456789",
          "RazonSocialEmisor": "MI EMPRESA S.R.L.",
          "NombreComercial": "MI EMPRESA",
          "DireccionEmisor": "Calle Principal #123, Santo Domingo",
          "TablaTelefonoEmisor": {
            "TelefonoEmisor": ["809-123-4567"]
          },
          "CorreoEmisor": "info@miempresa.com",
          "FechaEmision": "29-09-2025"
        },
        "Comprador": {
          "RNCComprador": "987654321",
          "RazonSocialComprador": "CLIENTE EJEMPLO S.A.",
          "DireccionComprador": "Calle Secundaria #456, Santo Domingo"
        },
        "Totales": {
          "MontoGravadoTotal": "1000.00",
          "MontoGravadoI1": "1000.00",
          "ITBIS1": "18",
          "TotalITBIS": "180.00",
          "TotalITBIS1": "180.00",
          "MontoTotal": "1180.00"
        }
      },
      "DetallesItems": {
        "Item": [
          {
            "NumeroLinea": "1",
            "IndicadorFacturacion": "1",
            "NombreItem": "Servicio de Consultoría",
            "IndicadorBienoServicio": "2",
            "CantidadItem": "1.00",
            "UnidadMedida": "55",
            "PrecioUnitarioItem": "1000.00",
            "MontoItem": "1000.00"
          }
        ]
      },
      "FechaHoraFirma": "29-09-2025 16:21:27"
    }
  }
}
```

**Ejemplo con Nota de Crédito (TipoeCF 34):**
```json
{
  "data": {
    "ECF": {
      "Encabezado": {
        "Version": "1.0",
        "IdDoc": {
          "TipoeCF": "34",
          "eNCF": "E340000000024",
          "IndicadorNotaCredito": 0,
          "IndicadorMontoGravado": "0",
          "TipoIngresos": "01",
          "TipoPago": "2",
          "FechaLimitePago": "29-10-2025"
        },
        "Emisor": {
          "RNCEmisor": "123456789",
          "RazonSocialEmisor": "MI EMPRESA",
          "NombreComercial": "MI EMPRESA",
          "DireccionEmisor": "Santo Domingo",
          "CorreoEmisor": "ventas@miempresa.com",
          "FechaEmision": "29-09-2025"
        },
        "Comprador": {
          "RNCComprador": "987654321",
          "RazonSocialComprador": "CLIENTE EJEMPLO",
          "FechaEntrega": "29-09-2025",
          "FechaOrdenCompra": "29-09-2025"
        },
        "Totales": {
          "MontoGravadoTotal": "1.00",
          "MontoGravadoI1": "1.00",
          "MontoExento": "1.18",
          "ITBIS1": "18",
          "TotalITBIS": "0.18",
          "TotalITBIS1": "0.18",
          "MontoTotal": "1.18",
          "ValorPagar": "1.18"
        }
      },
      "DetallesItems": {
        "Item": [
          {
            "NumeroLinea": "1",
            "IndicadorFacturacion": "1",
            "NombreItem": "SERVICIO TECNICO",
            "IndicadorBienoServicio": "2",
            "CantidadItem": "1.00",
            "UnidadMedida": "43",
            "PrecioUnitarioItem": "1.00",
            "MontoItem": "1.00"
          }
        ]
      },
      "InformacionReferencia": {
        "NCFModificado": "E320000000013",
        "FechaNCFModificado": "29-09-2025",
        "CodigoModificacion": "1"
      },
      "FechaHoraFirma": "29-09-2025 16:21:27"
    }
  }
}
```

**Respuesta Exitosa (201):**
```json
{
  "statusCode": 201,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "trackId": "TRK-2025092916212701",
    "eNCF": "E320000000001",
    "tipo_ecf": "ECF",
    "ambiente": "eCF",
    "empresa_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "transaction_data": "{\"ECF\":{...}}",
    "is_pushed_to_dgii": true,
    "url_qr": "https://dgii.gov.do/ecf/qr?code=ABC123",
    "url_qr_rfce": "https://dgii.gov.do/rfce/qr?code=DEF456",
    "security_code": "SEC-123456",
    "xml_generated": "<?xml version=\"1.0\"?>...",
    "xml_generated_path": "certificates/.../ECF/E320000000001.xml",
    "created_at": "2025-09-29T16:21:27.000Z"
  },
  "message": "Transacción ECF creada y enviada exitosamente",
  "messages": [],
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

**Nota sobre el campo `ambiente`:**
El campo `ambiente` en la respuesta mostrará el valor interno usado por DGII:
- `eCF` si la empresa está configurada en modo PROD
- `CerteCF` si la empresa está configurada en modo CERT
- `TesteCF` si la empresa está configurada en modo DEV

**Respuesta con Errores de Validación (400):**
```json
{
  "statusCode": 400,
  "isValid": false,
  "isSuccess": false,
  "data": null,
  "message": "Errores de validación en los datos del documento",
  "messages": [
    {
      "field": "RNCEmisor",
      "code": "INVALID_RNC_FORMAT",
      "message": "El RNCEmisor debe tener exactamente 9 dígitos",
      "value": "12345",
      "context": "Validation context",
      "severity": "error"
    },
    {
      "field": "eNCF",
      "code": "INVALID_ENCF_FORMAT",
      "message": "El eNCF debe tener el formato E + 11 dígitos (ejemplo: E32000000001)",
      "value": "E32001",
      "context": "Validation context",
      "severity": "error"
    }
  ],
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

**Respuesta con Errores Críticos (422):**
```json
{
  "statusCode": 422,
  "isValid": false,
  "isSuccess": false,
  "data": null,
  "message": "Errores críticos en la estructura del documento",
  "messages": [
    {
      "field": "ECF",
      "code": "MISSING_ECF_STRUCTURE",
      "message": "La estructura ECF es requerida",
      "value": null,
      "context": "Structural validation",
      "severity": "critical"
    }
  ],
  "timestamp": "2025-09-29T16:21:27.000Z"
}
```

**Tipos de ECF Soportados:**
- `31`: Factura de Crédito Fiscal
- `32`: Factura de Consumo
- `33`: Nota de Débito
- `34`: Nota de Crédito
- `41`: Compras
- `43`: Gastos Menores
- `44`: Regímenes Especiales
- `45`: Gubernamental
- `46`: Exportaciones
- `47`: Pagos al Exterior

---

### Listar TODAS las Transacciones en Producción (Global)
Obtiene todas las transacciones ECF en ambiente de producción de TODAS las empresas del sistema.

**Endpoint:** `GET /ecf-transactions/all-production`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Query (todos opcionales):**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| page | number | Número de página (default: 1) | `page=1` |
| limit | number | Elementos por página (default: 10, máx: 100) | `limit=20` |
| tipo_ecf | string | Filtrar por tipo (ECF, RFCE, ACECF) | `tipo_ecf=ECF` |
| eNCF | string | Filtrar por número específico | `eNCF=E320000000001` |
| empresa_uuid | string | Filtrar por empresa específica (opcional) | `empresa_uuid=550e8400...` |
| is_pushed_to_dgii | boolean | Filtrar por estado de envío | `is_pushed_to_dgii=true` |
| include_attempts | boolean | Incluir intentos (default: true) | `include_attempts=false` |
| use_pagination | boolean | true para formato items/pagination (default: false) | `use_pagination=true` |

**Características:**
- ✅ **No requiere empresa_uuid** - muestra transacciones de TODAS las empresas
- ✅ **Filtra automáticamente por ambiente='eCF'** (producción)
- ✅ Soporta paginación y filtros adicionales
- ✅ Útil para reportes globales, dashboards administrativos y auditorías

**Ejemplo con cURL:**
```bash
curl -X GET "http://localhost:3001/api/v1/ecf-transactions/all-production?page=1&limit=20" \
  -H "Authorization: Bearer {access_token}"
```

**Ejemplo con Filtros:**
```bash
# Filtrar por tipo ECF y limitar a 50 resultados
curl -X GET "http://localhost:3001/api/v1/ecf-transactions/all-production?tipo_ecf=ECF&limit=50" \
  -H "Authorization: Bearer {access_token}"

# Obtener solo transacciones pendientes de envío
curl -X GET "http://localhost:3001/api/v1/ecf-transactions/all-production?is_pushed_to_dgii=false&page=1&limit=20" \
  -H "Authorization: Bearer {access_token}"

# Filtrar por empresa específica dentro de producción
curl -X GET "http://localhost:3001/api/v1/ecf-transactions/all-production?empresa_uuid=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {access_token}"
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "message": "Se encontraron 150 transacciones en producción (mostrando 20 en página 1 de 8)",
  "data": [
    {
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "trackId": "TRK-2025092916212701",
      "eNCF": "E320000000001",
      "tipo_ecf": "ECF",
      "ambiente": "eCF",
      "empresa_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "is_pushed_to_dgii": true,
      "security_code": "SEC-123456",
      "created_at": "2025-09-29T16:21:27.000Z"
    },
    {
      "uuid": "8d0f7780-8536-51ef-b05c-f18gd2g01bf8",
      "trackId": "TRK-2025092815103402",
      "eNCF": "E320000000025",
      "tipo_ecf": "ECF",
      "ambiente": "eCF",
      "empresa_uuid": "660f9511-f3ac-52f5-b827-557766551111",
      "is_pushed_to_dgii": true,
      "security_code": "SEC-789012",
      "created_at": "2025-09-28T15:10:34.000Z"
    },
    {
      "uuid": "9e1g8891-9647-62fg-c16d-g29he3h12cg9",
      "trackId": "TRK-2025092714052103",
      "eNCF": "E310000000042",
      "tipo_ecf": "ECF",
      "ambiente": "eCF",
      "empresa_uuid": "770g0622-g4bd-63g6-c938-668877662222",
      "is_pushed_to_dgii": false,
      "security_code": "SEC-345678",
      "created_at": "2025-09-27T14:05:21.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 20,
    "totalItems": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2025-11-04T10:00:00.000Z"
}
```

**Respuesta Vacía (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "message": "No se encontraron transacciones en producción",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2025-11-04T10:00:00.000Z"
}
```

**Errores Comunes:**
- `401 Unauthorized`: Token inválido o expirado
- `500 Internal Server Error`: Error al consultar las transacciones

**Casos de Uso:**
- 📊 **Dashboard administrativo global** - Visualizar todas las transacciones de producción en un solo lugar
- 📈 **Reportes consolidados** - Generar reportes de facturación de todas las empresas
- 🔍 **Auditorías del sistema** - Revisar transacciones de producción para auditorías
- 📋 **Monitoreo en tiempo real** - Supervisar transacciones activas en producción
- 🔎 **Búsqueda global** - Encontrar una transacción específica sin saber la empresa

**Nota de Seguridad:**
- Este endpoint puede retornar grandes volúmenes de datos
- Se recomienda usar paginación con límites razonables (máximo 100 por página)
- Requiere permisos de administrador o lectura global

**Diferencias con otros endpoints:**

| Endpoint | Alcance | Filtro Automático | Requiere empresa_uuid |
|----------|---------|-------------------|-----------------------|
| `GET /ecf-transactions/all-production` | **Todas las empresas** | `ambiente=eCF` | ❌ No |
| `GET /:empresa_uuid/ecf-transactions` | Una empresa | Ninguno | ✅ Sí |
| `GET /:empresa_uuid/ecf-transactions/pending` | Una empresa | `is_pushed_to_dgii=false` | ✅ Sí |

**Ejemplo con JavaScript:**
```javascript
const axios = require('axios');

async function getAllProductionTransactions(token, page = 1, limit = 20) {
  const response = await axios.get(
    `http://localhost:3001/api/v1/ecf-transactions/all-production`,
    {
      params: { page, limit },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const { data, pagination } = response.data;
  console.log(`Total transacciones: ${pagination.totalItems}`);
  console.log(`Empresas únicas: ${new Set(data.map(t => t.empresa_uuid)).size}`);

  return response.data;
}

// Uso
const token = 'tu-access-token';
getAllProductionTransactions(token, 1, 50)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

**Ejemplo con Python:**
```python
import requests

def get_all_production_transactions(token, page=1, limit=20):
    url = "http://localhost:3001/api/v1/ecf-transactions/all-production"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    params = {
        "page": page,
        "limit": limit
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    result = response.json()
    data = result['data']
    pagination = result['pagination']

    print(f"Total transacciones: {pagination['totalItems']}")
    unique_empresas = len(set(t['empresa_uuid'] for t in data))
    print(f"Empresas únicas: {unique_empresas}")

    return result

# Uso
token = "tu-access-token"
result = get_all_production_transactions(token, page=1, limit=50)
```

---

### Consultar Estado de Transacción
Consulta el estado de una transacción en DGII usando el trackId.

**Endpoint:** `GET /{empresa_uuid}/ecf-transactions/{trackId}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Ruta:**
- `empresa_uuid` (string, requerido): UUID de la empresa
- `trackId` (string, requerido): Track ID de la transacción

**Ejemplo:**
```bash
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions/TRK-2025092916212701
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "trackId": "TRK-2025092916212701",
    "status": "ACEPTADO",
    "statusCode": "200",
    "message": "Documento procesado exitosamente",
    "dgii_response": {
      "fecha_procesamiento": "2025-09-29T16:22:00.000Z",
      "codigo_seguridad": "SEC-123456",
      "url_qr": "https://dgii.gov.do/ecf/qr?code=ABC123"
    }
  },
  "message": "Estado de transacción consultado",
  "messages": [],
  "timestamp": "2025-09-29T16:25:00.000Z"
}
```

**Posibles Estados:**
- `ACEPTADO`: Documento aceptado por DGII
- `RECHAZADO`: Documento rechazado
- `EN_PROCESO`: En proceso de validación
- `ERROR`: Error en el procesamiento

---

### Listar Transacciones ECF
Lista todas las transacciones ECF de una empresa con filtros opcionales.

**Endpoint:** `GET /{empresa_uuid}/ecf-transactions`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Ruta:**
- `empresa_uuid` (string, requerido): UUID de la empresa

**Parámetros de Query (todos opcionales):**

| Parámetro | Tipo | Descripción | Valores Posibles | Ejemplo |
|-----------|------|-------------|------------------|---------|
| `tipo_ecf` | string | Filtrar por tipo de documento | `ECF`, `RFCE`, `ACECF` | `tipo_ecf=ECF` |
| `eNCF` | string | Filtrar por número específico | Formato: E + 11 dígitos | `eNCF=E320000000001` |
| `ambiente` | string | Filtrar por ambiente de ejecución | `PROD`, `CERT`, `DEV` | `ambiente=PROD` |
| `include_attempts` | boolean | Incluir intentos en la respuesta | `true` (default), `false` | `include_attempts=false` |

**Ejemplos:**
```bash
# Filtrar por tipo
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions?tipo_ecf=ECF

# Filtrar por ambiente de producción
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions?ambiente=PROD

# Filtrar por tipo y ambiente
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions?tipo_ecf=ECF&ambiente=PROD

# Filtrar por eNCF específico
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions?eNCF=E320000000001

# Incluir intentos en la respuesta
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions?include_attempts=true

# Combinar filtros con intentos
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions?ambiente=PROD&include_attempts=true
```

**Respuesta Exitosa (200) sin intentos:**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": [
    {
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "trackId": "TRK-2025092916212701",
      "eNCF": "E320000000001",
      "tipo_ecf": "ECF",
      "ambiente": "eCF",
      "is_pushed_to_dgii": true,
      "security_code": "SEC-123456",
      "created_at": "2025-09-29T16:21:27.000Z"
    },
    {
      "uuid": "8d0f7780-8536-51ef-b05c-f18gd2g01bf8",
      "trackId": "TRK-2025092815103402",
      "eNCF": "E320000000002",
      "tipo_ecf": "ECF",
      "ambiente": "CerteCF",
      "is_pushed_to_dgii": true,
      "security_code": "SEC-789012",
      "created_at": "2025-09-28T15:10:34.000Z"
    }
  ],
  "message": "Se encontraron 2 transacciones",
  "messages": [],
  "timestamp": "2025-09-29T16:30:00.000Z"
}
```

**Respuesta Exitosa (200) con intentos (`include_attempts=true`):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": [
    {
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "trackId": "TRK-2025092916212701",
      "eNCF": "E320000000001",
      "tipo_ecf": "ECF",
      "ambiente": "eCF",
      "is_pushed_to_dgii": true,
      "security_code": "SEC-123456",
      "created_at": "2025-09-29T16:21:27.000Z",
      "attempts": [
        {
          "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "ecf_transaction_uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
          "attempt_number": 1,
          "status": "SUCCESS",
          "description": "Transacción enviada exitosamente",
          "server_response": "{\"status\":\"ACEPTADO\",\"code\":\"200\"}",
          "response_code": "200",
          "execution_time_ms": 1523,
          "created_at": "2025-09-29T16:21:28.000Z"
        }
      ]
    },
    {
      "uuid": "8d0f7780-8536-51ef-b05c-f18gd2g01bf8",
      "trackId": "TRK-2025092815103402",
      "eNCF": "E320000000002",
      "tipo_ecf": "ECF",
      "ambiente": "CerteCF",
      "is_pushed_to_dgii": true,
      "security_code": "SEC-789012",
      "created_at": "2025-09-28T15:10:34.000Z",
      "attempts": [
        {
          "uuid": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
          "ecf_transaction_uuid": "8d0f7780-8536-51ef-b05c-f18gd2g01bf8",
          "attempt_number": 1,
          "status": "ERROR",
          "description": "Error de conexión",
          "server_response": "{\"error\":\"timeout\"}",
          "response_code": "408",
          "execution_time_ms": 30000,
          "created_at": "2025-09-28T15:10:35.000Z"
        },
        {
          "uuid": "c3d4e5f6-g7h8-9012-cdef-gh3456789012",
          "ecf_transaction_uuid": "8d0f7780-8536-51ef-b05c-f18gd2g01bf8",
          "attempt_number": 2,
          "status": "SUCCESS",
          "description": "Reintento exitoso",
          "server_response": "{\"status\":\"ACEPTADO\",\"code\":\"200\"}",
          "response_code": "200",
          "execution_time_ms": 1876,
          "created_at": "2025-09-28T15:11:10.000Z"
        }
      ]
    }
  ],
  "message": "Se encontraron 2 transacciones",
  "messages": [],
  "timestamp": "2025-09-29T16:30:00.000Z"
}
```

**Nota:** El parámetro `include_attempts` está habilitado por defecto (`true`) e incluye:
- 🔍 Historial completo de intentos sin hacer llamadas adicionales
- 📊 Análisis de rendimiento y debugging en una sola solicitud
- ⚠️ **Precaución:** Puede afectar el rendimiento con muchas transacciones

**Recomendación:** Si no necesita el detalle de los intentos, use `include_attempts=false` para optimizar el rendimiento en listados grandes.

---

### Obtener Transacción Específica
Obtiene los detalles completos de una transacción ECF específica.

**Endpoint:** `GET /{empresa_uuid}/ecf-transactions/transaction/{uuid}`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Ruta:**
- `empresa_uuid` (string, requerido): UUID de la empresa
- `uuid` (string, requerido): UUID de la transacción

**Ejemplo:**
```bash
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions/transaction/7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "trackId": "TRK-2025092916212701",
    "eNCF": "E320000000001",
    "tipo_ecf": "ECF",
    "ambiente": "eCF",
    "empresa_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "transaction_data": "{\"ECF\":{\"Encabezado\":{...}}}",
    "is_pushed_to_dgii": true,
    "url_qr": "https://dgii.gov.do/ecf/qr?code=ABC123",
    "url_qr_rfce": "https://dgii.gov.do/rfce/qr?code=DEF456",
    "security_code": "SEC-123456",
    "xml_generated": "<?xml version=\"1.0\"?>...",
    "xml_generated_path": "certificates/.../ECF/E320000000001.xml",
    "xml_generated_rcfe": "<?xml version=\"1.0\"?>...",
    "xml_generated_path_rfce": "certificates/.../RFCE/RFCE-E320000000001.xml",
    "transaction_less_than_250": false,
    "is_rfce": true,
    "last_date_execution": "2025-09-29T16:21:45.000Z",
    "created_at": "2025-09-29T16:21:27.000Z",
    "updated_at": "2025-09-29T16:21:45.000Z"
  },
  "message": "Transacción obtenida exitosamente",
  "messages": [],
  "timestamp": "2025-09-29T16:35:00.000Z"
}
```

**Errores Comunes:**
- `404 Not Found`: Transacción no encontrada
- `400 Bad Request`: UUID inválido

---

### Obtener Intentos de una Transacción
Obtiene el historial completo de todos los intentos de envío al DGII para una transacción específica.

**Endpoint:** `GET /{empresa_uuid}/ecf-transactions/{transactionId}/attempts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Ruta:**
- `empresa_uuid` (string, requerido): UUID de la empresa
- `transactionId` (string, requerido): UUID de la transacción ECF

**Ejemplo:**
```bash
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions/7c9e6679-7425-40de-944b-e07fc1f90ae7/attempts
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": [
    {
      "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "ecf_transaction_uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "attempt_number": 1,
      "status": "ERROR",
      "description": "Error de conexión con DGII",
      "server_response": "{\"error\":\"Connection timeout\"}",
      "response_code": "408",
      "execution_time_ms": 30000,
      "created_at": "2025-09-29T16:21:28.000Z",
      "updated_at": "2025-09-29T16:21:28.000Z"
    },
    {
      "uuid": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "ecf_transaction_uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "attempt_number": 2,
      "status": "SUCCESS",
      "description": "Transacción enviada exitosamente",
      "server_response": "{\"status\":\"ACEPTADO\",\"code\":\"200\"}",
      "response_code": "200",
      "execution_time_ms": 1523,
      "created_at": "2025-09-29T16:22:15.000Z",
      "updated_at": "2025-09-29T16:22:15.000Z"
    }
  ],
  "message": "Se encontraron 2 intentos para esta transacción",
  "messages": [],
  "timestamp": "2025-09-29T16:40:00.000Z"
}
```

**Respuesta Sin Intentos (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": [],
  "message": "No se encontraron intentos para esta transacción",
  "messages": [],
  "timestamp": "2025-09-29T16:40:00.000Z"
}
```

**Información Incluida en Cada Intento:**
- `uuid`: ID único del intento
- `ecf_transaction_uuid`: UUID de la transacción asociada
- `attempt_number`: Número secuencial del intento
- `status`: Estado del intento (SUCCESS, ERROR, TIMEOUT, REJECTED, etc.)
- `description`: Descripción detallada del resultado
- `server_response`: Respuesta completa del servidor DGII (JSON)
- `response_code`: Código de respuesta HTTP o código específico de DGII
- `execution_time_ms`: Tiempo de ejecución en milisegundos
- `created_at`: Fecha y hora del intento
- `updated_at`: Última actualización del registro

**Posibles Estados de Intentos:**
- `SUCCESS`: Intento exitoso
- `ERROR`: Error general
- `TIMEOUT`: Tiempo de espera agotado
- `REJECTED`: Rechazado por DGII
- `VALIDATION_ERROR`: Error de validación
- `CONNECTION_ERROR`: Error de conexión

**Casos de Uso:**
- 🔍 Debugging de transacciones fallidas
- 📊 Auditoría de intentos de envío
- ⏱️ Análisis de tiempos de respuesta del DGII
- 🔄 Seguimiento de reintentos automáticos

**Errores Comunes:**
- `404 Not Found`: Transacción no encontrada
- `500 Internal Server Error`: Error al consultar los intentos

---

### Obtener Transacción con Historial de Intentos
Obtiene una transacción ECF junto con el historial de todos sus intentos de envío.

**Endpoint:** `GET /{empresa_uuid}/ecf-transactions/transaction/{uuid}/with-attempts`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Ruta:**
- `empresa_uuid` (string, requerido): UUID de la empresa
- `uuid` (string, requerido): UUID de la transacción

**Ejemplo:**
```bash
GET /550e8400-e29b-41d4-a716-446655440000/ecf-transactions/transaction/7c9e6679-7425-40de-944b-e07fc1f90ae7/with-attempts
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "transaction": {
      "uuid": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "trackId": "TRK-2025092916212701",
      "eNCF": "E320000000001",
      "tipo_ecf": "ECF",
      "is_pushed_to_dgii": true,
      "created_at": "2025-09-29T16:21:27.000Z"
    },
    "attempts": [
      {
        "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "attempt_number": 1,
        "status": "SUCCESS",
        "description": "Transacción enviada exitosamente",
        "server_response": "{\"status\":\"ACEPTADO\",\"code\":\"200\"}",
        "response_code": "200",
        "execution_time_ms": 1523,
        "created_at": "2025-09-29T16:21:28.000Z"
      }
    ]
  },
  "message": "Transacción con intentos obtenida exitosamente",
  "messages": [],
  "timestamp": "2025-09-29T16:40:00.000Z"
}
```

---

### Reenviar Transacción a DGII
Reenvía una transacción ECF previamente creada al sistema DGII.

**Endpoint:** `POST /{empresa_uuid}/ecf-transactions/transaction/{uuid}/send-to-dgii`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parámetros de Ruta:**
- `empresa_uuid` (string, requerido): UUID de la empresa
- `uuid` (string, requerido): UUID de la transacción

**Ejemplo:**
```bash
POST /550e8400-e29b-41d4-a716-446655440000/ecf-transactions/transaction/7c9e6679-7425-40de-944b-e07fc1f90ae7/send-to-dgii
```

**Respuesta Exitosa (200):**
```json
{
  "statusCode": 200,
  "isValid": true,
  "isSuccess": true,
  "data": {
    "trackId": "TRK-2025092916212701",
    "status": "SENT",
    "message": "Transacción reenviada exitosamente"
  },
  "message": "Transacción enviada a DGII",
  "messages": [],
  "timestamp": "2025-09-29T16:45:00.000Z"
}
```

**Errores Comunes:**
- `400 Bad Request`: La transacción ya fue enviada exitosamente
- `404 Not Found`: Transacción no encontrada

---

## Códigos de Error

### Códigos HTTP
- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en los datos de entrada
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Sin permisos para acceder al recurso
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto con el estado actual (ej. RNC duplicado)
- `410 Gone`: Recurso expirado (ej. certificado vencido)
- `422 Unprocessable Entity`: Errores críticos de estructura
- `500 Internal Server Error`: Error interno del servidor

### Códigos de Validación de Certificados
Los siguientes códigos de error se retornan en el campo `errorType` cuando hay problemas al subir o validar certificados:

| Código | Descripción | Solución |
|--------|-------------|----------|
| `INVALID_PATH` | El path del certificado está vacío o no es válido | Verificar que se proporcionó el archivo |
| `FILE_NOT_FOUND` | El archivo del certificado no existe en la ruta especificada | Verificar que el archivo existe |
| `EMPTY_FILE` | El archivo del certificado está vacío | Proporcionar un archivo válido |
| `MISSING_PASSWORD` | No se proporcionó contraseña para el certificado | Proporcionar la contraseña del certificado |
| `INVALID_PASSWORD` | La contraseña del certificado es incorrecta | Verificar la contraseña del certificado .p12/.pfx |
| `INVALID_FORMAT` | El archivo no es un certificado PKCS#12 válido | Asegurar que el archivo sea .p12 o .pfx |
| `INVALID_CERTIFICATE_CONTENT` | El certificado no contiene la información necesaria | El certificado debe contener clave privada y certificado público |
| `EXPIRED_CERTIFICATE` | El certificado ha expirado | Renovar el certificado con DGII |
| `PERMISSION_DENIED` | No se tienen permisos para leer el archivo | Verificar permisos del sistema de archivos |
| `PROCESSING_ERROR` | Error genérico al procesar el certificado | Revisar logs del servidor para más detalles |

### Códigos de Validación ECF
- `MISSING_ECF_STRUCTURE`: Falta la estructura ECF
- `MISSING_ENCABEZADO`: Falta el Encabezado
- `MISSING_IDDOC`: Falta IdDoc
- `INVALID_TIPO_ECF`: TipoeCF inválido
- `INVALID_ENCF_FORMAT`: Formato de eNCF inválido (debe ser E + 11 dígitos)
- `INVALID_RNC_FORMAT`: Formato de RNC inválido (debe tener 9 dígitos)
- `INVALID_DATE_FORMAT`: Formato de fecha inválido (debe ser DD-MM-YYYY)
- `MISSING_EMISOR`: Falta información del Emisor
- `MISSING_COMPRADOR`: Falta información del Comprador
- `MISSING_TOTALES`: Falta información de Totales
- `MISSING_DETALLES_ITEMS`: Falta el detalle de ítems
- `INVALID_TOTALS`: Los totales no cuadran correctamente

### Valores de Ambiente
El sistema soporta tres ambientes para procesamiento de documentos fiscales:

| Enum | Valor Interno | Descripción | Uso |
|------|---------------|-------------|-----|
| `PROD` | `eCF` | Producción | Documentos fiscales reales enviados a DGII |
| `CERT` | `CerteCF` | Certificación | Validación y pruebas antes de producción |
| `DEV` | `TesteCF` | Desarrollo | Pruebas locales y desarrollo |

**Importante:**
- Los valores `PROD`, `CERT`, `DEV` son los que se usan en la API
- Internamente se mapean a `eCF`, `CerteCF`, `TesteCF` respectivamente
- El ambiente determina la URL del servidor DGII al que se envían los documentos

---

## Ejemplos de Integración

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api/v1';

// 1. Login
async function login() {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username: 'admin',
    password: 'admin123'
  });
  return response.data.data.access_token;
}

// 2. Listar Empresas
async function listarEmpresas(token, page = 1, pageSize = 10, search = '') {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (pageSize) params.append('pageSize', pageSize);
  if (search) params.append('search', search);

  const response = await axios.get(
    `${API_BASE_URL}/integration/empresa?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
}

// 3. Obtener Empresa por UUID
async function obtenerEmpresa(token, empresaUuid) {
  const response = await axios.get(
    `${API_BASE_URL}/integration/empresa/${empresaUuid}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
}

// 4. Crear Transacción ECF
async function crearECF(token, empresaUuid, ecfData) {
  const response = await axios.post(
    `${API_BASE_URL}/${empresaUuid}/ecf-transactions`,
    { data: ecfData },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

// 5. Consultar Estado
async function consultarEstado(token, empresaUuid, trackId) {
  const response = await axios.get(
    `${API_BASE_URL}/${empresaUuid}/ecf-transactions/${trackId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
}

// Uso completo
async function main() {
  try {
    // Login
    const token = await login();
    console.log('Login exitoso');

    // Listar empresas
    const empresas = await listarEmpresas(token, 1, 10);
    console.log('Empresas:', empresas.data);

    // Obtener primera empresa
    const empresaUuid = empresas.data[0].uuid;
    const empresa = await obtenerEmpresa(token, empresaUuid);
    console.log('Empresa seleccionada:', empresa.data);

    // Datos del ECF
    const ecfData = {
      ECF: {
        Encabezado: {
          Version: "1.0",
          IdDoc: {
            TipoeCF: "32",
            eNCF: "E320000000001",
            IndicadorMontoGravado: "0",
            TipoIngresos: "01",
            TipoPago: "1"
          },
          Emisor: {
            RNCEmisor: "123456789",
            RazonSocialEmisor: "MI EMPRESA S.R.L.",
            NombreComercial: "MI EMPRESA",
            DireccionEmisor: "Calle Principal #123",
            CorreoEmisor: "info@miempresa.com",
            FechaEmision: "29-09-2025"
          },
          Comprador: {
            RNCComprador: "987654321",
            RazonSocialComprador: "CLIENTE EJEMPLO"
          },
          Totales: {
            MontoGravadoTotal: "1000.00",
            MontoGravadoI1: "1000.00",
            ITBIS1: "18",
            TotalITBIS: "180.00",
            TotalITBIS1: "180.00",
            MontoTotal: "1180.00"
          }
        },
        DetallesItems: {
          Item: [{
            NumeroLinea: "1",
            IndicadorFacturacion: "1",
            NombreItem: "Producto de Prueba",
            IndicadorBienoServicio: "1",
            CantidadItem: "1.00",
            UnidadMedida: "55",
            PrecioUnitarioItem: "1000.00",
            MontoItem: "1000.00"
          }]
        },
        FechaHoraFirma: "29-09-2025 16:21:27"
      }
    };

    // Crear transacción (usando el UUID de la empresa obtenida)
    const resultado = await crearECF(token, empresaUuid, ecfData);
    console.log('Transacción creada:', resultado);

    // Consultar estado
    const trackId = resultado.data.trackId;
    const estado = await consultarEstado(token, empresaUuid, trackId);
    console.log('Estado:', estado);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
```

### Python

```python
import requests
import json

API_BASE_URL = 'http://localhost:3001/api/v1'

# 1. Login
def login():
    response = requests.post(
        f'{API_BASE_URL}/auth/login',
        json={
            'username': 'admin',
            'password': 'admin123'
        }
    )
    response.raise_for_status()
    return response.json()['data']['access_token']

# 2. Listar Empresas
def listar_empresas(token, page=1, page_size=10, search=''):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {}
    if page:
        params['page'] = page
    if page_size:
        params['pageSize'] = page_size
    if search:
        params['search'] = search

    response = requests.get(
        f'{API_BASE_URL}/integration/empresa',
        headers=headers,
        params=params
    )
    response.raise_for_status()
    return response.json()

# 3. Obtener Empresa por UUID
def obtener_empresa(token, empresa_uuid):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(
        f'{API_BASE_URL}/integration/empresa/{empresa_uuid}',
        headers=headers
    )
    response.raise_for_status()
    return response.json()

# 4. Crear Transacción ECF
def crear_ecf(token, empresa_uuid, ecf_data):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(
        f'{API_BASE_URL}/{empresa_uuid}/ecf-transactions',
        json={'data': ecf_data},
        headers=headers
    )
    response.raise_for_status()
    return response.json()

# 5. Consultar Estado
def consultar_estado(token, empresa_uuid, track_id):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(
        f'{API_BASE_URL}/{empresa_uuid}/ecf-transactions/{track_id}',
        headers=headers
    )
    response.raise_for_status()
    return response.json()

# Uso completo
def main():
    try:
        # Login
        token = login()
        print('Login exitoso')

        # Listar empresas
        empresas = listar_empresas(token, 1, 10)
        print(f'Total empresas: {empresas["total"]}')

        # Obtener primera empresa
        empresa_uuid = empresas['data'][0]['uuid']
        empresa = obtener_empresa(token, empresa_uuid)
        print(f'Empresa seleccionada: {empresa["data"]["nombre_empresa"]}')

        # Datos del ECF
        ecf_data = {
            "ECF": {
                "Encabezado": {
                    "Version": "1.0",
                    "IdDoc": {
                        "TipoeCF": "32",
                        "eNCF": "E320000000001",
                        "IndicadorMontoGravado": "0",
                        "TipoIngresos": "01",
                        "TipoPago": "1"
                    },
                    "Emisor": {
                        "RNCEmisor": "123456789",
                        "RazonSocialEmisor": "MI EMPRESA S.R.L.",
                        "NombreComercial": "MI EMPRESA",
                        "DireccionEmisor": "Calle Principal #123",
                        "CorreoEmisor": "info@miempresa.com",
                        "FechaEmision": "29-09-2025"
                    },
                    "Comprador": {
                        "RNCComprador": "987654321",
                        "RazonSocialComprador": "CLIENTE EJEMPLO"
                    },
                    "Totales": {
                        "MontoGravadoTotal": "1000.00",
                        "MontoGravadoI1": "1000.00",
                        "ITBIS1": "18",
                        "TotalITBIS": "180.00",
                        "TotalITBIS1": "180.00",
                        "MontoTotal": "1180.00"
                    }
                },
                "DetallesItems": {
                    "Item": [{
                        "NumeroLinea": "1",
                        "IndicadorFacturacion": "1",
                        "NombreItem": "Producto de Prueba",
                        "IndicadorBienoServicio": "1",
                        "CantidadItem": "1.00",
                        "UnidadMedida": "55",
                        "PrecioUnitarioItem": "1000.00",
                        "MontoItem": "1000.00"
                    }]
                },
                "FechaHoraFirma": "29-09-2025 16:21:27"
            }
        }

        # Crear transacción (usando el UUID de la empresa obtenida)
        resultado = crear_ecf(token, empresa_uuid, ecf_data)
        print(f'Transacción creada: {resultado}')

        # Consultar estado
        track_id = resultado['data']['trackId']
        estado = consultar_estado(token, empresa_uuid, track_id)
        print(f'Estado: {estado}')

    except requests.exceptions.RequestException as e:
        print(f'Error: {e.response.json() if e.response else e}')

if __name__ == '__main__':
    main()
```

### cURL

```bash
#!/bin/bash

API_BASE_URL="http://localhost:3001/api/v1"

# 1. Login
TOKEN=$(curl -s -X POST "${API_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.data.access_token')

echo "Token obtenido: ${TOKEN}"

# 2. Listar Empresas
echo "Listando empresas..."
EMPRESAS=$(curl -s -X GET "${API_BASE_URL}/integration/empresa?page=1&pageSize=10" \
  -H "Authorization: Bearer ${TOKEN}")

# También puedes omitir los parámetros para usar los valores por defecto
# EMPRESAS=$(curl -s -X GET "${API_BASE_URL}/integration/empresa" \
#   -H "Authorization: Bearer ${TOKEN}")

echo "Empresas: ${EMPRESAS}"

# 3. Obtener UUID de la primera empresa
EMPRESA_UUID=$(echo "${EMPRESAS}" | jq -r '.data[0].uuid')
echo "UUID de empresa seleccionada: ${EMPRESA_UUID}"

# 4. Obtener detalles de la empresa
echo "Obteniendo detalles de la empresa..."
EMPRESA=$(curl -s -X GET "${API_BASE_URL}/integration/empresa/${EMPRESA_UUID}" \
  -H "Authorization: Bearer ${TOKEN}")

echo "Empresa: ${EMPRESA}"

# 5. Crear Transacción ECF

RESPONSE=$(curl -s -X POST "${API_BASE_URL}/${EMPRESA_UUID}/ecf-transactions" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "ECF": {
        "Encabezado": {
          "Version": "1.0",
          "IdDoc": {
            "TipoeCF": "32",
            "eNCF": "E320000000001",
            "IndicadorMontoGravado": "0",
            "TipoIngresos": "01",
            "TipoPago": "1"
          },
          "Emisor": {
            "RNCEmisor": "123456789",
            "RazonSocialEmisor": "MI EMPRESA S.R.L.",
            "NombreComercial": "MI EMPRESA",
            "DireccionEmisor": "Calle Principal #123",
            "CorreoEmisor": "info@miempresa.com",
            "FechaEmision": "29-09-2025"
          },
          "Comprador": {
            "RNCComprador": "987654321",
            "RazonSocialComprador": "CLIENTE EJEMPLO"
          },
          "Totales": {
            "MontoGravadoTotal": "1000.00",
            "MontoGravadoI1": "1000.00",
            "ITBIS1": "18",
            "TotalITBIS": "180.00",
            "TotalITBIS1": "180.00",
            "MontoTotal": "1180.00"
          }
        },
        "DetallesItems": {
          "Item": [{
            "NumeroLinea": "1",
            "IndicadorFacturacion": "1",
            "NombreItem": "Producto de Prueba",
            "IndicadorBienoServicio": "1",
            "CantidadItem": "1.00",
            "UnidadMedida": "55",
            "PrecioUnitarioItem": "1000.00",
            "MontoItem": "1000.00"
          }]
        },
        "FechaHoraFirma": "29-09-2025 16:21:27"
      }
    }
  }')

echo "Respuesta: ${RESPONSE}"

# 6. Obtener TrackID
TRACK_ID=$(echo "${RESPONSE}" | jq -r '.data.trackId')
echo "Track ID: ${TRACK_ID}"

# 7. Consultar Estado
echo "Consultando estado de la transacción..."
curl -X GET "${API_BASE_URL}/${EMPRESA_UUID}/ecf-transactions/${TRACK_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Notas Importantes

### Seguridad y Autenticación
1. **Autenticación Obligatoria**: Todos los endpoints requieren autenticación JWT excepto `/auth/login`
2. **Headers Requeridos**: Debe incluir `Authorization: Bearer {access_token}` en todas las solicitudes protegidas
3. **Expiración de Tokens**: Los tokens JWT expiran en 15 minutos. Use el refresh token para renovarlos
4. **Errores de Autenticación**: Recibirá un código `401 Unauthorized` si el token es inválido o ha expirado

### Formatos de Datos
5. **Formato de Fechas**: Todas las fechas deben estar en formato `DD-MM-YYYY` (ejemplo: `29-09-2025`)
6. **Formato de RNC**: Debe tener exactamente 9 dígitos numéricos
7. **Formato de eNCF**: Debe seguir el patrón `E + 11 dígitos` (ejemplo: `E320000000001`)

### Configuración del Sistema
8. **Ambientes**: El sistema soporta ambientes de PRODUCCIÓN y DESARROLLO (configurado por empresa)
9. **Certificados**: Cada empresa debe tener un certificado digital válido (.p12) para firmar documentos
10. **Validación**: El sistema realiza validaciones exhaustivas antes de enviar al DGII
11. **Reintentos**: Las transacciones fallidas pueden ser reenviadas usando el endpoint `/send-to-dgii`
12. **Paginación**: Por defecto, los endpoints devuelven 10 resultados por página

---

## Soporte

Para reportar problemas o solicitar asistencia:
- Email: soporte@tuempresa.com
- Documentación DGII: https://dgii.gov.do/

---

**Versión del Documento:** 1.4
**Última Actualización:** 2025-11-04

## Historial de Cambios

### Versión 1.4 (2025-11-04)
- ✅ **Nuevo endpoint global:** `GET /ecf-transactions/all-production` - Lista TODAS las transacciones en producción de todas las empresas
- ✅ Endpoint global no requiere `empresa_uuid` en la ruta
- ✅ Filtro automático por ambiente de producción (`ambiente='eCF'`)
- ✅ Soporta filtros adicionales: `tipo_ecf`, `eNCF`, `empresa_uuid`, `is_pushed_to_dgii`
- ✅ Nuevo controller `GlobalEcfTransactionController` para endpoints globales
- ✅ Documentación completa con ejemplos en cURL, JavaScript y Python
- ✅ Casos de uso documentados: dashboards administrativos, reportes consolidados, auditorías
- ✅ Tabla comparativa de diferencias entre endpoints globales y por empresa

### Versión 1.3 (2025-10-03)
- ✅ **Corrección crítica:** Paginación en endpoint de listar empresas ahora funciona correctamente con `skip` y `take`
- ✅ **Mejora importante:** Sistema de manejo de errores mejorado para subida de certificados
- ✅ Nuevos códigos de error específicos para validación de certificados (`INVALID_PASSWORD`, `INVALID_FORMAT`, `EXPIRED_CERTIFICATE`, etc.)
- ✅ Mensajes de error más claros y útiles para el frontend en validación de certificados
- ✅ Nuevos códigos HTTP: `403 Forbidden`, `409 Conflict`, `410 Gone`
- ✅ Tabla completa de códigos de error de certificados con soluciones
- ✅ Ejemplos de respuestas de error en formato JSON para certificados
- ✅ Documentación actualizada de códigos HTTP con nuevos estados
- ✅ Campo `total` en respuesta de listar empresas para implementar paginadores
- ✅ Cálculo correcto de paginación: `skip = (page - 1) * pageSize`

### Versión 1.2 (2025-10-01)
- ✅ **Cambio importante:** `include_attempts` ahora es `true` por defecto en el listado de transacciones
- ✅ Optimización: usar `include_attempts=false` para excluir intentos y mejorar rendimiento en listados grandes
- ✅ **Nuevo endpoint:** Crear empresa (POST `/integration/empresa`)
- ✅ **Nuevo endpoint:** Subir certificado digital (POST `/integration/empresa/{uuid}/certificado`)
- ✅ **Nuevo endpoint:** Actualizar empresa con campo `EnviromentMode` para cambiar ambiente de ejecución (PUT `/integration/empresa`)
- ✅ **Nuevo endpoint:** Firmar archivos XML con certificado digital (POST `/integration/empresa/{uuid}/sign-xml`)
- ✅ Agregado campo `EnviromentMode` al DTO de actualización de empresas
- ✅ Documentación completa de gestión de empresas con flujo típico de configuración
- ✅ Documentación de validaciones de certificados digitales
- ✅ Documentación del endpoint de firma XML para postulación y declaraciones juradas
- ✅ Advertencias de seguridad sobre cambio de ambiente PROD/CERT/DEV
- ✅ Corrección de valores de ambiente en respuestas: ahora muestra `eCF`, `CerteCF`, `TesteCF` (valores internos)
- ✅ Ejemplos completos en cURL, JavaScript y Python para todos los endpoints

### Versión 1.1 (2025-10-01)
- ✅ **Nuevo endpoint:** Obtener intentos de una transacción ECF (`GET /{empresa_uuid}/ecf-transactions/{transactionId}/attempts`)
- ✅ **Nuevo parámetro:** `include_attempts` en endpoint de listar transacciones para incluir intentos en la respuesta
- ✅ Agregado filtro opcional por `ambiente` en endpoint de listar transacciones ECF
- ✅ Documentación de valores de ambiente (PROD, CERT, DEV)
- ✅ Mejorada seguridad: todos los endpoints de empresas ahora requieren autenticación
- ✅ Agregado parámetro opcional `search` en endpoint de listar empresas
- ✅ Campo `pageSize` con valor por defecto de 10 en listado de empresas
- ✅ Tabla de filtros disponibles para transacciones ECF
- ✅ Documentación completa de estados de intentos y casos de uso
- ✅ Ejemplos de respuesta con y sin intentos incluidos

### Versión 1.0 (2025-09-29)
- ✅ Documentación inicial de la API
- ✅ Endpoints de autenticación
- ✅ Endpoints de empresas (listar y obtener)
- ✅ Endpoints de transacciones ECF (crear, listar, consultar estado)
- ✅ Ejemplos de integración en JavaScript, Python y cURL
