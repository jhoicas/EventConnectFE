import axios from '@/lib/axios';
import type {
  UserConsent,
  DataRetentionPolicy,
  DataAccessLog,
  AuditLog,
  ConsentTemplate,
  DataProcessor,
  DataSubjectRequest,
  AccessControl,
  PrivacyImpactAssessment,
  ComplianceFrameworkMapping,
  DataBreachNotification,
  ResponseDataPrivacy,
} from '../types';

const API_BASE = '/api/data-privacy';

// Consent Management Service
const consentService = {
  crearConsent: async (data: Partial<UserConsent>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/consent`, data);
  },
  listarConsents: async (userId?: string, tipo?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/consent`, {
      params: { userId, tipo },
    });
  },
  obtenerConsent: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/consent/${id}`);
  },
  actualizarConsent: async (id: string, data: Partial<UserConsent>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/consent/${id}`, data);
  },
  revocarConsent: async (id: string, razon: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/consent/${id}/revoke`, { razon });
  },
  retirarConsent: async (id: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/consent/${id}/withdraw`, {});
  },
  obtenerHistorialConsent: async (userId: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/consent/history/${userId}`);
  },
  obtenerPreferencias: async (userId: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/consent/preferences/${userId}`);
  },
  actualizarPreferencias: async (userId: string, preferences: Record<string, string>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/consent/preferences/${userId}`, { preferences });
  },
  obtenerEstadisticasConsent: async (periodo: { inicio: Date; fin: Date }) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/consent/statistics`, { params: periodo });
  },
};

// Data Retention Service
const retentionService = {
  crearPoliticaRetencion: async (data: Partial<DataRetentionPolicy>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/retention/policies`, data);
  },
  listarPoliticas: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/retention/policies`);
  },
  obtenerPolitica: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/retention/policies/${id}`);
  },
  actualizarPolitica: async (id: string, data: Partial<DataRetentionPolicy>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/retention/policies/${id}`, data);
  },
  eliminarPolitica: async (id: string) => {
    return axios.delete<ResponseDataPrivacy>(`${API_BASE}/retention/policies/${id}`);
  },
  listarDatosARetener: async (estado?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/retention/data`, { params: { estado } });
  },
  obtenerDatoRetencion: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/retention/data/${id}`);
  },
  marcarParaEliminacion: async (dataId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/retention/data/${dataId}/mark-for-deletion`, {});
  },
  eliminarDatos: async (dataId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/retention/data/${dataId}/delete`, {});
  },
  procesarEliminacionesProgramadas: async () => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/retention/process-scheduled-deletions`, {});
  },
  revistarPolitica: async (policyId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/retention/policies/${policyId}/review`, {});
  },
  obtenerProximasEliminaciones: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/retention/upcoming-deletions`);
  },
};

// Anonymization Service
const anonymizationService = {
  anonimizarDatos: async (dataId: string, metodo: string, parametros?: Record<string, any>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/anonymization/apply`, {
      dataId,
      metodo,
      parametros,
    });
  },
  listarAnonimizaciones: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/anonymization/records`);
  },
  obtenerAnonimizacion: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/anonymization/records/${id}`);
  },
  verificarAnonimizacion: async (id: string, verificador: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/anonymization/records/${id}/verify`, {
      verificador,
    });
  },
  reversibilidadVerificada: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/anonymization/records/${id}/reversibility`);
  },
  aplicarPseudonimaizacion: async (dataId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/anonymization/pseudonymize`, { dataId });
  },
  aplicarKAnonimidad: async (dataIds: string[], k: number) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/anonymization/k-anonymity`, { dataIds, k });
  },
  aplicarDiferencial: async (dataIds: string[], epsilon: number) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/anonymization/differential-privacy`, {
      dataIds,
      epsilon,
    });
  },
  obtenerEstadisticasAnonimizacion: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/anonymization/statistics`);
  },
};

// Audit Service
const auditService = {
  crearRegistroAuditoria: async (data: Partial<AuditLog>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/audit/logs`, data);
  },
  listarRegistros: async (filtros?: Record<string, any>) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/audit/logs`, { params: filtros });
  },
  obtenerRegistro: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/audit/logs/${id}`);
  },
  obtenerRegistrosPorUsuario: async (userId: string, periodo?: { inicio: Date; fin: Date }) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/audit/logs/user/${userId}`, {
      params: periodo,
    });
  },
  obtenerRegistrosPorTipo: async (eventType: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/audit/logs/type/${eventType}`);
  },
  exportarRegistrosAuditoria: async (periodo: { inicio: Date; fin: Date }) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/audit/export`, { periodo });
  },
  generarReporteAuditoria: async (periodo: { inicio: Date; fin: Date }) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/audit/report`, { periodo });
  },
  verificarIntegridad: async (registroId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/audit/logs/${registroId}/verify-integrity`, {});
  },
  obtenerRegistrosCriticos: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/audit/critical-events`);
  },
};

// Access Control Service
const accessControlService = {
  crearControl: async (data: Partial<AccessControl>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/access-control`, data);
  },
  listarControles: async (userId?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/access-control`, { params: { userId } });
  },
  obtenerControl: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/access-control/${id}`);
  },
  actualizarControl: async (id: string, data: Partial<AccessControl>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/access-control/${id}`, data);
  },
  revocarAcceso: async (id: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/access-control/${id}/revoke`, {});
  },
  registrarAcceso: async (data: Partial<DataAccessLog>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/access-control/logs`, data);
  },
  obtenerRegistrosAcceso: async (userId?: string, categoria?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/access-control/logs`, {
      params: { userId, categoria },
    });
  },
  verificarPermiso: async (userId: string, recurso: string, nivel: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/access-control/verify`, {
      userId,
      recurso,
      nivel,
    });
  },
  obtenerRegistrosAccesoSospechosos: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/access-control/suspicious-access`);
  },
};

// Consent Template Service
const consentTemplateService = {
  crearPlantilla: async (data: Partial<ConsentTemplate>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/consent/templates`, data);
  },
  listarPlantillas: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/consent/templates`);
  },
  obtenerPlantilla: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/consent/templates/${id}`);
  },
  actualizarPlantilla: async (id: string, data: Partial<ConsentTemplate>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/consent/templates/${id}`, data);
  },
  versionarPlantilla: async (id: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/consent/templates/${id}/version`, {});
  },
};

// Data Subject Requests Service
const dataSubjectService = {
  crearSolicitud: async (data: Partial<DataSubjectRequest>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests`, data);
  },
  listarSolicitudes: async (estado?: string, tipo?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests`, {
      params: { estado, tipo },
    });
  },
  obtenerSolicitud: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/${id}`);
  },
  actualizarSolicitud: async (id: string, data: Partial<DataSubjectRequest>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/${id}`, data);
  },
  procesarSolicitudAcceso: async (requestId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/${requestId}/process-access`, {});
  },
  procesarSolicitudEliminacion: async (requestId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/${requestId}/process-deletion`, {});
  },
  procesarSolicitudRectificacion: async (requestId: string, datosRectificados: Record<string, any>) => {
    return axios.post<ResponseDataPrivacy>(
      `${API_BASE}/data-subjects/requests/${requestId}/process-rectification`,
      { datosRectificados }
    );
  },
  procesarSolicitudPortabilidad: async (requestId: string, formato: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/${requestId}/process-portability`, {
      formato,
    });
  },
  procesarSolicitudRestriccion: async (requestId: string) => {
    return axios.post<ResponseDataPrivacy>(
      `${API_BASE}/data-subjects/requests/${requestId}/process-restriction`,
      {}
    );
  },
  procesarObjecion: async (requestId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/${requestId}/process-objection`, {});
  },
  obtenerSolicitudesPendientes: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/pending`);
  },
  obtenerSolicitudesVencidas: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/data-subjects/requests/expired`);
  },
};

// Privacy Impact Assessment Service
const piaService = {
  crearPIA: async (data: Partial<PrivacyImpactAssessment>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/pia`, data);
  },
  listarPIAs: async (estado?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/pia`, { params: { estado } });
  },
  obtenerPIA: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/pia/${id}`);
  },
  actualizarPIA: async (id: string, data: Partial<PrivacyImpactAssessment>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/pia/${id}`, data);
  },
  completarPIA: async (id: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/pia/${id}/complete`, {});
  },
  aprobarPIA: async (id: string, comentarios?: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/pia/${id}/approve`, { comentarios });
  },
  rechazarPIA: async (id: string, razonRechazo: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/pia/${id}/reject`, { razonRechazo });
  },
  agregarRiesgo: async (piaId: string, riesgo: any) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/pia/${piaId}/risks`, riesgo);
  },
  agregarMitigacion: async (riesgoId: string, medida: any) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/pia/risks/${riesgoId}/mitigations`, medida);
  },
  generarReportePIA: async (id: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/pia/${id}/report`, {});
  },
};

// Compliance Framework Service
const complianceService = {
  crearFramework: async (data: Partial<ComplianceFrameworkMapping>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/compliance/frameworks`, data);
  },
  listarFrameworks: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/compliance/frameworks`);
  },
  obtenerFramework: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/compliance/frameworks/${id}`);
  },
  actualizarFramework: async (id: string, data: Partial<ComplianceFrameworkMapping>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/compliance/frameworks/${id}`, data);
  },
  realizarAuditoria: async (frameworkId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/compliance/frameworks/${frameworkId}/audit`, {});
  },
  actualizarRequisito: async (requisitoId: string, data: any) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/compliance/requirements/${requisitoId}`, data);
  },
  marcarRequisitoCumplido: async (requisitoId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/compliance/requirements/${requisitoId}/mark-compliant`, {});
  },
  obtenerEstadoCompliance: async (framework?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/compliance/status`, {
      params: { framework },
    });
  },
  generarReporteCompliance: async (framework: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/compliance/report`, { framework });
  },
};

// Data Breach Service
const breachService = {
  registrarBreach: async (data: Partial<DataBreachNotification>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/breaches`, data);
  },
  listarBreaches: async (estado?: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/breaches`, { params: { estado } });
  },
  obtenerBreach: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/breaches/${id}`);
  },
  actualizarBreach: async (id: string, data: Partial<DataBreachNotification>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/breaches/${id}`, data);
  },
  investigarBreach: async (id: string, detalles: Record<string, any>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/breaches/${id}/investigate`, detalles);
  },
  notificarBreachAAutoridades: async (breachId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/breaches/${breachId}/notify-authorities`, {});
  },
  notificarBreachAAfectados: async (breachId: string, plantilla?: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/breaches/${breachId}/notify-affected`, {
      plantilla,
    });
  },
  obtenerBreachesAbiertos: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/breaches/open`);
  },
  obtenerEstadisticasBreaches: async (periodo: { inicio: Date; fin: Date }) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/breaches/statistics`, { params: periodo });
  },
};

// Third Party Compliance Service
const thirdPartyService = {
  registrarTercero: async (data: Partial<DataProcessor>) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/third-parties`, data);
  },
  listarTerceros: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/third-parties`);
  },
  obtenerTercero: async (id: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/third-parties/${id}`);
  },
  actualizarTercero: async (id: string, data: Partial<DataProcessor>) => {
    return axios.put<ResponseDataPrivacy>(`${API_BASE}/third-parties/${id}`, data);
  },
  firmarDPA: async (terceroId: string, dpaUrl: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/third-parties/${terceroId}/sign-dpa`, {
      dpaUrl,
    });
  },
  auditarTercero: async (terceroId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/third-parties/${terceroId}/audit`, {});
  },
  obtenerEstadoCompliance: async (terceroId: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/third-parties/${terceroId}/compliance-status`);
  },
  renovarCertificacion: async (terceroId: string) => {
    return axios.post<ResponseDataPrivacy>(`${API_BASE}/third-parties/${terceroId}/renew-certification`, {});
  },
  obtenerTercerosProblemáticos: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/third-parties/at-risk`);
  },
};

// Dashboard Service
const dashboardService = {
  obtenerDashboard: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/dashboard`);
  },
  obtenerMetricas: async (periodo: { inicio: Date; fin: Date }) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/metrics`, { params: periodo });
  },
  obtenerTendencias: async (periodo: string) => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/trends`, { params: { periodo } });
  },
  obtenerRiesgosActivos: async () => {
    return axios.get<ResponseDataPrivacy>(`${API_BASE}/active-risks`);
  },
};

export const dataPrivacyService = {
  consentService,
  retentionService,
  anonymizationService,
  auditService,
  accessControlService,
  consentTemplateService,
  dataSubjectService,
  piaService,
  complianceService,
  breachService,
  thirdPartyService,
  dashboardService,
};
