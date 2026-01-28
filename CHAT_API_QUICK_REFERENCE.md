# Chat API - Quick Reference

## 📚 Importaciones

```typescript
// Hooks automáticos de RTK Query
import {
  useGetConversacionesQuery,
  useGetMensajesQuery,
  useEnviarMensajeMutation,
  useCrearConversacionMutation,
  useMarcarConversacionComoLeidaMutation,
  useEliminarConversacionMutation,
} from '@/store/api/chatApi';

// Hooks personalizados con validación
import {
  useCrearConversacionSegura,
  useEnviarMensajeSeguro,
  useConversacionesDelUsuario,
  useMensajesDeConversacion,
  useValidarRol,
  useUsuarioActual,
} from '@/store/api/chatHooks';

// Tipos
import type {
  Conversacion,
  Mensaje,
  CreateConversacionDto,
  EnviarMensajeDto,
  MensajeResponse,
} from '@/types';
```

---

## 🚀 Uso Rápido

### 1. Listar Conversaciones
```typescript
const { conversaciones, isLoading, isError } = useConversacionesDelUsuario();
```

### 2. Obtener Mensajes
```typescript
const { mensajes, isLoading } = useMensajesDeConversacion(conversacionId);
// Auto-actualiza cada 3 segundos
```

### 3. Enviar Mensaje
```typescript
const { enviar, isLoading, error } = useEnviarMensajeSeguro();

await enviar({
  conversacion_Id: 1,
  contenido: 'Hola!',
  tipo_Contenido: 'texto' // optional
});
```

### 4. Crear Conversación (Solo Cliente)
```typescript
const { crear, canCreateConversacion, isLoading } = useCrearConversacionSegura();

// Verificar permisos
if (!canCreateConversacion) {
  return <div>Solo clientes pueden crear</div>;
}

// Crear
await crear({
  usuario_Receptor_Id: 5,
  nombre_Contraparte: 'Juan Pérez',
  avatar_URL: 'https://...'
});
```

### 5. Validar Rol
```typescript
const puedeCrear = useValidarRol(['Cliente']);
if (!puedeCrear) return <div>No tienes permisos</div>;
```

### 6. Obtener Usuario Actual
```typescript
const { user, isAuthenticated, token } = useUsuarioActual();
console.log(user?.rol); // 'Cliente', 'Admin-Proveedor', etc
```

---

## 📊 Estructura de Datos

### Conversacion
```typescript
{
  id: 1,
  usuario_Iniciador_Id: 5,
  usuario_Receptor_Id: 10,
  nombre_Contraparte: "Juan Pérez",      // ← Nombre del otro
  avatar_URL: "https://...",              // ← Avatar del otro
  ultimo_Mensaje: "Hola, ¿cómo estás?",
  fecha_Ultimo_Mensaje: "2026-01-28T...",
  no_Leidos: 3,
  activo: true,
  fecha_Creacion: "2026-01-20T...",
  fecha_Actualizacion: "2026-01-28T..."
}
```

### Mensaje
```typescript
{
  id: 1,
  conversacion_Id: 1,
  remitente_Id: 5,
  contenido: "Hola!",
  tipo_Contenido: "texto", // "texto" | "imagen" | "archivo"
  archivo_URL: null,
  leido: true,
  fecha_Lectura: "2026-01-28T...",
  fecha_Creacion: "2026-01-28T...",
  fecha_Actualizacion: "2026-01-28T..."
}
```

---

## ⚙️ Estados de Carga

```typescript
// Todos los hooks retornan:
{
  isLoading: boolean,    // Cargando
  isError: boolean,      // Error
  error: Error | null,   // Objeto de error
  data: T | undefined,   // Datos
  refetch: () => Promise // Refrescar manualmente
}

// Mutations retornan además:
{
  reset: () => void      // Limpiar estado
}
```

---

## 🔄 Flujos Comunes

### Flujo: Ver Chat y Enviar Mensaje

```typescript
function ChatWindow({ conversacionId }: { conversacionId: number }) {
  // 1. Obtener mensajes
  const { mensajes, isLoading: loadingMsgs } = 
    useMensajesDeConversacion(conversacionId);

  // 2. Enviar mensaje
  const { enviar, isLoading: enviando, error } = 
    useEnviarMensajeSeguro();

  const [texto, setTexto] = useState('');

  const handleEnviar = async () => {
    try {
      await enviar({
        conversacion_Id: conversacionId,
        contenido: texto
      });
      setTexto('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loadingMsgs ? <Spinner /> : (
        <div className="messages">
          {mensajes.map(m => (
            <div key={m.id}>{m.contenido}</div>
          ))}
        </div>
      )}
      <textarea value={texto} onChange={e => setTexto(e.target.value)} />
      <button 
        onClick={handleEnviar} 
        disabled={enviando || !texto.trim()}
      >
        {enviando ? 'Enviando...' : 'Enviar'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

### Flujo: Crear Conversación (Solo Cliente)

```typescript
function NuevaConversacion() {
  const { crear, canCreateConversacion, isLoading, error } = 
    useCrearConversacionSegura();

  const [receptorId, setReceptorId] = useState('');
  const [nombre, setNombre] = useState('');

  if (!canCreateConversacion) {
    return <Alert>Solo clientes pueden crear conversaciones</Alert>;
  }

  const handleCrear = async () => {
    try {
      const result = await crear({
        usuario_Receptor_Id: Number(receptorId),
        nombre_Contraparte: nombre
      });
      toast.success('Conversación creada');
      setReceptorId('');
      setNombre('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={e => {
      e.preventDefault();
      handleCrear();
    }}>
      <input 
        value={nombre} 
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input 
        type="number"
        value={receptorId} 
        onChange={e => setReceptorId(e.target.value)}
        placeholder="ID del receptor"
      />
      <button disabled={isLoading || !nombre || !receptorId}>
        {isLoading ? 'Creando...' : 'Crear'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

### Flujo: Lista de Conversaciones

```typescript
function ConversacionesList() {
  const { conversaciones, isLoading, isError, refetch } = 
    useConversacionesDelUsuario();

  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  if (isLoading) return <Spinner />;
  if (isError) return <div className="error">Error cargando</div>;

  return (
    <div className="conversaciones">
      {conversaciones.length === 0 ? (
        <div>No hay conversaciones</div>
      ) : (
        <ul>
          {conversaciones.map(conv => (
            <li
              key={conv.id}
              onClick={() => setSeleccionada(conv.id)}
              className={seleccionada === conv.id ? 'active' : ''}
            >
              <img src={conv.avatar_URL} alt={conv.nombre_Contraparte} />
              <div>
                <h3>{conv.nombre_Contraparte}</h3>
                <p>{conv.ultimo_Mensaje}</p>
                <time>{new Date(conv.fecha_Ultimo_Mensaje).toLocaleString()}</time>
              </div>
              {conv.no_Leidos > 0 && (
                <span className="badge">{conv.no_Leidos}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => refetch()}>Refrescar</button>
    </div>
  );
}
```

---

## 🛡️ Validaciones Automáticas

```typescript
// useCrearConversacionSegura() valida:
✓ user?.rol === 'Cliente'
✓ Lanza error si no es Cliente

// useEnviarMensajeSeguro() valida:
✓ usuario autenticado
✓ contenido no vacío
✓ contenido.trim().length > 0

// useMensajesDeConversacion(id) valida:
✓ conversacionId no null
✓ Solo ejecuta si id está definido
```

---

## 📡 Configuración RTK Query

```typescript
// Auto-polling cada 3 segundos
pollingInterval: 3000

// Caching automático por conversacionId
// Invalidación por tags:
// - 'Conversaciones' (lista completa)
// - { type: 'Conversacion', id: conversacionId }
// - { type: 'Mensajes', id: conversacionId }

// Optimistic updates:
// - Mensaje aparece inmediatamente
// - Se revierte si falla
```

---

## 🔐 Endpoints Seguros

| Endpoint | Seguridad |
|----------|-----------|
| `GET /conversaciones` | Bearer token (skip si no auth) |
| `GET /conversaciones/:id` | Bearer token |
| `GET /mensajes/:id` | Bearer token |
| `POST /mensajes` | Bearer token + validación contenido |
| `POST /conversaciones` | Bearer token + rol === 'Cliente' |
| `PATCH /marcar-leido` | Bearer token |
| `DELETE /conversaciones` | Bearer token |

---

## 📋 Error Handling

```typescript
try {
  await enviar({ conversacion_Id: 1, contenido: 'Hola' });
} catch (err) {
  // Errores posibles:
  // - "Debe estar autenticado para enviar mensajes"
  // - "El contenido del mensaje no puede estar vacío"
  // - Network error
  // - 401 Unauthorized
  // - 403 Forbidden
  console.error(err.message);
}

try {
  await crear({ usuario_Receptor_Id: 5, nombre_Contraparte: 'Juan' });
} catch (err) {
  // Errores posibles:
  // - "Solo usuarios con rol Cliente pueden crear conversaciones"
  // - Network error
  // - 401 Unauthorized
  console.error(err.message);
}
```

---

## 🎯 Checklist de Integración

- [ ] Instalar `@reduxjs/toolkit react-redux`
- [ ] Agregar `<Provider store={store}>` en main.tsx
- [ ] Importar hooks en componentes
- [ ] Integrar UI components (Shadcn, etc)
- [ ] Probar todos los hooks manualmente
- [ ] Verificar tokens en LocalStorage
- [ ] Validar que backend rechace requests sin Bearer token
- [ ] Validar que backend rechace crearConversacion si rol !== 'Cliente'
- [ ] Testing con React Testing Library
- [ ] Testing E2E con Playwright

---

**Version:** 1.0.0  
**Última actualización:** Enero 28, 2026
