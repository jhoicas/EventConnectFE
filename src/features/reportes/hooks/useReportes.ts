import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportesService } from '../services/reportesService';
import type { FiltrosReportes } from '../types';

// ===== QUERIES REPORTES =====
export const useListarReportes = (filtros?: FiltrosReportes) => {
  return useQuery({
    queryKey: ['reportes', filtros],
    queryFn: () => reportesService.listarReportes(filtros),
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerReporte = (id: string) => {
  return useQuery({
    queryKey: ['reporte', id],
    queryFn: () => reportesService.obtenerReporte(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useBuscarReportes = (q: string) => {
  return useQuery({
    queryKey: ['reportes-buscar', q],
    queryFn: () => reportesService.buscarReportes(q),
    staleTime: 1 * 60 * 1000,
    enabled: !!q && q.length > 2,
  });
};

export const useObtenerReportesCompartidos = () => {
  return useQuery({
    queryKey: ['reportes-compartidos'],
    queryFn: () => reportesService.obtenerReportesCompartidos(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerMisReportes = () => {
  return useQuery({
    queryKey: ['mis-reportes'],
    queryFn: () => reportesService.obtenerMisReportes(),
    staleTime: 2 * 60 * 1000,
  });
};

// ===== QUERIES PLANTILLAS =====
export const useListarPlantillas = () => {
  return useQuery({
    queryKey: ['plantillas-reportes'],
    queryFn: () => reportesService.listarPlantillas(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerPlantilla = (id: string) => {
  return useQuery({
    queryKey: ['plantilla', id],
    queryFn: () => reportesService.obtenerPlantilla(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// ===== QUERIES GENERACIONES =====
export const useListarGeneraciones = (reporteId: string, filtros?: { pagina?: number; limite?: number }) => {
  return useQuery({
    queryKey: ['generaciones', reporteId, filtros],
    queryFn: () => reportesService.listarGeneraciones(reporteId, filtros),
    staleTime: 1 * 60 * 1000,
    enabled: !!reporteId,
  });
};

export const useObtenerGeneracion = (reporteId: string, generacionId: string) => {
  return useQuery({
    queryKey: ['generacion', reporteId, generacionId],
    queryFn: () => reportesService.obtenerGeneracion(reporteId, generacionId),
    staleTime: 5 * 60 * 1000,
    enabled: !!reporteId && !!generacionId,
  });
};

// ===== QUERIES EXPORTACIONES =====
export const useListarExportaciones = (reporteId: string, filtros?: { pagina?: number; limite?: number }) => {
  return useQuery({
    queryKey: ['exportaciones', reporteId, filtros],
    queryFn: () => reportesService.listarExportaciones(reporteId, filtros),
    staleTime: 1 * 60 * 1000,
    enabled: !!reporteId,
  });
};

export const useObtenerExportacion = (reporteId: string, exportacionId: string) => {
  return useQuery({
    queryKey: ['exportacion', reporteId, exportacionId],
    queryFn: () => reportesService.obtenerExportacion(reporteId, exportacionId),
    staleTime: 5 * 60 * 1000,
    enabled: !!reporteId && !!exportacionId,
  });
};

// ===== QUERIES PROGRAMACIONES =====
export const useListarProgramaciones = (reporteId?: string) => {
  return useQuery({
    queryKey: ['programaciones', reporteId],
    queryFn: () => reportesService.listarProgramaciones(reporteId),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerProgramacion = (reporteId: string, programacionId: string) => {
  return useQuery({
    queryKey: ['programacion', reporteId, programacionId],
    queryFn: () => reportesService.obtenerProgramacion(reporteId, programacionId),
    staleTime: 5 * 60 * 1000,
    enabled: !!reporteId && !!programacionId,
  });
};

// ===== QUERIES ESTADÍSTICAS =====
export const useObtenerEstadisticas = () => {
  return useQuery({
    queryKey: ['estadisticas-reportes'],
    queryFn: () => reportesService.obtenerEstadisticas(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerEstadisticasReporte = (id: string) => {
  return useQuery({
    queryKey: ['estadisticas-reporte', id],
    queryFn: () => reportesService.obtenerEstadisticasReporte(id),
    staleTime: 3 * 60 * 1000,
    enabled: !!id,
  });
};

// ===== QUERIES HISTORIAL =====
export const useListarHistorial = (reporteId: string, filtros?: any) => {
  return useQuery({
    queryKey: ['historial-reporte', reporteId, filtros],
    queryFn: () => reportesService.listarHistorial(reporteId, filtros),
    staleTime: 2 * 60 * 1000,
    enabled: !!reporteId,
  });
};

// ===== QUERIES PREVIEW Y DATOS =====
export const useObtenerPreview = (reporteId: string, limite?: number) => {
  return useQuery({
    queryKey: ['preview-reporte', reporteId, limite],
    queryFn: () => reportesService.obtenerPreview(reporteId, limite),
    staleTime: 1 * 60 * 1000,
    enabled: !!reporteId,
  });
};

export const useObtenerCamposRecurso = (recurso: string) => {
  return useQuery({
    queryKey: ['campos-recurso', recurso],
    queryFn: () => reportesService.obtenerCamposRecurso(recurso),
    staleTime: 10 * 60 * 1000,
    enabled: !!recurso,
  });
};

export const useObtenerRecursos = () => {
  return useQuery({
    queryKey: ['recursos-reportes'],
    queryFn: () => reportesService.obtenerRecursos(),
    staleTime: 10 * 60 * 1000,
  });
};

// ===== QUERIES ANÁLISIS =====
export const useObtenerRecomendaciones = () => {
  return useQuery({
    queryKey: ['recomendaciones-reportes'],
    queryFn: () => reportesService.obtenerRecomendaciones(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerReportesMasDescargados = (limite?: number) => {
  return useQuery({
    queryKey: ['reportes-mas-descargados', limite],
    queryFn: () => reportesService.obtenerReportesMasDescargados(limite),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerActividadReciente = (limite?: number) => {
  return useQuery({
    queryKey: ['actividad-reciente-reportes', limite],
    queryFn: () => reportesService.obtenerActividadReciente(limite),
    staleTime: 2 * 60 * 1000,
  });
};

// ===== QUERIES ALMACENAMIENTO =====
export const useObtenerUsoAlmacenamiento = () => {
  return useQuery({
    queryKey: ['uso-almacenamiento-reportes'],
    queryFn: () => reportesService.obtenerUsoAlmacenamiento(),
    staleTime: 5 * 60 * 1000,
  });
};

// ===== MUTATIONS REPORTES =====
export const useCrearReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: any) => reportesService.crearReporte(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['mis-reportes'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-reportes'] });
    },
  });
};

export const useActualizarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: any }) =>
      reportesService.actualizarReporte(id, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reporte', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useDuplicarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nuevoNombre }: { id: string; nuevoNombre: string }) =>
      reportesService.duplicarReporte(id, nuevoNombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['mis-reportes'] });
    },
  });
};

export const useEliminarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportesService.eliminarReporte(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['mis-reportes'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-reportes'] });
    },
  });
};

export const useCompartirReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, usuarioIds }: { id: string; usuarioIds: string[] }) =>
      reportesService.compartirReporte(id, usuarioIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reporte', variables.id] });
    },
  });
};

// ===== MUTATIONS PLANTILLAS =====
export const useCrearPlantilla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: any) => reportesService.crearPlantilla(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas-reportes'] });
    },
  });
};

export const useActualizarPlantilla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: any }) =>
      reportesService.actualizarPlantilla(id, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plantilla', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['plantillas-reportes'] });
    },
  });
};

export const useEliminarPlantilla = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportesService.eliminarPlantilla(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantillas-reportes'] });
    },
  });
};

// ===== MUTATIONS GENERACIÓN =====
export const useGenerarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, filtrosAplicados }: { id: string; filtrosAplicados?: any }) =>
      reportesService.generarReporte(id, filtrosAplicados),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['generaciones', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-reporte', variables.id] });
    },
  });
};

export const useGenerarYDescargar = () => {
  return useMutation({
    mutationFn: ({ id, formato, filtros }: { id: string; formato: any; filtros?: any }) =>
      reportesService.generarYDescargar(id, formato, filtros),
  });
};

export const useEliminarGeneracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporteId, generacionId }: { reporteId: string; generacionId: string }) =>
      reportesService.eliminarGeneracion(reporteId, generacionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['generaciones', variables.reporteId] });
    },
  });
};

// ===== MUTATIONS EXPORTACIÓN =====
export const useExportarGeneracion = () => {
  return useMutation({
    mutationFn: ({ reporteId, generacionId, formato }: any) =>
      reportesService.exportarGeneracion(reporteId, generacionId, formato),
  });
};

export const useDescargarExportacion = () => {
  return useMutation({
    mutationFn: ({ reporteId, exportacionId }: { reporteId: string; exportacionId: string }) =>
      reportesService.descargarExportacion(reporteId, exportacionId),
  });
};

// ===== MUTATIONS PROGRAMACIÓN =====
export const useCrearProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporteId, datos }: { reporteId: string; datos: any }) =>
      reportesService.crearProgramacion(reporteId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programaciones', variables.reporteId] });
    },
  });
};

export const useActualizarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporteId, programacionId, datos }: any) =>
      reportesService.actualizarProgramacion(reporteId, programacionId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programaciones', variables.reporteId] });
    },
  });
};

export const useEliminarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporteId, programacionId }: { reporteId: string; programacionId: string }) =>
      reportesService.eliminarProgramacion(reporteId, programacionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programaciones', variables.reporteId] });
    },
  });
};

export const useActivarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporteId, programacionId }: { reporteId: string; programacionId: string }) =>
      reportesService.activarProgramacion(reporteId, programacionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programaciones', variables.reporteId] });
    },
  });
};

export const useDesactivarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporteId, programacionId }: { reporteId: string; programacionId: string }) =>
      reportesService.desactivarProgramacion(reporteId, programacionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programaciones', variables.reporteId] });
    },
  });
};

export const useEjecutarProgramacionAhora = () => {
  return useMutation({
    mutationFn: ({ reporteId, programacionId }: { reporteId: string; programacionId: string }) =>
      reportesService.ejecutarProgramacionAhora(reporteId, programacionId),
  });
};
