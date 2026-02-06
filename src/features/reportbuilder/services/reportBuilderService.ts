import axiosInstance from '@/lib/axios';

const API_BASE = '/api/report-builder';

// Report Management
export const reportService = {
  async crearReporte(payload: {
    nombre: string;
    descripcion: string;
    tipo: string;
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes`, payload);
    return data;
  },

  async listarReportes(filtro?: {
    tipo?: string;
    estado?: string;
    busqueda?: string;
    pagina?: number;
    limite?: number;
  }) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes`, { params: filtro });
    return data;
  },

  async obtenerReporte(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes/${id}`);
    return data;
  },

  async actualizarReporte(id: string, payload: Partial<any>) {
    const { data } = await axiosInstance.patch(`${API_BASE}/reportes/${id}`, payload);
    return data;
  },

  async eliminarReporte(id: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/reportes/${id}`);
    return data;
  },

  async publicarReporte(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${id}/publicar`, {});
    return data;
  },

  async archivarReporte(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${id}/archivar`, {});
    return data;
  },

  async duplicarReporte(id: string, nuevoNombre: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${id}/duplicar`, {
      nuevoNombre,
    });
    return data;
  },

  async validarReporte(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${id}/validar`, {});
    return data;
  },
};

// Report Pages & Widgets
export const pageWidgetService = {
  async crearPagina(reportId: string, payload: any) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${reportId}/paginas`, payload);
    return data;
  },

  async actualizarPagina(reportId: string, pageId: string, payload: any) {
    const { data } = await axiosInstance.patch(
      `${API_BASE}/reportes/${reportId}/paginas/${pageId}`,
      payload
    );
    return data;
  },

  async eliminarPagina(reportId: string, pageId: string) {
    const { data } = await axiosInstance.delete(
      `${API_BASE}/reportes/${reportId}/paginas/${pageId}`
    );
    return data;
  },

  async crearWidget(reportId: string, pageId: string, payload: any) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/paginas/${pageId}/widgets`,
      payload
    );
    return data;
  },

  async actualizarWidget(reportId: string, pageId: string, widgetId: string, payload: any) {
    const { data } = await axiosInstance.patch(
      `${API_BASE}/reportes/${reportId}/paginas/${pageId}/widgets/${widgetId}`,
      payload
    );
    return data;
  },

  async eliminarWidget(reportId: string, pageId: string, widgetId: string) {
    const { data } = await axiosInstance.delete(
      `${API_BASE}/reportes/${reportId}/paginas/${pageId}/widgets/${widgetId}`
    );
    return data;
  },

  async reordenarWidgets(reportId: string, pageId: string, orden: any[]) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/paginas/${pageId}/widgets/reordenar`,
      { orden }
    );
    return data;
  },
};

// Data Sources
export const dataSourceService = {
  async crearOrigen(reportId: string, payload: any) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/origenes`,
      payload
    );
    return data;
  },

  async listarOrigenes(reportId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes/${reportId}/origenes`);
    return data;
  },

  async obtenerOrigen(reportId: string, origenId: string) {
    const { data } = await axiosInstance.get(
      `${API_BASE}/reportes/${reportId}/origenes/${origenId}`
    );
    return data;
  },

  async actualizarOrigen(reportId: string, origenId: string, payload: any) {
    const { data } = await axiosInstance.patch(
      `${API_BASE}/reportes/${reportId}/origenes/${origenId}`,
      payload
    );
    return data;
  },

  async eliminarOrigen(reportId: string, origenId: string) {
    const { data } = await axiosInstance.delete(
      `${API_BASE}/reportes/${reportId}/origenes/${origenId}`
    );
    return data;
  },

  async testConexionOrigen(reportId: string, origenId: string) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/origenes/${origenId}/test`,
      {}
    );
    return data;
  },
};

// Parameters
export const parameterService = {
  async crearParametro(reportId: string, payload: any) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/parametros`,
      payload
    );
    return data;
  },

  async listarParametros(reportId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes/${reportId}/parametros`);
    return data;
  },

  async actualizarParametro(reportId: string, parametroId: string, payload: any) {
    const { data } = await axiosInstance.patch(
      `${API_BASE}/reportes/${reportId}/parametros/${parametroId}`,
      payload
    );
    return data;
  },

  async eliminarParametro(reportId: string, parametroId: string) {
    const { data } = await axiosInstance.delete(
      `${API_BASE}/reportes/${reportId}/parametros/${parametroId}`
    );
    return data;
  },
};

// Report Export & Scheduling
export const exportService = {
  async generarReporte(reportId: string, payload?: {
    formato?: string;
    parametros?: any;
  }) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/generar`,
      payload || {}
    );
    return data;
  },

  async previewReporte(reportId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes/${reportId}/preview`);
    return data;
  },

  async descargarReporte(exportId: string) {
    const { data } = await axiosInstance.get(
      `${API_BASE}/exportes/${exportId}/descargar`,
      { responseType: 'blob' }
    );
    return data;
  },

  async listarExportaciones(reportId: string, filtro?: any) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes/${reportId}/exportaciones`, {
      params: filtro,
    });
    return data;
  },

  async obtenerExportacion(exportId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/exportes/${exportId}`);
    return data;
  },

  async cancelarExportacion(exportId: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/exportes/${exportId}/cancelar`, {});
    return data;
  },

  async generarBulk(reportIds: string[], formato: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/exportes/bulk`, {
      reportIds,
      formato,
    });
    return data;
  },
};

// Scheduled Reports
export const scheduledReportService = {
  async crearProgramacion(reportId: string, payload: any) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/programaciones`,
      payload
    );
    return data;
  },

  async listarProgramaciones(reportId: string) {
    const { data } = await axiosInstance.get(
      `${API_BASE}/reportes/${reportId}/programaciones`
    );
    return data;
  },

  async obtenerProgramacion(reportId: string, programacionId: string) {
    const { data } = await axiosInstance.get(
      `${API_BASE}/reportes/${reportId}/programaciones/${programacionId}`
    );
    return data;
  },

  async actualizarProgramacion(reportId: string, programacionId: string, payload: any) {
    const { data } = await axiosInstance.patch(
      `${API_BASE}/reportes/${reportId}/programaciones/${programacionId}`,
      payload
    );
    return data;
  },

  async eliminarProgramacion(reportId: string, programacionId: string) {
    const { data } = await axiosInstance.delete(
      `${API_BASE}/reportes/${reportId}/programaciones/${programacionId}`
    );
    return data;
  },

  async activarProgramacion(reportId: string, programacionId: string) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/programaciones/${programacionId}/activar`,
      {}
    );
    return data;
  },

  async desactivarProgramacion(reportId: string, programacionId: string) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/programaciones/${programacionId}/desactivar`,
      {}
    );
    return data;
  },

  async ejecutarAhora(reportId: string, programacionId: string) {
    const { data } = await axiosInstance.post(
      `${API_BASE}/reportes/${reportId}/programaciones/${programacionId}/ejecutar`,
      {}
    );
    return data;
  },
};

// Templates
export const templateService = {
  async listarPlantillas(filtro?: { tipo?: string; categoria?: string }) {
    const { data } = await axiosInstance.get(`${API_BASE}/plantillas`, { params: filtro });
    return data;
  },

  async obtenerPlantilla(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/plantillas/${id}`);
    return data;
  },

  async crearDesdeTemplate(plantillaId: string, nombre: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/plantillas/${plantillaId}/usar`, {
      nombre,
    });
    return data;
  },

  async crearPlantilla(reportId: string, payload: any) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${reportId}/guardar-plantilla`, payload);
    return data;
  },
};

// Sharing & Collaboration
export const sharingService = {
  async compartirReporte(reportId: string, usuarioIds: string[], permisos: string[]) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${reportId}/compartir`, {
      usuarioIds,
      permisos,
    });
    return data;
  },

  async listarComparticiones(reportId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes/${reportId}/comparticiones`);
    return data;
  },

  async actualizarPermiso(reportId: string, shareId: string, permisos: string[]) {
    const { data } = await axiosInstance.patch(
      `${API_BASE}/reportes/${reportId}/comparticiones/${shareId}`,
      { permisos }
    );
    return data;
  },

  async revocarAcceso(reportId: string, shareId: string) {
    const { data } = await axiosInstance.delete(
      `${API_BASE}/reportes/${reportId}/comparticiones/${shareId}`
    );
    return data;
  },
};

// Favorites
export const favoriteService = {
  async anadirAFavoritos(reportId: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${reportId}/favoritos`, {});
    return data;
  },

  async eliminarDeFavoritos(reportId: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/reportes/${reportId}/favoritos`);
    return data;
  },

  async listarFavoritos() {
    const { data } = await axiosInstance.get(`${API_BASE}/favoritos`);
    return data;
  },
};

// Analytics
export const analyticsService = {
  async obtenerAnalytics(reportId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/reportes/${reportId}/analytics`);
    return data;
  },

  async registrarVista(reportId: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/reportes/${reportId}/vista`, {});
    return data;
  },
};
