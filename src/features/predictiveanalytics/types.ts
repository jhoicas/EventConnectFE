// Types for Advanced Predictive Analytics Module

// Union Types
export type ModelType = 'arima' | 'exponentialSmoothing' | 'prophet' | 'linearRegression' | 'neuralNetwork' | 'randomForest';
export type TrendType = 'upward' | 'downward' | 'stable' | 'cyclical';
export type SeasonalityFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type AnomalyType = 'outlier' | 'level_shift' | 'trend_change' | 'seasonal_anomaly';
export type ForecastAccuracy = 'excellent' | 'good' | 'fair' | 'poor';

// Time Series Data
export interface TimeSeriesData {
  id: string;
  nombre: string;
  metrica: string;
  valores: TimeSeriesPoint[];
  frecuencia: SeasonalityFrequency;
  unidad: string;
  fechaInicio: string;
  fechaFin: string;
  totalPuntos: number;
  intervaloMuestreo: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  valor: number;
  valuePredictedByModel?: number;
}

// Trend Analysis
export interface TrendAnalysis {
  tipo: TrendType;
  pendiente: number;
  forcaJaWilcoxon: number;
  cambioPromedio: number;
  velocidadCambio: number;
  confianzaTrend: number; // 0-100
  periodoAnalisis: string;
  proyeccionUltimos30Dias: number[];
}

// Seasonality Detection
export interface SeasonalityPattern {
  id: string;
  frecuencia: SeasonalityFrequency;
  amplitud: number;
  fase: number;
  fortaleza: number; // 0-100 (how strong is seasonality)
  patron: number[]; // Normalized seasonal pattern
  periodoCiclo: number; // Length of seasonal cycle
  factoresEstacionales: {
    periodo: string;
    factor: number;
  }[];
  decomposicion: TimeSeriesDecomposition;
}

export interface TimeSeriesDecomposition {
  trend: number[];
  seasonal: number[];
  residual: number[];
  originalSeries: number[];
}

// Forecast Results
export interface ForecastResult {
  id: string;
  timeSeriesId: string;
  modeloUtilizado: ModelType;
  fechaGeneracion: string;
  periodoForecast: ForecastPeriod;
  predicciones: ForecastPoint[];
  intervaloConfianza: ConfidenceInterval[];
  metricasEvaluacion: ModelMetrics;
  tasaAcierto: number;
  precisión: ForecastAccuracy;
  proximaActualizacion: string;
  notas: string;
}

export interface ForecastPeriod {
  inicio: string;
  fin: string;
  pasos: number;
  granularidad: SeasonalityFrequency;
}

export interface ForecastPoint {
  timestamp: string;
  valorPredicho: number;
  intervaloInferior: number;
  intervaloSuperior: number;
  desvioEstandar: number;
}

export interface ConfidenceInterval {
  nivel: 80 | 90 | 95 | 99;
  intervaloInferior: number[];
  intervaloSuperior: number[];
  margenError: number;
}

// Model Metrics
export interface ModelMetrics {
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Square Error
  mape: number; // Mean Absolute Percentage Error
  mse: number; // Mean Squared Error
  direccionalidad: number; // Accuracy of direction (up/down)
  r2Score: number; // R-squared
  aic: number; // Akaike Information Criterion
  bic: number; // Bayesian Information Criterion
  testRMSE: number; // Test set RMSE
  trainRMSE: number; // Train set RMSE
}

// Anomaly Detection
export interface AnomalyDetection {
  id: string;
  timeSeriesId: string;
  tipo: AnomalyType;
  fechaDeteccion: string;
  puntoAnomalo: TimeSeriesPoint;
  desvioEstandar: number; // How many std deviations from expected
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  impacto: number; // 0-100
  patternAnomalo: string;
  recomendacion: string;
  descubiertoPor: string; // Method used to detect
}

export interface AnomalyAlert {
  id: string;
  anomalidadId: string;
  timeSeriesId: string;
  habilitada: boolean;
  umbrallaSeveridad: 'baja' | 'media' | 'alta' | 'critica';
  notificacionActivada: boolean;
  canalesNotificacion: ('email' | 'push' | 'sms' | 'slack')[];
  ultimaAlerta: string;
  contadorAnomalias: number;
}

// Model Comparison
export interface ModelComparison {
  id: string;
  timeSeriesId: string;
  modelos: {
    modelo: ModelType;
    rmse: number;
    mape: number;
    tiempoEntrenamiento: number;
    complejidad: 'baja' | 'media' | 'alta';
    interpretabilidad: 'alta' | 'media' | 'baja';
  }[];
  modeloRecomendado: ModelType;
  razonRecomendacion: string;
  actualizacion: string;
}

// Scenario Analysis
export interface ScenarioForecast {
  id: string;
  nombre: string;
  descripcion: string;
  timeSeriesId: string;
  parametrosAjuste: {
    escala: number; // Multiplicador
    tendenciaAjuste: number;
    estacionalidadAjuste: number;
    noiseLevel: number;
  };
  predicciones: ForecastPoint[];
  probabilidadOcurrencia: number; // 0-100
  peorCaso: number[];
  mejorCaso: number[];
  casoPromedio: number[];
}

// Historical Comparison
export interface ComparativaHistorica {
  periodoActual: {
    fechaInicio: string;
    fechaFin: string;
    valor: number;
    promedio: number;
    desvio: number;
  };
  periodoPasado: {
    fechaInicio: string;
    fechaFin: string;
    valor: number;
    promedio: number;
    desvio: number;
  };
  cambioAbsoluto: number;
  cambioRelativo: number;
  tendenciaRelativa: 'mejora' | 'empeoramiento' | 'estable';
}

// Feature Importance (for ML models)
export interface FeatureImportance {
  caracteristica: string;
  importancia: number; // 0-1
  tendencia: 'aumentando' | 'disminuyendo' | 'estable';
  influenciaPronostico: number; // 0-100
  correlacion: number; // -1 to 1
}

// Model Performance Tracking
export interface ModelPerformanceTrack {
  id: string;
  modeloId: string;
  modeloTipo: ModelType;
  fechaEntrenamiento: string;
  metricas: ModelMetrics;
  datasetSize: number;
  periodoEntrenamiento: ForecastPeriod;
  ultimaActualizacion: string;
  proxiAReentrenamiento: string;
  estadoModelo: 'activo' | 'inactivo' | 'requiere_reentrenamiento';
}

// Response Wrapper
export interface ResponsePredictiveAnalytics<T> {
  data: T;
  success: boolean;
  message: string;
  timestamp: string;
  metadata?: {
    processingTime: number;
    dataPoints: number;
    confidence: number;
  };
}
