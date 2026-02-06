import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { FileText, Plus } from 'lucide-react';
import { useCrearArticulo, useActualizarArticulo, useListarCategorias, useListarEtiquetas } from '../hooks/useDocumentacion';
import type { Articulo, EdicionArticulo, TipoDocumento, NivelDificultad } from '../types';

interface EditorArticuloProps {
  articulo?: Articulo;
  onSuccess?: () => void;
}

export const EditorArticulo = ({ articulo, onSuccess }: EditorArticuloProps) => {
  const [titulo, setTitulo] = useState(articulo?.titulo || '');
  const [contenido, setContenido] = useState(articulo?.contenido || '');
  const [resumen, setResumen] = useState(articulo?.resumen || '');
  const [tipo, setTipo] = useState<TipoDocumento>(articulo?.tipo || 'guia');
  const [nivelDificultad, setNivelDificultad] = useState<NivelDificultad>(articulo?.nivelDificultad || 'basico');
  const [categoriaId, setCategoriaId] = useState(articulo?.categoriaId || '');
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<string[]>(
    articulo?.etiquetas.map(e => e.id) || []
  );
  const [seoTitle, setSeoTitle] = useState(articulo?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(articulo?.seoDescription || '');
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const { data: categorias } = useListarCategorias();
  const { data: etiquetas } = useListarEtiquetas();
  const crearArticulo = useCrearArticulo();
  const actualizarArticulo = useActualizarArticulo();

  const handleGuardar = async () => {
    if (!titulo.trim() || !contenido.trim() || !categoriaId) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    const datos: EdicionArticulo = {
      titulo,
      contenido,
      resumen,
      tipo,
      nivelDificultad,
      categoriaId,
      etiquetasIds: etiquetasSeleccionadas,
      imagen: '',
      seoTitle,
      seoDescription,
      estado: 'borrador',
    };

    try {
      if (articulo) {
        await actualizarArticulo.mutateAsync({ id: articulo.id, datos });
      } else {
        await crearArticulo.mutateAsync(datos);
      }
      setExito(true);
      setTimeout(() => {
        setExito(false);
        onSuccess?.();
      }, 2000);
    } catch {
      setError('Error al guardar el artículo');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      {exito && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-sm text-green-700">
            ✓ Artículo guardado exitosamente
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {articulo ? 'Editar Artículo' : 'Crear Artículo'}
          </CardTitle>
          <CardDescription>Completa todos los campos requeridos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del artículo"
              className="mt-2"
            />
          </div>

          {/* Resumen */}
          <div>
            <Label htmlFor="resumen">Resumen *</Label>
            <Textarea
              id="resumen"
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Descripción corta (SEO)"
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Contenido */}
          <div>
            <Label htmlFor="contenido">Contenido *</Label>
            <Textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Contenido completo del artículo (Markdown soportado)"
              rows={10}
              className="mt-2 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              {contenido.length} caracteres | {Math.ceil(contenido.split(' ').length / 200)} min de lectura
            </p>
          </div>

          {/* Metadatos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as TipoDocumento)}>
                <option value="guia">Guía</option>
                <option value="tutorial">Tutorial</option>
                <option value="referencia">Referencia</option>
                <option value="faq">FAQ</option>
                <option value="ejemplo">Ejemplo</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="dificultad">Nivel de Dificultad *</Label>
              <Select value={nivelDificultad} onValueChange={(v) => setNivelDificultad(v as NivelDificultad)}>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="experto">Experto</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="categoria">Categoría *</Label>
              <Select value={categoriaId} onValueChange={setCategoriaId}>
                <option value="">Selecciona una categoría</option>
                {categorias?.data?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {etiquetas?.data?.map((etiqueta) => (
                  <Badge
                    key={etiqueta.id}
                    variant={etiquetasSeleccionadas.includes(etiqueta.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setEtiquetasSeleccionadas((prev) =>
                        prev.includes(etiqueta.id)
                          ? prev.filter((id) => id !== etiqueta.id)
                          : [...prev, etiqueta.id]
                      );
                    }}
                  >
                    {etiqueta.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Optimización SEO</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="seo-title">Título SEO</Label>
                <Input
                  id="seo-title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Título para buscadores (60-70 caracteres)"
                  maxLength={70}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">{seoTitle.length}/70</p>
              </div>

              <div>
                <Label htmlFor="seo-desc">Descripción SEO</Label>
                <Textarea
                  id="seo-desc"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Descripción para buscadores (155-160 caracteres)"
                  maxLength={160}
                  rows={3}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">{seoDescription.length}/160</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-3">
        <Button
          onClick={handleGuardar}
          disabled={crearArticulo.isPending || actualizarArticulo.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {articulo ? 'Actualizar' : 'Crear'} Artículo
        </Button>
        <Button variant="outline">Cancelar</Button>
      </div>
    </div>
  );
};
