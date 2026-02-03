# EventConnect Frontend

Frontend en Vite + React para la plataforma EventConnect.

---

## 🧰 Tecnologías

- **Vite** (build/dev server)
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS 4**
- **React Router 7**
- **TanStack Query**
- **Zustand**
- **Axios**

---

## ▶️ Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm type-check
```

---

## ⚙️ Variables de entorno

```bash
VITE_API_BASE_URL=https://eventconnect-api-8oih6.ondigitalocean.app/api
VITE_ROLE_ID_ADMIN_PROVEEDOR=2
```

---

## 🗂️ Estructura actual del proyecto

```
EventConnect/
├── app.yaml
├── docker-compose.yml
├── Dockerfile
├── index.html
├── nginx.conf
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public/
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── Logo.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── ResponsiveTable.tsx
│   │   ├── ServiciosGrid.tsx
│   │   └── SidebarMenuItemWithBadge.tsx
│   ├── features/
│   │   ├── activos/
│   │   ├── auth/
│   │   ├── bodegas/
│   │   ├── categorias/
│   │   ├── clientes/
│   │   ├── configuracion/
│   │   ├── cotizaciones/
│   │   ├── dashboard/
│   │   ├── factura/
│   │   ├── lotes/
│   │   ├── mantenimientos/
│   │   ├── notificaciones/
│   │   ├── productos/
│   │   ├── reservas/
│   │   └── usuarios/
│   ├── hooks/
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── menuConfig.ts
│   │   ├── queryClient.ts
│   │   ├── routes.ts
│   │   ├── utils.ts
│   │   └── validations/
│   ├── pages/
│   │   ├── cliente/
│   │   ├── Activos.tsx
│   │   ├── Bodegas.tsx
│   │   ├── Categorias.tsx
│   │   ├── Chat.tsx
│   │   ├── Clientes.tsx
│   │   ├── Configuracion.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Facturacion.tsx
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Lotes.tsx
│   │   ├── Mantenimientos.tsx
│   │   ├── NotFound.tsx
│   │   ├── Productos.tsx
│   │   ├── Register.tsx
│   │   ├── Reservas.tsx
│   │   └── Usuarios.tsx
│   ├── router/
│   │   └── index.tsx
│   ├── services/
│   ├── store/
│   │   ├── api/
│   │   ├── authStore.ts
│   │   ├── reduxStore.ts
│   │   └── uiStore.ts
│   └── types/
│       └── index.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (data) => {
    const result = await login(data).unwrap();
    // Manejar resultado
  };
}
```

---

## 🪝 React 19 Hooks

### `useOptimistic`

Actualiza la UI inmediatamente con valores "optimistas".

```typescript
import { useOptimistic } from 'react';

function ProductList() {
  const [products, addOptimistic] = useOptimistic(
    items,
    (state, newItem) => [...state, newItem]
  );

  const handleAdd = async (product) => {
    addOptimistic(product); // UI se actualiza instantáneamente
    await saveProduct(product); // Request al backend
  };
}
```

### `useActionState`

Maneja estado de acciones (loading, error, data).

```typescript
import { useActionState } from 'react';

function CreateForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await createItem(formData);
      return { success: true, data: result };
    },
    { success: false, data: null }
  );

  return (
    <form action={formAction}>
      <Button isLoading={isPending}>Guardar</Button>
    </form>
  );
}
```

### `useFormStatus`

Proporciona estado de envío de formularios.

```typescript
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} disabled={pending}>
      {pending ? 'Guardando...' : 'Guardar'}
    </Button>
  );
}
```

---

## 🌐 Variables de Entorno

### Host (`.env.local`)

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:5555/api

# Environment
NEXT_PUBLIC_ENV=development

# Analytics (opcional)
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Coverage
pnpm test --coverage

# Watch mode
pnpm test --watch
```

### Estructura de Tests

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
├── hooks/
│   ├── useInventory.ts
│   └── useInventory.test.ts
└── store/
    ├── slices/
    │   ├── authSlice.ts
    │   └── authSlice.test.ts
```

---

## 📊 Performance

### Code Splitting Automático

Next.js divide automáticamente el código por rutas.

```typescript
// Lazy loading manual
const MFEInventario = dynamic(() => import('@/mfe/inventario'), {
  loading: () => <Loading />,
  ssr: false,
});
```

### Optimizaciones en `next.config.js`

```javascript
experimental: {
  optimizePackageImports: ['@chakra-ui/react', 'lucide-react']
},
webpack: (config) => {
  config.optimization.splitChunks = {
    cacheGroups: {
      chakra: { name: 'chakra-ui', test: /[\\/]@chakra-ui[\\/]/ },
      redux: { name: 'redux', test: /[\\/]@reduxjs[\\/]/ },
    }
  };
  return config;
}
```

---

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm@8.15.0

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/host/package.json ./apps/host/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter @eventconnect/host

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/host/.next ./apps/host/.next
COPY --from=builder /app/apps/host/public ./apps/host/public
EXPOSE 3000
CMD ["pnpm", "--filter", "@eventconnect/host", "start"]
```

---

## 📝 Convenciones de Código

### Commits (Conventional Commits)

```bash
feat(host): add login page
fix(ui): correct button hover state
docs(shared): update API types
refactor(mfe-inventario): simplify state management
```

### Naming

- **Componentes**: `PascalCase` (e.g., `LoginForm.tsx`)
- **Hooks**: `camelCase` con prefijo `use` (e.g., `useInventory.ts`)
- **Utilidades**: `camelCase` (e.g., `formatDate.ts`)
- **Constantes**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

---

## 🤝 Contribución

1. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
2. Commit con conventional commits: `git commit -m "feat: agregar X"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

---

## 📄 Licencia

MIT © 2025 EventConnect

---

## 🆘 Soporte

- **Email**: soporte@eventconnect.com
- **Docs**: [docs.eventconnect.com](https://docs.eventconnect.com)
- **Issues**: [GitHub Issues](https://github.com/eventconnect/frontend/issues)

---

<div align="center">

**⭐ Si te gusta este proyecto, déjanos una estrella en GitHub ⭐**

</div>
