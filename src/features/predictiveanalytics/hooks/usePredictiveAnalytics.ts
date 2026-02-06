import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  timeSeriesService,
  trendService,
  seasonalityService,
  forecastService,
  anomalyService,
  scenarioService,
  modelService,
  comparativeService,
  exportService,
} from '../services/predictiveAnalyticsService';

const QUERY_KEYS = {
  timeSeries: ['timeSeries'],
  trend: ['trend'],
  seasonality: ['seasonality'],
  forecast: ['forecast'],
  anomaly: ['anomaly'],
  scenario: ['scenario'],
  model: ['model'],
  comparative: ['comparative'],
};

// ==================== TIME SERIES HOOKS ====================
export const useListarSeries = (filtros?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.timeSeries, 'list', filtros],
    queryFn: () => timeSeriesService.listarSeries(filtros),
    staleTime: 5 * 60 * 1000,
  });

export const useObtenerSerie = (id: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.timeSeries, id],
    queryFn: () => timeSeriesService.obtenerSerie(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useCrearSerie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => timeSeriesService.crearSerie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timeSeries });
    },
  });
};

export const useActualizarSerie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => timeSeriesService.actualizarSerie(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.timeSeries, variables.id] });
    },
  });
};

export const useEliminarSerie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => timeSeriesService.eliminarSerie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timeSeries });
    },
  });
};

export const useImportarDatos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, archivo }: any) => timeSeriesService.importarDatos(id, archivo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.timeSeries, variables.id] });
    },
  });
};

// ==================== TREND ANALYSIS HOOKS ====================
export const useAnalizarTendencia = (timeSeriesId?: string, periodo?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.trend, timeSeriesId, periodo],
    queryFn: () => trendService.analizarTendencia(timeSeriesId!, periodo),
    enabled: !!timeSeriesId,
    staleTime: 10 * 60 * 1000,
  });

export const useDetectarCambiosTendencia = (timeSeriesId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.trend, 'changes', timeSeriesId],
    queryFn: () => trendService.detectarCambiosTendencia(timeSeriesId!),
    enabled: !!timeSeriesId,
    staleTime: 10 * 60 * 1000,
  });

export const useProyectarTendencia = () => {
  return useMutation({
    mutationFn: (params: any) => trendService.proyectarTendencia(params.timeSeriesId, params.periodos),
  });
};

export const useObtenerTendenciaComparativa = () => {
  return useMutation({
    mutationFn: (params: any) =>
      trendService.obtenerTendenciaComparativa(params.timeSeriesId, params.periodo1, params.periodo2),
  });
};

// ==================== SEASONALITY HOOKS ====================
export const useDetectarEstacionalidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (timeSeriesId: string) => seasonalityService.detectarEstacionalidad(timeSeriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seasonality });
    },
  });
};

export const useDescomponerSerie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (timeSeriesId: string) => seasonalityService.descomponerSerieemporal(timeSeriesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seasonality });
    },
  });
};

export const useObtenerFactoresEstacionales = (timeSeriesId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.seasonality, 'factors', timeSeriesId],
    queryFn: () => seasonalityService.obtenerFactoresEstacionales(timeSeriesId!),
    enabled: !!timeSeriesId,
    staleTime: 15 * 60 * 1000,
  });

export const useAnalizarCiclos = () => {
  return useMutation({
    mutationFn: (params: any) => seasonalityService.analizarCiclos(params.timeSeriesId, params.frecuencia),
  });
};

// ==================== FORECAST HOOKS ====================
export const useGenerarPronostico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => forecastService.generarPronostico(params.timeSeriesId, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.forecast });
    },
  });
};

export const useListarPronosticos = (timeSeriesId?: string, filtros?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.forecast, 'list', timeSeriesId, filtros],
    queryFn: () => forecastService.listarPronosticos(timeSeriesId, filtros),
    staleTime: 5 * 60 * 1000,
  });

export const useObtenerPronostico = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.forecast, id],
    queryFn: () => forecastService.obtenerPronostico(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useActualizarPronostico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => forecastService.actualizarPronostico(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.forecast, variables.id] });
    },
  });
};

export const useEliminarPronostico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => forecastService.eliminarPronostico(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.forecast });
    },
  });
};

export const useCalcularIntervaloConfianza = () => {
  return useMutation({
    mutationFn: (params: any) =>
      forecastService.calcularIntervaloConfianza(params.pronósticoId, params.niveles),
  });
};

export const useCompararModelos = () => {
  return useMutation({
    mutationFn: (timeSeriesId: string) => forecastService.compararModelos(timeSeriesId),
  });
};

export const useReentrenarModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pronósticoId: string) => forecastService.reentrenarModelo(pronósticoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.forecast, variables] });
    },
  });
};

// ==================== ANOMALY DETECTION HOOKS ====================
export const useDetectarAnomalias = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => anomalyService.detectarAnomalias(params.timeSeriesId, params.metodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.anomaly });
    },
  });
};

export const useListarAnomalias = (timeSeriesId?: string, filtros?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.anomaly, 'list', timeSeriesId, filtros],
    queryFn: () => anomalyService.listarAnomalias(timeSeriesId, filtros),
    staleTime: 2 * 60 * 1000,
  });

export const useObtenerAnomalia = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.anomaly, id],
    queryFn: () => anomalyService.obtenerAnomalia(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

export const useMarcarAnomaliaResuelto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: any) => anomalyService.marcarAnomaliaComo(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.anomaly });
    },
  });
};

export const useObtenerAlertasAnomalias = (timeSeriesId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.anomaly, 'alerts', timeSeriesId],
    queryFn: () => anomalyService.obtenerAlertasAnomalias(timeSeriesId),
    staleTime: 2 * 60 * 1000,
  });

export const useConfigurarAlertaAnomalia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => anomalyService.configurarAlertaAnomalia(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.anomaly, 'alerts'] });
    },
  });
};

export const useActualizarAlertaAnomalia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => anomalyService.actualizarAlertaAnomalia(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.anomaly, 'alerts'] });
    },
  });
};

// ==================== SCENARIO ANALYSIS HOOKS ====================
export const useCrearEscenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => scenarioService.crearEscenario(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scenario });
    },
  });
};

export const useListarEscenarios = (timeSeriesId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.scenario, 'list', timeSeriesId],
    queryFn: () => scenarioService.listarEscenarios(timeSeriesId),
    staleTime: 10 * 60 * 1000,
  });

export const useObtenerEscenario = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.scenario, id],
    queryFn: () => scenarioService.obtenerEscenario(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useActualizarEscenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => scenarioService.actualizarEscenario(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scenario });
    },
  });
};

export const useDuplicarEscenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scenarioService.duplicarEscenario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scenario });
    },
  });
};

// ==================== MODEL MANAGEMENT HOOKS ====================
export const useListarModelos = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.model, 'list'],
    queryFn: () => modelService.listarModelos(),
    staleTime: 15 * 60 * 1000,
  });

export const useObtenerModeloDetalle = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.model, id],
    queryFn: () => modelService.obtenerModeloDetalle(id!),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });

export const useObtenerPerformanceModelo = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.model, 'performance', id],
    queryFn: () => modelService.obtenerPerformanceModelo(id!),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });

export const useObtenerFeatureImportance = (modeloId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.model, 'features', modeloId],
    queryFn: () => modelService.obtenerFeatureImportance(modeloId!),
    enabled: !!modeloId,
    staleTime: 20 * 60 * 1000,
  });

export const useReentrenarModeloML = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modeloId: string) => modelService.reentrenarModelo(modeloId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.model, variables] });
    },
  });
};

// ==================== COMPARATIVE ANALYSIS HOOKS ====================
export const useCompararPeriodos = () => {
  return useMutation({
    mutationFn: (params: any) =>
      comparativeService.compararPeriodos(params.timeSeriesId, params.periodo1, params.periodo2),
  });
};

export const useCompararSeries = () => {
  return useMutation({
    mutationFn: (params: any) =>
      comparativeService.compararSeries(params.seriesIds, params.periodo),
  });
};

export const useObtenerCorrelaciones = () => {
  return useMutation({
    mutationFn: (seriesIds: string[]) => comparativeService.obtenerCorrelaciones(seriesIds),
  });
};

// ==================== EXPORT HOOKS ====================
export const useGenerarReporte = () => {
  return useMutation({
    mutationFn: (params: any) =>
      exportService.generarReporte(params.timeSeriesId, params.formato, params.opciones),
  });
};

export const useProgramarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => exportService.programarReporte(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useDescargarDatos = () => {
  return useMutation({
    mutationFn: (params: any) => exportService.descargarDatos(params.timeSeriesId, params.formato),
  });
};
