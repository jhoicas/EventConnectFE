import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facturaService } from '../services/facturaService';
import type { GenerarFacturaDto } from '../types';

export const useFacturas = () => {
  return useQuery({
    queryKey: ['facturas'],
    queryFn: facturaService.getAll,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useFacturaById = (id: number) => {
  return useQuery({
    queryKey: ['facturas', id],
    queryFn: () => facturaService.getById(id),
    enabled: !!id,
  });
};

export const useGenerarFactura = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: GenerarFacturaDto) => facturaService.generarDesdeReserva(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });
};
