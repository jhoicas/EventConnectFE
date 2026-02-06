import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertaService } from '../services/alertaService';
import type {
  AlertaFiltros,
  AlertaListResponse,
  AlertaCreateRequest,
  AlertaAsignarRequest,
  AlertaResolverRequest,
  AlertaCritica,
  AlertaEstadisticas,
} from '../types';

export const useAlertaList = (filtros: AlertaFiltros, enabled = true) => {
  return useQuery<AlertaListResponse>({
    queryKey: ['alertas', 'lista', filtros],
    queryFn: () => alertaService.filtrarAlertas(filtros),
    staleTime: 30000,
    enabled,
  });
};

export const useAlertaCriticas = (enabled = true) => {
  return useQuery<AlertaCritica[]>({
    queryKey: ['alertas', 'criticas'],
    queryFn: () => alertaService.obtenerCriticas(),
    staleTime: 20000,
    enabled,
  });
};

export const useAlertaEstadisticas = (enabled = true) => {
  return useQuery<AlertaEstadisticas>({
    queryKey: ['alertas', 'estadisticas'],
    queryFn: () => alertaService.obtenerEstadisticas(),
    staleTime: 60000,
    enabled,
  });
};

export const useCrearAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AlertaCreateRequest) => alertaService.crearAlerta(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas', 'estadisticas'] });
    },
  });
};

export const useAsignarAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AlertaAsignarRequest }) =>
      alertaService.asignarAlerta(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useIniciarAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => alertaService.iniciarAlerta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useResolverAlerta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AlertaResolverRequest }) =>
      alertaService.resolverAlerta(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas', 'estadisticas'] });
    },
  });
};

export const useGenerarAutomaticas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertaService.generarAutomaticas(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas', 'estadisticas'] });
    },
  });
};

export const useLimpiarResueltas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => alertaService.limpiarResueltas(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};
