import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  connectionService,
  eventService,
  kpiStreamService,
  orderStreamService,
  inventoryStreamService,
  transactionStreamService,
  subscriptionService,
  statisticsService,
  cacheService,
  dashboardService,
} from '../services/dataStreamingService';

const QUERY_KEYS = {
  conexion: ['conexion'],
  evento: ['evento'],
  kpiStream: ['kpiStream'],
  orderStream: ['orderStream'],
  inventoryStream: ['inventoryStream'],
  transactionStream: ['transactionStream'],
  suscripcion: ['suscripcion'],
  estadisticas: ['estadisticas'],
  cache: ['cache'],
  dashboard: ['dashboard'],
};

// ==================== CONNECTION HOOKS ====================
export const useCrearConexion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => connectionService.crearConexion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conexion });
    },
  });
};

export const useObtenerConexion = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.conexion, id],
    queryFn: () => connectionService.obtenerConexion(id!),
    enabled: !!id,
    staleTime: 10 * 1000,
    refetchInterval: 5 * 1000,
  });

export const useListarConexiones = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.conexion, 'list'],
    queryFn: () => connectionService.listarConexiones(),
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });

export const useActualizarConexion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => connectionService.actualizarConexion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conexion });
    },
  });
};

export const useCerrarConexion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionService.cerrarConexion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conexion });
    },
  });
};

export const useReconectar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionService.reconectar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conexion });
    },
  });
};

export const useObtenerLogConexion = (id?: string, filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.conexion, 'logs', id, filtro],
    queryFn: () => connectionService.obtenerLogConexion(id!, filtro),
    enabled: !!id,
    staleTime: 30 * 1000,
  });

// ==================== EVENT HOOKS ====================
export const useListarEventos = (filtro: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.evento, 'list', filtro],
    queryFn: () => eventService.listarEventos(filtro),
    staleTime: 2 * 1000,
    refetchInterval: 3 * 1000,
  });

export const useObtenerEvento = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.evento, id],
    queryFn: () => eventService.obtenerEvento(id!),
    enabled: !!id,
    staleTime: 5 * 1000,
  });

export const useProcesarEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accion }: any) => eventService.procesarEvento(id, accion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.evento });
    },
  });
};

export const useObtenerEventosEnTiempoReal = (tipos: string[]) =>
  useQuery({
    queryKey: [...QUERY_KEYS.evento, 'real-time', tipos],
    queryFn: () => eventService.obtenerEventosEnTiempoReal(tipos),
    enabled: tipos.length > 0,
    staleTime: 1 * 1000,
    refetchInterval: 2 * 1000,
  });

export const useObtenerEventosPorTipo = (tipo?: string, filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.evento, 'tipo', tipo, filtro],
    queryFn: () => eventService.obtenerEventosPorTipo(tipo!, filtro),
    enabled: !!tipo,
    staleTime: 3 * 1000,
  });

export const useLimpiarEventos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filtro: any) => eventService.limpiarEventos(filtro),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.evento });
    },
  });
};

// ==================== KPI STREAM HOOKS ====================
export const useSuscribirseAKPIs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (kpiIds: string[]) => kpiStreamService.suscribirseAKPIs(kpiIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kpiStream });
    },
  });
};

export const useObtenerKPIsEnVivo = (kpiIds: string[]) =>
  useQuery({
    queryKey: [...QUERY_KEYS.kpiStream, 'vivo', kpiIds],
    queryFn: () => kpiStreamService.obtenerKPIsEnVivo(kpiIds),
    enabled: kpiIds.length > 0,
    staleTime: 1 * 1000,
    refetchInterval: 2 * 1000,
  });

export const useDesuscribirseDeKPIs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (kpiIds: string[]) => kpiStreamService.desuscribirseDeKPIs(kpiIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kpiStream });
    },
  });
};

export const useObtenerHistoricoKPI = (id?: string, periodo?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.kpiStream, 'historico', id, periodo],
    queryFn: () => kpiStreamService.obtenerHistoricoKPI(id!, periodo),
    enabled: !!id && !!periodo,
    staleTime: 30 * 1000,
  });

// ==================== ORDER STREAM HOOKS ====================
export const useObtenerActualizacionesOrden = (orderId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.orderStream, orderId],
    queryFn: () => orderStreamService.obtenerActualizacionesOrden(orderId!),
    enabled: !!orderId,
    staleTime: 2 * 1000,
    refetchInterval: 3 * 1000,
  });

export const useSuscribirseAOrdenes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filtro?: any) => orderStreamService.suscribirseAOrdenes(filtro),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orderStream });
    },
  });
};

export const useObtenerOrdenesEnVivo = (filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.orderStream, 'vivo', filtro],
    queryFn: () => orderStreamService.obtenerOrdenesEnVivo(filtro),
    staleTime: 1 * 1000,
    refetchInterval: 2 * 1000,
  });

// ==================== INVENTORY STREAM HOOKS ====================
export const useObtenerCambiosInventario = (filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.inventoryStream, filtro],
    queryFn: () => inventoryStreamService.obtenerCambiosInventario(filtro),
    staleTime: 3 * 1000,
    refetchInterval: 5 * 1000,
  });

export const useSuscribirseACambios = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filtro: any) => inventoryStreamService.suscribirseACambios(filtro),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryStream });
    },
  });
};

export const useObtenerNivelesEnVivo = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.inventoryStream, 'niveles'],
    queryFn: () => inventoryStreamService.obtenerNivelesEnVivo(),
    staleTime: 5 * 1000,
    refetchInterval: 10 * 1000,
  });

export const useObtenerAlertasInventario = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.inventoryStream, 'alertas'],
    queryFn: () => inventoryStreamService.obtenerAlertas(),
    staleTime: 2 * 1000,
    refetchInterval: 5 * 1000,
  });

// ==================== TRANSACTION STREAM HOOKS ====================
export const useObtenerTransacciones = (filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.transactionStream, filtro],
    queryFn: () => transactionStreamService.obtenerTransacciones(filtro),
    staleTime: 2 * 1000,
    refetchInterval: 5 * 1000,
  });

export const useObtenerTransaccionesEnVivo = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.transactionStream, 'vivo'],
    queryFn: () => transactionStreamService.obtenerTransaccionesEnVivo(),
    staleTime: 1 * 1000,
    refetchInterval: 2 * 1000,
  });

export const useSuscribirseATransacciones = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tipos: string[]) => transactionStreamService.suscribirseATransacciones(tipos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactionStream });
    },
  });
};

export const useObtenerEstadisticasTransacciones = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.transactionStream, 'estadisticas'],
    queryFn: () => transactionStreamService.obtenerEstadisticasTransacciones(),
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
  });

// ==================== SUBSCRIPTION HOOKS ====================
export const useCrearSuscripcion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => subscriptionService.crearSuscripcion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.suscripcion });
    },
  });
};

export const useListarSuscripciones = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.suscripcion, 'list'],
    queryFn: () => subscriptionService.listarSuscripciones(),
    staleTime: 15 * 1000,
  });

export const useObtenerSuscripcion = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.suscripcion, id],
    queryFn: () => subscriptionService.obtenerSuscripcion(id!),
    enabled: !!id,
    staleTime: 15 * 1000,
  });

export const useActualizarSuscripcion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => subscriptionService.actualizarSuscripcion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.suscripcion });
    },
  });
};

export const useActivarSuscripcion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionService.activarSuscripcion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.suscripcion });
    },
  });
};

// ==================== STATISTICS HOOKS ====================
export const useObtenerEstadisticas = (filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.estadisticas, filtro],
    queryFn: () => statisticsService.obtenerEstadisticas(filtro),
    staleTime: 10 * 1000,
    refetchInterval: 20 * 1000,
  });

export const useObtenerTasaEventos = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.estadisticas, 'tasa'],
    queryFn: () => statisticsService.obtenerTasaEventos(),
    staleTime: 5 * 1000,
    refetchInterval: 10 * 1000,
  });

export const useObtenerLatencia = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.estadisticas, 'latencia'],
    queryFn: () => statisticsService.obtenerLatencia(),
    staleTime: 5 * 1000,
    refetchInterval: 10 * 1000,
  });

export const useObtenerHealthCheck = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.estadisticas, 'health'],
    queryFn: () => statisticsService.obtenerHealthCheck(),
    staleTime: 5 * 1000,
    refetchInterval: 15 * 1000,
  });

// ==================== CACHE HOOKS ====================
export const useObtenerInfoCache = (tipo?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.cache, tipo],
    queryFn: () => cacheService.obtenerInfoCache(tipo!),
    enabled: !!tipo,
    staleTime: 30 * 1000,
  });

export const useLimpiarCache = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tipo: string) => cacheService.limpiarCache(tipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cache });
    },
  });
};

export const useObtenerTamanioCache = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.cache, 'tamanio'],
    queryFn: () => cacheService.obtenerTamanioCache(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

// ==================== DASHBOARD HOOKS ====================
export const useCrearDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => dashboardService.crearDashboardEnVivo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
};

export const useListarDashboards = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.dashboard, 'list'],
    queryFn: () => dashboardService.listarDashboards(),
    staleTime: 15 * 1000,
  });

export const useObtenerDashboard = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.dashboard, id],
    queryFn: () => dashboardService.obtenerDashboard(id!),
    enabled: !!id,
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  });

export const useActualizarDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => dashboardService.actualizarDashboard(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
};

export const useCompartirDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, usuarioIds }: any) =>
      dashboardService.compartirDashboard(id, usuarioIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
};

export const useEliminarDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dashboardService.eliminarDashboard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
};
