// Tipos para el módulo de Documentación

// Uniones de tipos
export type TipoDocumento = 'guia' | 'tutorial' | 'referencia' | 'faq' | 'ejemplo';
export type EstadoDocumento = 'borrador' | 'publicado' | 'archivado' | 'pendiente_revision';
export type NivelDificultad = 'basico' | 'intermedio' | 'avanzado' | 'experto';
export type TipoFAQ = 'tecnico' | 'general' | 'facturacion' | 'soporte' | 'integracion';
export type EstadoFAQ = 'publicada' | 'borrador' | 'rechazada' | 'pendiente_revision';

// Interfaces
export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  slug: string;
  icono: string;
  color: string;
  orden: number;
  documentosCount: number;
  activa: boolean;
  creatodEn: Date;
  actualizadoEn: Date;
}

export interface Etiqueta {
  id: string;
  nombre: string;
  slug: string;
  documentosCount: number;
  creatodEn: Date;
}

export interface Articulo {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  resumen: string;
  tipo: TipoDocumento;
  estado: EstadoDocumento;
  nivelDificultad: NivelDificultad;
  categoriaId: string;
  categoriaNombre: string;
  etiquetas: Etiqueta[];
  autorId: string;
  autorNombre: string;
  autorAvatar: string;
  imagen: string;
  vistas: number;
  favoritos: number;
  calificacionPromedio: number;
  tiempoLectura: number; // en minutos
  seoTitle: string;
  seoDescription: string;
  relacionados: ArticuloRelacionado[];
  version: number;
  publicadoEn: Date | null;
  creatodEn: Date;
  actualizadoEn: Date;
  revisado: boolean;
  revisorId?: string;
  revisorNombre?: string;
}

export interface ArticuloRelacionado {
  id: string;
  titulo: string;
  slug: string;
  imagen: string;
}

export interface EdicionArticulo {
  titulo: string;
  contenido: string;
  resumen: string;
  tipo: TipoDocumento;
  nivelDificultad: NivelDificultad;
  categoriaId: string;
  etiquetasIds: string[];
  imagen: string;
  seoTitle: string;
  seoDescription: string;
  estado?: EstadoDocumento;
}

export interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  tipo: TipoFAQ;
  estado: EstadoFAQ;
  categoriaId: string;
  categoriaNombre: string;
  autorId: string;
  autorNombre: string;
  orden: number;
  vistas: number;
  ultilUtil: number;
  noUtil: number;
  calificacionPromedio: number;
  palabrasClave: string[];
  imagenes: string[];
  videos: string[];
  publicadaEn: Date | null;
  creatodEn: Date;
  actualizadoEn: Date;
}

export interface CrearFAQ {
  pregunta: string;
  respuesta: string;
  tipo: TipoFAQ;
  categoriaId: string;
  orden: number;
  palabrasClave: string[];
}

export interface Version {
  id: string;
  articuloId: string;
  numeroVersion: number;
  titulo: string;
  contenido: string;
  autorId: string;
  autorNombre: string;
  cambios: string;
  creatodEn: Date;
}

export interface Comentario {
  id: string;
  articuloId: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioAvatar: string;
  contenido: string;
  calificacion?: number;
  aprobado: boolean;
  creatodEn: Date;
  actualizadoEn: Date;
}

export interface EstadisticasDocumentacion {
  totalArticulos: number;
  articulosPublicados: number;
  articulosBorrador: number;
  articulosArchivados: number;
  totalFAQs: number;
  faqsPublicadas: number;
  totalVistasMes: number;
  vistasPromedioPorArticulo: number;
  articuloMasVisto: {
    id: string;
    titulo: string;
    vistas: number;
  };
  categoriasMasConsultadas: {
    nombre: string;
    vistas: number;
  }[];
  tiempoPromedioLectura: number;
  tasaUtilidad: number; // porcentaje de comentarios útiles
  articulosPendientesRevision: number;
  ultimasPublicaciones: Articulo[];
  tendenciaVistasPorDia: {
    fecha: string;
    vistas: number;
  }[];
}

export interface FiltrosDocumentacion {
  q?: string;
  tipo?: TipoDocumento;
  categoriaId?: string;
  estado?: EstadoDocumento;
  etiquetasIds?: string[];
  nivelDificultad?: NivelDificultad;
  ordenarPor?: 'fecha' | 'vistas' | 'relevancia' | 'calificacion';
  pagina?: number;
  limite?: number;
}

export interface BusquedaArticulo {
  id: string;
  titulo: string;
  resumen: string;
  categoriaId: string;
  categoriaNombre: string;
  vistas: number;
  relevancia: number;
}

export interface DatosExportacion {
  formato: 'pdf' | 'markdown' | 'html';
  articuloId?: string;
  articulosIds?: string[];
  incluirVersiones: boolean;
  incluirComentarios: boolean;
}

export interface ArchivoExportado {
  id: string;
  nombreArchivo: string;
  tamano: number; // en bytes
  formato: string;
  contenido: string;
  creatodEn: Date;
  expiradoEn: Date;
  urlDescarga: string;
}
