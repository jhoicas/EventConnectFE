import axios from '@/lib/axios';
import type {
  Articulo,
  EdicionArticulo,
  FAQ,
  CrearFAQ,
  Version,
  Comentario,
  Categoria,
  Etiqueta,
  EstadisticasDocumentacion,
  FiltrosDocumentacion,
  BusquedaArticulo,
  DatosExportacion,
  ArchivoExportado,
} from '../types';

const API_URL = '/api/documentacion';

export const documentacionService = {
  // ===== ARTÍCULOS =====
  crearArticulo: (datos: EdicionArticulo) =>
    axios.post<Articulo>(`${API_URL}/articulos`, datos),

  obtenerArticulo: (id: string) =>
    axios.get<Articulo>(`${API_URL}/articulos/${id}`),

  listarArticulos: (filtros?: FiltrosDocumentacion) =>
    axios.get<{ articulos: Articulo[]; total: number }>(`${API_URL}/articulos`, { params: filtros }),

  actualizarArticulo: (id: string, datos: EdicionArticulo) =>
    axios.put<Articulo>(`${API_URL}/articulos/${id}`, datos),

  eliminarArticulo: (id: string) =>
    axios.delete(`${API_URL}/articulos/${id}`),

  publicarArticulo: (id: string) =>
    axios.patch<Articulo>(`${API_URL}/articulos/${id}/publicar`, {}),

  archivarArticulo: (id: string) =>
    axios.patch<Articulo>(`${API_URL}/articulos/${id}/archivar`, {}),

  // ===== BÚSQUEDA Y FILTRADO =====
  buscarArticulos: (q: string) =>
    axios.get<BusquedaArticulo[]>(`${API_URL}/articulos/buscar`, { params: { q } }),

  obtenerArticulosRelacionados: (articuloId: string) =>
    axios.get<Articulo[]>(`${API_URL}/articulos/${articuloId}/relacionados`),

  // ===== VERSIONES =====
  obtenerVersiones: (articuloId: string) =>
    axios.get<Version[]>(`${API_URL}/articulos/${articuloId}/versiones`),

  obtenerVersion: (articuloId: string, numeroVersion: number) =>
    axios.get<Version>(`${API_URL}/articulos/${articuloId}/versiones/${numeroVersion}`),

  restaurarVersion: (articuloId: string, numeroVersion: number) =>
    axios.post<Articulo>(`${API_URL}/articulos/${articuloId}/versiones/${numeroVersion}/restaurar`, {}),

  // ===== CATEGORÍAS =====
  listarCategorias: () =>
    axios.get<Categoria[]>(`${API_URL}/categorias`),

  crearCategoria: (datos: { nombre: string; descripcion: string; icono: string; color: string }) =>
    axios.post<Categoria>(`${API_URL}/categorias`, datos),

  actualizarCategoria: (id: string, datos: Partial<Categoria>) =>
    axios.put<Categoria>(`${API_URL}/categorias/${id}`, datos),

  // ===== ETIQUETAS =====
  listarEtiquetas: () =>
    axios.get<Etiqueta[]>(`${API_URL}/etiquetas`),

  crearEtiqueta: (nombre: string) =>
    axios.post<Etiqueta>(`${API_URL}/etiquetas`, { nombre }),

  // ===== FAQs =====
  crearFAQ: (datos: CrearFAQ) =>
    axios.post<FAQ>(`${API_URL}/faqs`, datos),

  obtenerFAQ: (id: string) =>
    axios.get<FAQ>(`${API_URL}/faqs/${id}`),

  listarFAQs: (filtros?: FiltrosDocumentacion) =>
    axios.get<{ faqs: FAQ[]; total: number }>(`${API_URL}/faqs`, { params: filtros }),

  actualizarFAQ: (id: string, datos: Partial<CrearFAQ>) =>
    axios.put<FAQ>(`${API_URL}/faqs/${id}`, datos),

  eliminarFAQ: (id: string) =>
    axios.delete(`${API_URL}/faqs/${id}`),

  publicarFAQ: (id: string) =>
    axios.patch<FAQ>(`${API_URL}/faqs/${id}/publicar`, {}),

  // ===== COMENTARIOS =====
  agregarComentario: (articuloId: string, contenido: string, calificacion?: number) =>
    axios.post<Comentario>(`${API_URL}/articulos/${articuloId}/comentarios`, { contenido, calificacion }),

  obtenerComentarios: (articuloId: string) =>
    axios.get<Comentario[]>(`${API_URL}/articulos/${articuloId}/comentarios`),

  aprobarComentario: (comentarioId: string) =>
    axios.patch<Comentario>(`${API_URL}/comentarios/${comentarioId}/aprobar`, {}),

  rechazarComentario: (comentarioId: string) =>
    axios.delete(`${API_URL}/comentarios/${comentarioId}`),

  // ===== UTILIDAD / FAVORITOS =====
  marcarUtilidad: (faqId: string, util: boolean) =>
    axios.post(`${API_URL}/faqs/${faqId}/utilidad`, { util }),

  agregarAFavoritos: (articuloId: string) =>
    axios.post(`${API_URL}/articulos/${articuloId}/favoritos`, {}),

  eliminarDeFavoritos: (articuloId: string) =>
    axios.delete(`${API_URL}/articulos/${articuloId}/favoritos`),

  obtenerFavoritos: () =>
    axios.get<Articulo[]>(`${API_URL}/mi-perfil/favoritos`),

  // ===== ESTADÍSTICAS =====
  obtenerEstadisticas: (fechaInicio?: Date, fechaFin?: Date) =>
    axios.get<EstadisticasDocumentacion>(`${API_URL}/estadisticas`, {
      params: { fechaInicio, fechaFin },
    }),

  obtenerEstadisticasArticulo: (articuloId: string) =>
    axios.get(`${API_URL}/articulos/${articuloId}/estadisticas`),

  incrementarVistaArticulo: (articuloId: string) =>
    axios.post(`${API_URL}/articulos/${articuloId}/vistas`, {}),

  // ===== EXPORTACIÓN =====
  exportarArticulos: (datos: DatosExportacion) =>
    axios.post<ArchivoExportado>(`${API_URL}/exportar`, datos),

  descargarExportacion: (archivoId: string) =>
    axios.get(`${API_URL}/exportaciones/${archivoId}/descargar`),

  // ===== REVISIÓN =====
  obtenerArticulosPendientes: () =>
    axios.get<Articulo[]>(`${API_URL}/articulos/pendientes-revision`),

  aprobarArticulo: (articuloId: string) =>
    axios.patch<Articulo>(`${API_URL}/articulos/${articuloId}/aprobar`, {}),

  rechazarArticulo: (articuloId: string, razon: string) =>
    axios.patch<Articulo>(`${API_URL}/articulos/${articuloId}/rechazar`, { razon }),
};
