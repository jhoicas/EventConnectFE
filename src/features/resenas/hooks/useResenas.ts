import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reseniasService } from '../services/reseniasService';
import type {
  Resenia,
  FiltrosResenia,
  ModeracionResenia,
  RespuestaResenia,
  ReportResenia,
} from '../types';

const QUERY_KEYS = {
  resenia: (id: string) => ['resenas', 'detalle', id],
  resenas: (filtros?: FiltrosResenia) => ['resenas', 'lista', filtros],
  agregada: (tipo: string, refId: string) => ['resenas', 'agregada', tipo, refId],
  agregadas: (tipo: string) => ['resenas', 'agregadas', tipo],
  reseniasCliente: (clienteId: string) => ['resenas', 'cliente', clienteId],
  reseniasProveedor: (proveedorId: string) => ['resenas', 'proveedor', proveedorId],
  reportes: (estado?: string) => ['resenas', 'reportes', estado],
  estadisticas: (inicio: string, fin: string) => ['resenas', 'estadisticas', inicio, fin],
};

// Reseñas
export const useListarResenas = (filtros?: FiltrosResenia) => {
  return useQuery({
    queryKey: QUERY_KEYS.resenas(filtros),
    queryFn: () => reseniasService.listarResenas(filtros),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

export const useObtenerResenia = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.resenia(id),
    queryFn: () => reseniasService.obtenerResenia(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCrearResenia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Resenia>) => reseniasService.crearResenia(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenas() });
      if (data.refId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agregada(data.tipo || 'servicio', data.refId) });
      }
    },
  });
};

export const useActualizarResenia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resenia> }) =>
      reseniasService.actualizarResenia(id, data),
    onSuccess: (resenia) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resenia.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenas() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agregada(resenia.tipo, resenia.refId) });
    },
  });
};

export const useEliminarResenia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reseniasService.eliminarResenia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenas() });
    },
  });
};

// Calificación agregada
export const useObtenerCalificacionAgregada = (tipo: string, refId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.agregada(tipo, refId),
    queryFn: () => reseniasService.obtenerCalificacionAgregada(tipo, refId),
    enabled: !!tipo && !!refId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useObtenerCalificacionesAgregadas = (tipo: string, refIds: string[]) => {
  return useQuery({
    queryKey: QUERY_KEYS.agregadas(tipo),
    queryFn: () => reseniasService.obtenerCalificacionesAgregadas(tipo, refIds),
    enabled: !!tipo && refIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Respuestas
export const useCrearRespuesta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaId, data }: { resienaId: string; data: Partial<RespuestaResenia> }) =>
      reseniasService.crearRespuesta(resienaId, data),
    onSuccess: (_, { resienaId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resienaId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenas() });
    },
  });
};

export const useActualizarRespuesta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaId, respuestaId, data }: { resienaId: string; respuestaId: string; data: Partial<RespuestaResenia> }) =>
      reseniasService.actualizarRespuesta(resienaId, respuestaId, data),
    onSuccess: (_, { resienaId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resienaId) });
    },
  });
};

export const useEliminarRespuesta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaId, respuestaId }: { resienaId: string; respuestaId: string }) =>
      reseniasService.eliminarRespuesta(resienaId, respuestaId),
    onSuccess: (_, { resienaId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resienaId) });
    },
  });
};

// Moderación
export const useAprobarResenia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaId, moderadoPor }: { resienaId: string; moderadoPor: string }) =>
      reseniasService.aprobarResenia(resienaId, moderadoPor),
    onSuccess: (resenia) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resenia.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenas() });
    },
  });
};

export const useRechazarResenia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ModeracionResenia) => reseniasService.rechazarResenia(data),
    onSuccess: (resenia) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resenia.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenas() });
    },
  });
};

export const useModerarLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaIds, estado, moderadoPor }: { resienaIds: string[]; estado: 'aprobada' | 'rechazada'; moderadoPor: string }) =>
      reseniasService.moderarLote(resienaIds, estado, moderadoPor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenas() });
    },
  });
};

// Me gusta / No me gusta
export const useMarcarBeneficioso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaId, usuarioId }: { resienaId: string; usuarioId: string }) =>
      reseniasService.marcarBeneficioso(resienaId, usuarioId),
    onSuccess: (resenia) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resenia.id) });
    },
  });
};

export const useDesmarcarBeneficioso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaId, usuarioId }: { resienaId: string; usuarioId: string }) =>
      reseniasService.desmarcarBeneficioso(resienaId, usuarioId),
    onSuccess: (resenia) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resenia.id) });
    },
  });
};

export const useMarcarPerjudicial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resienaId, usuarioId }: { resienaId: string; usuarioId: string }) =>
      reseniasService.marcarPerjudicial(resienaId, usuarioId),
    onSuccess: (resenia) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resenia(resenia.id) });
    },
  });
};

// Reportes
export const useReportarResenia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ReportResenia>) => reseniasService.reportarResenia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reportes() });
    },
  });
};

export const useObtenerReportes = (estado?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.reportes(estado),
    queryFn: () => reseniasService.obtenerReportes(estado),
    staleTime: 3 * 60 * 1000,
  });
};

export const useResolverReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reporteId, data }: { reporteId: string; data: { accion: string; revisadoPor: string } }) =>
      reseniasService.resolverReporte(reporteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reportes() });
    },
  });
};

// Estadísticas
export const useObtenerEstadisticas = (fechaInicio: string, fechaFin: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.estadisticas(fechaInicio, fechaFin),
    queryFn: () => reseniasService.obtenerEstadisticas(fechaInicio, fechaFin),
    staleTime: 5 * 60 * 1000,
  });
};

// Cliente y Proveedor
export const useReseniasCliente = (clienteId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.reseniasCliente(clienteId),
    queryFn: () => reseniasService.obtenerReseniasCliente(clienteId),
    enabled: !!clienteId,
    staleTime: 3 * 60 * 1000,
  });
};

export const useReseniasProveedor = (proveedorId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.reseniasProveedor(proveedorId),
    queryFn: () => reseniasService.obtenerReseniasProveedor(proveedorId),
    enabled: !!proveedorId,
    staleTime: 3 * 60 * 1000,
  });
};
