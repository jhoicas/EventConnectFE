'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, useToast } from '@chakra-ui/react';
import { Navbar, Sidebar } from '@eventconnect/ui';
import type { MenuItemType } from '@eventconnect/ui';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  Warehouse,
  FileBox,
  TrendingUp,
  Wrench,
  Settings,
  MessageCircle,
  UserCog,
  Truck,
  RotateCcw,
  QrCode,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { logout, setCredentials } from '../store/slices/authSlice';
import { ROUTES } from '@eventconnect/shared';
import { usePathname } from 'next/navigation';
import ProfileModal from './profile/ProfileModal';
import { API_BASE_URL } from '../config/env';

// Tipos para roles del sistema
type UserRole = 'SuperAdmin' | 'Admin-Proveedor' | 'Operario' | 'Cliente' | 'Usuario';

// Función helper para crear items de menú con estado activo
const createMenuItem = (
  label: string,
  icon: React.ElementType,
  href: string,
  pathname: string,
  submenu?: Omit<MenuItemType, 'isActive'>[]
): MenuItemType => {
  const baseItem: MenuItemType = {
    label,
    icon,
    href,
    isActive: pathname === href,
  };

  if (submenu) {
    return {
      ...baseItem,
      submenu: submenu.map((item) => ({
        ...item,
        isActive: pathname === item.href,
      })),
    };
  }

  return baseItem;
};

// Configuración centralizada de menús por rol
const ROLE_MENUS: Record<UserRole, (pathname: string) => MenuItemType[]> = {
  // Menú para Cliente
  Cliente: (pathname: string): MenuItemType[] => [
    createMenuItem('Explorar', LayoutDashboard, '/cliente/explorar', pathname),
    createMenuItem('Cotizaciones', ShoppingCart, '/cliente/cotizaciones', pathname),
    createMenuItem('Reservas', Calendar, '/cliente/reservas', pathname),
    createMenuItem('Mensajes', MessageCircle, '/cliente/mensajes', pathname),
  ],

  // Menú para Usuario (alias de Cliente)
  Usuario: (pathname: string): MenuItemType[] => [
    createMenuItem('Explorar', LayoutDashboard, '/cliente/explorar', pathname),
    createMenuItem('Cotizaciones', ShoppingCart, '/cliente/cotizaciones', pathname),
    createMenuItem('Reservas', Calendar, '/cliente/reservas', pathname),
    createMenuItem('Mensajes', MessageCircle, '/cliente/mensajes', pathname),
  ],

  // Menú para Admin-Proveedor (limpiado y enfocado en su empresa)
  'Admin-Proveedor': (pathname: string): MenuItemType[] => [
    createMenuItem('Dashboard', LayoutDashboard, ROUTES.DASHBOARD, pathname),
    createMenuItem(
      'Reservas',
      Calendar,
      '#',
      pathname,
      [
        { label: 'Lista', icon: Calendar, href: ROUTES.RESERVAS },
        { label: 'Calendario', icon: Calendar, href: ROUTES.CALENDARIO_RESERVAS },
      ]
    ),
    createMenuItem(
      'Inventario',
      Warehouse,
      '#',
      pathname,
      [
        { label: 'Activos', icon: Warehouse, href: ROUTES.ACTIVOS },
        { label: 'Lotes', icon: TrendingUp, href: ROUTES.LOTES },
      ]
    ),
    createMenuItem('Clientes', Users, ROUTES.CLIENTES, pathname),
    createMenuItem('Mi Equipo', UserCog, ROUTES.USUARIOS, pathname),
    createMenuItem('Configuración', Settings, ROUTES.CONFIGURACION, pathname),
    createMenuItem('Facturación', FileText, ROUTES.FACTURACION, pathname),
  ],

  // Menú para SuperAdmin (mismo que Admin-Proveedor)
  SuperAdmin: (pathname: string): MenuItemType[] => [
    createMenuItem('Dashboard', LayoutDashboard, ROUTES.DASHBOARD, pathname),
    createMenuItem('Chat', MessageCircle, ROUTES.CHAT, pathname),
    createMenuItem(
      'Catálogo',
      Package,
      '#',
      pathname,
      [
        { label: 'Categorías', icon: Package, href: ROUTES.CATEGORIAS },
        { label: 'Productos', icon: ShoppingCart, href: ROUTES.PRODUCTOS },
      ]
    ),
    createMenuItem('Clientes', Users, ROUTES.CLIENTES, pathname),
    createMenuItem('Reservas', Calendar, ROUTES.RESERVAS, pathname),
    createMenuItem(
      'Inventario',
      Warehouse,
      '#',
      pathname,
      [
        { label: 'Activos', icon: Warehouse, href: ROUTES.ACTIVOS },
        { label: 'Bodegas', icon: FileBox, href: ROUTES.BODEGAS },
        { label: 'Lotes', icon: TrendingUp, href: ROUTES.LOTES },
      ]
    ),
    createMenuItem('Mantenimientos', Wrench, ROUTES.MANTENIMIENTOS, pathname),
    createMenuItem('Usuarios', UserCog, ROUTES.USUARIOS, pathname),
    createMenuItem('Configuración', Settings, ROUTES.CONFIGURACION, pathname),
  ],

  // Menú para Operario (NUEVO)
  Operario: (pathname: string): MenuItemType[] => [
    createMenuItem('Dashboard', LayoutDashboard, ROUTES.DASHBOARD, pathname),
    createMenuItem('Tareas de Entrega', Truck, '/operario/entregas', pathname),
    createMenuItem('Tareas de Recogida', RotateCcw, '/operario/recogidas', pathname),
    createMenuItem('Escáner QR', QrCode, '/operario/scanner', pathname),
    createMenuItem('Reportar Incidente', AlertTriangle, '/operario/incidentes', pathname),
  ],
};

// Constante para el ancho del sidebar (debe coincidir con el ancho definido en el componente Sidebar)
const SIDEBAR_WIDTH = 250;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const toast = useToast();
  // Estado del sidebar - persistir entre navegaciones usando localStorage
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Intentar recuperar el estado desde localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pendingUsersCount, setPendingUsersCount] = useState<number>(0);
  const { user } = useAppSelector((state) => state.auth);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Obtener el rol del usuario de forma segura
  const userRole: UserRole | null = useMemo(() => {
    if (!user?.rol) return null;
    return user.rol as UserRole;
  }, [user?.rol]);

  // Obtener menú según rol usando la configuración centralizada
  const menuItems: MenuItemType[] = useMemo(() => {
    if (!userRole || !ROLE_MENUS[userRole]) {
      // Si el rol no está definido, retornar menú vacío o mínimo
      return [];
    }
    return ROLE_MENUS[userRole](pathname);
  }, [userRole, pathname]);

  // Cargar conteo de usuarios pendientes (solo para admins)
  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (userRole === 'SuperAdmin' || userRole === 'Admin-Proveedor') {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/Usuario/pendientes/count`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          // Manejar respuesta 401 (Unauthorized)
          if (response.status === 401) {
            // Detener el intervalo si existe
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            // Mostrar notificación
            toast({
              title: 'Sesión expirada',
              description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });

            // Limpiar estado y redirigir
            dispatch(logout());
            router.push(ROUTES.LOGIN);
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setPendingUsersCount(data.count);
          }
        } catch (error) {
          console.error('Error al obtener usuarios pendientes:', error);
          // No hacer nada en caso de error de red, el intervalo seguirá intentando
        }
      }
    };

    fetchPendingUsers();
    
    // Actualizar cada 2 minutos (120000 ms) en lugar de 30 segundos
    intervalRef.current = setInterval(fetchPendingUsers, 120000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [userRole, dispatch, router, toast]);

  const handleLogout = () => {
    dispatch(logout());
    router.push(ROUTES.LOGIN);
  };

  // Guardar el estado del sidebar en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', String(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  const handleMenuItemClick = (href: string) => {
    // Ignorar clics en items sin href válido (submenús padre)
    if (!href || href === '#') {
      return;
    }

    // Navegar inmediatamente usando router.push
    // En Next.js App Router, router.push es síncrono y maneja la navegación internamente
    router.push(href);
    
    // La navegación se iniciará, Next.js manejará el renderizado automáticamente
    // NO cerrar el sidebar aquí - se maneja en el componente Sidebar según el breakpoint
  };

  const handleNotificationClick = () => {
    // Redirigir a la página de usuarios para gestionar los pendientes
    router.push(ROUTES.USUARIOS);
  };

  const handleProfileSave = (data: any) => {
    console.log('Datos de perfil actualizados:', data);
    // Actualizar Redux con los nuevos datos del perfil
    if (!user) return;
    
    dispatch(setCredentials({
      user: {
        id: user.id,
        email: user.email || '',
        rol: user.rol || '',
        nombre_Completo: data.nombre_Completo,
        telefono: data.telefono,
        avatar_URL: data.avatar_URL,
      },
      token: localStorage.getItem('token') || '',
    }));
  };

  return (
    <Box minH="100vh" position="relative">
      {/* Navbar con margen dinámico en escritorio cuando sidebar está abierto */}
      <Box
        as="header"
        position="relative"
        ml={{
          base: 0,
          md: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
        }}
        transition="margin-left 0.3s ease-in-out"
      >
        <Navbar
          title="EventConnect"
          username={user?.nombre_Completo}
          userAvatar={user?.avatar_URL}
          userRole={user?.rol}
          userEmail={user?.email}
          pendingUsersCount={userRole === 'SuperAdmin' || userRole === 'Admin-Proveedor' ? pendingUsersCount : undefined}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onProfileClick={() => setIsProfileModalOpen(true)}
          onNotificationClick={handleNotificationClick}
          onLogout={handleLogout}
        />
      </Box>

      {/* Sidebar - Fixed position, controlado por el componente Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          // Guardar en localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarOpen', 'false');
          }
        }}
        items={menuItems}
        onItemClick={handleMenuItemClick}
      />

      {/* Contenido principal con margen izquierdo dinámico - Push behavior en escritorio */}
      <Box
        as="main"
        minH="calc(100vh - 64px)"
        mt="64px"
        ml={{
          base: 0, // En móvil: sin margen (sidebar es overlay/drawer)
          md: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : 0, // En escritorio: empuja el contenido
        }}
        w={{
          base: "100%",
          md: isSidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : "100%",
        }}
        transition="margin-left 0.3s ease-in-out, width 0.3s ease-in-out"
        position="relative"
        zIndex={1}
      >
        <Container maxW="container.xl" py={6} px={{ base: 4, md: 6 }}>
          {children}
        </Container>
      </Box>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSave={handleProfileSave}
      />
    </Box>
  );
}
