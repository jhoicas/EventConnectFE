// Business Intelligence Dashboard Types

// Union Types
export type TipoKPI = 'ventas' | 'ingresos' | 'usuarios' | 'conversiones' | 'rentabilidad' | 'crecimiento' | 'engagement' | 'retension';
export type PeriodoTiempo = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'anio' | 'personalizado';
export type TipoGrafico = 'linea' | 'barras' | 'pastel' | 'area' | 'dispersion' | 'tabla' | 'gauge' | 'mapa';
export type TendenciaValor = 'aumento' | 'disminucion' | 'estable';
export type TipoMetrica = 'numero' | 'porcentaje' | 'moneda' | 'tiempo' | 'razon';
export type EstadoDashboard = 'activo' | 'inactivo' | 'bloqueado';

// Interfaces
export interface KPI {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoKPI;
  icono: string;
  valor: number;
  valorAnterior?: number;
  unidad: string;
  formato: TipoMetrica;
  tendencia: TendenciaValor;
  porcentajeCambio: number;
  metaObjetivo?: number;
  progreso?: number;
  estaEnMeta: boolean;
  ultimaActualizacion: Date;
  historico: Array<{ fecha: Date; valor: number }>;
  meta?: number;
}

export interface Dashboard {
  id: string;
  nombre: string;
  descripcion: string;
  propietario: string;
  estado: EstadoDashboard;
  widgets: WidgetDashboard[];
  kpisDestacados: KPI[];
  periodo: PeriodoTiempo;
  fechaInicio?: Date;
  fechaFin?: Date;
  filtrosAplicados: FiltroDashboard[];
  compartidoCon: string[];
  permisoEdicion: string[];
  tema: 'claro' | 'oscuro' | 'personalizado';
  actualizacionAutomatica: boolean;
  intervaloActualizacion?: number;
  exportarPDF: boolean;
  exportarExcel: boolean;
  notificacionesHabilitadas: boolean;
  fechaCreacion: Date;
  ultimaModificacion: Date;
}

export interface WidgetDashboard {
  id: string;
  nombre: string;
  tipo: TipoGrafico;
  posicion: {
    fila: number;
    columna: number;
    ancho: number;
    alto: number;
  };
  kpisAsociados: string[];
  filtros: FiltroDashboard[];
  ordenamiento?: {
    campo: string;
    direccion: 'asc' | 'desc';
  };
  visible: boolean;
  orden: number;
  colores?: {
    primario: string;
    secundario: string;
  };
  configuracion: ConfiguracionWidget;
}

export interface ConfiguracionWidget {
  mostrarLeyenda: boolean;
  mostrarValores: boolean;
  mostrarLinea: boolean;
  mostrarArea: boolean;
  suavizado: boolean;
  escala: 'lineal' | 'logaritmica';
  comparativaAnioAnterior: boolean;
  metaVisible: boolean;
  decimales: number;
}

export interface FiltroDashboard {
  id: string;
  campo: string;
  operador: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contiene' | 'entre';
  valor: string | number | Date | string[];
  tipo: 'texto' | 'numero' | 'fecha' | 'multiselect';
}

export interface Metrica {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoMetrica;
  formula: string;
  valor: number;
  comparativaAnterior: number;
  tendencia: TendenciaValor;
  porcentajeCambio: number;
  unidad: string;
  fuente: string;
  ultimaActualizacion: Date;
}

export interface DatosGrafico {
  id: string;
  nombre: string;
  tipo: TipoGrafico;
  datos: Array<{
    etiqueta: string;
    valor: number;
    valor2?: number;
    meta?: number;
  }>;
  periodos: Array<{ fecha: Date; valor: number }>;
  series: Array<{
    nombre: string;
    datos: number[];
  }>;
  comparativa?: Array<{
    periodo: string;
    valor: number;
  }>;
}

export interface TendenciaMetrica {
  id: string;
  metrica: string;
  periodo: PeriodoTiempo;
  tendencia: TendenciaValor;
  porcentajeCambio: number;
  velocidadCambio: number;
  proyeccion?: number;
  confianza: number;
}

export interface SegmentacionDatos {
  id: string;
  nombre: string;
  tipo: 'categoria' | 'geografico' | 'demografico' | 'conductual';
  segmentos: Array<{
    nombre: string;
    valor: number;
    porcentaje: number;
    color?: string;
  }>;
  totalRegistros: number;
}

export interface ComparativaPerodos {
  id: string;
  periodoActual: {
    fecha: string;
    valor: number;
  };
  periodoAnterior: {
    fecha: string;
    valor: number;
  };
  diferencia: number;
  porcentajeDiferencia: number;
  tendencia: TendenciaValor;
}

export interface AlertaBI {
  id: string;
  nombre: string;
  tipo: 'umbral' | 'cambio_abrupto' | 'tendencia' | 'meta_incumplida';
  kpi: string;
  condicion: string;
  valor_umbral: number;
  activa: boolean;
  notificacionesHabilitadas: boolean;
  frecuencia: 'inmediata' | 'diaria' | 'semanal' | 'mensual';
  destinatarios: string[];
  fechaCreacion: Date;
}

export interface PronosticoBI {
  id: string;
  kpi: string;
  periodoFinal: Date;
  modelo: 'lineal' | 'exponencial' | 'polinomico' | 'media_movil';
  valores_predichos: Array<{ fecha: Date; valor: number; intervalo_confianza: { min: number; max: number } }>;
  precision: number;
  confianza: number;
  basadoEn: number;
}

export interface ExportacionBI {
  id: string;
  dashboardId: string;
  formato: 'pdf' | 'excel' | 'csv' | 'json';
  estado: 'pendiente' | 'procesando' | 'completado' | 'error';
  fechaSolicitud: Date;
  fechaCompletado?: Date;
  urlDescarga?: string;
  tamanio?: number;
  incluirDatos: boolean;
  incluirGraficos: boolean;
  incluirAnalisis: boolean;
  parametros?: string;
}

export interface ConfiguracionBI {
  id: string;
  habilitadoBI: boolean;
  actualizacionesAutomaticas: boolean;
  intervaloActualizacion: number;
  precisionNumeros: number;
  formatoMoneda: string;
  zonaTiempo: string;
  idioma: string;
  temaDefault: 'claro' | 'oscuro';
  notificacionesHabilitadas: boolean;
  almacenamientoHistorico: number;
  retencionDatos: number;
  frecuenciaLimpiezaDatos: 'diaria' | 'semanal' | 'mensual';
  fechaCreacion: Date;
  ultimaActualizacion: Date;
}

export interface EstadisticasBI {
  dashboardsCreados: number;
  dashboardsActivos: number;
  kpisTrackeados: number;
  usuariosConAcceso: number;
  exportacionesRealizadas: number;
  promedioCargaMs: number;
  disponibilidad: number;
  alertasActivadas: number;
  pronósticosActivos: number;
}

export interface FiltrosBI {
  periodos?: PeriodoTiempo[];
  tipos?: TipoKPI[];
  estados?: EstadoDashboard[];
  propietario?: string;
  compartidoConmigo?: boolean;
  busqueda?: string;
  pagina?: number;
  limite?: number;
  ordenar?: 'nombre' | 'fechaCreacion' | 'ultimaModificacion' | 'popularidad';
  direccion?: 'asc' | 'desc';
}

export interface ResponseBI<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
