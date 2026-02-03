import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configuracionService } from '../services/configuracionService';
import type { CreateConfiguracionDto, UpdateConfiguracionDto } from '../types';

export const useConfiguraciones = () => {
  return useQuery({
    queryKey: ['configuraciones'],
    queryFn: configuracionService.getAll,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useConfiguracionesGlobales = () => {
  return useQuery({
    queryKey: ['configuraciones', 'globales'],
    queryFn: configuracionService.getGlobales,
  });
};

export const useCreateConfiguracion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateConfiguracionDto) => configuracionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuraciones'] });
    },
  });
};

export const useUpdateConfiguracion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateConfiguracionDto }) => 
      configuracionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuraciones'] });
    },
  });
};

export const useDeleteConfiguracion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => configuracionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuraciones'] });
    },
  });
};
