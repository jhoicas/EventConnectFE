# ✅ Checklist de Preparación para Deploy en DigitalOcean

## 📦 Archivos Creados

- [x] `app.yaml` - Configuración para DigitalOcean App Platform
- [x] `Dockerfile` - Imagen Docker optimizada para producción
- [x] `.dockerignore` - Archivos excluidos del build Docker
- [x] `docker-compose.yml` - Configuración opcional para desarrollo/producción
- [x] `.nvmrc` - Especifica versión de Node.js (20)
- [x] `.node-version` - Especifica versión de Node.js (20)
- [x] `DEPLOY_DIGITALOCEAN.md` - Documentación completa de deploy

## ⚙️ Configuraciones Actualizadas

- [x] `apps/host/next.config.js` - Habilitado `output: 'standalone'` para Docker
- [x] Scripts de build verificados en `package.json`

## 🔧 Antes de Hacer Deploy

### 1. Actualizar `app.yaml`
```yaml
github:
  repo: tu-usuario/EventConnect  # ⚠️ Cambiar por tu repositorio
  branch: main                    # ⚠️ Verificar que sea la rama correcta
```

### 2. Configurar Variables de Entorno

En DigitalOcean App Platform, agrega estas variables:

```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://tu-api-backend.com/api
NEXT_PUBLIC_ENV=production
```

**Nota**: Hay una inconsistencia en el código:
- `apps/host/src/config/env.ts` usa `NEXT_PUBLIC_API_BASE_URL`
- `apps/host/src/services/api.ts` usa `NEXT_PUBLIC_API_URL`

**Recomendación**: Estandarizar usando `NEXT_PUBLIC_API_BASE_URL` en ambos archivos.

### 3. Verificar Build Local

Antes de hacer deploy, prueba el build localmente:

```bash
# Instalar dependencias
pnpm install

# Build de producción
pnpm build --filter @eventconnect/host

# Probar servidor de producción localmente
pnpm --filter @eventconnect/host start
```

### 4. Probar Docker Localmente (Opcional)

```bash
# Build de la imagen
docker build -t eventconnect-frontend .

# Run del contenedor
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:5555/api \
  eventconnect-frontend
```

## 🚀 Opciones de Deploy

### Opción A: App Platform (Más Fácil)
1. Ve a DigitalOcean App Platform
2. Conecta tu repositorio Git
3. DigitalOcean detectará `app.yaml` automáticamente
4. Configura variables de entorno
5. Deploy automático

### Opción B: Docker en Droplet
1. Crea un Droplet Ubuntu
2. Instala Docker
3. Clona el repositorio
4. Build y run con Docker
5. Configura Nginx como reverse proxy (opcional)
6. Configura SSL con Let's Encrypt (opcional)

Ver `DEPLOY_DIGITALOCEAN.md` para instrucciones detalladas.

## 📝 Notas Importantes

1. **Puerto**: La aplicación corre en el puerto 3000 por defecto
2. **Health Checks**: Configurados en `app.yaml` para `/`
3. **Standalone Output**: Habilitado en `next.config.js` para builds Docker optimizados
4. **Monorepo**: El build usa `--filter @eventconnect/host` para construir solo la app host
5. **pnpm**: Asegúrate de que DigitalOcean tenga pnpm instalado (se instala automáticamente con Node.js 20+)

## 🔍 Verificación Post-Deploy

Después del deploy, verifica:

- [ ] La aplicación carga correctamente
- [ ] Las llamadas a la API funcionan
- [ ] Los assets estáticos se cargan (CSS, imágenes, etc.)
- [ ] El routing de Next.js funciona
- [ ] Los health checks pasan
- [ ] Los logs no muestran errores críticos

## 🐛 Troubleshooting

Si algo falla:

1. **Revisa los logs** en DigitalOcean App Platform
2. **Verifica variables de entorno** están configuradas correctamente
3. **Prueba el build local** para identificar problemas
4. **Revisa la documentación** en `DEPLOY_DIGITALOCEAN.md`

## ✅ Estado Actual

**Proyecto listo para deploy en DigitalOcean** ✅

Todos los archivos necesarios han sido creados y configurados. Solo falta:
1. Actualizar `app.yaml` con tu información de repositorio
2. Configurar variables de entorno en DigitalOcean
3. Hacer el deploy

---

**¡Buena suerte con el deploy! 🚀**
