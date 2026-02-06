import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificacionesService } from '../services/notificacionesService';
import type {
  Notificacion,
  PlantillaNotificacion,
  ConfiguracionNotificaciones,
  FiltrosNotificaciones,
  NotificacionMasiva,
} from '../types';

const QUERY_KEYS = {
  notificaciones: (filtros?: FiltrosNotificaciones) => ['notificaciones', 'lista', filtros],
  notificacion: (id: string) => ['notificaciones', 'detalle', id],
  plantillas: (tipo?: string) => ['notificaciones', 'plantillas', tipo],
  plantilla: (id: string) => ['notificaciones', 'plantilla', id],
  configuracion: () => ['notificaciones', 'configuracion'],
  logs: (notificacionId: string) => ['notificaciones', 'logs', notificacionId],
  estadisticas: (inicio: string, fin: string) => ['notificaciones', 'estadisticas', inicio, fin],
};

// Notificaciones
export const useListarNotificaciones = (filtros?: FiltrosNotificaciones) => {
  return useQuery({
    queryKey: QUERY_KEYS.notificaciones(filtros),
    queryFn: () => notificacionesService.listarNotificaciones(filtros),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useObtenerNotificacion = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.notificacion(id),
    queryFn: () => notificacionesService.obtenerNotificacion(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

export const useCrearNotificacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Notificacion>) => notificacionesService.crearNotificacion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones() });
    },
  });
};

export const useActualizarNotificacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notificacion> }) =>
      notificacionesService.actualizarNotificacion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificacion(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones() });
    },
  });
};

export const useEliminarNotificacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificacionesService.eliminarNotificacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones() });
    },
  });
};

export const useReintentarNotificacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificacionesService.reintentarNotificacion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificacion(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones() });
    },
  });
};

// Envío masivo
export const useEnviarMasivo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NotificacionMasiva) => notificacionesService.enviarMasivo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    },
  });
};

// Plantillas
export const useListarPlantillas = (tipo?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.plantillas(tipo),
    queryFn: () => notificacionesService.listarPlantillas(tipo),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useObtenerPlantilla = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.plantilla(id),
    queryFn: () => notificacionesService.obtenerPlantilla(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

export const useCrearPlantilla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PlantillaNotificacion>) => notificacionesService.crearPlantilla(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plantillas() });
    },
  });
};

export const useActualizarPlantilla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlantillaNotificacion> }) =>
      notificacionesService.actualizarPlantilla(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plantilla(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plantillas() });
    },
  });
};

export const useEliminarPlantilla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificacionesService.eliminarPlantilla(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plantillas() });
    },
  });
};

export const usePrevisualizarPlantilla = () => {
  return useMutation({
    mutationFn: ({ plantillaId, variables }: { plantillaId: string; variables: Record<string, string> }) =>
      notificacionesService.previsualizarPlantilla(plantillaId, variables),
  });
};

// Configuración
export const useObtenerConfiguracion = () => {
  return useQuery({
    queryKey: QUERY_KEYS.configuracion(),
    queryFn: () => notificacionesService.obtenerConfiguracion(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useActualizarConfiguracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ConfiguracionNotificaciones>) =>
      notificacionesService.actualizarConfiguracion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.configuracion() });
    },
  });
};

export const useProbarConexion = () => {
  return useMutation({
    mutationFn: ({ provider, tipo }: { provider: string; tipo: 'email' | 'sms' }) =>
      notificacionesService.probarConexion(provider, tipo),
  });
};

// Logs y estadísticas
export const useObtenerLogs = (notificacionId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.logs(notificacionId),
    queryFn: () => notificacionesService.obtenerLogs(notificacionId),
    enabled: !!notificacionId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useObtenerEstadisticas = (fechaInicio: string, fechaFin: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.estadisticas(fechaInicio, fechaFin),
    queryFn: () => notificacionesService.obtenerEstadisticas(fechaInicio, fechaFin),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
