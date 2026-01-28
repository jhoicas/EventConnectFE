import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { reservaService } from '@/features/reservas/services/reservaService';
import type { Reserva } from '@/types';

const QUERY_KEY = 'reservas-cliente';

/**
 * Hook personalizado para obtener las reservas del cliente actual
 * Filtra automáticamente las reservas por el cliente_Id del usuario autenticado
 */
export const useReservasCliente = () => {
  const { user } = useAuthStore();

  return useQuery<Reserva[]>({
    queryKey: [QUERY_KEY, user?.id],
    queryFn: async () => {
      const reservas = await reservaService.getAll();
      // Filtrar solo las reservas del cliente actual
      return reservas.filter((reserva) => reserva.cliente_Id === user?.id);
    },
    enabled: !!user?.id, // Solo ejecutar si hay un usuario autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener las reservas de una empresa específica
 * Útil para el dashboard de la empresa donde solo deben ver sus propias reservas
 */
export const useReservasEmpresa = (empresaId?: number) => {
  return useQuery<Reserva[]>({
    queryKey: ['reservas-empresa', empresaId],
    queryFn: async () => {
      const reservas = await reservaService.getAll();
      // Filtrar solo las reservas de la empresa específica
      return reservas.filter((reserva) => reserva.empresa_Id === empresaId);
    },
    enabled: !!empresaId,
    staleTime: 5 * 60 * 1000,
  });
};
