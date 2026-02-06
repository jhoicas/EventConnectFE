// Tipos para el módulo de Integraciones Externas

// Union types
export type TipoIntegracion = 'webhook' | 'api_rest' | 'api_graphql' | 'grpc' | 'evento' | 'archivo';
export type ProvedorServicio = 'stripe' | 'paypal' | 'twilio' | 'sendgrid' | 'auth0' | 'slack' | 'shopify' | 'salesforce' | 'hubspot' | 'google_sheets' | 'personalizado';
export type EstadoConexion = 'conectado' | 'desconectado' | 'error' | 'validando' | 'inactivo' | 'pendiente_configuracion';
export type MetodoAutenticacion = 'api_key' | 'oauth2' | 'bearer_token' | 'basic_auth' | 'jwt' | 'webhook_signature';
export type TipoWebhook = 'pedido_creado' | 'pedido_actualizado' | 'pago_completado' | 'usuario_registrado' | 'reserva_confirmada' | 'documento_generado' | 'alerta_seguridad' | 'evento_personalizado';
export type EstadoSincronizacion = 'exitosa' | 'fallida' | 'parcial' | 'pendiente' | 'en_progreso';
export type DireccionDatos = 'entrada' | 'salida' | 'bidireccional';

// Interfaces
export interface Integracion {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: TipoIntegracion;
  proveedor: ProvedorServicio;
  estado: EstadoConexion;
  direccion: DireccionDatos;
  url?: string;
  credencialId: string;
  configuracion: Record<string, any>;
  webhooks: string[]; // IDs de webhooks
  logsSincronizacion: string[]; // IDs de logs
  ultimaSincronizacion?: Date;
  proximaSincronizacion?: Date;
  frecuenciaSincronizacion?: string; // cron format
  habilitada: boolean;
  reintentos: number;
  tiempoReitentoSegundos: number;
  timeoutSegundos: number;
  limiteRatios?: {
    solicitudes: number;
    periodo: number; // segundos
  };
  metadadatos?: {
    version: string;
    documentacionUrl?: string;
    estadisticas?: {
      llamadasTotales: number;
      llamadasExitosas: number;
      llamassFallidas: number;
      tiempoPromedioMs: number;
    };
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credencial {
  id: string;
  nombre: string;
  descripcion?: string;
  integracionId: string;
  tipo: MetodoAutenticacion;
  secretoEncriptado: string;
  // Para API Key
  apiKey?: string;
  // Para OAuth2
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiration?: Date;
  // Para Bearer Token
  token?: string;
  // Para Basic Auth
  usuario?: string;
  contrasena?: string;
  // Para JWT
  jwtPayload?: Record<string, any>;
  jwtSecret?: string;
  // Para Webhook Signature
  webhookSecret?: string;
  // Metadata
  dominios?: string[]; // dominios autorizados
  ips?: string[]; // IPs autorizadas
  scopes?: string[]; // para OAuth2
  habilitada: boolean;
  ultimaValidacion?: Date;
  validaEn?: number; // días para re-validar
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfiguracionWebhook {
  id: string;
  integracionId: string;
  tipo: TipoWebhook;
  url: string;
  eventos: TipoWebhook[];
  activa: boolean;
  verificaSignatura: boolean;
  reintentos: number;
  tiempoReintentoSegundos: number;
  headers?: Record<string, string>;
  payload?: {
    incluirMetadadatos: boolean;
    filtros?: Record<string, any>;
    transformacion?: string; // JSON path mapping
  };
  logs: string[]; // IDs de LogWebhook
  ultimaActivacion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogSincronizacion {
  id: string;
  integracionId: string;
  estado: EstadoSincronizacion;
  fechaInicio: Date;
  fechaFin?: Date;
  duracionMs?: number;
  registrosProcesados: number;
  registrosExitosos: number;
  registrosFallidos: number;
  errores?: {
    codigo: string;
    mensaje: string;
    detalles?: Record<string, any>;
  }[];
  detallesCambios?: {
    creados: number;
    actualizados: number;
    eliminados: number;
  };
  proximoReintentoEn?: Date;
  usuarioId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export interface LogWebhook {
  id: string;
  webhookId: string;
  integracionId: string;
  tipo: TipoWebhook;
  payload: Record<string, any>;
  response?: Record<string, any>;
  statusCode?: number;
  tiempoRespuestaMs?: number;
  estado: 'exitoso' | 'fallido' | 'pendiente_reintento' | 'descartado';
  intentos: number;
  proximoReintentoEn?: Date;
  errorMensaje?: string;
  ipOrigen?: string;
  firmaVerificada?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestConexion {
  integracionId: string;
  exitoso: boolean;
  tiempoRespuestaMs: number;
  statusCode?: number;
  mensaje: string;
  detalles?: Record<string, any>;
  timestamp: Date;
}

export interface MapeoFiltros {
  id: string;
  integracionId: string;
  nombre: string;
  descripcion?: string;
  campoLocal: string;
  campoExterno: string;
  tipo: 'directo' | 'transformacion' | 'funcion_personalizada';
  transformacion?: string; // JSON path o expresión
  valorPorDefecto?: any;
  requerido: boolean;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventoIntegracion {
  id: string;
  integracionId: string;
  tipo: string;
  datos: Record<string, any>;
  resultado: 'exitoso' | 'fallido' | 'parcial';
  mensajeError?: string;
  timestamp: Date;
}

export interface ConfiguracionIntegracion {
  id: string;
  integracionId: string;
  clave: string;
  valor: any;
  tipo: 'string' | 'number' | 'boolean' | 'json';
  descripcion?: string;
  requerida: boolean;
  validacion?: {
    patron?: string;
    minimo?: number;
    maximo?: number;
    opciones?: any[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FiltrosIntegraciones {
  estado?: EstadoConexion;
  proveedor?: ProvedorServicio;
  tipo?: TipoIntegracion;
  habilitada?: boolean;
  busqueda?: string;
  pagina?: number;
  limite?: number;
  ordenar?: 'nombre' | 'createdAt' | 'ultimaSincronizacion';
  direccion?: 'asc' | 'desc';
}

export interface EstadisticasIntegraciones {
  totalIntegraciones: number;
  integracionesActivas: number;
  integracionesConError: number;
  integracionesPorProveedor: Record<string, number>;
  integracionesPorTipo: Record<string, number>;
  ultimaSincronizacionGlobal?: Date;
  tasaExito: number;
  llamadasTotales: number;
  tiempoPromedioMs: number;
  webhooksActivos: number;
  webhooksFallidos: number;
}
