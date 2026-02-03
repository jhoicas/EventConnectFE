import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader, ArrowRight } from 'lucide-react';
import { authService } from '@/features/auth/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClienteFormData {
  nombre_Completo: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  documento: string;
  tipo_Documento: string;
  direccion: string;
  ciudad: string;
}

interface EmpresaFormData {
  usuario: string;
  nombre_Completo: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cliente');
  
  // Cliente form state
  const [clienteData, setClienteData] = useState<ClienteFormData>({
    nombre_Completo: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    documento: '',
    tipo_Documento: '',
    direccion: '',
    ciudad: '',
  });

  // Empresa form state
  const [empresaData, setEmpresaData] = useState<EmpresaFormData>({
    usuario: '',
    nombre_Completo: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateClienteForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clienteData.nombre_Completo.trim()) {
      newErrors.nombre_Completo = 'El nombre es requerido';
    }

    if (!clienteData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!clienteData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (clienteData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (clienteData.password !== clienteData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!clienteData.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
    }

    if (!clienteData.tipo_Documento) {
      newErrors.tipo_Documento = 'Selecciona un tipo de documento';
    }

    if (!clienteData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!clienteData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmpresaForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!empresaData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    }

    if (!empresaData.nombre_Completo.trim()) {
      newErrors.nombre_Completo = 'El nombre es requerido';
    }

    if (!empresaData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresaData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!empresaData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (empresaData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (empresaData.password !== empresaData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (activeTab === 'cliente') {
      if (!validateClienteForm()) return;
    } else {
      if (!validateEmpresaForm()) return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'cliente') {
        await authService.registerCliente({
          email: clienteData.email,
          password: clienteData.password,
          nombre_Completo: clienteData.nombre_Completo,
          telefono: clienteData.telefono.trim() || null,
          documento: clienteData.documento.trim() || null,
          tipo_Documento: clienteData.tipo_Documento || null,
          direccion: clienteData.direccion.trim() || null,
          ciudad: clienteData.ciudad.trim() || null,
          empresa_Id: null,
          tipo_Cliente: 'Persona',
        });
      } else {
        // Role ID for company admin (from env or default to 2)
        const roleId = Number(import.meta.env.VITE_ROLE_ID_ADMIN_PROVEEDOR ?? 2);
        
        await authService.register({
          usuario: empresaData.usuario.trim(),
          email: empresaData.email,
          password: empresaData.password,
          nombre_Completo: empresaData.nombre_Completo,
          telefono: empresaData.telefono.trim() || null,
          empresa_Id: null,
          rol_Id: roleId,
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

  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClienteData({ ...clienteData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresaData({ ...empresaData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel - Decorative (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          <h1 className="text-5xl font-bold mb-6">EventConnect</h1>
          <p className="text-xl text-blue-100 mb-8">
            Conecta eventos, crea experiencias y gestiona tu negocio con elegancia.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-100">
            <span>Comienza ahora</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-12">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
            <p className="text-gray-600">Únete a EventConnect hoy mismo</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {apiError}
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="cliente" className="text-sm">
                Soy Cliente
              </TabsTrigger>
              <TabsTrigger value="empresa" className="text-sm">
                Soy Empresa
              </TabsTrigger>
            </TabsList>

            {/* Cliente Tab */}
            <TabsContent value="cliente" className="space-y-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-nombre" className="text-sm font-medium text-gray-700">
                    Nombre Completo
                  </Label>
                  <Input
                    id="cliente-nombre"
                    name="nombre_Completo"
                    type="text"
                    placeholder="Juan García López"
                    value={clienteData.nombre_Completo}
                    onChange={handleClienteChange}
                    className={errors.nombre_Completo ? 'border-red-500' : ''}
                  />
                  {errors.nombre_Completo && (
                    <p className="text-xs text-red-600">{errors.nombre_Completo}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="cliente-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={clienteData.email}
                    onChange={handleClienteChange}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-phone" className="text-sm font-medium text-gray-700">
                    Teléfono (Opcional)
                  </Label>
                  <Input
                    id="cliente-phone"
                    name="telefono"
                    type="tel"
                    placeholder="3001234567"
                    value={clienteData.telefono}
                    onChange={handleClienteChange}
                  />
                </div>

                {/* Documento */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-2">
                    <Label htmlFor="cliente-tipo-doc" className="text-sm font-medium text-gray-700">
                      Tipo Doc.
                    </Label>
                    <Select value={clienteData.tipo_Documento} onValueChange={(value) => {
                      setClienteData({ ...clienteData, tipo_Documento: value });
                      if (errors.tipo_Documento) {
                        setErrors({ ...errors, tipo_Documento: '' });
                      }
                    }}>
                      <SelectTrigger id="cliente-tipo-doc" className={errors.tipo_Documento ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">CC</SelectItem>
                        <SelectItem value="TI">TI</SelectItem>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tipo_Documento && (
                      <p className="text-xs text-red-600">{errors.tipo_Documento}</p>
                    )}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="cliente-documento" className="text-sm font-medium text-gray-700">
                      Número
                    </Label>
                    <Input
                      id="cliente-documento"
                      name="documento"
                      type="text"
                      placeholder="1234567890"
                      value={clienteData.documento}
                      onChange={handleClienteChange}
                      className={errors.documento ? 'border-red-500' : ''}
                    />
                    {errors.documento && (
                      <p className="text-xs text-red-600">{errors.documento}</p>
                    )}
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-direccion" className="text-sm font-medium text-gray-700">
                    Dirección
                  </Label>
                  <Input
                    id="cliente-direccion"
                    name="direccion"
                    type="text"
                    placeholder="Calle 123 #45-67"
                    value={clienteData.direccion}
                    onChange={handleClienteChange}
                    className={errors.direccion ? 'border-red-500' : ''}
                  />
                  {errors.direccion && (
                    <p className="text-xs text-red-600">{errors.direccion}</p>
                  )}
                </div>

                {/* Ciudad */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-ciudad" className="text-sm font-medium text-gray-700">
                    Ciudad
                  </Label>
                  <Input
                    id="cliente-ciudad"
                    name="ciudad"
                    type="text"
                    placeholder="Bogotá"
                    value={clienteData.ciudad}
                    onChange={handleClienteChange}
                    className={errors.ciudad ? 'border-red-500' : ''}
                  />
                  {errors.ciudad && (
                    <p className="text-xs text-red-600">{errors.ciudad}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </Label>
                  <Input
                    id="cliente-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={clienteData.password}
                    onChange={handleClienteChange}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-confirm-password" className="text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="cliente-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={clienteData.confirmPassword}
                    onChange={handleClienteChange}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Empresa Tab */}
            <TabsContent value="empresa" className="space-y-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Usuario */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-usuario" className="text-sm font-medium text-gray-700">
                    Usuario (username)
                  </Label>
                  <Input
                    id="empresa-usuario"
                    name="usuario"
                    type="text"
                    placeholder="usuario.empresa"
                    value={empresaData.usuario}
                    onChange={handleEmpresaChange}
                    className={errors.usuario ? 'border-red-500' : ''}
                  />
                  {errors.usuario && (
                    <p className="text-xs text-red-600">{errors.usuario}</p>
                  )}
                </div>

                {/* Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-nombre" className="text-sm font-medium text-gray-700">
                    Nombre Completo
                  </Label>
                  <Input
                    id="empresa-nombre"
                    name="nombre_Completo"
                    type="text"
                    placeholder="Juan García López"
                    value={empresaData.nombre_Completo}
                    onChange={handleEmpresaChange}
                    className={errors.nombre_Completo ? 'border-red-500' : ''}
                  />
                  {errors.nombre_Completo && (
                    <p className="text-xs text-red-600">{errors.nombre_Completo}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="empresa-email"
                    name="email"
                    type="email"
                    placeholder="tu@empresa.com"
                    value={empresaData.email}
                    onChange={handleEmpresaChange}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-phone" className="text-sm font-medium text-gray-700">
                    Teléfono (Opcional)
                  </Label>
                  <Input
                    id="empresa-phone"
                    name="telefono"
                    type="tel"
                    placeholder="3001234567"
                    value={empresaData.telefono}
                    onChange={handleEmpresaChange}
                  />
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </Label>
                  <Input
                    id="empresa-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={empresaData.password}
                    onChange={handleEmpresaChange}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-confirm-password" className="text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="empresa-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={empresaData.confirmPassword}
                    onChange={handleEmpresaChange}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
