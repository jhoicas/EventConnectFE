# Guía de Trabajo Post-Consolidación Vite

## 📚 Estructura Actual

```
EventConnect/
├── src/                    # Código fuente
│   ├── pages/             # Páginas de la aplicación
│   ├── features/          # Módulos por feature (activos, productos, etc)
│   ├── components/        # Componentes reutilizables (ui, layout)
│   ├── lib/               # Utilidades (routes, axios, validations)
│   ├── services/          # Servicios API
│   ├── store/             # Estado global (authStore, uiStore)
│   ├── types/             # Tipos TypeScript
│   ├── router/            # Configuración de rutas
│   ├── layouts/           # Layouts (AuthLayout, DashboardLayout)
│   ├── hooks/             # Custom hooks
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── vite.config.ts         # Config de Vite
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
├── package.json           # Dependencias
└── index.html             # HTML entry point
```

## 🚀 Comandos Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor en http://localhost:5173

# Producción
pnpm build            # Build para producción (output en dist/)
pnpm preview          # Preview del build

# Calidad de código
pnpm lint             # ESLint
pnpm type-check       # TypeScript type checking
```

## 📝 Convenciones de Archivos

### Componentes
```
src/components/
├── ui/                    # Shadcn/UI components (button, dialog, etc)
├── layout/               # Layout components (Header, Sidebar)
└── common/              # Componentes comunes reutilizables
```

### Features (módulos)
```
src/features/[feature]/
├── components/          # Componentes específicos del feature
├── hooks/              # Hooks personalizados
├── services/           # Servicios API
└── [opcional] forms/   # Formularios
```

### Ejemplo: Feature Productos
```
src/features/productos/
├── components/
│   └── ProductoForm.tsx
├── hooks/
│   └── useProductos.ts
└── services/
    └── productoService.ts
```

## 🔧 Actualización de Dependencias

Para agregar nuevas dependencias:
```bash
pnpm add [nombre-paquete]
pnpm add -D [nombre-paquete-dev]
```

Para actualizar:
```bash
pnpm update
pnpm update [nombre-paquete]@latest
```

## 🎨 Importes Correctos

**Usar alias `@/`:**
```typescript
// ✅ CORRECTO
import { Button } from '@/components/ui/button';
import { useProductos } from '@/features/productos/hooks/useProductos';
import { apiClient } from '@/lib/axios';
import type { Producto } from '@/types';
import { useAuthStore } from '@/store/authStore';

// ❌ EVITAR
import { Button } from './../../components/ui/button';
import { Button } from 'src/components/ui/button';
```

## 🌐 Variables de Entorno

Crear archivo `.env` en la raíz:
```env
VITE_API_BASE_URL=https://eventconnect-api-8oih6.ondigitalocean.app/api
VITE_APP_NAME=EventConnect
```

Acceder en código:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🔐 Autenticación

El flujo de autenticación usa Zustand + localStorage:

```typescript
import { useAuthStore } from '@/store/authStore';

// En componente
const { user, token, isAuthenticated, logout } = useAuthStore();

// Para autenticación
const setAuth = useAuthStore((state) => state.setAuth);
setAuth(user, token); // Guarda automáticamente en localStorage
```

## 📡 Llamadas API

Usar `axios` preconfigured con interceptores:

```typescript
import axios from '@/lib/axios';

// GET
const response = await axios.get('/ruta-api');

// POST con token automático
const response = await axios.post('/ruta-api', datos);
// El token se agrega automáticamente en headers

// En servicios
export const productoService = {
  getAll: async () => {
    const { data } = await axios.get('/productos');
    return data;
  }
};
```

## ✅ Validación de Formularios

Usar React Hook Form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Requerido'),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export function MiFormulario() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(async (data) => {
      // Enviar datos
    })}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

## 🗃️ Gestión de Estado

### Zustand (Estado global)
```typescript
import { create } from 'zustand';

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Uso en componentes
function Counter() {
  const { count, increment } = useMyStore();
  return <button onClick={increment}>{count}</button>;
}
```

### TanStack Query (Server State)
```typescript
import { useQuery } from '@tanstack/react-query';

function ProductsList() {
  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => axios.get('/productos'),
  });

  if (isLoading) return <div>Cargando...</div>;
  return <div>{/* render productos */}</div>;
}
```

## 🎯 Routing

Toda la navegación usa React Router en `src/router/index.tsx`:

```typescript
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/routes';

function MiComponente() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(APP_ROUTES.PRODUCTOS)}>
      Ir a Productos
    </button>
  );
}
```

Rutas definidas en `src/lib/routes.ts`:
```typescript
export const APP_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTOS: '/productos',
  // ...
};
```

## 🐛 Debugging

### React Developer Tools
- Instala extensión en Chrome
- Revisa componentes, props, hooks

### React Query DevTools
- Incluida automáticamente en dev
- Inspecciona queries, cache, mutations

### TypeScript
```bash
pnpm type-check  # Verifica tipos sin compilar
```

## 📤 Deployment

1. **Build**
```bash
pnpm build
```

2. **Output**
- Archivos estáticos en `dist/`
- Servir con cualquier servidor estático

3. **Ejemplo con Vercel**
```bash
vercel deploy
```

## ⚡ Performance Tips

1. **Code Splitting** - Use dynamic imports:
```typescript
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
```

2. **Image Optimization**
```typescript
<img src={`/api/images/${id}`} loading="lazy" />
```

3. **Query Keys** - Usa scope en React Query:
```typescript
const PRODUCTS_QUERY_KEYS = {
  all: ['products'],
  lists: () => [...PRODUCTS_QUERY_KEYS.all, 'list'],
  list: (filters: string) => [...PRODUCTS_QUERY_KEYS.lists(), { filters }],
};
```

## 🚨 Troubleshooting

### "Cannot find module '@/...'"
- Verifica que el alias está en `vite.config.ts` y `tsconfig.json`
- Reinicia TypeScript server en el editor

### "Module not found" en runtime
- Verifica que el archivo existe
- Usa rutas relativas correctas si es necesario

### Port 5173 en uso
```bash
pnpm dev -- --port 5174
```

## 📞 Referencias

- **Vite Docs**: https://vite.dev
- **React Router**: https://reactrouter.com
- **React Hook Form**: https://react-hook-form.com
- **TanStack Query**: https://tanstack.com/query
- **Tailwind CSS**: https://tailwindcss.com
- **Shadcn/UI**: https://ui.shadcn.com

---

**Última actualización**: 28 de Enero, 2026
**Versión**: 2.0.0 (Consolidada)
