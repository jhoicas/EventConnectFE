import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dataPrivacyService } from '../services/dataPrivacyService';
import type {
  UserConsent,
  DataRetentionPolicy,
  PrivacyImpactAssessment,
  DataSubjectRequest,
  ComplianceFrameworkMapping,
} from '../types';

const QUERY_KEYS = {
  consent: ['consent'],
  retention: ['retention'],
  anonymization: ['anonymization'],
  audit: ['audit'],
  accessControl: ['access-control'],
  templates: ['templates'],
  dataSubjects: ['data-subjects'],
  pia: ['pia'],
  compliance: ['compliance'],
  breaches: ['breaches'],
  thirdParties: ['third-parties'],
  dashboard: ['dashboard'],
  metrics: ['metrics'],
};

// ============= CONSENT MANAGEMENT HOOKS =============

export const useListarConsents = (userId?: string, tipo?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.consent, 'list', userId, tipo],
    queryFn: async () => {
      const { data } = await dataPrivacyService.consentService.listarConsents(userId, tipo);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerConsent = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.consent, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.consentService.obtenerConsent(id);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCrearConsent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<UserConsent>) => {
      const { data: response } = await dataPrivacyService.consentService.crearConsent(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.consent });
    },
  });
};

export const useActualizarConsent = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<UserConsent>) => {
      const { data: response } = await dataPrivacyService.consentService.actualizarConsent(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.consent });
    },
  });
};

export const useRevocarConsent = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (razon: string) => {
      const { data } = await dataPrivacyService.consentService.revocarConsent(id, razon);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.consent });
    },
  });
};

export const useObtenerPreferencias = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.consent, 'preferences', userId],
    queryFn: async () => {
      const { data } = await dataPrivacyService.consentService.obtenerPreferencias(userId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};

export const useActualizarPreferencias = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (preferences: Record<string, string>) => {
      const { data } = await dataPrivacyService.consentService.actualizarPreferencias(userId, preferences);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.consent });
    },
  });
};

// ============= DATA RETENTION HOOKS =============

export const useListarPoliticas = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.retention, 'policies'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.retentionService.listarPoliticas();
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useObtenerPolitica = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.retention, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.retentionService.obtenerPolitica(id);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCrearPolitica = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<DataRetentionPolicy>) => {
      const { data: response } = await dataPrivacyService.retentionService.crearPoliticaRetencion(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.retention });
    },
  });
};

export const useActualizarPolitica = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<DataRetentionPolicy>) => {
      const { data: response } = await dataPrivacyService.retentionService.actualizarPolitica(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.retention });
    },
  });
};

export const useListarDatosARetener = (estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.retention, 'data', estado],
    queryFn: async () => {
      const { data } = await dataPrivacyService.retentionService.listarDatosARetener(estado);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMarcarParaEliminacion = (dataId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await dataPrivacyService.retentionService.marcarParaEliminacion(dataId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.retention });
    },
  });
};

// ============= ANONYMIZATION HOOKS =============

export const useListarAnonimizaciones = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.anonymization, 'records'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.anonymizationService.listarAnonimizaciones();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerAnonimizacion = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.anonymization, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.anonymizationService.obtenerAnonimizacion(id);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useAnonimizarDatos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { dataId: string; metodo: string; parametros?: Record<string, any> }) => {
      const { data } = await dataPrivacyService.anonymizationService.anonimizarDatos(
        params.dataId,
        params.metodo,
        params.parametros
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.anonymization });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

export const useVerificarAnonimizacion = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (verificador: string) => {
      const { data } = await dataPrivacyService.anonymizationService.verificarAnonimizacion(id, verificador);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.anonymization });
    },
  });
};

// ============= AUDIT HOOKS =============

export const useListarRegistrosAuditoria = (filtros?: Record<string, any>) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.audit, 'logs', filtros],
    queryFn: async () => {
      const { data } = await dataPrivacyService.auditService.listarRegistros(filtros);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerRegistroAuditoria = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.audit, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.auditService.obtenerRegistro(id);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCrearRegistroAuditoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await dataPrivacyService.auditService.crearRegistroAuditoria(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

export const useObtenerRegistrosCriticos = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.audit, 'critical'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.auditService.obtenerRegistrosCriticos();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============= ACCESS CONTROL HOOKS =============

export const useListarControles = (userId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.accessControl, 'list', userId],
    queryFn: async () => {
      const { data } = await dataPrivacyService.accessControlService.listarControles(userId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerControl = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.accessControl, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.accessControlService.obtenerControl(id);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCrearControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await dataPrivacyService.accessControlService.crearControl(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accessControl });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

export const useRevocarAcceso = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await dataPrivacyService.accessControlService.revocarAcceso(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accessControl });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

// ============= DATA SUBJECT REQUEST HOOKS =============

export const useListarSolicitudes = (estado?: string, tipo?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.dataSubjects, 'requests', estado, tipo],
    queryFn: async () => {
      const { data } = await dataPrivacyService.dataSubjectService.listarSolicitudes(estado, tipo);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerSolicitud = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.dataSubjects, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.dataSubjectService.obtenerSolicitud(id);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCrearSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<DataSubjectRequest>) => {
      const { data: response } = await dataPrivacyService.dataSubjectService.crearSolicitud(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSubjects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
};

export const useActualizarSolicitud = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<DataSubjectRequest>) => {
      const { data: response } = await dataPrivacyService.dataSubjectService.actualizarSolicitud(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSubjects });
    },
  });
};

export const useProcesarSolicitudAcceso = (requestId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await dataPrivacyService.dataSubjectService.procesarSolicitudAcceso(requestId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSubjects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

export const useProcesarSolicitudEliminacion = (requestId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await dataPrivacyService.dataSubjectService.procesarSolicitudEliminacion(requestId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSubjects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.retention });
    },
  });
};

export const useObtenerSolicitudesPendientes = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.dataSubjects, 'pending'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.dataSubjectService.obtenerSolicitudesPendientes();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============= PRIVACY IMPACT ASSESSMENT HOOKS =============

export const useListarPIAs = (estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.pia, 'list', estado],
    queryFn: async () => {
      const { data } = await dataPrivacyService.piaService.listarPIAs(estado);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerPIA = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.pia, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.piaService.obtenerPIA(id);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCrearPIA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<PrivacyImpactAssessment>) => {
      const { data: response } = await dataPrivacyService.piaService.crearPIA(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pia });
    },
  });
};

export const useActualizarPIA = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<PrivacyImpactAssessment>) => {
      const { data: response } = await dataPrivacyService.piaService.actualizarPIA(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pia });
    },
  });
};

export const useAprobarPIA = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comentarios?: string) => {
      const { data } = await dataPrivacyService.piaService.aprobarPIA(id, comentarios);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pia });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

// ============= COMPLIANCE FRAMEWORK HOOKS =============

export const useListarFrameworks = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.compliance, 'frameworks'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.complianceService.listarFrameworks();
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useObtenerFramework = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.compliance, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.complianceService.obtenerFramework(id);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCrearFramework = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<ComplianceFrameworkMapping>) => {
      const { data: response } = await dataPrivacyService.complianceService.crearFramework(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.compliance });
    },
  });
};

export const useObtenerEstadoCompliance = (framework?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.compliance, 'status', framework],
    queryFn: async () => {
      const { data } = await dataPrivacyService.complianceService.obtenerEstadoCompliance(framework);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useRealizarAuditoria = (frameworkId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await dataPrivacyService.complianceService.realizarAuditoria(frameworkId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.compliance });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

// ============= DATA BREACH HOOKS =============

export const useListarBreaches = (estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.breaches, 'list', estado],
    queryFn: async () => {
      const { data } = await dataPrivacyService.breachService.listarBreaches(estado);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerBreach = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.breaches, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.breachService.obtenerBreach(id);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useRegistrarBreach = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await dataPrivacyService.breachService.registrarBreach(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.breaches });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
};

export const useNotificarBreachAAfectados = (breachId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plantilla?: string) => {
      const { data } = await dataPrivacyService.breachService.notificarBreachAAfectados(breachId, plantilla);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.breaches });
    },
  });
};

export const useObtenerBreachesAbiertos = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.breaches, 'open'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.breachService.obtenerBreachesAbiertos();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ============= THIRD PARTY COMPLIANCE HOOKS =============

export const useListarTerceros = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.thirdParties, 'list'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.thirdPartyService.listarTerceros();
      return data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useObtenerTercero = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.thirdParties, id],
    queryFn: async () => {
      const { data } = await dataPrivacyService.thirdPartyService.obtenerTercero(id);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useAuditarTercero = (terceroId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await dataPrivacyService.thirdPartyService.auditarTercero(terceroId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.thirdParties });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.audit });
    },
  });
};

// ============= DASHBOARD HOOKS =============

export const useObtenerDashboard = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.dashboard],
    queryFn: async () => {
      const { data } = await dataPrivacyService.dashboardService.obtenerDashboard();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerMetricas = (periodo: { inicio: Date; fin: Date }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.metrics, periodo],
    queryFn: async () => {
      const { data } = await dataPrivacyService.dashboardService.obtenerMetricas(periodo);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerRiesgosActivos = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.dashboard, 'risks'],
    queryFn: async () => {
      const { data } = await dataPrivacyService.dashboardService.obtenerRiesgosActivos();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
