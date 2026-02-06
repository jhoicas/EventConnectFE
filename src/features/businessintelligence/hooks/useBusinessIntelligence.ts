import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import businessIntelligenceService from '../services/businessIntelligenceService';
import type { Dashboard, KPI, FiltrosBI } from '../types';

// ==================== QUERIES ====================

// Dashboards
export const useListarDashboards = (filtros: FiltrosBI = {}) => {
  return useQuery({
    queryKey: ['dashboards', filtros],
    queryFn: () => businessIntelligenceService.listarDashboards(filtros),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerDashboard = (dashboardId: string) => {
  return useQuery({
    queryKey: ['dashboard', dashboardId],
    queryFn: () => businessIntelligenceService.obtenerDashboard(dashboardId),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerDashboardsCompartidos = () => {
  return useQuery({
    queryKey: ['dashboardsCompartidos'],
    queryFn: () => businessIntelligenceService.obtenerDashboardsCompartidos(),
    staleTime: 5 * 60 * 1000,
  });
};

// KPIs
export const useListarKPIs = (filtros?: FiltrosBI) => {
  return useQuery({
    queryKey: ['kpis', filtros],
    queryFn: () => businessIntelligenceService.listarKPIs(filtros),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerKPI = (kpiId: string) => {
  return useQuery({
    queryKey: ['kpi', kpiId],
    queryFn: () => businessIntelligenceService.obtenerKPI(kpiId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerHistoricoKPI = (kpiId: string, periodo: string) => {
  return useQuery({
    queryKey: ['historicoKPI', kpiId, periodo],
    queryFn: () => businessIntelligenceService.obtenerHistoricoKPI(kpiId, periodo),
    staleTime: 5 * 60 * 1000,
  });
};

// Métricas
export const useListarMetricas = () => {
  return useQuery({
    queryKey: ['metricas'],
    queryFn: () => businessIntelligenceService.listarMetricas(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerMetrica = (metricaId: string) => {
  return useQuery({
    queryKey: ['metrica', metricaId],
    queryFn: () => businessIntelligenceService.obtenerMetrica(metricaId),
    staleTime: 10 * 60 * 1000,
  });
};

// Gráficos
export const useObtenerDatosGrafico = (widgetId: string, filtros?: Record<string, any>) => {
  return useQuery({
    queryKey: ['datosGrafico', widgetId, filtros],
    queryFn: () => businessIntelligenceService.obtenerDatosGrafico(widgetId, filtros),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerComparativaPerodos = (kpiId: string, periodo1: string, periodo2: string) => {
  return useQuery({
    queryKey: ['comparativaPerodos', kpiId, periodo1, periodo2],
    queryFn: () => businessIntelligenceService.obtenerComparativaPerodos(kpiId, periodo1, periodo2),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerSegmentacion = (kpiId: string, tipoSegmento: string) => {
  return useQuery({
    queryKey: ['segmentacion', kpiId, tipoSegmento],
    queryFn: () => businessIntelligenceService.obtenerSegmentacion(kpiId, tipoSegmento),
    staleTime: 10 * 60 * 1000,
  });
};

// Tendencias
export const useObtenerTendencias = (kpiId: string, periodo: string) => {
  return useQuery({
    queryKey: ['tendencias', kpiId, periodo],
    queryFn: () => businessIntelligenceService.obtenerTendencias(kpiId, periodo),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerTendenciasMultiples = (kpisIds: string[], periodo: string) => {
  return useQuery({
    queryKey: ['tendenciasMultiples', kpisIds, periodo],
    queryFn: () => businessIntelligenceService.obtenerTendenciasMultiples(kpisIds, periodo),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDetectarAnomalias = (kpiId: string) => {
  return useQuery({
    queryKey: ['anomalias', kpiId],
    queryFn: () => businessIntelligenceService.detectarAnomalias(kpiId),
    staleTime: 10 * 60 * 1000,
  });
};

// Alertas
export const useListarAlertas = () => {
  return useQuery({
    queryKey: ['alertas'],
    queryFn: () => businessIntelligenceService.listarAlertas(),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerAlerta = (alertaId: string) => {
  return useQuery({
    queryKey: ['alerta', alertaId],
    queryFn: () => businessIntelligenceService.obtenerAlerta(alertaId),
    staleTime: 5 * 60 * 1000,
  });
};

// Pronósticos
export const useListarPronosticos = () => {
  return useQuery({
    queryKey: ['pronosticos'],
    queryFn: () => businessIntelligenceService.listarPronosticos(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerPronostico = (pronosticoId: string) => {
  return useQuery({
    queryKey: ['pronostico', pronosticoId],
    queryFn: () => businessIntelligenceService.obtenerPronostico(pronosticoId),
    staleTime: 10 * 60 * 1000,
  });
};

// Exportaciones
export const useListarExportaciones = () => {
  return useQuery({
    queryKey: ['exportaciones'],
    queryFn: () => businessIntelligenceService.listarExportaciones(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerExportacion = (exportacionId: string) => {
  return useQuery({
    queryKey: ['exportacion', exportacionId],
    queryFn: () => businessIntelligenceService.obtenerExportacion(exportacionId),
    staleTime: 2 * 60 * 1000,
  });
};

// Configuración
export const useObtenerConfiguracion = () => {
  return useQuery({
    queryKey: ['configuracionBI'],
    queryFn: () => businessIntelligenceService.obtenerConfiguracion(),
    staleTime: 30 * 60 * 1000,
  });
};

// Estadísticas
export const useObtenerEstadisticas = () => {
  return useQuery({
    queryKey: ['estadisticasBI'],
    queryFn: () => businessIntelligenceService.obtenerEstadisticas(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerEstadisticasUso = (periodo: string) => {
  return useQuery({
    queryKey: ['estadisticasUso', periodo],
    queryFn: () => businessIntelligenceService.obtenerEstadisticasUso(periodo),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerRendimiento = () => {
  return useQuery({
    queryKey: ['rendimiento'],
    queryFn: () => businessIntelligenceService.obtenerRendimiento(),
    staleTime: 5 * 60 * 1000,
  });
};

// Utilidades
export const useObtenerResumenEjecutivo = (periodo: string) => {
  return useQuery({
    queryKey: ['resumenEjecutivo', periodo],
    queryFn: () => businessIntelligenceService.obtenerResumenEjecutivo(periodo),
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

const queryClient = useQueryClient();

// Dashboards
export const useCrearDashboard = () => {
  return useMutation({
    mutationFn: (datos: Partial<Dashboard>) => businessIntelligenceService.crearDashboard(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export const useActualizarDashboard = () => {
  return useMutation({
    mutationFn: ({ dashboardId, datos }: { dashboardId: string; datos: Partial<Dashboard> }) =>
      businessIntelligenceService.actualizarDashboard(dashboardId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useEliminarDashboard = () => {
  return useMutation({
    mutationFn: (dashboardId: string) => businessIntelligenceService.eliminarDashboard(dashboardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export const useDuplicarDashboard = () => {
  return useMutation({
    mutationFn: ({ dashboardId, nombre }: { dashboardId: string; nombre: string }) =>
      businessIntelligenceService.duplicarDashboard(dashboardId, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export const useCompartirDashboard = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      usuariosIds,
      permiso,
    }: {
      dashboardId: string;
      usuariosIds: string[];
      permiso: 'lectura' | 'edicion';
    }) => businessIntelligenceService.compartirDashboard(dashboardId, usuariosIds, permiso),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useRevocarAcceso = () => {
  return useMutation({
    mutationFn: ({ dashboardId, usuarioId }: { dashboardId: string; usuarioId: string }) =>
      businessIntelligenceService.revocarAcceso(dashboardId, usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// KPIs
export const useCrearKPI = () => {
  return useMutation({
    mutationFn: (datos: Partial<KPI>) => businessIntelligenceService.crearKPI(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    },
  });
};

export const useActualizarKPI = () => {
  return useMutation({
    mutationFn: ({ kpiId, datos }: { kpiId: string; datos: Partial<KPI> }) =>
      businessIntelligenceService.actualizarKPI(kpiId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['kpi'] });
    },
  });
};

export const useEliminarKPI = () => {
  return useMutation({
    mutationFn: (kpiId: string) => businessIntelligenceService.eliminarKPI(kpiId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    },
  });
};

// Métricas
export const useCalcularMetrica = () => {
  return useMutation({
    mutationFn: ({
      formula,
      parametros,
    }: {
      formula: string;
      parametros?: Record<string, any>;
    }) => businessIntelligenceService.calcularMetrica(formula, parametros),
  });
};

// Alertas
export const useCrearAlerta = () => {
  return useMutation({
    mutationFn: (datos: any) => businessIntelligenceService.crearAlerta(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useActualizarAlerta = () => {
  return useMutation({
    mutationFn: ({ alertaId, datos }: { alertaId: string; datos: any }) =>
      businessIntelligenceService.actualizarAlerta(alertaId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useEliminarAlerta = () => {
  return useMutation({
    mutationFn: (alertaId: string) => businessIntelligenceService.eliminarAlerta(alertaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useActivarAlerta = () => {
  return useMutation({
    mutationFn: (alertaId: string) => businessIntelligenceService.activarAlerta(alertaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useDesactivarAlerta = () => {
  return useMutation({
    mutationFn: (alertaId: string) => businessIntelligenceService.desactivarAlerta(alertaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

// Pronósticos
export const useCrearPronostico = () => {
  return useMutation({
    mutationFn: ({
      kpiId,
      modelo,
      periodoFinal,
    }: {
      kpiId: string;
      modelo: string;
      periodoFinal: Date;
    }) => businessIntelligenceService.crearPronostico(kpiId, modelo, periodoFinal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pronosticos'] });
    },
  });
};

export const useEliminarPronostico = () => {
  return useMutation({
    mutationFn: (pronosticoId: string) => businessIntelligenceService.eliminarPronostico(pronosticoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pronosticos'] });
    },
  });
};

export const useGenerarPronostico = () => {
  return useMutation({
    mutationFn: ({ kpiId, periodoFinal }: { kpiId: string; periodoFinal: Date }) =>
      businessIntelligenceService.generarPronostico(kpiId, periodoFinal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pronosticos'] });
    },
  });
};

// Exportaciones
export const useCrearExportacion = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      formato,
      opciones,
    }: {
      dashboardId: string;
      formato: string;
      opciones?: Record<string, any>;
    }) => businessIntelligenceService.crearExportacion(dashboardId, formato, opciones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exportaciones'] });
    },
  });
};

export const useProgramarExportacion = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      formato,
      frecuencia,
      destinatarios,
    }: {
      dashboardId: string;
      formato: string;
      frecuencia: string;
      destinatarios: string[];
    }) => businessIntelligenceService.programarExportacion(dashboardId, formato, frecuencia, destinatarios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exportaciones'] });
    },
  });
};

export const useDescargarExportacion = () => {
  return useMutation({
    mutationFn: (exportacionId: string) => businessIntelligenceService.descargarExportacion(exportacionId),
  });
};

export const useCancelarExportacion = () => {
  return useMutation({
    mutationFn: (exportacionId: string) => businessIntelligenceService.cancelarExportacion(exportacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exportaciones'] });
    },
  });
};

// Configuración
export const useActualizarConfiguracion = () => {
  return useMutation({
    mutationFn: (datos: any) => businessIntelligenceService.actualizarConfiguracion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracionBI'] });
    },
  });
};

// Utilidades
export const useValidarFormula = () => {
  return useMutation({
    mutationFn: (formula: string) => businessIntelligenceService.validarFormula(formula),
  });
};

export const useSincronizarDatos = () => {
  return useMutation({
    mutationFn: () => businessIntelligenceService.sincronizarDatos(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['metricas'] });
    },
  });
};

export const useLimpiarCache = () => {
  return useMutation({
    mutationFn: () => businessIntelligenceService.limpiarCache(),
  });
};

export const useGenerarReporteBI = () => {
  return useMutation({
    mutationFn: ({
      dashboardId,
      opciones,
    }: {
      dashboardId: string;
      opciones: Record<string, any>;
    }) => businessIntelligenceService.generarReporteBI(dashboardId, opciones),
  });
};
