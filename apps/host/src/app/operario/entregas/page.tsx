'use client';

import { useState, useEffect } from 'react';
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
  Card,
  CardBody,
  Badge,
  useToast,
  Spinner,
  Center,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Truck,
  MapPin,
  User,
  Calendar,
  Clock,
  CheckCircle,
  Package,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config/env';
import { FinalizarEntregaModal } from '@/components/FinalizarEntregaModal';

interface TareaEntrega {
  id: number;
  reservaId: number;
  cliente: string;
  direccion: string;
  estado: 'Pendiente' | 'En Ruta' | 'Completada';
  fechaEntrega: string;
  horaEstimada: string;
  telefono?: string;
}

export default function EntregasPage() {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const [tareas, setTareas] = useState<TareaEntrega[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen: isFinalizarOpen, onOpen: onFinalizarOpen, onClose: onFinalizarClose } = useDisclosure();
  const [tareaAFinalizar, setTareaAFinalizar] = useState<TareaEntrega | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  // Cargar tareas de entrega
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem('token');
        // TODO: Reemplazar con endpoint real de la API
        // Por ahora, datos mock
        const mockTareas: TareaEntrega[] = [
          {
            id: 1,
            reservaId: 1001,
            cliente: 'Juan Pérez',
            direccion: 'Calle Principal 123, Ciudad',
            estado: 'Pendiente',
            fechaEntrega: '2025-01-14',
            horaEstimada: '10:00 AM',
            telefono: '+1234567890',
          },
          {
            id: 2,
            reservaId: 1002,
            cliente: 'María González',
            direccion: 'Avenida Central 456, Ciudad',
            estado: 'En Ruta',
            fechaEntrega: '2025-01-14',
            horaEstimada: '11:30 AM',
            telefono: '+1234567891',
          },
          {
            id: 3,
            reservaId: 1003,
            cliente: 'Carlos Rodríguez',
            direccion: 'Boulevard Norte 789, Ciudad',
            estado: 'Pendiente',
            fechaEntrega: '2025-01-14',
            horaEstimada: '02:00 PM',
            telefono: '+1234567892',
          },
        ];
        setTareas(mockTareas);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las tareas de entrega',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchTareas();
  }, [toast]);

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <Badge colorScheme="yellow" fontSize="sm" px={2} py={1}>Pendiente</Badge>;
      case 'En Ruta':
        return <Badge colorScheme="blue" fontSize="sm" px={2} py={1}>En Ruta</Badge>;
      case 'Completada':
        return <Badge colorScheme="green" fontSize="sm" px={2} py={1}>Completada</Badge>;
      default:
        return <Badge fontSize="sm" px={2} py={1}>{estado}</Badge>;
    }
  };

  const handleVerDetalle = (tarea: TareaEntrega) => {
    toast({
      title: 'Detalle de entrega',
      description: `Reserva #${tarea.reservaId} - ${tarea.cliente}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    // TODO: Navegar a página de detalle o abrir modal
  };

  const handleIniciar = (tarea: TareaEntrega) => {
    toast({
      title: 'Entrega iniciada',
      description: `Ruta iniciada para ${tarea.cliente}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    // TODO: Actualizar estado de la tarea
  };

  return (
    <Box bg={bgColor} minH="100vh" pb={8}>
      <Container maxW="container.lg" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={2}>
            <HStack spacing={3}>
              <Icon as={Truck} boxSize={6} color="blue.500" />
              <Heading size={{ base: "lg", md: "xl" }} fontWeight="bold">
                Tareas de Entrega
              </Heading>
            </HStack>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
              Gestiona las entregas programadas para hoy
            </Text>
          </VStack>

          {/* Lista de Tareas */}
          {isLoading ? (
            <Center py={12}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : tareas.length === 0 ? (
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl">
              <CardBody p={8}>
                <VStack spacing={4}>
                  <Icon as={Package} boxSize={12} color="gray.400" />
                  <Text fontSize="lg" fontWeight="medium" color="gray.500">
                    No hay tareas de entrega pendientes
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <VStack spacing={4} align="stretch">
              {tareas.map((tarea) => (
                <Card
                  key={tarea.id}
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  overflow="hidden"
                  _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <CardBody p={{ base: 4, md: 6 }}>
                    <VStack spacing={4} align="stretch">
                      {/* Header de la tarjeta */}
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Reserva #{tarea.reservaId}
                          </Text>
                          <Heading size="sm" fontWeight="bold">
                            {tarea.cliente}
                          </Heading>
                        </VStack>
                        {getEstadoBadge(tarea.estado)}
                      </HStack>

                      {/* Información de la entrega */}
                      <VStack spacing={3} align="stretch">
                        <HStack spacing={3}>
                          <Icon as={MapPin} boxSize={5} color="blue.500" flexShrink={0} />
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {tarea.direccion}
                          </Text>
                        </HStack>

                        <HStack spacing={3}>
                          <Icon as={Clock} boxSize={5} color="orange.500" flexShrink={0} />
                          <Text fontSize="sm" color="gray.600">
                            {tarea.horaEstimada}
                          </Text>
                        </HStack>

                        {tarea.telefono && (
                          <HStack spacing={3}>
                            <Icon as={User} boxSize={5} color="green.500" flexShrink={0} />
                            <Text fontSize="sm" color="gray.600">
                              {tarea.telefono}
                            </Text>
                          </HStack>
                        )}
                      </VStack>

                      {/* Botones de acción */}
                      <HStack spacing={3} pt={2}>
                        <Button
                          flex={1}
                          size="lg"
                          height="48px"
                          variant="outline"
                          leftIcon={<Icon as={ArrowRight} boxSize={4} />}
                          onClick={() => handleVerDetalle(tarea)}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          Ver Detalle
                        </Button>
                        {tarea.estado === 'Pendiente' && (
                          <Button
                            flex={1}
                            size="lg"
                            height="48px"
                            colorScheme="blue"
                            leftIcon={<Icon as={Truck} boxSize={4} />}
                            onClick={() => handleIniciar(tarea)}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Iniciar
                          </Button>
                        )}
                        {tarea.estado === 'En Ruta' && (
                          <Button
                            flex={1}
                            size="lg"
                            height="48px"
                            colorScheme="green"
                            leftIcon={<Icon as={CheckCircle} boxSize={4} />}
                            onClick={() => {
                              setTareaAFinalizar(tarea);
                              onFinalizarOpen();
                            }}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            Finalizar Entrega
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>

      {/* Modal Finalizar Entrega */}
      <FinalizarEntregaModal
        isOpen={isFinalizarOpen}
        onClose={onFinalizarClose}
        tareaId={tareaAFinalizar?.id || 0}
        cliente={tareaAFinalizar?.cliente || ''}
        onConfirm={(data) => {
          // TODO: Enviar datos al backend
          console.log('Datos de finalización:', data);
          handleIniciar(tareaAFinalizar!);
          onFinalizarClose();
          setTareaAFinalizar(null);
        }}
      />
    </Box>
  );
}
