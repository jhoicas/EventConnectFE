import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useObtenerCalificacionAgregada } from '../hooks/useResenas';
import { Star, BarChart3, TrendingUp } from 'lucide-react';

interface ResumenCalificacionProps {
  tipo: string;
  refId: string;
  nombre?: string;
}

export const ResumenCalificacion = ({ tipo, refId, nombre }: ResumenCalificacionProps) => {
  const { data: calificacion, isLoading } = useObtenerCalificacionAgregada(tipo, refId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!calificacion) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Sin calificaciones aún
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          {nombre || 'Calificación'}
        </CardTitle>
        <CardDescription>{calificacion.totalResenas} reseña{calificacion.totalResenas !== 1 ? 's' : ''}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calificación promedio */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{calificacion.calificacionPromedio.toFixed(1)}</p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(calificacion.calificacionPromedio)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = calificacion.distribucionEstrella[star as 1 | 2 | 3 | 4 | 5] || 0;
              const porcentaje = calificacion.totalResenas > 0 ? (count / calificacion.totalResenas) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs w-8">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <span className="text-xs w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recomendación */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Recomendación</h4>
          </div>
          <p className="text-3xl font-bold text-green-600">{(calificacion.porcentajeRecomendacion * 100).toFixed(0)}%</p>
          <p className="text-sm text-green-700">de clientes lo recomendarían</p>
        </div>

        {/* Aspectos positivos Top */}
        {calificacion.aspectosPositivosTop.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="text-green-600">✓</span> Lo que más se destaca
            </h4>
            <div className="space-y-1">
              {calificacion.aspectosPositivosTop.slice(0, 3).map((item) => (
                <div key={item.aspecto} className="flex items-center gap-2 text-sm">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {item.frecuencia}
                  </Badge>
                  <span>{item.aspecto}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aspectos negativos Top */}
        {calificacion.aspectosNegativosTop.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="text-red-600">✗</span> Áreas de mejora
            </h4>
            <div className="space-y-1">
              {calificacion.aspectosNegativosTop.slice(0, 3).map((item) => (
                <div key={item.aspecto} className="flex items-center gap-2 text-sm">
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    {item.frecuencia}
                  </Badge>
                  <span>{item.aspecto}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Respuesta proveedor */}
        {calificacion.tasaRespuesta !== undefined && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-sm text-blue-900">Tasa de Respuesta</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{(calificacion.tasaRespuesta * 100).toFixed(0)}%</p>
            {calificacion.tiempoRespuestaProveedor && (
              <p className="text-xs text-blue-700 mt-1">
                Respuesta en {calificacion.tiempoRespuestaProveedor.toFixed(0)} horas promedio
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
