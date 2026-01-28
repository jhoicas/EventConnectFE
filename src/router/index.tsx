import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { APP_ROUTES } from '@/lib/routes';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import NotFoundPage from '@/pages/NotFound';
import ActivosPage from '@/pages/Activos';
import BodegasPage from '@/pages/Bodegas';
import LotesPage from '@/pages/Lotes';
import ProductosPage from '@/pages/Productos';

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

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="/" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
          
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
          
          {/* Rutas de Cliente */}
          <Route path={APP_ROUTES.CLIENTE_MENSAJES} element={<ClienteMensajesPage />} />
          <Route path={APP_ROUTES.CLIENTE_EXPLORAR} element={<ClienteExplorarPage />} />
          <Route path={APP_ROUTES.CLIENTE_COTIZACIONES} element={<ClienteCotizacionesPage />} />
          <Route path={APP_ROUTES.CLIENTE_RESERVAS} element={<ClienteReservasPage />} />
          <Route path={APP_ROUTES.CLIENTE_PERFIL} element={<ClientePerfilPage />} />
          
          {/* Rutas de Administración */}
          <Route path={APP_ROUTES.MANTENIMIENTOS} element={<MantenimientosPage />} />
          <Route path={APP_ROUTES.USUARIOS} element={<UsuariosPage />} />
          <Route path={APP_ROUTES.CONFIGURACION} element={<ConfiguracionPage />} />
          <Route path={APP_ROUTES.FACTURACION} element={<FacturacionPage />} />
          <Route path={APP_ROUTES.CHAT} element={<ChatPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
