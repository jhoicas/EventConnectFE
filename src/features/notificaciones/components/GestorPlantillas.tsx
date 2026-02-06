import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useListarPlantillas, useCrearPlantilla, useActualizarPlantilla, useEliminarPlantilla } from '../hooks/useNotificaciones';
import { Plus, Edit, Trash2, Save, X, FileText, Loader2 } from 'lucide-react';
import type { PlantillaNotificacion, TipoNotificacion, CanalNotificacion } from '../types';

export const GestorPlantillas = () => {
  const [tipoFiltro, setTipoFiltro] = useState<TipoNotificacion | 'todos'>('todos');
  const [modoEdicion, setModoEdicion] = useState<'crear' | 'editar' | null>(null);
  const [plantillaActual, setPlantillaActual] = useState<Partial<PlantillaNotificacion>>({
    nombre: '',
    descripcion: '',
    tipo: 'email',
    canal: 'transaccional',
    asuntoPlantilla: '',
    mensajePlantilla: '',
    variables: [],
    activo: true,
    idioma: 'es',
  });

  const { data: plantillas, isLoading } = useListarPlantillas(tipoFiltro === 'todos' ? undefined : tipoFiltro);
  const { mutate: crear, isPending: creando } = useCrearPlantilla();
  const { mutate: actualizar, isPending: actualizando } = useActualizarPlantilla();
  const { mutate: eliminar, isPending: eliminando } = useEliminarPlantilla();

  const handleGuardar = () => {
    if (!plantillaActual.nombre || !plantillaActual.mensajePlantilla) return;

    if (modoEdicion === 'crear') {
      crear(plantillaActual, {
        onSuccess: () => {
          setModoEdicion(null);
          resetFormulario();
        },
      });
    } else if (modoEdicion === 'editar' && plantillaActual.id) {
      actualizar(
        { id: plantillaActual.id, data: plantillaActual },
        {
          onSuccess: () => {
            setModoEdicion(null);
            resetFormulario();
          },
        }
      );
    }
  };

  const handleEditar = (plantilla: PlantillaNotificacion) => {
    setPlantillaActual(plantilla);
    setModoEdicion('editar');
  };

  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta plantilla?')) {
      eliminar(id);
    }
  };

  const resetFormulario = () => {
    setPlantillaActual({
      nombre: '',
      descripcion: '',
      tipo: 'email',
      canal: 'transaccional',
      asuntoPlantilla: '',
      mensajePlantilla: '',
      variables: [],
      activo: true,
      idioma: 'es',
    });
  };

  const extraerVariables = (texto: string): string[] => {
    const regex = /{{([^}]+)}}/g;
    const matches = texto.matchAll(regex);
    return Array.from(new Set(Array.from(matches, (m) => m[1].trim())));
  };

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plantillas de Notificaciones</CardTitle>
              <CardDescription>Gestiona plantillas reutilizables para tus notificaciones</CardDescription>
            </div>
            <Button onClick={() => setModoEdicion('crear')} disabled={modoEdicion !== null}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Label className="mt-2">Filtrar por tipo:</Label>
            {(['todos', 'email', 'sms', 'push'] as const).map((tipo) => (
              <Button
                key={tipo}
                variant={tipoFiltro === tipo ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTipoFiltro(tipo)}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de creación/edición */}
      {modoEdicion && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{modoEdicion === 'crear' ? 'Nueva Plantilla' : 'Editar Plantilla'}</span>
              <Button variant="ghost" size="sm" onClick={() => { setModoEdicion(null); resetFormulario(); }}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={plantillaActual.nombre}
                  onChange={(e) => setPlantillaActual({ ...plantillaActual, nombre: e.target.value })}
                  placeholder="Ej: Bienvenida"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  value={plantillaActual.tipo}
                  onChange={(e) => setPlantillaActual({ ...plantillaActual, tipo: e.target.value as TipoNotificacion })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                  <option value="inApp">In-App</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input
                value={plantillaActual.descripcion}
                onChange={(e) => setPlantillaActual({ ...plantillaActual, descripcion: e.target.value })}
                placeholder="Breve descripción de la plantilla"
              />
            </div>

            <div className="space-y-2">
              <Label>Canal</Label>
              <select
                value={plantillaActual.canal}
                onChange={(e) => setPlantillaActual({ ...plantillaActual, canal: e.target.value as CanalNotificacion })}
                className="w-full border rounded-md p-2"
              >
                <option value="transaccional">Transaccional</option>
                <option value="marketing">Marketing</option>
                <option value="sistema">Sistema</option>
                <option value="recordatorio">Recordatorio</option>
              </select>
            </div>

            {plantillaActual.tipo === 'email' && (
              <div className="space-y-2">
                <Label>Asunto (usa {'{{'} y {'}}'}  para variables)</Label>
                <Input
                  value={plantillaActual.asuntoPlantilla}
                  onChange={(e) => setPlantillaActual({ ...plantillaActual, asuntoPlantilla: e.target.value })}
                  placeholder="Ej: Bienvenido {{nombre}} a EventConnect"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Mensaje (usa {'{{'} y {'}}'}  para variables)</Label>
              <Textarea
                value={plantillaActual.mensajePlantilla}
                onChange={(e) => {
                  const mensaje = e.target.value;
                  const vars = extraerVariables(mensaje + (plantillaActual.asuntoPlantilla || ''));
                  setPlantillaActual({ ...plantillaActual, mensajePlantilla: mensaje, variables: vars });
                }}
                placeholder="Hola {{nombre}}, bienvenido a nuestra plataforma..."
                rows={6}
              />
            </div>

            {plantillaActual.variables && plantillaActual.variables.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-medium text-blue-900 mb-1">Variables detectadas:</p>
                <div className="flex flex-wrap gap-2">
                  {plantillaActual.variables.map((v) => (
                    <span key={v} className="px-2 py-1 bg-white border rounded text-xs">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleGuardar} disabled={creando || actualizando}>
                {(creando || actualizando) ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />Guardar</>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setModoEdicion(null); resetFormulario(); }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de plantillas */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : !plantillas || plantillas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay plantillas disponibles</p>
          ) : (
            <div className="grid gap-4">
              {plantillas.map((plantilla) => (
                <div key={plantilla.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 mt-1 text-blue-600" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{plantilla.nombre}</h4>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                            {plantilla.tipo}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">
                            {plantilla.canal}
                          </span>
                          {!plantilla.activo && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                              Inactiva
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{plantilla.descripcion}</p>
                        {plantilla.variables.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {plantilla.variables.map((v) => (
                              <span key={v} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditar(plantilla)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEliminar(plantilla.id)}
                        disabled={eliminando}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
