import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import type { FiltrosAnalytics } from '../types';

// Hook para obtener resumen de métricas
export const useResumenAnalytics = (filtros?: FiltrosAnalytics, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'resumen', filtros],
    queryFn: () => analyticsService.obtenerResumen(filtros),
    enabled: enabled,
    staleTime: 60000, // 1 minuto - datos críticos, actualizados frecuentemente
  });
};

// Hook para obtener datos de ventas
export const useVentasAnalytics = (filtros?: FiltrosAnalytics, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'ventas', filtros],
    queryFn: () => analyticsService.obtenerVentas(filtros),
    enabled: enabled,
    staleTime: 60000, // 1 minuto
  });
};

// Hook para obtener datos de ocupación
export const useOcupacionAnalytics = (filtros?: FiltrosAnalytics, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'ocupacion', filtros],
    queryFn: () => analyticsService.obtenerOcupacion(filtros),
    enabled: enabled,
    staleTime: 60000, // 1 minuto
  });
};

// Hook para obtener tendencias de clientes
export const useTendenciasClientesAnalytics = (
  filtros?: FiltrosAnalytics,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['analytics', 'clientes', filtros],
    queryFn: () => analyticsService.obtenerTendenciasClientes(filtros),
    enabled: enabled,
    staleTime: 120000, // 2 minutos - actualización menos frecuente
  });
};

// Hook para obtener comparativa
export const useComparativaAnalytics = (periodo: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'comparativa', periodo],
    queryFn: () => analyticsService.obtenerComparativa(periodo),
    enabled: enabled && !!periodo,
    staleTime: 120000,
  });
};

// Hook para obtener top activos
export const useTopActivosAnalytics = (limite: number = 10, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'top-activos', limite],
    queryFn: () => analyticsService.obtenerTopActivos(limite),
    enabled: enabled,
    staleTime: 120000,
  });
};

// Hook para obtener top clientes
export const useTopClientesAnalytics = (limite: number = 10, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'top-clientes', limite],
    queryFn: () => analyticsService.obtenerTopClientes(limite),
    enabled: enabled,
    staleTime: 120000,
  });
};

// Hook para obtener historial
export const useHistorialAnalytics = (
  tipo: 'ventas' | 'ocupacion' | 'ingresos',
  periodos: number = 12,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['analytics', 'historial', tipo, periodos],
    queryFn: () => analyticsService.obtenerHistorial(tipo, periodos),
    enabled: enabled,
    staleTime: 180000, // 3 minutos - datos históricos, cambian menos frecuentemente
  });
};

// Hook para obtener forecast
export const useForecastAnalytics = (
  tipo: 'ventas' | 'ocupacion',
  meses: number = 3,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['analytics', 'forecast', tipo, meses],
    queryFn: () => analyticsService.obtenerForecast(tipo, meses),
    enabled: enabled,
    staleTime: 300000, // 5 minutos - predicciones, actualizadas con menor frecuencia
  });
};

// Hook para obtener anomalías
export const useAnomaliasAnalytics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['analytics', 'anomalias'],
    queryFn: () => analyticsService.obtenerAnomalias(),
    enabled: enabled,
    staleTime: 120000, // 2 minutos - alertas de anomalías
  });
};
