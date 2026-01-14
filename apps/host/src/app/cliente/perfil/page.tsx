'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Text,
  VStack,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  useColorMode,
  Card,
  CardBody,
  Divider,
  HStack,
  Icon,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { CreditCard, HelpCircle, LogOut, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../store/store';

export default function PerfilPage() {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  const bgColor = localColorMode === 'dark' ? '#0d1117' : localColorMode === 'blue' ? '#0a1929' : '#f7fafc';
  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  // Obtener datos del usuario autenticado
  const usuario = {
    nombre: user?.nombre_Completo || 'Usuario',
    email: user?.email || '',
    telefono: user?.telefono || 'No registrado',
    avatar: (user?.avatar_URL && user.avatar_URL.trim() !== '') 
      ? user.avatar_URL 
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre_Completo || 'U')}&background=6366f1&color=fff&size=150`,
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.lg" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold">
              Mi Perfil
            </Text>
            <Text fontSize="sm" color="gray.500">
              Gestiona tu información personal y preferencias
            </Text>
          </VStack>

          {/* Avatar y Datos Principales */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack spacing={4}>
                <Avatar src={usuario.avatar} size="2xl" />
                <VStack spacing={0}>
                  <Text fontSize="xl" fontWeight="bold">
                    {usuario.nombre}
                  </Text>
                  <Badge colorScheme="blue">Cliente Verificado</Badge>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Información Personal */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    Información Personal
                  </Text>
                  <Button size="sm" leftIcon={<Icon as={Edit2} />} variant="ghost">
                    Editar
                  </Button>
                </HStack>
                <Divider />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Nombre Completo</FormLabel>
                    <Input value={usuario.nombre} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Email</FormLabel>
                    <Input value={usuario.email} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Teléfono</FormLabel>
                    <Input value={usuario.telefono} isReadOnly />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Opciones */}
          <VStack spacing={3}>
            <Button
              w="full"
              justifyContent="start"
              leftIcon={<Icon as={CreditCard} />}
              variant="outline"
              size="lg"
            >
              Métodos de Pago
            </Button>
            <Button
              w="full"
              justifyContent="start"
              leftIcon={<Icon as={HelpCircle} />}
              variant="outline"
              size="lg"
            >
              Ayuda y Soporte
            </Button>
            <Button
              w="full"
              justifyContent="start"
              leftIcon={<Icon as={LogOut} />}
              colorScheme="red"
              variant="outline"
              size="lg"
              onClick={() => {
                localStorage.clear();
                router.push('/login');
              }}
            >
              Cerrar Sesión
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}