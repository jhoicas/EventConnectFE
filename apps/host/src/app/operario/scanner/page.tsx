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
  useToast,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScannerPage() {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';
  const scannerBg = localColorMode === 'dark' ? '#000000' : '#1a1a1a';

  const handleSimularEscaneo = () => {
    setIsScanning(true);
    setScanResult(null);
    setScanSuccess(null);

    // Simular proceso de escaneo
    setTimeout(() => {
      const exito = Math.random() > 0.3; // 70% de éxito
      const codigoQR = exito ? `RES-${Math.floor(Math.random() * 10000)}` : null;

      setIsScanning(false);
      setScanResult(codigoQR);
      setScanSuccess(exito);

      if (exito && codigoQR) {
        toast({
          title: 'Escaneo exitoso',
          description: `Código QR leído: ${codigoQR}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Escaneo fallido',
          description: 'No se pudo leer el código QR. Intenta nuevamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }, 2000);
  };

  const handleReset = () => {
    setScanResult(null);
    setScanSuccess(null);
    setIsScanning(false);
  };

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
              Escanea el código QR de la reserva para registrar la entrega
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
                {/* Vista simulada de cámara */}
                <Box
                  w="100%"
                  aspectRatio="1"
                  bg={scannerBg}
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderBottomWidth="2px"
                  borderColor={borderColor}
                >
                  {isScanning ? (
                    <VStack spacing={4}>
                      <Box
                        position="relative"
                        w="200px"
                        h="200px"
                        border="4px solid"
                        borderColor="blue.500"
                        borderRadius="lg"
                        animation="pulse 2s infinite"
                      >
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          w="100%"
                          h="100%"
                          border="2px solid"
                          borderColor="blue.300"
                          borderRadius="lg"
                          opacity={0.5}
                        />
                      </Box>
                      <Text color="white" fontSize="sm" fontWeight="medium">
                        Escaneando...
                      </Text>
                    </VStack>
                  ) : scanSuccess === true ? (
                    <VStack spacing={4}>
                      <Icon as={CheckCircle} boxSize={16} color="green.400" />
                      <Text color="white" fontSize="lg" fontWeight="bold">
                        Escaneo Exitoso
                      </Text>
                      {scanResult && (
                        <Text color="blue.300" fontSize="sm" fontFamily="mono">
                          {scanResult}
                        </Text>
                      )}
                    </VStack>
                  ) : scanSuccess === false ? (
                    <VStack spacing={4}>
                      <Icon as={XCircle} boxSize={16} color="red.400" />
                      <Text color="white" fontSize="lg" fontWeight="bold">
                        Escaneo Fallido
                      </Text>
                    </VStack>
                  ) : (
                    <VStack spacing={4}>
                      <Icon as={Camera} boxSize={20} color="gray.400" />
                      <Text color="gray.400" fontSize="sm" textAlign="center" px={4}>
                        Área de escaneo
                        <br />
                        Coloca el código QR dentro del marco
                      </Text>
                      {/* Marco de guía */}
                      <Box
                        position="absolute"
                        w="200px"
                        h="200px"
                        border="3px dashed"
                        borderColor="gray.500"
                        borderRadius="lg"
                        opacity={0.5}
                      />
                    </VStack>
                  )}
                </Box>

                {/* Controles */}
                <Box p={6} w="100%">
                  {scanSuccess === null ? (
                    <Button
                      size="lg"
                      height="56px"
                      w="100%"
                      colorScheme="blue"
                      leftIcon={<Icon as={QrCode} boxSize={5} />}
                      onClick={handleSimularEscaneo}
                      isLoading={isScanning}
                      loadingText="Escaneando..."
                      fontSize="md"
                      fontWeight="bold"
                      borderRadius="xl"
                    >
                      Simular Escaneo Exitoso
                    </Button>
                  ) : (
                    <VStack spacing={3}>
                      {scanSuccess && scanResult && (
                        <Alert status="success" borderRadius="lg">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Código QR leído correctamente</AlertTitle>
                            <AlertDescription fontSize="sm">
                              Reserva: {scanResult}
                            </AlertDescription>
                          </Box>
                        </Alert>
                      )}
                      <HStack spacing={3} w="100%">
                        <Button
                          flex={1}
                          size="lg"
                          height="56px"
                          variant="outline"
                          onClick={handleReset}
                          fontSize="md"
                          fontWeight="medium"
                        >
                          Escanear Otro
                        </Button>
                        {scanSuccess && (
                          <Button
                            flex={1}
                            size="lg"
                            height="56px"
                            colorScheme="green"
                            onClick={() => {
                              toast({
                                title: 'Entrega registrada',
                                description: `La entrega para ${scanResult} ha sido registrada exitosamente.`,
                                status: 'success',
                                duration: 5000,
                                isClosable: true,
                              });
                              handleReset();
                            }}
                            fontSize="md"
                            fontWeight="bold"
                          >
                            Confirmar Entrega
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  )}
                </Box>
              </VStack>
            </CardBody>
          </Card>

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
                  • Asegúrate de que el código QR esté bien iluminado
                  <br />
                  • Mantén el dispositivo estable durante el escaneo
                  <br />
                  • Acerca el código QR al centro del marco
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
