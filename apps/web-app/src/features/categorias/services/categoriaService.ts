import axiosInstance from '@/lib/axios';
import type { Categoria, CreateCategoriaDto, UpdateCategoriaDto } from '@/types';

const BASE_URL = '/categorias';

export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    const { data } = await axiosInstance.get<Categoria[]>(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const { data } = await axiosInstance.get<Categoria>(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (categoria: CreateCategoriaDto): Promise<Categoria> => {
    const { data } = await axiosInstance.post<Categoria>(BASE_URL, categoria);
    return data;
  },

  update: async (categoria: UpdateCategoriaDto): Promise<Categoria> => {
    const { data } = await axiosInstance.put<Categoria>(
      `${BASE_URL}/${categoria.id}`,
      categoria
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};

