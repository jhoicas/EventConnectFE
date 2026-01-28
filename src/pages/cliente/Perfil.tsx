import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Save, User as UserIcon, Lock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventconnect-api-8oih6.ondigitalocean.app/api';

// Galería de avatares predeterminados
const getDefaultAvatars = (userName: string = 'User') => ({
  profesional: [
    `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=6366f1`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=8b5cf6`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=ec4899`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=f59e0b`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=10b981`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=06b6d4`,
  ],
  hombres: [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=d1d4f9",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=ffd5dc",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c7dbd4",
  ],
  mujeres: [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=d1d4f9",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=ffd5dc",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily&backgroundColor=c7dbd4",
  ],
  animales: [
    "https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Whiskers&backgroundColor=d1d4f9",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Fluffy&backgroundColor=ffd5dc",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Buddy&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Lucky&backgroundColor=c7dbd4",
  ],
});

const ClientePerfilPage = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.setUser);
  const DEFAULT_AVATARS = getDefaultAvatars(user?.nombre_Completo || 'User');
  
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_URL || DEFAULT_AVATARS.profesional[0]);
  const [customImage, setCustomImage] = useState('');
  const [formData, setFormData] = useState({
    nombre_Completo: user?.nombre_Completo || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    if (!formData.nombre_Completo?.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const avatarURL = customImage || selectedAvatar;

      const response = await fetch(`${API_BASE_URL}/Usuario/${user?.id}/perfil`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre_Completo: formData.nombre_Completo.trim(),
          Telefono: formData.telefono?.trim() || '',
          Avatar_URL: avatarURL,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      await response.json();
      
      // Actualizar el usuario en el store
      updateUser({
        ...user!,
        nombre_Completo: formData.nombre_Completo.trim(),
        telefono: formData.telefono?.trim() || '',
        avatar_URL: avatarURL,
      });

      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Todos los campos de contraseña son obligatorios');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/Usuario/${user?.id}/cambiar-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Password_Actual: passwordData.currentPassword,
          Password_Nueva: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al cambiar la contraseña');
      }

      // Limpiar formulario
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      alert('Contraseña cambiada exitosamente');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Administra tu información personal y avatar
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Avatar Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>Vista previa de tu foto de perfil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={customImage || selectedAvatar} alt={user?.nombre_Completo} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {user?.nombre_Completo ? getInitials(user.nombre_Completo) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-medium">{formData.nombre_Completo}</p>
              <p className="text-sm text-muted-foreground">{user?.rol}</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <Tabs defaultValue="info" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Información
                </TabsTrigger>
                <TabsTrigger value="avatar">
                  <Camera className="mr-2 h-4 w-4" />
                  Avatar
                </TabsTrigger>
                <TabsTrigger value="password">
                  <Lock className="mr-2 h-4 w-4" />
                  Contraseña
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="info" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre_Completo}
                      onChange={(e) => setFormData({ ...formData, nombre_Completo: e.target.value })}
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      El email no se puede modificar
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="Tu número de teléfono"
                    />
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="avatar" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customUrl">URL de imagen personalizada</Label>
                    <Input
                      id="customUrl"
                      value={customImage}
                      onChange={(e) => setCustomImage(e.target.value)}
                      placeholder="https://ejemplo.com/avatar.jpg"
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Avatares Profesionales</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {DEFAULT_AVATARS.profesional.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setCustomImage('');
                          }}
                          className={`rounded-full border-2 transition-all hover:scale-110 ${
                            selectedAvatar === avatar && !customImage
                              ? 'border-primary ring-2 ring-primary'
                              : 'border-transparent'
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={avatar} />
                          </Avatar>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Avatares Hombres</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {DEFAULT_AVATARS.hombres.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setCustomImage('');
                          }}
                          className={`rounded-full border-2 transition-all hover:scale-110 ${
                            selectedAvatar === avatar && !customImage
                              ? 'border-primary ring-2 ring-primary'
                              : 'border-transparent'
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={avatar} />
                          </Avatar>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Avatares Mujeres</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {DEFAULT_AVATARS.mujeres.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setCustomImage('');
                          }}
                          className={`rounded-full border-2 transition-all hover:scale-110 ${
                            selectedAvatar === avatar && !customImage
                              ? 'border-primary ring-2 ring-primary'
                              : 'border-transparent'
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={avatar} />
                          </Avatar>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Avatares Animales/Bots</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {DEFAULT_AVATARS.animales.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setCustomImage('');
                          }}
                          className={`rounded-full border-2 transition-all hover:scale-110 ${
                            selectedAvatar === avatar && !customImage
                              ? 'border-primary ring-2 ring-primary'
                              : 'border-transparent'
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={avatar} />
                          </Avatar>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Guardando...' : 'Guardar Avatar'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="password" className="space-y-4">
                <div className="grid gap-4">
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Asegúrate de recordar tu nueva contraseña. Debe tener al menos 6 caracteres.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Repite la nueva contraseña"
                    />
                    {passwordData.newPassword && passwordData.confirmPassword && 
                     passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="text-sm text-red-600">Las contraseñas no coinciden</p>
                    )}
                  </div>

                  <Button 
                    onClick={handleChangePassword} 
                    disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full"
                    variant="destructive"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ClientePerfilPage;
