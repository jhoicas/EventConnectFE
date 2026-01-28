import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loteService } from '../services/loteService';
import type { CreateLoteDto, UpdateLoteDto } from '@/types';

const QUERY_KEY = 'lotes';

export const useLotes = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: loteService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useLote = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => loteService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (lote: CreateLoteDto) => loteService.create(lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (lote: UpdateLoteDto) => loteService.update(lote),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteLote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => loteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
