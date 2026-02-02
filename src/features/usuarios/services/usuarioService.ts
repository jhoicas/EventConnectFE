import axios from '@/lib/axios';
import type { UsuarioApi } from '@/types';

const BASE_URL = '/Usuario';

export const usuarioService = {
  getAll: async (): Promise<UsuarioApi[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },
};
