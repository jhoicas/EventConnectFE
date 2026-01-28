import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '../services/clienteService';
import type { CreateClienteDto, UpdateClienteDto } from '@/types';

const QUERY_KEY = 'clientes';

export const useClientes = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: clienteService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCliente = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => clienteService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (cliente: CreateClienteDto) => clienteService.create(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (cliente: UpdateClienteDto) => clienteService.update(cliente),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
