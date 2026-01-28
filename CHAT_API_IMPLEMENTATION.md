# Chat API - Implementación RTK Query

**Fecha:** Enero 28, 2026  
**Status:** ✅ Completado y Build Exitoso

## 📋 Resumen de Implementación

Se ha implementado un servicio completo de Chat usando **Redux Toolkit** y **RTK Query** con validaciones de seguridad en el frontend y tipado strict con TypeScript.

---

## 📦 Archivos Creados/Modificados

### 1. **Types (`src/types/index.ts`)**
Nuevas interfaces añadidas:

```typescript
// Chat Types
- Conversacion         // Representa una conversación entre usuarios
- Mensaje             // Representa un mensaje dentro de una conversación
- CreateConversacionDto // DTO para crear conversaciones
- EnviarMensajeDto    // DTO para enviar mensajes
- MensajeResponse     // Respuesta de envío de mensaje
- ConversacionesListResponse // Respuesta de lista de conversaciones
```

**Campos importantes:**
- `nombre_Contraparte`: Nombre del otro usuario
- `avatar_URL`: Avatar URL del otro usuario
- `ultimo_Mensaje`: Último mensaje enviado
- `no_Leidos`: Cantidad de mensajes sin leer

### 2. **RTK Query API (`src/store/api/chatApi.ts`)**

API completa con endpoints:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `getConversaciones()` | GET | Listar conversaciones del usuario |
| `getConversacion(id)` | GET | Obtener conversación específica |
| `getMensajes(id)` | GET | Obtener historial de mensajes |
| `enviarMensaje(dto)` | POST | Enviar nuevo mensaje |
| `crearConversacion(dto)` | POST ⚠️ | Crear conversación (solo Cliente) |
| `marcarConversacionComoLeida(id)` | PATCH | Marcar como leído |
| `eliminarConversacion(id)` | DELETE | Eliminar conversación |

**Características:**
- ✅ Autenticación automática via Bearer token
- ✅ Optimistic updates en envío de mensajes
- ✅ Invalidación automática de cache
- ✅ Polling automático cada 3 segundos en mensajes
- ✅ Error handling integrado

### 3. **Hooks Personalizados (`src/store/api/chatHooks.ts`)**

Hooks con validación de seguridad:

```typescript
useCrearConversacionSegura()      // Solo Cliente
useEnviarMensajeSeguro()          // Con validaciones
useConversacionesDelUsuario()     // Conversaciones actuales
useMensajesDeConversacion(id)     // Mensajes con polling
useValidarRol([roles])            // Validar roles
useUsuarioActual()                // Usuario autenticado
```

**Validaciones implementadas:**

```typescript
// En useCrearConversacionSegura()
if (user?.rol !== 'Cliente') {
  throw new Error('Solo usuarios con rol Cliente pueden crear conversaciones');
}

// En useEnviarMensajeSeguro()
if (!user?.id) {
  throw new Error('Debe estar autenticado para enviar mensajes');
}
if (!contenido?.trim()) {
  throw new Error('El contenido del mensaje no puede estar vacío');
}
```

### 4. **Redux Store (`src/store/reduxStore.ts`)**

Configuración del Redux Store con RTK Query:

```typescript
const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});
```

### 5. **Exportaciones (`src/store/api/index.ts`)**

Central de exportaciones para fácil importación:

```typescript
// Hooks automáticos
export { useGetConversacionesQuery, useGetMensajesQuery, ... }

// Hooks personalizados
export { useCrearConversacionSegura, useEnviarMensajeSeguro, ... }

// API
export { chatApi }
```

### 6. **Documentación (`src/store/api/README_CHAT_API.md`)**

Documentación exhaustiva con:
- Estructuras de datos
- Definición de endpoints
- Ejemplos de uso completos
- Guía de seguridad
- Troubleshooting
- Reference rápida

---

## 🔐 Seguridad Implementada

### 1. **Validación de Rol en Frontend**

```typescript
// chatHooks.ts
const canCreateConversacion = useMemo(() => {
  return user?.rol === 'Cliente';
}, [user?.rol]);

const crear = useCallback(async (data) => {
  if (!canCreateConversacion) {
    throw new Error('Solo clientes pueden crear conversaciones');
  }
  return crearConversacion(data);
}, [crearConversacion, canCreateConversacion]);
```

### 2. **Autenticación Automática**

```typescript
// chatApi.ts
prepareHeaders: (headers) => {
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}
```

### 3. **Skip Queries si No Autenticado**

```typescript
useGetConversacionesQuery(undefined, {
  skip: !user?.id,  // No ejecutar si no hay usuario
});
```

### 4. **Validaciones en Mutations**

```typescript
// En useEnviarMensajeSeguro()
- Verificar autenticación
- Validar contenido no vacío
- Manejo de errores

// En useCrearConversacionSegura()
- Validar rol == 'Cliente'
- Validar datos requeridos
```

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Listar Conversaciones

```typescript
import { useConversacionesDelUsuario } from '@/store/api/chatHooks';

function MisConversaciones() {
  const { conversaciones, isLoading, isError } = useConversacionesDelUsuario();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      {conversaciones.map((conv) => (
        <div key={conv.id}>
          <img src={conv.avatar_URL} alt={conv.nombre_Contraparte} />
          <h3>{conv.nombre_Contraparte}</h3>
          <p>{conv.ultimo_Mensaje}</p>
          {conv.no_Leidos > 0 && <span>{conv.no_Leidos}</span>}
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo 2: Enviar Mensaje

```typescript
import { useMensajesDeConversacion, useEnviarMensajeSeguro } from '@/store/api/chatHooks';

function ChatWindow({ conversacionId }: { conversacionId: number }) {
  const { mensajes } = useMensajesDeConversacion(conversacionId);
  const { enviar, isLoading, error } = useEnviarMensajeSeguro();
  const [contenido, setContenido] = useState('');

  const handleEnviar = async () => {
    try {
      await enviar({
        conversacion_Id: conversacionId,
        contenido,
      });
      setContenido('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {mensajes.map((msg) => (
        <div key={msg.id}>{msg.contenido}</div>
      ))}
      <input
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />
      <button onClick={handleEnviar} disabled={isLoading}>
        Enviar
      </button>
    </div>
  );
}
```

### Ejemplo 3: Crear Conversación (Solo Cliente)

```typescript
import { useCrearConversacionSegura } from '@/store/api/chatHooks';

function NuevaConversacion() {
  const { crear, canCreateConversacion, isLoading, error } =
    useCrearConversacionSegura();

  if (!canCreateConversacion) {
    return <div>⚠️ Solo clientes pueden crear conversaciones</div>;
  }

  const handleCrear = async () => {
    try {
      await crear({
        usuario_Receptor_Id: 5,
        nombre_Contraparte: 'Juan Pérez',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return <button onClick={handleCrear} disabled={isLoading}>Crear</button>;
}
```

---

## 🚀 Integración en App

### Paso 1: Instalar Dependencias

```bash
pnpm add -D @reduxjs/toolkit react-redux
```

### Paso 2: Integrar Provider en main.tsx

```typescript
import { Provider } from 'react-redux';
import store from '@/store/reduxStore';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### Paso 3: Usar en Componentes

```typescript
import { useConversacionesDelUsuario } from '@/store/api/chatHooks';

function App() {
  const { conversaciones } = useConversacionesDelUsuario();
  // ... usar conversaciones
}
```

---

## ✅ Build Status

```
✓ 2739 modules transformed
✓ Build time: 2.66s
✓ Output: 732.54 kB JS (208.36 kB gzip)
✓ No TypeScript errors
✓ All imports resolved
```

---

## 📝 Notas Técnicas

### RTK Query Features Utilizadas

- **createApi()** - Base para la API
- **fetchBaseQuery()** - HTTP cliente con interceptores
- **Caching automático** - Por conversación y mensaje
- **Tag-based invalidation** - Refrescar datos automáticamente
- **Optimistic updates** - Update UI antes de respuesta
- **Polling** - Auto-refresh cada 3 segundos
- **Error handling** - Gestión automática de errores

### Validaciones de Rol

Solo en Frontend (para UX):
- ✅ `useCrearConversacionSegura()` valida `rol === 'Cliente'`
- ✅ UI se deshabilita si no tiene permisos
- ⚠️ El backend DEBE validar también

### Variables de Entorno

```env
VITE_API_BASE_URL=https://eventconnect-api-8oih6.ondigitalocean.app/api
```

---

## 🔧 Próximos Pasos

1. **Integrar Provider de Redux** en `main.tsx`
2. **Crear componentes UI** usando los hooks
3. **Validaciones backend** para crear conversaciones
4. **WebSocket** para mensajes en tiempo real (opcional)
5. **Tests unitarios** para hooks

---

## 📚 Archivos de Referencia

- [README_CHAT_API.md](src/store/api/README_CHAT_API.md) - Documentación detallada
- [chatApi.ts](src/store/api/chatApi.ts) - Definición API
- [chatHooks.ts](src/store/api/chatHooks.ts) - Hooks personalizados
- [reduxStore.ts](src/store/reduxStore.ts) - Configuración Store
- [types/index.ts](src/types/index.ts) - Tipos TypeScript

---

**Implementación Completada ✅**
