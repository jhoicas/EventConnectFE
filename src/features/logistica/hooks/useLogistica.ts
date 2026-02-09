import { useMutation, useQuery } from '@tanstack/react-query';
import logisticaService from '../services/logisticaService';
import type { EvidenciaEntrega, CompletarEntregaRequest } from '@/types';

/**
 * Hook para subir evidencia de entrega
 */
export const useSubirEvidencia = () => {
  return useMutation({
    mutationFn: (data: FormData) => logisticaService.subirEvidencia(data),
  });
};

/**
 * Hook para obtener evidencias de una reserva
 */
export const useEvidenciasPorReserva = (reservaId: number | undefined) => {
  return useQuery<EvidenciaEntrega[]>({
    queryKey: ['evidencias', reservaId],
    queryFn: () => logisticaService.getEvidenciasPorReserva(reservaId!),
    enabled: !!reservaId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

/**
 * Hook para completar entrega
 */
export const useCompletarEntrega = () => {
  return useMutation({
    mutationFn: ({
      reservaId,
      data,
    }: {
      reservaId: number;
      data: CompletarEntregaRequest;
    }) => logisticaService.completarEntrega(reservaId, data),
  });
};
