export type EstadoDanio = 
  | 'Reportado'
  | 'En_Evaluacion'
  | 'Confirmado'
  | 'En_Reparacion'
  | 'Reparado'
  | 'Perdida_Total'
  | 'Rechazado';

export type TipoDanio = 
  | 'Fisico'
  | 'Funcional'
  | 'Estetico'
  | 'Faltante'
  | 'Excedente';

export interface Danio {
  id: number;
  reservaId: number;
  activoId: number;
  descripcion: string;
  tipo: TipoDanio;
  estado: EstadoDanio;
  monto_estimado: number;
  monto_final: number | null;
  costo_reparacion: number | null;
  evidencia_url: string[];
  usuario_reporte: string;
  fecha_reporte: string;
  observaciones_evaluacion: string | null;
  motivo_rechazo: string | null;
  resolucion: string | null;
  clienteId: number | null;
  cliente_nombre?: string;
  activo_nombre?: string;
  reserva_numero?: string;
}

export interface DanioRequest {
  reservaId: number;
  activoId: number;
  descripcion: string;
  tipo: TipoDanio;
  monto_estimado: number;
  evidencia_url?: string[];
}

export interface DanioEvaluacionRequest {
  monto_final: number;
  observaciones_evaluacion: string;
}

export interface DanioRepararRequest {
  costo_reparacion: number;
  resolucion: string;
}

export interface DanioRechazoRequest {
  motivo_rechazo: string;
}

export interface DanioFiltros {
  reservaId?: number;
  activoId?: number;
  clienteId?: number;
  estado?: EstadoDanio;
  tipo?: TipoDanio;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  pageSize?: number;
}

export interface DanioListResponse {
  items: Danio[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DanioEstadisticas {
  total: number;
  por_estado: Record<EstadoDanio, number>;
  por_tipo: Record<TipoDanio, number>;
  monto_total_estimado: number;
  monto_total_reparacion: number;
  tasa_resolucion: number;
}

export interface TimelineEvent {
  estado: EstadoDanio;
  fecha: string;
  usuario: string;
  observaciones?: string;
}
