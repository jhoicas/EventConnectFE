# Página de Mis Reservas - Cliente

## 📋 Descripción

Página completa para que los clientes gestionen sus reservas de eventos. Incluye visualización de reservas existentes, creación de nuevas reservas con un proceso guiado por pasos (stepper), y filtros avanzados.

## ✨ Características

### 1. **Empty State Elegante**
- Diseño visual atractivo cuando no hay reservas
- Botones de acción para crear primera reserva o explorar servicios
- Proceso ilustrado en 3 pasos

### 2. **Listado de Reservas**
- Cards responsive con toda la información relevante
- Badges de estado con colores semánticos:
  - 🟡 Pendiente (outline)
  - 🟢 Confirmada (default)
  - 🔵 En Proceso (secondary)
  - ✅ Completada (default)
  - 🔴 Cancelada (destructive)
- Estados de pago diferenciados
- Información de fianza y devolución
- Cálculo automático de totales con descuentos

### 3. **Modal de Nueva Reserva con Stepper**

#### Paso 1: Datos del Evento
- Fecha y hora del evento
- Dirección completa de entrega
- Ciudad
- Contacto en sitio (nombre y teléfono)

#### Paso 2: Productos y Servicios
- Selección de productos (preparado para futura integración)
- Subtotal y descuentos
- Cálculo automático del total
- Campo de observaciones

#### Paso 3: Pago
- Método de pago (Efectivo, Transferencia, Tarjeta, PSE, Otro)
- Estado del pago
- Resumen visual de la reserva
- Confirmación final

### 4. **Filtros y Búsqueda**
- Búsqueda por código de reserva, dirección o ciudad
- Filtro por estado (Todas, Pendiente, Confirmada, etc.)
- Resultados en tiempo real

## 🗂️ Archivos Creados

```
apps/web-app/src/
├── pages/cliente/
│   ├── Reservas.tsx                          # Página principal
│   └── components/
│       ├── ReservaCard.tsx                   # Card individual de reserva
│       ├── EmptyStateReservas.tsx            # Estado vacío
│       └── NuevaReservaModal.tsx             # Modal con stepper
├── features/reservas/hooks/
│   └── useReservasCliente.ts                 # Hook personalizado
└── components/ui/
    └── badge.tsx                              # Componente Badge de Shadcn
```

## 🔧 Hooks Personalizados

### `useReservasCliente()`
Filtra automáticamente las reservas del cliente autenticado.

```typescript
const { data: reservas, isLoading } = useReservasCliente();
```

### `useReservasEmpresa(empresaId)`
Para el dashboard de empresas - filtra reservas por empresa_Id.

```typescript
const { data: reservas } = useReservasEmpresa(empresaId);
```

## 🎨 Componentes UI

### ReservaCard
Props:
- `reserva`: Objeto Reserva con todos los datos
- `onClick?`: Callback al hacer clic (para mostrar detalles)

### EmptyStateReservas
Props:
- `onCreateReserva`: Callback para abrir modal de nueva reserva

### NuevaReservaModal
Props:
- `open`: Estado de apertura del modal
- `onOpenChange`: Callback para cambiar estado
- `onSuccess?`: Callback ejecutado tras crear exitosamente

## 🔐 Seguridad

- Las reservas se filtran automáticamente por `cliente_Id` del usuario autenticado
- Validación completa con Zod en todos los formularios
- Estados de carga para prevenir múltiples envíos

## 🚀 Próximas Mejoras

1. **Integración de Carrito de Compras**
   - Agregar productos de diferentes empresas
   - Ver detalles de cada producto en la reserva
   - Calcular automáticamente subtotales por empresa

2. **Detalles de Reserva**
   - Modal/página con información completa
   - Timeline de estados
   - Documentos adjuntos

3. **Filtros Avanzados**
   - Por rango de fechas
   - Por método de pago
   - Por rango de precios

4. **Exportación**
   - PDF con resumen de reserva
   - Comprobante de pago

## 📱 Responsive

Diseño 100% responsive:
- Mobile: Cards en 1 columna
- Tablet/Desktop: Grid de 2 columnas
- Filtros adaptables (stack en móvil, inline en desktop)

## 🎯 Uso

```typescript
import ClienteReservasPage from '@/pages/cliente/Reservas';

// En las rutas
<Route path="/cliente/reservas" element={<ClienteReservasPage />} />
```

## 🌐 Navegación

Accesible desde:
- Menu lateral: Cliente > Mis Reservas
- URL: `/cliente/reservas`
- Desde "Explorar Servicios" tras seleccionar productos

---

**Desarrollado con:**
- ⚡ Vite 6.0 + Rolldown
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS + Shadcn/UI
- 🔄 TanStack Query v5
- 📝 React Hook Form + Zod
