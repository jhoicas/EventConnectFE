import axiosInstance from '@/lib/axios';

const API_BASE = '/api/data-streaming';

// WebSocket Connection Management
export const connectionService = {
  async crearConexion(payload: {
    url: string;
    eventos: string[];
    maxReintentos?: number;
    intervaloReconexion?: number;
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/conexion`, payload);
    return data;
  },

  async obtenerConexion(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/conexion/${id}`);
    return data;
  },

  async listarConexiones() {
    const { data } = await axiosInstance.get(`${API_BASE}/conexiones`);
    return data;
  },

  async actualizarConexion(id: string, payload: Partial<any>) {
    const { data } = await axiosInstance.patch(`${API_BASE}/conexion/${id}`, payload);
    return data;
  },

  async cerrarConexion(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/conexion/${id}/cerrar`, {});
    return data;
  },

  async reconectar(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/conexion/${id}/reconectar`, {});
    return data;
  },

  async obtenerLogConexion(id: string, filtro?: { desde?: string; hasta?: string }) {
    const { data } = await axiosInstance.get(`${API_BASE}/conexion/${id}/logs`, {
      params: filtro,
    });
    return data;
  },
};

// Event Streaming
export const eventService = {
  async listarEventos(filtro: any) {
    const { data } = await axiosInstance.get(`${API_BASE}/eventos`, { params: filtro });
    return data;
  },

  async obtenerEvento(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/evento/${id}`);
    return data;
  },

  async procesarEvento(id: string, accion: 'aceptar' | 'rechazar' | 'postergar') {
    const { data } = await axiosInstance.post(`${API_BASE}/evento/${id}/procesar`, { accion });
    return data;
  },

  async obtenerEventosEnTiempoReal(tipos: string[]) {
    const { data } = await axiosInstance.get(`${API_BASE}/eventos/tiempo-real`, {
      params: { tipos: tipos.join(',') },
    });
    return data;
  },

  async obtenerEventosPorTipo(tipo: string, filtro?: { limite?: number; offset?: number }) {
    const { data } = await axiosInstance.get(`${API_BASE}/eventos/tipo/${tipo}`, {
      params: filtro,
    });
    return data;
  },

  async obtenerEventosPorSeveridad(
    severidad: string,
    filtro?: { limite?: number; offset?: number }
  ) {
    const { data } = await axiosInstance.get(`${API_BASE}/eventos/severidad/${severidad}`, {
      params: filtro,
    });
    return data;
  },

  async limpiarEventos(filtro: { tipo?: string; antes?: string }) {
    const { data } = await axiosInstance.post(`${API_BASE}/eventos/limpiar`, filtro);
    return data;
  },
};

// KPI Stream
export const kpiStreamService = {
  async suscribirseAKPIs(kpiIds: string[]) {
    const { data } = await axiosInstance.post(`${API_BASE}/kpi-stream/suscribirse`, {
      kpiIds,
    });
    return data;
  },

  async obtenerKPIsEnVivo(kpiIds: string[]) {
    const { data } = await axiosInstance.get(`${API_BASE}/kpi-stream/vivo`, {
      params: { ids: kpiIds.join(',') },
    });
    return data;
  },

  async desuscribirseDeKPIs(kpiIds: string[]) {
    const { data } = await axiosInstance.post(`${API_BASE}/kpi-stream/desuscribirse`, {
      kpiIds,
    });
    return data;
  },

  async obtenerHistoricoKPI(id: string, periodo: { inicio: string; fin: string }) {
    const { data } = await axiosInstance.get(`${API_BASE}/kpi-stream/${id}/historico`, {
      params: periodo,
    });
    return data;
  },
};

// Order Status Stream
export const orderStreamService = {
  async obtenerActualizacionesOrden(orderId: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/ordenes/${orderId}/stream`);
    return data;
  },

  async suscribirseAOrdenes(filtro?: { estados?: string[]; usuarioId?: string }) {
    const { data } = await axiosInstance.post(`${API_BASE}/ordenes-stream/suscribirse`, filtro);
    return data;
  },

  async obtenerOrdenesEnVivo(filtro?: { estados?: string[] }) {
    const { data } = await axiosInstance.get(`${API_BASE}/ordenes-stream/vivo`, {
      params: filtro,
    });
    return data;
  },

  async desuscribirse() {
    const { data } = await axiosInstance.post(`${API_BASE}/ordenes-stream/desuscribirse`, {});
    return data;
  },
};

// Inventory Stream
export const inventoryStreamService = {
  async obtenerCambiosInventario(filtro?: { bodega?: string; producto?: string }) {
    const { data } = await axiosInstance.get(`${API_BASE}/inventario-stream`, {
      params: filtro,
    });
    return data;
  },

  async suscribirseACambios(filtro: { bodegas?: string[]; productos?: string[] }) {
    const { data } = await axiosInstance.post(`${API_BASE}/inventario-stream/suscribirse`, filtro);
    return data;
  },

  async obtenerNivelesEnVivo() {
    const { data } = await axiosInstance.get(`${API_BASE}/inventario-stream/niveles-vivo`);
    return data;
  },

  async obtenerAlertas() {
    const { data } = await axiosInstance.get(`${API_BASE}/inventario-stream/alertas`);
    return data;
  },
};

// Transaction Stream
export const transactionStreamService = {
  async obtenerTransacciones(filtro?: {
    tipos?: string[];
    estados?: string[];
    limite?: number;
  }) {
    const { data } = await axiosInstance.get(`${API_BASE}/transacciones-stream`, {
      params: filtro,
    });
    return data;
  },

  async obtenerTransaccionesEnVivo() {
    const { data } = await axiosInstance.get(`${API_BASE}/transacciones-stream/vivo`);
    return data;
  },

  async suscribirseATransacciones(tipos: string[]) {
    const { data } = await axiosInstance.post(`${API_BASE}/transacciones-stream/suscribirse`, {
      tipos,
    });
    return data;
  },

  async obtenerEstadisticasTransacciones() {
    const { data } = await axiosInstance.get(`${API_BASE}/transacciones-stream/estadisticas`);
    return data;
  },
};

// Subscription Management
export const subscriptionService = {
  async crearSuscripcion(payload: {
    nombre: string;
    tiposEvento: string[];
    metricas: string[];
    filtros?: any;
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/suscripcion`, payload);
    return data;
  },

  async listarSuscripciones() {
    const { data } = await axiosInstance.get(`${API_BASE}/suscripciones`);
    return data;
  },

  async obtenerSuscripcion(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/suscripcion/${id}`);
    return data;
  },

  async actualizarSuscripcion(id: string, payload: Partial<any>) {
    const { data } = await axiosInstance.patch(`${API_BASE}/suscripcion/${id}`, payload);
    return data;
  },

  async activarSuscripcion(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/suscripcion/${id}/activar`, {});
    return data;
  },

  async desactivarSuscripcion(id: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/suscripcion/${id}/desactivar`, {});
    return data;
  },

  async eliminarSuscripcion(id: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/suscripcion/${id}`);
    return data;
  },
};

// Stream Statistics
export const statisticsService = {
  async obtenerEstadisticas(filtro?: { tipo?: string; periodo?: string }) {
    const { data } = await axiosInstance.get(`${API_BASE}/estadisticas`, { params: filtro });
    return data;
  },

  async obtenerTasaEventos() {
    const { data } = await axiosInstance.get(`${API_BASE}/estadisticas/tasa-eventos`);
    return data;
  },

  async obtenerLatencia() {
    const { data } = await axiosInstance.get(`${API_BASE}/estadisticas/latencia`);
    return data;
  },

  async obtenerEventosPorTipo() {
    const { data } = await axiosInstance.get(`${API_BASE}/estadisticas/por-tipo`);
    return data;
  },

  async obtenerEventosPorSeveridad() {
    const { data } = await axiosInstance.get(`${API_BASE}/estadisticas/por-severidad`);
    return data;
  },

  async obtenerHealthCheck() {
    const { data } = await axiosInstance.get(`${API_BASE}/health`);
    return data;
  },
};

// Cache Management
export const cacheService = {
  async obtenerInfoCache(tipo: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/cache/${tipo}`);
    return data;
  },

  async limpiarCache(tipo: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/cache/${tipo}/limpiar`, {});
    return data;
  },

  async obtenerTamanioCache() {
    const { data } = await axiosInstance.get(`${API_BASE}/cache/tamanio`);
    return data;
  },

  async configurarRetencion(tipo: string, dias: number) {
    const { data } = await axiosInstance.post(`${API_BASE}/cache/${tipo}/retencion`, { dias });
    return data;
  },

  async habilitarCompresion(tipo: string) {
    const { data } = await axiosInstance.post(`${API_BASE}/cache/${tipo}/compresion`, {
      habilitada: true,
    });
    return data;
  },
};

// Dashboard Management
export const dashboardService = {
  async crearDashboardEnVivo(payload: {
    nombre: string;
    tiposEvento: string[];
    metricas: string[];
  }) {
    const { data } = await axiosInstance.post(`${API_BASE}/dashboard-vivo`, payload);
    return data;
  },

  async listarDashboards() {
    const { data } = await axiosInstance.get(`${API_BASE}/dashboards-vivo`);
    return data;
  },

  async obtenerDashboard(id: string) {
    const { data } = await axiosInstance.get(`${API_BASE}/dashboard-vivo/${id}`);
    return data;
  },

  async actualizarDashboard(id: string, payload: Partial<any>) {
    const { data } = await axiosInstance.patch(`${API_BASE}/dashboard-vivo/${id}`, payload);
    return data;
  },

  async compartirDashboard(id: string, usuarioIds: string[]) {
    const { data } = await axiosInstance.post(`${API_BASE}/dashboard-vivo/${id}/compartir`, {
      usuarioIds,
    });
    return data;
  },

  async eliminarDashboard(id: string) {
    const { data } = await axiosInstance.delete(`${API_BASE}/dashboard-vivo/${id}`);
    return data;
  },
};
