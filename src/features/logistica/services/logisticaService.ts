import { axiosInstance } from '@/lib/axios';
import type { EvidenciaEntrega, CompletarEntregaRequest } from '@/types';

const BASE_URL = '/logistica';

/**
 * Servicio para gestionar la logística de entregas
 */
const logisticaService = {
  /**
   * Sube evidencia de entrega (foto con geolocalización)
   * @param data - FormData con archivo de foto, latitud y longitud
   */
  async subirEvidencia(data: FormData): Promise<EvidenciaEntrega> {
    try {
      const response = await axiosInstance.post<EvidenciaEntrega>(
        `${BASE_URL}/evidencia`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al subir evidencia de entrega:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las evidencias de entrega para una reserva
   * @param reservaId - ID de la reserva
   */
  async getEvidenciasPorReserva(reservaId: number): Promise<EvidenciaEntrega[]> {
    try {
      const response = await axiosInstance.get<EvidenciaEntrega[]>(
        `${BASE_URL}/evidencia/reserva/${reservaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener evidencias de entrega:', error);
      throw error;
    }
  },

  /**
   * Completa una entrega con evidencia y geolocalización
   * @param reservaId - ID de la reserva
   * @param data - Datos de completación de entrega
   */
  async completarEntrega(
    reservaId: number,
    data: CompletarEntregaRequest
  ): Promise<{ mensaje: string; entrega_Id: number }> {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/entrega/${reservaId}/completar`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error al completar entrega:', error);
      throw error;
    }
  },
};

export default logisticaService;
