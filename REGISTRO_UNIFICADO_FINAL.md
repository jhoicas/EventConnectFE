# Página de Registro Unificada - Arquitectura Final

## 📋 Resumen Ejecutivo

La página de registro ha sido completamente refactorizada con un diseño **Split-Screen moderno** que soporta dos flujos de usuario distintos:
- **Registro Cliente**: Usuarios individuales (Natural)
- **Registro Empresa**: Proveedores y empresas

---

## 🎨 Diseño Visual (Split-Screen)

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────────────┐
│  IZQUIERDA (50%)       │       DERECHA (50%)                │
│  Panel Decorativo      │   Formulario de Registro           │
│  ───────────────────   │   ───────────────────────────────  │
│                        │                                      │
│  • Gradiente azul      │   📱 Crear Cuenta                  │
│    a indigo            │   Únete a EventConnect hoy         │
│  • Logo EventConnect   │                                      │
│  • Mensaje bienvenida  │   ┌────────────────────────────┐   │
│  • Efectos visuales    │   │ Soy Cliente │ Soy Empresa │   │
│    (blurred circles)   │   └────────────────────────────┘   │
│                        │                                      │
│                        │   [Formulario dinámico]             │
│                        │   • Campos específicos por tab      │
│                        │   • Validación en tiempo real       │
│                        │   • Mensajes de error               │
│                        │                                      │
│                        │   [Botón Crear Cuenta]              │
│                        │                                      │
│                        │   ¿Ya tienes cuenta?                │
│                        │   Inicia sesión                     │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (<1024px)
```
┌───────────────────────────┐
│   Formulario de Registro  │
│   (Full Width)            │
│                           │
│  📱 Crear Cuenta          │
│  Únete a EventConnect     │
│                           │
│  ┌────────────────────┐   │
│  │Soy Cliente│Empresa │   │
│  └────────────────────┘   │
│                           │
│  [Formulario]             │
│                           │
│  [Botón]                  │
│                           │
│  ¿Ya tienes cuenta?       │
│  Inicia sesión            │
└───────────────────────────┘
```

---

## 📡 API Endpoints y Payloads

### Opción A: Registro Empresa

**Endpoint**: `POST /api/Auth/register`

**Request Payload**:
```typescript
{
  usuario: string;              // Username (requerido)
  email: string;                // Email (requerido)
  password: string;             // Password (requerido)
  nombre_Completo: string;      // Full name (requerido)
  telefono?: string | null;     // Phone (opcional)
  empresa_Id: 0;                // Always 0 for new companies
  rol_Id: 0;                    // Default role ID
}
```

**Ejemplo**:
```json
{
  "usuario": "admin.empresa",
  "email": "admin@empresa.com",
  "password": "Securepass123",
  "nombre_Completo": "Juan García",
  "telefono": "+573001234567",
  "empresa_Id": 0,
  "rol_Id": 0
}
```

### Opción B: Registro Cliente

**Endpoint**: `POST /api/Auth/register-cliente`

**Request Payload**:
```typescript
{
  email: string;                // Email (requerido)
  password: string;             // Password (requerido)
  nombre_Completo: string;      // Full name (requerido)
  telefono?: string | null;     // Phone (opcional)
  documento?: string | null;    // ID document (opcional)
  tipo_Documento?: string | null; // Doc type: CC|TI|PA|CE (opcional)
  direccion?: string | null;    // Address (opcional)
  ciudad?: string | null;       // City (opcional)
  empresa_Id: 0;                // Always 0 for independent clients
  tipo_Cliente?: 'Natural';     // Client type (opcional, default: 'Natural')
}
```

**Ejemplo**:
```json
{
  "email": "cliente@example.com",
  "password": "Securepass123",
  "nombre_Completo": "María López",
  "telefono": "+573009876543",
  "documento": "1234567890",
  "tipo_Documento": "CC",
  "direccion": "Calle 123 #45-67",
  "ciudad": "Bogotá",
  "empresa_Id": 0,
  "tipo_Cliente": "Natural"
}
```

---

## 🔧 Interfaz TypeScript

### RegisterRequest (Empresa)
```typescript
export interface RegisterRequest {
  usuario: string;
  email: string;
  password: string;
  nombre_Completo: string;
  telefono?: string | null;
  empresa_Id: number;  // 0 for new companies
  rol_Id: number;      // 0 for default role
}
```

### RegisterClienteRequest (Cliente)
```typescript
export interface RegisterClienteRequest {
  email: string;
  password: string;
  nombre_Completo: string;
  telefono?: string | null;
  documento?: string | null;
  tipo_Documento?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  empresa_Id: number;      // 0 for independent clients
  tipo_Cliente?: string;   // 'Natural' for individual
}
```

---

## 📝 Flujos de Registro

### Flujo Cliente

```
1. Usuario accede a /registro
   ↓
2. Por defecto aparece tab "Soy Cliente"
   ↓
3. Usuario completa 9 campos:
   • Nombre Completo *
   • Email *
   • Teléfono
   • Tipo Documento *
   • Número Documento *
   • Dirección *
   • Ciudad *
   • Contraseña *
   • Confirmar Contraseña *
   ↓
4. Submit → Validación frontend
   ├─ ❌ Inválido → Mostrar errores
   └─ ✅ Válido → Paso 5
   ↓
5. POST /api/Auth/register-cliente
   {
     email, password, nombre_Completo,
     telefono, documento, tipo_Documento,
     direccion, ciudad,
     empresa_Id: 0,
     tipo_Cliente: 'Natural'
   }
   ↓
6. Respuesta API
   ├─ ❌ Error → Mostrar en alerta
   └─ ✅ Success → navigate('/login?registered=true')
```

### Flujo Empresa

```
1. Usuario accede a /registro
   ↓
2. Usuario hace clic en tab "Soy Empresa"
   ↓
3. Contenido cambia a formulario Empresa
   ↓
4. Usuario completa 6 campos:
   • Usuario (username) *
   • Nombre Completo *
   • Email *
   • Teléfono
   • Contraseña *
   • Confirmar Contraseña *
   ↓
5. Submit → Validación frontend
   ├─ ❌ Inválido → Mostrar errores
   └─ ✅ Válido → Paso 6
   ↓
6. POST /api/Auth/register
   {
     usuario, email, password,
     nombre_Completo, telefono,
     empresa_Id: 0,
     rol_Id: 0
   }
   ↓
7. Respuesta API
   ├─ ❌ Error → Mostrar en alerta
   └─ ✅ Success → navigate('/login?registered=true')
```

---

## 🎯 Validaciones

### Campos Comunes

| Campo | Validación | Mensaje |
|-------|-----------|---------|
| Email | `/.+@.+\..+/` | "Email inválido" |
| Password | min 6 chars | "Mínimo 6 caracteres" |
| Confirm Pass | === Password | "Las contraseñas no coinciden" |

### Tab Cliente (específicas)

| Campo | Validación | Mensaje |
|-------|-----------|---------|
| Nombre | Non-empty | "El nombre es requerido" |
| Documento | Non-empty | "El documento es requerido" |
| Tipo Doc | Selected | "Selecciona un tipo de documento" |
| Dirección | Non-empty | "La dirección es requerida" |
| Ciudad | Non-empty | "La ciudad es requerida" |

### Tab Empresa (específicas)

| Campo | Validación | Mensaje |
|-------|-----------|---------|
| Usuario | Non-empty | "El usuario es requerido" |
| Nombre | Non-empty | "El nombre es requerido" |

---

## 📂 Estructura de Archivos

```
src/
├── pages/
│   └── Register.tsx                    ← Página principal (603 líneas)
│       ├── Split-screen layout
│       ├── Tabs component
│       ├── Formularios dinámicos
│       └── Validación y API calls
│
├── features/auth/
│   └── services/
│       └── authService.ts             ← Métodos de autenticación
│           ├── login()
│           ├── register()
│           ├── registerCliente()
│           ├── logout()
│           └── getCurrentUser()
│
└── types/
    └── index.ts                       ← Interfaces TypeScript
        ├── User
        ├── LoginRequest
        ├── LoginResponse
        ├── RegisterRequest
        └── RegisterClienteRequest
```

---

## 🎨 Componentes Shadcn UI Utilizados

| Componente | Archivo | Uso |
|-----------|---------|-----|
| `Tabs` | `ui/tabs.tsx` | Selector Cliente/Empresa |
| `Input` | `ui/input.tsx` | Campos de texto |
| `Button` | `ui/button.tsx` | Botón de envío |
| `Label` | `ui/label.tsx` | Etiquetas de campos |
| `Select` | `ui/select.tsx` | Dropdown tipo documento |

---

## 🎯 Responsividad

### Breakpoints Tailwind

| Dispositivo | Ancho | Comportamiento |
|-----------|-------|-----------------|
| Mobile | <1024px | Formulario full-width, panel izquierdo hidden |
| Tablet | 768-1023px | Formulario full-width |
| Desktop | ≥1024px | Split-screen 50/50 |

### Clases Clave

```tailwind
lg:w-1/2           # Panel izquierdo (desktop)
hidden lg:flex     # Mostrar solo en desktop
p-6 sm:p-8 lg:p-12 # Padding responsivo
max-w-md           # Ancho máximo del formulario
```

---

## 🔐 Seguridad

- ✅ Validación frontend (email, password)
- ✅ Trimming de espacios en blanco
- ✅ Null-coalescing para campos opcionales
- ✅ Error handling con mensajes genéricos
- ✅ CSRF protection (via axios + API)

---

## 🌐 Estados de Carga

### Mientras se procesa (isLoading = true)
- Botón deshabilitado
- Spinner animado junto al texto
- Texto cambia a "Creando cuenta..."
- Opacidad reducida del botón

### Errores API
- Mensaje mostrado en caja roja al top del formulario
- Usuario puede reintentar
- Errores de campo se limpian en input

---

## 🧪 Checklist de Pruebas

### Funcionalidad

- [ ] Tab "Soy Cliente" muestra 9 campos correctos
- [ ] Tab "Soy Empresa" muestra 6 campos correctos
- [ ] Cambiar entre tabs mantiene estado de datos
- [ ] Validación bloquea envío sin campos requeridos
- [ ] Errores se limpian al escribir
- [ ] POST a `/api/Auth/register-cliente` para Cliente
- [ ] POST a `/api/Auth/register` para Empresa
- [ ] Redirección a `/login?registered=true` en success
- [ ] Mensajes de error API se muestran correctamente

### Responsive

- [ ] Desktop: Split-screen 50/50
- [ ] Tablet: Full-width formulario
- [ ] Mobile: Full-width, panel izquierdo hidden
- [ ] Tabs accesibles en todos los tamaños
- [ ] Botones touch-friendly en mobile

### UI/UX

- [ ] Gradiente azul-indigo en panel izquierdo
- [ ] Logo y mensaje en panel izquierdo
- [ ] Efectos visuales (blurred circles)
- [ ] Espaciado blanco adecuado
- [ ] Focus states en inputs
- [ ] Transiciones suaves

---

## 📞 Endpoints Utilizados

| Método | Ruta | Propósito |
|--------|------|----------|
| POST | `/api/Auth/register` | Registro Empresa |
| POST | `/api/Auth/register-cliente` | Registro Cliente |
| POST | `/api/Auth/login` | Login |
| GET | `/api/Auth/me` | Current user |

---

## 🔗 Navegación

- **Pre-login**: `/registro` (página de registro)
- **Post-success**: `/login?registered=true` (página de login con query param)
- **Login link**: Click "Inicia sesión" → `/login`

---

## 💾 Estado Persistente

- Formularios **NO persisten** al cambiar tabs (limpieza implícita)
- Errores se limpian por campo al escribir
- Estados globales (isLoading, apiError) se resetean en nuevo submit

---

## 🚀 Performance

- Split-screen usando CSS Grid (minimal JavaScript)
- Tabs implementado con native HTML + React state
- Validación síncrona (no afecta UX)
- Debouncing no necesario (validación al submit)

---

## 📚 Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS 4
- **Componentes**: Shadcn UI
- **Routing**: React Router 7
- **HTTP**: Axios
- **Icons**: Lucide React

---

## ✅ Estado: Production Ready

Todos los componentes están:
- ✅ Compilación sin errores
- ✅ Tipos TypeScript completos
- ✅ Validación implementada
- ✅ API integration lista
- ✅ Diseño responsive
- ✅ Documentado

**Listo para testing contra API en vivo.**

---

**Última actualización**: Febrero 3, 2026
**Versión**: 2.0
**Status**: ✅ Implementado
