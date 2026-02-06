import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { danioService } from '../services/danioService';
import type { 
  Danio, 
  DanioRequest, 
  DanioEvaluacionRequest, 
  DanioRepararRequest,
  DanioRechazoRequest,
  DanioListResponse, 
  DanioFiltros, 
  DanioEstadisticas 
} from '../types';

export const useDanioList = (filtros: DanioFiltros, enabled = true) => {
  return useQuery<DanioListResponse>({
    queryKey: ['danios', 'lista', filtros],
    queryFn: () => danioService.filtrarDanios(filtros),
    staleTime: 30000,
    enabled,
  });
};

export const useDanioDetail = (id: number | null, enabled = true) => {
  return useQuery<Danio>({
    queryKey: ['danios', 'detalle', id],
    queryFn: () => danioService.obtenerDanio(id!),
    staleTime: 30000,
    enabled: enabled && !!id,
  });
};

export const useDanioEstadisticas = (enabled = true) => {
  return useQuery<DanioEstadisticas>({
    queryKey: ['danios', 'estadisticas'],
    queryFn: () => danioService.obtenerEstadisticas(),
    staleTime: 60000,
    enabled,
  });
};

export const useReportarDanio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DanioRequest) => danioService.reportarDanio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danios'] });
      queryClient.invalidateQueries({ queryKey: ['danios', 'estadisticas'] });
    },
  });
};

export const useEvaluarDanio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DanioEvaluacionRequest }) =>
      danioService.evaluarDanio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danios'] });
    },
  });
};

export const useConfirmarDanio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => danioService.confirmarDanio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danios'] });
    },
  });
};

export const useMarcarReparado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DanioRepararRequest }) =>
      danioService.marcarReparado(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danios'] });
    },
  });
};

export const useMarcarPerdidaTotal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => danioService.marcarPerdidaTotal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danios'] });
    },
  });
};

export const useRechazarDanio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DanioRechazoRequest }) =>
      danioService.rechazarDanio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danios'] });
    },
  });
};
