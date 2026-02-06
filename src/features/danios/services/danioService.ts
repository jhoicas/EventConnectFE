import axios from '@/lib/axios';
import type { 
  Danio, 
  DanioRequest, 
  DanioEvaluacionRequest, 
  DanioRepararRequest,
  DanioRechazoRequest,
  DanioListResponse, 
  DanioFiltros, 
  DanioEstadisticas 
} from '../types';

const API_BASE = '/api/danio';

export const danioService = {
  // Registrar nuevo daño
  async reportarDanio(data: DanioRequest): Promise<Danio> {
    const response = await axios.post<Danio>(`${API_BASE}`, data);
    return response.data;
  },

  // Obtener detalles de daño
  async obtenerDanio(id: number): Promise<Danio> {
    const response = await axios.get<Danio>(`${API_BASE}/${id}`);
    return response.data;
  },

  // Filtrar daños
  async filtrarDanios(filtros: DanioFiltros): Promise<DanioListResponse> {
    const params = new URLSearchParams();
    
    if (filtros.reservaId) params.append('reservaId', filtros.reservaId.toString());
    if (filtros.activoId) params.append('activoId', filtros.activoId.toString());
    if (filtros.clienteId) params.append('clienteId', filtros.clienteId.toString());
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.pageSize) params.append('pageSize', filtros.pageSize.toString());

    const response = await axios.get<DanioListResponse>(
      `${API_BASE}/filtrar`,
      { params }
    );
    return response.data;
  },

  // Evaluar daño (solo Admin)
  async evaluarDanio(id: number, data: DanioEvaluacionRequest): Promise<Danio> {
    const response = await axios.put<Danio>(
      `${API_BASE}/${id}/evaluar`,
      data
    );
    return response.data;
  },

  // Confirmar daño (cambia activo a Mantenimiento)
  async confirmarDanio(id: number): Promise<Danio> {
    const response = await axios.put<Danio>(
      `${API_BASE}/${id}/confirmar`,
      {}
    );
    return response.data;
  },

  // Marcar como reparado
  async marcarReparado(id: number, data: DanioRepararRequest): Promise<Danio> {
    const response = await axios.put<Danio>(
      `${API_BASE}/${id}/reparar`,
      data
    );
    return response.data;
  },

  // Marcar como pérdida total
  async marcarPerdidaTotal(id: number): Promise<Danio> {
    const response = await axios.put<Danio>(
      `${API_BASE}/${id}/perdida-total`,
      {}
    );
    return response.data;
  },

  // Rechazar reporte
  async rechazarDanio(id: number, data: DanioRechazoRequest): Promise<Danio> {
    const response = await axios.put<Danio>(
      `${API_BASE}/${id}/rechazar`,
      data
    );
    return response.data;
  },

  // Obtener estadísticas
  async obtenerEstadisticas(): Promise<DanioEstadisticas> {
    const response = await axios.get<DanioEstadisticas>(`${API_BASE}/estadisticas`);
    return response.data;
  },
};
