import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bodegaService } from '../services/bodegaService';
import type { CreateBodegaDto, UpdateBodegaDto } from '@/types';

const QUERY_KEY = 'bodegas';

export const useBodegas = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: bodegaService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useBodega = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => bodegaService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBodega = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bodega: CreateBodegaDto) => bodegaService.create(bodega),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateBodega = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bodega: UpdateBodegaDto) => bodegaService.update(bodega),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteBodega = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => bodegaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
