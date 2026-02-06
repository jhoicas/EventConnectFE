import axiosInstance from '@/lib/axios';
import type {
  MLModel,
  TrainingJob,
  Dataset,
  ModelDeployment,
  Prediction,
  ModelMonitoring,
  ModelVersion,
  ModelGovernance,
  ExperimentTracking,
  ModelRegistry,
  ModelComparison,
  ResponseMLModels,
} from '../types';

const API_BASE = '/api/ml-models';

// Model Management Service
const modelService = {
  crearModelo: (datos: Partial<MLModel>) =>
    axiosInstance.post<ResponseMLModels<MLModel>>(
      `${API_BASE}/models`,
      datos
    ),

  listarModelos: (tipo?: string, estado?: string) =>
    axiosInstance.get<ResponseMLModels<MLModel[]>>(
      `${API_BASE}/models`,
      { params: { tipo, estado } }
    ),

  obtenerModelo: (modelId: string) =>
    axiosInstance.get<ResponseMLModels<MLModel>>(
      `${API_BASE}/models/${modelId}`
    ),

  actualizarModelo: (modelId: string, datos: Partial<MLModel>) =>
    axiosInstance.put<ResponseMLModels<MLModel>>(
      `${API_BASE}/models/${modelId}`,
      datos
    ),

  eliminarModelo: (modelId: string) =>
    axiosInstance.delete<ResponseMLModels>(
      `${API_BASE}/models/${modelId}`
    ),

  archivarModelo: (modelId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/archive`
    ),

  clonarModelo: (modelId: string, nombre: string) =>
    axiosInstance.post<ResponseMLModels<MLModel>>(
      `${API_BASE}/models/${modelId}/clone`,
      { nombre }
    ),

  obtenerHistorialCambios: (modelId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/changes`
    ),

  validarModelo: (modelId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/validate`
    ),

  exportarModelo: (modelId: string, formato: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/export`,
      { params: { formato } }
    ),
};

// Training Service
const trainingService = {
  iniciarEntrenamiento: (datos: Partial<TrainingJob>) =>
    axiosInstance.post<ResponseMLModels<TrainingJob>>(
      `${API_BASE}/training/jobs`,
      datos
    ),

  listarTrainings: (estado?: string, modelId?: string) =>
    axiosInstance.get<ResponseMLModels<TrainingJob[]>>(
      `${API_BASE}/training/jobs`,
      { params: { estado, modelId } }
    ),

  obtenerTraining: (jobId: string) =>
    axiosInstance.get<ResponseMLModels<TrainingJob>>(
      `${API_BASE}/training/jobs/${jobId}`
    ),

  pausarTraining: (jobId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/training/jobs/${jobId}/pause`
    ),

  reanudarTraining: (jobId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/training/jobs/${jobId}/resume`
    ),

  cancelarTraining: (jobId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/training/jobs/${jobId}/cancel`
    ),

  obtenerLogsTraining: (jobId: string, ultimas_lineas?: number) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/training/jobs/${jobId}/logs`,
      { params: { ultimas_lineas } }
    ),

  optimizarHiperparametros: (modelId: string, algoritmo: string, restricciones?: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/training/hyperparameter-optimization`,
      { modelId, algoritmo, restricciones }
    ),

  compararRunsEntrenamiento: (jobIds: string[]) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/training/compare-runs`,
      { jobIds }
    ),
};

// Dataset Service
const datasetService = {
  crearDataset: (datos: Partial<Dataset>) =>
    axiosInstance.post<ResponseMLModels<Dataset>>(
      `${API_BASE}/datasets`,
      datos
    ),

  listarDatasets: (validado?: boolean) =>
    axiosInstance.get<ResponseMLModels<Dataset[]>>(
      `${API_BASE}/datasets`,
      { params: { validado } }
    ),

  obtenerDataset: (datasetId: string) =>
    axiosInstance.get<ResponseMLModels<Dataset>>(
      `${API_BASE}/datasets/${datasetId}`
    ),

  actualizarDataset: (datasetId: string, datos: Partial<Dataset>) =>
    axiosInstance.put<ResponseMLModels<Dataset>>(
      `${API_BASE}/datasets/${datasetId}`,
      datos
    ),

  analizarDataset: (datasetId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/datasets/${datasetId}/analyze`
    ),

  validarDataset: (datasetId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/datasets/${datasetId}/validate`
    ),

  limpiarDataset: (datasetId: string, opciones: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/datasets/${datasetId}/clean`,
      opciones
    ),

  dividirDataset: (datasetId: string, splits: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/datasets/${datasetId}/split`,
      splits
    ),

  detectarOutliers: (datasetId: string, metodo?: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/datasets/${datasetId}/outliers`,
      { metodo }
    ),

  exportarDataset: (datasetId: string, formato: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/datasets/${datasetId}/export`,
      { params: { formato } }
    ),
};

// Deployment Service
const deploymentService = {
  desplegarModelo: (datos: Partial<ModelDeployment>) =>
    axiosInstance.post<ResponseMLModels<ModelDeployment>>(
      `${API_BASE}/deployments`,
      datos
    ),

  listarDespliegues: (ambiente?: string, estado?: string) =>
    axiosInstance.get<ResponseMLModels<ModelDeployment[]>>(
      `${API_BASE}/deployments`,
      { params: { ambiente, estado } }
    ),

  obtenerDespliegue: (deploymentId: string) =>
    axiosInstance.get<ResponseMLModels<ModelDeployment>>(
      `${API_BASE}/deployments/${deploymentId}`
    ),

  actualizarDespliegue: (deploymentId: string, datos: Partial<ModelDeployment>) =>
    axiosInstance.put<ResponseMLModels<ModelDeployment>>(
      `${API_BASE}/deployments/${deploymentId}`,
      datos
    ),

  pausarDespliegue: (deploymentId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/deployments/${deploymentId}/pause`
    ),

  reanudarDespliegue: (deploymentId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/deployments/${deploymentId}/resume`
    ),

  escalarDespliegue: (deploymentId: string, replicas: number) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/deployments/${deploymentId}/scale`,
      { replicas }
    ),

  testDespliegue: (deploymentId: string, testData: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/deployments/${deploymentId}/test`,
      { testData }
    ),

  obtenerHistorialDespliegues: (modelId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/deployments/model/${modelId}/history`
    ),

  promoverEntreAmbientes: (deploymentId: string, ambiente_destino: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/deployments/${deploymentId}/promote`,
      { ambiente_destino }
    ),
};

// Inference Service
const inferenceService = {
  realizarPrediccion: (deploymentId: string, datos: any) =>
    axiosInstance.post<ResponseMLModels<Prediction>>(
      `${API_BASE}/inference/predict`,
      { deploymentId, datos }
    ),

  prediccionEnLote: (deploymentId: string, lote: any[]) =>
    axiosInstance.post<ResponseMLModels<Prediction[]>>(
      `${API_BASE}/inference/batch-predict`,
      { deploymentId, lote }
    ),

  obtenerPrediccion: (predictionId: string) =>
    axiosInstance.get<ResponseMLModels<Prediction>>(
      `${API_BASE}/inference/predictions/${predictionId}`
    ),

  listarPredicciones: (deploymentId?: string, estado?: string) =>
    axiosInstance.get<ResponseMLModels<Prediction[]>>(
      `${API_BASE}/inference/predictions`,
      { params: { deploymentId, estado } }
    ),

  explicarPrediccion: (predictionId: string, metodo: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/inference/predictions/${predictionId}/explain`,
      { metodo }
    ),

  registrarFeedback: (predictionId: string, feedback: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/inference/predictions/${predictionId}/feedback`,
      feedback
    ),

  obtenerMetricasInferencia: (deploymentId: string, periodo?: any) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/inference/metrics`,
      { params: { deploymentId, periodo } }
    ),

  optimizarLatencia: (deploymentId: string, opciones: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/inference/optimize-latency`,
      { deploymentId, opciones }
    ),

  establecerSLAs: (deploymentId: string, slas: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/inference/slas`,
      { deploymentId, slas }
    ),
};

// Monitoring Service
const monitoringService = {
  crearMonitor: (datos: Partial<ModelMonitoring>) =>
    axiosInstance.post<ResponseMLModels<ModelMonitoring>>(
      `${API_BASE}/monitoring`,
      datos
    ),

  listarMonitores: (modelId?: string, deploymentId?: string) =>
    axiosInstance.get<ResponseMLModels<ModelMonitoring[]>>(
      `${API_BASE}/monitoring`,
      { params: { modelId, deploymentId } }
    ),

  obtenerMonitor: (monitoringId: string) =>
    axiosInstance.get<ResponseMLModels<ModelMonitoring>>(
      `${API_BASE}/monitoring/${monitoringId}`
    ),

  detectarDrift: (modelId: string, umbral?: number) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/monitoring/detect-drift`,
      { modelId, umbral }
    ),

  obtenerDrift: (modelId: string, dias?: number) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/monitoring/drift`,
      { params: { modelId, dias } }
    ),

  activarReentrenamiento: (modelId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/monitoring/trigger-retraining`,
      { modelId }
    ),

  generarReporteMonitoreo: (modelId: string, periodo: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/monitoring/report`,
      { modelId, periodo }
    ),

  obtenerAnomalias: (monitoringId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/monitoring/${monitoringId}/anomalies`
    ),

  investigarAnomalia: (anomalyId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/monitoring/anomalies/${anomalyId}/investigate`
    ),
};

// Versioning Service
const versioningService = {
  crearVersion: (modelId: string, datos: Partial<ModelVersion>) =>
    axiosInstance.post<ResponseMLModels<ModelVersion>>(
      `${API_BASE}/models/${modelId}/versions`,
      datos
    ),

  listarVersiones: (modelId: string) =>
    axiosInstance.get<ResponseMLModels<ModelVersion[]>>(
      `${API_BASE}/models/${modelId}/versions`
    ),

  obtenerVersion: (modelId: string, versionNumber: string) =>
    axiosInstance.get<ResponseMLModels<ModelVersion>>(
      `${API_BASE}/models/${modelId}/versions/${versionNumber}`
    ),

  compararVersiones: (modelId: string, v1: string, v2: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/versions/compare`,
      { params: { v1, v2 } }
    ),

  revertirVersion: (modelId: string, versionNumber: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/versions/${versionNumber}/revert`
    ),

  etiquetarVersion: (modelId: string, versionNumber: string, etiqueta: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/versions/${versionNumber}/tag`,
      { etiqueta }
    ),

  obtenerMetadatos: (modelId: string, versionNumber: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/versions/${versionNumber}/metadata`
    ),

  obtenerArtefactos: (modelId: string, versionNumber: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/models/${modelId}/versions/${versionNumber}/artifacts`
    ),
};

// Governance Service
const governanceService = {
  crearGovernanza: (datos: Partial<ModelGovernance>) =>
    axiosInstance.post<ResponseMLModels<ModelGovernance>>(
      `${API_BASE}/governance`,
      datos
    ),

  obtenerGovernanza: (modelId: string) =>
    axiosInstance.get<ResponseMLModels<ModelGovernance>>(
      `${API_BASE}/governance/${modelId}`
    ),

  actualizarGovernanza: (modelId: string, datos: Partial<ModelGovernance>) =>
    axiosInstance.put<ResponseMLModels<ModelGovernance>>(
      `${API_BASE}/governance/${modelId}`,
      datos
    ),

  realizarAuditoria: (modelId: string, tipo: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/governance/${modelId}/audit`,
      { tipo }
    ),

  obtenerAuditorias: (modelId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/governance/${modelId}/audits`
    ),

  documentarModelo: (modelId: string, documentacion: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/governance/${modelId}/documentation`,
      documentacion
    ),

  evaluarEquidad: (modelId: string, grupos_protegidos: string[]) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/governance/${modelId}/fairness-assessment`,
      { grupos_protegidos }
    ),

  obtenerRiesgos: (modelId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/governance/${modelId}/risks`
    ),

  generarReporteGovernanza: (modelId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/governance/${modelId}/report`
    ),
};

// Experiment Tracking Service
const experimentService = {
  crearExperimento: (datos: Partial<ExperimentTracking>) =>
    axiosInstance.post<ResponseMLModels<ExperimentTracking>>(
      `${API_BASE}/experiments`,
      datos
    ),

  listarExperimentos: (estado?: string) =>
    axiosInstance.get<ResponseMLModels<ExperimentTracking[]>>(
      `${API_BASE}/experiments`,
      { params: { estado } }
    ),

  obtenerExperimento: (experimentId: string) =>
    axiosInstance.get<ResponseMLModels<ExperimentTracking>>(
      `${API_BASE}/experiments/${experimentId}`
    ),

  registrarRun: (experimentId: string, datos: any) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/experiments/${experimentId}/runs`,
      datos
    ),

  compararRuns: (experimentId: string, runIds: string[]) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/experiments/${experimentId}/compare-runs`,
      { runIds }
    ),

  obtenerMejorRun: (experimentId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/experiments/${experimentId}/best-run`
    ),

  exportarExperimento: (experimentId: string, formato: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/experiments/${experimentId}/export`,
      { params: { formato } }
    ),

  reproducirRun: (experimentId: string, runId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/experiments/${experimentId}/runs/${runId}/reproduce`
    ),

  obtenerArtifactos: (experimentId: string, runId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/experiments/${experimentId}/runs/${runId}/artifacts`
    ),
};

// Model Registry Service
const registryService = {
  registrarModelo: (datos: Partial<ModelRegistry>) =>
    axiosInstance.post<ResponseMLModels<ModelRegistry>>(
      `${API_BASE}/registry`,
      datos
    ),

  listarModelosRegistrados: (stage?: string) =>
    axiosInstance.get<ResponseMLModels<ModelRegistry[]>>(
      `${API_BASE}/registry`,
      { params: { stage } }
    ),

  obtenerRegistro: (registryId: string) =>
    axiosInstance.get<ResponseMLModels<ModelRegistry>>(
      `${API_BASE}/registry/${registryId}`
    ),

  transicionarStage: (registryId: string, nuevoStage: string, razon: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/registry/${registryId}/transition`,
      { nuevoStage, razon }
    ),

  obtenerHistorialTransiciones: (registryId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/registry/${registryId}/history`
    ),

  archivarRegistro: (registryId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/registry/${registryId}/archive`
    ),

  obtenerProductionModels: () =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/registry/stage/production`
    ),

  validarPromocion: (registryId: string, targetStage: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/registry/${registryId}/validate-promotion`,
      { targetStage }
    ),
};

// Model Comparison Service
const comparisonService = {
  crearComparacion: (datos: Partial<ModelComparison>) =>
    axiosInstance.post<ResponseMLModels<ModelComparison>>(
      `${API_BASE}/comparisons`,
      datos
    ),

  listarComparaciones: () =>
    axiosInstance.get<ResponseMLModels<ModelComparison[]>>(
      `${API_BASE}/comparisons`
    ),

  obtenerComparacion: (comparisonId: string) =>
    axiosInstance.get<ResponseMLModels<ModelComparison>>(
      `${API_BASE}/comparisons/${comparisonId}`
    ),

  actualizarComparacion: (comparisonId: string, datos: Partial<ModelComparison>) =>
    axiosInstance.put<ResponseMLModels<ModelComparison>>(
      `${API_BASE}/comparisons/${comparisonId}`,
      datos
    ),

  generarAnalisis: (comparisonId: string) =>
    axiosInstance.post<ResponseMLModels>(
      `${API_BASE}/comparisons/${comparisonId}/analyze`
    ),

  generarReporteComparacion: (comparisonId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/comparisons/${comparisonId}/report`
    ),

  visualizarComparacion: (comparisonId: string) =>
    axiosInstance.get<ResponseMLModels>(
      `${API_BASE}/comparisons/${comparisonId}/visualization`
    ),
};

export const mlModelsService = {
  modelService,
  trainingService,
  datasetService,
  deploymentService,
  inferenceService,
  monitoringService,
  versioningService,
  governanceService,
  experimentService,
  registryService,
  comparisonService,
};
