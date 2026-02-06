import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { optimizarReservasService } from '../services/optimizarReservasService';
import type {
  ConfiguracionDinamica,
  OptimizacionPrecio,
  ReservaOptimizada,
  FiltrosOptimizacion,
} from '../types';

const QUERY_KEYS = {
  configuracion: (activoId: string) => ['optimizar-reservas', 'config', activoId],
  reservas: (filtros?: FiltrosOptimizacion) => ['optimizar-reservas', 'reservas', filtros],
  reserva: (id: string) => ['optimizar-reservas', 'reserva', id],
  historial: (reservaId: string) => ['optimizar-reservas', 'historial', reservaId],
  bultos: ['optimizar-reservas', 'bultos'],
  bulto: (id: string) => ['optimizar-reservas', 'bulto', id],
  analytics: (inicio: string, fin: string) => ['optimizar-reservas', 'analytics', inicio, fin],
  recomendaciones: (activoId: string) => ['optimizar-reservas', 'recomendaciones', activoId],
};

// Configuración
export const useObtenerConfiguracion = (activoId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.configuracion(activoId),
    queryFn: () => optimizarReservasService.obtenerConfiguracion(activoId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCrearConfiguracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: Partial<ConfiguracionDinamica>) =>
      optimizarReservasService.crearConfiguracion(config),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.configuracion(data.activoId),
      });
    },
  });
};

export const useActualizarConfiguracion = (activoId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: Partial<ConfiguracionDinamica>) =>
      optimizarReservasService.actualizarConfiguracion(activoId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.configuracion(activoId),
      });
    },
  });
};

// Validación
export const useValidarDisponibilidad = (
  activoId: string,
  fechaInicio: string,
  fechaFin: string
) => {
  return useQuery({
    queryKey: ['validar-disponibilidad', activoId, fechaInicio, fechaFin],
    queryFn: () =>
      optimizarReservasService.validarDisponibilidad(activoId, fechaInicio, fechaFin),
    enabled: !!(activoId && fechaInicio && fechaFin),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Optimización de precio
export const useOptimizarPrecio = () => {
  return useMutation({
    mutationFn: (reservaId: string) =>
      optimizarReservasService.optimizarPrecio(reservaId),
  });
};

export const useAplicarOptimizacion = (reservaId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (optimizacion: OptimizacionPrecio) =>
      optimizarReservasService.aplicarOptimizacion(reservaId, optimizacion),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reserva(reservaId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.historial(reservaId),
      });
    },
  });
};

// Reservas
export const useObtenerReserva = (reservaId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.reserva(reservaId),
    queryFn: () => optimizarReservasService.obtenerReserva(reservaId),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

export const useListarReservas = (filtros?: FiltrosOptimizacion) => {
  return useQuery({
    queryKey: QUERY_KEYS.reservas(filtros),
    queryFn: () => optimizarReservasService.listarReservas(filtros),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useActualizarReserva = (reservaId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actualizacion: Partial<ReservaOptimizada>) =>
      optimizarReservasService.actualizarReserva(reservaId, actualizacion),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reserva(reservaId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservas(),
      });
    },
  });
};

// Historial
export const useObtenerHistorial = (reservaId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.historial(reservaId),
    queryFn: () => optimizarReservasService.obtenerHistorial(reservaId),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

// Bultos
export const useCrearBulto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { nombre: string; descripcion: string; reservaIds: string[] }) =>
      optimizarReservasService.crearBulto(params.nombre, params.descripcion, params.reservaIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bultos,
      });
    },
  });
};

export const useProcesarBulto = (bultoId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => optimizarReservasService.procesarBulto(bultoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bulto(bultoId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.bultos,
      });
    },
  });
};

export const useListarBultos = () => {
  return useQuery({
    queryKey: QUERY_KEYS.bultos,
    queryFn: () => optimizarReservasService.listarBultos(),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

// Analíticas
export const useObtenerAnalytics = (fechaInicio: string, fechaFin: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.analytics(fechaInicio, fechaFin),
    queryFn: () => optimizarReservasService.obtenerAnalytics(fechaInicio, fechaFin),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useObtenerRecomendaciones = (activoId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.recomendaciones(activoId),
    queryFn: () => optimizarReservasService.obtenerRecomendaciones(activoId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
