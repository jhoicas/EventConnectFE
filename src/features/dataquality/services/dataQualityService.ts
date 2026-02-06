import axiosInstance from '@/lib/axios';
import type {
  DataQualityScore,
  ValidationRule,
  DataProfile,
  DataAnomaly,
  DataMonitoring,
  DataReconciliation,
  DataLineage,
  ComplianceCheck,
  DataGovernancePolicy,
  QualityMetricReport,
  ResponseDataQuality,
} from '../types';

const API_BASE = '/api/data-quality';

// Quality Score Service
const qualityScoreService = {
  obtenerPuntuacion: (entityType: string, entityId: string) =>
    axiosInstance.get<ResponseDataQuality<DataQualityScore>>(
      `${API_BASE}/scores/${entityType}/${entityId}`
    ),

  listarPuntuaciones: (tabla?: string, estado?: string) =>
    axiosInstance.get<ResponseDataQuality<DataQualityScore[]>>(
      `${API_BASE}/scores`,
      { params: { tabla, estado } }
    ),

  actualizarPuntuacion: (entityId: string, datos: Partial<DataQualityScore>) =>
    axiosInstance.put<ResponseDataQuality<DataQualityScore>>(
      `${API_BASE}/scores/${entityId}`,
      datos
    ),

  obtenerHistorial: (entityId: string, dias: number = 30) =>
    axiosInstance.get<ResponseDataQuality<DataQualityScore[]>>(
      `${API_BASE}/scores/${entityId}/history`,
      { params: { dias } }
    ),

  compararPeriodos: (entityId: string, fechaInicio: Date, fechaFin: Date) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/scores/${entityId}/compare`,
      { params: { fechaInicio, fechaFin } }
    ),

  obtenerTendencias: (tabla: string, dias: number = 90) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/scores/${tabla}/trends`,
      { params: { dias } }
    ),
};

// Validation Rules Service
const validationRuleService = {
  crearRegla: (datos: Partial<ValidationRule>) =>
    axiosInstance.post<ResponseDataQuality<ValidationRule>>(
      `${API_BASE}/rules`,
      datos
    ),

  listarReglas: (tabla?: string, tipo?: string, activa?: boolean) =>
    axiosInstance.get<ResponseDataQuality<ValidationRule[]>>(
      `${API_BASE}/rules`,
      { params: { tabla, tipo, activa } }
    ),

  obtenerRegla: (ruleId: string) =>
    axiosInstance.get<ResponseDataQuality<ValidationRule>>(
      `${API_BASE}/rules/${ruleId}`
    ),

  actualizarRegla: (ruleId: string, datos: Partial<ValidationRule>) =>
    axiosInstance.put<ResponseDataQuality<ValidationRule>>(
      `${API_BASE}/rules/${ruleId}`,
      datos
    ),

  eliminarRegla: (ruleId: string) =>
    axiosInstance.delete<ResponseDataQuality>(
      `${API_BASE}/rules/${ruleId}`
    ),

  ejecutarRegla: (ruleId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/rules/${ruleId}/execute`
    ),

  ejecutarTodas: (tabla: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/rules/execute-all`,
      { tabla }
    ),

  duplicarRegla: (ruleId: string, nombre: string) =>
    axiosInstance.post<ResponseDataQuality<ValidationRule>>(
      `${API_BASE}/rules/${ruleId}/duplicate`,
      { nombre }
    ),

  activarRegla: (ruleId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/rules/${ruleId}/activate`
    ),

  desactivarRegla: (ruleId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/rules/${ruleId}/deactivate`
    ),
};

// Data Profiling Service
const dataProfilingService = {
  crearPerfil: (tabla: string, columnas?: string[]) =>
    axiosInstance.post<ResponseDataQuality<DataProfile>>(
      `${API_BASE}/profiles`,
      { tabla, columnas }
    ),

  listarPerfiles: (tabla?: string, estado?: string) =>
    axiosInstance.get<ResponseDataQuality<DataProfile[]>>(
      `${API_BASE}/profiles`,
      { params: { tabla, estado } }
    ),

  obtenerPerfil: (profileId: string) =>
    axiosInstance.get<ResponseDataQuality<DataProfile>>(
      `${API_BASE}/profiles/${profileId}`
    ),

  actualizarPerfil: (profileId: string, datos: Partial<DataProfile>) =>
    axiosInstance.put<ResponseDataQuality<DataProfile>>(
      `${API_BASE}/profiles/${profileId}`,
      datos
    ),

  eliminarPerfil: (profileId: string) =>
    axiosInstance.delete<ResponseDataQuality>(
      `${API_BASE}/profiles/${profileId}`
    ),

  regenerarPerfil: (profileId: string) =>
    axiosInstance.post<ResponseDataQuality<DataProfile>>(
      `${API_BASE}/profiles/${profileId}/regenerate`
    ),

  compararPerfiles: (profile1Id: string, profile2Id: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/profiles/compare`,
      { params: { profile1Id, profile2Id } }
    ),

  exportarPerfil: (profileId: string, formato: 'json' | 'csv' | 'pdf') =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/profiles/${profileId}/export`,
      { params: { formato } }
    ),
};

// Anomaly Detection Service
const anomalyDetectionService = {
  detectarAnomalias: (tabla: string, criterios?: any) =>
    axiosInstance.post<ResponseDataQuality<DataAnomaly[]>>(
      `${API_BASE}/anomalies/detect`,
      { tabla, criterios }
    ),

  listarAnomalias: (tabla?: string, tipo?: string, resuelta?: boolean) =>
    axiosInstance.get<ResponseDataQuality<DataAnomaly[]>>(
      `${API_BASE}/anomalies`,
      { params: { tabla, tipo, resuelta } }
    ),

  obtenerAnomalia: (anomalyId: string) =>
    axiosInstance.get<ResponseDataQuality<DataAnomaly>>(
      `${API_BASE}/anomalies/${anomalyId}`
    ),

  marcarResuelta: (anomalyId: string, resolucion: string) =>
    axiosInstance.put<ResponseDataQuality<DataAnomaly>>(
      `${API_BASE}/anomalies/${anomalyId}/resolve`,
      { resolucion }
    ),

  investigarAnomalia: (anomalyId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/anomalies/${anomalyId}/investigate`
    ),

  generarReporteAnomalias: (tabla: string, fechaInicio: Date, fechaFin: Date) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/anomalies/report`,
      { tabla, fechaInicio, fechaFin }
    ),

  establecerUmbrales: (tabla: string, umbrales: any) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/anomalies/thresholds`,
      { tabla, umbrales }
    ),
};

// Quality Monitoring Service
const monitoringService = {
  crearMonitor: (datos: Partial<DataMonitoring>) =>
    axiosInstance.post<ResponseDataQuality<DataMonitoring>>(
      `${API_BASE}/monitoring`,
      datos
    ),

  listarMonitores: (activo?: boolean) =>
    axiosInstance.get<ResponseDataQuality<DataMonitoring[]>>(
      `${API_BASE}/monitoring`,
      { params: { activo } }
    ),

  obtenerMonitor: (monitorId: string) =>
    axiosInstance.get<ResponseDataQuality<DataMonitoring>>(
      `${API_BASE}/monitoring/${monitorId}`
    ),

  actualizarMonitor: (monitorId: string, datos: Partial<DataMonitoring>) =>
    axiosInstance.put<ResponseDataQuality<DataMonitoring>>(
      `${API_BASE}/monitoring/${monitorId}`,
      datos
    ),

  activarMonitor: (monitorId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/monitoring/${monitorId}/activate`
    ),

  desactivarMonitor: (monitorId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/monitoring/${monitorId}/deactivate`
    ),

  ejecutarMonitor: (monitorId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/monitoring/${monitorId}/run`
    ),

  obtenerAlertas: (monitorId: string, dias?: number) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/monitoring/${monitorId}/alerts`,
      { params: { dias } }
    ),
};

// Data Reconciliation Service
const reconciliationService = {
  crearReconciliacion: (datos: Partial<DataReconciliation>) =>
    axiosInstance.post<ResponseDataQuality<DataReconciliation>>(
      `${API_BASE}/reconciliation`,
      datos
    ),

  listarReconciliaciones: (estado?: string) =>
    axiosInstance.get<ResponseDataQuality<DataReconciliation[]>>(
      `${API_BASE}/reconciliation`,
      { params: { estado } }
    ),

  obtenerReconciliacion: (reconId: string) =>
    axiosInstance.get<ResponseDataQuality<DataReconciliation>>(
      `${API_BASE}/reconciliation/${reconId}`
    ),

  ejecutarReconciliacion: (reconId: string) =>
    axiosInstance.post<ResponseDataQuality<DataReconciliation>>(
      `${API_BASE}/reconciliation/${reconId}/execute`
    ),

  resolverDiscrepancia: (discrepancyId: string, resolucion: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/reconciliation/discrepancy/${discrepancyId}/resolve`,
      { resolucion }
    ),

  exportarReporte: (reconId: string, formato: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/reconciliation/${reconId}/export`,
      { params: { formato } }
    ),

  agendar: (reconId: string, frecuencia: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/reconciliation/${reconId}/schedule`,
      { frecuencia }
    ),

  obtenerHistorial: (source: string, target: string, dias?: number) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/reconciliation/history`,
      { params: { source, target, dias } }
    ),
};

// Data Lineage Service
const lineageService = {
  crearLineage: (datos: Partial<DataLineage>) =>
    axiosInstance.post<ResponseDataQuality<DataLineage>>(
      `${API_BASE}/lineage`,
      datos
    ),

  listarLineages: (nivel?: string) =>
    axiosInstance.get<ResponseDataQuality<DataLineage[]>>(
      `${API_BASE}/lineage`,
      { params: { nivel } }
    ),

  obtenerLineage: (lineageId: string) =>
    axiosInstance.get<ResponseDataQuality<DataLineage>>(
      `${API_BASE}/lineage/${lineageId}`
    ),

  obtenerLineageForward: (tabla: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/lineage/${tabla}/forward`
    ),

  obtenerLineageBackward: (tabla: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/lineage/${tabla}/backward`
    ),

  analizarImpacto: (tabla: string, cambio: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/lineage/${tabla}/impact-analysis`,
      { cambio }
    ),

  validarLineage: (lineageId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/lineage/${lineageId}/validate`
    ),

  exportarDiagrama: (lineageId: string, formato: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/lineage/${lineageId}/diagram`,
      { params: { formato } }
    ),
};

// Compliance Service
const complianceService = {
  crearVerificacion: (datos: Partial<ComplianceCheck>) =>
    axiosInstance.post<ResponseDataQuality<ComplianceCheck>>(
      `${API_BASE}/compliance`,
      datos
    ),

  listarVerificaciones: (framework?: string) =>
    axiosInstance.get<ResponseDataQuality<ComplianceCheck[]>>(
      `${API_BASE}/compliance`,
      { params: { framework } }
    ),

  obtenerVerificacion: (checkId: string) =>
    axiosInstance.get<ResponseDataQuality<ComplianceCheck>>(
      `${API_BASE}/compliance/${checkId}`
    ),

  ejecutarAuditoria: (checkId: string) =>
    axiosInstance.post<ResponseDataQuality<ComplianceCheck>>(
      `${API_BASE}/compliance/${checkId}/audit`
    ),

  generarReporteComplianza: (checkId: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/compliance/${checkId}/report`
    ),

  obtenerEvidencia: (checkId: string, requirementId: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/compliance/${checkId}/evidence/${requirementId}`
    ),

  cargarEvidencia: (checkId: string, requirementId: string, evidencia: any) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/compliance/${checkId}/evidence/${requirementId}`,
      evidencia
    ),

  obtenerResumenComplianza: () =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/compliance/summary`
    ),
};

// Governance Service
const governanceService = {
  crearPolitica: (datos: Partial<DataGovernancePolicy>) =>
    axiosInstance.post<ResponseDataQuality<DataGovernancePolicy>>(
      `${API_BASE}/governance/policies`,
      datos
    ),

  listarPoliticas: (estado?: string) =>
    axiosInstance.get<ResponseDataQuality<DataGovernancePolicy[]>>(
      `${API_BASE}/governance/policies`,
      { params: { estado } }
    ),

  obtenerPolitica: (policyId: string) =>
    axiosInstance.get<ResponseDataQuality<DataGovernancePolicy>>(
      `${API_BASE}/governance/policies/${policyId}`
    ),

  actualizarPolitica: (policyId: string, datos: Partial<DataGovernancePolicy>) =>
    axiosInstance.put<ResponseDataQuality<DataGovernancePolicy>>(
      `${API_BASE}/governance/policies/${policyId}`,
      datos
    ),

  aprobarPolitica: (policyId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/governance/policies/${policyId}/approve`
    ),

  archivarPolitica: (policyId: string) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/governance/policies/${policyId}/archive`
    ),

  obtenerAsignaciones: (assetId: string) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/governance/assignments/${assetId}`
    ),

  obtenerDashboard: () =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/governance/dashboard`
    ),
};

// Reporting Service
const reportingService = {
  generarReporteCalidad: (periodo: { inicio: Date; fin: Date }, filtros?: any) =>
    axiosInstance.post<ResponseDataQuality<QualityMetricReport>>(
      `${API_BASE}/reporting/quality-metrics`,
      { periodo, filtros }
    ),

  listarReportesGenerados: (tipo?: string, estado?: string) =>
    axiosInstance.get<ResponseDataQuality<QualityMetricReport[]>>(
      `${API_BASE}/reporting/reports`,
      { params: { tipo, estado } }
    ),

  obtenerReporte: (reportId: string) =>
    axiosInstance.get<ResponseDataQuality<QualityMetricReport>>(
      `${API_BASE}/reporting/reports/${reportId}`
    ),

  exportarReporte: (reportId: string, formato: 'pdf' | 'excel' | 'json') =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/reporting/reports/${reportId}/export`,
      { params: { formato } }
    ),

  compartirReporte: (reportId: string, usuariosEmails: string[]) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/reporting/reports/${reportId}/share`,
      { usuariosEmails }
    ),

  programarReporte: (reportId: string, frecuencia: string, destinatarios: string[]) =>
    axiosInstance.post<ResponseDataQuality>(
      `${API_BASE}/reporting/reports/${reportId}/schedule`,
      { frecuencia, destinatarios }
    ),

  obtenerResumenDashboard: () =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/reporting/dashboard-summary`
    ),

  obtenerTendenciasGenerales: (dias?: number) =>
    axiosInstance.get<ResponseDataQuality>(
      `${API_BASE}/reporting/trends`,
      { params: { dias } }
    ),
};

export const dataQualityService = {
  qualityScoreService,
  validationRuleService,
  dataProfilingService,
  anomalyDetectionService,
  monitoringService,
  reconciliationService,
  lineageService,
  complianceService,
  governanceService,
  reportingService,
};
