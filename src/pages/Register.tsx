import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building2, User, Sparkles } from 'lucide-react';
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

// Schema de validación para Empresa
const empresaSchema = z.object({
  usuario: z.string().min(3, 'Usuario debe tener al menos 3 caracteres'),
  nombre_Completo: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Schema de validación para Cliente
const clienteSchema = z.object({
  nombre_Completo: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  tipo_Documento: z.string().min(1, 'Selecciona un tipo de documento'),
  documento: z.string().min(5, 'Documento debe tener al menos 5 caracteres'),
  direccion: z.string().min(5, 'Dirección debe tener al menos 5 caracteres'),
  ciudad: z.string().min(2, 'Ciudad debe tener al menos 2 caracteres'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type EmpresaFormData = z.infer<typeof empresaSchema>;
type ClienteFormData = z.infer<typeof clienteSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'empresa' | 'cliente'>('cliente');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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
      tipo_Documento: '',
      documento: '',
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
      navigate('/login?registered=true');
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
        documento: data.documento,
        tipo_Documento: data.tipo_Documento,
        direccion: data.direccion,
        ciudad: data.ciudad,
        empresa_Id: 0,
        tipo_Cliente: 'Natural',
      });
      navigate('/login?registered=true');
    } catch (error: any) {
      const message = error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Error al registrar cliente. Intenta de nuevo.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Columna Izquierda - Decorativa (Hidden en móvil) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden min-h-screen">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        {/* Contenido */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="max-w-md text-center space-y-6">
            <div className="flex justify-center mb-8">
              <Sparkles className="w-16 h-16 text-blue-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              EventConnect
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Conecta eventos, gestiona experiencias inolvidables y haz crecer tu negocio con la plataforma líder.
            </p>
            <div className="pt-8 space-y-3 text-sm text-slate-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Gestión integral de eventos</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Proveedores verificados</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span>Reservas en tiempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white min-h-screen overflow-y-auto">
        <div className="">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Crear Cuenta</h2>
            <p className="mt-2 text-sm text-slate-600">
              Únete a EventConnect y comienza hoy
            </p>
          </div>

          {/* Error API */}
          {apiError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'empresa' | 'cliente')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cliente" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Soy Cliente
              </TabsTrigger>
              <TabsTrigger value="empresa" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Soy Empresa
              </TabsTrigger>
            </TabsList>

            {/* Tab Content: Cliente */}
            <TabsContent value="cliente" className="mt-6">
              <form onSubmit={clienteForm.handleSubmit(onSubmitCliente)} className="space-y-4">
                {/* Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-nombre">Nombre Completo</Label>
                  <Input
                    id="cliente-nombre"
                    placeholder="Juan García López"
                    {...clienteForm.register('nombre_Completo')}
                  />
                  {clienteForm.formState.errors.nombre_Completo && (
                    <p className="text-xs text-red-600">{clienteForm.formState.errors.nombre_Completo.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-email">Email</Label>
                  <Input
                    id="cliente-email"
                    type="email"
                    placeholder="tu@email.com"
                    {...clienteForm.register('email')}
                  />
                  {clienteForm.formState.errors.email && (
                    <p className="text-xs text-red-600">{clienteForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-telefono">Teléfono (Opcional)</Label>
                  <Input
                    id="cliente-telefono"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    {...clienteForm.register('telefono')}
                  />
                </div>

                {/* Documento */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-2">
                    <Label htmlFor="cliente-tipo-doc">Tipo Doc.</Label>
                    <Select onValueChange={(value) => clienteForm.setValue('tipo_Documento', value)}>
                      <SelectTrigger id="cliente-tipo-doc">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">CC</SelectItem>
                        <SelectItem value="TI">TI</SelectItem>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                      </SelectContent>
                    </Select>
                    {clienteForm.formState.errors.tipo_Documento && (
                      <p className="text-xs text-red-600">{clienteForm.formState.errors.tipo_Documento.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="cliente-documento">Número</Label>
                    <Input
                      id="cliente-documento"
                      placeholder="1234567890"
                      {...clienteForm.register('documento')}
                    />
                    {clienteForm.formState.errors.documento && (
                      <p className="text-xs text-red-600">{clienteForm.formState.errors.documento.message}</p>
                    )}
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-direccion">Dirección</Label>
                  <Input
                    id="cliente-direccion"
                    placeholder="Calle 123 #45-67"
                    {...clienteForm.register('direccion')}
                  />
                  {clienteForm.formState.errors.direccion && (
                    <p className="text-xs text-red-600">{clienteForm.formState.errors.direccion.message}</p>
                  )}
                </div>

                {/* Ciudad */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-ciudad">Ciudad</Label>
                  <Input
                    id="cliente-ciudad"
                    placeholder="Bogotá"
                    {...clienteForm.register('ciudad')}
                  />
                  {clienteForm.formState.errors.ciudad && (
                    <p className="text-xs text-red-600">{clienteForm.formState.errors.ciudad.message}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-password">Contraseña</Label>
                  <Input
                    id="cliente-password"
                    type="password"
                    placeholder="••••••••"
                    {...clienteForm.register('password')}
                  />
                  {clienteForm.formState.errors.password && (
                    <p className="text-xs text-red-600">{clienteForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="cliente-confirm">Confirmar Contraseña</Label>
                  <Input
                    id="cliente-confirm"
                    type="password"
                    placeholder="••••••••"
                    {...clienteForm.register('confirmPassword')}
                  />
                  {clienteForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-600">{clienteForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Tab Content: Empresa */}
            <TabsContent value="empresa" className="mt-6">
              <form onSubmit={empresaForm.handleSubmit(onSubmitEmpresa)} className="space-y-4">
                {/* Usuario */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-usuario">Usuario</Label>
                  <Input
                    id="empresa-usuario"
                    placeholder="admin.empresa"
                    {...empresaForm.register('usuario')}
                  />
                  {empresaForm.formState.errors.usuario && (
                    <p className="text-xs text-red-600">{empresaForm.formState.errors.usuario.message}</p>
                  )}
                </div>

                {/* Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-nombre">Nombre Completo</Label>
                  <Input
                    id="empresa-nombre"
                    placeholder="Juan García López"
                    {...empresaForm.register('nombre_Completo')}
                  />
                  {empresaForm.formState.errors.nombre_Completo && (
                    <p className="text-xs text-red-600">{empresaForm.formState.errors.nombre_Completo.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-email">Email</Label>
                  <Input
                    id="empresa-email"
                    type="email"
                    placeholder="admin@empresa.com"
                    {...empresaForm.register('email')}
                  />
                  {empresaForm.formState.errors.email && (
                    <p className="text-xs text-red-600">{empresaForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-telefono">Teléfono (Opcional)</Label>
                  <Input
                    id="empresa-telefono"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    {...empresaForm.register('telefono')}
                  />
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-password">Contraseña</Label>
                  <Input
                    id="empresa-password"
                    type="password"
                    placeholder="••••••••"
                    {...empresaForm.register('password')}
                  />
                  {empresaForm.formState.errors.password && (
                    <p className="text-xs text-red-600">{empresaForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="empresa-confirm">Confirmar Contraseña</Label>
                  <Input
                    id="empresa-confirm"
                    type="password"
                    placeholder="••••••••"
                    {...empresaForm.register('confirmPassword')}
                  />
                  {empresaForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-600">{empresaForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
          <div className="text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
