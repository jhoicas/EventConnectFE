# Multi-stage build para optimizar tamaño de imagen
FROM node:20-alpine AS base

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Stage 1: Instalar dependencias
FROM base AS deps
WORKDIR /app

# Copiar archivos de configuración del monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY .npmrc ./

# Copiar package.json de la aplicación host
COPY apps/host/package.json ./apps/host/

# --- CORRECCIÓN: Copiar package.json de los paquetes compartidos ---
# Es necesario crear los directorios primero para asegurar la estructura
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/
# -----------------------------------------------------------------

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Stage 2: Build de la aplicación
FROM base AS builder
WORKDIR /app

# Copiar dependencias instaladas desde el stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copiar código fuente completo
COPY . .

# Build de producción
RUN pnpm build --filter @eventconnect/host

# Stage 3: Runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios para ejecución
# Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/host/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/host/.next/static ./apps/host/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/host/public ./apps/host/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/host/server.js"]