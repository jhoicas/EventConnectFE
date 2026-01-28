import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activoService } from '../services/activoService';
import type { CreateActivoDto, UpdateActivoDto } from '@/types';

const QUERY_KEY = 'activos';

// Hook para obtener todos los activos
export const useActivos = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: activoService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener un activo por ID
export const useActivo = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => activoService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener activo por código
export const useActivoByCodigo = (codigo: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'codigo', codigo],
    queryFn: () => activoService.getByCodigo(codigo),
    enabled: !!codigo,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener activos por estado
export const useActivosByEstado = (estado: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'estado', estado],
    queryFn: () => activoService.getByEstado(estado),
    enabled: !!estado,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear un activo
export const useCreateActivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activo: CreateActivoDto) => activoService.create(activo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

// Hook para actualizar un activo
export const useUpdateActivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activo: UpdateActivoDto) => activoService.update(activo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, data.id] });
    },
  });
};

// Hook para eliminar un activo
export const useDeleteActivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => activoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
