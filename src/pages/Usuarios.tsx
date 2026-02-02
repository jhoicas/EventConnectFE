import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUsuarios } from '@/features/usuarios/hooks/useUsuarios';

const UsuariosPage = () => {
  const { data: usuarios = [], isLoading, isError } = useUsuarios();

  const usuariosOrdenados = useMemo(
    () =>
      [...usuarios].sort((a, b) => {
        const aDate = a.fecha_creacion ? new Date(a.fecha_creacion).getTime() : 0;
        const bDate = b.fecha_creacion ? new Date(b.fecha_creacion).getTime() : 0;
        return bDate - aDate;
      }),
    [usuarios]
  );

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-CO');
  };

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

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando usuarios...</p>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              No fue posible cargar los usuarios. Intenta nuevamente.
            </p>
          </div>
        ) : usuariosOrdenados.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No hay usuarios registrados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último acceso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosOrdenados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(usuario.usuario1, usuario.avatar_url)}
                        alt={usuario.nombre_completo}
                        className="h-9 w-9 rounded-full border object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getAvatarUrl(usuario.email, null);
                        }}
                      />
                      <div>
                        <p className="font-medium">{usuario.nombre_completo}</p>
                        <p className="text-xs text-muted-foreground">{usuario.usuario1}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.rol}</TableCell>
                  <TableCell>{usuario.empresa_nombre || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        usuario.estado
                      )}`}
                    >
                      {usuario.estado}
                    </span>
                  </TableCell>
                  <TableCell>{formatDateTime(usuario.ultimo_acceso)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;
