# 🧹 Post-Consolidación: Limpiar Carpetas Antiguas

## 📝 Resumen

Después de consolidar el proyecto Vite a la raíz, algunas carpetas antiguas aún existen pero **YA NO SE USAN**.

Este archivo te guía en su eliminación segura.

---

## ⚠️ ANTES DE EMPEZAR

**Asegúrate de:**
1. ✅ Estar en rama `main` o una rama de backup
2. ✅ Haber committeado todos los cambios con: `git commit -m "..."`
3. ✅ Haber hecho un backup del repositorio
4. ✅ El servidor de desarrollo NO esté corriendo en `apps/web-app`

---

## 🗑️ Carpetas a Eliminar

### 1. **apps/** (COMPLETAMENTE)
```bash
rm -r apps/
```

**Por qué:**
- `apps/host/` (Next.js) está deprecated
- `apps/web-app/` ha sido movida a `/src`
- Ya no es un monorepo

**Archivos afectados:**
- apps/host/
  - next.config.js
  - tsconfig.json
  - package.json
  - src/ (TODO migrado a /src)
- apps/web-app/
  - vite.config.ts (COPIADO)
  - tsconfig.json (COPIADO)
  - src/ (COPIADO)
  - package.json (FUSIONADO)

### 2. **packages/** (COMPLETAMENTE)
```bash
rm -r packages/
```

**Por qué:**
- `packages/shared` - No se usaba
- `packages/ui` - Los componentes están en `src/components/`
- No es necesaria en arquitectura consolidada

### 3. **Archivos de Config Monorepo**
```bash
rm pnpm-workspace.yaml
rm turbo.json
```

**Por qué:**
- `pnpm-workspace.yaml` - Define monorepo (ya no aplica)
- `turbo.json` - Config de Turbo build tool (ya no usado)

---

## 📋 Checklist de Eliminación Segura

### Paso 1: Verifica que no hay procesos activos
```bash
# Asegúrate que NO hay servidores corriendo
# Kill cualquier proceso de Node en los puertos 3000, 5173, etc.
# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID] /F

# O simplemente cierra todas las terminales
```

### Paso 2: Commit antes de eliminar
```bash
git status                    # Ver cambios pendientes
git add .
git commit -m "pre-cleanup: save state before removing old folders"
```

### Paso 3: Eliminar carpetas

**Opción A: Usando PowerShell (Windows)**
```powershell
cd C:\Users\yoiner.castillo\source\repos\EventConnect

# Uno por uno (más seguro)
Remove-Item -Path "apps" -Recurse -Force
Remove-Item -Path "packages" -Recurse -Force
Remove-Item -Path "pnpm-workspace.yaml" -Force
Remove-Item -Path "turbo.json" -Force

# Verificar
Get-ChildItem | Select-Object Name
```

**Opción B: Usando Git (RECOMENDADO)**
```bash
# Git gestiona todo automáticamente
git rm -r apps/
git rm -r packages/
git rm pnpm-workspace.yaml
git rm turbo.json

# Commit
git commit -m "chore: remove deprecated monorepo structure

- Delete apps/host/ (Next.js - no longer used)
- Delete apps/web-app/ (migrated to /src)
- Delete packages/ (unused)
- Delete turbo.json (build tool no longer needed)
- Delete pnpm-workspace.yaml (monorepo config no longer needed)

Migration complete: now using single Vite + React app in root"
```

### Paso 4: Verificar

```bash
# Estructura debe quedar así:
ls -la
```

**Esperado:**
```
.
├── .git/
├── .gitignore
├── node_modules/
├── src/                  ✅ (código fuente)
├── dist/                 ✅ (build output)
├── index.html           ✅
├── vite.config.ts       ✅
├── tsconfig.json        ✅
├── package.json         ✅
├── CONSOLIDACION_VITE.md
├── GUIA_TRABAJO_POST_CONSOLIDACION.md
├── RESUMEN_CONSOLIDACION_FINAL.md
├── CLEANUP_INSTRUCTIONS.md  (este archivo)
└── ...otros archivos

❌ NO debe haber:
- apps/
- packages/
- pnpm-workspace.yaml
- turbo.json
```

### Paso 5: Verificar que todo funciona

```bash
# Limpiar cache de pnpm (opcional pero recomendado)
pnpm store prune

# Reinstalar dependencias
pnpm install

# Dev
pnpm dev
# → Debe funcionar en http://localhost:5173 ✅

# Build
pnpm build
# → Debe generar dist/ sin errores ✅
```

---

## 🔍 Archivos Importantes a Preservar

**NO ELIMINAR:**
- ✅ `.git/` - Historial de cambios
- ✅ `.gitignore` - Exclusiones de Git
- ✅ `.env` - Variables de entorno
- ✅ `src/` - **TODO el código fuente**
- ✅ `node_modules/` - Dependencias
- ✅ `pnpm-lock.yaml` - Lock file
- ✅ Documentación (*.md)

---

## 🚨 En Caso de Error

Si algo sale mal durante la eliminación:

### Opción 1: Recuperar desde Git
```bash
# Si NO has hecho push aún:
git reset --hard HEAD~1  # Revierte el último commit

# Si ya hiciste push:
git revert HEAD          # Crea un nuevo commit revirtiendo
```

### Opción 2: Restaurar desde backup
Si no usaste Git, deberías tener un backup anterior a la consolidación.

---

## 📊 Espacio en Disco Ganado

Después de la limpieza:

```
Antes de eliminación:
- apps/host/          ~50 MB
- apps/web-app/       ~200 MB
- packages/           ~10 MB
Total: ~260 MB

Después (solo /src):
- src/                ~2 MB
- node_modules/       ~800 MB (mismo que antes)

Diferencia: -258 MB en carpetas innecesarias
```

---

## ✅ Verificación Final

Ejecuta esto después de limpiar:

```bash
# 1. Verificar estructura
echo "=== Estructura ===" && ls -la | grep -E "^d" | awk '{print $9}'

# 2. Build
echo "=== Building ===" && pnpm build 2>&1 | tail -3

# 3. Dev (breve)
echo "=== Testing dev server ===" && timeout 5 pnpm dev 2>&1 | grep "ready\|ROLLDOWN"

# 4. Git status
echo "=== Git status ===" && git status
```

**Salida esperada:**
```
=== Estructura ===
src
dist
node_modules

=== Building ===
✓ built in 2.13s

=== Testing dev server ===
ROLLDOWN-VITE v7.2.5 ready in 716 ms

=== Git status ===
On branch main
Working tree clean
```

---

## 📝 Commit Final Recomendado

```bash
git commit -m "chore(cleanup): remove deprecated monorepo structure

Complete migration to unified Vite + React app in root.

Removed:
- apps/ directory (Next.js and old Vite setup)
- packages/ directory (unused shared packages)
- pnpm-workspace.yaml (monorepo config)
- turbo.json (turbo build config)

Now using:
- Single /src directory for all code
- Single package.json in root
- Vite 7.2.5 as build tool
- React 19.2.0

Build time: 2.13s
Bundle size: 732.54 kB (208.36 kB gzip)"
```

---

## 🎯 Checklist de Cleanup

- [ ] Backup del repositorio realizado
- [ ] Último commit hecho (`git status` limpio)
- [ ] Sin procesos Node corriendo
- [ ] Eliminar `apps/`
- [ ] Eliminar `packages/`
- [ ] Eliminar `pnpm-workspace.yaml`
- [ ] Eliminar `turbo.json`
- [ ] `pnpm install` ejecutado
- [ ] `pnpm dev` funciona ✅
- [ ] `pnpm build` funciona ✅
- [ ] Git commit realizado
- [ ] `git push` (opcional, si tienes permisos)

---

## 🎉 ¡Listo!

Una vez completado el cleanup:

```
EventConnect/
└── 🚀 Vite + React en raíz
    ├── 📁 /src (código limpio)
    ├── ⚡ Build 2.13s
    ├── 🎯 Sin herencia monorepo
    └── ✅ Listo para producción
```

---

**Última actualización**: 28 de Enero, 2026  
**Parte de**: Consolidación Vite  
**Status**: Manual (ejecutar cuando sea seguro)
