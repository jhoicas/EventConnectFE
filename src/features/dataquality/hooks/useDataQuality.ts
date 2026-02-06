import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataQualityService } from '../services/dataQualityService';
import type {
  DataQualityScore,
  ValidationRule,
  DataMonitoring,
  DataReconciliation,
  DataLineage,
  DataGovernancePolicy,
} from '../types';

const QUERY_KEYS = {
  quality: ['quality'],
  rules: ['rules'],
  profiles: ['profiles'],
  anomalies: ['anomalies'],
  monitoring: ['monitoring'],
  reconciliation: ['reconciliation'],
  lineage: ['lineage'],
  compliance: ['compliance'],
  governance: ['governance'],
  reporting: ['reporting'],
};

// Quality Score Hooks
export const useListarPuntuaciones = (tabla?: string, estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.quality, 'list', tabla, estado],
    queryFn: async () => {
      const { data } = await dataQualityService.qualityScoreService.listarPuntuaciones(tabla, estado);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useObtenerPuntuacion = (entityType: string, entityId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.quality, entityType, entityId],
    queryFn: async () => {
      const { data } = await dataQualityService.qualityScoreService.obtenerPuntuacion(entityType, entityId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!entityType && !!entityId,
  });
};

export const useActualizarPuntuacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityId, datos }: { entityId: string; datos: Partial<DataQualityScore> }) =>
      dataQualityService.qualityScoreService.actualizarPuntuacion(entityId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quality });
    },
  });
};

export const useObtenerHistorialPuntuacion = (entityId: string, dias?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.quality, 'history', entityId, dias],
    queryFn: async () => {
      const { data } = await dataQualityService.qualityScoreService.obtenerHistorial(entityId, dias);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!entityId,
  });
};

export const useCompararPeriodos = (entityId: string, fechaInicio: Date, fechaFin: Date) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.quality, 'compare', entityId, fechaInicio, fechaFin],
    queryFn: async () => {
      const { data } = await dataQualityService.qualityScoreService.compararPeriodos(entityId, fechaInicio, fechaFin);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!entityId && !!fechaInicio && !!fechaFin,
  });
};

export const useObtenerTendencias = (tabla: string, dias?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.quality, 'trends', tabla, dias],
    queryFn: async () => {
      const { data } = await dataQualityService.qualityScoreService.obtenerTendencias(tabla, dias);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!tabla,
  });
};

// Validation Rules Hooks
export const useListarReglas = (tabla?: string, tipo?: string, activa?: boolean) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.rules, 'list', tabla, tipo, activa],
    queryFn: async () => {
      const { data } = await dataQualityService.validationRuleService.listarReglas(tabla, tipo, activa);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerRegla = (ruleId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.rules, ruleId],
    queryFn: async () => {
      const { data } = await dataQualityService.validationRuleService.obtenerRegla(ruleId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!ruleId,
  });
};

export const useCrearRegla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<ValidationRule>) =>
      dataQualityService.validationRuleService.crearRegla(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rules });
    },
  });
};

export const useActualizarRegla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ruleId, datos }: { ruleId: string; datos: Partial<ValidationRule> }) =>
      dataQualityService.validationRuleService.actualizarRegla(ruleId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rules });
    },
  });
};

export const useEliminarRegla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => dataQualityService.validationRuleService.eliminarRegla(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rules });
    },
  });
};

export const useEjecutarRegla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => dataQualityService.validationRuleService.ejecutarRegla(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rules });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quality });
    },
  });
};

export const useEjecutarTodasLasReglas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tabla: string) => dataQualityService.validationRuleService.ejecutarTodas(tabla),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rules });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.quality });
    },
  });
};

export const useDuplicarRegla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ruleId, nombre }: { ruleId: string; nombre: string }) =>
      dataQualityService.validationRuleService.duplicarRegla(ruleId, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rules });
    },
  });
};

// Data Profiling Hooks
export const useListarPerfiles = (tabla?: string, estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.profiles, 'list', tabla, estado],
    queryFn: async () => {
      const { data } = await dataQualityService.dataProfilingService.listarPerfiles(tabla, estado);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerPerfil = (profileId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.profiles, profileId],
    queryFn: async () => {
      const { data } = await dataQualityService.dataProfilingService.obtenerPerfil(profileId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!profileId,
  });
};

export const useCrearPerfil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tabla, columnas }: { tabla: string; columnas?: string[] }) =>
      dataQualityService.dataProfilingService.crearPerfil(tabla, columnas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
    },
  });
};

export const useRegenerarPerfil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId: string) => dataQualityService.dataProfilingService.regenerarPerfil(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
    },
  });
};

export const useCompararPerfiles = (profile1Id: string, profile2Id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.profiles, 'compare', profile1Id, profile2Id],
    queryFn: async () => {
      const { data } = await dataQualityService.dataProfilingService.compararPerfiles(profile1Id, profile2Id);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!profile1Id && !!profile2Id,
  });
};

// Anomaly Detection Hooks
export const useListarAnomalias = (tabla?: string, tipo?: string, resuelta?: boolean) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.anomalies, 'list', tabla, tipo, resuelta],
    queryFn: async () => {
      const { data } = await dataQualityService.anomalyDetectionService.listarAnomalias(tabla, tipo, resuelta);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useObtenerAnomalia = (anomalyId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.anomalies, anomalyId],
    queryFn: async () => {
      const { data } = await dataQualityService.anomalyDetectionService.obtenerAnomalia(anomalyId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!anomalyId,
  });
};

export const useDetectarAnomalias = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tabla, criterios }: { tabla: string; criterios?: any }) =>
      dataQualityService.anomalyDetectionService.detectarAnomalias(tabla, criterios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.anomalies });
    },
  });
};

export const useMarcarResuelto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ anomalyId, resolucion }: { anomalyId: string; resolucion: string }) =>
      dataQualityService.anomalyDetectionService.marcarResuelta(anomalyId, resolucion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.anomalies });
    },
  });
};

// Monitoring Hooks
export const useListarMonitores = (activo?: boolean) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.monitoring, 'list', activo],
    queryFn: async () => {
      const { data } = await dataQualityService.monitoringService.listarMonitores(activo);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerMonitor = (monitorId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.monitoring, monitorId],
    queryFn: async () => {
      const { data } = await dataQualityService.monitoringService.obtenerMonitor(monitorId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!monitorId,
  });
};

export const useCrearMonitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<DataMonitoring>) =>
      dataQualityService.monitoringService.crearMonitor(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitoring });
    },
  });
};

export const useActivarMonitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (monitorId: string) => dataQualityService.monitoringService.activarMonitor(monitorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitoring });
    },
  });
};

export const useDesactivarMonitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (monitorId: string) => dataQualityService.monitoringService.desactivarMonitor(monitorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitoring });
    },
  });
};

export const useObtenerAlertas = (monitorId: string, dias?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.monitoring, 'alerts', monitorId, dias],
    queryFn: async () => {
      const { data } = await dataQualityService.monitoringService.obtenerAlertas(monitorId, dias);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!monitorId,
  });
};

// Reconciliation Hooks
export const useListarReconciliaciones = (estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.reconciliation, 'list', estado],
    queryFn: async () => {
      const { data } = await dataQualityService.reconciliationService.listarReconciliaciones(estado);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerReconciliacion = (reconId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.reconciliation, reconId],
    queryFn: async () => {
      const { data } = await dataQualityService.reconciliationService.obtenerReconciliacion(reconId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!reconId,
  });
};

export const useCrearReconciliacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<DataReconciliation>) =>
      dataQualityService.reconciliationService.crearReconciliacion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reconciliation });
    },
  });
};

export const useEjecutarReconciliacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reconId: string) => dataQualityService.reconciliationService.ejecutarReconciliacion(reconId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reconciliation });
    },
  });
};

// Data Lineage Hooks
export const useListarLineages = (nivel?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.lineage, 'list', nivel],
    queryFn: async () => {
      const { data } = await dataQualityService.lineageService.listarLineages(nivel);
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useObtenerLineage = (lineageId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.lineage, lineageId],
    queryFn: async () => {
      const { data } = await dataQualityService.lineageService.obtenerLineage(lineageId);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!lineageId,
  });
};

export const useCrearLineage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<DataLineage>) =>
      dataQualityService.lineageService.crearLineage(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lineage });
    },
  });
};

// Compliance Hooks
export const useListarVerificaciones = (framework?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.compliance, 'list', framework],
    queryFn: async () => {
      const { data } = await dataQualityService.complianceService.listarVerificaciones(framework);
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useObtenerVerificacion = (checkId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.compliance, checkId],
    queryFn: async () => {
      const { data } = await dataQualityService.complianceService.obtenerVerificacion(checkId);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!checkId,
  });
};

export const useEjecutarAuditoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checkId: string) => dataQualityService.complianceService.ejecutarAuditoria(checkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.compliance });
    },
  });
};

export const useObtenerResumenComplianza = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.compliance, 'summary'],
    queryFn: async () => {
      const { data } = await dataQualityService.complianceService.obtenerResumenComplianza();
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

// Governance Hooks
export const useListarPoliticas = (estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.governance, 'policies', estado],
    queryFn: async () => {
      const { data } = await dataQualityService.governanceService.listarPoliticas(estado);
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useObtenerPolitica = (policyId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.governance, 'policy', policyId],
    queryFn: async () => {
      const { data } = await dataQualityService.governanceService.obtenerPolitica(policyId);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!policyId,
  });
};

export const useCrearPolitica = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<DataGovernancePolicy>) =>
      dataQualityService.governanceService.crearPolitica(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.governance });
    },
  });
};

export const useObtenerDashboardGovernance = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.governance, 'dashboard'],
    queryFn: async () => {
      const { data } = await dataQualityService.governanceService.obtenerDashboard();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Reporting Hooks
export const useGenerarReporteCalidad = (periodo: { inicio: Date; fin: Date }, filtros?: any) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.reporting, 'quality-metrics', periodo, filtros],
    queryFn: async () => {
      const { data } = await dataQualityService.reportingService.generarReporteCalidad(periodo, filtros);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!periodo.inicio && !!periodo.fin,
  });
};

export const useListarReportesGenerados = (tipo?: string, estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.reporting, 'reports', tipo, estado],
    queryFn: async () => {
      const { data } = await dataQualityService.reportingService.listarReportesGenerados(tipo, estado);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerResumenDashboard = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.reporting, 'dashboard-summary'],
    queryFn: async () => {
      const { data } = await dataQualityService.reportingService.obtenerResumenDashboard();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useObtenerTendenciasGenerales = (dias?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.reporting, 'trends', dias],
    queryFn: async () => {
      const { data } = await dataQualityService.reportingService.obtenerTendenciasGenerales(dias);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
