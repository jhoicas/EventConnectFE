import axios from '@/lib/axios';
import type {
  Dashboard,
  KPI,
  DatosGrafico,
  Metrica,
  TendenciaMetrica,
  SegmentacionDatos,
  AlertaBI,
  PronosticoBI,
  ExportacionBI,
  ConfiguracionBI,
  EstadisticasBI,
  FiltrosBI,
  ResponseBI,
} from '../types';

const API_BASE = '/api/business-intelligence';

export const businessIntelligenceService = {
  // ==================== DASHBOARDS ====================

  listarDashboards: async (filtros: FiltrosBI = {}) => {
    return axios.get<ResponseBI<{ dashboards: Dashboard[]; total: number }>>(
      `${API_BASE}/dashboards`,
      { params: filtros }
    );
  },

  obtenerDashboard: async (dashboardId: string) => {
    return axios.get<ResponseBI<Dashboard>>(`${API_BASE}/dashboards/${dashboardId}`);
  },

  crearDashboard: async (datos: Partial<Dashboard>) => {
    return axios.post<ResponseBI<Dashboard>>(`${API_BASE}/dashboards`, datos);
  },

  actualizarDashboard: async (dashboardId: string, datos: Partial<Dashboard>) => {
    return axios.put<ResponseBI<Dashboard>>(`${API_BASE}/dashboards/${dashboardId}`, datos);
  },

  eliminarDashboard: async (dashboardId: string) => {
    return axios.delete<ResponseBI<{ mensaje: string }>>(`${API_BASE}/dashboards/${dashboardId}`);
  },

  duplicarDashboard: async (dashboardId: string, nombre: string) => {
    return axios.post<ResponseBI<Dashboard>>(`${API_BASE}/dashboards/${dashboardId}/duplicar`, {
      nombre,
    });
  },

  compartirDashboard: async (dashboardId: string, usuariosIds: string[], permiso: 'lectura' | 'edicion') => {
    return axios.post<ResponseBI<Dashboard>>(`${API_BASE}/dashboards/${dashboardId}/compartir`, {
      usuariosIds,
      permiso,
    });
  },

  revocarAcceso: async (dashboardId: string, usuarioId: string) => {
    return axios.post<ResponseBI<{ mensaje: string }>>(`${API_BASE}/dashboards/${dashboardId}/revocar/${usuarioId}`);
  },

  obtenerDashboardsCompartidos: async () => {
    return axios.get<ResponseBI<{ dashboards: Dashboard[] }>>(`${API_BASE}/dashboards/compartidos`);
  },

  // ==================== KPIs ====================

  listarKPIs: async (filtros?: FiltrosBI) => {
    return axios.get<ResponseBI<{ kpis: KPI[]; total: number }>>(`${API_BASE}/kpis`, {
      params: filtros,
    });
  },

  obtenerKPI: async (kpiId: string) => {
    return axios.get<ResponseBI<KPI>>(`${API_BASE}/kpis/${kpiId}`);
  },

  crearKPI: async (datos: Partial<KPI>) => {
    return axios.post<ResponseBI<KPI>>(`${API_BASE}/kpis`, datos);
  },

  actualizarKPI: async (kpiId: string, datos: Partial<KPI>) => {
    return axios.put<ResponseBI<KPI>>(`${API_BASE}/kpis/${kpiId}`, datos);
  },

  eliminarKPI: async (kpiId: string) => {
    return axios.delete<ResponseBI<{ mensaje: string }>>(`${API_BASE}/kpis/${kpiId}`);
  },

  obtenerHistoricoKPI: async (kpiId: string, periodo: string) => {
    return axios.get<ResponseBI<{ historico: Array<{ fecha: Date; valor: number }> }>>(
      `${API_BASE}/kpis/${kpiId}/historico`,
      { params: { periodo } }
    );
  },

  // ==================== METRICAS ====================

  listarMetricas: async () => {
    return axios.get<ResponseBI<{ metricas: Metrica[] }>>(`${API_BASE}/metricas`);
  },

  obtenerMetrica: async (metricaId: string) => {
    return axios.get<ResponseBI<Metrica>>(`${API_BASE}/metricas/${metricaId}`);
  },

  calcularMetrica: async (formula: string, parametros?: Record<string, any>) => {
    return axios.post<ResponseBI<{ valor: number; formula: string }>>(
      `${API_BASE}/metricas/calcular`,
      { formula, parametros }
    );
  },

  // ==================== GRAFICOS ====================

  obtenerDatosGrafico: async (widgetId: string, filtros?: Record<string, any>) => {
    return axios.get<ResponseBI<DatosGrafico>>(`${API_BASE}/graficos/${widgetId}`, {
      params: filtros,
    });
  },

  obtenerComparativaPerodos: async (kpiId: string, periodo1: string, periodo2: string) => {
    return axios.get<ResponseBI<any>>(`${API_BASE}/graficos/comparativa`, {
      params: { kpiId, periodo1, periodo2 },
    });
  },

  obtenerSegmentacion: async (kpiId: string, tipoSegmento: string) => {
    return axios.get<ResponseBI<SegmentacionDatos>>(`${API_BASE}/graficos/segmentacion`, {
      params: { kpiId, tipoSegmento },
    });
  },

  // ==================== TENDENCIAS ====================

  obtenerTendencias: async (kpiId: string, periodo: string) => {
    return axios.get<ResponseBI<TendenciaMetrica>>(`${API_BASE}/tendencias/${kpiId}`, {
      params: { periodo },
    });
  },

  obtenerTendenciasMultiples: async (kpisIds: string[], periodo: string) => {
    return axios.get<ResponseBI<{ tendencias: TendenciaMetrica[] }>>(`${API_BASE}/tendencias/multiple`, {
      params: { kpisIds: kpisIds.join(','), periodo },
    });
  },

  detectarAnomalias: async (kpiId: string) => {
    return axios.get<ResponseBI<{ anomalias: Array<{ fecha: Date; valor: number; desvio: number }> }>>(
      `${API_BASE}/tendencias/${kpiId}/anomalias`
    );
  },

  // ==================== ALERTAS ====================

  listarAlertas: async () => {
    return axios.get<ResponseBI<{ alertas: AlertaBI[] }>>(`${API_BASE}/alertas`);
  },

  obtenerAlerta: async (alertaId: string) => {
    return axios.get<ResponseBI<AlertaBI>>(`${API_BASE}/alertas/${alertaId}`);
  },

  crearAlerta: async (datos: Partial<AlertaBI>) => {
    return axios.post<ResponseBI<AlertaBI>>(`${API_BASE}/alertas`, datos);
  },

  actualizarAlerta: async (alertaId: string, datos: Partial<AlertaBI>) => {
    return axios.put<ResponseBI<AlertaBI>>(`${API_BASE}/alertas/${alertaId}`, datos);
  },

  eliminarAlerta: async (alertaId: string) => {
    return axios.delete<ResponseBI<{ mensaje: string }>>(`${API_BASE}/alertas/${alertaId}`);
  },

  activarAlerta: async (alertaId: string) => {
    return axios.patch<ResponseBI<AlertaBI>>(`${API_BASE}/alertas/${alertaId}/activar`);
  },

  desactivarAlerta: async (alertaId: string) => {
    return axios.patch<ResponseBI<AlertaBI>>(`${API_BASE}/alertas/${alertaId}/desactivar`);
  },

  // ==================== PRONOSTICOS ====================

  listarPronosticos: async () => {
    return axios.get<ResponseBI<{ pronosticos: PronosticoBI[] }>>(`${API_BASE}/pronosticos`);
  },

  obtenerPronostico: async (pronosticoId: string) => {
    return axios.get<ResponseBI<PronosticoBI>>(`${API_BASE}/pronosticos/${pronosticoId}`);
  },

  crearPronostico: async (kpiId: string, modelo: string, periodoFinal: Date) => {
    return axios.post<ResponseBI<PronosticoBI>>(`${API_BASE}/pronosticos`, {
      kpiId,
      modelo,
      periodoFinal,
    });
  },

  actualizarPronostico: async (pronosticoId: string, datos: Partial<PronosticoBI>) => {
    return axios.put<ResponseBI<PronosticoBI>>(`${API_BASE}/pronosticos/${pronosticoId}`, datos);
  },

  eliminarPronostico: async (pronosticoId: string) => {
    return axios.delete<ResponseBI<{ mensaje: string }>>(`${API_BASE}/pronosticos/${pronosticoId}`);
  },

  generarPronostico: async (kpiId: string, periodoFinal: Date) => {
    return axios.post<ResponseBI<PronosticoBI>>(`${API_BASE}/pronosticos/generar`, {
      kpiId,
      periodoFinal,
    });
  },

  // ==================== EXPORTACIONES ====================

  listarExportaciones: async () => {
    return axios.get<ResponseBI<{ exportaciones: ExportacionBI[] }>>(`${API_BASE}/exportaciones`);
  },

  obtenerExportacion: async (exportacionId: string) => {
    return axios.get<ResponseBI<ExportacionBI>>(`${API_BASE}/exportaciones/${exportacionId}`);
  },

  crearExportacion: async (dashboardId: string, formato: string, opciones?: Record<string, any>) => {
    return axios.post<ResponseBI<ExportacionBI>>(`${API_BASE}/exportaciones`, {
      dashboardId,
      formato,
      opciones,
    });
  },

  programarExportacion: async (dashboardId: string, formato: string, frecuencia: string, destinatarios: string[]) => {
    return axios.post<ResponseBI<{ id: string; mensaje: string }>>(`${API_BASE}/exportaciones/programar`, {
      dashboardId,
      formato,
      frecuencia,
      destinatarios,
    });
  },

  descargarExportacion: async (exportacionId: string) => {
    return axios.get<Blob>(`${API_BASE}/exportaciones/${exportacionId}/descargar`, {
      responseType: 'blob',
    });
  },

  cancelarExportacion: async (exportacionId: string) => {
    return axios.delete<ResponseBI<{ mensaje: string }>>(`${API_BASE}/exportaciones/${exportacionId}`);
  },

  // ==================== CONFIGURACION ====================

  obtenerConfiguracion: async () => {
    return axios.get<ResponseBI<ConfiguracionBI>>(`${API_BASE}/configuracion`);
  },

  actualizarConfiguracion: async (datos: Partial<ConfiguracionBI>) => {
    return axios.put<ResponseBI<ConfiguracionBI>>(`${API_BASE}/configuracion`, datos);
  },

  // ==================== ESTADISTICAS ====================

  obtenerEstadisticas: async () => {
    return axios.get<ResponseBI<EstadisticasBI>>(`${API_BASE}/estadisticas`);
  },

  obtenerEstadisticasUso: async (periodo: string) => {
    return axios.get<ResponseBI<any>>(`${API_BASE}/estadisticas/uso`, {
      params: { periodo },
    });
  },

  obtenerRendimiento: async () => {
    return axios.get<ResponseBI<{ promedioCargaMs: number; disponibilidad: number }>>(
      `${API_BASE}/estadisticas/rendimiento`
    );
  },

  // ==================== UTILIDADES ====================

  validarFormula: async (formula: string) => {
    return axios.post<ResponseBI<{ valida: boolean; error?: string }>>(`${API_BASE}/utilidades/validar-formula`, {
      formula,
    });
  },

  sincronizarDatos: async () => {
    return axios.post<ResponseBI<{ mensaje: string; registrosSincronizados: number }>>(
      `${API_BASE}/utilidades/sincronizar`
    );
  },

  limpiarCache: async () => {
    return axios.post<ResponseBI<{ mensaje: string }>>(`${API_BASE}/utilidades/limpiar-cache`);
  },

  obtenerResumenEjecutivo: async (periodo: string) => {
    return axios.get<ResponseBI<any>>(`${API_BASE}/utilidades/resumen-ejecutivo`, {
      params: { periodo },
    });
  },

  generarReporteBI: async (dashboardId: string, opciones: Record<string, any>) => {
    return axios.post<ResponseBI<{ reporteId: string; urlDescarga: string }>>(
      `${API_BASE}/utilidades/generar-reporte`,
      { dashboardId, opciones }
    );
  },
};

export default businessIntelligenceService;
