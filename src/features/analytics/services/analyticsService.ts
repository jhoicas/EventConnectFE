import axios from '@/lib/axios';
import type {
  MetricasResumen,
  DatosVentas,
  DatosOcupacion,
  DatosTendenciasClientes,
  FiltrosAnalytics,
  ExportacionAnalytics,
} from '../types';

const API_BASE = '/api/analytics';

export const analyticsService = {
  // Obtener resumen de métricas
  obtenerResumen: async (filtros?: FiltrosAnalytics): Promise<MetricasResumen> => {
    const response = await axios.get(`${API_BASE}/resumen`, {
      params: filtros,
    });
    return response.data;
  },

  // Obtener datos de ventas
  obtenerVentas: async (filtros?: FiltrosAnalytics): Promise<DatosVentas> => {
    const response = await axios.get(`${API_BASE}/ventas`, {
      params: filtros,
    });
    return response.data;
  },

  // Obtener datos de ocupación
  obtenerOcupacion: async (filtros?: FiltrosAnalytics): Promise<DatosOcupacion> => {
    const response = await axios.get(`${API_BASE}/ocupacion`, {
      params: filtros,
    });
    return response.data;
  },

  // Obtener tendencias de clientes
  obtenerTendenciasClientes: async (filtros?: FiltrosAnalytics): Promise<DatosTendenciasClientes> => {
    const response = await axios.get(`${API_BASE}/clientes`, {
      params: filtros,
    });
    return response.data;
  },

  // Obtener comparativa periodo anterior
  obtenerComparativa: async (periodo: string): Promise<any> => {
    const response = await axios.get(`${API_BASE}/comparativa/${periodo}`);
    return response.data;
  },

  // Obtener top activos
  obtenerTopActivos: async (limite: number = 10): Promise<any> => {
    const response = await axios.get(`${API_BASE}/top-activos`, {
      params: { limite },
    });
    return response.data;
  },

  // Obtener top clientes
  obtenerTopClientes: async (limite: number = 10): Promise<any> => {
    const response = await axios.get(`${API_BASE}/top-clientes`, {
      params: { limite },
    });
    return response.data;
  },

  // Exportar reporte
  exportarReporte: async (config: ExportacionAnalytics): Promise<Blob> => {
    const response = await axios.post(`${API_BASE}/exportar`, config, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obtener datos históricos (últimos N periodos)
  obtenerHistorial: async (
    tipo: 'ventas' | 'ocupacion' | 'ingresos',
    periodos: number = 12
  ): Promise<any> => {
    const response = await axios.get(`${API_BASE}/historial/${tipo}`, {
      params: { periodos },
    });
    return response.data;
  },

  // Obtener forecast/predicciones
  obtenerForecast: async (tipo: 'ventas' | 'ocupacion', meses: number = 3): Promise<any> => {
    const response = await axios.get(`${API_BASE}/forecast/${tipo}`, {
      params: { meses },
    });
    return response.data;
  },

  // Obtener alertas y anomalías
  obtenerAnomalias: async (): Promise<any> => {
    const response = await axios.get(`${API_BASE}/anomalias`);
    return response.data;
  },
};
