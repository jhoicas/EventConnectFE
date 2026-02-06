import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useObtenerFactura, useGenerarPDF, useEnviarFactura } from '../hooks/usePagos';
import { Loader2, Download, Mail, FileText } from 'lucide-react';
import { useState } from 'react';
import type { EstadoFactura } from '../types';

interface DetalleFacturaProps {
  facturaId: string;
}

const getEstadoColor = (estado: EstadoFactura) => {
  switch (estado) {
    case 'pagada':
      return 'bg-green-100 text-green-800';
    case 'parcialmente_pagada':
      return 'bg-yellow-100 text-yellow-800';
    case 'enviada':
      return 'bg-blue-100 text-blue-800';
    case 'borrador':
      return 'bg-gray-100 text-gray-800';
    case 'vencida':
      return 'bg-red-100 text-red-800';
    case 'cancelada':
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const DetalleFactura = ({ facturaId }: DetalleFacturaProps) => {
  const { data: factura, isLoading } = useObtenerFactura(facturaId);
  const { mutate: generarPDF, isPending: generandoPDF } = useGenerarPDF();
  const { mutate: enviar, isPending: enviando } = useEnviarFactura();
  const [email, setEmail] = useState('');
  const [enviada, setEnviada] = useState(false);

  const handleEnviar = () => {
    if (!email) {
      alert('Ingresa un email válido');
      return;
    }
    enviar(
      { id: facturaId, email },
      {
        onSuccess: () => {
          setEnviada(true);
          setEmail('');
          setTimeout(() => setEnviada(false), 3000);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card className="border-green-200">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-green-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              📄 Detalle de Factura
            </CardTitle>
            <CardDescription>Factura #{factura?.numero}</CardDescription>
          </div>
          <Badge className={getEstadoColor(factura?.estado || 'borrador')}>
            {factura?.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {factura && (
          <>
            {/* Resumen */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-sm text-green-600">Total</p>
                <p className="text-2xl font-bold text-green-900">${factura.montoTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Pagado</p>
                <p className="text-2xl font-bold text-green-900">${factura.montoPagado.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Restante</p>
                <p className="text-xl font-bold text-red-600">${factura.montoRestante.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600">Impuestos</p>
                <p className="text-xl font-bold text-green-800">${factura.montoImpuestos.toFixed(2)}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b grid grid-cols-4 gap-2 font-semibold text-sm">
                <div>Descripción</div>
                <div className="text-right">Cantidad</div>
                <div className="text-right">Precio</div>
                <div className="text-right">Subtotal</div>
              </div>
              {factura.lineaItems.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 border-b grid grid-cols-4 gap-2 text-sm hover:bg-gray-50"
                >
                  <div className="font-medium">{item.descripcion}</div>
                  <div className="text-right">{item.cantidad}</div>
                  <div className="text-right">${item.precioUnitario.toFixed(2)}</div>
                  <div className="text-right font-semibold">${item.subtotal.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-600">Fecha de Emisión</p>
                <p className="font-semibold text-blue-900">
                  {new Date(factura.fechaEmision).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <p className="text-xs text-orange-600">Fecha de Vencimiento</p>
                <p className="font-semibold text-orange-900">
                  {new Date(factura.fechaVencimiento).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Notas */}
            {factura.notasCliente && (
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1">Notas</p>
                <p className="text-sm text-gray-700">{factura.notasCliente}</p>
              </div>
            )}

            {/* Acciones */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => generarPDF(facturaId)}
                  disabled={generandoPDF}
                  variant="outline"
                  className="flex-1 border-green-200 hover:bg-green-50"
                >
                  {generandoPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 hover:bg-green-50"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <Button
                  onClick={handleEnviar}
                  disabled={enviando || !email}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {enviando ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {enviada && (
                <p className="text-xs text-green-700 bg-green-50 p-2 rounded">
                  ✓ Factura enviada exitosamente
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
