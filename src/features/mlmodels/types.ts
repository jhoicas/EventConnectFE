// Union Types
export type ModelType = 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer-vision' | 'recommendation' | 'time-series' | 'ensemble';
export type ModelStatus = 'draft' | 'training' | 'trained' | 'validation' | 'deployed' | 'archived' | 'failed' | 'retraining';
export type DeploymentStatus = 'pending' | 'initializing' | 'running' | 'paused' | 'stopped' | 'failed' | 'updating';
export type PredictionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'timeout';
export type FrameworkType = 'tensorflow' | 'pytorch' | 'scikit-learn' | 'xgboost' | 'lightgbm' | 'catboost' | 'keras' | 'huggingface';
export type MetricType = 'accuracy' | 'precision' | 'recall' | 'f1_score' | 'auc_roc' | 'mse' | 'rmse' | 'mae';
export type ExplainabilityMethod = 'shap' | 'lime' | 'feature_importance' | 'permutation' | 'integrated_gradients' | 'attention_weights';
export type DriftDetectionStatus = 'normal' | 'warning' | 'critical' | 'unknown';

// Core ML Model Interfaces
export interface MLModel {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: ModelType;
  framework: FrameworkType;
  version: string;
  estado: ModelStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  tags: string[];
  objetivo: string;
  datasetId?: string;
  modelPath: string;
  metricas_entrenamiento?: MetricasModelo;
  metricas_validacion?: MetricasModelo;
}

export interface MetricasModelo {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1_score?: number;
  auc_roc?: number;
  mse?: number;
  rmse?: number;
  mae?: number;
  custom_metrics?: Record<string, number>;
  evaluatedAt: Date;
}

export interface TrainingJob {
  id: string;
  modelId: string;
  datasetId: string;
  nombre: string;
  estado: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  fechaInicio: Date;
  fechaFin?: Date;
  duracionMs?: number;
  hyperparameters: Hyperparameter[];
  progreso: number; // 0-100
  logTraining?: string;
  resultadosFinal?: ResultadosEntrenamiento;
}

export interface Hyperparameter {
  nombre: string;
  valor: any;
  tipo: string;
  rango_min?: number;
  rango_max?: number;
}

export interface ResultadosEntrenamiento {
  metricas: MetricasModelo;
  tiempoEntrenamiento: number;
  tamanioModelo: number;
  mejorEpoca?: number;
  convergencia: boolean;
}

export interface Dataset {
  id: string;
  nombre: string;
  descripcion: string;
  fuente: string;
  tamanio: number;
  numRows: number;
  numColumns: number;
  columnas: ColumnInfo[];
  fechaCarga: Date;
  validado: boolean;
  estadisticas: EstadisticasDataset;
  splits: DatasetSplit[];
}

export interface ColumnInfo {
  nombre: string;
  tipo: 'numeric' | 'categorical' | 'text' | 'datetime' | 'image' | 'audio';
  valores_unicos: number;
  valores_nulos: number;
  distribucion?: Record<string, number>;
}

export interface EstadisticasDataset {
  valores_nulos_total: number;
  correlacion_features: Record<string, number>;
  desbalance_clases?: Record<string, number>;
  outliers_detectados: number;
  calidad_score: number;
}

export interface DatasetSplit {
  nombre: 'train' | 'validation' | 'test';
  porcentaje: number;
  numRows: number;
}

export interface ModelDeployment {
  id: string;
  modelId: string;
  nombre: string;
  version: string;
  estado: DeploymentStatus;
  ambiente: 'development' | 'staging' | 'production';
  endpoint: string;
  fechaDespliegue: Date;
  fechaUltAActualizacion: Date;
  recursosCpuMemoria: {
    cpuRequested: string;
    cpuLimit: string;
    memoryRequested: string;
    memoryLimit: string;
  };
  replicas: number;
  loadBalancing: 'round_robin' | 'least_connections' | 'ip_hash';
  metricas_despliegue: DeploymentMetrics;
}

export interface DeploymentMetrics {
  requestsPorMinuto: number;
  latenciaPromedio: number;
  latenciaP95: number;
  latenciaP99: number;
  tasa_error: number;
  uptime_porcentaje: number;
  disponibilidad: number;
  throughput: number;
}

export interface Prediction {
  id: string;
  modelId: string;
  deploymentId?: string;
  estado: PredictionStatus;
  inputData: Record<string, any>;
  resultado: any;
  confianza: number;
  tiempoInferencia: number;
  explicabilidad?: Explicabilidad;
  createdAt: Date;
  usuario?: string;
}

export interface Explicabilidad {
  metodo: ExplainabilityMethod;
  importancia_features: Record<string, number>;
  contribuciones: Record<string, number>;
  interpretacion: string;
}

export interface ModelMonitoring {
  id: string;
  modelId: string;
  deploymentId: string;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  data_drift?: DataDrift;
  model_drift?: ModelDrift;
  performance_metrics: PerformanceMetrics;
  anomalias_detectadas: Anomalia[];
  estado_general: DriftDetectionStatus;
  ultimaAuditoria: Date;
}

export interface DataDrift {
  detectado: boolean;
  variables_afectadas: string[];
  magnitud: number;
  descripcion: string;
}

export interface ModelDrift {
  detectado: boolean;
  metricas_afectadas: string[];
  variacion: number;
  tendencia: 'improving' | 'degrading' | 'stable';
}

export interface PerformanceMetrics {
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  otros_metricas: Record<string, number>;
}

export interface Anomalia {
  id: string;
  tipo: string;
  severidad: 'low' | 'medium' | 'high' | 'critical';
  descripcion: string;
  detectedAt: Date;
  resuelto: boolean;
}

export interface ModelVersion {
  id: string;
  modelId: string;
  numero_version: string;
  descripcion: string;
  criadoAt: Date;
  metricas: MetricasModelo;
  cambios: string[];
  experimentId?: string;
  comparacionAnterior?: ComparacionVersiones;
}

export interface ComparacionVersiones {
  version_anterior: string;
  cambios_metricas: Record<string, number>;
  mejora_porcentaje: number;
}

export interface ModelGovernance {
  id: string;
  modelId: string;
  dueno: string;
  stakeholders: string[];
  cumplimiento: ComplianceRequirement[];
  auditorias: ModelAudit[];
  politicas: string[];
  ultima_revision: Date;
  proxima_revision: Date;
}

export interface ComplianceRequirement {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'met' | 'not-met' | 'partial';
  evidencia?: string;
}

export interface ModelAudit {
  id: string;
  fecha: Date;
  auditor: string;
  tipo: 'compliance' | 'performance' | 'security' | 'fairness';
  hallazgos: string[];
  recomendaciones: string[];
  estado: 'pending' | 'resolved' | 'accepted_risk';
}

export interface ExperimentTracking {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'planning' | 'running' | 'completed' | 'failed';
  datasetId: string;
  runs: ExperimentRun[];
  mejorRun?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ExperimentRun {
  id: string;
  numero: number;
  nombre: string;
  hiperparametros: Hyperparameter[];
  metricas: MetricasModelo;
  duracion: number;
  artefactos: string[];
  notas: string;
  timestamp: Date;
}

export interface ModelRegistry {
  id: string;
  nombre: string;
  stage: 'None' | 'Staging' | 'Production' | 'Archived';
  modelVersion: string;
  fechaRegistro: Date;
  registradoPor: string;
  transiciones: RegistroTransicion[];
}

export interface RegistroTransicion {
  desde_stage: string;
  hasta_stage: string;
  timestamp: Date;
  usuario: string;
  razon: string;
}

export interface ModelComparison {
  id: string;
  modelos_comparados: string[]; // IDs
  criterios: string[];
  resultados: Record<string, MetricasModelo>;
  ganador?: string;
  analisis: string;
  timestamp: Date;
}

// Response wrapper
export interface ResponseMLModels<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  error?: string;
}
