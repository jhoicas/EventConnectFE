'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  useColorMode,
  useDisclosure,
  Badge,
  useToast,
} from '@chakra-ui/react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendario.css';
import { useGetReservasQuery, type Reserva } from '../../../store/api/reservaApi';
import { ReservaModal } from '@/components/ReservaModal';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Reserva;
  estado: string;
}

export default function CalendarioReservasPage() {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReserva, setSelectedReserva] = useState<Reserva | undefined>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');

  const { data: reservas = [], isLoading } = useGetReservasQuery();

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  // Convertir reservas a eventos del calendario
  const events: CalendarEvent[] = reservas.map((reserva) => {
    const fechaInicio = reserva.fecha_Entrega
      ? new Date(reserva.fecha_Entrega)
      : new Date(reserva.fecha_Evento);
    
    const fechaFin = reserva.fecha_Devolucion_Programada
      ? new Date(reserva.fecha_Devolucion_Programada)
      : new Date(fechaInicio.getTime() + 24 * 60 * 60 * 1000); // +1 día por defecto

    return {
      id: reserva.id,
      title: `${reserva.codigo_Reserva} - ${reserva.estado}`,
      start: fechaInicio,
      end: fechaFin,
      resource: reserva,
      estado: reserva.estado,
    };
  });

  const getEventStyle = (event: CalendarEvent) => {
    const colorMap: Record<string, { bg: string; border: string }> = {
      'Confirmado': { bg: '#48BB78', border: '#38A169' },
      'Confirmada': { bg: '#48BB78', border: '#38A169' },
      'Pendiente': { bg: '#ED8936', border: '#DD6B20' },
      'En Proceso': { bg: '#4299E1', border: '#3182CE' },
      'Completada': { bg: '#9F7AEA', border: '#805AD5' },
      'Cancelada': { bg: '#F56565', border: '#E53E3E' },
    };

    const colors = colorMap[event.estado] || { bg: '#718096', border: '#4A5568' };

    return {
      style: {
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: '2px',
        borderRadius: '4px',
        color: 'white',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 'medium',
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedReserva(event.resource);
    onOpen();
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Opcional: Crear nueva reserva desde el calendario
    // router.push(`/reservas/nueva?fecha=${start.toISOString()}`);
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  // Estilos personalizados para el calendario
  const calendarStyle = {
    height: 'calc(100vh - 300px)',
    minHeight: '600px',
    backgroundColor: cardBg,
    borderRadius: 'lg',
    padding: '16px',
  };

  return (
    <Box bg={bgColor} minH="100vh" pb={8}>
      <Container maxW="container.xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Header */}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <VStack align="start" spacing={2}>
              <HStack spacing={3}>
                <Icon as={Calendar} boxSize={6} color="blue.500" />
                <Heading size={{ base: "lg", md: "xl" }} fontWeight="bold">
                  Calendario de Reservas
                </Heading>
              </HStack>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
                Visualiza todas las reservas en un calendario interactivo
              </Text>
            </VStack>
            <Button
              size={{ base: "md", md: "lg" }}
              leftIcon={<Icon as={Plus} />}
              colorScheme="blue"
              onClick={() => router.push('/reservas')}
              fontWeight="bold"
            >
              Nueva Reserva
            </Button>
          </HStack>

          {/* Leyenda de Estados */}
          <HStack spacing={4} flexWrap="wrap" p={4} bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <Text fontSize="sm" fontWeight="semibold">Estados:</Text>
            <Badge colorScheme="green" fontSize="xs" px={2} py={1}>Confirmado</Badge>
            <Badge colorScheme="orange" fontSize="xs" px={2} py={1}>Pendiente</Badge>
            <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>En Proceso</Badge>
            <Badge colorScheme="purple" fontSize="xs" px={2} py={1}>Completada</Badge>
            <Badge colorScheme="red" fontSize="xs" px={2} py={1}>Cancelada</Badge>
          </HStack>

          {/* Calendario */}
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            overflow="hidden"
            p={4}
          >
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={calendarStyle}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              date={currentDate}
              onNavigate={handleNavigate}
              view={currentView}
              onView={handleViewChange}
              eventPropGetter={getEventStyle}
              messages={{
                next: 'Siguiente',
                previous: 'Anterior',
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Agenda',
                date: 'Fecha',
                time: 'Hora',
                event: 'Evento',
                noEventsInRange: 'No hay reservas en este rango',
              }}
              culture="es"
              formats={{
                dayFormat: 'dddd D',
                weekdayFormat: 'ddd',
                monthHeaderFormat: 'MMMM YYYY',
                dayHeaderFormat: 'dddd, D MMMM',
                dayRangeHeaderFormat: ({ start, end }) =>
                  `${moment(start).format('D MMM')} - ${moment(end).format('D MMM YYYY')}`,
              }}
            />
          </Box>
        </VStack>
      </Container>

      {/* Modal de Reserva */}
      <ReservaModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedReserva(undefined);
        }}
        reserva={selectedReserva}
      />
    </Box>
  );
}
