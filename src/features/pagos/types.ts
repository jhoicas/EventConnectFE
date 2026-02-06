export type EstadoPago = 'pendiente' | 'procesando' | 'completado' | 'fallido' | 'reembolsado' | 'parcial';

export type MetodoPago = 'tarjeta' | 'transferencia' | 'paypal' | 'stripe' | 'efectivo';

export type EstadoFactura = 'borrador' | 'enviada' | 'pagada' | 'parcialmente_pagada' | 'vencida' | 'cancelada';

export interface ConfiguracionPago {
  id: string;
  proveedorId: string;
  metodoPago: MetodoPago;
  clave_api?: string;
  clave_secreta?: string;
  comercianteId?: string;
  activo: boolean;
  comision: number;
  limiteTransaccion?: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Transaccion {
  id: string;
  reservaId: string;
  clienteId: string;
  monto: number;
  moneda: string;
  estado: EstadoPago;
  metodoPago: MetodoPago;
  referenciaPago?: string;
  detalles: string;
  intentosFallidos: number;
  ultimoIntento?: string;
  comisionAplicada: number;
  montoNeto: number;
  descripcion: string;
  metadatos?: Record<string, any>;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaProcesamiento?: string;
}

export interface Factura {
  id: string;
  numero: string;
  reservaId: string;
  clienteId: string;
  proveedorId: string;
  estado: EstadoFactura;
  montoTotal: number;
  montoImpuestos: number;
  montoNeto: number;
  montoPagado: number;
  montoRestante: number;
  moneda: string;
  lineaItems: LineaFactura[];
  transacciones: string[]; // IDs de transacciones
  fechaEmision: string;
  fechaVencimiento: string;
  fechaPago?: string;
  notasInternas?: string;
  notasCliente?: string;
  pdf?: string; // URL del PDF
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface LineaFactura {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  impuesto: number;
  subtotal: number;
  concepto: string; // 'renta', 'servicio', 'descuento', 'otros'
}

export interface Reembolso {
  id: string;
  transaccionId: string;
  facturaId: string;
  reservaId: string;
  monto: number;
  razon: string;
  estado: 'pendiente' | 'aprobado' | 'procesado' | 'rechazado';
  metodoPago: MetodoPago;
  numeroSeguimiento?: string;
  solicitadoPor: string;
  fechaSolicitud: string;
  fechaProcesamiento?: string;
  detalles: string;
  fechaCreacion: string;
}

export interface HistorialPago {
  id: string;
  transaccionId: string;
  accion: 'creada' | 'procesada' | 'completada' | 'fallida' | 'reembolsada';
  estadoAnterior: EstadoPago;
  estadoNuevo: EstadoPago;
  detalles: string;
  usuario: string;
  timestamp: string;
}

export interface IntegracionGateway {
  id: string;
  tipo: 'stripe' | 'paypal' | 'otro';
  nombre: string;
  configurado: boolean;
  estadoPrueba: boolean;
  ultimaVerificacion?: string;
  apiKeyPublica?: string;
  comisionPorcentaje: number;
  comisionFija?: number;
  monedasSoportadas: string[];
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface FiltrosPagos {
  estado?: EstadoPago;
  metodoPago?: MetodoPago;
  clienteId?: string;
  reservaId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  ordenarPor?: 'fecha' | 'monto' | 'estado';
  direccion?: 'asc' | 'desc';
}

export interface FiltrosFacturas {
  estado?: EstadoFactura;
  clienteId?: string;
  proveedorId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  montoMinimo?: number;
  montoMaximo?: number;
  ordenarPor?: 'fecha' | 'monto' | 'estado';
  direccion?: 'asc' | 'desc';
}

export interface AnalyticasPagos {
  periodoInicio: string;
  periodoFin: string;
  totalTransacciones: number;
  transaccionesExitosas: number;
  tasaExito: number;
  montoTotal: number;
  montoComisiones: number;
  montoNeto: number;
  transaccionesPorMetodo: Record<MetodoPago, number>;
  transaccionesPorEstado: Record<EstadoPago, number>;
  ticketPromedio: number;
  transaccionesFallidas: number;
  reembolsosTotales: number;
  deudoresActivos: number;
  facturasPendientes: number;
}

export interface RespuestaPago {
  exito: boolean;
  mensaje: string;
  transaccionId?: string;
  datos?: any;
  errores?: string[];
}

export interface RespuestaFactura {
  exito: boolean;
  mensaje: string;
  facturaId?: string;
  numeroPDF?: string;
  datos?: any;
  errores?: string[];
}
