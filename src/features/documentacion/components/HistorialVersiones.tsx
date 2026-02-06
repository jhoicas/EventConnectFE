import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch, RotateCcw, Eye, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useObtenerVersiones, useRestaurarVersion } from '../hooks/useDocumentacion';

interface HistorialVersionesProps {
  articuloId: string;
  articuloTitulo: string;
}

export const HistorialVersiones = ({ articuloId, articuloTitulo }: HistorialVersionesProps) => {
  const [expandida, setExpandida] = useState<string | null>(null);
  const { data: versiones, isLoading } = useObtenerVersiones(articuloId);
  const restaurarVersion = useRestaurarVersion();

  const versionesData = versiones?.data || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando versiones...</div>;
  }

  if (versionesData.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No hay versiones disponibles para este artículo
        </CardContent>
      </Card>
    );
  }

  const handleRestaurar = (numeroVersion: number) => {
    if (confirm(`¿Restaurar a la versión ${numeroVersion}?`)) {
      restaurarVersion.mutate({ articuloId, numeroVersion });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Historial de Versiones
          </CardTitle>
          <CardDescription>
            {versionesData.length} versiones disponibles de "{articuloTitulo}"
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {versionesData.map((version, index) => (
          <Card key={version.id} className="overflow-hidden">
            <div
              onClick={() => setExpandida(expandida === version.id ? null : version.id)}
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <Badge variant={index === 0 ? 'default' : 'outline'}>
                    v{version.numeroVersion}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {version.titulo}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {version.autorNombre}
                    </div>
                    <span>{new Date(version.creatodEn).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${
                  expandida === version.id ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Detalles expandidos */}
            {expandida === version.id && (
              <div className="border-t bg-gray-50 p-4 space-y-4">
                {/* Cambios */}
                {version.cambios && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Cambios realizados:</h5>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 max-h-40 overflow-auto">
                      {version.cambios}
                    </p>
                  </div>
                )}

                {/* Preview del contenido */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">Preview del contenido:</h5>
                  <div className="bg-white p-3 rounded border border-gray-200 max-h-60 overflow-auto text-sm text-gray-700">
                    {version.contenido.substring(0, 500)}...
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Ver completo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleRestaurar(version.numeroVersion)}
                    disabled={restaurarVersion.isPending || index === 0}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restaurar esta versión
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-sm text-blue-900">
          <p>
            💡 El historial de versiones permite recuperar cambios previos. La versión más reciente es la v{versionesData[0]?.numeroVersion}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
