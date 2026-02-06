import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useObtenerConfiguracion, useActualizarConfiguracion, useProbarConexion } from '../hooks/useNotificaciones';
import { Settings, Mail, MessageSquare, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

export const ConfiguracionNotificaciones = () => {
  const { data: config, isLoading } = useObtenerConfiguracion();
  const { mutate: actualizar, isPending: actualizando } = useActualizarConfiguracion();
  const { mutate: probar, isPending: probando } = useProbarConexion();

  const [emailProvider, setEmailProvider] = useState(config?.emailProvider || 'sendgrid');
  const [emailApiKey, setEmailApiKey] = useState('');
  const [emailRemitente, setEmailRemitente] = useState(config?.emailRemitente || '');
  const [emailNombreRemitente, setEmailNombreRemitente] = useState(config?.emailNombreRemitente || '');
  const [smsProvider, setSmsProvider] = useState(config?.smsProvider || 'twilio');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsTelefono, setSmsTelefono] = useState(config?.smsTelefono || '');
  const [maxIntentos, setMaxIntentos] = useState(config?.maxIntentosEnvio || 3);
  const [intervalo, setIntervalo] = useState(config?.intervaloReintento || 15);
  const [habilitarEmail, setHabilitarEmail] = useState(config?.habilitarEmail ?? true);
  const [habilitarSms, setHabilitarSms] = useState(config?.habilitarSms ?? false);

  const [resultadoPruebaEmail, setResultadoPruebaEmail] = useState<{ exito: boolean; mensaje: string } | null>(null);
  const [resultadoPruebaSms, setResultadoPruebaSms] = useState<{ exito: boolean; mensaje: string } | null>(null);

  const handleGuardar = () => {
    actualizar({
      emailProvider,
      emailApiKey: emailApiKey || undefined,
      emailRemitente,
      emailNombreRemitente,
      smsProvider,
      smsApiKey: smsApiKey || undefined,
      smsTelefono: smsTelefono || undefined,
      maxIntentosEnvio: maxIntentos,
      intervaloReintento: intervalo,
      habilitarEmail,
      habilitarSms,
    });
  };

  const handleProbarEmail = () => {
    probar(
      { provider: emailProvider, tipo: 'email' },
      {
        onSuccess: (data) => setResultadoPruebaEmail(data),
      }
    );
  };

  const handleProbarSms = () => {
    probar(
      { provider: smsProvider, tipo: 'sms' },
      {
        onSuccess: (data) => setResultadoPruebaSms(data),
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración de Notificaciones
          </CardTitle>
          <CardDescription>Configura los proveedores de email y SMS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración Email */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Email</h3>
              <label className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  checked={habilitarEmail}
                  onChange={(e) => setHabilitarEmail(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Habilitar email</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <select
                  value={emailProvider}
                  onChange={(e) => setEmailProvider(e.target.value as typeof emailProvider)}
                  className="w-full border rounded-md p-2"
                  disabled={!habilitarEmail}
                >
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="ses">Amazon SES</option>
                  <option value="smtp">SMTP</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="API Key"
                  value={emailApiKey}
                  onChange={(e) => setEmailApiKey(e.target.value)}
                  disabled={!habilitarEmail}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Remitente</Label>
                <Input
                  type="email"
                  placeholder="notificaciones@empresa.com"
                  value={emailRemitente}
                  onChange={(e) => setEmailRemitente(e.target.value)}
                  disabled={!habilitarEmail}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre Remitente</Label>
                <Input
                  type="text"
                  placeholder="EventConnect"
                  value={emailNombreRemitente}
                  onChange={(e) => setEmailNombreRemitente(e.target.value)}
                  disabled={!habilitarEmail}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleProbarEmail}
                disabled={!habilitarEmail || probando}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Probar Conexión
              </Button>
              {resultadoPruebaEmail && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                  resultadoPruebaEmail.exito ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {resultadoPruebaEmail.exito ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {resultadoPruebaEmail.mensaje}
                </div>
              )}
            </div>
          </div>

          {/* Configuración SMS */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">SMS</h3>
              <label className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  checked={habilitarSms}
                  onChange={(e) => setHabilitarSms(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Habilitar SMS</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <select
                  value={smsProvider}
                  onChange={(e) => setSmsProvider(e.target.value as typeof smsProvider)}
                  className="w-full border rounded-md p-2"
                  disabled={!habilitarSms}
                >
                  <option value="twilio">Twilio</option>
                  <option value="vonage">Vonage</option>
                  <option value="messagebird">MessageBird</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="API Key"
                  value={smsApiKey}
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  disabled={!habilitarSms}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Teléfono Remitente</Label>
              <Input
                type="text"
                placeholder="+57 300 123 4567"
                value={smsTelefono}
                onChange={(e) => setSmsTelefono(e.target.value)}
                disabled={!habilitarSms}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleProbarSms}
                disabled={!habilitarSms || probando}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Probar Conexión
              </Button>
              {resultadoPruebaSms && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                  resultadoPruebaSms.exito ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {resultadoPruebaSms.exito ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {resultadoPruebaSms.mensaje}
                </div>
              )}
            </div>
          </div>

          {/* Configuración general */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Configuración General</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Máximo de intentos de envío</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={maxIntentos}
                  onChange={(e) => setMaxIntentos(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Intervalo de reintento (minutos)</Label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={intervalo}
                  onChange={(e) => setIntervalo(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleGuardar} disabled={actualizando}>
            {actualizando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Configuración'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
