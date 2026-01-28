import axiosInstance from '@/lib/axios';
import type { Activo, CreateActivoDto, UpdateActivoDto } from '@/types';

const BASE_URL = '/activos';

export const activoService = {
  // Obtener todos los activos
  getAll: async (): Promise<Activo[]> => {
    const { data } = await axiosInstance.get<Activo[]>(BASE_URL);
    return data;
  },

  // Obtener activo por ID
  getById: async (id: number): Promise<Activo> => {
    const { data } = await axiosInstance.get<Activo>(`${BASE_URL}/${id}`);
    return data;
  },

  // Obtener activo por código
  getByCodigo: async (codigo: string): Promise<Activo> => {
    const { data } = await axiosInstance.get<Activo>(`${BASE_URL}/codigo/${codigo}`);
    return data;
  },

  // Obtener activos por estado
  getByEstado: async (estado: string): Promise<Activo[]> => {
    const { data } = await axiosInstance.get<Activo[]>(`${BASE_URL}/estado/${estado}`);
    return data;
  },

  // Crear nuevo activo
  create: async (activo: CreateActivoDto): Promise<Activo> => {
    const { data } = await axiosInstance.post<Activo>(BASE_URL, activo);
    return data;
  },

  // Actualizar activo existente
  update: async (activo: UpdateActivoDto): Promise<Activo> => {
    const { data } = await axiosInstance.put<Activo>(`${BASE_URL}/${activo.id}`, activo);
    return data;
  },

  // Eliminar activo
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
