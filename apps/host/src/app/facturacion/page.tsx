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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Spinner,
  Center,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FileText,
  Plus,
  DollarSign,
  AlertCircle,
  Eye,
  Download,
  Calendar,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config/env';

interface Factura {
  id: number;
  numeroFactura: string;
  cliente: string;
  fecha: string;
  fechaVencimiento?: string;
  total: number;
  estado: 'Pendiente' | 'Pagada' | 'Emitida DIAN' | 'Vencida';
  dian?: boolean;
}

export default function FacturacionPage() {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ventasMes, setVentasMes] = useState<number>(0);
  const [facturasVencidas, setFacturasVencidas] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  // Cargar facturas
  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const token = localStorage.getItem('token');
        // TODO: Reemplazar con endpoint real de la API
        // Por ahora, datos mock
        const mockFacturas: Factura[] = [
          {
            id: 1,
            numeroFactura: 'FAC-2025-001',
            cliente: 'Juan Pérez',
            fecha: '2025-01-10',
            fechaVencimiento: '2025-01-20',
            total: 1500000,
            estado: 'Pendiente',
            dian: false,
          },
          {
            id: 2,
            numeroFactura: 'FAC-2025-002',
            cliente: 'María González',
            fecha: '2025-01-12',
            fechaVencimiento: '2025-01-22',
            total: 2300000,
            estado: 'Pagada',
            dian: true,
          },
          {
            id: 3,
            numeroFactura: 'FAC-2025-003',
            cliente: 'Carlos Rodríguez',
            fecha: '2025-01-05',
            fechaVencimiento: '2025-01-15',
            total: 850000,
            estado: 'Vencida',
            dian: true,
          },
          {
            id: 4,
            numeroFactura: 'FAC-2025-004',
            cliente: 'Ana Martínez',
            fecha: '2025-01-13',
            total: 3200000,
            estado: 'Emitida DIAN',
            dian: true,
          },
        ];
        setFacturas(mockFacturas);
        
        // Calcular KPIs
        const mesActual = new Date().getMonth();
        const facturasMes = mockFacturas.filter(
          (f) => new Date(f.fecha).getMonth() === mesActual
        );
        const totalVentas = facturasMes.reduce((sum, f) => sum + f.total, 0);
        setVentasMes(totalVentas);
        
        const vencidas = mockFacturas.filter(
          (f) => f.estado === 'Vencida' || 
          (f.fechaVencimiento && new Date(f.fechaVencimiento) < new Date() && f.estado === 'Pendiente')
        ).length;
        setFacturasVencidas(vencidas);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener facturas:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las facturas',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchFacturas();
  }, [toast]);

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstadoBadge = (estado: string) => {
    const colorMap: Record<string, string> = {
      'Pendiente': 'yellow',
      'Pagada': 'green',
      'Emitida DIAN': 'blue',
      'Vencida': 'red',
    };
    return (
      <Badge colorScheme={colorMap[estado] || 'gray'} fontSize="sm" px={2} py={1}>
        {estado}
      </Badge>
    );
  };

  const handleNuevaFactura = () => {
    toast({
      title: 'Nueva Factura',
      description: 'Funcionalidad en desarrollo',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    // TODO: Navegar a formulario de nueva factura
  };

  const handleVerDetalle = (factura: Factura) => {
    toast({
      title: 'Detalle de Factura',
      description: `Factura ${factura.numeroFactura}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    // TODO: Abrir modal o navegar a detalle
  };

  const handleDescargar = (factura: Factura) => {
    toast({
      title: 'Descargar Factura',
      description: `Generando PDF para ${factura.numeroFactura}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    // TODO: Implementar descarga de PDF
  };

  return (
    <Box bg={bgColor} minH="100vh" pb={8}>
      <Container maxW="container.xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header */}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <VStack align="start" spacing={2}>
              <HStack spacing={3}>
                <Icon as={FileText} boxSize={6} color="blue.500" />
                <Heading size={{ base: "lg", md: "xl" }} fontWeight="bold">
                  Facturas Emitidas
                </Heading>
              </HStack>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
                Gestiona las facturas de tu empresa
              </Text>
            </VStack>
            <Button
              size={{ base: "md", md: "lg" }}
              leftIcon={<Icon as={Plus} />}
              colorScheme="blue"
              onClick={handleNuevaFactura}
              fontWeight="bold"
            >
              Nueva Factura
            </Button>
          </HStack>

          {/* KPIs */}
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
                      bg="green.50"
                      _dark={{ bg: 'green.900' }}
                    >
                      <Icon as={DollarSign} boxSize={6} color="green.500" />
                    </Box>
                    <Badge colorScheme="green" fontSize="xs">
                      Este Mes
                    </Badge>
                  </HStack>
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
                    {isLoading ? '...' : formatPrice(ventasMes)}
                  </StatNumber>
                  <StatLabel fontSize={{ base: "sm", md: "md" }} mt={2}>
                    Ventas del Mes
                  </StatLabel>
                  <StatHelpText fontSize="xs" color="gray.500">
                    Total facturado
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
                      bg="red.50"
                      _dark={{ bg: 'red.900' }}
                    >
                      <Icon as={AlertCircle} boxSize={6} color="red.500" />
                    </Box>
                    <Badge colorScheme="red" fontSize="xs">
                      Urgente
                    </Badge>
                  </HStack>
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
                    {isLoading ? '...' : facturasVencidas}
                  </StatNumber>
                  <StatLabel fontSize={{ base: "sm", md: "md" }} mt={2}>
                    Facturas Vencidas
                  </StatLabel>
                  <StatHelpText fontSize="xs" color="gray.500">
                    Requieren atención
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Tabla de Facturas */}
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            overflow="hidden"
          >
            <CardBody p={0}>
              <Box overflowX="auto">
                <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
                  <Thead>
                    <Tr>
                      <Th>N° Factura</Th>
                      <Th>Cliente</Th>
                      <Th display={{ base: 'none', md: 'table-cell' }}>Fecha</Th>
                      <Th isNumeric>Total</Th>
                      <Th>Estado</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading ? (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={8}>
                          <Center>
                            <Spinner size="xl" color="blue.500" thickness="4px" />
                          </Center>
                        </Td>
                      </Tr>
                    ) : facturas.length === 0 ? (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={8}>
                          <VStack spacing={3}>
                            <Icon as={FileText} boxSize={12} color="gray.400" />
                            <Text color="gray.500" fontWeight="medium">
                              No hay facturas registradas
                            </Text>
                            <Button
                              size="sm"
                              leftIcon={<Icon as={Plus} />}
                              colorScheme="blue"
                              onClick={handleNuevaFactura}
                            >
                              Crear Primera Factura
                            </Button>
                          </VStack>
                        </Td>
                      </Tr>
                    ) : (
                      facturas.map((factura) => (
                        <Tr key={factura.id} _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }} fontFamily="mono">
                                {factura.numeroFactura}
                              </Text>
                              {factura.dian && (
                                <Badge colorScheme="blue" fontSize="xs" mt={1}>
                                  DIAN
                                </Badge>
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Icon as={User} boxSize={4} color="gray.400" />
                              <Text fontSize={{ base: 'sm', md: 'md' }} noOfLines={1}>
                                {factura.cliente}
                              </Text>
                            </HStack>
                          </Td>
                          <Td display={{ base: 'none', md: 'table-cell' }}>
                            <HStack spacing={2}>
                              <Icon as={Calendar} boxSize={4} color="gray.400" />
                              <Text fontSize="sm">
                                {formatDate(factura.fecha)}
                              </Text>
                            </HStack>
                            {factura.fechaVencimiento && (
                              <Text fontSize="xs" color="gray.500" mt={1}>
                                Vence: {formatDate(factura.fechaVencimiento)}
                              </Text>
                            )}
                          </Td>
                          <Td isNumeric>
                            <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color="blue.600">
                              {formatPrice(factura.total)}
                            </Text>
                          </Td>
                          <Td>
                            {getEstadoBadge(factura.estado)}
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <Tooltip label="Ver Detalle">
                                <IconButton
                                  aria-label="Ver Detalle"
                                  icon={<Eye size={16} />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="ghost"
                                  onClick={() => handleVerDetalle(factura)}
                                />
                              </Tooltip>
                              <Tooltip label="Descargar PDF">
                                <IconButton
                                  aria-label="Descargar"
                                  icon={<Download size={16} />}
                                  size="sm"
                                  colorScheme="green"
                                  variant="ghost"
                                  onClick={() => handleDescargar(factura)}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
