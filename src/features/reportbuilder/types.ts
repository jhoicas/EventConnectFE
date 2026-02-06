// Types for Custom Report Builder Module

// Union Types
export type ReportType = 'sales' | 'inventory' | 'performance' | 'financial' | 'customer' | 'operational' | 'custom';
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html' | 'powerpoint';
export type WidgetType = 'chart' | 'table' | 'metric' | 'gauge' | 'sparkline' | 'map' | 'text' | 'image';
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'waterfall' | 'funnel';
export type AggregationType = 'sum' | 'average' | 'count' | 'min' | 'max' | 'median' | 'percentile';
export type ScheduleFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type ReportStatus = 'draft' | 'published' | 'archived' | 'processing' | 'error';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';

// Report Definition
export interface Report {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: ReportType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  estado: ReportStatus;
  compartido: boolean;
  compartidoCon: string[];
  template?: string;
  tags: string[];
}

// Report Page/Section
export interface ReportPage {
  id: string;
  reportId: string;
  numero: number;
  titulo: string;
  descripcion: string;
  widgets: ReportWidget[];
  orientacion: 'portrait' | 'landscape';
  tamanoPagina: 'letter' | 'a4' | 'legal' | 'custom';
  margenes: {
    superior: number;
    inferior: number;
    izquierdo: number;
    derecho: number;
  };
}

// Report Widget
export interface ReportWidget {
  id: string;
  pageId: string;
  tipo: WidgetType;
  posicion: {
    x: number; // percentage
    y: number;
    ancho: number;
    alto: number;
  };
  titulo: string;
  configuracion: WidgetConfiguration;
  filtros?: ReportFilter[];
  orden?: number;
}

// Widget Configuration
export interface WidgetConfiguration {
  // Chart config
  tipoGrafico?: ChartType;
  ejeX?: string;
  ejeY?: string;
  seriesMultiples?: boolean;
  mostrarLeyenda?: boolean;
  mostrarValores?: boolean;
  colores?: string[];

  // Table config
  columnas?: {
    nombre: string;
    campo: string;
    ancho?: number;
    formateo?: string;
  }[];
  paginar?: boolean;
  filasPorPagina?: number;

  // Metric config
  metrica?: string;
  formato?: string;
  icono?: string;
  comparativaAnterior?: boolean;

  // Text config
  contenido?: string;
  fuente?: string;
  tamanio?: number;
  alineacion?: 'left' | 'center' | 'right';

  // Gauge config
  minimo?: number;
  maximo?: number;
  objetivo?: number;

  // General config
  mostrarTitulo?: boolean;
  mostrarBorde?: boolean;
  colorFondo?: string;
  actualizacionAutomatica?: boolean;
  intervaloActualizacion?: number;
}

// Report Filter
export interface ReportFilter {
  id: string;
  campo: string;
  operador: string;
  valor: any;
  tipo: string;
}

// Report Data Source
export interface ReportDataSource {
  id: string;
  reportId: string;
  nombre: string;
  tipo: 'tabla' | 'vista' | 'procedimiento' | 'api' | 'archivo';
  origen: string;
  campos: {
    nombre: string;
    tipo: string;
    etiqueta: string;
  }[];
  filtrosDefault?: ReportFilter[];
  cacheEnabled: boolean;
  cacheDuracion: number; // minutes
}

// Scheduled Report
export interface ScheduledReport {
  id: string;
  reportId: string;
  nombre: string;
  descripcion: string;
  frecuencia: ScheduleFrequency;
  horario: string; // HH:mm
  diasSemana?: number[]; // 0-6
  diaDelMes?: number;
  mesDelAno?: number;
  formatos: ReportFormat[];
  destinatarios: string[];
  habilitado: boolean;
  ultimaEjecucion?: string;
  proximaEjecucion: string;
  estadoUltimaEjecucion?: ExportStatus;
}

// Report Export
export interface ReportExport {
  id: string;
  reportId: string;
  scheduledReportId?: string;
  formato: ReportFormat;
  estado: ExportStatus;
  tamaniioArchivo?: number;
  urlDescarga?: string;
  fechaGeneracion: string;
  fechaExpiracion: string;
  usuarioSolicitante: string;
  parametros?: {
    desde?: string;
    hasta?: string;
    filtros?: ReportFilter[];
  };
}

// Report Parameter
export interface ReportParameter {
  id: string;
  reportId: string;
  nombre: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'booleano' | 'seleccion';
  requerido: boolean;
  valorDefault?: any;
  opciones?: {
    valor: any;
    etiqueta: string;
  }[];
  validacion?: {
    minimo?: any;
    maximo?: any;
    patron?: string;
  };
}

// Report Share
export interface ReportShare {
  id: string;
  reportId: string;
  usuarioId: string;
  email: string;
  permisos: ('ver' | 'editar' | 'compartir' | 'eliminar')[];
  fechaCompartida: string;
  mensaje?: string;
}

// Report Template
export interface ReportTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: ReportType;
  categoria: string;
  estructura: ReportPage[];
  parametrosDefault: ReportParameter[];
  popularidad: number;
  calificacion: number;
  previewUrl: string;
}

// Report Analytics
export interface ReportAnalytics {
  id: string;
  reportId: string;
  vistasTotal: number;
  descargas: number;
  comparticiones: number;
  usuariosUnicos: number;
  ultimaVista: string;
  tiempoPromedio: number; // seconds
  generacionesExitosas: number;
  generacionesFallidas: number;
  formatosMasUsados: Record<ReportFormat, number>;
}

// Report Preview
export interface ReportPreview {
  reportId: string;
  paginas: number;
  tiempoGeneracion: number;
  tamanioEstimado: number;
  previewUrl: string;
  paginasPreview: {
    numero: number;
    imagenUrl: string;
  }[];
}

// Report Validation
export interface ReportValidation {
  esValido: boolean;
  errores: {
    campo: string;
    mensaje: string;
  }[];
  advertencias: {
    campo: string;
    mensaje: string;
  }[];
}

// Bulk Report Export
export interface BulkReportExport {
  id: string;
  reportIds: string[];
  formato: ReportFormat;
  estado: ExportStatus;
  totalReportes: number;
  reportesCompletos: number;
  archivoZipUrl?: string;
  fechaGeneracion: string;
}

// Report Favorites
export interface ReportFavorite {
  id: string;
  usuarioId: string;
  reportId: string;
  fechaAnadido: string;
}

// Response Wrapper
export interface ResponseReportBuilder<T> {
  data: T;
  success: boolean;
  message: string;
  timestamp: string;
  metadata?: {
    processingTime: number;
    totalRecords?: number;
    pageSize?: number;
  };
}
