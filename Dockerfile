# Multi-stage Dockerfile para Vite + React
FROM node:20-alpine AS base

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# ============================================
# Stage 1: Instalar dependencias
# ============================================
FROM base AS deps
WORKDIR /app

# Copiar solo archivos de configuración necesarios
COPY package.json ./
COPY pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build de la aplicación Vite
# ============================================
FROM base AS builder
WORKDIR /app

# Copiar dependencias instaladas desde el stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar package.json para que pnpm funcione
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copiar archivos de configuración necesarios para el build
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY index.html ./

# Copiar código fuente
COPY src ./src

# Build de producción (output en dist/)
RUN pnpm build

# ============================================
# Stage 3: Runtime - Servidor HTTP (Nginx + Dist)
# ============================================
FROM nginx:alpine AS runner

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos compilados desde builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check para verificar que Nginx está respondiendo en puerto 80
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]