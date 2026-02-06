// Types for Real-Time Data Streaming Module

// Union Types
export type EventType = 'kpi_update' | 'order_status' | 'inventory_change' | 'anomaly_detected' | 'alert_triggered' | 'forecast_updated' | 'connection_status' | 'data_sync';
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
export type StreamPriority = 'critical' | 'high' | 'normal' | 'low';
export type DataStreamType = 'metrics' | 'events' | 'alerts' | 'transactions' | 'inventory' | 'custom';
export type AggregationLevel = 'raw' | '1min' | '5min' | '15min' | '1hour' | '1day';

// WebSocket Events
export interface StreamEvent<T = any> {
  id: string;
  tipo: EventType;
  timestamp: string;
  data: T;
  prioridad: StreamPriority;
  origen: string;
  userId?: string;
}

// Connection Management
export interface WebSocketConnection {
  id: string;
  url: string;
  estado: ConnectionStatus;
  ultimaConexion: string;
  ultimoError?: string;
  intentosReconexion: number;
  maxReintentos: number;
  intervaloReconexion: number; // milliseconds
  eventos: string[]; // event types subscribed to
  activo: boolean;
}

// Streaming Data
export interface StreamData<T = any> {
  id: string;
  tipo: DataStreamType;
  fuente: string;
  datos: T[];
  timestamp: string;
  cantidad: number;
  agregacion: AggregationLevel;
  periodo: {
    inicio: string;
    fin: string;
  };
}

// KPI Update Stream
export interface KPIStreamUpdate {
  id: string;
  nombre: string;
  metrica: string;
  valorAnterior: number;
  valorActual: number;
  cambio: number;
  porcentajeCambio: number;
  timestamp: string;
  tendencia: 'aumento' | 'disminucion' | 'estable';
  target?: number;
  progreso?: number;
}

// Order Status Stream
export interface OrderStatusStream {
  id: string;
  orderId: string;
  estado: 'pendiente' | 'confirmada' | 'procesando' | 'enviada' | 'entregada' | 'cancelada';
  estadoAnterior: string;
  timestamp: string;
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
  estimadoEntrega?: string;
  detalles: string;
}

// Inventory Change Stream
export interface InventoryChangeStream {
  id: string;
  productoId: string;
  nombre: string;
  cantidadAnterior: number;
  cantidadActual: number;
  cambio: number;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  razon: string;
  bodega: string;
  timestamp: string;
  usuario: string;
}

// Alert Event Stream
export interface AlertEventStream {
  id: string;
  alertaId: string;
  tipo: string;
  severidad: 'critica' | 'alta' | 'media' | 'baja';
  mensaje: string;
  timestamp: string;
  accion?: string;
  resuelta: boolean;
  urlDetalles?: string;
}

// Forecast Update Stream
export interface ForecastUpdateStream {
  id: string;
  forecastId: string;
  modelo: string;
  proximoValorPredicho: number;
  intervaloConfianza: {
    inferior: number;
    superior: number;
  };
  precision: number;
  timestamp: string;
  proximaActualizacion: string;
}

// Transaction Stream
export interface TransactionStream {
  id: string;
  transactionId: string;
  tipo: 'pago' | 'reembolso' | 'ajuste' | 'comisión';
  monto: number;
  moneda: string;
  estado: 'procesando' | 'completado' | 'fallido';
  timestamp: string;
  usuario: string;
  detalles: string;
}

// Live Dashboard Subscription
export interface DashboardSubscription {
  id: string;
  usuarioId: string;
  nombre: string;
  tiposEvento: EventType[];
  metricas: string[]; // KPI IDs
  filtros: {
    origenFiltro?: string;
    severidadMinima?: StreamPriority;
    periodo?: AggregationLevel;
  };
  activa: boolean;
  ultimaActualizacion: string;
  actualizacionesRecibidas: number;
}

// Event Filter
export interface EventFilter {
  tipos?: EventType[];
  prioridad?: StreamPriority[];
  origen?: string;
  usuarioId?: string;
  desde?: string;
  hasta?: string;
  limit?: number;
}

// Stream Statistics
export interface StreamStatistics {
  eventosTotales: number;
  eventosUltimaHora: number;
  eventosUltimoMinuto: number;
  tasaPromedio: number; // events per second
  tasaPico: number;
  tiempoPromedio: number; // milliseconds to process
  eventosPorTipo: Record<EventType, number>;
  eventosPorSeveridad: Record<StreamPriority, number>;
  tasaError: number; // percentage
}

// Real-Time Metric
export interface RealTimeMetric {
  id: string;
  nombre: string;
  valor: number;
  timestamp: string;
  ultimaActualizacion: string;
  actualizacionesPorMinuto: number;
  volatilidad: number; // standard deviation
  tendenciaCorta: number; // 1min trend
  tendenciaMedia: number; // 5min trend
  tendenciaLarga: number; // 1hour trend
}

// Stream Cache
export interface StreamCache {
  id: string;
  tipo: DataStreamType;
  tamanio: number; // bytes
  elementos: number;
  periodoRetencion: number; // milliseconds
  proximaLimpieza: string;
  compresiónHabilitada: boolean;
  ratioCompresion: number;
}

// Buffer Event
export interface BufferedEvent {
  id: string;
  evento: StreamEvent;
  timestamp: string;
  procesado: boolean;
  intentos: number;
}

// Connection Log
export interface ConnectionLog {
  id: string;
  timestamp: string;
  evento: 'conectado' | 'desconectado' | 'error' | 'reconexion' | 'cierre';
  mensaje: string;
  duracionConexion?: number; // milliseconds
  motivoCierre?: string;
}

// Response Wrapper
export interface ResponseDataStreaming<T> {
  data: T;
  success: boolean;
  message: string;
  timestamp: string;
  metadata?: {
    eventCount: number;
    connectionStatus: ConnectionStatus;
    latencyMs: number;
  };
}
