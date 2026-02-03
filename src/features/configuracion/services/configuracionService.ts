import axios from '@/lib/axios';
import type { ConfiguracionSistema, CreateConfiguracionDto, UpdateConfiguracionDto } from '../types';

const BASE_URL = '/ConfiguracionSistema';

export const configuracionService = {
  getAll: async (): Promise<ConfiguracionSistema[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getGlobales: async (): Promise<ConfiguracionSistema[]> => {
    const { data } = await axios.get(`${BASE_URL}/globales`);
    return data;
  },

  getById: async (id: number): Promise<ConfiguracionSistema> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  getByClave: async (clave: string): Promise<ConfiguracionSistema> => {
    const { data } = await axios.get(`${BASE_URL}/clave/${clave}`);
    return data;
  },

  create: async (config: CreateConfiguracionDto): Promise<ConfiguracionSistema> => {
    const { data } = await axios.post(BASE_URL, config);
    return data;
  },

  update: async (id: number, config: UpdateConfiguracionDto): Promise<ConfiguracionSistema> => {
    const { data } = await axios.put(`${BASE_URL}/${id}`, config);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
