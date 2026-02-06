import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { TopActivo } from '../types';

interface TopActivosProps {
  data: TopActivo[];
}

export const TopActivos = ({ data }: TopActivosProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<TopActivo>[]>(
    () => [
      { accessorKey: 'nombre', header: 'Activo' },
      { accessorKey: 'categoria', header: 'Categoría' },
      {
        accessorKey: 'ingresos',
        header: 'Ingresos',
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString('es-CO')}`,
      },
      { accessorKey: 'reservas', header: 'Reservas' },
      {
        accessorKey: 'utilizacion',
        header: 'Utilización %',
        cell: ({ getValue }) => `${Number(getValue()).toFixed(1)}%`,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Top Activos</h3>
          <Button variant="outline" size="sm">
            Ver todos
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-3 py-2 font-semibold text-gray-700"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className="flex items-center gap-2 cursor-pointer select-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === 'asc' && <ArrowUp className="w-3 h-3" />}
                          {header.column.getIsSorted() === 'desc' && <ArrowDown className="w-3 h-3" />}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
