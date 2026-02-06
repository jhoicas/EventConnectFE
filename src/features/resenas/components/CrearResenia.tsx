import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCrearResenia } from '../hooks/useResenas';
import { Star, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { CalificacionEstrella, TipoResenia } from '../types';

interface CrearRseniaProp {
  tipo: TipoResenia;
  refId: string;
  clienteId: string;
  clienteNombre: string;
  onSuccess?: () => void;
}

export const CrearResenia = ({
  tipo,
  refId,
  clienteId,
  clienteNombre,
  onSuccess,
}: CrearRseniaProp) => {
  const [calificacion, setCalificacion] = useState<CalificacionEstrella>(5);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [aspectosPositivos, setAspectosPositivos] = useState<string[]>([]);
  const [aspectosNegativos, setAspectosNegativos] = useState<string[]>([]);
  const [compraVerificada] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const { mutate: crear, isPending } = useCrearResenia();

  const aspectosPredefinidos = {
    positivos: ['Buen servicio', 'Entrega rápida', 'Calidad excelente', 'Buen precio', 'Profesionalismo'],
    negativos: ['Precio alto', 'Entrega lenta', 'Mala atención', 'Producto defectuoso', 'Falta de información'],
  };

  const handleCrear = () => {
    setError('');
    setExito(false);

    if (!titulo || !contenido) {
      setError('Título y contenido son requeridos');
      return;
    }

    crear(
      {
        tipo,
        refId,
        clienteId,
        clienteNombre,
        calificacion,
        titulo,
        contenido,
        estado: 'pendiente',
        beneficioso: 0,
        perjudicial: 0,
        estadoRespuesta: 'pendiente',
        aspectosPositivos,
        aspectosNegativos,
        compraVerificada,
      },
      {
        onSuccess: () => {
          setExito(true);
          setTitulo('');
          setContenido('');
          setCalificacion(5);
          setAspectosPositivos([]);
          setAspectosNegativos([]);
          setTimeout(() => {
            setExito(false);
            onSuccess?.();
          }, 2000);
        },
        onError: () => {
          setError('Error al crear la reseña. Intenta nuevamente.');
        },
      }
    );
  };

  const toggleAspecto = (aspecto: string, tipo: 'positivo' | 'negativo') => {
    if (tipo === 'positivo') {
      setAspectosPositivos((prev) =>
        prev.includes(aspecto) ? prev.filter((a) => a !== aspecto) : [...prev, aspecto]
      );
    } else {
      setAspectosNegativos((prev) =>
        prev.includes(aspecto) ? prev.filter((a) => a !== aspecto) : [...prev, aspecto]
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Crear Reseña
        </CardTitle>
        <CardDescription>Comparte tu experiencia con otros clientes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calificación con estrellas */}
        <div className="space-y-2">
          <Label>Calificación</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setCalificacion(star as CalificacionEstrella)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= calificacion
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-medium text-gray-600">
              {calificacion}/5 estrellas
            </span>
          </div>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <Label>Título de la reseña</Label>
          <Input
            placeholder="Ej: Excelente servicio, muy recomendado"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {/* Contenido */}
        <div className="space-y-2">
          <Label>Tu opinión</Label>
          <Textarea
            placeholder="Cuéntanos más sobre tu experiencia..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Aspectos positivos */}
        <div className="space-y-2">
          <Label>¿Qué te gustó? (Opcional)</Label>
          <div className="flex flex-wrap gap-2">
            {aspectosPredefinidos.positivos.map((aspecto) => (
              <button
                key={aspecto}
                onClick={() => toggleAspecto(aspecto, 'positivo')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  aspectosPositivos.includes(aspecto)
                    ? 'bg-green-100 text-green-800 border-2 border-green-400'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                }`}
              >
                {aspecto}
              </button>
            ))}
          </div>
        </div>

        {/* Aspectos negativos */}
        <div className="space-y-2">
          <Label>¿Qué mejoraría? (Opcional)</Label>
          <div className="flex flex-wrap gap-2">
            {aspectosPredefinidos.negativos.map((aspecto) => (
              <button
                key={aspecto}
                onClick={() => toggleAspecto(aspecto, 'negativo')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  aspectosNegativos.includes(aspecto)
                    ? 'bg-red-100 text-red-800 border-2 border-red-400'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                }`}
              >
                {aspecto}
              </button>
            ))}
          </div>
        </div>

        {/* Verificación de compra */}
        {compraVerificada && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Compra verificada
          </div>
        )}

        {/* Mensajes de estado */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            <XCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {exito && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm">¡Reseña enviada! Será revisada antes de publicarse.</p>
          </div>
        )}

        {/* Botón enviar */}
        <Button onClick={handleCrear} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Reseña
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
