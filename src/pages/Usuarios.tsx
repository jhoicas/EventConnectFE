import { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useUsuarios, useUpdateUsuarioEstado } from '@/features/usuarios/hooks/useUsuarios';
import { APP_ROUTES } from '@/lib/routes';

const UsuariosPage = () => {
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading, isError } = useUsuarios();
  const updateEstado = useUpdateUsuarioEstado();

  const usuariosOrdenados = useMemo(
    () =>
      [...usuarios].sort((a, b) => {
        const aDate = a.fecha_creacion ? new Date(a.fecha_creacion).getTime() : 0;
        const bDate = b.fecha_creacion ? new Date(b.fecha_creacion).getTime() : 0;
        return bDate - aDate;
      }),
    [usuarios]
  );

  const getAvatarUrl = (seed?: string, avatarUrl?: string | null) => {
    if (avatarUrl) return avatarUrl;
    const safeSeed = seed ? encodeURIComponent(seed) : 'user';
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${safeSeed}&backgroundColor=ffd5dc`;
  };

  const normalizeEstadoValue = (estado?: string | null) => {
    const value = (estado ?? '').trim().toLowerCase();
    return value === 'activo' ? 'activo' : 'inactivo';
  };

  const toApiEstado = (value: 'activo' | 'inactivo') =>
    value === 'activo' ? 'Activo' : 'Inactivo';

  const estadoOptions: Record<'activo' | 'inactivo', { label: string; dot: string }> = {
    activo: { label: 'Activo', dot: 'bg-green-600' },
    inactivo: { label: 'Inactivo', dot: 'bg-gray-600' },
  };

  const handleEstadoChange = async (usuarioId: number, nuevoEst: 'activo' | 'inactivo') => {
    if (usuarioId && nuevoEst) {
      try {
        await updateEstado.mutateAsync({
          id: usuarioId,
          estado: toApiEstado(nuevoEst),
        });
      } catch (error) {
        console.error('Error actualizando estado:', error);
      }
    }
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
                  <TableHead className="w-[20%] md:w-auto">Estado</TableHead>
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
                      {(() => {
                        const estadoValue = normalizeEstadoValue(usuario.estado);
                        const estado = estadoOptions[estadoValue];
                        return (
                          <Select
                            value={estadoValue}
                            onValueChange={(value) => handleEstadoChange(usuario.id, value as 'activo' | 'inactivo')}
                          >
                            <SelectTrigger className="w-full md:w-[140px]">
                              <span className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${estado.dot}`}></span>
                                <span>{estado.label}</span>
                              </span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="activo">
                                <span className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                                  Activo
                                </span>
                              </SelectItem>
                              <SelectItem value="inactivo">
                                <span className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                                  Inactivo
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dialog de confirmación - Removido, ya no necesario con el select directo */}
    </div>
  );
};

export default UsuariosPage;