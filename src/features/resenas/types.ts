export type TipoResenia = 'servicio' | 'producto' | 'experiencia' | 'empresa';
export type CalificacionEstrella = 1 | 2 | 3 | 4 | 5;
export type EstadoResenia = 'pendiente' | 'aprobada' | 'rechazada' | 'editando';
export type EstadoRespuesta = 'pendiente' | 'respondida' | 'resuelta';

export interface Resenia {
  id: string;
  tipo: TipoResenia;
  refId: string; // ID del servicio/producto/experiencia
  clienteId: string;
  clienteNombre: string;
  clienteAvatar?: string;
  calificacion: CalificacionEstrella;
  titulo: string;
  contenido: string;
  imagenesUrls?: string[];
  estado: EstadoResenia;
  razonRechazo?: string;
  beneficioso: number; // cantidad de "me ayudó"
  perjudicial: number; // cantidad de "no me ayudó"
  respuestaProveedor?: RespuestaResenia;
  estadoRespuesta: EstadoRespuesta;
  etiquetas?: string[];
  aspectosPositivos?: string[]; // ["Buen servicio", "Entrega rápida"]
  aspectosNegativos?: string[]; // ["Precio alto", "Atención"]
  compraVerificada: boolean;
  fechaCompra?: Date;
  createdAt: Date;
  updatedAt: Date;
  moderadaPor?: string;
  fechaModeración?: Date;
}

export interface RespuestaResenia {
  id: string;
  resienaId: string;
  proveedorId: string;
  proveedorNombre: string;
  contenido: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalificacionAgregada {
  tipoResenia: TipoResenia;
  refId: string;
  calificacionPromedio: number;
  distribucionEstrella: Record<CalificacionEstrella, number>;
  totalResenas: number;
  reseniasAprobadas: number;
  porcentajeRecomendacion: number; // % de 4-5 estrellas
  aspectosPositivosTop: Array<{ aspecto: string; frecuencia: number }>;
  aspectosNegativosTop: Array<{ aspecto: string; frecuencia: number }>;
  tiempoRespuestaProveedor?: number; // horas promedio
  tasaRespuesta?: number; // % de respuestas
  updatedAt: Date;
}

export interface FiltrosResenia {
  tipo?: TipoResenia;
  refId?: string;
  clienteId?: string;
  estado?: EstadoResenia[];
  calificacionMin?: CalificacionEstrella;
  calificacionMax?: CalificacionEstrella;
  compraVerificada?: boolean;
  conRespuesta?: boolean;
  rangoFechas?: { inicio: Date; fin: Date };
  ordenarPor?: 'reciente' | 'calificacion' | 'beneficioso' | 'antiguo';
  pagina?: number;
  limite?: number;
}

export interface EstadisticasResenas {
  totalResenas: number;
  resienasPendientes: number;
  reseniasAprobadas: number;
  reseniasRechazadas: number;
  calificacionPromedio: number;
  distribucionPorCalificacion: Record<CalificacionEstrella, number>;
  distribucionPorTipo: Record<TipoResenia, number>;
  reseniasConRespuesta: number;
  tasaRespuestaProveedor: number;
  tiempoPromedioRespuesta: number; // horas
  serviciosMasComentados: Array<{
    refId: string;
    nombre: string;
    totalResenas: number;
    calificacion: number;
  }>;
  reseniasRecientes: Resenia[];
  tendencia30Dias: Array<{
    fecha: Date;
    cantidad: number;
    calificacionPromedio: number;
  }>;
}

export interface ModeracionResenia {
  resienaId: string;
  estado: 'aprobada' | 'rechazada';
  razonRechazo?: string;
  comentarioModerador?: string;
  moderadoPor: string;
}

export interface RespuestaProcesoBatch {
  totalProcesados: number;
  exitosos: number;
  fallidos: number;
  detalles: Array<{
    id: string;
    exito: boolean;
    error?: string;
  }>;
}

export interface MeGustaResenia {
  resienaId: string;
  usuarioId: string;
  tipo: 'beneficioso' | 'perjudicial';
  createdAt: Date;
}

export interface ReportResenia {
  id: string;
  resienaId: string;
  reportadoPor: string;
  razon: 'spam' | 'ofensivo' | 'irrelevante' | 'falso' | 'otro';
  descripcion?: string;
  estado: 'pendiente' | 'revisado' | 'resuelto';
  accion?: 'aprobada' | 'rechazada' | 'oculta';
  createdAt: Date;
  revisadoPor?: string;
  fechaRevision?: Date;
}
