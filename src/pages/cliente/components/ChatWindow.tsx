import { useEffect, useRef, useState } from 'react';
import { useMensajesDeConversacion, useEnviarMensajeSeguro, useUsuarioActual } from '@/store/api/chatHooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatWindowProps {
  conversacionId: number | undefined | null;
  nombreContraparte?: string;
  avatarURL?: string;
}

export const ChatWindow = ({ conversacionId, nombreContraparte, avatarURL }: ChatWindowProps) => {
  const { user } = useUsuarioActual();
  const { mensajes, isLoading, isError } = useMensajesDeConversacion(conversacionId);
  const { enviar, isLoading: enviando, error: errorEnvio, canSendMessage } = useEnviarMensajeSeguro();
  const [contenido, setContenido] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll a los mensajes nuevos
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Resetear input cuando se envía
  useEffect(() => {
    if (!enviando && !errorEnvio) {
      setContenido('');
    }
  }, [enviando, errorEnvio]);

  if (!conversacionId) {
    return (
      <div className="hidden lg:flex h-full flex-col items-center justify-center bg-muted/30">
        <p className="text-muted-foreground text-lg">Selecciona una conversación para comenzar</p>
      </div>
    );
  }

  const handleEnviar = async () => {
    if (!contenido.trim() || !conversacionId) return;

    try {
      await enviar({
        conversacion_Id: conversacionId,
        contenido: contenido.trim(),
        tipo_Contenido: 'texto',
      });
    } catch (err) {
      console.error('Error al enviar:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  // Validación: Verificar que la conversación pertenezca al usuario actual
  const tieneAcceso = true; // El backend valida esto, aquí es solo UI

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        {avatarURL && (
          <img
            src={avatarURL}
            alt={nombreContraparte}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 dark:text-white">{nombreContraparte || 'Chat'}</h2>
          <p className="text-xs text-muted-foreground">Conversación activa</p>
        </div>
      </div>

      {/* Mensajes Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white dark:bg-slate-950">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-muted-foreground">Cargando mensajes...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
              <p className="text-muted-foreground">Error al cargar los mensajes</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && mensajes.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No hay mensajes aún</p>
              <p className="text-xs text-muted-foreground">Inicia la conversación escribiendo tu primer mensaje</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && mensajes.map((mensaje) => {
          const esDelUsuario = mensaje.remitente_Id === user?.id;
          return (
            <div
              key={mensaje.id}
              className={`flex ${esDelUsuario ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                  esDelUsuario
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none'
                }`}
              >
                <p className="break-words">{mensaje.contenido}</p>
                <p
                  className={`text-xs mt-1 ${
                    esDelUsuario ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {format(new Date(mensaje.fecha_Creacion), 'HH:mm', { locale: es })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
        {!tieneAcceso && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>No tienes permiso para acceder a esta conversación</span>
          </div>
        )}

        {!canSendMessage && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Debes iniciar sesión para enviar mensajes</span>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={enviando || !tieneAcceso || !canSendMessage}
            className="flex-1"
          />
          <Button
            onClick={handleEnviar}
            disabled={enviando || !contenido.trim() || !tieneAcceso || !canSendMessage}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {enviando ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {errorEnvio && (
          <p className="text-xs text-destructive mt-2">
            {typeof errorEnvio === 'string' ? errorEnvio : 'Error al enviar el mensaje'}
          </p>
        )}
      </div>
    </div>
  );
};
