import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentacionService } from '../services/documentacionService';
import type {
  EdicionArticulo,
  Categoria,
  CrearFAQ,
  FiltrosDocumentacion,
} from '../types';

// ===== QUERIES ARTÍCULOS =====
export const useListarArticulos = (filtros?: FiltrosDocumentacion) => {
  return useQuery({
    queryKey: ['articulos', filtros],
    queryFn: () => documentacionService.listarArticulos(filtros),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

export const useObtenerArticulo = (id: string) => {
  return useQuery({
    queryKey: ['articulo', id],
    queryFn: () => documentacionService.obtenerArticulo(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id,
  });
};

export const useBuscarArticulos = (q: string) => {
  return useQuery({
    queryKey: ['articulos-buscar', q],
    queryFn: () => documentacionService.buscarArticulos(q),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!q && q.length > 2,
  });
};

export const useObtenerArticulosRelacionados = (articuloId: string) => {
  return useQuery({
    queryKey: ['articulos-relacionados', articuloId],
    queryFn: () => documentacionService.obtenerArticulosRelacionados(articuloId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!articuloId,
  });
};

export const useObtenerFavoritos = () => {
  return useQuery({
    queryKey: ['favoritos'],
    queryFn: () => documentacionService.obtenerFavoritos(),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

// ===== QUERIES VERSIONES =====
export const useObtenerVersiones = (articuloId: string) => {
  return useQuery({
    queryKey: ['versiones', articuloId],
    queryFn: () => documentacionService.obtenerVersiones(articuloId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!articuloId,
  });
};

// ===== QUERIES CATEGORÍAS =====
export const useListarCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => documentacionService.listarCategorias(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ===== QUERIES ETIQUETAS =====
export const useListarEtiquetas = () => {
  return useQuery({
    queryKey: ['etiquetas'],
    queryFn: () => documentacionService.listarEtiquetas(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// ===== QUERIES FAQs =====
export const useListarFAQs = (filtros?: FiltrosDocumentacion) => {
  return useQuery({
    queryKey: ['faqs', filtros],
    queryFn: () => documentacionService.listarFAQs(filtros),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

export const useObtenerFAQ = (id: string) => {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: () => documentacionService.obtenerFAQ(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!id,
  });
};

// ===== QUERIES COMENTARIOS =====
export const useObtenerComentarios = (articuloId: string) => {
  return useQuery({
    queryKey: ['comentarios', articuloId],
    queryFn: () => documentacionService.obtenerComentarios(articuloId),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!articuloId,
  });
};

// ===== QUERIES ESTADÍSTICAS =====
export const useObtenerEstadisticas = (fechaInicio?: Date, fechaFin?: Date) => {
  return useQuery({
    queryKey: ['estadisticas-doc', fechaInicio, fechaFin],
    queryFn: () => documentacionService.obtenerEstadisticas(fechaInicio, fechaFin),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useObtenerEstadisticasArticulo = (articuloId: string) => {
  return useQuery({
    queryKey: ['estadisticas-articulo', articuloId],
    queryFn: () => documentacionService.obtenerEstadisticasArticulo(articuloId),
    staleTime: 3 * 60 * 1000, // 3 minutos
    enabled: !!articuloId,
  });
};

// ===== QUERIES REVISIÓN =====
export const useObtenerArticulosPendientes = () => {
  return useQuery({
    queryKey: ['articulos-pendientes'],
    queryFn: () => documentacionService.obtenerArticulosPendientes(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// ===== MUTATIONS ARTÍCULOS =====
export const useCrearArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: EdicionArticulo) => documentacionService.crearArticulo(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
    },
  });
};

export const useActualizarArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: EdicionArticulo }) =>
      documentacionService.actualizarArticulo(id, datos),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
      queryClient.invalidateQueries({ queryKey: ['articulo', data.data.id] });
      queryClient.invalidateQueries({ queryKey: ['versiones', data.data.id] });
    },
  });
};

export const useEliminarArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentacionService.eliminarArticulo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
    },
  });
};

export const usePublicarArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentacionService.publicarArticulo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
      queryClient.invalidateQueries({ queryKey: ['articulo', data.data.id] });
    },
  });
};

export const useArchivarArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentacionService.archivarArticulo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
      queryClient.invalidateQueries({ queryKey: ['articulo', data.data.id] });
    },
  });
};

// ===== MUTATIONS VERSIONES =====
export const useRestaurarVersion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articuloId, numeroVersion }: { articuloId: string; numeroVersion: number }) =>
      documentacionService.restaurarVersion(articuloId, numeroVersion),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articulo', data.data.id] });
      queryClient.invalidateQueries({ queryKey: ['versiones', data.data.id] });
    },
  });
};

// ===== MUTATIONS CATEGORÍAS =====
export const useCrearCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: { nombre: string; descripcion: string; icono: string; color: string }) =>
      documentacionService.crearCategoria(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

export const useActualizarCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: Partial<Categoria> }) =>
      documentacionService.actualizarCategoria(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

// ===== MUTATIONS ETIQUETAS =====
export const useCrearEtiqueta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nombre: string) => documentacionService.crearEtiqueta(nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etiquetas'] });
    },
  });
};

// ===== MUTATIONS FAQs =====
export const useCrearFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: CrearFAQ) => documentacionService.crearFAQ(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

export const useActualizarFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: Partial<CrearFAQ> }) =>
      documentacionService.actualizarFAQ(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

export const useEliminarFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentacionService.eliminarFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

export const usePublicarFAQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentacionService.publicarFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

// ===== MUTATIONS COMENTARIOS =====
export const useAgregarComentario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articuloId, contenido, calificacion }: { articuloId: string; contenido: string; calificacion?: number }) =>
      documentacionService.agregarComentario(articuloId, contenido, calificacion),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comentarios', variables.articuloId] });
    },
  });
};

export const useAprobarComentario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comentarioId: string) => documentacionService.aprobarComentario(comentarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comentarios'] });
    },
  });
};

export const useRechazarComentario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comentarioId: string) => documentacionService.rechazarComentario(comentarioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comentarios'] });
    },
  });
};

// ===== MUTATIONS UTILIDAD / FAVORITOS =====
export const useMarcarUtilidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ faqId, util }: { faqId: string; util: boolean }) =>
      documentacionService.marcarUtilidad(faqId, util),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faq', variables.faqId] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
};

export const useAgregarAFavoritos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articuloId: string) => documentacionService.agregarAFavoritos(articuloId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoritos'] });
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
    },
  });
};

export const useEliminarDeFavoritos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articuloId: string) => documentacionService.eliminarDeFavoritos(articuloId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoritos'] });
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
    },
  });
};

// ===== MUTATIONS VISTAS =====
export const useIncrementarVistaArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articuloId: string) => documentacionService.incrementarVistaArticulo(articuloId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estadisticas-doc'] });
    },
  });
};

// ===== MUTATIONS EXPORTACIÓN =====
export const useExportarArticulos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: { formato: 'pdf' | 'markdown' | 'html'; articuloId?: string; articulosIds?: string[]; incluirVersiones: boolean; incluirComentarios: boolean }) =>
      documentacionService.exportarArticulos(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] });
    },
  });
};

// ===== MUTATIONS REVISIÓN =====
export const useAprobarArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articuloId: string) => documentacionService.aprobarArticulo(articuloId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articulos-pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['articulo', data.data.id] });
    },
  });
};

export const useRechazarArticulo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articuloId, razon }: { articuloId: string; razon: string }) =>
      documentacionService.rechazarArticulo(articuloId, razon),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articulos-pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['articulo', data.data.id] });
    },
  });
};
