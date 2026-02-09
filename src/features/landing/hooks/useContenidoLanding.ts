import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import contenidoService from '../services/contenidoService';
import type { ContenidoLanding } from '@/types';

/**
 * Hook para obtener todo el contenido del landing
 */
export const useContenidoLanding = () => {
  return useQuery<ContenidoLanding[]>({
    queryKey: ['contenidoLanding'],
    queryFn: () => contenidoService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener contenido por sección
 */
export const useContenidoPorSeccion = (seccion: string | undefined) => {
  return useQuery<ContenidoLanding[]>({
    queryKey: ['contenidoLanding', seccion],
    queryFn: () => contenidoService.getBySeccion(seccion!),
    enabled: !!seccion,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener contenido activo (para landing público)
 */
export const useContenidoActivoLanding = () => {
  return useQuery<ContenidoLanding[]>({
    queryKey: ['contenidoLandingActivo'],
    queryFn: () => contenidoService.getActivos(),
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 45 * 60 * 1000, // 45 minutos
  });
};

/**
 * Hook para crear contenido del landing
 */
export const useCrearContenidoLanding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => contenidoService.create(data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['contenidoLanding'] });
      queryClient.invalidateQueries({ queryKey: ['contenidoLandingActivo'] });
    },
  });
};

/**
 * Hook para actualizar contenido del landing
 */
export const useActualizarContenidoLanding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      contenidoService.update(id, data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['contenidoLanding'] });
      queryClient.invalidateQueries({ queryKey: ['contenidoLandingActivo'] });
    },
  });
};

/**
 * Hook para eliminar contenido del landing
 */
export const useEliminarContenidoLanding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contenidoService.delete(id),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['contenidoLanding'] });
      queryClient.invalidateQueries({ queryKey: ['contenidoLandingActivo'] });
    },
  });
};
