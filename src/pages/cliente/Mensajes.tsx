import { useState } from 'react';
import { useConversacionesDelUsuario, useUsuarioActual } from '@/store/api/chatHooks';
import { useNavigate } from 'react-router-dom';
import { ChatWindow } from './components/ChatWindow';
import { ConversacionesList } from './components/ConversacionesList';
import { NuevaConversacionDialog } from './components/NuevaConversacionDialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, AlertCircle } from 'lucide-react';

const ClienteMensajesPage = () => {
  const navigate = useNavigate();
  const { user } = useUsuarioActual();
  const { conversaciones, isLoading, isError, error } = useConversacionesDelUsuario();
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState<number | undefined>();
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  // Encontrar la conversación seleccionada para obtener datos
  const conversacionActual = conversaciones.find((c) => c.id === conversacionSeleccionada);

  // En mobile, cuando selecciona un chat, ocultar la lista
  const handleSelectConversacion = (id: number) => {
    setConversacionSeleccionada(id);
    setIsMobileListVisible(false);
  };

  // Volver a la lista en mobile
  const handleBackToList = () => {
    setIsMobileListVisible(true);
    setConversacionSeleccionada(undefined);
  };

  const esCliente = user?.rol === 'Cliente';
  const esEmpresa = user?.rol === 'Admin-Proveedor' || user?.rol === 'Operario';

  // Estado de error
  if (isError) {
    const errorMessage = typeof error === 'object' && error !== null 
      ? (error as any).data?.message || (error as any).message || 'Error al cargar conversaciones'
      : 'Error al cargar conversaciones';

    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Error al cargar conversaciones
        </h2>
        <p className="text-center text-muted-foreground mb-6 max-w-md">
          {errorMessage}
        </p>
        <Button onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Cargando mensajes...
        </h2>
        <p className="text-muted-foreground">
          Por favor espera
        </p>
      </div>
    );
  }

  // Estado vacío - Sin conversaciones
  if (conversaciones.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
        <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />

        {esCliente ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Aún no tienes conversaciones con proveedores
            </h2>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Comienza una nueva conversación o explora nuestros servicios disponibles.
            </p>
            <div className="flex gap-3">
              <NuevaConversacionDialog />
              <Button variant="outline" onClick={() => navigate('/cliente/explorar')}>
                Explorar Servicios
              </Button>
            </div>
          </>
        ) : esEmpresa ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Aún no has recibido mensajes de clientes
            </h2>
            <p className="text-center text-muted-foreground max-w-md">
              Tus conversaciones aparecerán aquí cuando un cliente te contacte.
            </p>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Mensajes</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {conversaciones.length} conversación{conversaciones.length !== 1 ? 'es' : ''}
            </p>
          </div>
          {esCliente && <NuevaConversacionDialog />}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Column - Conversaciones List (Mobile: hidden when chat selected) */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r dark:border-slate-800 transition-all duration-300 ${
            isMobileListVisible ? 'block' : 'hidden md:block'
          }`}
        >
          <ConversacionesList
            conversacionSeleccionada={conversacionSeleccionada}
            onSelect={handleSelectConversacion}
          />
        </div>

        {/* Right Column - Chat Window */}
        <div className={`flex-1 transition-all duration-300 ${!isMobileListVisible ? 'block' : 'hidden md:block'}`}>
          {/* Mobile Back Button */}
          {!isMobileListVisible && (
            <div className="md:hidden border-b dark:border-slate-800 p-3 bg-gray-50 dark:bg-slate-900">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            </div>
          )}

          {conversacionSeleccionada ? (
            <ChatWindow
              conversacionId={conversacionSeleccionada}
              nombreContraparte={conversacionActual?.nombre_Contraparte}
              avatarURL={conversacionActual?.avatar_URL}
            />
          ) : (
            <div className="hidden md:flex h-full flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteMensajesPage;
