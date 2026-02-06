import { useQuery } from '@tanstack/react-query';
import { adminDashboardService } from '../services/adminDashboardService';

const QUERY_KEYS = {
  metricas: ['admin-dashboard', 'metricas'],
  completo: ['admin-dashboard', 'completo'],
  rentabilidad: ['admin-dashboard', 'rentabilidad'],
  tendencias: ['admin-dashboard', 'tendencias'],
  kpis: ['admin-dashboard', 'kpis'],
  topActivos: ['admin-dashboard', 'top-activos'],
  topClientes: ['admin-dashboard', 'top-clientes'],
  estados: ['admin-dashboard', 'estados'],
  geografica: ['admin-dashboard', 'geografica'],
  comportamiento: ['admin-dashboard', 'comportamiento'],
  rentabilidadCategoria: ['admin-dashboard', 'rentabilidad-categoria'],
};

const AUTO_REFRESH = 5 * 60 * 1000;

export const useMetricasDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.metricas,
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerMetricas();
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useDashboardCompleto = () => {
  return useQuery({
    queryKey: QUERY_KEYS.completo,
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerDashboardCompleto();
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useRentabilidad = (fechaInicio: string, fechaFin: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.rentabilidad, fechaInicio, fechaFin],
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerRentabilidad(fechaInicio, fechaFin);
      return data;
    },
    enabled: !!fechaInicio && !!fechaFin,
    staleTime: AUTO_REFRESH,
  });
};

export const useTendencias = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tendencias,
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerTendencias();
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useKpis = () => {
  return useQuery({
    queryKey: QUERY_KEYS.kpis,
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerKpis();
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useTopActivos = (top = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.topActivos, top],
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerTopActivos(top);
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useTopClientes = (top = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.topClientes, top],
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerTopClientes(top);
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useDistribucionEstados = () => {
  return useQuery({
    queryKey: QUERY_KEYS.estados,
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerEstados();
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useDistribucionGeografica = () => {
  return useQuery({
    queryKey: QUERY_KEYS.geografica,
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerGeografica();
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useComportamientoClientes = (segmento?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.comportamiento, segmento],
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerComportamientoClientes(segmento);
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};

export const useRentabilidadCategoria = () => {
  return useQuery({
    queryKey: QUERY_KEYS.rentabilidadCategoria,
    queryFn: async () => {
      const { data } = await adminDashboardService.obtenerRentabilidadCategoria();
      return data;
    },
    staleTime: AUTO_REFRESH,
    refetchInterval: AUTO_REFRESH,
  });
};
