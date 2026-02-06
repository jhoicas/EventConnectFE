# Troubleshooting - Página en Blanco en Producción

## Cambios Realizados

### 1. Vite Configuration (vite.config.ts)
- ✅ Agregado `base: '/'` para rutas correctas
- ✅ Configuración de build optimizada con code splitting
- ✅ Configuración de puertos para preview

### 2. Error Boundary (src/components/ErrorBoundary.tsx)
- ✅ Nuevo componente para capturar errores de React
- ✅ Muestra detalles del error en desarrollo
- ✅ Permite recargar la aplicación

### 3. Index.html
- ✅ Scripts de debug para errores globales
- ✅ Mensaje para navegadores sin JavaScript
- ✅ Mejor metadata

### 4. Nginx Configuration
- ✅ MIME types explícitos para JavaScript
- ✅ Configuración correcta de SPA fallback

## Cómo Verificar el Build Localmente

```bash
# 1. Hacer build de producción
pnpm build

# 2. Verificar que la carpeta dist/ se creó correctamente
ls dist/

# 3. Debería tener:
# - index.html
# - assets/ (con archivos .js y .css)

# 4. Previsualizar el build
pnpm preview

# 5. Abrir http://localhost:3000
```

## Debugging en Docker

```bash
# 1. Build de la imagen
docker build -t eventconnect .

# 2. Correr el contenedor
docker run -p 3000:3000 eventconnect

# 3. Verificar logs
docker logs <container-id>

# 4. Entrar al contenedor para inspeccionar
docker exec -it <container-id> sh

# 5. Dentro del contenedor, verificar archivos
ls -la /usr/share/nginx/html/
cat /usr/share/nginx/html/index.html
```

## Checklist de Diagnóstico

- [ ] Verificar que `pnpm build` no tiene errores
- [ ] Confirmar que existe `dist/index.html`
- [ ] Confirmar que existe `dist/assets/` con archivos
- [ ] Abrir Developer Console en el navegador (F12)
- [ ] Revisar la pestaña Console por errores JavaScript
- [ ] Revisar la pestaña Network por archivos 404
- [ ] Verificar que los archivos .js y .css se cargan correctamente
- [ ] Confirmar que no hay errores CORS
- [ ] Verificar que el puerto 3000 esté expuesto correctamente

## Problemas Comunes y Soluciones

### 1. Página en blanco sin errores en consola
**Causa**: Base path incorrecto en Vite
**Solución**: ✅ Ya configurado `base: '/'` en vite.config.ts

### 2. Error 404 en archivos .js
**Causa**: MIME types incorrectos o rutas mal configuradas
**Solución**: ✅ Ya configurado en nginx.conf

### 3. Error "Failed to fetch dynamically imported module"
**Causa**: Archivos no se copiaron correctamente al contenedor
**Solución**: Verificar el Dockerfile y que COPY --from=builder funcione

### 4. Errores de JavaScript no capturados
**Causa**: Errores en tiempo de ejecución
**Solución**: ✅ ErrorBoundary agregado para capturarlos

## Próximos Pasos

1. Hacer commit de estos cambios
2. Push a repositorio
3. Rebuild y redeploy
4. Verificar en producción
5. Si sigue en blanco, revisar logs del contenedor

## Comandos Útiles

```bash
# Ver errores de TypeScript sin hacer build
pnpm type-check

# Build y preview en un solo comando
pnpm build && pnpm preview

# Limpiar y rebuild
rm -rf dist node_modules && pnpm install && pnpm build
```
