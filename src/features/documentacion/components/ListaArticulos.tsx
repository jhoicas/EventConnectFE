import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Share2, Bookmark, Clock, User } from 'lucide-react';
import { useListarArticulos, useAgregarAFavoritos, useEliminarDeFavoritos, useIncrementarVistaArticulo } from '../hooks/useDocumentacion';
import type { Articulo } from '../types';

interface ListaArticulosProps {
  tipo?: string;
  categoriaId?: string;
  onArticuloSeleccionado?: (articulo: Articulo) => void;
}

export const ListaArticulos = ({ tipo, categoriaId, onArticuloSeleccionado }: ListaArticulosProps) => {
  const { data: resultado, isLoading } = useListarArticulos({
    tipo: tipo as any,
    categoriaId,
    estado: 'publicado',
    ordenarPor: 'fecha',
    limite: 10,
  });

  const agregarFavorito = useAgregarAFavoritos();
  const eliminarFavorito = useEliminarDeFavoritos();
  const incrementarVista = useIncrementarVistaArticulo();

  const articulos = resultado?.data?.articulos || [];

  const handleVerArticulo = (articulo: Articulo) => {
    incrementarVista.mutate(articulo.id);
    onArticuloSeleccionado?.(articulo);
  };

  const handleFavorito = (articuloId: string, esActual: boolean) => {
    if (esActual) {
      eliminarFavorito.mutate(articuloId);
    } else {
      agregarFavorito.mutate(articuloId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando artículos...</div>;
  }

  if (articulos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No hay artículos disponibles
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {articulos.map((articulo) => (
        <Card key={articulo.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            {articulo.imagen && (
              <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-100">
                <img src={articulo.imagen} alt={articulo.titulo} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => handleVerArticulo(articulo)}
                  className="text-lg font-semibold text-blue-600 hover:underline mb-2 cursor-pointer"
                >
                  {articulo.titulo}
                </h3>

                <p className="text-gray-600 text-sm mb-3">{articulo.resumen}</p>

                {/* Badges de metadata */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {articulo.tipo.charAt(0).toUpperCase() + articulo.tipo.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {articulo.nivelDificultad.charAt(0).toUpperCase() + articulo.nivelDificultad.slice(1)}
                  </Badge>
                  {articulo.etiquetas.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.nombre}
                    </Badge>
                  ))}
                </div>

                {/* Info autor y stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {articulo.autorNombre}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {articulo.tiempoLectura} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {articulo.vistas} vistas
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {articulo.favoritos} favoritos
                  </div>
                </div>

                {/* Rating */}
                {articulo.calificacionPromedio > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.round(articulo.calificacionPromedio) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-600 ml-2">({articulo.calificacionPromedio.toFixed(1)})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleFavorito(articulo.id, articulo.favoritos > 0)}
                  className="h-8 w-8 p-0"
                >
                  <Heart className={`w-4 h-4 ${articulo.favoritos > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
