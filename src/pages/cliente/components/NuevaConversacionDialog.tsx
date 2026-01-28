import { useState } from 'react';
import { useCrearConversacionSegura } from '@/store/api/chatHooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';

interface NuevaConversacionDialogProps {
  onSuccess?: () => void;
}

export const NuevaConversacionDialog = ({ onSuccess }: NuevaConversacionDialogProps) => {
  const { crear, canCreateConversacion, isLoading, error } = useCrearConversacionSegura();
  const [open, setOpen] = useState(false);
  const [receptorId, setReceptorId] = useState('');
  const [nombre, setNombre] = useState('');

  const handleCrear = async () => {
    if (!receptorId || !nombre.trim()) return;

    try {
      await crear({
        usuario_Receptor_Id: Number(receptorId),
        nombre_Contraparte: nombre.trim(),
      });

      // Limpiar formulario
      setReceptorId('');
      setNombre('');
      setOpen(false);

      // Callback de éxito
      onSuccess?.();
    } catch (err) {
      console.error('Error al crear conversación:', err);
    }
  };

  if (!canCreateConversacion) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Nueva Conversación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Iniciar nueva conversación</DialogTitle>
          <DialogDescription>
            Conecta con un proveedor para resolver tus dudas o solicitar servicios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Error: {typeof error === 'string' ? error : 'Algo salió mal'}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre del proveedor
            </label>
            <Input
              id="nombre"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="receptorId" className="text-sm font-medium">
              ID del proveedor
            </label>
            <Input
              id="receptorId"
              type="number"
              placeholder="Ej: 5"
              value={receptorId}
              onChange={(e) => setReceptorId(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Solicita el ID al proveedor para iniciar una conversación
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCrear}
            disabled={isLoading || !nombre.trim() || !receptorId}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Crear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
