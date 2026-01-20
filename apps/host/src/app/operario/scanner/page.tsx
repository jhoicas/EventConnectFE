'use client';

import { useState, useEffect, useRef } from 'react';
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
  useToast,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Package,
  Truck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { useGetActivosQuery, type Activo } from '../../../store/api/activoApi';

export default function ScannerPage() {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [activoEncontrado, setActivoEncontrado] = useState<Activo | null>(null);
  const [showActivoModal, setShowActivoModal] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementRef = useRef<HTMLDivElement>(null);

  const { data: activos = [] } = useGetActivosQuery();

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  // Inicializar escáner QR
  useEffect(() => {
    if (isScanning && scannerElementRef.current && !scannerRef.current) {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: 'environment' }, // Cámara trasera en móvil
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Código QR detectado
            handleQRDetected(decodedText);
          },
          (errorMessage) => {
            // Ignorar errores de escaneo continuo
          }
        )
        .catch((err) => {
          console.error('Error al iniciar escáner:', err);
          toast({
            title: 'Error de cámara',
            description: 'No se pudo acceder a la cámara. Verifica los permisos.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          setIsScanning(false);
        });
    }

    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current = null;
          })
          .catch(() => {
            scannerRef.current = null;
          });
      }
    };
  }, [isScanning, toast]);

  const handleQRDetected = (decodedText: string) => {
    // Detener el escáner
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
        setIsScanning(false);
      });
    }

    setScanResult(decodedText);

    // Buscar activo por código (formato: ACT-XXXX o similar)
    const activo = activos.find(
      (a) => a.codigo_Activo === decodedText || a.qr_Code === decodedText
    );

    if (activo) {
      setActivoEncontrado(activo);
      setShowActivoModal(true);
      toast({
        title: 'Activo encontrado',
        description: `${activo.nombre} (${activo.codigo_Activo})`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Si no es un activo, podría ser una reserva
      toast({
        title: 'Código QR leído',
        description: `Código: ${decodedText}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    setActivoEncontrado(null);
    setShowActivoModal(false);
  };

  const handleStopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current = null;
          setIsScanning(false);
        })
        .catch(() => {
          scannerRef.current = null;
          setIsScanning(false);
        });
    }
  };

  const handleAgregarAEntrega = () => {
    if (activoEncontrado) {
      toast({
        title: 'Activo agregado',
        description: `${activoEncontrado.nombre} agregado a la entrega`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setShowActivoModal(false);
      handleStopScanning();
      // TODO: Agregar a lista de activos de la entrega
    }
  };

  const handleVerDetalle = () => {
    if (activoEncontrado) {
      router.push(`/activos?id=${activoEncontrado.id}`);
      setShowActivoModal(false);
    }
  };

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';
  const scannerBg = localColorMode === 'dark' ? '#000000' : '#1a1a1a';

  return (
    <Box bg={bgColor} minH="100vh" pb={8}>
      <Container maxW="container.sm" py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={2}>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Icon as={ArrowLeft} />}
                onClick={() => router.back()}
              >
                Volver
              </Button>
            </HStack>
            <HStack spacing={3} mt={2}>
              <Icon as={QrCode} boxSize={6} color="blue.500" />
              <Heading size={{ base: "lg", md: "xl" }} fontWeight="bold">
                Escáner QR
              </Heading>
            </HStack>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
              Escanea el código QR del activo o reserva
            </Text>
          </VStack>

          {/* Área de Escaneo */}
          <Card
            bg={cardBg}
            borderWidth="2px"
            borderColor={borderColor}
            borderRadius="xl"
            overflow="hidden"
          >
            <CardBody p={0}>
              <VStack spacing={0}>
                {/* Contenedor del escáner */}
                <Box
                  w="100%"
                  aspectRatio="1"
                  bg={scannerBg}
                  position="relative"
                  borderBottomWidth="2px"
                  borderColor={borderColor}
                  id="qr-reader"
                  ref={scannerElementRef}
                >
                  {!isScanning && (
                    <Center
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg={scannerBg}
                      zIndex={10}
                    >
                      <VStack spacing={4}>
                        <Icon as={Camera} boxSize={20} color="gray.400" />
                        <Text color="gray.400" fontSize="sm" textAlign="center" px={4}>
                          Presiona "Iniciar Escaneo" para activar la cámara
                        </Text>
                        {/* Marco de guía */}
                        <Box
                          w="250px"
                          h="250px"
                          border="3px dashed"
                          borderColor="gray.500"
                          borderRadius="lg"
                          opacity={0.5}
                        />
                      </VStack>
                    </Center>
                  )}
                </Box>

                {/* Controles */}
                <Box p={6} w="100%">
                  {!isScanning ? (
                    <Button
                      size="lg"
                      height="56px"
                      w="100%"
                      colorScheme="blue"
                      leftIcon={<Icon as={QrCode} boxSize={5} />}
                      onClick={handleStartScanning}
                      fontSize="md"
                      fontWeight="bold"
                      borderRadius="xl"
                    >
                      Iniciar Escaneo
                    </Button>
                  ) : (
                    <VStack spacing={3}>
                      <HStack spacing={3} w="100%">
                        <Button
                          flex={1}
                          size="lg"
                          height="56px"
                          variant="outline"
                          colorScheme="red"
                          onClick={handleStopScanning}
                          fontSize="md"
                          fontWeight="medium"
                        >
                          Detener
                        </Button>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Apunta la cámara al código QR
                      </Text>
                    </VStack>
                  )}
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Resultado del escaneo */}
          {scanResult && !showActivoModal && (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Código QR leído</AlertTitle>
                <AlertDescription fontSize="sm" fontFamily="mono">
                  {scanResult}
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Instrucciones */}
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
          >
            <CardBody p={4}>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" fontWeight="semibold">
                  Instrucciones:
                </Text>
                <Text fontSize="xs" color="gray.600">
                  • Asegúrate de tener permisos de cámara activados
                  <br />
                  • Mantén el código QR bien iluminado y enfocado
                  <br />
                  • Mantén el dispositivo estable durante el escaneo
                  <br />
                  • El escáner se detendrá automáticamente al detectar un código
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Modal de Activo Encontrado */}
      <Modal
        isOpen={showActivoModal}
        onClose={() => setShowActivoModal(false)}
        size={{ base: 'full', md: 'md' }}
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={Package} boxSize={6} color="green.500" />
              <VStack align="start" spacing={0}>
                <Text>Activo Encontrado</Text>
                <Text fontSize="sm" color="gray.500" fontWeight="normal">
                  {activoEncontrado?.codigo_Activo}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {activoEncontrado ? (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    {activoEncontrado.nombre}
                  </Text>
                  {activoEncontrado.descripcion && (
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {activoEncontrado.descripcion}
                    </Text>
                  )}
                </Box>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">
                    Estado:
                  </Text>
                  <Badge
                    colorScheme={
                      activoEncontrado.estado === 'Disponible' || activoEncontrado.estado === 'Activo'
                        ? 'green'
                        : activoEncontrado.estado === 'Alquilado'
                        ? 'blue'
                        : activoEncontrado.estado === 'En Mantenimiento' || activoEncontrado.estado === 'Mantenimiento'
                        ? 'red'
                        : 'gray'
                    }
                    fontSize="sm"
                    px={2}
                    py={1}
                  >
                    {activoEncontrado.estado}
                  </Badge>
                </HStack>

                {activoEncontrado.ubicacion_Fisica && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.500">
                      Ubicación:
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {activoEncontrado.ubicacion_Fisica}
                    </Text>
                  </HStack>
                )}

                <Alert status="success" borderRadius="lg" mt={2}>
                  <AlertIcon />
                  <Text fontSize="sm">
                    Activo identificado correctamente
                  </Text>
                </Alert>
              </VStack>
            ) : (
              <Center py={8}>
                <Spinner size="xl" color="blue.500" />
              </Center>
            )}
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3} w="100%">
              <Button
                flex={1}
                variant="outline"
                onClick={() => setShowActivoModal(false)}
              >
                Cerrar
              </Button>
              <Button
                flex={1}
                colorScheme="blue"
                leftIcon={<Icon as={Truck} />}
                onClick={handleAgregarAEntrega}
              >
                Agregar a Entrega
              </Button>
              <Button
                flex={1}
                colorScheme="green"
                variant="outline"
                onClick={handleVerDetalle}
              >
                Ver Detalle
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
