import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  reportService,
  pageWidgetService,
  dataSourceService,
  parameterService,
  exportService,
  scheduledReportService,
  templateService,
  sharingService,
  favoriteService,
  analyticsService,
} from '../services/reportBuilderService';

const QUERY_KEYS = {
  report: ['report'],
  page: ['page'],
  widget: ['widget'],
  dataSource: ['dataSource'],
  parameter: ['parameter'],
  export: ['export'],
  scheduled: ['scheduled'],
  template: ['template'],
  sharing: ['sharing'],
  favorite: ['favorite'],
  analytics: ['analytics'],
};

// ==================== REPORT HOOKS ====================
export const useCrearReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => reportService.crearReporte(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.report });
    },
  });
};

export const useListarReportes = (filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.report, 'list', filtro],
    queryFn: () => reportService.listarReportes(filtro),
    staleTime: 5 * 60 * 1000,
  });

export const useObtenerReporte = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.report, id],
    queryFn: () => reportService.obtenerReporte(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

export const useActualizarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => reportService.actualizarReporte(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.report, variables.id] });
    },
  });
};

export const useEliminarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportService.eliminarReporte(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.report });
    },
  });
};

export const usePublicarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportService.publicarReporte(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.report, variables] });
    },
  });
};

export const useDuplicarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nuevoNombre }: any) => reportService.duplicarReporte(id, nuevoNombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.report });
    },
  });
};

export const useValidarReporte = () => {
  return useMutation({
    mutationFn: (id: string) => reportService.validarReporte(id),
  });
};

// ==================== PAGE & WIDGET HOOKS ====================
export const useCrearPagina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, payload }: any) => pageWidgetService.crearPagina(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.page });
    },
  });
};

export const useActualizarPagina = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, pageId, payload }: any) =>
      pageWidgetService.actualizarPagina(reportId, pageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.page });
    },
  });
};

export const useCrearWidget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, pageId, payload }: any) =>
      pageWidgetService.crearWidget(reportId, pageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.widget });
    },
  });
};

export const useActualizarWidget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, pageId, widgetId, payload }: any) =>
      pageWidgetService.actualizarWidget(reportId, pageId, widgetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.widget });
    },
  });
};

export const useEliminarWidget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, pageId, widgetId }: any) =>
      pageWidgetService.eliminarWidget(reportId, pageId, widgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.widget });
    },
  });
};

// ==================== DATA SOURCE HOOKS ====================
export const useCrearOrigen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, payload }: any) => dataSourceService.crearOrigen(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSource });
    },
  });
};

export const useListarOrigenes = (reportId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.dataSource, reportId],
    queryFn: () => dataSourceService.listarOrigenes(reportId!),
    enabled: !!reportId,
    staleTime: 10 * 60 * 1000,
  });

export const useActualizarOrigen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, origenId, payload }: any) =>
      dataSourceService.actualizarOrigen(reportId, origenId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dataSource });
    },
  });
};

export const useTestConexion = () => {
  return useMutation({
    mutationFn: ({ reportId, origenId }: any) =>
      dataSourceService.testConexionOrigen(reportId, origenId),
  });
};

// ==================== PARAMETER HOOKS ====================
export const useCrearParametro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, payload }: any) =>
      parameterService.crearParametro(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.parameter });
    },
  });
};

export const useListarParametros = (reportId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.parameter, reportId],
    queryFn: () => parameterService.listarParametros(reportId!),
    enabled: !!reportId,
    staleTime: 10 * 60 * 1000,
  });

export const useActualizarParametro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, parametroId, payload }: any) =>
      parameterService.actualizarParametro(reportId, parametroId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.parameter });
    },
  });
};

// ==================== EXPORT HOOKS ====================
export const useGenerarReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, payload }: any) =>
      exportService.generarReporte(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.export });
    },
  });
};

export const usePreviewReporte = (reportId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.export, 'preview', reportId],
    queryFn: () => exportService.previewReporte(reportId!),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
  });

export const useDescargarReporte = () => {
  return useMutation({
    mutationFn: (exportId: string) => exportService.descargarReporte(exportId),
  });
};

export const useListarExportaciones = (reportId?: string, filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.export, 'list', reportId, filtro],
    queryFn: () => exportService.listarExportaciones(reportId!, filtro),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 1000,
  });

export const useObtenerExportacion = (exportId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.export, exportId],
    queryFn: () => exportService.obtenerExportacion(exportId!),
    enabled: !!exportId,
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
  });

export const useCancelarExportacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exportId: string) => exportService.cancelarExportacion(exportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.export });
    },
  });
};

// ==================== SCHEDULED REPORT HOOKS ====================
export const useCrearProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, payload }: any) =>
      scheduledReportService.crearProgramacion(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scheduled });
    },
  });
};

export const useListarProgramaciones = (reportId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.scheduled, reportId],
    queryFn: () => scheduledReportService.listarProgramaciones(reportId!),
    enabled: !!reportId,
    staleTime: 10 * 60 * 1000,
  });

export const useActualizarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, programacionId, payload }: any) =>
      scheduledReportService.actualizarProgramacion(reportId, programacionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scheduled });
    },
  });
};

export const useActivarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, programacionId }: any) =>
      scheduledReportService.activarProgramacion(reportId, programacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scheduled });
    },
  });
};

export const useDesactivarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, programacionId }: any) =>
      scheduledReportService.desactivarProgramacion(reportId, programacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scheduled });
    },
  });
};

export const useEjecutarAhora = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, programacionId }: any) =>
      scheduledReportService.ejecutarAhora(reportId, programacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scheduled });
    },
  });
};

// ==================== TEMPLATE HOOKS ====================
export const useListarPlantillas = (filtro?: any) =>
  useQuery({
    queryKey: [...QUERY_KEYS.template, 'list', filtro],
    queryFn: () => templateService.listarPlantillas(filtro),
    staleTime: 15 * 60 * 1000,
  });

export const useObtenerPlantilla = (id?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.template, id],
    queryFn: () => templateService.obtenerPlantilla(id!),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });

export const useCrearDesdeTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ plantillaId, nombre }: any) =>
      templateService.crearDesdeTemplate(plantillaId, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.report });
    },
  });
};

// ==================== SHARING HOOKS ====================
export const useCompartirReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, usuarioIds, permisos }: any) =>
      sharingService.compartirReporte(reportId, usuarioIds, permisos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sharing });
    },
  });
};

export const useListarComparticiones = (reportId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.sharing, reportId],
    queryFn: () => sharingService.listarComparticiones(reportId!),
    enabled: !!reportId,
    staleTime: 10 * 60 * 1000,
  });

export const useRevocarAcceso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, shareId }: any) =>
      sharingService.revocarAcceso(reportId, shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sharing });
    },
  });
};

// ==================== FAVORITES HOOKS ====================
export const useAnadirAFavoritos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => favoriteService.anadirAFavoritos(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorite });
    },
  });
};

export const useEliminarDeFavoritos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => favoriteService.eliminarDeFavoritos(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorite });
    },
  });
};

export const useListarFavoritos = () =>
  useQuery({
    queryKey: [...QUERY_KEYS.favorite, 'list'],
    queryFn: () => favoriteService.listarFavoritos(),
    staleTime: 10 * 60 * 1000,
  });

// ==================== ANALYTICS HOOKS ====================
export const useObtenerAnalytics = (reportId?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.analytics, reportId],
    queryFn: () => analyticsService.obtenerAnalytics(reportId!),
    enabled: !!reportId,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });
