import { useMemo, useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUsuarios, useUpdateUsuarioEstado } from '@/features/usuarios/hooks/useUsuarios';
import { APP_ROUTES } from '@/lib/routes';
import type { UsuarioApi } from '@/types';

const UsuariosPage = () => {
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading, isError } = useUsuarios();
  const updateEstado = useUpdateUsuarioEstado();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioApi | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  const usuariosOrdenados = useMemo(
    () =>
      [...usuarios].sort((a, b) => {
        const aDate = a.fecha_creacion ? new Date(a.fecha_creacion).getTime() : 0;
        const bDate = b.fecha_creacion ? new Date(b.fecha_creacion).getTime() : 0;
        return bDate - aDate;
      }),
    [usuarios]
  );

  const getEstadoBadgeColor = (estado?: string) => {
    switch (estado) {
      case 'Activo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inactivo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Bloqueado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getAvatarUrl = (seed?: string, avatarUrl?: string | null) => {
    if (avatarUrl) return avatarUrl;
    const safeSeed = seed ? encodeURIComponent(seed) : 'user';
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${safeSeed}&backgroundColor=ffd5dc`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Administra los usuarios del sistema
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando usuarios...</p>
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
            <Button 
              onClick={() => navigate(APP_ROUTES.DASHBOARD)}
              variant="outline"
            >
              Volver al Dashboard
            </Button>
          </div>
        ) : usuariosOrdenados.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="inline-block w-full min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%] md:w-auto">Usuario</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Rol</TableHead>
                  <TableHead className="hidden xl:table-cell">Empresa</TableHead>
                  <TableHead className="w-[15%] md:w-auto">Estado</TableHead>
                  <TableHead className="w-[25%] md:w-auto text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosOrdenados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 md:gap-3">
                        <img
                          src={getAvatarUrl(usuario.usuario1, usuario.avatar_url)}
                          alt={usuario.nombre_completo}
                          className="h-8 w-8 md:h-9 md:w-9 rounded-full border object-cover flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getAvatarUrl(usuario.email, null);
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-sm md:text-base truncate">{usuario.nombre_completo}</p>
                          <p className="text-xs text-muted-foreground truncate md:hidden">{usuario.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      <span className="truncate block">{usuario.email}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{usuario.rol}</TableCell>
                    <TableCell className="hidden xl:table-cell text-sm">{usuario.empresa_nombre || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${getEstadoBadgeColor(
                          usuario.estado
                        )}`}
                      >
                        {usuario.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        {usuario.estado === 'Activo' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm"
                            onClick={() => {
                              setUsuarioSeleccionado(usuario);
                              setNuevoEstado('Inactivo');
                            }}
                          >
                            <X className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
                            <span className="hidden md:inline">Desactivar</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 text-xs md:text-sm"
                            onClick={() => {
                              setUsuarioSeleccionado(usuario);
                              setNuevoEstado('Activo');
                            }}
                          >
                            <Check className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
                            <span className="hidden md:inline">Activar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dialog de confirmación */}
      <Dialog open={!!usuarioSeleccionado} onOpenChange={() => setUsuarioSeleccionado(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {nuevoEstado === 'Activo' ? 'Activar usuario' : 'Desactivar usuario'}
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas {nuevoEstado === 'Activo' ? 'activar' : 'desactivar'} a{' '}
              <strong>{usuarioSeleccionado?.nombre_completo}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setUsuarioSeleccionado(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (usuarioSeleccionado) {
                  await updateEstado.mutateAsync({
                    id: usuarioSeleccionado.id,
                    estado: nuevoEstado,
                  });
                  setUsuarioSeleccionado(null);
                }
              }}
              disabled={updateEstado.isPending}
              className={
                nuevoEstado === 'Inactivo'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }
            >
              {updateEstado.isPending
                ? 'Procesando...'
                : nuevoEstado === 'Activo'
                  ? 'Activar'
                  : 'Desactivar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsuariosPage;
