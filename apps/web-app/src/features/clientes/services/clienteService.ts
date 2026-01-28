import axios from '@/lib/axios';
import type { Cliente, CreateClienteDto, UpdateClienteDto } from '@/types';

const BASE_URL = '/clientes';

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (cliente: CreateClienteDto): Promise<Cliente> => {
    const { data } = await axios.post(BASE_URL, cliente);
    return data;
  },

  update: async (cliente: UpdateClienteDto): Promise<Cliente> => {
    const { data } = await axios.put(`${BASE_URL}/${cliente.id}`, cliente);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
