export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'vencida';

export type TipoPricingDinamico = 'fijo' | 'porcentaje' | 'escala';

export interface ConfiguracionDinamica {
  id: string;
  activoId: string;
  tipo: TipoPricingDinamico;
  precioBase: number;
  precioMinimo?: number;
  precioMaximo?: number;
  reglasEscala?: ReglaEscala[];
  condiciones?: CondicionPrecio[];
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ReglaEscala {
  minReservas: number;
  maxReservas: number;
  descuento: number; // en porcentaje
  nombre: string;
}

export interface CondicionPrecio {
  tipo: 'ocupacion' | 'temporada' | 'proximidad' | 'cliente_tipo';
  valor: any;
  ajuste: number; // en porcentaje
  activo: boolean;
}

export interface ValidacionDisponibilidad {
  activoId: string;
  fechaInicio: string;
  fechaFin: string;
  disponible: boolean;
  ocupacionPorcentaje: number;
  diasDisponibles: string[];
  diasOcupados: string[];
  razonNoDisponibilidad?: string;
}

export interface OptimizacionPrecio {
  reservaId: string;
  precioOriginal: number;
  precioOptimizado: number;
  descuentoAplicado: number;
  razon: string;
  ahorro: number;
  factoresAplicados: string[];
}

export interface ReservaOptimizada {
  id: string;
  activoId: string;
  clienteId: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoReserva;
  precioBase: number;
  precioFinal: number;
  optimizacion?: OptimizacionPrecio;
  notas: string;
  contacto: string;
  telefono: string;
  email: string;
  diasReservados: number;
  ocupacionPromedio: number;
  rentabilidad: number; // ingresos / costo operativo
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface HistorialOptimizacion {
  id: string;
  reservaId: string;
  accion: 'precio_actualizado' | 'validacion_ejecutada' | 'bulto_procesado';
  precioAnterior?: number;
  precioNuevo?: number;
  usuario: string;
  timestamp: string;
  detalles: string;
}

export interface BultoReservas {
  id: string;
  nombre: string;
  descripcion: string;
  reservas: string[]; // IDs de reservas
  fechaCreacion: string;
  fechaProcesamiento?: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'error';
  resultados?: ResultadoBulto;
  usuarioCreador: string;
}

export interface ResultadoBulto {
  totalReservas: number;
  reservasExitosas: number;
  reservasFallidas: number;
  ahorroTotal: number;
  ingresosGenerados: number;
  errores: string[];
}

export interface FiltrosOptimizacion {
  estado?: EstadoReserva;
  activoId?: string;
  clienteId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  precioMinimo?: number;
  precioMaximo?: number;
  ordenarPor?: 'fecha' | 'precio' | 'rentabilidad' | 'ahorro';
  direccion?: 'asc' | 'desc';
}

export interface AnalisticasOptimizacion {
  periodoInicio: string;
  periodoFin: string;
  totalReservas: number;
  reservasOptimizadas: number;
  tasaOptimizacion: number; // porcentaje
  ahorroPromedioCliente: number;
  ingresosAdicionalesGenerados: number;
  ocupacionPromedio: number;
  rentabilidadPromedio: number;
  activosConMayorPotencial: string[];
  tendencias: TendenciaOptimizacion[];
}

export interface TendenciaOptimizacion {
  periodo: string;
  numOptimizaciones: number;
  ahorroPromedio: number;
  ocupacion: number;
}

export interface RespuestaOptimizacion {
  exito: boolean;
  mensaje: string;
  datos?: any;
  errores?: string[];
}
