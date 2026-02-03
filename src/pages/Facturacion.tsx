import { useMemo } from 'react';
import { FileText, Download, Eye, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useFacturas } from '@/features/factura/hooks/useFactura';

const FacturacionPage = () => {
  const { data: facturas = [], isLoading, isError } = useFacturas();

  const facturasOrdenadas = useMemo(() => {
    return [...facturas].sort((a, b) => 
      new Date(b.fecha_Emision).getTime() - new Date(a.fecha_Emision).getTime()
    );
  }, [facturas]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; className: string }> = {
      'Pagada': { label: 'Pagada', className: 'bg-green-100 text-green-700' },
      'Pendiente': { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
      'Vencida': { label: 'Vencida', className: 'bg-red-100 text-red-700' },
      'Anulada': { label: 'Anulada', className: 'bg-gray-100 text-gray-700' },
    };
    
    const config = estados[estado] || { label: estado, className: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
        <p className="text-muted-foreground">
          Gestiona facturas y pagos
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando facturas...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 p-8">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Sin permisos</h3>
              <p className="text-muted-foreground">
                No tienes permisos para acceder a esta sección.
              </p>
            </div>
          </div>
        ) : facturasOrdenadas.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 p-6">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">No hay facturas</h3>
              <p className="text-muted-foreground">
                Las facturas generadas aparecerán aquí
              </p>
            </div>
          </div>
        ) : (
          <div className="inline-block w-full min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%] md:w-auto">Factura</TableHead>
                  <TableHead className="hidden md:table-cell">Cliente</TableHead>
                  <TableHead className="hidden lg:table-cell">Fecha</TableHead>
                  <TableHead className="text-right md:text-left">Total</TableHead>
                  <TableHead className="hidden lg:table-cell">Estado</TableHead>
                  <TableHead className="w-[15%] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facturasOrdenadas.map((factura) => (
                  <TableRow key={factura.id}>
                    <TableCell className="font-medium text-xs md:text-sm">
                      <div className="flex items-center gap-1 md:gap-2">
                        <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{factura.prefijo}-{factura.consecutivo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs md:text-sm">
                      <span className="truncate">Cliente #{factura.cliente_Id}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs md:text-sm">{formatDate(factura.fecha_Emision)}</TableCell>
                    <TableCell className="font-semibold text-xs md:text-sm text-right md:text-left">{formatCurrency(factura.total)}</TableCell>
                    <TableCell className="hidden lg:table-cell">{getEstadoBadge(factura.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Ver factura" className="p-1 md:p-2">
                          <Eye className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Descargar PDF" className="p-1 md:p-2">
                          <Download className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturacionPage;
