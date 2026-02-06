import { useQuery } from '@tanstack/react-query';
import { auditoriaService } from '../services/auditoriaService';

export const useAuditoriaTimeline = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['auditoria', 'timeline', params],
    queryFn: () => auditoriaService.getTimeline(params),
    staleTime: 30 * 1000,
    retry: 1,
  });
};

export const useAuditoriaHistorial = (
  tabla: string,
  registroId: string | number,
  params?: Record<string, unknown>
) => {
  const enabled = Boolean(tabla && registroId);
  return useQuery({
    queryKey: ['auditoria', 'historial', tabla, registroId, params],
    queryFn: () => auditoriaService.getHistorial(tabla, registroId, params),
    staleTime: 30 * 1000,
    retry: 1,
    enabled,
  });
};

export const useAuditoriaBuscar = (params?: Record<string, unknown>, enabled = true) => {
  return useQuery({
    queryKey: ['auditoria', 'buscar', params],
    queryFn: () => auditoriaService.buscar(params),
    staleTime: 15 * 1000,
    retry: 1,
    enabled,
  });
};

export const useAuditoriaFiltrado = (params?: Record<string, unknown>, enabled = true) => {
  return useQuery({
    queryKey: ['auditoria', 'filtrado', params],
    queryFn: () => auditoriaService.filtrado(params),
    staleTime: 15 * 1000,
    retry: 1,
    enabled,
  });
};

export const useAuditoriaResumen = () => {
  return useQuery({
    queryKey: ['auditoria', 'resumen'],
    queryFn: () => auditoriaService.resumen(),
    staleTime: 60 * 1000,
    retry: 1,
  });
};
