import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [credentials, setCredentials] = useState({
    Username: '',
    Password: '',
  });

  const { mutate: login, isPending, error } = useLogin();
  const isRegistered = searchParams.get('registered') === 'true';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EventConnect</h1>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Success Message */}
        {isRegistered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">
              ¡Cuenta creada exitosamente! Por favor inicia sesión con tus credenciales.
            </p>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">
                  Error al iniciar sesión. Verifica tus credenciales.
                </p>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                required
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={credentials.Username}
                onChange={(e) => setCredentials({ ...credentials, Username: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={credentials.Password}
                onChange={(e) => setCredentials({ ...credentials, Password: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">¿Nuevo por aquí?</span>
            </div>
          </div>

          {/* Register Button */}
          <Link
            to="/registro"
            className="w-full block text-center bg-gray-100 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Crear Cuenta
          </Link>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2 text-sm">
            <p>
              <a href="#" className="text-blue-600 hover:underline">
                ¿Problemas con tu cuenta?
              </a>
            </p>
            <p className="text-gray-600">
              <a href="#" className="text-blue-600 hover:underline">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
