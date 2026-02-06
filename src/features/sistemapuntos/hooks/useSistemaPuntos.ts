import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import sistemapuntosService from '../services/sistemapuntosService';
import type {
  PerfilJugador,
  Logro,
  Insignia,
  Recompensa,
  Reto,
  FiltrosBusquedaSistemaPuntos,
} from '../types';

// ==================== QUERIES ====================

// Perfil Jugador
export const useObtenerPerfilJugador = (usuarioId?: string) => {
  return useQuery({
    queryKey: ['perfilJugador', usuarioId],
    queryFn: () => sistemapuntosService.obtenerPerfilJugador(usuarioId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerEstadisticasJugador = (usuarioId: string) => {
  return useQuery({
    queryKey: ['estadisticasJugador', usuarioId],
    queryFn: () => sistemapuntosService.obtenerEstadisticasJugador(usuarioId),
    staleTime: 3 * 60 * 1000,
  });
};

// Logros
export const useListarLogros = (filtros: FiltrosBusquedaSistemaPuntos = {}) => {
  return useQuery({
    queryKey: ['logros', filtros],
    queryFn: () => sistemapuntosService.listarLogros(filtros),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerLogro = (logroId: string) => {
  return useQuery({
    queryKey: ['logro', logroId],
    queryFn: () => sistemapuntosService.obtenerLogro(logroId),
    staleTime: 10 * 60 * 1000,
  });
};

export const useBuscarLogros = (busqueda: string) => {
  return useQuery({
    queryKey: ['buscarLogros', busqueda],
    queryFn: () => sistemapuntosService.buscarLogros(busqueda),
    staleTime: 3 * 60 * 1000,
    enabled: busqueda.length > 0,
  });
};

export const useObtenerProgresoLogro = (usuarioId: string, logroId: string) => {
  return useQuery({
    queryKey: ['progresoLogro', usuarioId, logroId],
    queryFn: () => sistemapuntosService.obtenerProgresoLogro(usuarioId, logroId),
    staleTime: 2 * 60 * 1000,
  });
};

// Insignias
export const useListarInsignias = () => {
  return useQuery({
    queryKey: ['insignias'],
    queryFn: () => sistemapuntosService.listarInsignias(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerInsignia = (insigniaId: string) => {
  return useQuery({
    queryKey: ['insignia', insigniaId],
    queryFn: () => sistemapuntosService.obtenerInsignia(insigniaId),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerInsigniasPorUsuario = (usuarioId: string) => {
  return useQuery({
    queryKey: ['insigniasUsuario', usuarioId],
    queryFn: () => sistemapuntosService.obtenerInsigniasPorUsuario(usuarioId),
    staleTime: 5 * 60 * 1000,
  });
};

// Recompensas
export const useListarRecompensas = (filtros?: FiltrosBusquedaSistemaPuntos) => {
  return useQuery({
    queryKey: ['recompensas', filtros],
    queryFn: () => sistemapuntosService.listarRecompensas(filtros),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerRecompensa = (recompensaId: string) => {
  return useQuery({
    queryKey: ['recompensa', recompensaId],
    queryFn: () => sistemapuntosService.obtenerRecompensa(recompensaId),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerRecompensasDisponibles = (usuarioId: string) => {
  return useQuery({
    queryKey: ['recompensasDisponibles', usuarioId],
    queryFn: () => sistemapuntosService.obtenerRecompensasDisponibles(usuarioId),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerHistorialCanjes = (usuarioId: string) => {
  return useQuery({
    queryKey: ['historialCanjes', usuarioId],
    queryFn: () => sistemapuntosService.obtenerHistorialCanjes(usuarioId),
    staleTime: 5 * 60 * 1000,
  });
};

// Clasificación
export const useObtenerClasificacion = (periodo: string = 'mensual') => {
  return useQuery({
    queryKey: ['clasificacion', periodo],
    queryFn: () => sistemapuntosService.obtenerClasificacion(periodo),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerPosicionUsuario = (usuarioId: string, periodo?: string) => {
  return useQuery({
    queryKey: ['posicionUsuario', usuarioId, periodo],
    queryFn: () => sistemapuntosService.obtenerPosicionUsuario(usuarioId, periodo),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerTop10 = (periodo: string = 'mensual') => {
  return useQuery({
    queryKey: ['top10', periodo],
    queryFn: () => sistemapuntosService.obtenerTop10(periodo),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerAmigos = (usuarioId: string, periodo?: string) => {
  return useQuery({
    queryKey: ['amigos', usuarioId, periodo],
    queryFn: () => sistemapuntosService.obtenerAmigos(usuarioId, periodo),
    staleTime: 3 * 60 * 1000,
  });
};

// Retos
export const useListarRetos = (filtros?: FiltrosBusquedaSistemaPuntos) => {
  return useQuery({
    queryKey: ['retos', filtros],
    queryFn: () => sistemapuntosService.listarRetos(filtros),
    staleTime: 3 * 60 * 1000,
  });
};

export const useObtenerReto = (retoId: string) => {
  return useQuery({
    queryKey: ['reto', retoId],
    queryFn: () => sistemapuntosService.obtenerReto(retoId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerProgresoReto = (usuarioId: string, retoId: string) => {
  return useQuery({
    queryKey: ['progresoReto', usuarioId, retoId],
    queryFn: () => sistemapuntosService.obtenerProgresoReto(usuarioId, retoId),
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerRetosActivos = (usuarioId: string) => {
  return useQuery({
    queryKey: ['retosActivos', usuarioId],
    queryFn: () => sistemapuntosService.obtenerRetosActivos(usuarioId),
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerRetosCompletados = (usuarioId: string) => {
  return useQuery({
    queryKey: ['retosCompletados', usuarioId],
    queryFn: () => sistemapuntosService.obtenerRetosCompletados(usuarioId),
    staleTime: 5 * 60 * 1000,
  });
};

// Puntos
export const useObtenerHistorialPuntos = (usuarioId: string, limite: number = 100) => {
  return useQuery({
    queryKey: ['historialPuntos', usuarioId, limite],
    queryFn: () => sistemapuntosService.obtenerHistorialPuntos(usuarioId, limite),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerSaldoPuntos = (usuarioId: string) => {
  return useQuery({
    queryKey: ['saldoPuntos', usuarioId],
    queryFn: () => sistemapuntosService.obtenerSaldoPuntos(usuarioId),
    staleTime: 2 * 60 * 1000,
  });
};

// Notificaciones
export const useListarNotificaciones = (usuarioId: string) => {
  return useQuery({
    queryKey: ['notificaciones', usuarioId],
    queryFn: () => sistemapuntosService.listarNotificaciones(usuarioId),
    staleTime: 60 * 1000,
  });
};

// Configuración
export const useObtenerConfiguracion = () => {
  return useQuery({
    queryKey: ['configuracion'],
    queryFn: () => sistemapuntosService.obtenerConfiguracion(),
    staleTime: 30 * 60 * 1000,
  });
};

// Estadísticas
export const useObtenerEstadisticas = () => {
  return useQuery({
    queryKey: ['estadisticas'],
    queryFn: () => sistemapuntosService.obtenerEstadisticas(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useObtenerEstadisticasUsuario = (usuarioId: string) => {
  return useQuery({
    queryKey: ['estadisticasUsuario', usuarioId],
    queryFn: () => sistemapuntosService.obtenerEstadisticasUsuario(usuarioId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerTendencias = (periodo: string = 'mes') => {
  return useQuery({
    queryKey: ['tendencias', periodo],
    queryFn: () => sistemapuntosService.obtenerTendencias(periodo),
    staleTime: 10 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

const queryClient = useQueryClient();

// Perfil
export const useActualizarPerfilJugador = () => {
  return useMutation({
    mutationFn: ({ usuarioId, datos }: { usuarioId: string; datos: Partial<PerfilJugador> }) =>
      sistemapuntosService.actualizarPerfilJugador(usuarioId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
    },
  });
};

export const useActualizarPreferenciasNotificacion = () => {
  return useMutation({
    mutationFn: ({ usuarioId, preferencias }: { usuarioId: string; preferencias: any }) =>
      sistemapuntosService.actualizarPreferenciasNotificacion(usuarioId, preferencias),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
    },
  });
};

// Logros
export const useDesbloquearLogro = () => {
  return useMutation({
    mutationFn: ({ usuarioId, logroId }: { usuarioId: string; logroId: string }) =>
      sistemapuntosService.desbloquearLogro(usuarioId, logroId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logros'] });
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
    },
  });
};

export const useCrearLogro = () => {
  return useMutation({
    mutationFn: (datos: Partial<Logro>) => sistemapuntosService.crearLogro(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logros'] });
    },
  });
};

export const useActualizarLogro = () => {
  return useMutation({
    mutationFn: ({ logroId, datos }: { logroId: string; datos: Partial<Logro> }) =>
      sistemapuntosService.actualizarLogro(logroId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logros'] });
    },
  });
};

export const useEliminarLogro = () => {
  return useMutation({
    mutationFn: (logroId: string) => sistemapuntosService.eliminarLogro(logroId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logros'] });
    },
  });
};

// Insignias
export const useDesbloquearInsignia = () => {
  return useMutation({
    mutationFn: ({ usuarioId, insigniaId }: { usuarioId: string; insigniaId: string }) =>
      sistemapuntosService.desbloquearInsignia(usuarioId, insigniaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insignias'] });
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
    },
  });
};

export const useCrearInsignia = () => {
  return useMutation({
    mutationFn: (datos: Partial<Insignia>) => sistemapuntosService.crearInsignia(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insignias'] });
    },
  });
};

export const useActualizarInsignia = () => {
  return useMutation({
    mutationFn: ({ insigniaId, datos }: { insigniaId: string; datos: Partial<Insignia> }) =>
      sistemapuntosService.actualizarInsignia(insigniaId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insignias'] });
    },
  });
};

// Recompensas
export const useCanjearRecompensa = () => {
  return useMutation({
    mutationFn: ({ usuarioId, recompensaId }: { usuarioId: string; recompensaId: string }) =>
      sistemapuntosService.canjearRecompensa(usuarioId, recompensaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recompensas'] });
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
      queryClient.invalidateQueries({ queryKey: ['saldoPuntos'] });
    },
  });
};

export const useCrearRecompensa = () => {
  return useMutation({
    mutationFn: (datos: Partial<Recompensa>) => sistemapuntosService.crearRecompensa(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recompensas'] });
    },
  });
};

export const useActualizarRecompensa = () => {
  return useMutation({
    mutationFn: ({ recompensaId, datos }: { recompensaId: string; datos: Partial<Recompensa> }) =>
      sistemapuntosService.actualizarRecompensa(recompensaId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recompensas'] });
    },
  });
};

// Retos
export const useUnirsseAReto = () => {
  return useMutation({
    mutationFn: ({ usuarioId, retoId }: { usuarioId: string; retoId: string }) =>
      sistemapuntosService.unirsseAReto(usuarioId, retoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retos'] });
      queryClient.invalidateQueries({ queryKey: ['retosActivos'] });
    },
  });
};

export const useCompletarReto = () => {
  return useMutation({
    mutationFn: ({ usuarioId, retoId }: { usuarioId: string; retoId: string }) =>
      sistemapuntosService.completarReto(usuarioId, retoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retos'] });
      queryClient.invalidateQueries({ queryKey: ['retosCompletados'] });
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
      queryClient.invalidateQueries({ queryKey: ['saldoPuntos'] });
    },
  });
};

export const useCrearReto = () => {
  return useMutation({
    mutationFn: (datos: Partial<Reto>) => sistemapuntosService.crearReto(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retos'] });
    },
  });
};

export const useActualizarReto = () => {
  return useMutation({
    mutationFn: ({ retoId, datos }: { retoId: string; datos: Partial<Reto> }) =>
      sistemapuntosService.actualizarReto(retoId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retos'] });
    },
  });
};

export const useEliminarReto = () => {
  return useMutation({
    mutationFn: (retoId: string) => sistemapuntosService.eliminarReto(retoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retos'] });
    },
  });
};

// Puntos
export const useAgregarPuntos = () => {
  return useMutation({
    mutationFn: ({ usuarioId, cantidad, motivo }: { usuarioId: string; cantidad: number; motivo: string }) =>
      sistemapuntosService.agregarPuntos(usuarioId, cantidad, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
      queryClient.invalidateQueries({ queryKey: ['saldoPuntos'] });
      queryClient.invalidateQueries({ queryKey: ['historialPuntos'] });
    },
  });
};

export const useRestarPuntos = () => {
  return useMutation({
    mutationFn: ({ usuarioId, cantidad, motivo }: { usuarioId: string; cantidad: number; motivo: string }) =>
      sistemapuntosService.restarPuntos(usuarioId, cantidad, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
      queryClient.invalidateQueries({ queryKey: ['saldoPuntos'] });
      queryClient.invalidateQueries({ queryKey: ['historialPuntos'] });
    },
  });
};

// Notificaciones
export const useMarcarNotificacionLeida = () => {
  return useMutation({
    mutationFn: (notificacionId: string) => sistemapuntosService.marcarNotificacionLeida(notificacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    },
  });
};

export const useMarcarTodasComoLeidas = () => {
  return useMutation({
    mutationFn: (usuarioId: string) => sistemapuntosService.marcarTodasComoLeidas(usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    },
  });
};

export const useEliminarNotificacion = () => {
  return useMutation({
    mutationFn: (notificacionId: string) => sistemapuntosService.eliminarNotificacion(notificacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
    },
  });
};

// Configuración
export const useActualizarConfiguracion = () => {
  return useMutation({
    mutationFn: (datos: any) => sistemapuntosService.actualizarConfiguracion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracion'] });
    },
  });
};

// Utilidades
export const useSubidaNivel = () => {
  return useMutation({
    mutationFn: (usuarioId: string) => sistemapuntosService.subidaNivel(usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
    },
  });
};

export const useReiniciarProgreso = () => {
  return useMutation({
    mutationFn: (usuarioId: string) => sistemapuntosService.reiniciarProgreso(usuarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfilJugador'] });
      queryClient.invalidateQueries({ queryKey: ['logros'] });
      queryClient.invalidateQueries({ queryKey: ['saldoPuntos'] });
    },
  });
};

export const useExportarDatos = () => {
  return useMutation({
    mutationFn: (usuarioId: string) => sistemapuntosService.exportarDatos(usuarioId),
  });
};
