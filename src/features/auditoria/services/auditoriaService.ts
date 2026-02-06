import axiosInstance from '@/lib/axios';
import type { AuditoriaEvento, AuditoriaListResponse, AuditoriaResumen } from '../types';

const normalizeList = (data: any): AuditoriaListResponse => {
  const items: AuditoriaEvento[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.result)
          ? data.result
          : [];

  const total = data?.total ?? data?.count ?? items.length;
  const page = data?.page ?? data?.pagina ?? 1;
  const pageSize = data?.pageSize ?? data?.page_size ?? items.length;

  return { items, total, page, pageSize };
};

const normalizeResumen = (data: any): AuditoriaResumen => {
  if (!data || typeof data !== 'object') {
    return { total: 0, porAccion: {}, porTabla: {}, ultimos: [] };
  }

  return {
    total: data.total ?? data.Total ?? 0,
    porAccion: data.porAccion ?? data.por_accion ?? data.PorAccion ?? {},
    porTabla: data.porTabla ?? data.por_tabla ?? data.PorTabla ?? {},
    ultimos: data.ultimos ?? data.Ultimos ?? data.items ?? [],
  };
};

export const auditoriaService = {
  getTimeline: async (params?: Record<string, unknown>): Promise<AuditoriaListResponse> => {
    const response = await axiosInstance.get('/auditoria/timeline', { params });
    return normalizeList(response.data);
  },

  getHistorial: async (
    tabla: string,
    registroId: string | number,
    params?: Record<string, unknown>
  ): Promise<AuditoriaListResponse> => {
    const response = await axiosInstance.get(`/auditoria/historial/${tabla}/${registroId}`, { params });
    return normalizeList(response.data);
  },

  buscar: async (params?: Record<string, unknown>): Promise<AuditoriaListResponse> => {
    const response = await axiosInstance.get('/auditoria/buscar', { params });
    return normalizeList(response.data);
  },

  filtrado: async (params?: Record<string, unknown>): Promise<AuditoriaListResponse> => {
    const response = await axiosInstance.get('/auditoria/filtrado', { params });
    return normalizeList(response.data);
  },

  resumen: async (): Promise<AuditoriaResumen> => {
    const response = await axiosInstance.get('/auditoria/resumen');
    return normalizeResumen(response.data);
  },
};
