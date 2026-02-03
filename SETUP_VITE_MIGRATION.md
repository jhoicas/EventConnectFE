# 🚀 Migración a Vite + React - EventConnect

## 📋 Stack Tecnológico
- **Build Tool**: Vite
- **Framework**: React 18+ con TypeScript
- **Estilos**: Tailwind CSS
- **UI Library**: Shadcn/UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query) v5
- **Routing**: React Router DOM v6
- **HTTP**: Axios

---

## 🛠️ PASO 1: Inicializar Proyecto con Vite

```powershell
# Navegar a la raíz del proyecto
cd C:\Users\yoiner.castillo\source\repos\EventConnect

# Crear nuevo proyecto Vite con React + TypeScript
npm create vite@latest apps/web-app -- --template react-ts

# Entrar al directorio
cd apps/web-app

# Instalar dependencias base
pnpm install
```

---

## 🛠️ PASO 2: Instalar Dependencias del Stack

```powershell
# UI & Estilos
pnpm add tailwindcss postcss autoprefixer
pnpm add -D @tailwindcss/forms @tailwindcss/typography

# Shadcn/UI dependencies
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu

# State Management
pnpm add zustand

# Data Fetching
pnpm add @tanstack/react-query @tanstack/react-query-devtools

# Routing
pnpm add react-router-dom

# HTTP Client
pnpm add axios

# Utilities
pnpm add date-fns zod react-hook-form @hookform/resolvers
```

---

## 🛠️ PASO 3: Configurar Tailwind CSS

```powershell
# Inicializar Tailwind
npx tailwindcss init -p
```

---

## 🛠️ PASO 4: Inicializar Shadcn/UI

```powershell
# Inicializar Shadcn/UI (responder preguntas interactivas)
npx shadcn@latest init

# Opciones a seleccionar:
# ✔ Would you like to use TypeScript? » Yes
# ✔ Which style would you like to use? » New York
# ✔ Which color would you like to use as base color? » Slate
# ✔ Where is your global CSS file? » src/index.css
# ✔ Would you like to use CSS variables for colors? » Yes
# ✔ Are you using a custom tailwind prefix? » No
# ✔ Where is your tailwind.config.js located? » tailwind.config.js
# ✔ Configure the import alias for components: » @/components
# ✔ Configure the import alias for utils: » @/lib/utils
# ✔ Are you using React Server Components? » No
```

---

## 🛠️ PASO 5: Agregar Componentes Shadcn Iniciales

```powershell
# Componentes esenciales
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add skeleton
```

---

## 📁 Estructura de Carpetas Final

```
apps/web-app/
├── public/
├── src/
│   ├── assets/              # Imágenes, iconos, etc.
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes Shadcn/UI (auto-generados)
│   │   ├── layout/         # Layout components (Navbar, Sidebar, etc.)
│   │   └── common/         # Componentes comunes
│   ├── features/           # Features por módulo de negocio
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── store/
│   │   ├── dashboard/
│   │   ├── productos/
│   │   ├── reservas/
│   │   └── clientes/
│   ├── hooks/              # Custom hooks globales
│   ├── layouts/            # Layouts principales
│   │   ├── DashboardLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── lib/                # Utilidades y configuraciones
│   │   ├── utils.ts
│   │   ├── axios.ts
│   │   └── queryClient.ts
│   ├── pages/              # Páginas/Vistas
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Productos.tsx
│   │   └── NotFound.tsx
│   ├── router/             # Configuración de rutas
│   │   └── index.tsx
│   ├── store/              # Zustand stores
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── types/              # TypeScript types/interfaces
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## ⚙️ CONFIGURACIONES

### 📄 `vite.config.ts`
Ver archivo en: `apps/web-app/vite.config.ts`

### 📄 `tsconfig.json`
Ver archivo en: `apps/web-app/tsconfig.json`

### 📄 `tailwind.config.js`
Ver archivo en: `apps/web-app/tailwind.config.js`

### 📄 `.env.example`
```env
VITE_API_BASE_URL=https://eventconnect-api-8oih6.ondigitalocean.app/api
VITE_APP_NAME=EventConnect
```

---

## 🚀 Comandos de Desarrollo

```powershell
# Desarrollo
pnpm dev

# Build producción
pnpm build

# Preview build
pnpm preview

# Type checking
pnpm tsc --noEmit
```

---

## ✅ Próximos Pasos

1. ✅ Crear archivos de configuración
2. ✅ Crear estructura de carpetas
3. ✅ Configurar Axios interceptors
4. ✅ Configurar React Query
5. ✅ Crear router con React Router DOM
6. ✅ Crear stores de Zustand
7. ✅ Migrar componentes de Next.js a Vite
8. ✅ Implementar autenticación
9. ✅ Configurar layouts

---

**¿Deseas que genere los archivos de configuración y la estructura inicial ahora?**
