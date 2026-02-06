export type EstadoReserva = 'Pendiente' | 'Confirmada' | 'En_Entrega' | 'Finalizada' | 'Cancelada';
export type TipoEstado = 'Creada' | 'Confirmada' | 'Entregada' | 'Recogida' | 'Cancelada' | 'Completada';
export type EstadoPago = 'Pendiente' | 'Procesando' | 'Pagado' | 'Rechazado' | 'Reembolsado';
export type EstadoCotizacion = 'Solicitada' | 'Respondida' | 'Aceptada' | 'Rechazada' | 'Expirada';

export interface Activo {
  id: number;
  nombre: string;
  descripcion: string;
  precio_diario: number;
  imagen_url?: string;
  especificaciones?: string;
}

export interface ReservaDetalle {
  activoId: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  activo?: Activo;
}

export interface HistorialEstado {
  id: number;
  estado: TipoEstado;
  fecha: string;
  descripcion?: string;
  usuario?: string;
}

export interface Reserva {
  id: number;
  clienteId: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoReserva;
  direccion_entrega: string;
  detalles: ReservaDetalle[];
  total: number;
  saldo_pendiente: number;
  fecha_creacion: string;
  fecha_confirmacion?: string;
  notas?: string;
  historial: HistorialEstado[];
}

export interface SeguimientoReserva {
  id: number;
  reservaId: number;
  estado: EstadoReserva;
  logistica: {
    estado: string;
    ubicacion?: string;
    fecha_estimada_entrega?: string;
    fecha_entrega_real?: string;
    transportista?: string;
    numero_seguimiento?: string;
  };
  pagos: {
    total: number;
    pagado: number;
    pendiente: number;
    detalles: PagoDetalle[];
  };
  historial: HistorialEstado[];
}

export interface PagoDetalle {
  id: number;
  fecha: string;
  monto: number;
  estado: EstadoPago;
  metodo?: string;
  referencia?: string;
}

export interface CrearReservaRequest {
  fecha_inicio: string;
  fecha_fin: string;
  direccion_entrega: string;
  detalles: ReservaDetalle[];
  notas?: string;
}

export interface VerificacionDisponibilidad {
  activoId: number;
  fecha_inicio: string;
  fecha_fin: string;
  cantidad: number;
  disponible: boolean;
  cantidad_disponible: number;
  precio_total?: number;
}

export interface Cotizacion {
  id: number;
  clienteId: number;
  estado: EstadoCotizacion;
  detalles: ReservaDetalle[];
  total: number;
  fecha_solicitud: string;
  fecha_respuesta?: string;
  fecha_expiracion?: string;
  notas?: string;
  validez_dias?: number;
}

export interface SolicitudCotizacion {
  fecha_inicio: string;
  fecha_fin: string;
  detalles: ReservaDetalle[];
  notas?: string;
}

export interface EstadisticasCliente {
  total_reservas: number;
  reservas_activas: number;
  total_gastado: number;
  promedio_gasto: number;
  activo_mas_usado?: string;
  fecha_ultimo_alquiler?: string;
  tasa_satisfaccion?: number;
  puntos_lealtad?: number;
}

export interface HistorialPago {
  id: number;
  reservaId: number;
  monto: number;
  estado: EstadoPago;
  fecha: string;
  metodo_pago: string;
  referencia: string;
  comprobante_url?: string;
}

export interface ReservaListResponse {
  items: Reserva[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CotizacionListResponse {
  items: Cotizacion[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PagoListResponse {
  items: HistorialPago[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FiltrosReserva {
  estado?: EstadoReserva;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  pageSize?: number;
}

export interface FiltrosPago {
  estado?: EstadoPago;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  pageSize?: number;
}
