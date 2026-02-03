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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto min-h-[calc(100vh-4rem)] w-full grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Intro */}
        <div className="hidden lg:flex flex-col justify-center rounded-2xl bg-white/70 p-12 shadow-sm backdrop-blur">
          <div className="mb-6 flex items-center gap-2">
            <Logo textClassName="text-gray-900" iconClassName="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Crea tu cuenta en minutos</h1>
          <p className="mt-3 text-gray-600">
            Elige el tipo de registro que necesitas y completa la información. Podrás acceder de
            inmediato con tus credenciales.
          </p>
          <div className="mt-6 text-sm text-gray-600">
            Completa el formulario a la derecha para crear tu cuenta.
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8 lg:mx-0">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="flex justify-center lg:hidden">
              <Logo textClassName="text-gray-900" iconClassName="text-indigo-600" />
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">Crear cuenta</h2>
            <p className="text-sm text-gray-600">Completa los datos para empezar</p>
          </div>

          {/* Error General */}
          {apiError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                <span>{apiError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Registro */}
          <div>
            <label htmlFor="tipoRegistro" className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cómo quieres registrarte?
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className={`flex min-h-[96px] cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                formData.tipoRegistro === 'persona'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}>
                <input
                  type="radio"
                  name="tipoRegistro"
                  value="persona"
                  checked={formData.tipoRegistro === 'persona'}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">Persona</span>
                  <span className="block text-xs text-gray-600">Uso personal y clientes finales</span>
                </span>
              </label>

              <label className={`flex min-h-[96px] cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                formData.tipoRegistro === 'empresa'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}>
                <input
                  type="radio"
                  name="tipoRegistro"
                  value="empresa"
                  checked={formData.tipoRegistro === 'empresa'}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">Empresa</span>
                  <span className="block text-xs text-gray-600">Para proveedores y equipos</span>
                </span>
              </label>
            </div>
          </div>

          {/* Datos principales */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nombre_Completo" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="nombre_Completo"
                name="nombre_Completo"
                type="text"
                placeholder="Juan García"
                value={formData.nombre_Completo}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.nombre_Completo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombre_Completo && (
                <p className="mt-1 text-xs text-red-600">{errors.nombre_Completo}</p>
              )}
            </div>

            {formData.tipoRegistro === 'empresa' && (
              <div className="sm:col-span-2">
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
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.usuario ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.usuario && (
                  <p className="mt-1 text-xs text-red-600">{errors.usuario}</p>
                )}
              </div>
            )}

            <div className="sm:col-span-2">
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
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="sm:col-span-2">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Si ya tienes empresa creada, ingresa su ID.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="tipo_Cliente" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de cliente
                  </label>
                  <input
                    id="tipo_Cliente"
                    name="tipo_Cliente"
                    type="text"
                    placeholder="Persona"
                    value={formData.tipo_Cliente}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.documento ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.documento && (
                    <p className="mt-1 text-xs text-red-600">{errors.documento}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tipo_Documento" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de documento
                  </label>
                  <input
                    id="tipo_Documento"
                    name="tipo_Documento"
                    type="text"
                    placeholder="CC"
                    value={formData.tipo_Documento}
                    onChange={handleChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.tipo_Documento ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.tipo_Documento && (
                    <p className="mt-1 text-xs text-red-600">{errors.tipo_Documento}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
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
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.direccion ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.direccion && (
                    <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
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
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.ciudad ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.ciudad && (
                    <p className="mt-1 text-xs text-red-600">{errors.ciudad}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Términos */}
          <div className="flex items-start gap-2">
            <input
              id="aceptoTerminos"
              name="aceptoTerminos"
              type="checkbox"
              checked={formData.aceptoTerminos}
              onChange={handleChange}
              className="mt-1 h-4 w-4"
            />
            <label htmlFor="aceptoTerminos" className="text-sm text-gray-700">
              Acepto los{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                política de privacidad
              </a>
            </label>
          </div>
          {errors.aceptoTerminos && (
            <p className="text-xs text-red-600">{errors.aceptoTerminos}</p>
          )}

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="pt-4 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
