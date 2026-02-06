import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Plus } from 'lucide-react';
import { CalendarioDisponibilidad } from '@/features/disponibilidad/components/CalendarioDisponibilidad';
import { DisponibilidadTable } from '@/features/disponibilidad/components/DisponibilidadTable';
import { CrearDisponibilidad } from '@/features/disponibilidad/components/CrearDisponibilidad';

const DisponibilidadPage = () => {
  const [activoId, setActivoId] = useState<number>(1);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [tabActiva, setTabActiva] = useState('calendario');

  const handleDateSelect = (fecha: string) => {
    setFechaInicio(fecha);
    setFechaFin('');
  };

  const handleRangeSelect = (inicio: string, fin: string) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
    setTabActiva('tabla');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Disponibilidad de Activos</h1>
          </div>
          <p className="text-gray-600">
            Gestiona la disponibilidad de tus activos por fechas. Visualiza en calendario o tabla.
          </p>
        </div>

        {/* Filtro de Activo */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona un Activo
          </label>
          <input
            type="number"
            value={activoId}
            onChange={(e) => setActivoId(Number(e.target.value))}
            placeholder="ID del activo"
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {activoId > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Mostrando disponibilidad para activo ID: <strong>{activoId}</strong>
            </p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calendario" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="tabla" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Tabla</span>
            </TabsTrigger>
            <TabsTrigger value="crear" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Crear</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Calendario */}
          <TabsContent value="calendario" className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Haz clic en un día para seleccionar una fecha o un rango de fechas.
              </p>
              <CalendarioDisponibilidad
                activoId={activoId}
                onDateSelect={handleDateSelect}
                onRangeSelect={handleRangeSelect}
              />
            </div>
          </TabsContent>

          {/* Tab: Tabla */}
          <TabsContent value="tabla" className="space-y-6">
            {fechaInicio && fechaFin ? (
              <div>
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Mostrando datos del <strong>{fechaInicio}</strong> al <strong>{fechaFin}</strong>
                  </p>
                </div>
                <DisponibilidadTable
                  activoId={activoId}
                  fechaInicio={fechaInicio}
                  fechaFin={fechaFin}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Selecciona un rango de fechas en el calendario para ver la tabla de disponibilidad.
                </p>
                <button
                  onClick={() => setTabActiva('calendario')}
                  className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Ir a Calendario
                </button>
              </div>
            )}
          </TabsContent>

          {/* Tab: Crear */}
          <TabsContent value="crear" className="space-y-6">
            <CrearDisponibilidad
              activoId={activoId}
              onSuccess={() => setTabActiva('calendario')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DisponibilidadPage;
