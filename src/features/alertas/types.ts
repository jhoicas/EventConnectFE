export type TipoAlerta = 'Mantenimiento' | 'Depreciacion' | 'Vencimiento' | 'Garantia';
export type SeveridadAlerta = 'Critica' | 'Alta' | 'Media' | 'Baja';
export type EstadoAlerta = 'Pendiente' | 'Asignada' | 'En_Proceso' | 'Resuelta';

export interface Alerta {
  id: number;
  tipo: TipoAlerta;
  severidad: SeveridadAlerta;
  estado: EstadoAlerta;
  activoId: number;
  activo_nombre?: string;
  descripcion: string;
  fecha_vencimiento?: string;
  prioridad?: number; // 1-10
  usuario_creador: string;
  usuario_asignado?: string;
  usuarioAsignadoId?: number;
  fecha_creacion: string;
  fecha_asignacion?: string;
  fecha_inicio?: string;
  fecha_resolucion?: string;
  notas_resolucion?: string;
  historial: AlertaHistorial[];
}

export interface AlertaHistorial {
  id: number;
  estado: EstadoAlerta;
  fecha: string;
  usuario: string;
  notas?: string;
}

export interface AlertaFiltros {
  tipo?: TipoAlerta;
  severidad?: SeveridadAlerta;
  estado?: EstadoAlerta;
  activoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  pageSize?: number;
}

export interface AlertaListResponse {
  items: Alerta[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AlertaCreateRequest {
  tipo: TipoAlerta;
  severidad: SeveridadAlerta;
  activoId: number;
  descripcion: string;
  fecha_vencimiento?: string;
}

export interface AlertaAsignarRequest {
  usuarioAsignadoId: number;
  prioridad: number; // 1-10
}

export interface AlertaResolverRequest {
  notas_resolucion: string;
}

export interface AlertaCritica extends Alerta {
  dias_restantes?: number;
}

export interface AlertaEstadisticas {
  total: number;
  por_estado: Record<EstadoAlerta, number>;
  por_tipo: Record<TipoAlerta, number>;
  por_severidad: Record<SeveridadAlerta, number>;
  criticas_sin_resolver: number;
  promedio_tiempo_resolucion: number;
  urgentes_hoy: number;
}

export interface AlertaNotificacion {
  id: string;
  alertaId: number;
  tipo: TipoAlerta;
  severidad: SeveridadAlerta;
  activo_nombre: string;
  mensaje: string;
  timestamp: string;
  leida: boolean;
}
