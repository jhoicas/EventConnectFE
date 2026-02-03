import { useState } from 'react';
import { Edit2, Trash2, Plus, Save, X, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  useConfiguraciones, 
  useCreateConfiguracion, 
  useUpdateConfiguracion, 
  useDeleteConfiguracion 
} from '@/features/configuracion/hooks/useConfiguracion';
import type { ConfiguracionSistema, CreateConfiguracionDto } from '@/features/configuracion/types';

const ConfiguracionPage = () => {
  const { data: configuraciones = [], isLoading, isError } = useConfiguraciones();
  const createConfig = useCreateConfiguracion();
  const updateConfig = useUpdateConfiguracion();
  const deleteConfig = useDeleteConfiguracion();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfiguracionSistema | null>(null);
  
  const [formData, setFormData] = useState<Partial<CreateConfiguracionDto>>({
    clave: '',
    valor: '',
    descripcion: '',
    tipo_Dato: 'string',
    es_Global: false,
  });

  const handleEdit = (config: ConfiguracionSistema) => {
    setSelectedConfig(config);
    setFormData({
      clave: config.clave,
      valor: config.valor,
      descripcion: config.descripcion,
      tipo_Dato: config.tipo_Dato,
      es_Global: config.es_Global,
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      clave: '',
      valor: '',
      descripcion: '',
      tipo_Dato: 'string',
      es_Global: false,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (config: ConfiguracionSistema) => {
    setSelectedConfig(config);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedConfig && formData.valor) {
      updateConfig.mutate({
        id: selectedConfig.id,
        data: {
          valor: formData.valor,
          descripcion: formData.descripcion,
        },
      });
      setIsEditModalOpen(false);
    }
  };

  const handleSaveCreate = () => {
    if (formData.clave && formData.valor && formData.descripcion && formData.tipo_Dato !== undefined) {
      createConfig.mutate(formData as CreateConfiguracionDto);
      setIsCreateModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedConfig) {
      deleteConfig.mutate(selectedConfig.id);
      setIsDeleteModalOpen(false);
    }
  };

  const getTipoDatoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      string: 'Texto',
      number: 'Número',
      boolean: 'Booleano',
      json: 'JSON',
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Gestiona las configuraciones del sistema</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Configuración
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando configuraciones...</p>
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
        ) : configuraciones.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No hay configuraciones registradas</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clave</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ámbito</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configuraciones.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-mono text-sm">{config.clave}</TableCell>
                  <TableCell className="max-w-xs truncate">{config.valor}</TableCell>
                  <TableCell className="max-w-md truncate">{config.descripcion}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {getTipoDatoLabel(config.tipo_Dato)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      config.es_Global 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {config.es_Global ? 'Global' : 'Empresa'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(config)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(config)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal de Edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Configuración</DialogTitle>
            <DialogDescription>
              Actualiza el valor y descripción de la configuración
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Clave</Label>
              <Input value={formData.clave} disabled className="bg-muted" />
            </div>
            <div>
              <Label>Valor</Label>
              <Input
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Creación */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Configuración</DialogTitle>
            <DialogDescription>
              Crea una nueva configuración del sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Clave *</Label>
              <Input
                placeholder="MI_CONFIGURACION"
                value={formData.clave}
                onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
              />
            </div>
            <div>
              <Label>Valor *</Label>
              <Input
                placeholder="Valor de la configuración"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
            <div>
              <Label>Descripción *</Label>
              <Input
                placeholder="Descripción de la configuración"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>
            <div>
              <Label>Tipo de Dato *</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.tipo_Dato}
                onChange={(e) => setFormData({ ...formData, tipo_Dato: e.target.value })}
              >
                <option value="string">Texto</option>
                <option value="number">Número</option>
                <option value="boolean">Booleano</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="es_global"
                checked={formData.es_Global}
                onChange={(e) => setFormData({ ...formData, es_Global: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="es_global">Configuración global</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSaveCreate}>
              <Save className="mr-2 h-4 w-4" />
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la configuración "{selectedConfig?.clave}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfiguracionPage;
