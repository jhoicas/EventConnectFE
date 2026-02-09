import { axiosInstance } from '@/lib/axios';
import type {
  CatalogoEstadoReserva,
  CatalogoEstadoActivo,
  CatalogoMetodoPago,
  CatalogoTipoMantenimiento,
} from '@/types';

const BASE_URL = '/Catalogo';

/**
 * Servicio para obtener catálogos del sistema
 */
const catalogoService = {
  /**
   * Obtiene los estados de reserva disponibles
   * @param soloActivos - Si es true, solo retorna estados activos
   */
  async getEstadosReserva(soloActivos: boolean = true): Promise<CatalogoEstadoReserva[]> {
    try {
      const response = await axiosInstance.get<CatalogoEstadoReserva[]>(
        `${BASE_URL}/estados-reserva`,
        {
          params: {
            soloActivos,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estados de reserva:', error);
      throw error;
    }
  },

  /**
   * Obtiene los estados de activos disponibles
   * @param soloActivos - Si es true, solo retorna estados activos
   */
  async getEstadosActivo(soloActivos: boolean = true): Promise<CatalogoEstadoActivo[]> {
    try {
      const response = await axiosInstance.get<CatalogoEstadoActivo[]>(
        `${BASE_URL}/estados-activo`,
        {
          params: {
            soloActivos,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estados de activo:', error);
      throw error;
    }
  },

  /**
   * Obtiene los métodos de pago disponibles
   * @param soloActivos - Si es true, solo retorna métodos activos
   */
  async getMetodosPago(soloActivos: boolean = true): Promise<CatalogoMetodoPago[]> {
    try {
      const response = await axiosInstance.get<CatalogoMetodoPago[]>(
        `${BASE_URL}/metodos-pago`,
        {
          params: {
            soloActivos,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  },

  /**
   * Obtiene los tipos de mantenimiento disponibles
   * @param soloActivos - Si es true, solo retorna tipos activos
   */
  async getTiposMantenimiento(soloActivos: boolean = true): Promise<CatalogoTipoMantenimiento[]> {
    try {
      const response = await axiosInstance.get<CatalogoTipoMantenimiento[]>(
        `${BASE_URL}/tipos-mantenimiento`,
        {
          params: {
            soloActivos,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de mantenimiento:', error);
      throw error;
    }
  },
};

export default catalogoService;
