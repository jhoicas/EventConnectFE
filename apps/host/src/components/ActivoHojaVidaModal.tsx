'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Image,
  Divider,
  SimpleGrid,
  Icon,
  useColorMode,
  List,
  ListItem,
  ListIcon,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  Package,
  Calendar,
  DollarSign,
  MapPin,
  Tag,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { Activo } from '../store/api/activoApi';
import { useGetCategoriasQuery } from '../store/api/categoriaApi';
import { useGetMantenimientosQuery } from '../store/api/mantenimientoApi';
import { API_BASE_URL } from '../config/env';

interface ActivoHojaVidaModalProps {
  isOpen: boolean;
  onClose: () => void;
  activo: Activo | null;
  onImprimirQR?: () => void;
}

export const ActivoHojaVidaModal = ({
  isOpen,
  onClose,
  activo,
  onImprimirQR,
}: ActivoHojaVidaModalProps) => {
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const toast = useToast();
  const { data: categorias = [] } = useGetCategoriasQuery();
  const { data: mantenimientos = [] } = useGetMantenimientosQuery();

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  if (!activo) return null;

  const categoria = categorias.find((c) => c.id === activo.categoria_Id);
  const mantenimientosActivo = mantenimientos.filter((m) => m.activo_Id === activo.id);

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEstadoBadge = (estado: string) => {
    const colorMap: Record<string, string> = {
      'Disponible': 'green',
      'Alquilado': 'blue',
      'En Mantenimiento': 'red',
      'Dado de Baja': 'gray',
      'Activo': 'green',
    };
    return (
      <Badge colorScheme={colorMap[estado] || 'gray'} fontSize="sm" px={2} py={1}>
        {estado}
      </Badge>
    );
  };

  const handleImprimirQR = () => {
    if (onImprimirQR) {
      onImprimirQR();
    } else {
      toast({
        title: 'Imprimir QR',
        description: `Generando código QR para ${activo.codigo_Activo}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: '4xl' }}
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <ModalHeader fontSize={{ base: 'lg', md: 'xl' }}>
          <HStack spacing={3}>
            <Icon as={Package} boxSize={6} color="blue.500" />
            <VStack align="start" spacing={0}>
              <Text>Hoja de Vida del Activo</Text>
              <Text fontSize="sm" color="gray.500" fontWeight="normal">
                {activo.codigo_Activo}
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList mb={4} flexWrap="wrap">
              <Tab fontSize={{ base: 'sm', md: 'md' }}>Información General</Tab>
              <Tab fontSize={{ base: 'sm', md: 'md' }}>Línea de Tiempo</Tab>
              <Tab fontSize={{ base: 'sm', md: 'md' }}>Mantenimientos</Tab>
            </TabList>

            <TabPanels>
              {/* Pestaña 1: Información General */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  {/* Imagen y Estado */}
                  <HStack spacing={4} align="start">
                    <Box
                      w={{ base: '100px', md: '150px' }}
                      h={{ base: '100px', md: '150px' }}
                      borderRadius="lg"
                      overflow="hidden"
                      borderWidth="2px"
                      borderColor={borderColor}
                      bg="gray.100"
                      flexShrink={0}
                    >
                      {activo.imagen_URL ? (
                        <Image
                          src={activo.imagen_URL}
                          alt={activo.nombre}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      ) : (
                        <Box
                          w="100%"
                          h="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bg="gray.200"
                        >
                          <Icon as={Package} boxSize={8} color="gray.400" />
                        </Box>
                      )}
                    </Box>
                    <VStack align="start" spacing={2} flex={1}>
                      <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                        {activo.nombre}
                      </Text>
                      {activo.descripcion && (
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {activo.descripcion}
                        </Text>
                      )}
                      {getEstadoBadge(activo.estado)}
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Información Detallada */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={Tag} boxSize={4} color="blue.500" />
                        <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                          Código / Serial
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="medium">
                        {activo.codigo_Activo}
                      </Text>
                      {activo.numero_Serie && (
                        <Text fontSize="sm" color="gray.600">
                          S/N: {activo.numero_Serie}
                        </Text>
                      )}
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={Package} boxSize={4} color="purple.500" />
                        <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                          Categoría
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="medium">
                        {categoria?.nombre || 'Sin categoría'}
                      </Text>
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={Calendar} boxSize={4} color="green.500" />
                        <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                          Fecha de Adquisición
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="medium">
                        {formatDate(activo.fecha_Adquisicion)}
                      </Text>
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={DollarSign} boxSize={4} color="orange.500" />
                        <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                          Valor de Adquisición
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="bold" color="blue.600">
                        {formatPrice(activo.valor_Adquisicion)}
                      </Text>
                    </Box>

                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={MapPin} boxSize={4} color="red.500" />
                        <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                          Ubicación Física
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="medium">
                        {activo.ubicacion_Fisica || 'Sin ubicación asignada'}
                      </Text>
                    </Box>

                    {activo.vida_Util_Meses && (
                      <Box>
                        <HStack spacing={2} mb={2}>
                          <Icon as={Clock} boxSize={4} color="teal.500" />
                          <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                            Vida Útil
                          </Text>
                        </HStack>
                        <Text fontSize="md" fontWeight="medium">
                          {activo.vida_Util_Meses} meses
                        </Text>
                      </Box>
                    )}

                    {activo.marca && (
                      <Box>
                        <HStack spacing={2} mb={2}>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                            Marca
                          </Text>
                        </HStack>
                        <Text fontSize="md" fontWeight="medium">
                          {activo.marca}
                        </Text>
                      </Box>
                    )}

                    {activo.modelo && (
                      <Box>
                        <HStack spacing={2} mb={2}>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                            Modelo
                          </Text>
                        </HStack>
                        <Text fontSize="md" fontWeight="medium">
                          {activo.modelo}
                        </Text>
                      </Box>
                    )}
                  </SimpleGrid>

                  {activo.observaciones && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={2}>
                          Observaciones
                        </Text>
                        <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">
                          {activo.observaciones}
                        </Text>
                      </Box>
                    </>
                  )}

                  {/* Botón Imprimir QR */}
                  <HStack justify="flex-end" pt={4}>
                    <Button
                      leftIcon={<Icon as={Package} />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={handleImprimirQR}
                      size="md"
                    >
                      Imprimir QR
                    </Button>
                  </HStack>
                </VStack>
              </TabPanel>

              {/* Pestaña 2: Línea de Tiempo */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <List spacing={4}>
                    <ListItem>
                      <HStack align="start" spacing={3}>
                        <ListIcon as={CheckCircle} color="green.500" mt={1} />
                        <Box>
                          <Text fontWeight="bold" fontSize="md">
                            Activo Creado
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {formatDate(activo.fecha_Creacion)}
                          </Text>
                        </Box>
                      </HStack>
                    </ListItem>

                    {activo.fecha_Adquisicion && (
                      <ListItem>
                        <HStack align="start" spacing={3}>
                          <ListIcon as={Calendar} color="blue.500" mt={1} />
                          <Box>
                            <Text fontWeight="bold" fontSize="md">
                              Fecha de Adquisición
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {formatDate(activo.fecha_Adquisicion)}
                              {activo.valor_Adquisicion && (
                                <> - {formatPrice(activo.valor_Adquisicion)}</>
                              )}
                            </Text>
                          </Box>
                        </HStack>
                      </ListItem>
                    )}

                    {mantenimientosActivo.length > 0 &&
                      mantenimientosActivo.map((mant) => (
                        <ListItem key={mant.id}>
                          <HStack align="start" spacing={3}>
                            <ListIcon as={Wrench} color="orange.500" mt={1} />
                            <Box>
                              <Text fontWeight="bold" fontSize="md">
                                Mantenimiento: {mant.tipo_Mantenimiento}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {formatDate(mant.fecha_Realizada || mant.fecha_Programada)} - {mant.descripcion || 'Sin descripción'}
                              </Text>
                            </Box>
                          </HStack>
                        </ListItem>
                      ))}

                    {activo.fecha_Actualizacion && activo.fecha_Actualizacion !== activo.fecha_Creacion && (
                      <ListItem>
                        <HStack align="start" spacing={3}>
                          <ListIcon as={Clock} color="purple.500" mt={1} />
                          <Box>
                            <Text fontWeight="bold" fontSize="md">
                              Última Actualización
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {formatDate(activo.fecha_Actualizacion)}
                            </Text>
                          </Box>
                        </HStack>
                      </ListItem>
                    )}
                  </List>
                </VStack>
              </TabPanel>

              {/* Pestaña 3: Mantenimientos */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  {mantenimientosActivo.length === 0 ? (
                    <Box
                      p={8}
                      textAlign="center"
                      bg="gray.50"
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Icon as={Wrench} boxSize={12} color="gray.400" mb={4} />
                      <Text color="gray.500" fontWeight="medium">
                        No hay mantenimientos registrados para este activo
                      </Text>
                    </Box>
                  ) : (
                    mantenimientosActivo.map((mant) => (
                      <Box
                        key={mant.id}
                        p={4}
                        bg={cardBg}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" mb={3}>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" fontSize="md">
                              {mant.tipo_Mantenimiento}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {formatDate(mant.fecha_Realizada || mant.fecha_Programada)}
                            </Text>
                          </VStack>
                          <Badge colorScheme={mant.estado === 'Completado' ? 'green' : 'yellow'}>
                            {mant.estado}
                          </Badge>
                        </HStack>
                        {mant.descripcion && (
                          <Text fontSize="sm" color="gray.600" mt={2}>
                            {mant.descripcion}
                          </Text>
                        )}
                        {mant.costo && (
                          <Text fontSize="sm" fontWeight="semibold" color="blue.600" mt={2}>
                            Costo: {formatPrice(mant.costo)}
                          </Text>
                        )}
                      </Box>
                    ))
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
