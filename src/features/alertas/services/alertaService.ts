import axios from '@/lib/axios';
import type {
  Alerta,
  AlertaFiltros,
  AlertaListResponse,
  AlertaCreateRequest,
  AlertaAsignarRequest,
  AlertaResolverRequest,
  AlertaCritica,
  AlertaEstadisticas,
} from '../types';

const API_BASE = '/api/alerta';

export const alertaService = {
  // Filtrar alertas
  async filtrarAlertas(filtros: AlertaFiltros): Promise<AlertaListResponse> {
    const params = new URLSearchParams();

    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.severidad) params.append('severidad', filtros.severidad);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.activoId) params.append('activoId', filtros.activoId.toString());
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.pageSize) params.append('pageSize', filtros.pageSize.toString());

    const response = await axios.get<AlertaListResponse>(
      `${API_BASE}/filtrar`,
      { params }
    );
    return response.data;
  },

  // Obtener alertas críticas
  async obtenerCriticas(): Promise<AlertaCritica[]> {
    const response = await axios.get<AlertaCritica[]>(`${API_BASE}/criticas`);
    return response.data;
  },

  // Crear alerta manual
  async crearAlerta(data: AlertaCreateRequest): Promise<Alerta> {
    const response = await axios.post<Alerta>(`${API_BASE}`, data);
    return response.data;
  },

  // Asignar alerta a operario
  async asignarAlerta(id: number, data: AlertaAsignarRequest): Promise<Alerta> {
    const response = await axios.put<Alerta>(
      `${API_BASE}/${id}/asignar`,
      data
    );
    return response.data;
  },

  // Marcar en proceso
  async iniciarAlerta(id: number): Promise<Alerta> {
    const response = await axios.put<Alerta>(
      `${API_BASE}/${id}/iniciar`,
      {}
    );
    return response.data;
  },

  // Resolver alerta
  async resolverAlerta(id: number, data: AlertaResolverRequest): Promise<Alerta> {
    const response = await axios.put<Alerta>(
      `${API_BASE}/${id}/resolver`,
      data
    );
    return response.data;
  },

  // Generar alertas automáticas (Admin only)
  async generarAutomaticas(): Promise<{ creadas: number; actualizadas: number }> {
    const response = await axios.post<{ creadas: number; actualizadas: number }>(
      `${API_BASE}/generar-automaticas`,
      {}
    );
    return response.data;
  },

  // Limpiar alertas resueltas >90 días (SuperAdmin only)
  async limpiarResueltas(): Promise<{ eliminadas: number }> {
    const response = await axios.delete<{ eliminadas: number }>(
      `${API_BASE}/limpiar-resueltas`
    );
    return response.data;
  },

  // Obtener estadísticas
  async obtenerEstadisticas(): Promise<AlertaEstadisticas> {
    const response = await axios.get<AlertaEstadisticas>(`${API_BASE}/estadisticas`);
    return response.data;
  },
};
