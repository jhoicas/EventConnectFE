import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mlModelsService } from '../services/mlModelsService';
import type {
  MLModel,
  TrainingJob,
  Dataset,
  ModelDeployment,
  ExperimentTracking,
  ModelRegistry,
  ModelComparison,
} from '../types';

const QUERY_KEYS = {
  models: ['models'],
  training: ['training'],
  datasets: ['datasets'],
  deployments: ['deployments'],
  predictions: ['predictions'],
  monitoring: ['monitoring'],
  versioning: ['versioning'],
  governance: ['governance'],
  experiments: ['experiments'],
  registry: ['registry'],
  comparisons: ['comparisons'],
};

// Model Management Hooks
export const useListarModelos = (tipo?: string, estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.models, 'list', tipo, estado],
    queryFn: async () => {
      const { data } = await mlModelsService.modelService.listarModelos(tipo, estado);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useObtenerModelo = (modelId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.models, modelId],
    queryFn: async () => {
      const { data } = await mlModelsService.modelService.obtenerModelo(modelId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!modelId,
  });
};

export const useCrearModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<MLModel>) =>
      mlModelsService.modelService.crearModelo(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

export const useActualizarModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, datos }: { modelId: string; datos: Partial<MLModel> }) =>
      mlModelsService.modelService.actualizarModelo(modelId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

export const useArchivarModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modelId: string) => mlModelsService.modelService.archivarModelo(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

export const useClonarModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, nombre }: { modelId: string; nombre: string }) =>
      mlModelsService.modelService.clonarModelo(modelId, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

export const useValidarModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modelId: string) => mlModelsService.modelService.validarModelo(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

// Training Hooks
export const useListarTrainings = (estado?: string, modelId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.training, 'list', estado, modelId],
    queryFn: async () => {
      const { data } = await mlModelsService.trainingService.listarTrainings(estado, modelId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

export const useObtenerTraining = (jobId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.training, jobId],
    queryFn: async () => {
      const { data } = await mlModelsService.trainingService.obtenerTraining(jobId);
      return data;
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!jobId,
  });
};

export const useIniciarEntrenamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<TrainingJob>) =>
      mlModelsService.trainingService.iniciarEntrenamiento(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.training });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

export const usePausarTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => mlModelsService.trainingService.pausarTraining(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.training });
    },
  });
};

export const useReanudarTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => mlModelsService.trainingService.reanudarTraining(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.training });
    },
  });
};

export const useCancelarTraining = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => mlModelsService.trainingService.cancelarTraining(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.training });
    },
  });
};

export const useObtenerLogsTraining = (jobId: string, ultimas_lineas?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.training, 'logs', jobId, ultimas_lineas],
    queryFn: async () => {
      const { data } = await mlModelsService.trainingService.obtenerLogsTraining(jobId, ultimas_lineas);
      return data;
    },
    staleTime: 1 * 60 * 1000,
    enabled: !!jobId,
  });
};

// Dataset Hooks
export const useListarDatasets = (validado?: boolean) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.datasets, 'list', validado],
    queryFn: async () => {
      const { data } = await mlModelsService.datasetService.listarDatasets(validado);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerDataset = (datasetId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.datasets, datasetId],
    queryFn: async () => {
      const { data } = await mlModelsService.datasetService.obtenerDataset(datasetId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!datasetId,
  });
};

export const useCrearDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<Dataset>) =>
      mlModelsService.datasetService.crearDataset(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.datasets });
    },
  });
};

export const useAnalizarDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datasetId: string) => mlModelsService.datasetService.analizarDataset(datasetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.datasets });
    },
  });
};

export const useValidarDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datasetId: string) => mlModelsService.datasetService.validarDataset(datasetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.datasets });
    },
  });
};

export const useLimpiarDataset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ datasetId, opciones }: { datasetId: string; opciones: any }) =>
      mlModelsService.datasetService.limpiarDataset(datasetId, opciones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.datasets });
    },
  });
};

// Deployment Hooks
export const useListarDespliegues = (ambiente?: string, estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.deployments, 'list', ambiente, estado],
    queryFn: async () => {
      const { data } = await mlModelsService.deploymentService.listarDespliegues(ambiente, estado);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useObtenerDespliegue = (deploymentId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.deployments, deploymentId],
    queryFn: async () => {
      const { data } = await mlModelsService.deploymentService.obtenerDespliegue(deploymentId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!deploymentId,
  });
};

export const useDesplegarModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<ModelDeployment>) =>
      mlModelsService.deploymentService.desplegarModelo(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deployments });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

export const usePausarDespliegue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deploymentId: string) => mlModelsService.deploymentService.pausarDespliegue(deploymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deployments });
    },
  });
};

export const useReanudarDespliegue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deploymentId: string) => mlModelsService.deploymentService.reanudarDespliegue(deploymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deployments });
    },
  });
};

export const useEscalarDespliegue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deploymentId, replicas }: { deploymentId: string; replicas: number }) =>
      mlModelsService.deploymentService.escalarDespliegue(deploymentId, replicas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deployments });
    },
  });
};

// Inference Hooks
export const useListarPredicciones = (deploymentId?: string, estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.predictions, 'list', deploymentId, estado],
    queryFn: async () => {
      const { data } = await mlModelsService.inferenceService.listarPredicciones(deploymentId, estado);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerPrediccion = (predictionId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.predictions, predictionId],
    queryFn: async () => {
      const { data } = await mlModelsService.inferenceService.obtenerPrediccion(predictionId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!predictionId,
  });
};

export const useRealizarPrediccion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deploymentId, datos }: { deploymentId: string; datos: any }) =>
      mlModelsService.inferenceService.realizarPrediccion(deploymentId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.predictions });
    },
  });
};

export const usePrediccionEnLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deploymentId, lote }: { deploymentId: string; lote: any[] }) =>
      mlModelsService.inferenceService.prediccionEnLote(deploymentId, lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.predictions });
    },
  });
};

export const useExplicarPrediccion = () => {
  return useMutation({
    mutationFn: ({ predictionId, metodo }: { predictionId: string; metodo: string }) =>
      mlModelsService.inferenceService.explicarPrediccion(predictionId, metodo),
  });
};

export const useObtenerMetricasInferencia = (deploymentId?: string, periodo?: any) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.predictions, 'metrics', deploymentId, periodo],
    queryFn: async () => {
      if (!deploymentId) return null;
      const { data } = await mlModelsService.inferenceService.obtenerMetricasInferencia(deploymentId, periodo);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!deploymentId,
  });
};

// Monitoring Hooks
export const useListarMonitores = (modelId?: string, deploymentId?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.monitoring, 'list', modelId, deploymentId],
    queryFn: async () => {
      const { data } = await mlModelsService.monitoringService.listarMonitores(modelId, deploymentId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
};

export const useObtenerMonitor = (monitoringId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.monitoring, monitoringId],
    queryFn: async () => {
      const { data } = await mlModelsService.monitoringService.obtenerMonitor(monitoringId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!monitoringId,
  });
};

export const useDetectarDrift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, umbral }: { modelId: string; umbral?: number }) =>
      mlModelsService.monitoringService.detectarDrift(modelId, umbral),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitoring });
    },
  });
};

export const useActivarReentrenamiento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modelId: string) => mlModelsService.monitoringService.activarReentrenamiento(modelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.training });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.monitoring });
    },
  });
};

// Versioning Hooks
export const useListarVersiones = (modelId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.versioning, 'list', modelId],
    queryFn: async () => {
      const { data } = await mlModelsService.versioningService.listarVersiones(modelId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!modelId,
  });
};

export const useObtenerVersion = (modelId: string, versionNumber: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.versioning, modelId, versionNumber],
    queryFn: async () => {
      const { data } = await mlModelsService.versioningService.obtenerVersion(modelId, versionNumber);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!modelId && !!versionNumber,
  });
};

export const useCompararVersiones = (modelId: string, v1: string, v2: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.versioning, 'compare', modelId, v1, v2],
    queryFn: async () => {
      const { data } = await mlModelsService.versioningService.compararVersiones(modelId, v1, v2);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!modelId && !!v1 && !!v2,
  });
};

export const useRevertirVersion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, versionNumber }: { modelId: string; versionNumber: string }) =>
      mlModelsService.versioningService.revertirVersion(modelId, versionNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versioning });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.models });
    },
  });
};

// Governance Hooks
export const useObtenerGovernanza = (modelId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.governance, modelId],
    queryFn: async () => {
      const { data } = await mlModelsService.governanceService.obtenerGovernanza(modelId);
      return data;
    },
    staleTime: 15 * 60 * 1000,
    enabled: !!modelId,
  });
};

export const useRealizarAuditoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, tipo }: { modelId: string; tipo: string }) =>
      mlModelsService.governanceService.realizarAuditoria(modelId, tipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.governance });
    },
  });
};

export const useEvaluarEquidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, grupos_protegidos }: { modelId: string; grupos_protegidos: string[] }) =>
      mlModelsService.governanceService.evaluarEquidad(modelId, grupos_protegidos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.governance });
    },
  });
};

// Experiment Hooks
export const useListarExperimentos = (estado?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.experiments, 'list', estado],
    queryFn: async () => {
      const { data } = await mlModelsService.experimentService.listarExperimentos(estado);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerExperimento = (experimentId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.experiments, experimentId],
    queryFn: async () => {
      const { data } = await mlModelsService.experimentService.obtenerExperimento(experimentId);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!experimentId,
  });
};

export const useCrearExperimento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<ExperimentTracking>) =>
      mlModelsService.experimentService.crearExperimento(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.experiments });
    },
  });
};

// Registry Hooks
export const useListarModelosRegistrados = (stage?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.registry, 'list', stage],
    queryFn: async () => {
      const { data } = await mlModelsService.registryService.listarModelosRegistrados(stage);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerProductionModels = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.registry, 'production'],
    queryFn: async () => {
      const { data } = await mlModelsService.registryService.obtenerProductionModels();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useRegistrarModelo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<ModelRegistry>) =>
      mlModelsService.registryService.registrarModelo(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.registry });
    },
  });
};

export const useTransicionarStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ registryId, nuevoStage, razon }: { registryId: string; nuevoStage: string; razon: string }) =>
      mlModelsService.registryService.transicionarStage(registryId, nuevoStage, razon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.registry });
    },
  });
};

// Comparison Hooks
export const useListarComparaciones = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.comparisons, 'list'],
    queryFn: async () => {
      const { data } = await mlModelsService.comparisonService.listarComparaciones();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerComparacion = (comparisonId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.comparisons, comparisonId],
    queryFn: async () => {
      const { data } = await mlModelsService.comparisonService.obtenerComparacion(comparisonId);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!comparisonId,
  });
};

export const useCrearComparacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<ModelComparison>) =>
      mlModelsService.comparisonService.crearComparacion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comparisons });
    },
  });
};
