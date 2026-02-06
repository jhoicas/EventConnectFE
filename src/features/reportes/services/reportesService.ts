import axios from '@/lib/axios';
import type {
  Reporte,
  PlantillaReporte,
  ProgramacionReporte,
  GeneracionReporte,
  ExportacionReporte,
  ResultadoReporte,
  FiltrosReportes,
  EstadisticasReportes,
  HistorialReporte,
} from '../types';

// ===== REPORTES CRUD =====
export const reportesService = {
  // Crear reporte
  crearReporte: (datos: Partial<Reporte>) =>
    axios.post<Reporte>('/reportes', datos),

  // Obtener reporte
  obtenerReporte: (id: string) =>
    axios.get<Reporte>(`/reportes/${id}`),

  // Listar reportes
  listarReportes: (filtros?: FiltrosReportes) =>
    axios.get<{ reportes: Reporte[]; total: number }>('/reportes', { params: filtros }),

  // Actualizar reporte
  actualizarReporte: (id: string, datos: Partial<Reporte>) =>
    axios.put<Reporte>(`/reportes/${id}`, datos),

  // Duplicar reporte
  duplicarReporte: (id: string, nuevoNombre: string) =>
    axios.post<Reporte>(`/reportes/${id}/duplicar`, { nuevoNombre }),

  // Eliminar reporte
  eliminarReporte: (id: string) =>
    axios.delete(`/reportes/${id}`),

  // Compartir reporte
  compartirReporte: (id: string, usuarioIds: string[]) =>
    axios.post(`/reportes/${id}/compartir`, { usuarioIds }),

  // Descompartir reporte
  descompartirReporte: (id: string, usuarioIds: string[]) =>
    axios.post(`/reportes/${id}/descompartir`, { usuarioIds }),

  // ===== PLANTILLAS =====
  // Listar plantillas
  listarPlantillas: () =>
    axios.get<{ plantillas: PlantillaReporte[] }>('/reportes/plantillas'),

  // Obtener plantilla
  obtenerPlantilla: (id: string) =>
    axios.get<PlantillaReporte>(`/reportes/plantillas/${id}`),

  // Crear plantilla
  crearPlantilla: (datos: Partial<PlantillaReporte>) =>
    axios.post<PlantillaReporte>('/reportes/plantillas', datos),

  // Actualizar plantilla
  actualizarPlantilla: (id: string, datos: Partial<PlantillaReporte>) =>
    axios.put<PlantillaReporte>(`/reportes/plantillas/${id}`, datos),

  // Eliminar plantilla
  eliminarPlantilla: (id: string) =>
    axios.delete(`/reportes/plantillas/${id}`),

  // ===== GENERACIÓN DE REPORTES =====
  // Generar reporte
  generarReporte: (id: string, filtrosAplicados?: any) =>
    axios.post<GeneracionReporte>(`/reportes/${id}/generar`, { filtrosAplicados }),

  // Generar y descargar (en un paso)
  generarYDescargar: (id: string, formato: 'pdf' | 'excel' | 'csv' | 'json', filtros?: any) =>
    axios.post(`/reportes/${id}/generar-descargar`, { formato, filtros }, { responseType: 'blob' }),

  // Obtener generación
  obtenerGeneracion: (reporteId: string, generacionId: string) =>
    axios.get<GeneracionReporte>(`/reportes/${reporteId}/generaciones/${generacionId}`),

  // Listar generaciones
  listarGeneraciones: (reporteId: string, filtros?: { pagina?: number; limite?: number }) =>
    axios.get<{ generaciones: GeneracionReporte[]; total: number }>(
      `/reportes/${reporteId}/generaciones`,
      { params: filtros }
    ),

  // Eliminar generación
  eliminarGeneracion: (reporteId: string, generacionId: string) =>
    axios.delete(`/reportes/${reporteId}/generaciones/${generacionId}`),

  // ===== EXPORTACIÓN =====
  // Exportar generación
  exportarGeneracion: (reporteId: string, generacionId: string, formato: 'pdf' | 'excel' | 'csv' | 'json') =>
    axios.post(`/reportes/${reporteId}/generaciones/${generacionId}/exportar`, { formato }, { responseType: 'blob' }),

  // Obtener exportación
  obtenerExportacion: (reporteId: string, exportacionId: string) =>
    axios.get<ExportacionReporte>(`/reportes/${reporteId}/exportaciones/${exportacionId}`),

  // Listar exportaciones
  listarExportaciones: (reporteId: string, filtros?: { pagina?: number; limite?: number }) =>
    axios.get<{ exportaciones: ExportacionReporte[]; total: number }>(
      `/reportes/${reporteId}/exportaciones`,
      { params: filtros }
    ),

  // Descargar exportación
  descargarExportacion: (reporteId: string, exportacionId: string) =>
    axios.get(`/reportes/${reporteId}/exportaciones/${exportacionId}/descargar`, { responseType: 'blob' }),

  // ===== PROGRAMACIÓN DE REPORTES =====
  // Crear programación
  crearProgramacion: (reporteId: string, datos: Partial<ProgramacionReporte>) =>
    axios.post<ProgramacionReporte>(`/reportes/${reporteId}/programaciones`, datos),

  // Obtener programación
  obtenerProgramacion: (reporteId: string, programacionId: string) =>
    axios.get<ProgramacionReporte>(`/reportes/${reporteId}/programaciones/${programacionId}`),

  // Listar programaciones
  listarProgramaciones: (reporteId?: string) =>
    axios.get<{ programaciones: ProgramacionReporte[] }>('/reportes/programaciones', { params: { reporteId } }),

  // Actualizar programación
  actualizarProgramacion: (reporteId: string, programacionId: string, datos: Partial<ProgramacionReporte>) =>
    axios.put<ProgramacionReporte>(`/reportes/${reporteId}/programaciones/${programacionId}`, datos),

  // Eliminar programación
  eliminarProgramacion: (reporteId: string, programacionId: string) =>
    axios.delete(`/reportes/${reporteId}/programaciones/${programacionId}`),

  // Activar programación
  activarProgramacion: (reporteId: string, programacionId: string) =>
    axios.patch<ProgramacionReporte>(`/reportes/${reporteId}/programaciones/${programacionId}/activar`, {}),

  // Desactivar programación
  desactivarProgramacion: (reporteId: string, programacionId: string) =>
    axios.patch<ProgramacionReporte>(`/reportes/${reporteId}/programaciones/${programacionId}/desactivar`, {}),

  // Ejecutar programación ahora
  ejecutarProgramacionAhora: (reporteId: string, programacionId: string) =>
    axios.post(`/reportes/${reporteId}/programaciones/${programacionId}/ejecutar-ahora`, {}),

  // ===== BÚSQUEDA Y FILTRADO =====
  // Buscar reportes
  buscarReportes: (q: string) =>
    axios.get<{ reportes: Reporte[] }>('/reportes/buscar', { params: { q } }),

  // Obtener reportes compartidos conmigo
  obtenerReportesCompartidos: () =>
    axios.get<{ reportes: Reporte[] }>('/reportes/compartidos'),

  // Obtener mis reportes
  obtenerMisReportes: () =>
    axios.get<{ reportes: Reporte[] }>('/reportes/mis-reportes'),

  // ===== ESTADÍSTICAS =====
  // Obtener estadísticas generales
  obtenerEstadisticas: () =>
    axios.get<EstadisticasReportes>('/reportes/estadisticas'),

  // Obtener estadísticas de reporte
  obtenerEstadisticasReporte: (id: string) =>
    axios.get(`/reportes/${id}/estadisticas`),

  // ===== HISTORIAL =====
  // Listar historial
  listarHistorial: (reporteId: string, filtros?: any) =>
    axios.get<{ historial: HistorialReporte[]; total: number }>(
      `/reportes/${reporteId}/historial`,
      { params: filtros }
    ),

  // ===== VALIDACIÓN Y PREVIEW =====
  // Validar configuración de reporte
  validarReporte: (datos: Partial<Reporte>) =>
    axios.post('/reportes/validar', datos),

  // Obtener preview de datos
  obtenerPreview: (reporteId: string, limite?: number) =>
    axios.get<ResultadoReporte>(`/reportes/${reporteId}/preview`, { params: { limite } }),

  // ===== IMPORTAR/EXPORTAR CONFIGURACIÓN =====
  // Exportar reporte (configuración)
  exportarConfiguracion: (id: string) =>
    axios.get(`/reportes/${id}/exportar-config`, { responseType: 'blob' }),

  // Importar reporte (configuración)
  importarConfiguracion: (archivo: File) => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return axios.post('/reportes/importar-config', formData);
  },

  // ===== RECURSOS BASE =====
  // Obtener campos disponibles para un recurso
  obtenerCamposRecurso: (recurso: string) =>
    axios.get(`/reportes/recursos/${recurso}/campos`),

  // Obtener recursos disponibles
  obtenerRecursos: () =>
    axios.get<string[]>('/reportes/recursos'),

  // ===== LIMPIEZA Y MANTENIMIENTO =====
  // Limpiar generaciones antiguas
  limpiarGeneracionesAntiguias: (diasRetenccion: number) =>
    axios.post('/reportes/limpiar-generaciones', { diasRetenccion }),

  // Limpiar exportaciones expiradas
  limpiarExportacionesExpiradas: () =>
    axios.post('/reportes/limpiar-exportaciones', {}),

  // Obtener uso de almacenamiento
  obtenerUsoAlmacenamiento: () =>
    axios.get('/reportes/uso-almacenamiento'),

  // ===== ANÁLISIS Y RECOMENDACIONES =====
  // Obtener recomendaciones de reportes
  obtenerRecomendaciones: () =>
    axios.get('/reportes/recomendaciones'),

  // Obtener reportes más descargados
  obtenerReportesMasDescargados: (limite?: number) =>
    axios.get(`/reportes/mas-descargados`, { params: { limite } }),

  // Obtener actividad reciente
  obtenerActividadReciente: (limite?: number) =>
    axios.get(`/reportes/actividad-reciente`, { params: { limite } }),
};
