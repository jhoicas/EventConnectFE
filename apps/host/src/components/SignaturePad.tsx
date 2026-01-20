'use client';

import { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  Box,
  VStack,
  HStack,
  Button,
  Icon,
  Text,
  useColorMode,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  X,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  onCancel?: () => void;
  width?: number;
  height?: number;
  label?: string;
}

export const SignaturePad = ({
  onSave,
  onCancel,
  width = 400,
  height = 200,
  label = 'Firma Digital',
}: SignaturePadProps) => {
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('chakra-ui-color-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'blue') {
      setLocalColorMode(stored);
    }
  }, [colorMode]);

  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';
  const canvasBg = localColorMode === 'dark' ? '#ffffff' : '#ffffff';

  const handleClear = () => {
    signatureRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL('image/png');
      onSave(dataURL);
      setIsEmpty(false);
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
  };

  const handleEnd = () => {
    if (signatureRef.current) {
      setIsEmpty(signatureRef.current.isEmpty());
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="md" fontWeight="semibold">
          {label}
        </Text>
        {!isEmpty && (
          <HStack spacing={2}>
            <Button
              size="sm"
              leftIcon={<Icon as={RotateCcw} />}
              variant="outline"
              onClick={handleClear}
              fontSize="xs"
            >
              Limpiar
            </Button>
          </HStack>
        )}
      </HStack>

      <Alert status="info" borderRadius="lg" fontSize="sm">
        <AlertIcon />
        <Text>
          Firma en el área de abajo usando tu dedo o mouse
        </Text>
      </Alert>

      {/* Canvas de firma */}
      <Box
        bg={cardBg}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        p={4}
        position="relative"
      >
        <Box
          bg={canvasBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          position="relative"
          w="100%"
          h={{ base: '200px', md: `${height}px` }}
          touchAction="none"
        >
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: typeof window !== 'undefined' ? Math.min(width, window.innerWidth - 80) : width,
              height: height,
              className: 'signature-canvas',
              style: {
                width: '100%',
                height: '100%',
                touchAction: 'none',
              },
            }}
            backgroundColor={canvasBg}
            penColor="#000000"
            onBegin={handleBegin}
            onEnd={handleEnd}
          />
        </Box>
      </Box>

      {/* Botones de acción */}
      <HStack spacing={3}>
        {onCancel && (
          <Button
            flex={1}
            size="lg"
            height="56px"
            variant="outline"
            leftIcon={<Icon as={X} />}
            onClick={onCancel}
            fontSize="md"
            fontWeight="medium"
          >
            Cancelar
          </Button>
        )}
        <Button
          flex={1}
          size="lg"
          height="56px"
          colorScheme="green"
          leftIcon={<Icon as={CheckCircle} />}
          onClick={handleSave}
          isDisabled={isEmpty}
          fontSize="md"
          fontWeight="bold"
        >
          Confirmar Firma
        </Button>
      </HStack>

      <Text fontSize="xs" color="gray.500" textAlign="center">
        Al confirmar, la firma será guardada como evidencia de la entrega
      </Text>
    </VStack>
  );
};
