import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { authService } from '@/features/auth/services/authService';

const ROLE_IDS = {
  persona: Number(import.meta.env.VITE_ROLE_ID_CLIENTE ?? 4),
  empresa: Number(import.meta.env.VITE_ROLE_ID_ADMIN_PROVEEDOR ?? 2),
} as const;

interface RegisterFormData {
  nombre_Completo: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipoRegistro: 'persona' | 'empresa';
  aceptoTerminos: boolean;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre_Completo: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoRegistro: 'persona',
    aceptoTerminos: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_Completo.trim()) {
      newErrors.nombre_Completo = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.aceptoTerminos) {
      newErrors.aceptoTerminos = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        usuario: formData.email,
        email: formData.email,
        password: formData.password,
        nombre_Completo: formData.nombre_Completo,
        rol_Id: ROLE_IDS[formData.tipoRegistro],
      });

      navigate('/login?registered=true');
    } catch (error: any) {
      const message = error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Error al registrarse. Por favor intenta de nuevo.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Limpiar error del campo cuando empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Logo 
              textClassName="text-gray-900"
              iconClassName="text-indigo-600"
            />
          </div>
          <p className="text-gray-600 mt-2">Crear Cuenta</p>
        </div>

        {/* Error General */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo de Registro */}
          <div>
            <label htmlFor="tipoRegistro" className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cómo quieres registrarte?
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: formData.tipoRegistro === 'persona' ? '#2563eb' : '#e5e7eb',
                  backgroundColor: formData.tipoRegistro === 'persona' ? '#eff6ff' : 'transparent',
                }}>
                <input
                  type="radio"
                  name="tipoRegistro"
                  value="persona"
                  checked={formData.tipoRegistro === 'persona'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Persona</span>
                  <span className="block text-xs text-gray-500">Para usuarios individuales</span>
                </span>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: formData.tipoRegistro === 'empresa' ? '#2563eb' : '#e5e7eb',
                  backgroundColor: formData.tipoRegistro === 'empresa' ? '#eff6ff' : 'transparent',
                }}>
                <input
                  type="radio"
                  name="tipoRegistro"
                  value="empresa"
                  checked={formData.tipoRegistro === 'empresa'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Empresa</span>
                  <span className="block text-xs text-gray-500">Para negocios de eventos y alquiler</span>
                </span>
              </label>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre_Completo" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              id="nombre_Completo"
              name="nombre_Completo"
              type="text"
              placeholder="Juan García"
              value={formData.nombre_Completo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombre_Completo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nombre_Completo && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre_Completo}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Términos */}
          <div className="flex items-start">
            <input
              id="aceptoTerminos"
              name="aceptoTerminos"
              type="checkbox"
              checked={formData.aceptoTerminos}
              onChange={handleChange}
              className="w-4 h-4 mt-1"
            />
            <label htmlFor="aceptoTerminos" className="ml-2 block text-sm text-gray-700">
              Acepto los{' '}
              <a href="#" className="text-blue-600 hover:underline">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="#" className="text-blue-600 hover:underline">
                política de privacidad
              </a>
            </label>
          </div>
          {errors.aceptoTerminos && (
            <p className="text-sm text-red-600">{errors.aceptoTerminos}</p>
          )}

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
