import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mantenimientoService } from '../services/mantenimientoService';

const QUERY_KEY = 'mantenimientos';

// Hook para obtener todos los mantenimientos
export const useMantenimientos = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: mantenimientoService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener un mantenimiento por ID
export const useMantenimiento = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => mantenimientoService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener mantenimientos por activo
export const useMantenimientosByActivo = (activoId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'activo', activoId],
    queryFn: () => mantenimientoService.getByActivo(activoId),
    enabled: !!activoId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener mantenimientos pendientes
export const useMantenimientosPendientes = () => {
  return useQuery({
    queryKey: [QUERY_KEY, 'pendientes'],
    queryFn: mantenimientoService.getPendientes,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener mantenimientos vencidos
export const useMantenimientosVencidos = () => {
  return useQuery({
    queryKey: [QUERY_KEY, 'vencidos'],
    queryFn: mantenimientoService.getVencidos,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear un mantenimiento
export const useCreateMantenimiento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mantenimientoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

// Hook para actualizar un mantenimiento
export const useUpdateMantenimiento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mantenimientoService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

// Hook para eliminar un mantenimiento
export const useDeleteMantenimiento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mantenimientoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
