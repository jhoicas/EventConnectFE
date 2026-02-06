import axios from '@/lib/axios';
import type {
  Integracion,
  Credencial,
  ConfiguracionWebhook,
  LogSincronizacion,
  LogWebhook,
  TestConexion,
  MapeoFiltros,
  EventoIntegracion,
  ConfiguracionIntegracion,
  FiltrosIntegraciones,
  EstadisticasIntegraciones,
} from '../types';

// ===== INTEGRACIONES CRUD =====
export const integracionesService = {
  // Crear integración
  crearIntegracion: (datos: Partial<Integracion>) =>
    axios.post('/integraciones', datos),

  // Obtener integración
  obtenerIntegracion: (id: string) =>
    axios.get<Integracion>(`/integraciones/${id}`),

  // Listar integraciones
  listarIntegraciones: (filtros?: FiltrosIntegraciones) =>
    axios.get<{ integraciones: Integracion[]; total: number }>('/integraciones', { params: filtros }),

  // Actualizar integración
  actualizarIntegracion: (id: string, datos: Partial<Integracion>) =>
    axios.put<Integracion>(`/integraciones/${id}`, datos),

  // Eliminar integración
  eliminarIntegracion: (id: string) =>
    axios.delete(`/integraciones/${id}`),

  // ===== INTEGRACIONES OPERACIONES =====
  // Habilitar/deshabilitar integración
  habilitarIntegracion: (id: string) =>
    axios.patch<Integracion>(`/integraciones/${id}/habilitar`, {}),

  deshabilitarIntegracion: (id: string) =>
    axios.patch<Integracion>(`/integraciones/${id}/deshabilitar`, {}),

  // Testear conexión
  testearConexion: (id: string) =>
    axios.post<TestConexion>(`/integraciones/${id}/test`, {}),

  // Sincronizar datos
  sincronizar: (id: string) =>
    axios.post<LogSincronizacion>(`/integraciones/${id}/sincronizar`, {}),

  // Obtener estado conexión
  obtenerEstadoConexion: (id: string) =>
    axios.get(`/integraciones/${id}/estado`),

  // ===== CREDENCIALES =====
  // Crear credencial
  crearCredencial: (integracionId: string, datos: Partial<Credencial>) =>
    axios.post<Credencial>(`/integraciones/${integracionId}/credenciales`, datos),

  // Obtener credencial
  obtenerCredencial: (integracionId: string, credencialId: string) =>
    axios.get<Credencial>(`/integraciones/${integracionId}/credenciales/${credencialId}`),

  // Listar credenciales
  listarCredenciales: (integracionId: string) =>
    axios.get<{ credenciales: Credencial[] }>(`/integraciones/${integracionId}/credenciales`),

  // Actualizar credencial
  actualizarCredencial: (integracionId: string, credencialId: string, datos: Partial<Credencial>) =>
    axios.put<Credencial>(`/integraciones/${integracionId}/credenciales/${credencialId}`, datos),

  // Eliminar credencial
  eliminarCredencial: (integracionId: string, credencialId: string) =>
    axios.delete(`/integraciones/${integracionId}/credenciales/${credencialId}`),

  // Validar credencial
  validarCredencial: (integracionId: string, credencialId: string) =>
    axios.post(`/integraciones/${integracionId}/credenciales/${credencialId}/validar`, {}),

  // Rotar credencial (para OAuth2)
  rotarCredencial: (integracionId: string, credencialId: string) =>
    axios.post<Credencial>(`/integraciones/${integracionId}/credenciales/${credencialId}/rotar`, {}),

  // ===== WEBHOOKS =====
  // Crear webhook
  crearWebhook: (integracionId: string, datos: Partial<ConfiguracionWebhook>) =>
    axios.post<ConfiguracionWebhook>(`/integraciones/${integracionId}/webhooks`, datos),

  // Obtener webhook
  obtenerWebhook: (integracionId: string, webhookId: string) =>
    axios.get<ConfiguracionWebhook>(`/integraciones/${integracionId}/webhooks/${webhookId}`),

  // Listar webhooks
  listarWebhooks: (integracionId: string) =>
    axios.get<{ webhooks: ConfiguracionWebhook[] }>(`/integraciones/${integracionId}/webhooks`),

  // Actualizar webhook
  actualizarWebhook: (integracionId: string, webhookId: string, datos: Partial<ConfiguracionWebhook>) =>
    axios.put<ConfiguracionWebhook>(`/integraciones/${integracionId}/webhooks/${webhookId}`, datos),

  // Eliminar webhook
  eliminarWebhook: (integracionId: string, webhookId: string) =>
    axios.delete(`/integraciones/${integracionId}/webhooks/${webhookId}`),

  // Activar/desactivar webhook
  activarWebhook: (integracionId: string, webhookId: string) =>
    axios.patch<ConfiguracionWebhook>(`/integraciones/${integracionId}/webhooks/${webhookId}/activar`, {}),

  desactivarWebhook: (integracionId: string, webhookId: string) =>
    axios.patch<ConfiguracionWebhook>(`/integraciones/${integracionId}/webhooks/${webhookId}/desactivar`, {}),

  // Testear webhook
  testearWebhook: (integracionId: string, webhookId: string) =>
    axios.post(`/integraciones/${integracionId}/webhooks/${webhookId}/test`, {}),

  // ===== LOGS SINCRONIZACIÓN =====
  // Listar logs sincronización
  listarLogsSincronizacion: (integracionId: string, filtros?: { pagina?: number; limite?: number }) =>
    axios.get<{ logs: LogSincronizacion[]; total: number }>(
      `/integraciones/${integracionId}/logs-sincronizacion`,
      { params: filtros }
    ),

  // Obtener log sincronización
  obtenerLogSincronizacion: (integracionId: string, logId: string) =>
    axios.get<LogSincronizacion>(`/integraciones/${integracionId}/logs-sincronizacion/${logId}`),

  // ===== LOGS WEBHOOKS =====
  // Listar logs webhooks
  listarLogsWebhooks: (integracionId: string, webhookId?: string, filtros?: any) =>
    axios.get<{ logs: LogWebhook[]; total: number }>(
      `/integraciones/${integracionId}/logs-webhooks`,
      { params: { webhookId, ...filtros } }
    ),

  // Obtener log webhook
  obtenerLogWebhook: (integracionId: string, logWebhookId: string) =>
    axios.get<LogWebhook>(`/integraciones/${integracionId}/logs-webhooks/${logWebhookId}`),

  // Reintentar webhook fallido
  reintentarWebhook: (integracionId: string, logWebhookId: string) =>
    axios.post<LogWebhook>(`/integraciones/${integracionId}/logs-webhooks/${logWebhookId}/reintentar`, {}),

  // ===== MAPEOS FILTROS =====
  // Crear mapeo
  crearMapeo: (integracionId: string, datos: Partial<MapeoFiltros>) =>
    axios.post<MapeoFiltros>(`/integraciones/${integracionId}/mapeos`, datos),

  // Listar mapeos
  listarMapeos: (integracionId: string) =>
    axios.get<{ mapeos: MapeoFiltros[] }>(`/integraciones/${integracionId}/mapeos`),

  // Actualizar mapeo
  actualizarMapeo: (integracionId: string, mapeoId: string, datos: Partial<MapeoFiltros>) =>
    axios.put<MapeoFiltros>(`/integraciones/${integracionId}/mapeos/${mapeoId}`, datos),

  // Eliminar mapeo
  eliminarMapeo: (integracionId: string, mapeoId: string) =>
    axios.delete(`/integraciones/${integracionId}/mapeos/${mapeoId}`),

  // ===== CONFIGURACIÓN INTEGRACIONES =====
  // Crear configuración
  crearConfiguracion: (integracionId: string, datos: Partial<ConfiguracionIntegracion>) =>
    axios.post<ConfiguracionIntegracion>(`/integraciones/${integracionId}/configuracion`, datos),

  // Listar configuraciones
  listarConfiguraciones: (integracionId: string) =>
    axios.get<{ configuraciones: ConfiguracionIntegracion[] }>(
      `/integraciones/${integracionId}/configuracion`
    ),

  // Actualizar configuración
  actualizarConfiguracion: (
    integracionId: string,
    clave: string,
    valor: any
  ) =>
    axios.put<ConfiguracionIntegracion>(
      `/integraciones/${integracionId}/configuracion/${clave}`,
      { valor }
    ),

  // ===== EVENTOS INTEGRACIONES =====
  // Listar eventos
  listarEventos: (integracionId: string, filtros?: any) =>
    axios.get<{ eventos: EventoIntegracion[]; total: number }>(
      `/integraciones/${integracionId}/eventos`,
      { params: filtros }
    ),

  // Disparar evento personalizado
  dispararEvento: (integracionId: string, datos: Partial<EventoIntegracion>) =>
    axios.post<EventoIntegracion>(`/integraciones/${integracionId}/eventos`, datos),

  // ===== ESTADÍSTICAS =====
  // Obtener estadísticas globales
  obtenerEstadisticas: () =>
    axios.get<EstadisticasIntegraciones>('/integraciones/estadisticas'),

  // Obtener estadísticas por integración
  obtenerEstadisticasIntegracion: (id: string) =>
    axios.get(`/integraciones/${id}/estadisticas`),

  // ===== SINCRONIZACIÓN MASIVA =====
  // Sincronizar todas las integraciones
  sincronizarTodas: () =>
    axios.post('/integraciones/sincronizar-todas', {}),

  // Programar sincronización
  programarSincronizacion: (id: string, frecuencia: string) =>
    axios.post(`/integraciones/${id}/programar-sincronizacion`, { frecuencia }),

  // ===== IMPORTAR/EXPORTAR =====
  // Exportar configuración de integración
  exportarConfiguracion: (id: string) =>
    axios.get(`/integraciones/${id}/exportar`, { responseType: 'blob' }),

  // Importar configuración
  importarConfiguracion: (integracionId: string, archivo: File) => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return axios.post(`/integraciones/${integracionId}/importar`, formData);
  },

  // ===== LOGS GENERALES =====
  // Obtener logs de errores
  obtenerLogsErrores: (filtros?: any) =>
    axios.get('/integraciones/logs-errores', { params: filtros }),

  // Limpiar logs antiguos
  limpiarLogsAntiguos: (diasRetenccion: number) =>
    axios.post('/integraciones/limpiar-logs', { diasRetenccion }),
};
