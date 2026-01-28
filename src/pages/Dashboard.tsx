import { useAuthStore } from '@/store/authStore';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Bienvenido, {user?.nombre_Completo || 'Usuario'}
        </h2>
        <p className="text-gray-600">
          Rol: <span className="font-medium">{user?.rol}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Email: <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      {/* Agregar widgets de estadísticas aquí */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900">Total Productos</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900">Reservas Activas</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900">Clientes</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
