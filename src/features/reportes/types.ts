// Tipos para el módulo de Reportes Avanzados

// Union types
export type TipoReporte = 'ventas' | 'inventario' | 'usuarios' | 'activos' | 'reservas' | 'auditoría' | 'personalizado';
export type EstadoReporte = 'borrador' | 'publicado' | 'archivado' | 'eliminado';
export type FormatoExportacion = 'pdf' | 'excel' | 'csv' | 'json' | 'html';
export type FrecuenciaProgramacion = 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
export type TipoGrafico = 'barras' | 'linea' | 'pastel' | 'area' | 'dispersion' | 'tabla';
export type TipoColumna = 'texto' | 'número' | 'moneda' | 'porcentaje' | 'fecha' | 'booleano';
export type DireccionOrdenamiento = 'asc' | 'desc';

// Interfaces
export interface Reporte {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoReporte;
  estado: EstadoReporte;
  plantillaId?: string;
  recursoBasePrincipal: string; // Tabla base (reservas, usuarios, etc)
  recursosAdicionales?: string[]; // Tablas relacionadas
  columnas: ColumnaReporte[];
  filtros: FiltroReporte[];
  agrupaciones?: string[]; // Campos para agrupar
  ordenamientos?: OrdenamientoReporte[];
  graficos?: ConfiguracionGrafico[];
  formatosPorDefecto: FormatoExportacion[];
  disenoPersonalizado?: {
    logo?: string;
    colores?: { primario: string; secundario: string };
    encabezado?: string;
    pie?: string;
    orientacion?: 'vertical' | 'horizontal';
  };
  programaciones?: ProgramacionReporte[];
  compartidoCon?: string[]; // Usuario IDs
  esPublico: boolean;
  estadisticas?: {
    totalDescargas: number;
    ultimaGeneracion?: Date;
    tiempoGeneracionMs?: number;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlantillaReporte {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoReporte;
  icono?: string;
  recursoBase: string;
  columnasDefault: ColumnaReporte[];
  filtrosDefault: FiltroReporte[];
  graficosDefault: ConfiguracionGrafico[];
  formatosRecomendados: FormatoExportacion[];
  estaEnUso: boolean;
  tiempoPromedioGeneracionMs?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColumnaReporte {
  id: string;
  nombre: string;
  campo: string; // nombre del campo en la base de datos
  tipo: TipoColumna;
  ancho?: number; // porcentaje o píxeles
  visible: boolean;
  alineacion?: 'izquierda' | 'centro' | 'derecha';
  formato?: {
    decimales?: number;
    prefijo?: string;
    sufijo?: string;
    formatoFecha?: string;
  };
  orden: number; // posición en la tabla
}

export interface FiltroReporte {
  id: string;
  nombre: string;
  campo: string;
  operador: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'between' | 'startsWith' | 'endsWith';
  valor: any;
  tipo: TipoColumna;
  dinamico: boolean; // El usuario puede cambiar el valor al descargar
  requerido: boolean;
}

export interface OrdenamientoReporte {
  campo: string;
  direccion: DireccionOrdenamiento;
  orden: number;
}

export interface ConfiguracionGrafico {
  id: string;
  nombre: string;
  tipo: TipoGrafico;
  campoX: string;
  campoY: string;
  campoColor?: string;
  visible: boolean;
  ancho?: number; // porcentaje
  alto?: number; // píxeles
  opciones?: {
    mostrarLeyenda: boolean;
    mostrarEtiquetas: boolean;
    mostrarGridLines: boolean;
    paleta?: string;
  };
}

export interface ProgramacionReporte {
  id: string;
  reporteId: string;
  nombre: string;
  frecuencia: FrecuenciaProgramacion;
  diaEjecucion?: number; // 1-31 para mensual, 1-7 para semanal
  horaEjecucion: string; // HH:MM
  horaZona: string; // Timezone
  formatosExportacion: FormatoExportacion[];
  destinatarios: {
    correos?: string[];
    usuarioIds?: string[];
  };
  ultimaEjecucion?: Date;
  proximaEjecucion?: Date;
  activa: boolean;
  notificacionesError: boolean;
  incluirGraficos: boolean;
}

export interface GeneracionReporte {
  id: string;
  reporteId: string;
  fechaGeneracion: Date;
  usuarioId: string;
  filtrosAplicados: FiltroReporte[];
  filas: any[];
  totalFilas: number;
  tiempoGeneracionMs: number;
  tamaNoArchivos?: {
    pdf?: number;
    excel?: number;
    csv?: number;
    json?: number;
  };
  archivoTemporal?: {
    clave: string;
    urlExpiracion: Date;
  };
}

export interface ExportacionReporte {
  id: string;
  generacionId: string;
  formato: FormatoExportacion;
  nombreArchivo: string;
  tamaño: number;
  url: string;
  urlExpiracionEn: Date;
  descargado: boolean;
  fechaDescarga?: Date;
  usuarioDescarga?: string;
  ipDescarga?: string;
}

export interface ResultadoReporte {
  id: string;
  reporteId: string;
  nombreReporte: string;
  tipoReporte: TipoReporte;
  fechaGeneracion: Date;
  totalRegistros: number;
  filtrosAplicados: Record<string, any>;
  datos: any[];
  graficos?: {
    tipo: TipoGrafico;
    datos: any;
  }[];
}

export interface FiltrosReportes {
  tipo?: TipoReporte;
  estado?: EstadoReporte;
  createdBy?: string;
  busqueda?: string;
  compartidoConmigo?: boolean;
  soloMisReportes?: boolean;
  pagina?: number;
  limite?: number;
  ordenar?: 'nombre' | 'createdAt' | 'ultimaGeneracion';
  direccion?: 'asc' | 'desc';
}

export interface EstadisticasReportes {
  totalReportes: number;
  reportesActivos: number;
  reportesProgramados: number;
  reportesPorTipo: Record<string, number>;
  plantillasDisponibles: number;
  generacionesTotales: number;
  descargasTotales: number;
  tiempoPromedioGeneracionMs: number;
  usuariosQueUsanReportes: number;
  formatoMasUsado: FormatoExportacion;
  tipoReporteMasPopular: TipoReporte;
}

export interface ConfiguracionReporte {
  id: string;
  reporteId: string;
  clave: string;
  valor: any;
  tipo: 'string' | 'number' | 'boolean' | 'json';
  descripcion?: string;
  requerida: boolean;
}

export interface HistorialReporte {
  id: string;
  reporteId: string;
  tipoOperacion: 'crear' | 'actualizar' | 'generar' | 'compartir' | 'exportar' | 'eliminar';
  fechaOperacion: Date;
  usuarioId: string;
  detalles?: Record<string, any>;
  cambiosAnteriores?: Record<string, any>;
  cambiosNuevos?: Record<string, any>;
}
