import axios from '@/lib/axios';
import type {
  Notificacion,
  PlantillaNotificacion,
  ConfiguracionNotificaciones,
  LogNotificacion,
  EstadisticasNotificaciones,
  FiltrosNotificaciones,
  NotificacionMasiva,
  RespuestaEnvio,
  RespuestaMasiva,
} from '../types';

const BASE_URL = '/api/notificaciones';

// Notificaciones individuales
export const notificacionesService = {
  // CRUD Notificaciones
  crearNotificacion: async (data: Partial<Notificacion>): Promise<RespuestaEnvio> => {
    const response = await axios.post<RespuestaEnvio>(`${BASE_URL}`, data);
    return response.data;
  },

  obtenerNotificacion: async (id: string): Promise<Notificacion> => {
    const response = await axios.get<Notificacion>(`${BASE_URL}/${id}`);
    return response.data;
  },

  listarNotificaciones: async (filtros?: FiltrosNotificaciones): Promise<Notificacion[]> => {
    const response = await axios.get<Notificacion[]>(`${BASE_URL}`, { params: filtros });
    return response.data;
  },

  actualizarNotificacion: async (id: string, data: Partial<Notificacion>): Promise<Notificacion> => {
    const response = await axios.put<Notificacion>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  eliminarNotificacion: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  reintentarNotificacion: async (id: string): Promise<RespuestaEnvio> => {
    const response = await axios.post<RespuestaEnvio>(`${BASE_URL}/${id}/reintentar`);
    return response.data;
  },

  // Envío masivo
  enviarMasivo: async (data: NotificacionMasiva): Promise<RespuestaMasiva> => {
    const response = await axios.post<RespuestaMasiva>(`${BASE_URL}/masivo`, data);
    return response.data;
  },

  // Plantillas
  crearPlantilla: async (data: Partial<PlantillaNotificacion>): Promise<PlantillaNotificacion> => {
    const response = await axios.post<PlantillaNotificacion>(`${BASE_URL}/plantillas`, data);
    return response.data;
  },

  obtenerPlantilla: async (id: string): Promise<PlantillaNotificacion> => {
    const response = await axios.get<PlantillaNotificacion>(`${BASE_URL}/plantillas/${id}`);
    return response.data;
  },

  listarPlantillas: async (tipo?: string): Promise<PlantillaNotificacion[]> => {
    const response = await axios.get<PlantillaNotificacion[]>(`${BASE_URL}/plantillas`, {
      params: { tipo },
    });
    return response.data;
  },

  actualizarPlantilla: async (id: string, data: Partial<PlantillaNotificacion>): Promise<PlantillaNotificacion> => {
    const response = await axios.put<PlantillaNotificacion>(`${BASE_URL}/plantillas/${id}`, data);
    return response.data;
  },

  eliminarPlantilla: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/plantillas/${id}`);
  },

  previsualizarPlantilla: async (plantillaId: string, variables: Record<string, string>): Promise<{ asunto?: string; mensaje: string }> => {
    const response = await axios.post<{ asunto?: string; mensaje: string }>(`${BASE_URL}/plantillas/${plantillaId}/preview`, { variables });
    return response.data;
  },

  // Configuración
  obtenerConfiguracion: async (): Promise<ConfiguracionNotificaciones> => {
    const response = await axios.get<ConfiguracionNotificaciones>(`${BASE_URL}/configuracion`);
    return response.data;
  },

  actualizarConfiguracion: async (data: Partial<ConfiguracionNotificaciones>): Promise<ConfiguracionNotificaciones> => {
    const response = await axios.put<ConfiguracionNotificaciones>(`${BASE_URL}/configuracion`, data);
    return response.data;
  },

  probarConexion: async (provider: string, tipo: 'email' | 'sms'): Promise<{ exito: boolean; mensaje: string }> => {
    const response = await axios.post<{ exito: boolean; mensaje: string }>(`${BASE_URL}/configuracion/probar`, { provider, tipo });
    return response.data;
  },

  // Logs y estadísticas
  obtenerLogs: async (notificacionId: string): Promise<LogNotificacion[]> => {
    const response = await axios.get<LogNotificacion[]>(`${BASE_URL}/${notificacionId}/logs`);
    return response.data;
  },

  obtenerEstadisticas: async (fechaInicio: string, fechaFin: string): Promise<EstadisticasNotificaciones> => {
    const response = await axios.get<EstadisticasNotificaciones>(`${BASE_URL}/estadisticas`, {
      params: { fechaInicio, fechaFin },
    });
    return response.data;
  },
};
