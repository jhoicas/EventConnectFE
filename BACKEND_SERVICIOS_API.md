# Backend: API de Servicios para EventConnect

## Contexto
EventConnect es una plataforma que conecta empresas proveedoras de servicios para eventos (alquiler de sillas, mobiliario, sonido, meseros, decoración, catering, etc.). Los servicios deben mostrarse en la landing page con fotos y descripciones, administrados por usuarios con rol "Admin-Proveedor".

## Modelo de Datos

### Tabla: `servicios`

```sql
CREATE TABLE servicios (
  id_Servicio INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  icono VARCHAR(50) NULL,
  imagen_Url VARCHAR(500) NOT NULL,
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_Actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices recomendados
CREATE INDEX idx_activo_orden ON servicios(activo, orden);
CREATE INDEX idx_fecha_creacion ON servicios(fecha_Creacion);
```

### Campos Explicados

- **id_Servicio**: Identificador único (PK, auto-increment)
- **titulo**: Nombre del servicio (ej: "Alquiler de Sillas", "Sonido para Eventos")
- **descripcion**: Descripción detallada del servicio
- **icono**: Nombre del ícono o categoría (opcional, para UI)
- **imagen_Url**: URL de la imagen del servicio (requerido)
- **orden**: Número para ordenar servicios en landing page (menor = primero)
- **activo**: Booleano para mostrar/ocultar en landing page
- **fecha_Creacion**: Timestamp de creación automático
- **fecha_Actualizacion**: Timestamp de última modificación

## Endpoints Requeridos

### 1. GET /api/servicios (Público)
**Descripción**: Lista servicios activos para mostrar en landing page

**Autenticación**: NO requerida (público)

**Query Parameters**:
- `activo` (optional, default: true): Filtrar por servicios activos

**Response 200 OK**:
```json
[
  {
    "id_Servicio": 1,
    "titulo": "Alquiler de Sillas",
    "descripcion": "Amplio catálogo de sillas para todo tipo de eventos. Desde sillas plegables hasta sillas tiffany y chiavari.",
    "icono": "chair",
    "imagen_Url": "https://ejemplo.com/images/sillas.jpg",
    "orden": 1,
    "activo": true,
    "fecha_Creacion": "2026-01-29T10:00:00Z",
    "fecha_Actualizacion": "2026-01-29T10:00:00Z"
  },
  {
    "id_Servicio": 2,
    "titulo": "Sonido para Fiestas",
    "descripcion": "Equipo de sonido profesional para eventos de cualquier tamaño. Incluye amplificadores, bocinas y micrófonos.",
    "icono": "speaker",
    "imagen_Url": "https://ejemplo.com/images/sonido.jpg",
    "orden": 2,
    "activo": true,
    "fecha_Creacion": "2026-01-29T10:30:00Z",
    "fecha_Actualizacion": "2026-01-29T10:30:00Z"
  }
]
```

**Ordenamiento**: Por campo `orden` ASC, luego `fecha_Creacion` DESC

---

### 2. GET /api/servicios/admin (Admin)
**Descripción**: Lista TODOS los servicios (activos e inactivos) para panel admin

**Autenticación**: Requerida (Bearer Token)

**Autorización**: Solo rol "Admin-Proveedor"

**Response 200 OK**: Mismo formato que endpoint público, pero incluye servicios con `activo: false`

**Response 401 Unauthorized**:
```json
{
  "error": "No autorizado",
  "message": "Token de autenticación requerido"
}
```

**Response 403 Forbidden**:
```json
{
  "error": "Acceso denegado",
  "message": "Solo administradores pueden acceder a este recurso"
}
```

---

### 3. POST /api/servicios (Admin)
**Descripción**: Crear nuevo servicio

**Autenticación**: Requerida

**Autorización**: Solo rol "Admin-Proveedor"

**Request Body**:
```json
{
  "titulo": "Meseros Profesionales",
  "descripcion": "Servicio de meseros capacitados para eventos corporativos y sociales.",
  "imagen_Url": "https://ejemplo.com/images/meseros.jpg",
  "icono": "users",
  "orden": 3,
  "activo": true
}
```

**Validaciones**:
- `titulo`: Requerido, min 3 caracteres, max 100
- `descripcion`: Requerido, min 10 caracteres
- `imagen_Url`: Requerido, formato URL válido
- `icono`: Opcional, max 50 caracteres
- `orden`: Opcional, entero >= 0, default: 0
- `activo`: Opcional, boolean, default: true

**Response 201 Created**:
```json
{
  "id_Servicio": 3,
  "titulo": "Meseros Profesionales",
  "descripcion": "Servicio de meseros capacitados para eventos corporativos y sociales.",
  "imagen_Url": "https://ejemplo.com/images/meseros.jpg",
  "icono": "users",
  "orden": 3,
  "activo": true,
  "fecha_Creacion": "2026-01-29T11:00:00Z",
  "fecha_Actualizacion": "2026-01-29T11:00:00Z"
}
```

**Response 400 Bad Request**:
```json
{
  "error": "Validación fallida",
  "message": "Errores en los datos enviados",
  "errors": {
    "titulo": "El título debe tener al menos 3 caracteres",
    "imagen_Url": "Debe ser una URL válida"
  }
}
```

---

### 4. PUT /api/servicios/:id (Admin)
**Descripción**: Actualizar servicio existente

**Autenticación**: Requerida

**Autorización**: Solo rol "Admin-Proveedor"

**Path Parameter**: `id` (id_Servicio)

**Request Body** (todos los campos opcionales):
```json
{
  "titulo": "Alquiler de Sillas Premium",
  "descripcion": "Actualización de la descripción...",
  "imagen_Url": "https://ejemplo.com/images/sillas-premium.jpg",
  "orden": 1,
  "activo": false
}
```

**Response 200 OK**: Servicio actualizado (mismo formato que POST)

**Response 404 Not Found**:
```json
{
  "error": "No encontrado",
  "message": "Servicio con ID 999 no existe"
}
```

---

### 5. DELETE /api/servicios/:id (Admin)
**Descripción**: Eliminar servicio (preferiblemente soft delete: `activo = false`)

**Autenticación**: Requerida

**Autorización**: Solo rol "Admin-Proveedor"

**Path Parameter**: `id` (id_Servicio)

**Implementación Recomendada**: Soft delete
```sql
UPDATE servicios SET activo = false WHERE id_Servicio = ?
```

**Response 200 OK** (soft delete):
```json
{
  "message": "Servicio desactivado exitosamente",
  "id_Servicio": 1
}
```

**Response 204 No Content** (hard delete): Sin body

---

## Consideraciones de Seguridad

### Autenticación
- Usar JWT (JSON Web Tokens) en header `Authorization: Bearer <token>`
- Token debe incluir `rol` del usuario en el payload
- Endpoints públicos: GET /api/servicios
- Endpoints protegidos: Todo lo demás

### Autorización
```javascript
// Middleware ejemplo (Node.js/Express)
const requireAdmin = (req, res, next) => {
  const userRole = req.user?.rol; // Del token decodificado
  
  if (userRole !== 'Admin-Proveedor') {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'Solo administradores pueden acceder'
    });
  }
  
  next();
};

// Uso
router.post('/servicios', authenticateToken, requireAdmin, createServicio);
```

### Validación de URLs
```javascript
// Validar que imagen_Url sea una URL válida y segura
const isValidImageUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
```

---

## CORS Configuration

**Importante**: Configurar CORS para permitir requests desde el frontend

```javascript
// Express.js ejemplo
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173', // Dev
    'https://eventconnect-qihii.ondigitalocean.app' // Producción
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Ejemplos de Uso Frontend

El frontend ya está implementado con RTK Query:

```typescript
// Hook para obtener servicios públicos (landing page)
const { data: servicios, isLoading, error } = useGetServiciosPublicosQuery();

// Hook admin para crear servicio
const [createServicio, { isLoading }] = useCreateServicioMutation();

await createServicio({
  titulo: "Nuevo Servicio",
  descripcion: "Descripción...",
  imagen_Url: "https://...",
  orden: 5
});
```

---

## Base URL Configurada en Frontend

```
VITE_API_BASE_URL=https://eventconnect-api-8oih6.ondigitalocean.app/api
```

Endpoints esperados:
- GET https://eventconnect-api-8oih6.ondigitalocean.app/api/servicios
- POST https://eventconnect-api-8oih6.ondigitalocean.app/api/servicios
- etc.

---

## Testing Recomendado

### Datos de Prueba
```sql
INSERT INTO servicios (titulo, descripcion, imagen_Url, icono, orden, activo) VALUES
('Alquiler de Sillas', 'Amplio catálogo de sillas para eventos', 'https://picsum.photos/seed/sillas/400/300', 'chair', 1, true),
('Sonido para Fiestas', 'Equipo de sonido profesional', 'https://picsum.photos/seed/sonido/400/300', 'speaker', 2, true),
('Mobiliario para Eventos', 'Mesas, sillas, manteles y decoración', 'https://picsum.photos/seed/mobiliario/400/300', 'table', 3, true),
('Servicio de Meseros', 'Personal capacitado para atender eventos', 'https://picsum.photos/seed/meseros/400/300', 'users', 4, true),
('Decoración y Ambientación', 'Diseño y montaje decorativo', 'https://picsum.photos/seed/decoracion/400/300', 'sparkles', 5, true),
('Catering y Banquetes', 'Servicio completo de alimentos y bebidas', 'https://picsum.photos/seed/catering/400/300', 'utensils', 6, true);
```

### Pruebas con cURL

```bash
# GET servicios públicos
curl https://eventconnect-api-8oih6.ondigitalocean.app/api/servicios

# POST crear servicio (con auth)
curl -X POST https://eventconnect-api-8oih6.ondigitalocean.app/api/servicios \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nuevo Servicio",
    "descripcion": "Descripción del servicio",
    "imagen_Url": "https://ejemplo.com/imagen.jpg",
    "orden": 7
  }'
```

---

## Checklist de Implementación

- [ ] Crear tabla `servicios` en base de datos
- [ ] Implementar modelo/entity de Servicio
- [ ] Crear endpoint GET /api/servicios (público)
- [ ] Crear endpoint GET /api/servicios/admin (protegido)
- [ ] Crear endpoint POST /api/servicios (protegido)
- [ ] Crear endpoint PUT /api/servicios/:id (protegido)
- [ ] Crear endpoint DELETE /api/servicios/:id (protegido)
- [ ] Configurar CORS para frontend
- [ ] Implementar middleware de autenticación
- [ ] Implementar middleware de autorización (role check)
- [ ] Agregar validaciones de datos
- [ ] Insertar datos de prueba
- [ ] Probar con Postman/Insomnia/cURL
- [ ] Verificar que frontend consume correctamente

---

## Próximos Pasos (Opcional)

1. **Upload de Imágenes**: En lugar de URLs externas, permitir upload directo
   - Endpoint: POST /api/servicios/upload
   - Storage: AWS S3, DigitalOcean Spaces, Cloudinary

2. **Categorías**: Agrupar servicios por categoría
   - Tabla adicional: `categorias`
   - Relación: servicio belongsTo categoría

3. **Panel Admin Frontend**: Crear UI CRUD para gestionar servicios
   - Ruta: /configuracion/servicios
   - Componentes: tabla, formulario, modal de confirmación

4. **Analytics**: Tracking de servicios más vistos/populares
   - Campo adicional: `visualizaciones` INT

---

**Archivo creado**: 29 de enero de 2026  
**Autor**: Sistema EventConnect  
**Versión**: 1.0
