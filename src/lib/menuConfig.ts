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
  FileSearch,
  AlertOctagon,
  BarChart3,
  DollarSign,
  CreditCard,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import { APP_ROUTES } from './routes';
import type { UserRole } from '@/types';

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  submenu?: Omit<MenuItem, 'submenu'>[];
}

export const MENU_BY_ROLE: Record<UserRole, MenuItem[]> = {
  // Menú para Cliente
  Cliente: [
    { label: 'Portal', icon: LayoutDashboard, href: APP_ROUTES.CLIENTE_PORTAL },
    { label: 'Explorar', icon: Package, href: APP_ROUTES.CLIENTE_EXPLORAR },
    { label: 'Cotizaciones', icon: FileText, href: APP_ROUTES.CLIENTE_COTIZACIONES },
    { label: 'Reservas', icon: Calendar, href: APP_ROUTES.CLIENTE_RESERVAS },
    { label: 'Mensajes', icon: MessageCircle, href: APP_ROUTES.CLIENTE_MENSAJES },
  ],

  // Menú para Usuario (alias de Cliente)
  Usuario: [
    { label: 'Portal', icon: LayoutDashboard, href: APP_ROUTES.CLIENTE_PORTAL },
    { label: 'Explorar', icon: Package, href: APP_ROUTES.CLIENTE_EXPLORAR },
    { label: 'Cotizaciones', icon: FileText, href: APP_ROUTES.CLIENTE_COTIZACIONES },
    { label: 'Reservas', icon: Calendar, href: APP_ROUTES.CLIENTE_RESERVAS },
    { label: 'Mensajes', icon: MessageCircle, href: APP_ROUTES.CLIENTE_MENSAJES },
  ],

  // Menú para Admin-Proveedor
  'Admin-Proveedor': [
    { label: 'Dashboard', icon: LayoutDashboard, href: APP_ROUTES.DASHBOARD },
    { label: 'Analytics', icon: BarChart3, href: APP_ROUTES.ANALYTICS },
    { label: 'Optimizar Reservas', icon: DollarSign, href: APP_ROUTES.OPTIMIZAR_RESERVAS },
    { label: 'Pagos', icon: CreditCard, href: APP_ROUTES.PAGOS },
    { label: 'Notificaciones', icon: Bell, href: APP_ROUTES.NOTIFICACIONES },
    {
      label: 'Reservas',
      icon: Calendar,
      href: APP_ROUTES.RESERVAS,
      submenu: [
        { label: 'Lista', icon: Calendar, href: APP_ROUTES.RESERVAS },
        { label: 'Calendario', icon: Calendar, href: APP_ROUTES.RESERVAS_CALENDARIO },
      ],
    },
    {
      label: 'Inventario',
      icon: Warehouse,
      href: APP_ROUTES.ACTIVOS,
      submenu: [
        { label: 'Activos', icon: Warehouse, href: APP_ROUTES.ACTIVOS },
        { label: 'Disponibilidad', icon: Calendar, href: APP_ROUTES.DISPONIBILIDAD },
        { label: 'Lotes', icon: TrendingUp, href: APP_ROUTES.LOTES },
      ],
    },
    { label: 'Clientes', icon: Users, href: APP_ROUTES.CLIENTES },
    { label: 'Mi Equipo', icon: UserCog, href: APP_ROUTES.USUARIOS },
    { label: 'Alertas', icon: AlertOctagon, href: APP_ROUTES.ALERTAS },
    { label: 'Daños', icon: AlertOctagon, href: APP_ROUTES.DANIOS },
    { label: 'Auditoría', icon: FileSearch, href: APP_ROUTES.AUDITORIA },
    { label: 'Configuración', icon: Settings, href: APP_ROUTES.CONFIGURACION },
    { label: 'Facturación', icon: FileText, href: APP_ROUTES.FACTURACION },
  ],

  // Menú para SuperAdmin
  SuperAdmin: [
    { label: 'Dashboard', icon: LayoutDashboard, href: APP_ROUTES.DASHBOARD },
    { label: 'Analytics', icon: BarChart3, href: APP_ROUTES.ANALYTICS },
    { label: 'Optimizar Reservas', icon: DollarSign, href: APP_ROUTES.OPTIMIZAR_RESERVAS },
    { label: 'Pagos', icon: CreditCard, href: APP_ROUTES.PAGOS },
    { label: 'Notificaciones', icon: Bell, href: APP_ROUTES.NOTIFICACIONES },
    { label: 'Chat', icon: MessageCircle, href: APP_ROUTES.CHAT },
    {
      label: 'Catálogo',
      icon: Package,
      href: APP_ROUTES.CATEGORIAS,
      submenu: [
        { label: 'Categorías', icon: Package, href: APP_ROUTES.CATEGORIAS },
        { label: 'Productos', icon: ShoppingCart, href: APP_ROUTES.PRODUCTOS },
      ],
    },
    { label: 'Clientes', icon: Users, href: APP_ROUTES.CLIENTES },
    { label: 'Reservas', icon: Calendar, href: APP_ROUTES.RESERVAS },
    {
      label: 'Inventario',
      icon: Warehouse,
      href: APP_ROUTES.ACTIVOS,
      submenu: [
        { label: 'Activos', icon: Warehouse, href: APP_ROUTES.ACTIVOS },
        { label: 'Disponibilidad', icon: Calendar, href: APP_ROUTES.DISPONIBILIDAD },
        { label: 'Bodegas', icon: FileBox, href: APP_ROUTES.BODEGAS },
        { label: 'Lotes', icon: TrendingUp, href: APP_ROUTES.LOTES },
      ],
    },
    { label: 'Mantenimientos', icon: Wrench, href: APP_ROUTES.MANTENIMIENTOS },
    { label: 'Alertas', icon: AlertOctagon, href: APP_ROUTES.ALERTAS },
    { label: 'Daños', icon: AlertOctagon, href: APP_ROUTES.DANIOS },
    { label: 'Usuarios', icon: UserCog, href: APP_ROUTES.USUARIOS },
    { label: 'Auditoría', icon: FileSearch, href: APP_ROUTES.AUDITORIA },
    { label: 'Configuración', icon: Settings, href: APP_ROUTES.CONFIGURACION },
  ],

  // Menú para Operario
  Operario: [
    { label: 'Dashboard', icon: LayoutDashboard, href: APP_ROUTES.DASHBOARD },
    { label: 'Tareas de Entrega', icon: Truck, href: APP_ROUTES.OPERARIO_ENTREGAS },
    { label: 'Tareas de Recogida', icon: RotateCcw, href: APP_ROUTES.OPERARIO_RECOGIDAS },
    { label: 'Escáner QR', icon: QrCode, href: APP_ROUTES.OPERARIO_SCANNER },
    { label: 'Reportar Daño', icon: AlertOctagon, href: APP_ROUTES.DANIOS },
    { label: 'Reportar Incidente', icon: AlertTriangle, href: APP_ROUTES.OPERARIO_INCIDENTES },
  ],
};
