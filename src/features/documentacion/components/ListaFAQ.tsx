import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { HelpCircle, Plus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useListarFAQs, useMarcarUtilidad } from '../hooks/useDocumentacion';
import type { TipoFAQ } from '../types';

interface ListaFAQProps {
  // tipoFAQ?: TipoFAQ;
}

export const ListaFAQ = ({  }: ListaFAQProps) => {
  const [expandidas, setExpandidas] = useState<Set<string>>(new Set());
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFAQ | ''>('');

  const { data: resultado, isLoading } = useListarFAQs({
    q: busqueda,
    ordenarPor: 'fecha',
    limite: 20,
  } as any);

  const marcarUtilidad = useMarcarUtilidad();

  const faqs = resultado?.data?.faqs || [];

  const toggleExpandida = (id: string) => {
    const nuevas = new Set(expandidas);
    if (nuevas.has(id)) {
      nuevas.delete(id);
    } else {
      nuevas.add(id);
    }
    setExpandidas(nuevas);
  };

  const handleUtilidad = (faqId: string, util: boolean) => {
    marcarUtilidad.mutate({ faqId, util });
  };

  const getTipoBadge = (tipo: TipoFAQ) => {
    const colors: Record<TipoFAQ, string> = {
      tecnico: 'bg-blue-100 text-blue-800',
      general: 'bg-gray-100 text-gray-800',
      facturacion: 'bg-green-100 text-green-800',
      soporte: 'bg-orange-100 text-orange-800',
      integracion: 'bg-purple-100 text-purple-800',
    };
    return colors[tipo];
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando FAQs...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Buscar</label>
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar preguntas frecuentes..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Tipo</label>
          <Select value={tipoFiltro} onValueChange={(v) => setTipoFiltro(v as TipoFAQ | '')}>
            <option value="">Todos los tipos</option>
            <option value="tecnico">Técnico</option>
            <option value="general">General</option>
            <option value="facturacion">Facturación</option>
            <option value="soporte">Soporte</option>
            <option value="integracion">Integración</option>
          </Select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar FAQ
        </Button>
      </div>

      {/* FAQs */}
      {faqs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            No hay FAQs disponibles
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <Card
              key={faq.id}
              className="hover:shadow-sm transition-shadow"
            >
              <CardContent className="p-4">
                {/* Header pregunta */}
                <div
                  onClick={() => toggleExpandida(faq.id)}
                  className="cursor-pointer flex items-start gap-3"
                >
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm">{faq.pregunta}</h4>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge className={`text-xs ${getTipoBadge(faq.tipo)}`}>
                        {faq.tipo}
                      </Badge>
                      {faq.palabrasClave?.map((palabra) => (
                        <Badge key={palabra} variant="outline" className="text-xs">
                          {palabra}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {expandidas.has(faq.id) ? '▼' : '▶'}
                  </div>
                </div>

                {/* Respuesta expandida */}
                {expandidas.has(faq.id) && (
                  <div className="mt-4 pl-8 border-l-2 border-blue-100 space-y-3">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.respuesta}</p>

                    {/* Imágenes/Videos */}
                    {(faq.imagenes?.length || 0) > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {faq.imagenes?.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`FAQ ${faq.id} imagen ${i}`}
                            className="max-w-xs rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Stats de utilidad */}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-600">¿Fue útil?</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUtilidad(faq.id, true)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {faq.ultilUtil}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUtilidad(faq.id, false)}
                        className="h-7 px-2 text-xs gap-1"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        {faq.noUtil}
                      </Button>
                      <div className="ml-auto text-xs text-gray-500">
                        {faq.vistas} vistas
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
