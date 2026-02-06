import axios from '@/lib/axios';
import type {
  Resenia,
  CalificacionAgregada,
  FiltrosResenia,
  EstadisticasResenas,
  ModeracionResenia,
  RespuestaProcesoBatch,
  RespuestaResenia,
  ReportResenia,
} from '../types';

const BASE_URL = '/api/resenas';

export const reseniasService = {
  // CRUD Reseñas
  crearResenia: async (data: Partial<Resenia>): Promise<Resenia> => {
    const response = await axios.post<Resenia>(`${BASE_URL}`, data);
    return response.data;
  },

  obtenerResenia: async (id: string): Promise<Resenia> => {
    const response = await axios.get<Resenia>(`${BASE_URL}/${id}`);
    return response.data;
  },

  listarResenas: async (filtros?: FiltrosResenia): Promise<Resenia[]> => {
    const response = await axios.get<Resenia[]>(`${BASE_URL}`, { params: filtros });
    return response.data;
  },

  actualizarResenia: async (id: string, data: Partial<Resenia>): Promise<Resenia> => {
    const response = await axios.put<Resenia>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  eliminarResenia: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // Calificación agregada
  obtenerCalificacionAgregada: async (tipo: string, refId: string): Promise<CalificacionAgregada> => {
    const response = await axios.get<CalificacionAgregada>(`${BASE_URL}/agregada/${tipo}/${refId}`);
    return response.data;
  },

  obtenerCalificacionesAgregadas: async (tipo: string, refIds: string[]): Promise<CalificacionAgregada[]> => {
    const response = await axios.post<CalificacionAgregada[]>(`${BASE_URL}/agregada/batch`, { tipo, refIds });
    return response.data;
  },

  // Respuesta del proveedor
  crearRespuesta: async (resienaId: string, data: Partial<RespuestaResenia>): Promise<RespuestaResenia> => {
    const response = await axios.post<RespuestaResenia>(`${BASE_URL}/${resienaId}/respuesta`, data);
    return response.data;
  },

  actualizarRespuesta: async (resienaId: string, respuestaId: string, data: Partial<RespuestaResenia>): Promise<RespuestaResenia> => {
    const response = await axios.put<RespuestaResenia>(`${BASE_URL}/${resienaId}/respuesta/${respuestaId}`, data);
    return response.data;
  },

  eliminarRespuesta: async (resienaId: string, respuestaId: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${resienaId}/respuesta/${respuestaId}`);
  },

  // Moderación
  aprobarResenia: async (resienaId: string, moderadoPor: string): Promise<Resenia> => {
    const response = await axios.post<Resenia>(`${BASE_URL}/${resienaId}/aprobar`, { moderadoPor });
    return response.data;
  },

  rechazarResenia: async (data: ModeracionResenia): Promise<Resenia> => {
    const response = await axios.post<Resenia>(`${BASE_URL}/${data.resienaId}/rechazar`, data);
    return response.data;
  },

  moderarLote: async (resienaIds: string[], estado: 'aprobada' | 'rechazada', moderadoPor: string): Promise<RespuestaProcesoBatch> => {
    const response = await axios.post<RespuestaProcesoBatch>(`${BASE_URL}/moderar/lote`, {
      resienaIds,
      estado,
      moderadoPor,
    });
    return response.data;
  },

  // Me gusta / No me gusta
  marcarBeneficioso: async (resienaId: string, usuarioId: string): Promise<Resenia> => {
    const response = await axios.post<Resenia>(`${BASE_URL}/${resienaId}/beneficioso`, { usuarioId });
    return response.data;
  },

  desmarcarBeneficioso: async (resienaId: string, usuarioId: string): Promise<Resenia> => {
    const response = await axios.delete<Resenia>(`${BASE_URL}/${resienaId}/beneficioso/${usuarioId}`);
    return response.data;
  },

  marcarPerjudicial: async (resienaId: string, usuarioId: string): Promise<Resenia> => {
    const response = await axios.post<Resenia>(`${BASE_URL}/${resienaId}/perjudicial`, { usuarioId });
    return response.data;
  },

  desmarcarPerjudicial: async (resienaId: string, usuarioId: string): Promise<Resenia> => {
    const response = await axios.delete<Resenia>(`${BASE_URL}/${resienaId}/perjudicial/${usuarioId}`);
    return response.data;
  },

  // Reportar reseña
  reportarResenia: async (data: Partial<ReportResenia>): Promise<ReportResenia> => {
    const response = await axios.post<ReportResenia>(`${BASE_URL}/reportes`, data);
    return response.data;
  },

  obtenerReportes: async (estado?: string): Promise<ReportResenia[]> => {
    const response = await axios.get<ReportResenia[]>(`${BASE_URL}/reportes`, { params: { estado } });
    return response.data;
  },

  resolverReporte: async (reporteId: string, data: { accion: string; revisadoPor: string }): Promise<ReportResenia> => {
    const response = await axios.put<ReportResenia>(`${BASE_URL}/reportes/${reporteId}`, data);
    return response.data;
  },

  // Estadísticas
  obtenerEstadisticas: async (fechaInicio: string, fechaFin: string): Promise<EstadisticasResenas> => {
    const response = await axios.get<EstadisticasResenas>(`${BASE_URL}/estadisticas`, {
      params: { fechaInicio, fechaFin },
    });
    return response.data;
  },

  // Reportes de resenas por usuario
  obtenerReseniasCliente: async (clienteId: string): Promise<Resenia[]> => {
    const response = await axios.get<Resenia[]>(`${BASE_URL}/cliente/${clienteId}`);
    return response.data;
  },

  obtenerReseniasProveedor: async (proveedorId: string): Promise<Resenia[]> => {
    const response = await axios.get<Resenia[]>(`${BASE_URL}/proveedor/${proveedorId}`);
    return response.data;
  },
};
