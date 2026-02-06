import axios from '@/lib/axios';
import type {
  PerfilJugador,
  Logro,
  Insignia,
  Recompensa,
  Clasificacion,
  Reto,
  ProgresoReto,
  HistorialPuntos,
  NotificacionGamificacion,
  ConfiguracionSistemaPuntos,
  EstadisticasGamificacion,
  FiltrosBusquedaSistemaPuntos,
  ResponseSistemaPuntos,
} from '../types';

const API_BASE = '/api/sistema-puntos';

// ==================== PERFIL JUGADOR ====================

export const sistemapuntosService = {
  // Perfil Jugador
  obtenerPerfilJugador: async (usuarioId?: string) => {
    const endpoint = usuarioId ? `${API_BASE}/perfil/${usuarioId}` : `${API_BASE}/perfil`;
    return axios.get<ResponseSistemaPuntos<PerfilJugador>>(endpoint);
  },

  actualizarPerfilJugador: async (usuarioId: string, datos: Partial<PerfilJugador>) => {
    return axios.put<ResponseSistemaPuntos<PerfilJugador>>(`${API_BASE}/perfil/${usuarioId}`, datos);
  },

  actualizarPreferenciasNotificacion: async (usuarioId: string, preferencias: any) => {
    return axios.patch<ResponseSistemaPuntos<PerfilJugador>>(
      `${API_BASE}/perfil/${usuarioId}/notificaciones`,
      preferencias
    );
  },

  obtenerEstadisticasJugador: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<any>>(`${API_BASE}/perfil/${usuarioId}/estadisticas`);
  },

  // ==================== LOGROS ====================

  listarLogros: async (filtros: FiltrosBusquedaSistemaPuntos = {}) => {
    return axios.get<ResponseSistemaPuntos<{ logros: Logro[]; total: number }>>(
      `${API_BASE}/logros`,
      { params: filtros }
    );
  },

  obtenerLogro: async (logroId: string) => {
    return axios.get<ResponseSistemaPuntos<Logro>>(`${API_BASE}/logros/${logroId}`);
  },

  crearLogro: async (datos: Partial<Logro>) => {
    return axios.post<ResponseSistemaPuntos<Logro>>(`${API_BASE}/logros`, datos);
  },

  actualizarLogro: async (logroId: string, datos: Partial<Logro>) => {
    return axios.put<ResponseSistemaPuntos<Logro>>(`${API_BASE}/logros/${logroId}`, datos);
  },

  eliminarLogro: async (logroId: string) => {
    return axios.delete<ResponseSistemaPuntos<{ mensaje: string }>>(`${API_BASE}/logros/${logroId}`);
  },

  desbloquearLogro: async (usuarioId: string, logroId: string) => {
    return axios.post<ResponseSistemaPuntos<Logro>>(
      `${API_BASE}/logros/${logroId}/desbloquear`,
      { usuarioId }
    );
  },

  obtenerProgresoLogro: async (usuarioId: string, logroId: string) => {
    return axios.get<ResponseSistemaPuntos<any>>(
      `${API_BASE}/logros/${logroId}/progreso/${usuarioId}`
    );
  },

  buscarLogros: async (busqueda: string, filtros?: Partial<FiltrosBusquedaSistemaPuntos>) => {
    return axios.get<ResponseSistemaPuntos<{ logros: Logro[]; total: number }>>(
      `${API_BASE}/logros/buscar/${busqueda}`,
      { params: filtros }
    );
  },

  // ==================== INSIGNIAS ====================

  listarInsignias: async () => {
    return axios.get<ResponseSistemaPuntos<{ insignias: Insignia[] }>>(`${API_BASE}/insignias`);
  },

  obtenerInsignia: async (insigniaId: string) => {
    return axios.get<ResponseSistemaPuntos<Insignia>>(`${API_BASE}/insignias/${insigniaId}`);
  },

  desbloquearInsignia: async (usuarioId: string, insigniaId: string) => {
    return axios.post<ResponseSistemaPuntos<Insignia>>(
      `${API_BASE}/insignias/${insigniaId}/desbloquear`,
      { usuarioId }
    );
  },

  obtenerInsigniasPorUsuario: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<{ insignias: Insignia[] }>>(
      `${API_BASE}/insignias/usuario/${usuarioId}`
    );
  },

  crearInsignia: async (datos: Partial<Insignia>) => {
    return axios.post<ResponseSistemaPuntos<Insignia>>(`${API_BASE}/insignias`, datos);
  },

  actualizarInsignia: async (insigniaId: string, datos: Partial<Insignia>) => {
    return axios.put<ResponseSistemaPuntos<Insignia>>(`${API_BASE}/insignias/${insigniaId}`, datos);
  },

  // ==================== RECOMPENSAS ====================

  listarRecompensas: async (filtros?: FiltrosBusquedaSistemaPuntos) => {
    return axios.get<ResponseSistemaPuntos<{ recompensas: Recompensa[]; total: number }>>(
      `${API_BASE}/recompensas`,
      { params: filtros }
    );
  },

  obtenerRecompensa: async (recompensaId: string) => {
    return axios.get<ResponseSistemaPuntos<Recompensa>>(`${API_BASE}/recompensas/${recompensaId}`);
  },

  crearRecompensa: async (datos: Partial<Recompensa>) => {
    return axios.post<ResponseSistemaPuntos<Recompensa>>(`${API_BASE}/recompensas`, datos);
  },

  actualizarRecompensa: async (recompensaId: string, datos: Partial<Recompensa>) => {
    return axios.put<ResponseSistemaPuntos<Recompensa>>(
      `${API_BASE}/recompensas/${recompensaId}`,
      datos
    );
  },

  canjearRecompensa: async (usuarioId: string, recompensaId: string) => {
    return axios.post<ResponseSistemaPuntos<Recompensa>>(
      `${API_BASE}/recompensas/${recompensaId}/canjear`,
      { usuarioId }
    );
  },

  obtenerRecompensasDisponibles: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<{ recompensas: Recompensa[] }>>(
      `${API_BASE}/recompensas/disponibles/${usuarioId}`
    );
  },

  obtenerHistorialCanjes: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<{ canjes: any[] }>>(
      `${API_BASE}/recompensas/usuario/${usuarioId}/historial`
    );
  },

  // ==================== CLASIFICACION ====================

  obtenerClasificacion: async (periodo: string = 'mensual') => {
    return axios.get<ResponseSistemaPuntos<{ clasificacion: Clasificacion[]; total: number }>>(
      `${API_BASE}/clasificacion`,
      { params: { periodo } }
    );
  },

  obtenerPosicionUsuario: async (usuarioId: string, periodo?: string) => {
    return axios.get<ResponseSistemaPuntos<Clasificacion>>(
      `${API_BASE}/clasificacion/usuario/${usuarioId}`,
      { params: { periodo } }
    );
  },

  obtenerTop10: async (periodo: string = 'mensual') => {
    return axios.get<ResponseSistemaPuntos<{ jugadores: Clasificacion[] }>>(
      `${API_BASE}/clasificacion/top10`,
      { params: { periodo } }
    );
  },

  obtenerAmigos: async (usuarioId: string, periodo?: string) => {
    return axios.get<ResponseSistemaPuntos<{ amigos: Clasificacion[] }>>(
      `${API_BASE}/clasificacion/amigos/${usuarioId}`,
      { params: { periodo } }
    );
  },

  // ==================== RETOS ====================

  listarRetos: async (filtros?: FiltrosBusquedaSistemaPuntos) => {
    return axios.get<ResponseSistemaPuntos<{ retos: Reto[]; total: number }>>(
      `${API_BASE}/retos`,
      { params: filtros }
    );
  },

  obtenerReto: async (retoId: string) => {
    return axios.get<ResponseSistemaPuntos<Reto>>(`${API_BASE}/retos/${retoId}`);
  },

  crearReto: async (datos: Partial<Reto>) => {
    return axios.post<ResponseSistemaPuntos<Reto>>(`${API_BASE}/retos`, datos);
  },

  actualizarReto: async (retoId: string, datos: Partial<Reto>) => {
    return axios.put<ResponseSistemaPuntos<Reto>>(`${API_BASE}/retos/${retoId}`, datos);
  },

  eliminarReto: async (retoId: string) => {
    return axios.delete<ResponseSistemaPuntos<{ mensaje: string }>>(`${API_BASE}/retos/${retoId}`);
  },

  unirsseAReto: async (usuarioId: string, retoId: string) => {
    return axios.post<ResponseSistemaPuntos<ProgresoReto>>(
      `${API_BASE}/retos/${retoId}/unirse`,
      { usuarioId }
    );
  },

  completarReto: async (usuarioId: string, retoId: string) => {
    return axios.post<ResponseSistemaPuntos<ProgresoReto>>(
      `${API_BASE}/retos/${retoId}/completar`,
      { usuarioId }
    );
  },

  obtenerProgresoReto: async (usuarioId: string, retoId: string) => {
    return axios.get<ResponseSistemaPuntos<ProgresoReto>>(
      `${API_BASE}/retos/${retoId}/progreso/${usuarioId}`
    );
  },

  obtenerRetosActivos: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<{ retos: Reto[] }>>(
      `${API_BASE}/retos/activos/${usuarioId}`
    );
  },

  obtenerRetosCompletados: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<{ retos: Reto[] }>>(
      `${API_BASE}/retos/completados/${usuarioId}`
    );
  },

  // ==================== PUNTOS ====================

  agregarPuntos: async (usuarioId: string, cantidad: number, motivo: string) => {
    return axios.post<ResponseSistemaPuntos<PerfilJugador>>(`${API_BASE}/puntos/agregar`, {
      usuarioId,
      cantidad,
      motivo,
    });
  },

  restarPuntos: async (usuarioId: string, cantidad: number, motivo: string) => {
    return axios.post<ResponseSistemaPuntos<PerfilJugador>>(`${API_BASE}/puntos/restar`, {
      usuarioId,
      cantidad,
      motivo,
    });
  },

  obtenerHistorialPuntos: async (usuarioId: string, limite: number = 100) => {
    return axios.get<ResponseSistemaPuntos<{ historial: HistorialPuntos[] }>>(
      `${API_BASE}/puntos/historial/${usuarioId}`,
      { params: { limite } }
    );
  },

  obtenerSaldoPuntos: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<{ saldo: number; disponible: number }>>(
      `${API_BASE}/puntos/saldo/${usuarioId}`
    );
  },

  // ==================== NOTIFICACIONES ====================

  listarNotificaciones: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<{ notificaciones: NotificacionGamificacion[] }>>(
      `${API_BASE}/notificaciones/${usuarioId}`
    );
  },

  marcarNotificacionLeida: async (notificacionId: string) => {
    return axios.patch<ResponseSistemaPuntos<NotificacionGamificacion>>(
      `${API_BASE}/notificaciones/${notificacionId}/leer`
    );
  },

  marcarTodasComoLeidas: async (usuarioId: string) => {
    return axios.patch<ResponseSistemaPuntos<{ mensaje: string }>>(
      `${API_BASE}/notificaciones/${usuarioId}/leer-todas`
    );
  },

  eliminarNotificacion: async (notificacionId: string) => {
    return axios.delete<ResponseSistemaPuntos<{ mensaje: string }>>(
      `${API_BASE}/notificaciones/${notificacionId}`
    );
  },

  // ==================== CONFIGURACION ====================

  obtenerConfiguracion: async () => {
    return axios.get<ResponseSistemaPuntos<ConfiguracionSistemaPuntos>>(
      `${API_BASE}/configuracion`
    );
  },

  actualizarConfiguracion: async (datos: Partial<ConfiguracionSistemaPuntos>) => {
    return axios.put<ResponseSistemaPuntos<ConfiguracionSistemaPuntos>>(
      `${API_BASE}/configuracion`,
      datos
    );
  },

  // ==================== ESTADISTICAS ====================

  obtenerEstadisticas: async () => {
    return axios.get<ResponseSistemaPuntos<EstadisticasGamificacion>>(
      `${API_BASE}/estadisticas`
    );
  },

  obtenerEstadisticasUsuario: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<any>>(`${API_BASE}/estadisticas/${usuarioId}`);
  },

  obtenerTendencias: async (periodo: string = 'mes') => {
    return axios.get<ResponseSistemaPuntos<any>>(`${API_BASE}/estadisticas/tendencias`, {
      params: { periodo },
    });
  },

  // ==================== UTILIDADES ====================

  subidaNivel: async (usuarioId: string) => {
    return axios.post<ResponseSistemaPuntos<PerfilJugador>>(
      `${API_BASE}/utilidades/subida-nivel`,
      { usuarioId }
    );
  },

  reiniciarProgreso: async (usuarioId: string) => {
    return axios.post<ResponseSistemaPuntos<{ mensaje: string }>>(
      `${API_BASE}/utilidades/reiniciar-progreso`,
      { usuarioId }
    );
  },

  exportarDatos: async (usuarioId: string) => {
    return axios.get<ResponseSistemaPuntos<any>>(`${API_BASE}/utilidades/exportar/${usuarioId}`);
  },
};

export default sistemapuntosService;
