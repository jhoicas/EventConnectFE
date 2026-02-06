import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/lib/routes';
import type { UserRole } from '@/types';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import LandingPage from '@/pages/Landing';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import DashboardPage from '@/pages/Dashboard';
import NotFoundPage from '@/pages/NotFound';
import ActivosPage from '@/pages/Activos';
import BodegasPage from '@/pages/Bodegas';
import LotesPage from '@/pages/Lotes';
import ProductosPage from '@/pages/Productos';
import DisponibilidadPage from '@/pages/Disponibilidad';
import AnalyticsPage from '@/pages/Analytics';
import OptimizarReservasPage from '@/pages/OptimizarReservas';
import PagosPage from '@/pages/Pagos';
import NotificacionesPage from '@/pages/Notificaciones';
import ReseniasPage from '@/pages/Resenas';
import { DocumentacionPage } from '@/pages/Documentacion';
// Used in route configuration below

// Placeholder pages (to be migrated)
import CategoriasPage from '@/pages/Categorias';
import ReservasPage from '@/pages/Reservas';
import ClientesPage from '@/pages/Clientes';

// Cliente Pages
import ClienteMensajesPage from '@/pages/cliente/Mensajes';
import ClienteExplorarPage from '@/pages/cliente/Explorar';
import ClienteCotizacionesPage from '@/pages/cliente/Cotizaciones';
import ClienteReservasPage from '@/pages/cliente/Reservas';
import ClientePerfilPage from '@/pages/cliente/Perfil';

// Admin Pages
import MantenimientosPage from '@/pages/Mantenimientos';
import UsuariosPage from '@/pages/Usuarios';
import ConfiguracionPage from '@/pages/Configuracion';
import FacturacionPage from '@/pages/Facturacion';
import ChatPage from '@/pages/Chat';
import AuditoriaPage from '@/pages/Auditoria';
import { IntegracionesPage } from '@/pages/Integraciones';
import { ReportesPage } from '@/pages/Reportes';
import { SistemaPuntosPage } from '@/pages/SistemaPuntos';
import { BusinessIntelligencePage } from '@/pages/BusinessIntelligence';
import { PredictiveAnalyticsPage } from '@/pages/PredictiveAnalytics';
import { DataStreamingPage } from '@/pages/DataStreaming';
import { ReportBuilderPage } from '@/pages/ReportBuilder';
import { DataQualityPage } from '@/pages/DataQuality';
import DaniosPage from '@/pages/Danios';
import AlertasPage from '@/pages/Alertas';
import ClientePortalPage from '@/pages/ClientePortal';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to={APP_ROUTES.LOGIN} replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to={APP_ROUTES.DASHBOARD} replace />;
};

const RoleProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) => {
  const user = useAuthStore((state) => state.user);
  const hasAccess = !!user?.rol && roles.includes(user.rol as UserRole);
  return hasAccess ? <>{children}</> : <Navigate to={APP_ROUTES.DASHBOARD} replace />;
};

export const AppRouter = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect - to landing or dashboard */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to={APP_ROUTES.DASHBOARD} replace /> 
              : <Navigate to="/inicio" replace />
          } 
        />

        {/* Landing Page */}
        <Route 
          path="/inicio" 
          element={
            isAuthenticated 
              ? <Navigate to={APP_ROUTES.DASHBOARD} replace /> 
              : <LandingPage />
          } 
        />

        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path={APP_ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path={APP_ROUTES.REGISTER}
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={APP_ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={APP_ROUTES.OPTIMIZAR_RESERVAS} element={<OptimizarReservasPage />} />
          <Route path={APP_ROUTES.PAGOS} element={<PagosPage />} />
          <Route path={APP_ROUTES.NOTIFICACIONES} element={<NotificacionesPage />} />
          <Route path={APP_ROUTES.RESENAS} element={<ReseniasPage />} />
          <Route path={APP_ROUTES.DOCUMENTACION} element={<DocumentacionPage />} />
          
          {/* Productos y Categorías */}
          <Route path={APP_ROUTES.PRODUCTOS} element={<ProductosPage />} />
          <Route path={APP_ROUTES.CATEGORIAS} element={<CategoriasPage />} />
          
          {/* Reservas */}
          <Route path={APP_ROUTES.RESERVAS} element={<ReservasPage />} />
          
          {/* Clientes */}
          <Route path={APP_ROUTES.CLIENTES} element={<ClientesPage />} />
          
          {/* Activos y Bodegas */}
          <Route path={APP_ROUTES.ACTIVOS} element={<ActivosPage />} />
          <Route path={APP_ROUTES.BODEGAS} element={<BodegasPage />} />
          <Route path={APP_ROUTES.LOTES} element={<LotesPage />} />
          <Route path={APP_ROUTES.DISPONIBILIDAD} element={<DisponibilidadPage />} />
          
          {/* Rutas de Cliente */}
          <Route path={APP_ROUTES.CLIENTE_MENSAJES} element={<ClienteMensajesPage />} />
          <Route path={APP_ROUTES.CLIENTE_EXPLORAR} element={<ClienteExplorarPage />} />
          <Route path={APP_ROUTES.CLIENTE_COTIZACIONES} element={<ClienteCotizacionesPage />} />
          <Route path={APP_ROUTES.CLIENTE_RESERVAS} element={<ClienteReservasPage />} />
          <Route path={APP_ROUTES.CLIENTE_PERFIL} element={<ClientePerfilPage />} />
          <Route
            path={APP_ROUTES.CLIENTE_PORTAL}
            element={
              <RoleProtectedRoute roles={['Cliente', 'Usuario']}>
                <ClientePortalPage />
              </RoleProtectedRoute>
            }
          />
          
          {/* Rutas de Administración */}
          <Route path={APP_ROUTES.MANTENIMIENTOS} element={<MantenimientosPage />} />
          <Route
            path={APP_ROUTES.USUARIOS}
            element={
              <RoleProtectedRoute roles={['SuperAdmin']}>
                <UsuariosPage />
              </RoleProtectedRoute>
            }
          />
          <Route path={APP_ROUTES.CONFIGURACION} element={<ConfiguracionPage />} />
          <Route path={APP_ROUTES.FACTURACION} element={<FacturacionPage />} />
          <Route path={APP_ROUTES.CHAT} element={<ChatPage />} />
          <Route
            path={APP_ROUTES.AUDITORIA}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <AuditoriaPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.INTEGRACIONES}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <IntegracionesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.REPORTES}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <ReportesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.SISTEMA_PUNTOS}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <SistemaPuntosPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.BUSINESS_INTELLIGENCE}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <BusinessIntelligencePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.PREDICTIVE_ANALYTICS}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <PredictiveAnalyticsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.DATA_STREAMING}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <DataStreamingPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.REPORT_BUILDER}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <ReportBuilderPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.DATA_QUALITY}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <DataQualityPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.DANIOS}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor', 'Operario']}>
                <DaniosPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={APP_ROUTES.ALERTAS}
            element={
              <RoleProtectedRoute roles={['SuperAdmin', 'Admin-Proveedor']}>
                <AlertasPage />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
