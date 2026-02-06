# Módulo de Gestión de Daños - Guía de Referencia

## Estructura del Módulo

```
src/features/danios/
├── types.ts                    # Tipos y interfaces
├── services/
│   └── danioService.ts         # Llamadas API
├── hooks/
│   ├── useDanio.ts            # React Query hooks
│   ├── useDanioAuthStore.ts   # Auth hook
│   └── index.ts               # Exportaciones
├── components/
│   ├── DanioForm.tsx          # Formulario de reporte
│   ├── DanioList.tsx          # Tabla con filtros
│   ├── DanioDetail.tsx        # Vista detallada
│   ├── DanioEvaluacion.tsx    # Evaluación (Admin)
│   ├── DanioEstadisticas.tsx  # Dashboard
│   └── index.ts               # Exportaciones
└── ...
src/pages/
└── Danios.tsx                  # Página principal
```

## Características Implementadas

### 1. Reportar Daño (DanioForm)
- Formulario con validación zod
- Upload de múltiples imágenes (máx 5)
- Campos: reservaId, activoId, descripcion, tipo, monto_estimado
- Tipos de daño: Físico, Funcional, Estético, Faltante, Excedente

### 2. Gestión de Daños (DanioList)
- Tabla con todas las órdenes de daño
- Filtros por: estado, tipo, reservaId, activoId
- Paginación (10 items por página)
- Vista detallada al seleccionar un daño

### 3. Vista Detallada (DanioDetail)
- Información completa del daño
- Galería de evidencias
- Timeline de estados
- Acciones según rol:
  - **Admin**: Evaluar, confirmar, reparar, marcar pérdida total, rechazar
  - **Operario**: Ver detalles

### 4. Evaluación (DanioEvaluacion)
- Modal para evaluación de daños
- Campos: monto_final, observaciones_evaluacion
- Solo accesible por Admins

### 5. Estadísticas (DanioEstadisticas)
- KPIs: Total, Monto estimado, Costo reparación, Tasa resolución
- Gráficos de barras y sectores
- Desglose por estado y tipo
- Solo accesible por Admins

## Estados del Daño

```
Reportado → En_Evaluacion → Confirmado → En_Reparacion → Reparado
                                     ↓
                              Perdida_Total
                                     ↓
                              Rechazado
```

## Endpoints API Consumidos

```
POST   /api/danio                    - Reportar nuevo daño
GET    /api/danio/{id}              - Obtener detalles
GET    /api/danio/filtrar           - Filtrar daños
PUT    /api/danio/{id}/evaluar      - Evaluar daño
PUT    /api/danio/{id}/confirmar    - Confirmar daño
PUT    /api/danio/{id}/reparar      - Marcar reparado
PUT    /api/danio/{id}/perdida-total - Marcar pérdida total
PUT    /api/danio/{id}/rechazar     - Rechazar reporte
GET    /api/danio/estadisticas      - Obtener estadísticas
```

## Integración en Menú

- **Admin-Proveedor**: Daños (con icono AlertOctagon)
- **SuperAdmin**: Daños (con icono AlertOctagon)
- **Operario**: Reportar Daño (con icono AlertOctagon)

## Rutas

- **Ruta principal**: `/danios`
- **Roles permitidos**: SuperAdmin, Admin-Proveedor, Operario

## Hooks Disponibles

```typescript
// Queries
useDanioList(filtros)           // Listar y filtrar daños
useDanioDetail(id)              // Detalles de un daño
useDanioEstadisticas()          // Estadísticas globales

// Mutations
useReportarDanio()              // Reportar nuevo daño
useEvaluarDanio()               // Evaluar daño
useConfirmarDanio()             // Confirmar daño
useMarcarReparado()             // Marcar como reparado
useMarcarPerdidaTotal()         // Marcar pérdida total
useRechazarDanio()              // Rechazar reporte
```

## Validaciones

### DanioForm
- reservaId: número > 0
- activoId: número > 0
- descripcion: mínimo 10 caracteres
- tipo: uno de [Fisico, Funcional, Estetico, Faltante, Excedente]
- monto_estimado: número >= 0

### DanioEvaluacion
- monto_final: número >= 0
- observaciones_evaluacion: texto no vacío

### DanioReparacion
- costo_reparacion: número >= 0
- resolucion: texto descriptivo

## Notas de Implementación

- Los gráficos usan barras de progreso CSS sin dependencias externas
- Las imágenes se almacenan como referencias URL (implementar upload real según necesidades)
- El módulo usa TanStack React Query v5 para manejo de estado server
- Tailwind CSS para estilos
- lucide-react para iconos
- react-hook-form + zod para validación de formularios

## Próximos Pasos

1. **Integrar upload real de imágenes**: Usar servicio de almacenamiento (S3, Cloudinary, etc.)
2. **WebSocket para notificaciones**: Alertas en tiempo real para cambios de estado
3. **Exportación de reportes**: Generar PDF con detalles del daño
4. **Notificaciones por email**: Alertar a clientes sobre estado de daño
5. **Pruebas unitarias**: Cobertura de componentes y hooks
