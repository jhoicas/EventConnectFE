import axios from '@/lib/axios';
import type { Conversacion } from '@/types';

const BASE_URL = '/Conversaciones';

export const notificacionService = {
  getConversacionesNoLeidas: async (): Promise<Conversacion[]> => {
    const { data } = await axios.get(`${BASE_URL}?noLeidas=true`);
    return data;
  },

  getTotalNoLeidas: async (): Promise<number> => {
    try {
      const conversaciones = await notificacionService.getConversacionesNoLeidas();
      return conversaciones.reduce((total, conv) => total + (conv.no_Leidos || 0), 0);
    } catch {
      return 0;
    }
  },
};
