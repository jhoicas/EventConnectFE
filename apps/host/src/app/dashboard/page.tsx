'use client';

import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  useColorMode,
  SimpleGrid,
  HStack,
  Icon,
  Button,
  Badge,
  Progress,
  Divider,
  Avatar,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Card } from '@eventconnect/ui';
import { useAppSelector } from '../../store/store';
import {
  ShoppingBag,
  Calendar,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Package,
  MapPin,
  Sparkles,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/env';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const [pendingUsersCount, setPendingUsersCount] = useState<number>(0);
  const { isOpen: isAlertVisible, onClose: onAlertClose } = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  // Cargar usuarios pendientes para admins
  useEffect(() => {
    const fetchPendingUsers = async () => {
      if (user?.rol === 'SuperAdmin' || user?.rol === 'Admin-Proveedor') {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}Usuario/pendientes/count`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPendingUsersCount(data.count);
          }
        } catch (error) {
          console.error('Error al obtener usuarios pendientes:', error);
        }
      }
    };

    fetchPendingUsers();
  }, [user?.rol]);

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  // TODO: Conectar con API real para obtener estadísticas del usuario
  const estadisticas = [
    {
      label: 'Cotizaciones Activas',
      value: '0',
      description: 'En proceso',
      icon: ShoppingBag,
      color: 'blue',
      action: () => router.push('/cliente/cotizaciones'),
    },
    {
      label: 'Reservas Confirmadas',
      value: '0',
      description: 'Próximos eventos',
      icon: Calendar,
      color: 'green',
      action: () => router.push('/cliente/reservas'),
    },
    {
      label: 'Mensajes sin leer',
      value: '0',
      description: 'Nuevos mensajes',
      icon: MessageCircle,
      color: 'purple',
      action: () => router.push('/cliente/mensajes'),
    },
    {
      label: 'Gastos Totales',
      value: '$0',
      description: 'Últimos 6 meses',
      icon: TrendingUp,
      color: 'orange',
      action: () => {},
    },
  ];

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" px={{ base: 4, md: 0 }}>
      {/* Alerta de Usuarios Pendientes - Solo para Admins */}
      {(user?.rol === 'SuperAdmin' || user?.rol === 'Admin-Proveedor') && pendingUsersCount > 0 && isAlertVisible && (
        <Alert
          status="warning"
          variant="left-accent"
          borderRadius="xl"
          boxShadow="md"
        >
          <AlertIcon as={UserPlus} />
          <Box flex="1">
            <AlertTitle fontSize="md" fontWeight="bold">
              {pendingUsersCount} {pendingUsersCount === 1 ? 'usuario empresa pendiente' : 'usuarios empresa pendientes'} de activación
            </AlertTitle>
            <AlertDescription fontSize="sm">
              Hay usuarios que requieren tu aprobación para acceder al sistema.
            </AlertDescription>
          </Box>
          <Button
            size="sm"
            colorScheme="orange"
            onClick={() => router.push('/dashboard/usuarios')}
            mr={2}
          >
            Gestionar Usuarios
          </Button>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={onAlertClose}
          />
        </Alert>
      )}

      {/* Estadísticas Rápidas */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 3, md: 4 }}>
        {estadisticas.map((stat) => (
          <Box
            key={stat.label}
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
            onClick={stat.action}
          >
            <HStack justify="space-between" mb={3}>
              <Box
                p={3}
                borderRadius="lg"
                bg={`${stat.color}.50`}
              >
                <Icon as={stat.icon} boxSize={{ base: 5, md: 6 }} color={`${stat.color}.500`} />
              </Box>
              <Icon as={ArrowRight} color="gray.400" />
            </HStack>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
              {stat.value}
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" mb={1}>
              {stat.label}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {stat.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={{ base: 4, md: 6 }}>
        {/* Columna Izquierda */}
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Próxima Reserva */}
          <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              p={{ base: 6, md: 8 }}
              textAlign="center"
            >
              <Icon as={Calendar} boxSize={{ base: 10, md: 12 }} color="gray.300" mb={4} />
              <Heading size={{ base: "sm", md: "md" }} mb={2} color="gray.600">
                No tienes reservas próximas
              </Heading>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" mb={4}>
                Explora nuestro catálogo y crea tu primera reserva
              </Text>
              <Button
                colorScheme="blue"
                size={{ base: "sm", md: "md" }}
                onClick={() => router.push('/cliente/explorar')}
              >
                Explorar Catálogo
              </Button>
            </Box>
        </VStack>

        {/* Columna Derecha */}
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Accesos Rápidos */}
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={4}>
              Accesos Rápidos
            </Text>
            <VStack spacing={3}>
              <Button
                w="full"
                justifyContent="start"
                leftIcon={<Icon as={Sparkles} />}
                colorScheme="blue"
                size={{ base: "sm", md: "md" }}
                onClick={() => router.push('/cliente/explorar')}
              >
                Explorar Productos
              </Button>
              <Button
                w="full"
                justifyContent="start"
                leftIcon={<Icon as={ShoppingBag} />}
                size={{ base: "sm", md: "md" }}
                variant="outline"
                onClick={() => router.push('/cliente/cotizaciones')}
              >
                Mis Cotizaciones
              </Button>
              <Button
                w="full"
                justifyContent="start"
                leftIcon={<Icon as={MessageCircle} />}
                variant="outline"
                size={{ base: "sm", md: "md" }}
                onClick={() => router.push('/cliente/mensajes')}
              >
                Mensajes
              </Button>
            </VStack>
          </Box>

          {/* Productos Populares */}
          <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                Lo Más Buscado
              </Text>
              <Icon as={TrendingUp} color="green.500" boxSize={{ base: 5, md: 6 }} />
            </HStack>
            <VStack py={6} spacing={2}>
                <Icon as={Package} boxSize={10} color="gray.300" />
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Explora nuestro catálogo para ver productos destacados
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mt={2}
                  onClick={() => router.push('/cliente/explorar')}
                >
                  Ver Catálogo
                </Button>
            </VStack>
          </Box>

          {/* Tips */}
          <Box
            bg="blue.50"
            borderWidth="1px"
            borderColor="blue.200"
            borderRadius="xl"
            p={6}
          >
            <HStack mb={3}>
              <Icon as={Sparkles} color="blue.600" />
              <Text fontSize="md" fontWeight="bold" color="blue.700">
                💡 Tip del día
              </Text>
            </HStack>
            <Text fontSize="sm" color="blue.700">
              ¿Sabías que puedes chatear con múltiples proveedores antes de reservar? 
              Compara precios y negocia directamente.
            </Text>
          </Box>
        </VStack>
      </Grid>
    </VStack>
  );
}