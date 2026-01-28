import axiosInstance from '@/lib/axios';
import type { Mantenimiento, CreateMantenimientoDto, UpdateMantenimientoDto } from '@/types';

const BASE_URL = '/mantenimientos';

export const mantenimientoService = {
  // Obtener todos los mantenimientos
  getAll: async (): Promise<Mantenimiento[]> => {
    const { data } = await axiosInstance.get<Mantenimiento[]>(BASE_URL);
    return data;
  },

  // Obtener mantenimiento por ID
  getById: async (id: number): Promise<Mantenimiento> => {
    const { data } = await axiosInstance.get<Mantenimiento>(`${BASE_URL}/${id}`);
    return data;
  },

  // Obtener mantenimientos por activo
  getByActivo: async (activoId: number): Promise<Mantenimiento[]> => {
    const { data } = await axiosInstance.get<Mantenimiento[]>(`${BASE_URL}/activo/${activoId}`);
    return data;
  },

  // Obtener mantenimientos pendientes
  getPendientes: async (): Promise<Mantenimiento[]> => {
    const { data } = await axiosInstance.get<Mantenimiento[]>(`${BASE_URL}/pendientes`);
    return data;
  },

  // Obtener mantenimientos vencidos
  getVencidos: async (): Promise<Mantenimiento[]> => {
    const { data } = await axiosInstance.get<Mantenimiento[]>(`${BASE_URL}/vencidos`);
    return data;
  },

  // Crear nuevo mantenimiento
  create: async (mantenimiento: CreateMantenimientoDto): Promise<Mantenimiento> => {
    const { data } = await axiosInstance.post<Mantenimiento>(BASE_URL, mantenimiento);
    return data;
  },

  // Actualizar mantenimiento existente
  update: async (mantenimiento: UpdateMantenimientoDto): Promise<Mantenimiento> => {
    const { data } = await axiosInstance.put<Mantenimiento>(`${BASE_URL}/${mantenimiento.id}`, mantenimiento);
    return data;
  },

  // Eliminar mantenimiento
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
