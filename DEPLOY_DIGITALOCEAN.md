# 🚀 Guía de Deploy en DigitalOcean

Esta guía te ayudará a desplegar EventConnect Frontend en DigitalOcean usando App Platform o Docker.

## 📋 Requisitos Previos

- Cuenta en DigitalOcean
- Repositorio Git (GitHub, GitLab o Bitbucket)
- Variables de entorno configuradas

## 🌐 Opción 1: DigitalOcean App Platform (Recomendado)

App Platform es la forma más sencilla de desplegar aplicaciones Next.js en DigitalOcean.

### Paso 1: Preparar el Repositorio

1. Asegúrate de que tu código esté en un repositorio Git
2. Verifica que el archivo `app.yaml` esté en la raíz del proyecto
3. Actualiza el archivo `app.yaml` con tu información:

```yaml
name: eventconnect-frontend
region: nyc  # Cambia por tu región preferida
services:
  - name: web
    github:
      repo: tu-usuario/EventConnect  # Actualiza con tu repo
      branch: main
      deploy_on_push: true
```

### Paso 2: Crear la App en DigitalOcean

1. Ve a [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Haz clic en "Create App"
3. Conecta tu repositorio Git
4. DigitalOcean detectará automáticamente el archivo `app.yaml`
5. O configura manualmente:
   - **Build Command**: `pnpm install && pnpm build --filter @eventconnect/host`
   - **Run Command**: `pnpm --filter @eventconnect/host start`
   - **Environment**: Node.js
   - **HTTP Port**: 3000

### Paso 3: Configurar Variables de Entorno

En la sección "Environment Variables" de tu app, agrega:

```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://tu-api-backend.com/api
NEXT_PUBLIC_ENV=production
```

### Paso 4: Deploy

1. Haz clic en "Create Resources"
2. DigitalOcean comenzará el build y deploy automáticamente
3. Espera a que termine el proceso (5-10 minutos)
4. Tu app estará disponible en `https://tu-app.ondigitalocean.app`

---

## 🐳 Opción 2: Docker en Droplet

Si prefieres más control, puedes usar un Droplet con Docker.

### Paso 1: Crear un Droplet

1. Ve a [DigitalOcean Droplets](https://cloud.digitalocean.com/droplets)
2. Crea un nuevo Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic (mínimo 2GB RAM recomendado)
   - **Region**: Elige la más cercana a tus usuarios
   - **Authentication**: SSH keys (recomendado)

### Paso 2: Configurar el Servidor

Conecta por SSH a tu Droplet:

```bash
ssh root@tu-droplet-ip
```

Instala Docker y Docker Compose:

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install docker-compose -y

# Verificar instalación
docker --version
docker-compose --version
```

### Paso 3: Clonar y Configurar el Proyecto

```bash
# Instalar Git
apt install git -y

# Clonar repositorio
git clone https://github.com/tu-usuario/EventConnect.git
cd EventConnect

# Crear archivo .env
nano .env
```

Agrega tus variables de entorno:

```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://tu-api-backend.com/api
NEXT_PUBLIC_ENV=production
```

### Paso 4: Build y Run con Docker

```bash
# Build de la imagen
docker build -t eventconnect-frontend .

# Run del contenedor
docker run -d \
  --name eventconnect-app \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  eventconnect-frontend
```

### Paso 5: Configurar Nginx como Reverse Proxy (Opcional pero Recomendado)

```bash
# Instalar Nginx
apt install nginx -y

# Crear configuración
nano /etc/nginx/sites-available/eventconnect
```

Agrega esta configuración:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilita el sitio:

```bash
ln -s /etc/nginx/sites-available/eventconnect /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Paso 6: Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d tu-dominio.com

# Renovación automática
certbot renew --dry-run
```

---

## 🔄 Actualizaciones Automáticas

### Con App Platform

Si configuraste `deploy_on_push: true` en `app.yaml`, cada push a la rama `main` desplegará automáticamente.

### Con Docker

Puedes crear un script de actualización:

```bash
#!/bin/bash
# update.sh
cd /root/EventConnect
git pull
docker build -t eventconnect-frontend .
docker stop eventconnect-app
docker rm eventconnect-app
docker run -d \
  --name eventconnect-app \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  eventconnect-frontend
```

Hazlo ejecutable:

```bash
chmod +x update.sh
```

---

## 📊 Monitoreo y Logs

### App Platform

- Ve a tu app en DigitalOcean
- Sección "Runtime Logs" para ver logs en tiempo real
- Sección "Metrics" para métricas de rendimiento

### Docker

```bash
# Ver logs
docker logs eventconnect-app

# Seguir logs en tiempo real
docker logs -f eventconnect-app

# Ver estadísticas
docker stats eventconnect-app
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module"

**Solución**: Verifica que todas las dependencias estén instaladas:
```bash
pnpm install --frozen-lockfile
```

### Error: "Port 3000 already in use"

**Solución**: Cambia el puerto o detén el proceso:
```bash
# Ver qué usa el puerto
lsof -i :3000
# O
netstat -tulpn | grep 3000
```

### Error: "Build failed"

**Solución**: 
1. Verifica los logs de build en DigitalOcean
2. Asegúrate de que `NODE_ENV=production` esté configurado
3. Verifica que todas las variables de entorno estén configuradas

### La app no responde

**Solución**:
1. Verifica que el contenedor esté corriendo: `docker ps`
2. Revisa los logs: `docker logs eventconnect-app`
3. Verifica las variables de entorno
4. Asegúrate de que el puerto 3000 esté abierto en el firewall

---

## 💰 Estimación de Costos

### App Platform
- **Basic Plan**: Desde $5/mes (512MB RAM)
- **Professional Plan**: Desde $12/mes (1GB RAM) - Recomendado

### Droplet
- **Basic Droplet**: Desde $6/mes (1GB RAM)
- **Con Nginx y SSL**: Sin costo adicional

---

## ✅ Checklist de Deploy

- [ ] Repositorio Git configurado
- [ ] Variables de entorno configuradas
- [ ] Build local exitoso (`pnpm build`)
- [ ] `app.yaml` actualizado con tu información
- [ ] Dockerfile probado localmente (si usas Docker)
- [ ] Dominio configurado (opcional pero recomendado)
- [ ] SSL configurado (si usas dominio)
- [ ] Health checks funcionando
- [ ] Logs monitoreados

---

## 📞 Soporte

Si tienes problemas con el deploy:

1. Revisa los logs de la aplicación
2. Verifica la documentación de [DigitalOcean](https://docs.digitalocean.com/)
3. Consulta los [foros de DigitalOcean](https://www.digitalocean.com/community/questions)

---

**¡Listo para producción! 🎉**
