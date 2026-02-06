import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useListarPlantillas, useCrearNotificacion } from '../hooks/useNotificaciones';
import { Mail, MessageSquare, Loader2, Send, CheckCircle2, XCircle } from 'lucide-react';
import type { TipoNotificacion, CanalNotificacion, PrioridadNotificacion } from '../types';

interface EnviarNotificacionProps {
  onEnvioExitoso?: () => void;
}

export const EnviarNotificacion = ({ onEnvioExitoso }: EnviarNotificacionProps) => {
  const [tipo, setTipo] = useState<TipoNotificacion>('email');
  const [destinatario, setDestinatario] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [plantillaId, setPlantillaId] = useState('');
  const [prioridad, setPrioridad] = useState<PrioridadNotificacion>('normal');
  const [canal, setCanal] = useState<CanalNotificacion>('transaccional');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const { data: plantillas } = useListarPlantillas(tipo);
  const { mutate: enviar, isPending } = useCrearNotificacion();

  const handleEnviar = () => {
    setError('');
    setExito(false);

    if (!destinatario || !mensaje) {
      setError('Destinatario y mensaje son requeridos');
      return;
    }

    if (tipo === 'email' && !asunto) {
      setError('El asunto es requerido para emails');
      return;
    }

    enviar(
      {
        tipo,
        destinatario,
        asunto: tipo === 'email' ? asunto : undefined,
        mensaje,
        plantillaId: plantillaId || undefined,
        prioridad,
        canal,
        estado: 'pendiente',
        intentos: 0,
        maxIntentos: 3,
        createdBy: 'current-user',
      },
      {
        onSuccess: () => {
          setExito(true);
          setDestinatario('');
          setAsunto('');
          setMensaje('');
          setPlantillaId('');
          onEnvioExitoso?.();
          setTimeout(() => setExito(false), 3000);
        },
        onError: () => {
          setError('Error al enviar la notificación. Intenta nuevamente.');
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Enviar Notificación
        </CardTitle>
        <CardDescription>Enviar email, SMS o notificación push individual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tipo de notificación */}
        <div className="space-y-2">
          <Label>Tipo de Notificación</Label>
          <div className="flex gap-2">
            {(['email', 'sms', 'push', 'inApp'] as TipoNotificacion[]).map((t) => (
              <Button
                key={t}
                variant={tipo === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTipo(t)}
              >
                {t === 'email' && <Mail className="w-4 h-4 mr-1" />}
                {t === 'sms' && <MessageSquare className="w-4 h-4 mr-1" />}
                {t.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Canal */}
        <div className="space-y-2">
          <Label>Canal</Label>
          <select
            value={canal}
            onChange={(e) => setCanal(e.target.value as CanalNotificacion)}
            className="w-full border rounded-md p-2"
          >
            <option value="transaccional">Transaccional</option>
            <option value="marketing">Marketing</option>
            <option value="sistema">Sistema</option>
            <option value="recordatorio">Recordatorio</option>
          </select>
        </div>

        {/* Plantilla (opcional) */}
        {plantillas && plantillas.length > 0 && (
          <div className="space-y-2">
            <Label>Plantilla (Opcional)</Label>
            <select
              value={plantillaId}
              onChange={(e) => setPlantillaId(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Sin plantilla</option>
              {plantillas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Destinatario */}
        <div className="space-y-2">
          <Label>Destinatario</Label>
          <Input
            type={tipo === 'email' ? 'email' : 'text'}
            placeholder={tipo === 'email' ? 'usuario@ejemplo.com' : '+57 3001234567'}
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
          />
        </div>

        {/* Asunto (solo email) */}
        {tipo === 'email' && (
          <div className="space-y-2">
            <Label>Asunto</Label>
            <Input
              type="text"
              placeholder="Asunto del email"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
            />
          </div>
        )}

        {/* Mensaje */}
        <div className="space-y-2">
          <Label>Mensaje</Label>
          <Textarea
            placeholder="Escribe tu mensaje aquí..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={tipo === 'sms' ? 3 : 6}
            className="resize-none"
          />
          {tipo === 'sms' && (
            <p className="text-xs text-gray-500">
              {mensaje.length}/160 caracteres
            </p>
          )}
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <Label>Prioridad</Label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value as PrioridadNotificacion)}
            className="w-full border rounded-md p-2"
          >
            <option value="baja">Baja</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            <XCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {exito && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm">¡Notificación enviada exitosamente!</p>
          </div>
        )}

        {/* Botón enviar */}
        <Button onClick={handleEnviar} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Notificación
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
