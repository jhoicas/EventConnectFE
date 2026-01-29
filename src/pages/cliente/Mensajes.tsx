import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetConversacionesQuery } from '@/store/api/chatApi';
import { useAuthStore } from '@/store/authStore';
import { ChatWindow } from './components/ChatWindow';
import { ConversacionesList } from './components/ConversacionesList';
import { NuevaConversacionDialog } from './components/NuevaConversacionDialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, AlertCircle, MessageSquareOff, Loader2 } from 'lucide-react';
import type { Conversacion } from '@/types';

const ClienteMensajesPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // RTK Query hook directo
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetConversacionesQuery();

  const [conversacionSeleccionada, setConversacionSeleccionada] = useState<number | undefined>();
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  const esCliente = user?.rol === 'Cliente';
  const esEmpresa = user?.rol === 'Admin-Proveedor' || user?.rol === 'Operario';

  // Normalizar datos de la API (puede ser array directo o {conversaciones, total})
  const conversaciones: Conversacion[] = Array.isArray(data) 
    ? data 
    : (data?.conversaciones ?? []);

  // Debug logging en desarrollo
  if (import.meta.env.DEV) {
    console.log('🔍 Mensajes.tsx - Estado:', {
      userRol: user?.rol,
      esCliente,
      esEmpresa,
      isLoading,
      isError,
      error,
      dataType: Array.isArray(data) ? 'array' : typeof data,
      conversacionesLength: conversaciones.length,
    });
  }

  // Encontrar la conversación seleccionada
  const conversacionActual = conversaciones.find((c) => c.id === conversacionSeleccionada);

  // Handlers para navegación mobile
  const handleSelectConversacion = (id: number) => {
    setConversacionSeleccionada(id);
    setIsMobileListVisible(false);
  };

  const handleBackToList = () => {
    setIsMobileListVisible(true);
    setConversacionSeleccionada(undefined);
  };

  // 1. LOADING STATE - Spinner centrado mientras carga
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-white dark:bg-slate-950">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cargando conversaciones...
        </h2>
        <p className="text-sm text-muted-foreground">
          Por favor espera un momento
        </p>
      </div>
    );
  }

  // 2. ERROR HANDLING - Manejo robusto de errores (404, 500, etc.)
  if (isError) {
    const errorObj = error as any;
    const statusCode = errorObj?.status || errorObj?.originalStatus || 'desconocido';
    const errorMessage = errorObj?.data?.message 
      || errorObj?.data?.error
      || errorObj?.message 
      || 'No se pudo cargar las conversaciones';

    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-white dark:bg-slate-950">
        <div className="rounded-full bg-red-50 dark:bg-red-900/20 p-6 mb-6">
          <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Error al cargar conversaciones
        </h2>
        
        <p className="text-center text-muted-foreground mb-2 max-w-md">
          {errorMessage}
        </p>
        
        <p className="text-xs text-muted-foreground mb-6">
          Código de error: {statusCode}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => refetch()}>
            Reintentar
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // 3. EMPTY STATE - Sin conversaciones activas
  if (!data || conversaciones.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-white dark:bg-slate-950">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-6">
          <MessageSquareOff className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          No tienes conversaciones activas
        </h2>

        {esCliente ? (
          <>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Comienza una nueva conversación o explora nuestros proveedores disponibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <NuevaConversacionDialog />
              <Button variant="outline" onClick={() => navigate('/cliente/explorar')}>
                Explorar proveedores
              </Button>
            </div>
          </>
        ) : esEmpresa ? (
          <>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Tus conversaciones aparecerán aquí cuando un cliente te contacte.
            </p>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </>
        ) : (
          <>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Las conversaciones aparecerán aquí cuando comiences a chatear.
            </p>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </>
        )}
      </div>
    );
  }

  // 4. RENDER PRINCIPAL - Lista de conversaciones + Chat
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Mensajes
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {conversaciones.length} conversación{conversaciones.length !== 1 ? 'es' : ''}
            </p>
          </div>
          {esCliente && <NuevaConversacionDialog />}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Column - Conversaciones List (Mobile: hidden cuando chat seleccionado) */}
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
        <div 
          className={`flex-1 transition-all duration-300 ${
            !isMobileListVisible ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Mobile Back Button */}
          {!isMobileListVisible && (
            <div className="md:hidden border-b dark:border-slate-800 p-3 bg-gray-50 dark:bg-slate-900">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a conversaciones
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
              <p className="text-muted-foreground">
                Selecciona una conversación para comenzar a chatear
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteMensajesPage;
