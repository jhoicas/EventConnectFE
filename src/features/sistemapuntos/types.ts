// Tipos de gamificación para el Sistema de Puntos

// Union Types
export type TipoLogro = 'primera_compra' | 'cliente_frecuente' | 'referencia' | 'resena' | 'miembro_vip' | 'hito_puntos' | 'personalizado';
export type EstadoLogro = 'desbloqueado' | 'en_progreso' | 'completado' | 'bloqueado';
export type TipoInsignia = 'bronce' | 'plata' | 'oro' | 'platino' | 'diamante';
export type NivelJugador = 'principiante' | 'novato' | 'intermedio' | 'avanzado' | 'experto' | 'maestro' | 'leyenda';
export type TipoRecompensa = 'descuento' | 'credito' | 'acceso_exclusivo' | 'doble_puntos' | 'envio_gratis' | 'personalizado';
export type EstadoRecompensa = 'disponible' | 'canjeada' | 'expirada' | 'bloqueada';
export type PeriodoClasificacion = 'semanal' | 'mensual' | 'trimestral' | 'anual' | 'todo_tiempo';
export type TipoReto = 'diario' | 'semanal' | 'mensual' | 'especial';
export type EstadoReto = 'activo' | 'completado' | 'fallido' | 'expirado';

// Interfaces
export interface PerfilJugador {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  email: string;
  nivelActual: NivelJugador;
  puntosActuales: number;
  puntosDisponiblesParaCanjeo: number;
  puntosGastados: number;
  experienciaTotal: number;
  insigniasDesbloqueadas: string[];
  logrosCompletados: string[];
  rachaActual: number;
  mejorRacha: number;
  posicionClasificacion: number;
  fechaRegistro: Date;
  ultimaActividad: Date;
  estadisticas: EstadisticasJugador;
  preferenciasNotificacion: {
    logros: boolean;
    recompensas: boolean;
    retos: boolean;
    clasificacion: boolean;
    recordatorios: boolean;
  };
}

export interface EstadisticasJugador {
  totalActividades: number;
  actividadesEstaSemanaBrowser: number;
  comprasRealizadas: number;
  valortotalCompras: number;
  resenasEscritas: number;
  referenciasExitosas: number;
  recompendasCanjeadas: number;
  tasaCompletado: number;
  diasConsecutivos: number;
}

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoLogro;
  icono: string;
  estado: EstadoLogro;
  criterios: CriterioLogro[];
  puntosRecompensa: number;
  insigniaAsociada?: string;
  fechaDesbloqueado?: Date;
  progreso: number;
  requisitos: string[];
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
}

export interface CriterioLogro {
  id: string;
  nombre: string;
  descripcion: string;
  metrica: string;
  objetivoValor: number;
  operador: '>' | '>=' | '<' | '<=' | '=' | '!=';
  progreso: number;
}

export interface Insignia {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: TipoInsignia;
  icono: string;
  requisitoPuntos: number;
  requisitoNivel?: NivelJugador;
  requisitosCustom?: string[];
  desbloqueado: boolean;
  fechaDesbloqueo?: Date;
  beneficios: BeneficioInsignia[];
}

export interface BeneficioInsignia {
  tipo: 'multiplicador_puntos' | 'acceso_exclusivo' | 'descuento' | 'punto_bonus';
  valor: number | string;
  descripcion: string;
}

export interface Recompensa {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoRecompensa;
  costoPuntos: number;
  estado: EstadoRecompensa;
  inventario: number;
  disponibilidad: {
    disponible: boolean;
    desde?: Date;
    hasta?: Date;
  };
  beneficio: BeneficioRecompensa;
  imagen?: string;
  categora: string;
  popularidad: number;
  tiempoExpiracion?: number;
  limitePorUsuario?: number;
  canjesRealizados: number;
  ultimaActualizacion: Date;
}

export interface BeneficioRecompensa {
  tipo: TipoRecompensa;
  valor: number | string;
  codigo?: string;
  validezDias?: number;
  descripcin: string;
}

export interface Clasificacion {
  id: string;
  posicion: number;
  usuarioId: string;
  nombreUsuario: string;
  foto?: string;
  nivelActual: NivelJugador;
  puntosEstaSemanMes: number;
  puntosTotal: number;
  periodo: PeriodoClasificacion;
  cambioPositionDesdeUltima: number;
  insigniasActuales: number;
  racha: number;
  badge?: string;
  fechaActualizacion: Date;
}

export interface Reto {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoReto;
  icono: string;
  estado: EstadoReto;
  criterio: CriterioReto;
  puntosBonus: number;
  recompensaBonus?: string;
  fechaInicio: Date;
  fechaFin: Date;
  participantes: number;
  completadoPor: number;
  dificultad: 'facil' | 'media' | 'dificil' | 'imposible';
  requisitos?: string[];
  compartible: boolean;
}

export interface CriterioReto {
  metrica: string;
  objetivoValor: number;
  progreso: number;
  operador: '>' | '>=' | '<' | '<=' | '=' | '!=';
}

export interface ProgresoReto {
  id: string;
  usuarioId: string;
  retoId: string;
  estado: EstadoReto;
  progreso: number;
  porcentajeLlenado: number;
  fechaInicio: Date;
  fechaCompletado?: Date;
  puntosGanados: number;
  recompensaCanjeada: boolean;
}

export interface HistorialPuntos {
  id: string;
  usuarioId: string;
  tipo: 'ganancia' | 'gasto' | 'ajuste';
  cantidad: number;
  motivo: string;
  descripcion: string;
  logro?: string;
  recompensa?: string;
  saldoAnterior: number;
  saldoNuevo: number;
  fechaOperacion: Date;
}

export interface NotificacionGamificacion {
  id: string;
  usuarioId: string;
  tipo: 'logro_desbloqueado' | 'nivel_subida' | 'recompensa_disponible' | 'reto_iniciado' | 'reto_completado' | 'insignia_desbloqueada' | 'cambio_clasificacion';
  titulo: string;
  mensaje: string;
  icono?: string;
  color?: string;
  enlace?: string;
  leida: boolean;
  importante: boolean;
  fechaCreacion: Date;
  fechaLectura?: Date;
}

export interface ConfiguracionSistemaPuntos {
  id: string;
  puntosPorCompra: number;
  puntosPorResena: number;
  puntosPorReferencia: number;
  multiplicadorVip: number;
  multiplicadorPlata: number;
  multiplicadorOro: number;
  puntosPorNivelSubida: number;
  diasExpiracionPuntos?: number;
  requerPuntosProximoNivel: Record<NivelJugador, number>;
  habilitadoGamificacion: boolean;
  habilitadoClasificacion: boolean;
  habilitadoRetos: boolean;
  habilitadoInsignias: boolean;
  fechaCreacion: Date;
  ultimaActualizacion: Date;
}

export interface EstadisticasGamificacion {
  totalUsuariosActivos: number;
  puntosDistribuidosTotal: number;
  recompensasCanjeadasTotal: number;
  logrosMasDesbloqueados: Array<{ id: string; nombre: string; desbloqueos: number }>;
  recompensasMasCanjeadas: Array<{ id: string; nombre: string; canjes: number }>;
  usuariosMasActivos: Array<{ id: string; nombre: string; puntosGanados: number }>;
  tazaParticipacion: number;
  puntosPromedioUsuario: number;
  retosMasPopulares: Array<{ id: string; nombre: string; participantes: number }>;
  tendenciasPorFecha: Array<{ fecha: Date; puntosDistribuidos: number; usuariosActivos: number }>;
}

export interface FiltrosBusquedaSistemaPuntos {
  tipo?: TipoLogro;
  estado?: EstadoLogro;
  minPuntos?: number;
  maxPuntos?: number;
  nivel?: NivelJugador;
  rarity?: string;
  busqueda?: string;
  pagina?: number;
  limite?: number;
  ordenar?: 'nombre' | 'puntos' | 'popularidad' | 'fechaDesbloqueo';
  direccion?: 'asc' | 'desc';
}

export interface ResponseSistemaPuntos<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
