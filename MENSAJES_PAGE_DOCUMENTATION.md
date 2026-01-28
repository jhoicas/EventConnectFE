# Página de Mensajes - Documentación Completa

**Status:** ✅ Implementado y compilando exitosamente  
**Fecha:** Enero 28, 2026

## 📋 Resumen

Se ha implementado una página de mensajes completa (`src/pages/cliente/Mensajes.tsx`) con un sistema de chat responsivo integrado con la Chat API usando RTK Query.

---

## 📁 Estructura de Archivos

```
src/pages/cliente/
├── Mensajes.tsx                    # Página principal
└── components/
    ├── ChatWindow.tsx              # Componente para ver/enviar mensajes
    ├── ConversacionesList.tsx       # Lista de conversaciones
    ├── NuevaConversacionDialog.tsx  # Dialog para crear conversación
    └── index.ts                     # Exportaciones
```

---

## 🎨 Layout Responsivo

### Desktop (lg+)
```
┌─────────────────────────────────────┐
│ Header: Mensajes + Nuevo Chat       │
├──────────────────┬──────────────────┤
│ Conversaciones   │  Chat Window     │
│ (80px)           │  (flex-1)        │
│ - List           │  - Messages      │
│ - Avatars        │  - Input         │
├──────────────────┴──────────────────┤
```

### Mobile (< lg)
```
Inicial:
┌──────────────────┐
│ Conversaciones   │
│ (fullscreen)     │
└──────────────────┘

Al seleccionar chat:
┌──────────────────┐
│ [Back] Chat Name │
├──────────────────┤
│ Chat Window      │
│ (fullscreen)     │
└──────────────────┘
```

---

## 🎯 Componentes

### 1. Mensajes.tsx (Página Principal)

**Responsabilidades:**
- Gestionar estado de conversación seleccionada
- Toggle de visibilidad de lista en mobile
- Renderizar estados vacíos según rol
- Layout responsive con Tailwind

**Roles:**
- **Cliente:** "Aún no tienes conversaciones" + Botones [Nueva] [Explorar]
- **Empresa:** "Aún no has recibido mensajes" (sin acciones)

**Props:**
- Ninguna (Componente raíz)

---

### 2. ChatWindow.tsx

**Responsabilidades:**
- Mostrar conversación seleccionada
- Listar mensajes del usuario y contraparte
- Permitir enviar mensajes
- Auto-scroll a mensajes nuevos
- Validar permisos

**Features:**
- ✅ Mensajes del usuario: Azul, alineado a derecha
- ✅ Mensajes del otro: Gris, alineado a izquierda
- ✅ Timestamps en formato HH:mm
- ✅ Send button con ícono Lucide
- ✅ Enter para enviar (Shift+Enter para nueva línea)
- ✅ Loading spinner mientras envía
- ✅ Auto-scroll a último mensaje
- ✅ Estados de error con AlertCircle

**Props:**
```typescript
interface ChatWindowProps {
  conversacionId: number | undefined | null;
  nombreContraparte?: string;
  avatarURL?: string;
}
```

**Hooks usados:**
```typescript
const { mensajes, isLoading, isError } = useMensajesDeConversacion(conversacionId);
const { enviar, isLoading: enviando, error, canSendMessage } = useEnviarMensajeSeguro();
const { user } = useUsuarioActual();
```

---

### 3. ConversacionesList.tsx

**Responsabilidades:**
- Listar todas las conversaciones del usuario
- Mostrar avatar y nombre de contraparte
- Mostrar último mensaje y fecha
- Badge rojo con cantidad de mensajes sin leer
- Seleccionar conversación

**Features:**
- ✅ Avatar redondo (w-10 h-10 md:w-12 md:h-12)
- ✅ Indicador visual de seleccionado (border-left azul)
- ✅ Badge rojo con contador (no_Leidos)
- ✅ Hover effect
- ✅ Scroll vertical si hay muchas conversaciones
- ✅ Loading state con spinner
- ✅ Error state con botón Reintentar
- ✅ Empty state si no hay conversaciones

**Props:**
```typescript
interface ConversacionesListProps {
  conversacionSeleccionada?: number;
  onSelect: (id: number) => void;
}
```

**Hooks usados:**
```typescript
const { conversaciones, isLoading, isError, refetch } = useConversacionesDelUsuario();
```

---

### 4. NuevaConversacionDialog.tsx

**Responsabilidades:**
- Dialog para crear nueva conversación
- Solo renderiza si `user.rol === 'Cliente'`
- Solicitar ID y nombre del proveedor
- Validar campos requeridos

**Features:**
- ✅ Dialog modal con descripción
- ✅ Dos campos: nombre (text) + ID (number)
- ✅ Validación de campos requeridos
- ✅ Botones: Cancelar, Crear
- ✅ Error display
- ✅ Loading state en botón Crear
- ✅ Callback onSuccess

**Props:**
```typescript
interface NuevaConversacionDialogProps {
  onSuccess?: () => void;
}
```

**Hooks usados:**
```typescript
const { crear, canCreateConversacion, isLoading, error } = useCrearConversacionSegura();
```

---

## 🎪 Estados de la UI

### Loading States
```tsx
// Mensajes
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />

// Conversaciones
<Loader2 className="animate-spin" />

// Botón Enviar
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
```

### Empty States
```tsx
// Sin conversaciones (Cliente)
<MessageSquare className="w-16 h-16" />
+ "Aún no tienes conversaciones con proveedores"
+ Botones [Nueva Conversación] [Explorar Servicios]

// Sin conversaciones (Empresa)
<MessageSquare className="w-16 h-16" />
+ "Aún no has recibido mensajes de clientes"

// Sin mensajes en chat
"No hay mensajes aún"
"Inicia la conversación escribiendo tu primer mensaje"
```

### Error States
```tsx
// Error enviando
<p className="text-xs text-destructive">Error al enviar el mensaje</p>

// No autenticado
<AlertCircle className="w-4 h-4" />
"Debes iniciar sesión para enviar mensajes"

// Sin permiso
<AlertCircle className="w-4 h-4" />
"No tienes permiso para acceder a esta conversación"
```

---

## 🎨 Estilos Tailwind

### Esquema de Colores

**Mensajes:**
- Usuario: `bg-blue-500 text-white rounded-br-none`
- Otro: `bg-gray-100 dark:bg-slate-800 rounded-bl-none`
- Timestamps: `text-xs text-blue-100` / `text-gray-500`

**UI Elements:**
- Primary: `bg-blue-500 hover:bg-blue-600`
- Background: `bg-white dark:bg-slate-950`
- Secondary: `bg-gray-50 dark:bg-slate-900`
- Borders: `border-gray-200 dark:border-slate-800`

**Icons:**
- Lucide: `w-4 h-4` (small), `w-6 h-6` (medium), `w-12 h-12` (large)

---

## 🔄 Flujo de Datos

```
Mensajes.tsx (STATE)
├── conversacionSeleccionada: number | undefined
├── isMobileListVisible: boolean
│
├─> ConversacionesList
│   └─> useConversacionesDelUsuario()
│       └─> onSelect(id) → setConversacionSeleccionada(id)
│
├─> NuevaConversacionDialog
│   └─> useCrearConversacionSegura()
│       └─> onSuccess() → refetch conversaciones
│
└─> ChatWindow
    ├─> useMensajesDeConversacion(conversacionSeleccionada)
    │   └─> Auto-polling cada 3 segundos
    ├─> useEnviarMensajeSeguro()
    │   └─> Optimistic updates
    └─> useUsuarioActual()
        └─> user?.id para comparar remitente
```

---

## 📱 Responsive Design

### Breakpoints
```
Mobile (< 768px):
- Lista: fullscreen
- Chat: fullscreen con botón Back
- Toggle con isMobileListVisible

Tablet/Desktop (>= 768px):
- Lista: w-80 (320px)
- Chat: flex-1
- Lado a lado siempre visible
```

### Classes Responsive
```tsx
// Ocultar en mobile, mostrar en md+
className="hidden md:block"

// Ancho responsive
className="w-10 h-10 md:w-12 md:h-12"

// Padding responsivo
className="px-4 py-3 md:px-6 md:py-4"

// Mostrar en mobile si no hay lista
className={`flex-1 transition-all ${!isMobileListVisible ? 'block' : 'hidden md:block'}`}
```

---

## 🔒 Seguridad Implementada

### Validación de Rol
```typescript
// NuevaConversacionDialog solo renderiza si:
if (!canCreateConversacion) return null;

// Viene de useCrearConversacionSegura()
const canCreateConversacion = useMemo(() => {
  return user?.rol === 'Cliente';
}, [user?.rol]);
```

### Validación de Autenticación
```typescript
// ChatWindow:
const { canSendMessage } = useEnviarMensajeSeguro();

// Viene de useEnviarMensajeSeguro()
const canSendMessage = useMemo(() => {
  return !!user?.id;
}, [user?.id]);
```

### Protección de Permisos
```typescript
// ChatWindow valida:
- Usuario autenticado (canSendMessage)
- Input deshabilitado si no tiene permiso
- Botón Send deshabilitado
- Mensaje de advertencia visible
```

---

## 🎯 Casos de Uso

### Caso 1: Cliente Sin Conversaciones
1. Abre `/cliente/mensajes`
2. Ve empty state: "Aún no tienes conversaciones"
3. Puede:
   - Clic [Nueva Conversación] → Dialog
   - Clic [Explorar Servicios] → `/cliente/explorar`

### Caso 2: Ver Conversación
1. Clic en conversación en la lista
2. En mobile: list desaparece, chat fullscreen
3. En desktop: chat aparece al lado
4. Mensajes con auto-scroll
5. Enviar con Enter

### Caso 3: Crear Nueva Conversación (Cliente)
1. Clic [Nueva Conversación]
2. Dialog aparece
3. Ingresa nombre y ID del proveedor
4. Clic [Crear]
5. Dialog cierra, conversación aparece en lista

### Caso 4: Recibir Mensaje (Empresa)
1. Cliente envía mensaje
2. Conversación aparece en lista (auto-polling 3s)
3. Badge rojo con contador sin leer
4. Click para abrir chat

---

## 🚀 Performance

**Build Metrics:**
- Modules: 2755
- Size JS: 816.85 KB (235.12 KB gzip)
- Build time: 1.52s
- Bundle warning: Chunk > 500 KB (normal para app de este tamaño)

**Optimizaciones:**
- ✅ Auto-scroll con useRef y useEffect
- ✅ Debouncing en input (enter key)
- ✅ Polling automático (3s)
- ✅ Lazy component loading posible
- ✅ Memoización de funciones con useCallback

---

## 📚 Importaciones

```typescript
// Hooks Chat API
import {
  useConversacionesDelUsuario,
  useMensajesDeConversacion,
  useEnviarMensajeSeguro,
  useCrearConversacionSegura,
  useUsuarioActual,
} from '@/store/api/chatHooks';

// React Router
import { useNavigate } from 'react-router-dom';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Lucide Icons
import { MessageSquare, Send, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

// Utilities
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
```

---

## 🧪 Testing (Próximo)

Recomendaciones para tests:
```typescript
// Unit Tests
- ChatWindow: send message, display messages, timestamps
- ConversacionesList: select, unread badge, avatar
- NuevaConversacionDialog: create conversation, validation

// Integration Tests
- Full flow: select chat → send message → update list
- Mobile responsive behavior
- Role-based UI rendering

// E2E Tests
- Complete message flow from CLI to EMPRESA
- Empty states display
- Navigation between chats
```

---

## 🐛 Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Mensajes no aparecen | API no retorna | Verificar `/chat/conversaciones/:id/mensajes` endpoint |
| Envío no funciona | Usuario no autenticado | Verificar localStorage.token |
| Lista no carga | Error de red | Revisar API_BASE_URL en .env |
| Mobile no toggle | isMobileListVisible bug | Revisar handleSelectConversacion en Mensajes.tsx |
| Permisos denegados | Usuario sin rol Cliente | Mostrar empty state adecuado |

---

## 📊 Métricas

- **Líneas de código:**
  - ChatWindow: 191
  - ConversacionesList: ~130
  - NuevaConversacionDialog: ~110
  - Mensajes: 142
  - Total: ~573 líneas

- **Componentes UI usados:** 6 (Button, Input, Dialog, Avatar, Badge)
- **Lucide Icons:** 6 (MessageSquare, Send, AlertCircle, ArrowLeft, Loader2)
- **Custom Hooks:** 5 (del chat API)

---

**Versión:** 1.0.0  
**Última actualización:** Enero 28, 2026  
**Git Commit:** f85011e
