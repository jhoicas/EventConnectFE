import axios from '@/lib/axios';
import type { Factura, GenerarFacturaDto } from '../types';

const BASE_URL = '/Factura';

export const facturaService = {
  getAll: async (): Promise<Factura[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Factura> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  generarDesdeReserva: async (dto: GenerarFacturaDto): Promise<Factura> => {
    const { data } = await axios.post(`${BASE_URL}/generar-desde-reserva/${dto.reserva_Id}`);
    return data;
  },

  create: async (factura: Partial<Factura>): Promise<Factura> => {
    const { data } = await axios.post(BASE_URL, factura);
    return data;
  },
};
