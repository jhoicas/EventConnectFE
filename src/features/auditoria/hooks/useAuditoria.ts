import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditoriaService } from '../services/auditoriaService';
import type {
  FiltrosAuditoria,
  ConfiguracionAuditoria,
} from '../types';

// ===== QUERIES REGISTROS =====
export const useListarRegistros = (filtros?: FiltrosAuditoria) => {
  return useQuery({
    queryKey: ['registros', filtros],
    queryFn: () => auditoriaService.listarRegistros(filtros),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useBuscarRegistros = (q: string) => {
  return useQuery({
    queryKey: ['registros-buscar', q],
    queryFn: () => auditoriaService.buscarRegistros(q),
    staleTime: 1 * 60 * 1000, // 1 minuto
    enabled: !!q && q.length > 2,
  });
};

export const useObtenerRegistrosPorUsuario = (usuarioId: string, limite?: number) => {
  return useQuery({
    queryKey: ['registros-usuario', usuarioId],
    queryFn: () => auditoriaService.obtenerRegistrosPorUsuario(usuarioId, limite),
    staleTime: 2 * 60 * 1000,
    enabled: !!usuarioId,
  });
};

// ===== QUERIES SESIONES =====
export const useListarSesiones = (usuarioId?: string) => {
  return useQuery({
    queryKey: ['sesiones', usuarioId],
    queryFn: () => auditoriaService.listarSesiones(usuarioId),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

export const useListarSesionesActivas = () => {
  return useQuery({
    queryKey: ['sesiones-activas'],
    queryFn: () => auditoriaService.listarSesionesActivas(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// ===== QUERIES ALERTAS =====
export const useListarAlertas = (filtros?: { estado?: string; severidad?: string; pagina?: number; limite?: number }) => {
  return useQuery({
    queryKey: ['alertas', filtros],
    queryFn: () => auditoriaService.listarAlertas(filtros),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useListarAlertasActivas = () => {
  return useQuery({
    queryKey: ['alertas-activas'],
    queryFn: () => auditoriaService.listarAlertasActivas(),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

export const useObtenerAlerta = (id: string) => {
  return useQuery({
    queryKey: ['alerta', id],
    queryFn: () => auditoriaService.obtenerAlerta(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id,
  });
};

// ===== QUERIES ESTADÍSTICAS =====
export const useObtenerEstadisticas = (fechaInicio?: Date, fechaFin?: Date) => {
  return useQuery({
    queryKey: ['estadisticas-auditoria', fechaInicio, fechaFin],
    queryFn: () => auditoriaService.obtenerEstadisticas(fechaInicio, fechaFin),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useObtenerMetricasSeguridad = () => {
  return useQuery({
    queryKey: ['metricas-seguridad'],
    queryFn: () => auditoriaService.obtenerMetricasSeguridad(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useObtenerIntentosFailidos = (usuarioId?: string, ipAddress?: string) => {
  return useQuery({
    queryKey: ['intentos-fallidos', usuarioId, ipAddress],
    queryFn: () => auditoriaService.obtenerIntentosFailidos(usuarioId, ipAddress),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

// ===== QUERIES CONFIGURACIÓN =====
export const useObtenerConfiguracion = () => {
  return useQuery({
    queryKey: ['configuracion-auditoria'],
    queryFn: () => auditoriaService.obtenerConfiguracion(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ===== MUTATIONS SESIONES =====
export const useCerrarSesion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => auditoriaService.cerrarSesion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesiones'] });
      queryClient.invalidateQueries({ queryKey: ['sesiones-activas'] });
    },
  });
};

export const useCerrarSesionesUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (usuarioId: string) => auditoriaService.cerrarSesionesUsuario(usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesiones'] });
      queryClient.invalidateQueries({ queryKey: ['sesiones-activas'] });
    },
  });
};

export const useForzarCierreSesion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => auditoriaService.forzarCierreSesion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesiones'] });
      queryClient.invalidateQueries({ queryKey: ['sesiones-activas'] });
    },
  });
};

// ===== MUTATIONS ALERTAS =====
export const useResolverAlerta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notas }: { id: string; notas: string }) =>
      auditoriaService.resolverAlerta(id, notas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas-activas'] });
    },
  });
};

export const useIgnorarAlerta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, razon }: { id: string; razon: string }) =>
      auditoriaService.ignorarAlerta(id, razon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas-activas'] });
    },
  });
};

export const useAgregarComentarioAlerta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ alertaId, contenido }: { alertaId: string; contenido: string }) =>
      auditoriaService.agregarComentarioAlerta(alertaId, contenido),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alerta', variables.alertaId] });
    },
  });
};

export const useAsignarInvestigacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ alertaId, usuarioId }: { alertaId: string; usuarioId: string }) =>
      auditoriaService.asignarInvestigacion(alertaId, usuarioId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alerta', variables.alertaId] });
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

// ===== MUTATIONS EXPORTACIÓN =====
export const useExportarRegistros = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formato, filtros }: { formato: 'csv' | 'json' | 'pdf' | 'excel'; filtros?: FiltrosAuditoria }) =>
      auditoriaService.exportarRegistros(formato, filtros),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros'] });
    },
  });
};

export const useExportarAlertas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formato: 'csv' | 'json' | 'pdf' | 'excel') =>
      auditoriaService.exportarAlertas(formato),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useExportarSesiones = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formato: 'csv' | 'json' | 'pdf' | 'excel') =>
      auditoriaService.exportarSesiones(formato),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesiones'] });
    },
  });
};

// ===== MUTATIONS CONFIGURACIÓN =====
export const useActualizarConfiguracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<ConfiguracionAuditoria>) =>
      auditoriaService.actualizarConfiguracion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracion-auditoria'] });
    },
  });
};

// ===== MUTATIONS MANTENIMIENTO =====
export const useEliminarRegistrosAntiguos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (diasRetenccion: number) =>
      auditoriaService.eliminarRegistrosAntiguos(diasRetenccion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-auditoria'] });
    },
  });
};

export const usePurgarAlertas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (diasRetenccion: number) =>
      auditoriaService.purgarAlertas(diasRetenccion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-auditoria'] });
    },
  });
};

// ===== LEGACY HOOKS FOR COMPATIBILITY =====
export const useAuditoriaTimeline = (params: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ['auditoria-timeline', params],
    queryFn: async () => {
      const result = await auditoriaService.listarRegistros();
      const data = (result as any)?.data;
      return {
        items: data?.registros || [],
      };
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAuditoriaBuscar = (params: { q: string; page: number; pageSize: number }, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['auditoria-buscar', params],
    queryFn: async () => {
      const result = await auditoriaService.buscarRegistros(params.q);
      const data = (result as any)?.data;
      return {
        items: Array.isArray(data) ? data : [],
      };
    },
    staleTime: 1 * 60 * 1000,
    enabled,
  });
};

export const useAuditoriaFiltrado = (params: any, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['auditoria-filtrado', params],
    queryFn: async () => {
      const result = await auditoriaService.listarRegistros();
      const data = (result as any)?.data;
      return {
        items: data?.registros || [],
      };
    },
    staleTime: 2 * 60 * 1000,
    enabled,
  });
};

export const useAuditoriaHistorial = (tabla: string, registroId: string, params: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ['auditoria-historial', tabla, registroId, params],
    queryFn: async () => {
      const result = await auditoriaService.listarRegistros();
      const data = (result as any)?.data;
      return {
        items: (data?.registros || []).filter(
          (r: any) => r.tipoRecurso === tabla && r.recursoId === registroId
        ),
      };
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!tabla && !!registroId,
  });
};

export const useAuditoriaResumen = () => {
  return useQuery({
    queryKey: ['auditoria-resumen'],
    queryFn: async () => {
      const stats = await auditoriaService.obtenerEstadisticas();
      const data = (stats as any)?.data;
      return {
        total: data?.totalRegistros || 0,
        porAccion: data?.registrosPorTipoAccion || {},
        porTabla: data?.registrosPorRecurso || {},
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
