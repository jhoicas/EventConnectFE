import { axiosInstance } from '@/lib/axios';
import type { ContenidoLanding } from '@/types';

const BASE_URL = '/ContenidoLanding';

/**
 * Servicio para gestionar contenido del landing page
 */
const contenidoService = {
  /**
   * Obtiene todo el contenido del landing
   */
  async getAll(): Promise<ContenidoLanding[]> {
    try {
      const response = await axiosInstance.get<ContenidoLanding[]>(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener contenido del landing:', error);
      throw error;
    }
  },

  /**
   * Obtiene contenido por sección
   * @param seccion - Nombre de la sección (ej: 'hero', 'servicios', 'testimonios')
   */
  async getBySeccion(seccion: string): Promise<ContenidoLanding[]> {
    try {
      const response = await axiosInstance.get<ContenidoLanding[]>(
        `${BASE_URL}/seccion/${seccion}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener contenido de la sección ${seccion}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene solo el contenido activo (para mostrar en el landing público)
   */
  async getActivos(): Promise<ContenidoLanding[]> {
    try {
      const response = await axiosInstance.get<ContenidoLanding[]>(
        `${BASE_URL}/activos`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener contenido activo del landing:', error);
      throw error;
    }
  },

  /**
   * Crea nuevo contenido para el landing
   * @param data - Datos del contenido a crear
   */
  async create(data: any): Promise<ContenidoLanding> {
    try {
      const response = await axiosInstance.post<ContenidoLanding>(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear contenido del landing:', error);
      throw error;
    }
  },

  /**
   * Actualiza contenido existente
   * @param id - ID del contenido a actualizar
   * @param data - Datos actualizados
   */
  async update(id: number, data: any): Promise<ContenidoLanding> {
    try {
      const response = await axiosInstance.put<ContenidoLanding>(
        `${BASE_URL}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar contenido ${id} del landing:`, error);
      throw error;
    }
  },

  /**
   * Elimina contenido del landing
   * @param id - ID del contenido a eliminar
   */
  async delete(id: number): Promise<{ mensaje: string }> {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar contenido ${id} del landing:`, error);
      throw error;
    }
  },
};

export default contenidoService;
