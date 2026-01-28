import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservaService } from '../services/reservaService';
import type { CreateReservaDto, UpdateReservaDto } from '@/types';

const QUERY_KEY = 'reservas';

export const useReservas = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: reservaService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useReserva = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => reservaService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReserva = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reserva: CreateReservaDto) => reservaService.create(reserva),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateReserva = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reserva: UpdateReservaDto) => reservaService.update(reserva),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteReserva = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => reservaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
