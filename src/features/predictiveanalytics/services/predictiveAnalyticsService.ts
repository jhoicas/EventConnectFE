import axiosInstance from '@/lib/axios';

const API_BASE = '/api/predictive-analytics';

// Time Series Analysis
export const timeSeriesService = {
  async listarSeries(filtros?: {
    busqueda?: string;
    metrica?: string;
    frecuencia?: string;
  }) {
    const { data } = await axiosInstance.get(`${API_BASE}/time-series`, { params: filtros });
    return data;
  },

  async obtenerSerie(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/time-series/${id}`);
    return data;
  },

  async crearSerie(payload: {
    nombre: string;
    metrica: string;
    frecuencia: string;
    valores: any[];
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/time-series`, payload);
    return data;
  },

  async actualizarSerie(
    id: string,
    payload: {
      nombre?: string;
      frecuencia?: string;
    }
  ) {
    const { data } = await axiosInstance.patch(`${API_BASE}/time-series/${id}`, payload);
    return data;
  },

  async eliminarSerie(id: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/time-series/${id}`);
    return data;
  },

  async importarDatos(id: string, archivo: File) {
    const formData = new FormData();
    formData.append('file', archivo);
    const { data } = await axiosInstance.post(`${API_BASE}/time-series/${id}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

// Trend Analysis
export const trendService = {
  async analizarTendencia(timeSeriesId: string, periodoAnalisis?: { inicio: string; fin: string }) {
    const { data } = await axiosInstance.post(`${API_BASE}/trend/analyze`, {
      timeSeriesId,
      periodoAnalisis,
    });
    return data;
  },

  async detectarCambiosTendencia(timeSeriesId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/trend/${timeSeriesId}/changes`);
    return data;
  },

  async proyectarTendencia(timeSeriesId: string, periodos: number) {
    const { data } = await axiosInstance.post(`${API_BASE}/trend/project`, {
      timeSeriesId,
      periodos,
    });
    return data;
  },

  async obtenerTendenciaComparativa(
    timeSeriesId: string,
    periodo1: { inicio: string; fin: string },
    periodo2: { inicio: string; fin: string }
  ) {
    const { data } = await axiosInstance.post(`${API_BASE}/trend/compare`, {
      timeSeriesId,
      periodo1,
      periodo2,
    });
    return data;
  },
};

// Seasonality Detection
export const seasonalityService = {
  async detectarEstacionalidad(timeSeriesId: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/seasonality/detect`, {
      timeSeriesId,
    });
    return data;
  },

  async descomponerSerieemporal(timeSeriesId: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/seasonality/decompose`, {
      timeSeriesId,
    });
    return data;
  },

  async obtenerFactoresEstacionales(timeSeriesId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/seasonality/${timeSeriesId}/factors`);
    return data;
  },

  async analizarCiclos(timeSeriesId: string, frecuencia: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/seasonality/cycles`, {
      timeSeriesId,
      frecuencia,
    });
    return data;
  },

  async ajustarPorEstacionalidad(timeSeriesId: string) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/seasonality/${timeSeriesId}/adjust`,
      {}
    );
    return data;
  },
};

// Forecasting
export const forecastService = {
  async generarPronostico(
    timeSeriesId: string,
    payload: {
      modelo: string;
      periodos: number;
      nivelConfianza?: number;
    }
  ) {
    const { data } = await axiosInstance.post(`${API_BASE}/forecast/generate`, {
      timeSeriesId,
      ...payload,
    });
    return data;
  },

  async listarPronosticos(timeSeriesId?: string, filtros?: { modelo?: string; estado?: string }) {
    const { data } = await axiosInstance.get(`${API_BASE}/forecast`, {
      params: {
        timeSeriesId,
        ...filtros,
      },
    });
    return data;
  },

  async obtenerPronostico(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/forecast/${id}`);
    return data;
  },

  async actualizarPronostico(id: string, payload: { descripcion?: string; notas?: string }) {
    const { data } = await axiosInstance.patch(`${API_BASE}/forecast/${id}`, payload);
    return data;
  },

  async eliminarPronostico(id: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/forecast/${id}`);
    return data;
  },

  async calcularIntervaloConfianza(
    pronósticoId: string,
    niveles: number[]
  ) {
    const { data } = await axiosInstance.post(`${API_BASE}/forecast/${pronósticoId}/confidence`, {
      niveles,
    });
    return data;
  },

  async compararModelos(timeSeriesId: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/forecast/compare-models`, {
      timeSeriesId,
    });
    return data;
  },

  async reentrenarModelo(pronósticoId: string) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/forecast/${pronósticoId}/retrain`,
      {}
    );
    return data;
  },
};

// Anomaly Detection
export const anomalyService = {
  async detectarAnomalias(timeSeriesId: string, metodo?: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/anomaly/detect`, {
      timeSeriesId,
      metodo,
    });
    return data;
  },

  async listarAnomalias(
    timeSeriesId?: string,
    filtros?: { severidad?: string; tipo?: string }
  ) {
    const { data } = await axiosInstance.get(`${API_BASE}/anomaly`, {
      params: {
        timeSeriesId,
        ...filtros,
      },
    });
    return data;
  },

  async obtenerAnomalia(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/anomaly/${id}`);
    return data;
  },

  async marcarAnomaliaComo(id: string, status: 'resuelta' | 'falso_positivo' | 'investigando') {
    const { data } = await axiosInstance.patch(`${API_BASE}/anomaly/${id}/status`, { status });
    return data;
  },

  async obtenerAlertasAnomalias(timeSeriesId?: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/anomaly/alerts`, {
      params: { timeSeriesId },
    });
    return data;
  },

  async configurarAlertaAnomalia(payload: {
    timeSeriesId: string;
    severidadMinima: string;
    canalesNotificacion: string[];
    habilitada: boolean;
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/anomaly/alert`, payload);
    return data;
  },

  async actualizarAlertaAnomalia(id: string, payload: Partial<any>) {
    const { data } = await axiosInstance.patch(`${API_BASE}/anomaly/alert/${id}`, payload);
    return data;
  },

  async desactivarAlertaAnomalia(id: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/anomaly/alert/${id}`);
    return data;
  },
};

// Scenario Analysis
export const scenarioService = {
  async crearEscenario(payload: {
    nombre: string;
    descripcion: string;
    timeSeriesId: string;
    parametros: any;
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/scenario`, payload);
    return data;
  },

  async listarEscenarios(timeSeriesId?: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/scenario`, {
      params: { timeSeriesId },
    });
    return data;
  },

  async obtenerEscenario(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/scenario/${id}`);
    return data;
  },

  async actualizarEscenario(id: string, payload: Partial<any>) {
    const { data } = await axiosInstance.patch(`${API_BASE}/scenario/${id}`, payload);
    return data;
  },

  async eliminarEscenario(id: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/scenario/${id}`);
    return data;
  },

  async duplicarEscenario(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/scenario/${id}/duplicate`, {});
    return data;
  },

  async exportarEscenario(id: string, formato: 'json' | 'csv' | 'excel') {
    const { data } = await axiosInstance.get(`${API_BASE}/scenario/${id}/export`, {
      params: { formato },
    });
    return data;
  },
};

// Model Management
export const modelService = {
  async listarModelos() {
    const { data } = await axiosInstance.get(`${API_BASE}/models`);
    return data;
  },

  async obtenerModeloDetalle(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/models/${id}`);
    return data;
  },

  async obtenerPerformanceModelo(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/models/${id}/performance`);
    return data;
  },

  async obtenerFeatureImportance(modeloId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/models/${modeloId}/features`);
    return data;
  },

  async reentrenarModelo(modeloId: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/models/${modeloId}/retrain`, {});
    return data;
  },

  async compararVersionesModelo(modeloId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/models/${modeloId}/versions`);
    return data;
  },

  async activarVersionModelo(modeloId: string, versionId: string) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/models/${modeloId}/versions/${versionId}/activate`,
      {}
    );
    return data;
  },

  async obtenerMetricasEntrenamiento(modeloId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/models/${modeloId}/metrics`);
    return data;
  },
};

// Comparative Analysis
export const comparativeService = {
  async compararPeriodos(
    timeSeriesId: string,
    periodo1: { inicio: string; fin: string },
    periodo2: { inicio: string; fin: string }
  ) {
    const { data } = await axiosInstance.post(`${API_BASE}/comparative/periods`, {
      timeSeriesId,
      periodo1,
      periodo2,
    });
    return data;
  },

  async compararSeries(seriesIds: string[], periodo: { inicio: string; fin: string }) {
    const { data } = await axiosInstance.post(`${API_BASE}/comparative/series`, {
      seriesIds,
      periodo,
    });
    return data;
  },

  async obtenerCorrelaciones(seriesIds: string[]) {
    const { data } = await axiosInstance.post(`${API_BASE}/comparative/correlations`, {
      seriesIds,
    });
    return data;
  },

  async analizarCausalidad(
    timeSeriesId1: string,
    timeSeriesId2: string,
    lagMaximo?: number
  ) {
    const { data } = await axiosInstance.post(`${API_BASE}/comparative/causality`, {
      timeSeriesId1,
      timeSeriesId2,
      lagMaximo,
    });
    return data;
  },
};

// Export & Reporting
export const exportService = {
  async generarReporte(
    timeSeriesId: string,
    formato: 'pdf' | 'excel' | 'html',
    opciones?: {
      incluirPronostico?: boolean;
      incluirAnomalias?: boolean;
      incluirTendencia?: boolean;
    }
  ) {
    const { data } = await axiosInstance.post(`${API_BASE}/export/report`, {
      timeSeriesId,
      formato,
      opciones,
    });
    return data;
  },

  async programarReporte(payload: {
    timeSeriesId: string;
    nombre: string;
    formato: string;
    frecuencia: string;
    destinatarios: string[];
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/export/schedule`, payload);
    return data;
  },

  async descargarDatos(timeSeriesId: string, formato: 'csv' | 'json' | 'excel') {
    const { data } = await axiosInstance.get(`${API_BASE}/export/data`, {
      params: { timeSeriesId, formato },
    });
    return data;
  },

  async exportarVisualizacion(pronósticoId: string, formato: 'png' | 'svg' | 'pdf') {
    const { data } = await axiosInstance.get(`${API_BASE}/export/visualization`, {
      params: { pronósticoId, formato },
    });
    return data;
  },
};
