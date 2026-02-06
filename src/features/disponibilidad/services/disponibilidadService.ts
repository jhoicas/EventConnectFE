import axios from '@/lib/axios';
import type {
  DisponibilidadRango,
  CrearDisponibilidadRequest,
  ActualizarDisponibilidadRequest,
  VerificacionDisponibilidad,
  DisponibilidadPorActivo,
  DisponibilidadListResponse,
  CalendarioData,
} from '../types';

const API_BASE = '/api/disponibilidad';

export const disponibilidadService = {
  // Obtener disponibilidad para un rango de fechas y activo
  obtenerRango: async (
    activoId: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<DisponibilidadRango> => {
    const response = await axios.get(`${API_BASE}/range`, {
      params: {
        activo_Id: activoId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      },
    });
    return response.data;
  },

  // Obtener disponibilidad de un día específico
  obtenerDia: async (activoId: number, fecha: string): Promise<any> => {
    const response = await axios.get(`${API_BASE}/${activoId}/${fecha}`);
    return response.data;
  },

  // Obtener disponibilidad por activo (próximos 30 días)
  obtenerPorActivo: async (activoId: number): Promise<DisponibilidadPorActivo> => {
    const response = await axios.get(`${API_BASE}/activo/${activoId}`);
    return response.data;
  },

  // Obtener calendario para visualización (mes/año)
  obtenerCalendario: async (activoId: number, mes: number, anio: number): Promise<CalendarioData> => {
    const response = await axios.get(`${API_BASE}/calendario/${activoId}`, {
      params: { mes, anio },
    });
    return response.data;
  },

  // Verificar disponibilidad antes de reservar
  verificar: async (
    activoId: number,
    fechaInicio: string,
    fechaFin: string,
    cantidad: number
  ): Promise<VerificacionDisponibilidad> => {
    const response = await axios.post(`${API_BASE}/verificar`, {
      activo_Id: activoId,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      cantidad_requerida: cantidad,
    });
    return response.data;
  },

  // Crear nueva disponibilidad
  crear: async (data: CrearDisponibilidadRequest): Promise<any> => {
    const response = await axios.post(`${API_BASE}/crear`, data);
    return response.data;
  },

  // Actualizar disponibilidad
  actualizar: async (activoId: number, fecha: string, data: ActualizarDisponibilidadRequest): Promise<any> => {
    const response = await axios.put(`${API_BASE}/${activoId}/${fecha}`, data);
    return response.data;
  },

  // Eliminar disponibilidad
  eliminar: async (activoId: number, fecha: string): Promise<any> => {
    const response = await axios.delete(`${API_BASE}/${activoId}/${fecha}`);
    return response.data;
  },

  // Obtener lista de disponibilidades con paginación
  listar: async (page: number = 1, pageSize: number = 50): Promise<DisponibilidadListResponse> => {
    const response = await axios.get(`${API_BASE}/lista`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  // Obtener disponibilidades por estado
  listarPorEstado: async (estado: string, page: number = 1, pageSize: number = 50): Promise<DisponibilidadListResponse> => {
    const response = await axios.get(`${API_BASE}/estado/${estado}`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  // Obtener historial de cambios de disponibilidad
  obtenerHistorial: async (activoId: number): Promise<any> => {
    const response = await axios.get(`${API_BASE}/historial/${activoId}`);
    return response.data;
  },
};
