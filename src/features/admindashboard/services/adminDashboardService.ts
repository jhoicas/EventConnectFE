import axios from '@/lib/axios';
import type {
  MetricasGenerales,
  DashboardCompleto,
  ReporteRentabilidad,
  TendenciasDashboard,
  KPI,
  TopActivo,
  TopCliente,
  EstadoReservaDistribucion,
  DistribucionGeografica,
  ComportamientoSegmento,
  RentabilidadCategoria,
  ResponseAdminDashboard,
} from '../types';

const API_BASE = '/api/dashboard';

export const adminDashboardService = {
  obtenerMetricas: async () => {
    return axios.get<ResponseAdminDashboard<MetricasGenerales>>(`${API_BASE}/metricas`);
  },
  obtenerDashboardCompleto: async () => {
    return axios.get<ResponseAdminDashboard<DashboardCompleto>>(`${API_BASE}/completo`);
  },
  obtenerRentabilidad: async (fechaInicio: string, fechaFin: string) => {
    return axios.get<ResponseAdminDashboard<ReporteRentabilidad>>(`${API_BASE}/rentabilidad`, {
      params: { fechaInicio, fechaFin },
    });
  },
  obtenerTendencias: async () => {
    return axios.get<ResponseAdminDashboard<TendenciasDashboard>>(`${API_BASE}/tendencias`);
  },
  obtenerKpis: async () => {
    return axios.get<ResponseAdminDashboard<KPI[]>>(`${API_BASE}/kpis`);
  },
  obtenerTopActivos: async (top = 10) => {
    return axios.get<ResponseAdminDashboard<TopActivo[]>>(`${API_BASE}/top-activos`, {
      params: { top },
    });
  },
  obtenerTopClientes: async (top = 10) => {
    return axios.get<ResponseAdminDashboard<TopCliente[]>>(`${API_BASE}/top-clientes`, {
      params: { top },
    });
  },
  obtenerEstados: async () => {
    return axios.get<ResponseAdminDashboard<EstadoReservaDistribucion[]>>(`${API_BASE}/estados`);
  },
  obtenerGeografica: async () => {
    return axios.get<ResponseAdminDashboard<DistribucionGeografica[]>>(`${API_BASE}/geografica`);
  },
  obtenerComportamientoClientes: async (segmento?: string) => {
    return axios.get<ResponseAdminDashboard<ComportamientoSegmento[]>>(
      `${API_BASE}/comportamiento-clientes`,
      {
        params: { segmento },
      }
    );
  },
  obtenerRentabilidadCategoria: async () => {
    return axios.get<ResponseAdminDashboard<RentabilidadCategoria[]>>(
      `${API_BASE}/rentabilidad-categoria`
    );
  },
};
