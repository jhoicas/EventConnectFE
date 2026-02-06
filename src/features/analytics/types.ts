// Tipos para el módulo de Analytics

export type PeriodoAnalytics = 'hoy' | 'semana' | 'mes' | 'anio' | 'personalizado';

export interface MetricasResumen {
  total_reservas: number;
  total_ingresos: number;
  ocupacion_promedio: number;
  clientes_activos: number;
  tasa_crecimiento: number; // porcentaje
  reservas_pendientes: number;
  ocupacion_mes_anterior: number;
  ingresos_mes_anterior: number;
}

export interface DatoVenta {
  fecha: string;
  fecha_label: string;
  ingresos: number;
  reservas_completadas: number;
  reservas_canceladas: number;
  activos_rentados: number;
  ingresos_promedio_reserva: number;
}

export interface DatosVentas {
  periodo: PeriodoAnalytics;
  fecha_inicio: string;
  fecha_fin: string;
  datos: DatoVenta[];
  total_ingresos: number;
  total_reservas: number;
  ingresos_promedio_diario: number;
  reserva_promedio: number;
}

export interface DatoOcupacion {
  activo_id: number;
  activo_nombre: string;
  activo_sku: string;
  dias_rentados: number;
  dias_disponibles: number;
  tasa_ocupacion: number; // porcentaje
  ingresos_generados: number;
  reservas_totales: number;
  estado: 'Alto' | 'Medio' | 'Bajo';
}

export interface DatosOcupacion {
  periodo: PeriodoAnalytics;
  fecha_inicio: string;
  fecha_fin: string;
  activos: DatoOcupacion[];
  ocupacion_promedio: number;
  activo_mas_rentado: DatoOcupacion;
  activo_menos_rentado: DatoOcupacion;
  actividades_activas: number;
}

export interface TendenciaCliente {
  cliente_id: number;
  cliente_nombre: string;
  email: string;
  telefono: string;
  reservas_totales: number;
  valor_total_gastado: number;
  valor_promedio_por_reserva: number;
  tasa_devolucion: number; // porcentaje
  fecha_primera_reserva: string;
  fecha_ultima_reserva: string;
  dias_desde_ultima_reserva: number;
  estado_cliente: 'Activo' | 'Inactivo' | 'Nuevo';
  segmento: 'Premium' | 'Regular' | 'Ocasional';
}

export interface DatosTendenciasClientes {
  periodo: PeriodoAnalytics;
  fecha_inicio: string;
  fecha_fin: string;
  clientes: TendenciaCliente[];
  nuevo_clientes: number;
  clientes_activos: number;
  clientes_inactivos: number;
  valor_promedio_por_cliente: number;
  tasa_retencion: number; // porcentaje
  valor_lifetime: number; // valor promedio de por vida del cliente
  segmentacion: {
    premium: number;
    regular: number;
    ocasional: number;
  };
}

export interface MarcaOcupacion {
  fecha: string;
  ocupacion: number;
  capacidad_total: number;
  activos_en_uso: number;
}

export interface DatoAsistencia {
  activo_id: number;
  activo_nombre: string;
  semana: number;
  ingresos: number;
  reservas: number;
}

export interface FiltrosAnalytics {
  periodo: PeriodoAnalytics;
  fecha_inicio?: string; // YYYY-MM-DD
  fecha_fin?: string; // YYYY-MM-DD
  activo_id?: number;
  cliente_id?: number;
  estado?: string;
  tipo_activo?: string;
}

export interface ResumenAnalytics {
  metricas: MetricasResumen;
  graficos_disponibles: string[];
  fecha_generacion: string;
  periodo_analisis: string;
}

export interface AnalyticsResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ExportacionAnalytics {
  tipo: 'PDF' | 'Excel' | 'CSV';
  periodo: PeriodoAnalytics;
  fecha_inicio: string;
  fecha_fin: string;
  seccion: 'resumen' | 'ventas' | 'ocupacion' | 'clientes' | 'todas';
}
