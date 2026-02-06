import axios from '@/lib/axios';
import type {
  RegistroAuditoria,
  SesionUsuario,
  AlertaAuditoria,
  EstadisticasAuditoria,
  FiltrosAuditoria,
  BusquedaAuditoria,
  ReporteAuditoria,
  MetricasSeguridad,
  ExportacionAuditoria,
  ConfiguracionAuditoria,
} from '../types';

const API_URL = '/api/auditoria';

export const auditoriaService = {
  // ===== REGISTROS DE AUDITORÍA =====
  crearRegistro: (datos: Omit<RegistroAuditoria, 'id' | 'creadoEn' | 'actualizadoEn'>) =>
    axios.post<RegistroAuditoria>(`${API_URL}/registros`, datos),

  obtenerRegistro: (id: string) =>
    axios.get<RegistroAuditoria>(`${API_URL}/registros/${id}`),

  listarRegistros: (filtros?: FiltrosAuditoria) =>
    axios.get<{ registros: RegistroAuditoria[]; total: number }>(`${API_URL}/registros`, { params: filtros }),

  filtrarRegistros: (filtros: FiltrosAuditoria) =>
    axios.get<{ registros: RegistroAuditoria[]; total: number }>(`${API_URL}/registros/filtrar`, { params: filtros }),

  buscarRegistros: (q: string) =>
    axios.get<BusquedaAuditoria[]>(`${API_URL}/registros/buscar`, { params: { q } }),

  obtenerRegistrosPorUsuario: (usuarioId: string, limite?: number) =>
    axios.get<RegistroAuditoria[]>(`${API_URL}/usuarios/${usuarioId}/registros`, { params: { limite } }),

  obtenerRegistrosPorRecurso: (tipoRecurso: string, recursoId: string) =>
    axios.get<RegistroAuditoria[]>(`${API_URL}/recursos/${tipoRecurso}/${recursoId}/cambios`),

  // ===== SESIONES DE USUARIO =====
  crearSesion: (datos: Omit<SesionUsuario, 'id' | 'creadoEn'>) =>
    axios.post<SesionUsuario>(`${API_URL}/sesiones`, datos),

  obtenerSesion: (id: string) =>
    axios.get<SesionUsuario>(`${API_URL}/sesiones/${id}`),

  listarSesiones: (usuarioId?: string) =>
    axios.get<SesionUsuario[]>(`${API_URL}/sesiones`, { params: { usuarioId } }),

  listarSesionesActivas: () =>
    axios.get<SesionUsuario[]>(`${API_URL}/sesiones/activas`),

  cerrarSesion: (id: string) =>
    axios.patch<SesionUsuario>(`${API_URL}/sesiones/${id}/cerrar`, {}),

  cerrarSesionesUsuario: (usuarioId: string) =>
    axios.post(`${API_URL}/usuarios/${usuarioId}/cerrar-sesiones`, {}),

  forzarCierreSesion: (id: string) =>
    axios.post(`${API_URL}/sesiones/${id}/forzar-cierre`, {}),

  // ===== ALERTAS DE AUDITORÍA =====
  crearAlerta: (datos: Omit<AlertaAuditoria, 'id' | 'creadoEn' | 'actualizadoEn'>) =>
    axios.post<AlertaAuditoria>(`${API_URL}/alertas`, datos),

  obtenerAlerta: (id: string) =>
    axios.get<AlertaAuditoria>(`${API_URL}/alertas/${id}`),

  listarAlertas: (filtros?: { estado?: string; severidad?: string; pagina?: number; limite?: number }) =>
    axios.get<{ alertas: AlertaAuditoria[]; total: number }>(`${API_URL}/alertas`, { params: filtros }),

  listarAlertasActivas: () =>
    axios.get<AlertaAuditoria[]>(`${API_URL}/alertas/activas`),

  resolverAlerta: (id: string, notas: string) =>
    axios.patch<AlertaAuditoria>(`${API_URL}/alertas/${id}/resolver`, { notas }),

  ignorarAlerta: (id: string, razon: string) =>
    axios.patch<AlertaAuditoria>(`${API_URL}/alertas/${id}/ignorar`, { razon }),

  agregarComentarioAlerta: (alertaId: string, contenido: string) =>
    axios.post(`${API_URL}/alertas/${alertaId}/comentarios`, { contenido }),

  asignarInvestigacion: (alertaId: string, usuarioId: string) =>
    axios.patch(`${API_URL}/alertas/${alertaId}/asignar-investigacion`, { usuarioId }),

  // ===== ESTADÍSTICAS =====
  obtenerEstadisticas: (fechaInicio?: Date, fechaFin?: Date) =>
    axios.get<EstadisticasAuditoria>(`${API_URL}/estadisticas`, {
      params: { fechaInicio, fechaFin },
    }),

  obtenerEstadisticasUsuario: (usuarioId: string, fechaInicio?: Date, fechaFin?: Date) =>
    axios.get(`${API_URL}/usuarios/${usuarioId}/estadisticas`, {
      params: { fechaInicio, fechaFin },
    }),

  obtenerMetricasSeguridad: () =>
    axios.get<MetricasSeguridad>(`${API_URL}/metricas-seguridad`),

  obtenerActividadPorHora: (fechaInicio?: Date, fechaFin?: Date) =>
    axios.get(`${API_URL}/actividad-por-hora`, { params: { fechaInicio, fechaFin } }),

  obtenerIntentosFailidos: (usuarioId?: string, ipAddress?: string) =>
    axios.get(`${API_URL}/intentos-fallidos`, { params: { usuarioId, ipAddress } }),

  // ===== REPORTES =====
  crearReporte: (datos: Omit<ReporteAuditoria, 'id' | 'creadoEn'>) =>
    axios.post<ReporteAuditoria>(`${API_URL}/reportes`, datos),

  obtenerReporte: (id: string) =>
    axios.get<ReporteAuditoria>(`${API_URL}/reportes/${id}`),

  listarReportes: (pagina?: number, limite?: number) =>
    axios.get<{ reportes: ReporteAuditoria[]; total: number }>(`${API_URL}/reportes`, { params: { pagina, limite } }),

  descargarReporte: (id: string) =>
    axios.get(`${API_URL}/reportes/${id}/descargar`),

  // ===== EXPORTACIÓN =====
  exportarRegistros: (formato: 'csv' | 'json' | 'pdf' | 'excel', filtros?: FiltrosAuditoria) =>
    axios.post<ExportacionAuditoria>(`${API_URL}/exportar-registros`, { formato, filtros }),

  exportarAlertas: (formato: 'csv' | 'json' | 'pdf' | 'excel') =>
    axios.post<ExportacionAuditoria>(`${API_URL}/exportar-alertas`, { formato }),

  exportarSesiones: (formato: 'csv' | 'json' | 'pdf' | 'excel') =>
    axios.post<ExportacionAuditoria>(`${API_URL}/exportar-sesiones`, { formato }),

  obtenerEstadoExportacion: (id: string) =>
    axios.get<ExportacionAuditoria>(`${API_URL}/exportaciones/${id}`),

  descargarExportacion: (id: string) =>
    axios.get(`${API_URL}/exportaciones/${id}/descargar`),

  // ===== CONFIGURACIÓN =====
  obtenerConfiguracion: () =>
    axios.get<ConfiguracionAuditoria>(`${API_URL}/configuracion`),

  actualizarConfiguracion: (datos: Partial<ConfiguracionAuditoria>) =>
    axios.put<ConfiguracionAuditoria>(`${API_URL}/configuracion`, datos),

  // ===== LIMPIEZA Y MANTENIMIENTO =====
  eliminarRegistrosAntiguos: (diasRetenccion: number) =>
    axios.post(`${API_URL}/limpiar-registros`, { diasRetenccion }),

  purgarAlertas: (diasRetenccion: number) =>
    axios.post(`${API_URL}/purgar-alertas`, { diasRetenccion }),

  obtenerTamanoBaseDatos: () =>
    axios.get(`${API_URL}/tamanio-base-datos`),

  // ===== CUMPLIMIENTO Y AUDITORÍA INTERNA =====
  generarReporteCumplimiento: (estándar: 'iso27001' | 'gdpr' | 'hipaa', fechaInicio: Date, fechaFin: Date) =>
    axios.post<ReporteAuditoria>(`${API_URL}/cumplimiento-reporte`, { estándar, fechaInicio, fechaFin }),

  validarCumplimiento: (estándar: string) =>
    axios.get(`${API_URL}/validar-cumplimiento/${estándar}`),

  obtenerLogsSistema: (componente?: string, pagina?: number, limite?: number) =>
    axios.get(`${API_URL}/logs-sistema`, { params: { componente, pagina, limite } }),

  obtenerErroresRecientes: (limite?: number) =>
    axios.get(`${API_URL}/errores-recientes`, { params: { limite } }),
};
