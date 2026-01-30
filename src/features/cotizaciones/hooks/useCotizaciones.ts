import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cotizacionService } from '../services/cotizacionService';
import type { CreateCotizacionDto } from '@/types';

const QUERY_KEY = 'cotizaciones';

export const useCotizaciones = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: cotizacionService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCotizacion = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => cotizacionService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCotizacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cotizacion: CreateCotizacionDto) =>
      cotizacionService.create(cotizacion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateCotizacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...cotizacion
    }: {
      id: number;
      [key: string]: any;
    }) => cotizacionService.update(id, cotizacion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteCotizacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cotizacionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
