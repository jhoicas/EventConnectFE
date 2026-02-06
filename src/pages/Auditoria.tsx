import { useMemo, useState } from 'react';
import { Search, Filter, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuditoriaFiltros, type AuditoriaFiltrosState } from '@/features/auditoria/components/AuditoriaFiltros';
import { AuditoriaTimeline } from '@/features/auditoria/components/AuditoriaTimeline';
import { AuditoriaHistorial } from '@/features/auditoria/components/AuditoriaHistorial';
import {
  useAuditoriaTimeline,
  useAuditoriaBuscar,
  useAuditoriaFiltrado,
  useAuditoriaHistorial,
  useAuditoriaResumen,
} from '@/features/auditoria/hooks/useAuditoria';

const DEFAULT_FILTERS: AuditoriaFiltrosState = {
  tabla: '',
  accion: '',
  usuario: '',
  desde: '',
  hasta: '',
};

const AuditoriaPage = () => {
  const [timelinePage, setTimelinePage] = useState(1);
  const [timelinePageSize] = useState(20);

  const timelineQuery = useAuditoriaTimeline({
    page: timelinePage,
    pageSize: timelinePageSize,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);

  const searchEnabled = Boolean(searchQuery.trim());
  const buscarQuery = useAuditoriaBuscar(
    { q: searchQuery, page: searchPage, pageSize: 20 },
    searchEnabled
  );

  const [filters, setFilters] = useState<AuditoriaFiltrosState>(DEFAULT_FILTERS);
  const [filterPage, setFilterPage] = useState(1);

  const hasFilters = useMemo(() => {
    return Boolean(filters.tabla || filters.accion || filters.usuario || filters.desde || filters.hasta);
  }, [filters]);

  const filtradoQuery = useAuditoriaFiltrado(
    {
      ...filters,
      page: filterPage,
      pageSize: 20,
    },
    hasFilters
  );

  const [historialTabla, setHistorialTabla] = useState('');
  const [historialRegistroId, setHistorialRegistroId] = useState('');
  const historialQuery = useAuditoriaHistorial(historialTabla, historialRegistroId, { page: 1, pageSize: 50 });

  const resumenQuery = useAuditoriaResumen();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Auditoría</h1>
          <p className="text-sm text-slate-500">Registro de cambios, eventos críticos y trazabilidad.</p>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="buscar" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Buscar
          </TabsTrigger>
          <TabsTrigger value="filtrado" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtrado
          </TabsTrigger>
          <TabsTrigger value="historial" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <AuditoriaTimeline
            items={(timelineQuery.data?.items as any) ?? []}
            isLoading={timelineQuery.isLoading}
            error={timelineQuery.isError ? 'No se pudo cargar el timeline.' : undefined}
          />
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setTimelinePage((prev) => Math.max(prev - 1, 1))}
              disabled={timelinePage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-slate-500">
              Página {timelinePage}
            </span>
            <Button
              variant="outline"
              onClick={() => setTimelinePage((prev) => prev + 1)}
              disabled={timelineQuery.data && (timelineQuery.data as any)?.items?.length < timelinePageSize}
            >
              Siguiente
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="buscar" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Buscar por usuario, tabla, acción..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchPage(1);
              }}
              className="max-w-md"
            />
          </div>
          {!searchEnabled ? (
            <div className="text-sm text-slate-500">Ingresa un término para buscar.</div>
          ) : (
            <AuditoriaTimeline
              items={(buscarQuery.data?.items as any) ?? []}
              isLoading={buscarQuery.isLoading}
              error={buscarQuery.isError ? 'No se pudo buscar.' : undefined}
            />
          )}
          {searchEnabled && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setSearchPage((prev) => Math.max(prev - 1, 1))}
                disabled={searchPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-500">Página {searchPage}</span>
              <Button
                variant="outline"
                onClick={() => setSearchPage((prev) => prev + 1)}
                disabled={buscarQuery.data && (buscarQuery.data as any)?.items?.length < 20}
              >
                Siguiente
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="filtrado" className="space-y-4">
          <AuditoriaFiltros value={filters} onChange={setFilters} />
          {!hasFilters ? (
            <div className="text-sm text-slate-500">Selecciona al menos un filtro.</div>
          ) : (
            <AuditoriaTimeline
              items={(filtradoQuery.data?.items as any) ?? []}
              isLoading={filtradoQuery.isLoading}
              error={filtradoQuery.isError ? 'No se pudo filtrar.' : undefined}
            />
          )}
          {hasFilters && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setFilterPage((prev) => Math.max(prev - 1, 1))}
                disabled={filterPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-500">Página {filterPage}</span>
              <Button
                variant="outline"
                onClick={() => setFilterPage((prev) => prev + 1)}
                disabled={filtradoQuery.data && (filtradoQuery.data as any)?.items?.length < 20}
              >
                Siguiente
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="historial" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Tabla (ej. Reservas)"
              value={historialTabla}
              onChange={(event) => setHistorialTabla(event.target.value)}
            />
            <Input
              placeholder="ID de registro"
              value={historialRegistroId}
              onChange={(event) => setHistorialRegistroId(event.target.value)}
            />
          </div>
          {!historialTabla || !historialRegistroId ? (
            <div className="text-sm text-slate-500">Ingresa tabla e ID para ver el historial.</div>
          ) : (
            <AuditoriaHistorial
              items={historialQuery.data?.items ?? []}
              isLoading={historialQuery.isLoading}
              error={historialQuery.isError ? 'No se pudo cargar el historial.' : undefined}
            />
          )}
        </TabsContent>
      </Tabs>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
        {resumenQuery.isLoading ? (
          <div className="text-sm text-slate-500">Cargando resumen...</div>
        ) : resumenQuery.isError ? (
          <div className="text-sm text-red-600">No se pudo cargar el resumen.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase text-slate-500">Total eventos</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{resumenQuery.data?.total ?? 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase text-slate-500">Por acción</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                {Object.entries(resumenQuery.data?.porAccion ?? {}).map(([accion, total]: [string, any]) => (
                  <div key={accion} className="flex items-center justify-between">
                    <span>{accion}</span>
                    <span className="font-medium">{String(total)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase text-slate-500">Por tabla</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                {Object.entries(resumenQuery.data?.porTabla ?? {}).map(([tabla, total]: [string, any]) => (
                  <div key={tabla} className="flex items-center justify-between">
                    <span>{tabla}</span>
                    <span className="font-medium">{String(total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditoriaPage;
