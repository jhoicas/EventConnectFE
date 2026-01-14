# Multi-stage build para optimizar tamaño de imagen
FROM node:20-alpine AS base

# Instalar pnpm globalmente (versión actualizada para evitar warnings)
RUN npm install -g pnpm@latest

# Stage 1: Instalar dependencias
FROM base AS deps
WORKDIR /app

# Copiar archivos de configuración del monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY .npmrc ./

# Copiar package.json de cada workspace
COPY apps/host/package.json ./apps/host/

# Crear directorio packages vacío (pnpm manejará workspaces vacíos sin errores)
RUN mkdir -p ./packages

# Instalar dependencias con hoisting (usa .npmrc) y lockfile
RUN pnpm install --frozen-lockfile

# Stage 2: Build de la aplicación
FROM base AS builder
WORKDIR /app

# Copiar configuración y dependencias ya instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/turbo.json ./turbo.json
COPY --from=deps /app/.npmrc ./\nCOPY --from=deps /app/apps/host/package.json ./apps/host/package.json

# Copiar código fuente completo
COPY . .

# Build de producción (usa deps ya instaladas)
RUN pnpm build --filter @eventconnect/host

# Stage 3: Runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios para ejecución
# El output standalone de Next.js incluye todo lo necesario
COPY --from=builder --chown=nextjs:nodejs /app/apps/host/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/host/.next/static ./apps/host/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/host/public ./apps/host/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# El servidor puede estar en diferentes ubicaciones según la estructura del standalone
CMD ["node", "apps/host/server.js"]
