'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '../store/store';
import { Loading } from '@eventconnect/ui';
import { ROUTES } from '@eventconnect/shared';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated && pathname !== ROUTES.LOGIN) {
        router.push(ROUTES.LOGIN);
        return;
      }

      // Si está autenticado, validar acceso según rol SOLO en la primera carga
      // No redirigir en navegaciones posteriores dentro del área permitida
      if (isAuthenticated && user) {
        const isAdminRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/categorias') || 
                           pathname.startsWith('/productos') ||
                           pathname.startsWith('/clientes') ||
                           pathname.startsWith('/reservas') ||
                           pathname.startsWith('/activos') ||
                           pathname.startsWith('/bodegas') ||
                           pathname.startsWith('/lotes') ||
                           pathname.startsWith('/mantenimientos') ||
                           pathname.startsWith('/configuracion') ||
                           pathname.startsWith('/chat') ||
                           pathname.startsWith('/usuarios') ||
                           pathname.startsWith('/gestion-landing');

        const isClienteRoute = pathname.startsWith('/cliente/');

        // Solo redirigir si el usuario está en una ruta completamente incorrecta
        // Si es SuperAdmin o Admin-Proveedor intentando acceder a rutas de cliente
        if ((user.rol === 'SuperAdmin' || user.rol === 'Admin-Proveedor') && isClienteRoute) {
          router.push(ROUTES.DASHBOARD);
          return;
        }

        // Si es Usuario/Cliente intentando acceder a rutas de admin
        if ((user.rol === 'Usuario' || user.rol === 'Cliente') && isAdminRoute) {
          router.push('/cliente/explorar');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user?.rol, pathname, router]);
  // Cambiado: Solo escuchar cambios en rol, no en user completo para evitar loops

  if (isLoading) {
    return <Loading text="Verificando sesión..." />;
  }

  if (!isAuthenticated && pathname !== ROUTES.LOGIN) {
    return null;
  }

  return <>{children}</>;
}
