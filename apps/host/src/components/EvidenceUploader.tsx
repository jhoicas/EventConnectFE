'use client';

import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Icon,
  Image,
  Text,
  useColorMode,
  IconButton,
  useToast,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import {
  Camera,
  Upload,
  X,
  CheckCircle,
} from 'lucide-react';

interface EvidenceUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  label?: string;
}

export const EvidenceUploader = ({
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = 'image/*',
  label = 'Evidencias',
}: EvidenceUploaderProps) => {
  const { colorMode } = useColorMode();
  const [localColorMode, setLocalColorMode] = useState<'light' | 'dark' | 'blue'>('light');
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string }>>([]);

  const cardBg = localColorMode === 'dark' ? '#161b22' : localColorMode === 'blue' ? '#0d1b2a' : '#ffffff';
  const borderColor = localColorMode === 'dark' ? '#30363d' : localColorMode === 'blue' ? '#1e3a5f' : '#e2e8f0';

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviews: Array<{ file: File; preview: string }> = [];

    Array.from(files).forEach((file) => {
      // Validar tamaño
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: 'Archivo muy grande',
          description: `${file.name} excede el tamaño máximo de ${maxSizeMB}MB`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validar tipo
      if (accept.includes('image/*') && !file.type.startsWith('image/')) {
        toast({
          title: 'Tipo de archivo inválido',
          description: 'Solo se permiten imágenes',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (previews.length + newFiles.length >= maxFiles) {
        toast({
          title: 'Límite alcanzado',
          description: `Máximo ${maxFiles} archivos permitidos`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      newFiles.push(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        newPreviews.push({ file, preview });
        
        if (newPreviews.length === newFiles.length) {
          const updatedPreviews = [...previews, ...newPreviews];
          setPreviews(updatedPreviews);
          onFilesChange(updatedPreviews.map((p) => p.file));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    onFilesChange(updatedPreviews.map((p) => p.file));
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="semibold">
          {label}
        </Text>
        <Badge colorScheme="blue" fontSize="xs">
          {previews.length}/{maxFiles}
        </Badge>
      </HStack>

      {/* Botones de acción */}
      <HStack spacing={3}>
        <Button
          flex={1}
          size="lg"
          height="56px"
          leftIcon={<Icon as={Camera} boxSize={5} />}
          colorScheme="blue"
          onClick={handleTakePhoto}
          fontSize="md"
          fontWeight="bold"
          borderRadius="xl"
        >
          Tomar Foto
        </Button>
        <Button
          flex={1}
          size="lg"
          height="56px"
          leftIcon={<Icon as={Upload} boxSize={5} />}
          variant="outline"
          onClick={handleUploadFile}
          fontSize="md"
          fontWeight="medium"
          borderRadius="xl"
        >
          Subir Archivo
        </Button>
      </HStack>

      {/* Inputs ocultos */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Previews */}
      {previews.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {previews.map((item, index) => (
            <Box
              key={index}
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              borderWidth="2px"
              borderColor={borderColor}
              bg={cardBg}
              aspectRatio="1"
            >
              <Image
                src={item.preview}
                alt={`Preview ${index + 1}`}
                w="100%"
                h="100%"
                objectFit="cover"
              />
              <Box
                position="absolute"
                top={2}
                right={2}
                bg="blackAlpha.600"
                borderRadius="full"
                p={1}
              >
                <IconButton
                  aria-label="Eliminar"
                  icon={<X size={16} />}
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemoveFile(index)}
                  color="white"
                />
              </Box>
              <Box
                position="absolute"
                bottom={2}
                left={2}
                bg="green.500"
                borderRadius="full"
                p={1}
              >
                <Icon as={CheckCircle} boxSize={4} color="white" />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {previews.length === 0 && (
        <Box
          p={8}
          textAlign="center"
          bg={cardBg}
          borderRadius="lg"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={borderColor}
        >
          <VStack spacing={3}>
            <Icon as={Camera} boxSize={12} color="gray.400" />
            <Text fontSize="sm" color="gray.500">
              Toma una foto o sube un archivo como evidencia
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
