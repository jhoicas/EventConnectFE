# Chat API - Redux Toolkit + RTK Query

Documentación completa del servicio de Chat para EventConnect.

## 📋 Tabla de Contenidos

1. [Estructura](#estructura)
2. [Tipos de Datos](#tipos-de-datos)
3. [API Endpoints](#api-endpoints)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Seguridad](#seguridad)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Configuración](#configuración)

---

## Estructura

```
src/store/api/
├── chatApi.ts          # Definición de endpoints con RTK Query
├── chatHooks.ts        # Hooks personalizados con validación
└── CHAT_EXAMPLES.ts    # Ejemplos de implementación

src/store/
├── reduxStore.ts       # Configuración del Redux Store
├── authStore.ts        # Zustand store para autenticación
└── uiStore.ts          # Zustand store para UI

src/types/
└── index.ts            # Tipos TypeScript (incluye tipos de Chat)
```

---

## Tipos de Datos

### `Conversacion`

Representa una conversación entre dos usuarios.

```typescript
interface Conversacion {
  id: number;
  usuario_Iniciador_Id: number;
  usuario_Receptor_Id: number;
  nombre_Contraparte: string;        // Nombre del otro usuario
  avatar_URL?: string;                // URL de avatar del otro usuario
  ultimo_Mensaje?: string;            // Último mensaje enviado
  fecha_Ultimo_Mensaje?: string;      // Timestamp del último mensaje
  no_Leidos: number;                  // Cantidad de mensajes sin leer
  activo: boolean;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}
```

### `Mensaje`

Representa un mensaje dentro de una conversación.

```typescript
interface Mensaje {
  id: number;
  conversacion_Id: number;
  remitente_Id: number;
  contenido: string;
  tipo_Contenido: 'texto' | 'imagen' | 'archivo';
  archivo_URL?: string;
  leido: boolean;
  fecha_Lectura?: string;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}
```

### `CreateConversacionDto`

DTO para crear una nueva conversación.

```typescript
interface CreateConversacionDto {
  usuario_Receptor_Id: number;
  nombre_Contraparte: string;
  avatar_URL?: string;
}
```

### `EnviarMensajeDto`

DTO para enviar un mensaje.

```typescript
interface EnviarMensajeDto {
  conversacion_Id: number;
  contenido: string;
  tipo_Contenido?: 'texto' | 'imagen' | 'archivo';
  archivo_URL?: string;
}
```

---

## API Endpoints

### 1. `getConversaciones()`

**Método:** GET  
**URL:** `/chat/conversaciones`  
**Descripción:** Obtiene lista de todas las conversaciones del usuario autenticado.

```typescript
const { data, isLoading, error } = useGetConversacionesQuery();
// data: { conversaciones: Conversacion[], total: number }
```

---

### 2. `getConversacion(conversacionId)`

**Método:** GET  
**URL:** `/chat/conversaciones/:id`  
**Descripción:** Obtiene una conversación específica.

```typescript
const { data, isLoading } = useGetConversacionQuery(conversacionId);
// data: Conversacion
```

---

### 3. `getMensajes(conversacionId)`

**Método:** GET  
**URL:** `/chat/conversaciones/:id/mensajes`  
**Descripción:** Obtiene el historial de mensajes de una conversación.

```typescript
const { data: mensajes, isLoading } = useGetMensajesQuery(conversacionId);
// data: Mensaje[]
```

**Características:**
- Poll automático cada 3 segundos
- Caching por conversación

---

### 4. `enviarMensaje(data)`

**Método:** POST  
**URL:** `/chat/conversaciones/:id/mensajes`  
**Descripción:** Envía un nuevo mensaje en una conversación.

```typescript
const [enviarMensaje, { isLoading, error }] = useEnviarMensajeMutation();

await enviarMensaje({
  conversacion_Id: 1,
  contenido: 'Hola!',
  tipo_Contenido: 'texto'
});
```

**Características:**
- Optimistic updates
- Validación de contenido no vacío
- Invalidación automática de cache

---

### 5. `crearConversacion(data)` ⚠️ RESTRINGIDA

**Método:** POST  
**URL:** `/chat/conversaciones`  
**Descripción:** Crea una nueva conversación.

```typescript
const [crear, { isLoading, error }] = useCrearConversacionMutation();

await crear({
  usuario_Receptor_Id: 5,
  nombre_Contraparte: 'Juan Pérez',
  avatar_URL: 'https://...'
});
```

**Restricción:** ⚠️ **Solo usuarios con rol `Cliente`**

---

### 6. `marcarConversacionComoLeida(conversacionId)`

**Método:** PATCH  
**URL:** `/chat/conversaciones/:id/marcar-leido`  
**Descripción:** Marca todos los mensajes como leídos.

```typescript
const [marcar] = useMarcarConversacionComoLeidaMutation();
await marcar(conversacionId);
```

---

### 7. `eliminarConversacion(conversacionId)`

**Método:** DELETE  
**URL:** `/chat/conversaciones/:id`  
**Descripción:** Elimina una conversación.

```typescript
const [eliminar] = useEliminarConversacionMutation();
await eliminar(conversacionId);
```

---

## Hooks Personalizados

### `useCrearConversacionSegura()`

Hook para crear conversaciones con validación de rol.

```typescript
const { crear, canCreateConversacion, isLoading, error } =
  useCrearConversacionSegura();

// Validar antes de mostrar UI
if (!canCreateConversacion) {
  return <div>Solo Clientes pueden crear conversaciones</div>;
}

// Disparar con validación automática
try {
  await crear({
    usuario_Receptor_Id: 5,
    nombre_Contraparte: 'Juan'
  });
} catch (err) {
  console.error('Error:', err.message);
  // "Solo usuarios con rol Cliente pueden crear conversaciones"
}
```

---

### `useEnviarMensajeSeguro()`

Hook para enviar mensajes con validación.

```typescript
const { enviar, canSendMessage, isLoading, error } = useEnviarMensajeSeguro();

// Validar autenticación
if (!canSendMessage) {
  return <div>Inicia sesión para enviar mensajes</div>;
}

// Disparar con validaciones
try {
  await enviar({
    conversacion_Id: 1,
    contenido: 'Mi mensaje'
  });
} catch (err) {
  // Error si: contenido vacío, no autenticado, etc
}
```

---

### `useConversacionesDelUsuario()`

Hook para obtener conversaciones con info del usuario.

```typescript
const { conversaciones, total, isLoading, isError, refetch } =
  useConversacionesDelUsuario();

return (
  <div>
    <h2>Conversaciones ({total})</h2>
    {conversaciones.map(conv => (
      <div key={conv.id}>
        <img src={conv.avatar_URL} alt={conv.nombre_Contraparte} />
        <h3>{conv.nombre_Contraparte}</h3>
        <p>{conv.ultimo_Mensaje}</p>
      </div>
    ))}
  </div>
);
```

---

### `useMensajesDeConversacion(conversacionId)`

Hook para obtener mensajes con polling automático.

```typescript
const { mensajes, isLoading, isError, refetch } =
  useMensajesDeConversacion(conversacionId);

// Auto-actualiza cada 3 segundos
// Retorna vacío si conversacionId es null
```

---

### `useValidarRol(rolesPermitidos)`

Hook utilitario para validar roles.

```typescript
const puedeVerReportes = useValidarRol(['Admin-Proveedor', 'SuperAdmin']);

if (!puedeVerReportes) {
  return <div>No tienes permisos</div>;
}
```

---

### `useUsuarioActual()`

Hook para obtener datos del usuario autenticado.

```typescript
const { user, isAuthenticated, token } = useUsuarioActual();

console.log(user?.nombre_Completo, user?.rol);
```

---

## Seguridad

### 1. Validación de Rol en Frontend

```typescript
// chatHooks.ts - useCrearConversacionSegura()
const canCreateConversacion = useMemo(() => {
  return user?.rol === 'Cliente';
}, [user?.rol]);

const crear = useCallback(
  async (data: CreateConversacionDto) => {
    if (!canCreateConversacion) {
      throw new Error(
        'Solo usuarios con rol Cliente pueden crear conversaciones'
      );
    }
    return crearConversacion(data);
  },
  [crearConversacion, canCreateConversacion]
);
```

### 2. Autenticación via Token

```typescript
// chatApi.ts - baseQuery
prepareHeaders: (headers) => {
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}
```

### 3. Skip Queries si No Autenticado

```typescript
// useConversacionesDelUsuario()
const { data, isLoading } = useGetConversacionesQuery(undefined, {
  skip: !user?.id,  // No ejecutar si no hay usuario
});
```

---

## Ejemplos de Uso

### Ejemplo 1: Listar Conversaciones

```typescript
import { useConversacionesDelUsuario } from '@/store/api/chatHooks';

function MisConversaciones() {
  const { conversaciones, isLoading, isError } = useConversacionesDelUsuario();

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar conversaciones</div>;

  return (
    <div>
      <h2>Mis Conversaciones ({conversaciones.length})</h2>
      <ul>
        {conversaciones.map((conv) => (
          <li key={conv.id}>
            <img src={conv.avatar_URL} alt={conv.nombre_Contraparte} />
            <h3>{conv.nombre_Contraparte}</h3>
            <p>{conv.ultimo_Mensaje}</p>
            {conv.no_Leidos > 0 && (
              <span className="badge">{conv.no_Leidos} sin leer</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Ejemplo 2: Ver y Enviar Mensajes

```typescript
import { useState } from 'react';
import {
  useMensajesDeConversacion,
  useEnviarMensajeSeguro,
  useUsuarioActual,
} from '@/store/api/chatHooks';

function ChatConversacion({ conversacionId }: { conversacionId: number }) {
  const { user } = useUsuarioActual();
  const { mensajes, isLoading } = useMensajesDeConversacion(conversacionId);
  const { enviar, isLoading: enviando, error } = useEnviarMensajeSeguro();
  const [contenido, setContenido] = useState('');

  const handleEnviar = async () => {
    try {
      await enviar({
        conversacion_Id: conversacionId,
        contenido,
      });
      setContenido('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="chat-conversation">
      <div className="mensajes-list">
        {mensajes.map((msg) => (
          <div
            key={msg.id}
            className={`mensaje ${
              msg.remitente_Id === user?.id ? 'enviado' : 'recibido'
            }`}
          >
            <p>{msg.contenido}</p>
            <small>{new Date(msg.fecha_Creacion).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleEnviar();
            }
          }}
          placeholder="Escribe un mensaje..."
          disabled={enviando}
        />
        <button
          onClick={handleEnviar}
          disabled={enviando || !contenido.trim()}
        >
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
```

---

### Ejemplo 3: Crear Conversación (Solo Clientes)

```typescript
import { useState } from 'react';
import { useCrearConversacionSegura } from '@/store/api/chatHooks';

function NuevaConversacion() {
  const { crear, canCreateConversacion, isLoading, error } =
    useCrearConversacionSegura();
  const [receptorId, setReceptorId] = useState('');
  const [nombre, setNombre] = useState('');

  const handleCrear = async () => {
    try {
      await crear({
        usuario_Receptor_Id: parseInt(receptorId),
        nombre_Contraparte: nombre,
      });
      alert('Conversación creada!');
      setReceptorId('');
      setNombre('');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!canCreateConversacion) {
    return (
      <div className="alert alert-warning">
        ⚠️ Solo clientes pueden crear conversaciones
      </div>
    );
  }

  return (
    <div className="form-group">
      <h3>Nueva Conversación</h3>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la persona"
      />
      <input
        type="number"
        value={receptorId}
        onChange={(e) => setReceptorId(e.target.value)}
        placeholder="ID del receptor"
      />
      <button
        onClick={handleCrear}
        disabled={isLoading || !nombre || !receptorId}
      >
        {isLoading ? 'Creando...' : 'Crear Conversación'}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
```

---

## Configuración

### 1. Instalar Dependencias

```bash
pnpm install @reduxjs/toolkit react-redux
```

### 2. Integrar Store en App

```typescript
// src/main.tsx
import { Provider } from 'react-redux';
import store from '@/store/reduxStore';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### 3. Variables de Entorno

Asegúrate de que en `.env` esté configurada:

```
VITE_API_BASE_URL=https://eventconnect-api-8oih6.ondigitalocean.app/api
```

---

## Notas Importantes

### ⚠️ Restricción de Rol

- **`crearConversacion()`** solo funciona si `user.rol === 'Cliente'`
- El hook `useCrearConversacionSegura()` valida esto automáticamente
- Intentar crear sin rol Cliente lanza error

### 📡 Polling Automático

- `getMensajes()` actualiza cada 3 segundos
- Se puede cambiar en `chatHooks.ts` → `pollingInterval`

### 🔄 Optimistic Updates

- `enviarMensaje()` actualiza el UI inmediatamente
- Si falla, revierte el cambio automáticamente

### 🔐 Autenticación

- Token se obtiene automáticamente de localStorage
- Si token expira (401), se redirige a `/login`

---

## Troubleshooting

### Error: "Solo usuarios con rol Cliente..."

**Solución:** Usuario no tiene rol 'Cliente'. Validar en Redux DevTools.

```typescript
// Debug
const user = useAuthStore(state => state.user);
console.log('Rol del usuario:', user?.rol);
```

### Error: "Debe estar autenticado..."

**Solución:** Usuario no está autenticado. Redirigir a login.

```typescript
const { isAuthenticated } = useUsuarioActual();
if (!isAuthenticated) {
  navigate('/login');
}
```

### Mensajes no se actualizan

**Solución:** Verificar que `conversacionId` no sea null.

```typescript
const { mensajes } = useMensajesDeConversacion(conversacionId); // no null!
```

---

## API Reference Rápida

| Hook | Propósito |
|------|-----------|
| `useGetConversacionesQuery()` | Listar conversaciones |
| `useGetMensajesQuery(id)` | Obtener mensajes |
| `useEnviarMensajeMutation()` | Enviar mensaje (sin validación) |
| `useCrearConversacionMutation()` | Crear conversación (sin validación) |
| `useCrearConversacionSegura()` | Crear conversación CON validación rol |
| `useEnviarMensajeSeguro()` | Enviar mensaje CON validaciones |
| `useConversacionesDelUsuario()` | Conversaciones del usuario actual |
| `useMensajesDeConversacion(id)` | Mensajes con polling automático |
| `useValidarRol([roles])` | Validar si usuario tiene rol |
| `useUsuarioActual()` | Obtener datos del usuario |

---

**Última actualización:** Enero 28, 2026  
**Versión:** 1.0.0  
**Autor:** GitHub Copilot
