export type TipoNotificacion = 'email' | 'sms' | 'push' | 'inApp';
export type EstadoNotificacion = 'pendiente' | 'enviando' | 'enviada' | 'fallida' | 'programada';
export type PrioridadNotificacion = 'baja' | 'normal' | 'alta' | 'urgente';
export type CanalNotificacion = 'transaccional' | 'marketing' | 'sistema' | 'recordatorio';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  destinatario: string; // email o teléfono
  asunto?: string; // solo para email
  mensaje: string;
  plantillaId?: string;
  estado: EstadoNotificacion;
  prioridad: PrioridadNotificacion;
  canal: CanalNotificacion;
  intentos: number;
  maxIntentos: number;
  programadaPara?: Date;
  enviadaEn?: Date;
  leidaEn?: Date;
  errorMensaje?: string;
  metadatos?: Record<string, unknown>;
  usuarioId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlantillaNotificacion {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoNotificacion;
  canal: CanalNotificacion;
  asuntoPlantilla?: string; // con variables {{variable}}
  mensajePlantilla: string; // con variables {{variable}}
  variables: string[]; // lista de variables requeridas
  activo: boolean;
  idioma: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfiguracionNotificaciones {
  id: string;
  empresaId: string;
  emailProvider: 'sendgrid' | 'mailgun' | 'ses' | 'smtp';
  emailApiKey?: string;
  emailRemitente: string;
  emailNombreRemitente: string;
  smsProvider: 'twilio' | 'vonage' | 'messagebird';
  smsApiKey?: string;
  smsTelefono?: string;
  pushProvider?: 'firebase' | 'onesignal';
  pushApiKey?: string;
  maxIntentosEnvio: number;
  intervaloReintento: number; // minutos
  habilitarEmail: boolean;
  habilitarSms: boolean;
  habilitarPush: boolean;
  updatedAt: Date;
}

export interface LogNotificacion {
  id: string;
  notificacionId: string;
  tipo: TipoNotificacion;
  destinatario: string;
  estado: EstadoNotificacion;
  intento: number;
  respuestaProveedor?: string;
  codigoError?: string;
  mensajeError?: string;
  tiempoRespuesta?: number; // ms
  createdAt: Date;
}

export interface EstadisticasNotificaciones {
  totalEnviadas: number;
  totalFallidas: number;
  totalPendientes: number;
  tasaExito: number;
  distribucionPorTipo: Record<TipoNotificacion, number>;
  distribucionPorCanal: Record<CanalNotificacion, number>;
  distribucionPorEstado: Record<EstadoNotificacion, number>;
  emailsEnviados: number;
  smsEnviados: number;
  pushEnviados: number;
  tasaApertura: number;
  tasaClicks: number;
  tiempoPromedioEnvio: number; // ms
  ultimasNotificaciones: Notificacion[];
  tendencia30Dias: Array<{
    fecha: Date;
    enviadas: number;
    fallidas: number;
    tasaExito: number;
  }>;
}

export interface FiltrosNotificaciones {
  tipo?: TipoNotificacion[];
  estado?: EstadoNotificacion[];
  canal?: CanalNotificacion[];
  prioridad?: PrioridadNotificacion[];
  destinatario?: string;
  rangoFechas?: { inicio: Date; fin: Date };
  plantillaId?: string;
  usuarioId?: string;
  pagina?: number;
  limite?: number;
}

export interface NotificacionMasiva {
  plantillaId: string;
  destinatarios: Array<{
    email?: string;
    telefono?: string;
    variables?: Record<string, string>;
  }>;
  canal: CanalNotificacion;
  prioridad: PrioridadNotificacion;
  programadaPara?: Date;
}

export interface RespuestaEnvio {
  exito: boolean;
  notificacionId?: string;
  mensaje?: string;
  error?: string;
}

export interface RespuestaMasiva {
  totalProcesados: number;
  exitosos: number;
  fallidos: number;
  notificaciones: Array<{
    destinatario: string;
    exito: boolean;
    notificacionId?: string;
    error?: string;
  }>;
}
