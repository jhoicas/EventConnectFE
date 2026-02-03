import { useQuery } from '@tanstack/react-query';
import { notificacionService } from '../services/notificacionService';

const QUERY_KEY = 'notificaciones';

export const useNotificacionesNoLeidas = () => {
  return useQuery({
    queryKey: [QUERY_KEY, 'no-leidas'],
    queryFn: notificacionService.getConversacionesNoLeidas,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Refetch cada 1 minuto
  });
};

export const useTotalNotificacionesNoLeidas = () => {
  return useQuery({
    queryKey: [QUERY_KEY, 'total'],
    queryFn: notificacionService.getTotalNoLeidas,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};
