// Tipos para el módulo de Auditoría y Logs

// Uniones de tipos
export type TipoAccion = 'crear' | 'actualizar' | 'eliminar' | 'ver' | 'descargar' | 'exportar' | 'importar' | 'login' | 'logout' | 'cambiar_contrasena' | 'cambiar_rol' | 'aprobar' | 'rechazar' | 'publicar' | 'archivar' | 'restaurar';
export type TipoRecurso = 'usuario' | 'articulo' | 'resenia' | 'pedido' | 'factura' | 'pago' | 'notificacion' | 'documentacion' | 'categoria' | 'producto' | 'activo' | 'bodega' | 'reserva' | 'cliente' | 'configuracion' | 'sistema';
export type NivelSeveridad = 'info' | 'advertencia' | 'error' | 'critico';
export type EstadoAlerta = 'activa' | 'resuelta' | 'ignorada' | 'en_investigacion';
export type TipoPatron = 'multiples_intentos_fallidos' | 'acceso_no_autorizado' | 'eliminacion_masiva' | 'cambios_sospechosos' | 'acceso_horas_inusuales' | 'ubicacion_inusual' | 'cambio_rapido_datos';
export type EstadoSesion = 'activa' | 'cerrada' | 'expirada' | 'forzada';

// Interfaces
export interface RegistroAuditoria {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioAvatar: string;
  usuarioRol: string;
  tipoAccion: TipoAccion;
  tipoRecurso: TipoRecurso;
  recursoId: string;
  recursoNombre: string;
  descripcion: string;
  detalles: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  ubicacion?: {
    ciudad: string;
    pais: string;
    coordenadas: { lat: number; lng: number };
  };
  duracion: number; // en milisegundos
  estado: 'exitoso' | 'fallido' | 'parcial';
  codigoError?: string;
  mensajeError?: string;
  cambiosAntes?: Record<string, any>;
  cambiosDespues?: Record<string, any>;
  etiquetas: string[];
  creatodEn: Date;
  actualizadoEn: Date;
}

export interface SesionUsuario {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  ipAddress: string;
  userAgent: string;
  ubicacion?: {
    ciudad: string;
    pais: string;
    coordenadas: { lat: number; lng: number };
  };
  dispositivo: {
    tipo: 'mobile' | 'tablet' | 'desktop';
    navegador: string;
    sistemaOperativo: string;
  };
  estado: EstadoSesion;
  ultimaActividad: Date;
  duracionMinutos: number;
  token: string;
  creatodEn: Date;
  cerradoEn?: Date;
}

export interface CambioRegistro {
  campo: string;
  valorAnterior: any;
  valorNuevo: any;
  tipo: 'texto' | 'numero' | 'booleano' | 'fecha' | 'objeto' | 'array';
  descripcion: string;
}

export interface AlertaAuditoria {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  tipo: TipoPatron;
  severidad: NivelSeveridad;
  estado: EstadoAlerta;
  titulo: string;
  descripcion: string;
  detalles: {
    registrosInvolucrados: string[];
    registrosPorHora?: number;
    recursoAfectado?: string;
    ubicacionesDisintintas?: string[];
    tiempoPromedioDespacio?: number;
  };
  acciones: {
    descripcion: string;
    ejecutada: boolean;
    creatodEn: Date;
  }[];
  comentarios: {
    usuario: string;
    contenido: string;
    creatodEn: Date;
  }[];
  investigadoPor?: string;
  notas?: string;
  creatodEn: Date;
  resueltoEn?: Date;
  actualizadoEn: Date;
}

export interface EstadisticasAuditoria {
  totalRegistros: number;
  registrosPorTipoAccion: Record<TipoAccion, number>;
  registrosPorTipoRecurso: Record<TipoRecurso, number>;
  registrosPorUsuario: { usuarioId: string; usuarioNombre: string; count: number }[];
  usuariosActivos: number;
  sesionesActivas: number;
  alertasActivas: number;
  alertasPorSeveridad: Record<NivelSeveridad, number>;
  accesosExitosos: number;
  accesosFallidos: number;
  tasaExito: number;
  actividadPorHora: { hora: number; registros: number }[];
  recursosModificados: { tipoRecurso: TipoRecurso; count: number }[];
  cambiosMasRecientes: CambioRegistro[];
  tendencia30Dias: { fecha: string; registros: number }[];
}

export interface FiltrosAuditoria {
  q?: string;
  usuarioId?: string;
  tipoAccion?: TipoAccion;
  tipoRecurso?: TipoRecurso;
  estado?: 'exitoso' | 'fallido' | 'parcial';
  severidad?: NivelSeveridad;
  fechaInicio?: Date;
  fechaFin?: Date;
  ipAddress?: string;
  ordenarPor?: 'fecha' | 'usuario' | 'accion' | 'recurso';
  pagina?: number;
  limite?: number;
}

export interface BusquedaAuditoria {
  id: string;
  usuarioNombre: string;
  tipoAccion: TipoAccion;
  tipoRecurso: TipoRecurso;
  recursoNombre: string;
  descripcion: string;
  creatodEn: Date;
  relevancia: number;
}

export interface ReporteAuditoria {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'cumplimiento' | 'seguridad' | 'actividad_usuario' | 'cambios_datos' | 'accesos';
  fechaInicio: Date;
  fechaFin: Date;
  filtros: FiltrosAuditoria;
  registrosIncluidos: number;
  alertasIncluidas: number;
  generadoPor: string;
  formato: 'pdf' | 'excel' | 'json';
  urlDescarga: string;
  creatodEn: Date;
  expiradoEn: Date;
}

export interface MetricasSeguridad {
  intentosFallidosPorUsuario: { usuarioId: string; count: number }[];
  intentosFallidosPorIP: { ip: string; count: number }[];
  usuariosConMasAcceso: { usuarioId: string; usuarioNombre: string; accesos: number }[];
  recursosConMasModificaciones: { tipo: TipoRecurso; id: string; cambios: number }[];
  horasConMasActividad: { hora: number; registros: number }[];
  ubicacionesInusuales: { ciudad: string; pais: string; registros: number }[];
}

export interface ExportacionAuditoria {
  id: string;
  usuarioId: string;
  tipo: 'registros' | 'alertas' | 'sesiones' | 'reporte';
  formato: 'csv' | 'json' | 'pdf' | 'excel';
  filtros: FiltrosAuditoria;
  estado: 'procesando' | 'completada' | 'fallida';
  porcentajeProgreso: number;
  tamanoArchivo?: number;
  urlDescarga?: string;
  creatodEn: Date;
  completadoEn?: Date;
  razonFalla?: string;
}

export interface ConfiguracionAuditoria {
  id: string;
  retencioDatos: {
    registros: number; // en días
    alertas: number;
    sesiones: number;
  };
  nivelesAlerta: {
    intentosFallidosMaximo: number;
    cambiosRapidosMaximo: number;
    accesoHorasInusualesTolerancia: string[]; // horas
  };
  patternsDeteccion: {
    habilitados: boolean;
    sensibilidad: 'baja' | 'media' | 'alta';
  };
  notificaciones: {
    alertasCriticas: boolean;
    resumenDiario: boolean;
    cambiosConfiguracion: boolean;
  };
  creatodEn: Date;
  actualizadoEn: Date;
}

// Tipo de compatibilidad para componentes
export type AuditoriaEvento = RegistroAuditoria;

export interface AuditoriaFiltrosState {
  tabla: string;
  accion: string;
  usuario: string;
  desde: string;
  hasta: string;
}
