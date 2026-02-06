// Union Types
export type DataQualityStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type ValidationRuleType = 'format' | 'range' | 'uniqueness' | 'consistency' | 'completeness' | 'accuracy' | 'timeliness' | 'referential';
export type AnomalyType = 'outlier' | 'duplicate' | 'missing' | 'inconsistent' | 'invalid_format' | 'business_rule_violation';
export type ProfileStatus = 'pending' | 'profiling' | 'completed' | 'failed';
export type IssueStatus = 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
export type ComplianceFramework = 'gdpr' | 'ccpa' | 'hipaa' | 'sox' | 'pci-dss' | 'iso8601';
export type ReconciliationType = 'source_target' | 'system_system' | 'period_period';
export type LineageLevel = 'table' | 'column' | 'business_logic' | 'transformation';

// Core Data Quality Interfaces
export interface DataQualityScore {
  id: string;
  entityType: string;
  entityId: string;
  overallScore: number;
  completenessScore: number;
  accuracyScore: number;
  consistencyScore: number;
  timelinessScore: number;
  validityScore: number;
  status: DataQualityStatus;
  lastEvaluatedAt: Date;
  trend: number; // percentage change
  issues: DataQualityIssue[];
}

export interface ValidationRule {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: ValidationRuleType;
  campo: string;
  tabla: string;
  definicion: string;
  condicion: string;
  severidad: 'error' | 'warning' | 'info';
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  ejecutadas: number;
  fallidas: number;
}

export interface DataProfile {
  id: string;
  tabla: string;
  estado: ProfileStatus;
  totalFilas: number;
  columnasAnalizadas: number;
  completitud: number;
  valores_unicos: number;
  valores_nulos: number;
  valoresMinimo: any;
  valoresMaximo: any;
  distribucion: DistributionMetric[];
  generatedAt: Date;
  duracionMs: number;
}

export interface DistributionMetric {
  campo: string;
  tipo_dato: string;
  cardinalidad: number;
  frecuencia_max: number;
  frecuencia_min: number;
  distribucion_datos: Record<string, number>;
}

export interface DataAnomaly {
  id: string;
  tipo: AnomalyType;
  tabla: string;
  campo: string;
  valor: any;
  filaId: string;
  severidad: 'low' | 'medium' | 'high' | 'critical';
  descripcion: string;
  detectedAt: Date;
  resuelto: boolean;
  resolucion?: string;
}

export interface DataQualityIssue {
  id: string;
  titulo: string;
  descripcion: string;
  reglaId: string;
  afectados: number;
  estado: IssueStatus;
  prioridad: 'low' | 'medium' | 'high' | 'critical';
  asignadoA?: string;
  fechaCreacion: Date;
  fechaResolucion?: Date;
  accionesCorrectivas: CorrectiveAction[];
}

export interface CorrectiveAction {
  id: string;
  issueId: string;
  descripcion: string;
  responsable: string;
  estado: 'pending' | 'in-progress' | 'completed';
  fechaProgramada: Date;
  fechaCompletada?: Date;
  notas: string;
}

export interface DataMonitoring {
  id: string;
  nombre: string;
  descripcionscope: string;
  frecuenciaEvaluacion: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  reglasIncluidas: string[];
  tablasMonitoreadas: string[];
  alertasActivadas: boolean;
  umbralesSeveridad: {
    critical: number;
    high: number;
    medium: number;
  };
  activo: boolean;
  ultimaEjecucion: Date;
  proximaEjecucion: Date;
}

export interface DataReconciliation {
  id: string;
  nombre: string;
  tipo: ReconciliationType;
  sistemasInvolucrados: string[];
  sourceName: string;
  targetName: string;
  criterios_coincidencia: string[];
  registrosCoincidir: number;
  registrosDiscrepancia: number;
  tasa_coincidencia: number;
  discrepancias: ReconciliationDiscrepancy[];
  fechaEjecucion: Date;
  duracionMs: number;
  estado: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ReconciliationDiscrepancy {
  id: string;
  sourceValue: any;
  targetValue: any;
  campo: string;
  tipo_discrepancia: string;
  resuelto: boolean;
  notas?: string;
}

export interface DataLineage {
  id: string;
  nombre: string;
  nivel: LineageLevel;
  sourceSystem: string;
  targetSystem: string;
  transformaciones: Transformation[];
  dependencias: string[];
  impactAnalysis: string[];
  ultimaActualizacion: Date;
  activo: boolean;
}

export interface Transformation {
  id: string;
  nombre: string;
  tipo: string;
  inputFields: string[];
  outputFields: string[];
  logica: string;
  riesgo_datos: 'low' | 'medium' | 'high';
}

export interface ComplianceCheck {
  id: string;
  nombre: string;
  frameworks: ComplianceFramework[];
  tablasAuditadas: string[];
  requisitos: ComplianceRequirement[];
  estado_cumplimiento: 'compliant' | 'non-compliant' | 'partial';
  ultimaAuditoria: Date;
  proxima_auditoria: Date;
}

export interface ComplianceRequirement {
  id: string;
  codigo: string;
  descripcion: string;
  requerimientos_control: string;
  evidencia_disponible: boolean;
  estado: 'met' | 'not-met' | 'partial';
  notas?: string;
}

export interface DataGovernancePolicy {
  id: string;
  nombre: string;
  descripcion: string;
  dueño: string;
  responsables: string[];
  activos_gestionados: string[];
  mecanismos_control: string[];
  frecuencia_revision: string;
  fechaVigencia: Date;
  fechaRevision: Date;
  estado: 'active' | 'archived' | 'pending-approval';
}

export interface QualityMetricReport {
  id: string;
  nombre: string;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  metricas_resumen: {
    promedio_calidad: number;
    total_problemas: number;
    problemas_resueltos: number;
    tasa_resolucion: number;
  };
  detalles_por_tabla: MetricaTabla[];
  tendencias: TendenciaMetrica[];
  recomendaciones: string[];
  generadoAt: Date;
}

export interface MetricaTabla {
  tabla: string;
  score: number;
  problemas: number;
  cambio_porcentaje: number;
  responsable: string;
}

export interface TendenciaMetrica {
  fecha: Date;
  valor: number;
  variacion: number;
}

// Response wrapper
export interface ResponseDataQuality<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  error?: string;
}
