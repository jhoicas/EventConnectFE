import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { authService } from '@/features/auth/services/authService';

const ROLE_IDS = {
  empresa: Number(import.meta.env.VITE_ROLE_ID_ADMIN_PROVEEDOR ?? 2),
} as const;

interface RegisterFormData {
  usuario: string;
  nombre_Completo: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipoRegistro: 'persona' | 'empresa';
  aceptoTerminos: boolean;
  telefono: string;
  empresa_Id: string;
  tipo_Cliente: string;
  documento: string;
  tipo_Documento: string;
  direccion: string;
  ciudad: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    usuario: '',
    nombre_Completo: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoRegistro: 'persona',
    aceptoTerminos: false,
    telefono: '',
    empresa_Id: '',
    tipo_Cliente: 'Persona',
    documento: '',
    tipo_Documento: '',
    direccion: '',
    ciudad: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_Completo.trim()) {
      newErrors.nombre_Completo = 'El nombre es requerido';
    }

    if (formData.tipoRegistro === 'empresa' && !formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
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

    if (formData.tipoRegistro === 'persona') {
      if (!formData.documento.trim()) {
        newErrors.documento = 'El documento es requerido';
      }
      if (!formData.tipo_Documento.trim()) {
        newErrors.tipo_Documento = 'El tipo de documento es requerido';
      }
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es requerida';
      }
      if (!formData.ciudad.trim()) {
        newErrors.ciudad = 'La ciudad es requerida';
      }
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

    const empresaId = formData.empresa_Id.trim() ? Number(formData.empresa_Id) : null;

    try {
      if (formData.tipoRegistro === 'persona') {
        await authService.registerCliente({
          email: formData.email,
          password: formData.password,
          nombre_Completo: formData.nombre_Completo,
          telefono: formData.telefono.trim() || null,
          empresa_Id: empresaId,
          tipo_Cliente: formData.tipo_Cliente || 'Persona',
          documento: formData.documento.trim() || null,
          tipo_Documento: formData.tipo_Documento.trim() || null,
          direccion: formData.direccion.trim() || null,
          ciudad: formData.ciudad.trim() || null,
        });
      } else {
        await authService.register({
          usuario: formData.usuario.trim(),
          email: formData.email,
          password: formData.password,
          nombre_Completo: formData.nombre_Completo,
          telefono: formData.telefono.trim() || null,
          empresa_Id: empresaId,
          rol_Id: ROLE_IDS.empresa,
        });
      }

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

          {formData.tipoRegistro === 'empresa' && (
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="usuario.empresa"
                value={formData.usuario}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.usuario ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.usuario && (
                <p className="mt-1 text-sm text-red-600">{errors.usuario}</p>
              )}
            </div>
          )}

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

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="text"
              placeholder="3001234567"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
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

          {/* Campos por tipo */}
          {formData.tipoRegistro === 'empresa' ? (
            <div>
              <label htmlFor="empresa_Id" className="block text-sm font-medium text-gray-700 mb-1">
                Empresa ID (opcional)
              </label>
              <input
                id="empresa_Id"
                name="empresa_Id"
                type="number"
                placeholder="0"
                value={formData.empresa_Id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="tipo_Cliente" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cliente
                </label>
                <input
                  id="tipo_Cliente"
                  name="tipo_Cliente"
                  type="text"
                  placeholder="Persona"
                  value={formData.tipo_Cliente}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento
                </label>
                <input
                  id="documento"
                  name="documento"
                  type="text"
                  placeholder="1020304050"
                  value={formData.documento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.documento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.documento && (
                  <p className="mt-1 text-sm text-red-600">{errors.documento}</p>
                )}
              </div>

              <div>
                <label htmlFor="tipo_Documento" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <input
                  id="tipo_Documento"
                  name="tipo_Documento"
                  type="text"
                  placeholder="CC"
                  value={formData.tipo_Documento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tipo_Documento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.tipo_Documento && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo_Documento}</p>
                )}
              </div>

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  placeholder="Calle 123 #45-67"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.direccion && (
                  <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                )}
              </div>

              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  id="ciudad"
                  name="ciudad"
                  type="text"
                  placeholder="Bogotá"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ciudad ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ciudad && (
                  <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
                )}
              </div>
            </div>
          )}

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
