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
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
} from '@chakra-ui/react';
import {
  Truck,
  RotateCcw,
  QrCode,
  MapPin,
  Package,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/store';
import { API_BASE_URL } from '../../config/env';

export default function OperarioDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const { user } = useAppSelector((state) => state.auth);
  const [entregasPendientes, setEntregasPendientes] = useState<number>(0);
  const [recogidasPendientes, setRecogidasPendientes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  // Cargar estadísticas de entregas y recogidas
  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const token = localStorage.getItem('token');
        // TODO: Reemplazar con endpoints reales de la API
        // Por ahora, datos mock
        setEntregasPendientes(5);
        setRecogidasPendientes(3);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        setIsLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  const handleEscanearQR = () => {
    router.push('/operario/scanner');
  };

  const handleVerRuta = () => {
    toast({
      title: 'Ruta en desarrollo',
      description: 'La funcionalidad de visualización de ruta estará disponible pronto.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box bg={bgColor} minH="100vh" pb={8}>
      <Container maxW="container.lg" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={2}>
            <Heading size={{ base: "lg", md: "xl" }} fontWeight="bold">
              Panel Operario
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
              Gestiona tus entregas y recogidas del día
            </Text>
          </VStack>

          {/* Estadísticas Rápidas */}
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
            >
              <CardBody p={6}>
                <Stat>
                  <HStack justify="space-between" mb={3}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg="blue.50"
                      _dark={{ bg: 'blue.900' }}
                    >
                      <Icon as={Truck} boxSize={6} color="blue.500" />
                    </Box>
                    <Badge colorScheme="blue" fontSize="xs">
                      Hoy
                    </Badge>
                  </HStack>
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
                    {isLoading ? '...' : entregasPendientes}
                  </StatNumber>
                  <StatLabel fontSize={{ base: "sm", md: "md" }} mt={2}>
                    Entregas Pendientes
                  </StatLabel>
                  <StatHelpText fontSize="xs" color="gray.500">
                    Por realizar
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
            >
              <CardBody p={6}>
                <Stat>
                  <HStack justify="space-between" mb={3}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      bg="purple.50"
                      _dark={{ bg: 'purple.900' }}
                    >
                      <Icon as={RotateCcw} boxSize={6} color="purple.500" />
                    </Box>
                    <Badge colorScheme="purple" fontSize="xs">
                      Hoy
                    </Badge>
                  </HStack>
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
                    {isLoading ? '...' : recogidasPendientes}
                  </StatNumber>
                  <StatLabel fontSize={{ base: "sm", md: "md" }} mt={2}>
                    Recogidas Pendientes
                  </StatLabel>
                  <StatHelpText fontSize="xs" color="gray.500">
                    Por realizar
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Acciones Rápidas */}
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" fontWeight="semibold" px={2}>
              Acciones Rápidas
            </Text>

            <Button
              size="lg"
              height={{ base: "60px", md: "64px" }}
              colorScheme="blue"
              leftIcon={<Icon as={QrCode} boxSize={6} />}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              onClick={handleEscanearQR}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Escanear QR
            </Button>

            <Button
              size="lg"
              height={{ base: "60px", md: "64px" }}
              colorScheme="green"
              leftIcon={<Icon as={MapPin} boxSize={6} />}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              onClick={handleVerRuta}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Ver Ruta del Día
            </Button>
          </VStack>

          {/* Navegación Rápida */}
          <VStack spacing={4} align="stretch">
            <Text fontSize="md" fontWeight="semibold" px={2}>
              Navegación
            </Text>

            <SimpleGrid columns={1} spacing={3}>
              <Button
                size="lg"
                height="56px"
                variant="outline"
                leftIcon={<Icon as={Truck} boxSize={5} />}
                justifyContent="flex-start"
                onClick={() => router.push('/operario/entregas')}
                borderRadius="lg"
                borderWidth="2px"
                fontSize="md"
                fontWeight="medium"
              >
                Ver Todas las Entregas
              </Button>

              <Button
                size="lg"
                height="56px"
                variant="outline"
                leftIcon={<Icon as={RotateCcw} boxSize={5} />}
                justifyContent="flex-start"
                onClick={() => router.push('/operario/recogidas')}
                borderRadius="lg"
                borderWidth="2px"
                fontSize="md"
                fontWeight="medium"
              >
                Ver Todas las Recogidas
              </Button>
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
