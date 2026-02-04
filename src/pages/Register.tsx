import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building2, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authService } from '@/features/auth/services/authService';
import { Logo } from '@/components/Logo';

// Schema de validación para Empresa
const empresaSchema = z.object({
  usuario: z.string().min(3, 'Usuario debe tener al menos 3 caracteres'),
  nombre_Completo: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  email: z.string().email('El email no es válido'),
  telefono: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Schema de validación para Cliente
const clienteSchema = z.object({
  nombre_Completo: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  email: z.string().email('El email no es válido'),
  telefono: z.string().optional(),
  tipoDoc: z.string().min(1, 'Selecciona un tipo de documento'),
  numeroDoc: z.string().min(5, 'El número de documento es requerido'),
  direccion: z.string().min(5, 'La dirección es requerida'),
  ciudad: z.string().min(2, 'La ciudad es requerida'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type EmpresaFormData = z.infer<typeof empresaSchema>;
type ClienteFormData = z.infer<typeof clienteSchema>;

type UserType = 'empresa' | 'persona';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('empresa');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form para Empresa
  const empresaForm = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      usuario: '',
      nombre_Completo: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Form para Cliente
  const clienteForm = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre_Completo: '',
      email: '',
      telefono: '',
      tipoDoc: 'CC',
      numeroDoc: '',
      direccion: '',
      ciudad: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitEmpresa = async (data: EmpresaFormData) => {
    setIsLoading(true);
    setApiError('');

    try {
      await authService.registerEmpresa({
        usuario: data.usuario,
        email: data.email,
        password: data.password,
        nombre_Completo: data.nombre_Completo,
        telefono: data.telefono || null,
        empresa_Id: 0,
        rol_Id: 0,
      });
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Error al registrar empresa. Intenta de nuevo.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCliente = async (data: ClienteFormData) => {
    setIsLoading(true);
    setApiError('');

    try {
      await authService.registerCliente({
        email: data.email,
        password: data.password,
        nombre_Completo: data.nombre_Completo,
        telefono: data.telefono || null,
        documento: data.numeroDoc,
        tipo_Documento: data.tipoDoc,
        direccion: data.direccion,
        ciudad: data.ciudad,
        empresa_Id: 0,
        tipo_Cliente: 'Natural',
      });
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Error al registrar cliente. Intenta de nuevo.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setApiError('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {isSubmitted ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Registro Exitoso!</h2>
          <p className="text-gray-600">Tu cuenta ha sido creada correctamente. Redirigiendo...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo 
              iconClassName="text-indigo-600" 
              textClassName="text-gray-800"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Crear Cuenta
          </h1>

          {/* Toggle de tipo de usuario */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => handleUserTypeChange('empresa')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all font-medium ${
                userType === 'empresa'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Empresa</span>
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange('persona')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all font-medium ${
                userType === 'persona'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Persona</span>
            </button>
          </div>

          {/* Error API */}
          {apiError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
          )}

          {userType === 'empresa' ? (
            <form onSubmit={empresaForm.handleSubmit(onSubmitEmpresa)} className="space-y-4">
              {/* Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="nombre_usuario"
                  {...empresaForm.register('usuario')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    empresaForm.formState.errors.usuario ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {empresaForm.formState.errors.usuario && (
                  <p className="text-red-500 text-sm mt-1">{empresaForm.formState.errors.usuario.message}</p>
                )}
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  {...empresaForm.register('nombre_Completo')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    empresaForm.formState.errors.nombre_Completo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {empresaForm.formState.errors.nombre_Completo && (
                  <p className="text-red-500 text-sm mt-1">{empresaForm.formState.errors.nombre_Completo.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...empresaForm.register('email')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    empresaForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {empresaForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{empresaForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-gray-400">(Opcional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+57 318 456 1234"
                  {...empresaForm.register('telefono')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...empresaForm.register('password')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-10 ${
                      empresaForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {empresaForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{empresaForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...empresaForm.register('confirmPassword')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-10 ${
                      empresaForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {empresaForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{empresaForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={clienteForm.handleSubmit(onSubmitCliente)} className="space-y-4">
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  {...clienteForm.register('nombre_Completo')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    clienteForm.formState.errors.nombre_Completo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {clienteForm.formState.errors.nombre_Completo && (
                  <p className="text-red-500 text-sm mt-1">{clienteForm.formState.errors.nombre_Completo.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...clienteForm.register('email')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    clienteForm.formState.errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {clienteForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{clienteForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-gray-400">(Opcional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+57 318 456 1234"
                  {...clienteForm.register('telefono')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Tipo de Documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento <span className="text-red-500">*</span>
                </label>
                <select
                  {...clienteForm.register('tipoDoc')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                >
                  <option value="CC">CC</option>
                  <option value="TI">TI</option>
                  <option value="CE">CE</option>
                  <option value="PA">PA</option>
                </select>
              </div>

              {/* Número de Documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  {...clienteForm.register('numeroDoc')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    clienteForm.formState.errors.numeroDoc ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {clienteForm.formState.errors.numeroDoc && (
                  <p className="text-red-500 text-sm mt-1">{clienteForm.formState.errors.numeroDoc.message}</p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Calle Principal, 123"
                  {...clienteForm.register('direccion')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    clienteForm.formState.errors.direccion ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {clienteForm.formState.errors.direccion && (
                  <p className="text-red-500 text-sm mt-1">{clienteForm.formState.errors.direccion.message}</p>
                )}
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Bogotá"
                  {...clienteForm.register('ciudad')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    clienteForm.formState.errors.ciudad ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {clienteForm.formState.errors.ciudad && (
                  <p className="text-red-500 text-sm mt-1">{clienteForm.formState.errors.ciudad.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...clienteForm.register('password')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-10 ${
                      clienteForm.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {clienteForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{clienteForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...clienteForm.register('confirmPassword')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition pr-10 ${
                      clienteForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {clienteForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{clienteForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
