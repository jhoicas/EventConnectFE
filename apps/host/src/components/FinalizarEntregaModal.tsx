'use client';

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  Icon,
  Text,
  Divider,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  CheckCircle,
  X,
  Package,
} from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { EvidenceUploader } from './EvidenceUploader';

interface FinalizarEntregaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tareaId: number;
  cliente: string;
  onConfirm: (data: { signature: string; evidence: File[] }) => void;
}

export const FinalizarEntregaModal = ({
  isOpen,
  onClose,
  tareaId,
  cliente,
  onConfirm,
}: FinalizarEntregaModalProps) => {
  const toast = useToast();
  const [signature, setSignature] = useState<string>('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleSignatureSave = (signatureData: string) => {
    setSignature(signatureData);
    toast({
      title: 'Firma guardada',
      description: 'Firma digital capturada correctamente',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    // Avanzar a la siguiente pestaña
    if (activeTab === 0) {
      setActiveTab(1);
    }
  };

  const handleEvidenceChange = (files: File[]) => {
    setEvidenceFiles(files);
  };

  const handleConfirm = () => {
    if (!signature) {
      toast({
        title: 'Firma requerida',
        description: 'Debes capturar la firma del cliente antes de finalizar',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setActiveTab(0);
      return;
    }

    onConfirm({
      signature,
      evidence: evidenceFiles,
    });

    toast({
      title: 'Entrega finalizada',
      description: `La entrega para ${cliente} ha sido registrada exitosamente`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // Reset
    setSignature('');
    setEvidenceFiles([]);
    setActiveTab(0);
    onClose();
  };

  const handleCancel = () => {
    setSignature('');
    setEvidenceFiles([]);
    setActiveTab(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size={{ base: 'full', md: '2xl' }}
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={Package} boxSize={6} color="green.500" />
            <VStack align="start" spacing={0}>
              <Text>Finalizar Entrega</Text>
              <Text fontSize="sm" color="gray.500" fontWeight="normal">
                {cliente}
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab} colorScheme="green">
            <TabList>
              <Tab fontSize={{ base: 'sm', md: 'md' }}>
                Firma del Cliente
              </Tab>
              <Tab fontSize={{ base: 'sm', md: 'md' }}>
                Evidencias {evidenceFiles.length > 0 && `(${evidenceFiles.length})`}
              </Tab>
            </TabList>

            <TabPanels>
              {/* Pestaña 1: Firma */}
              <TabPanel px={0} py={6}>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    El cliente debe firmar para confirmar la recepción de los equipos
                  </Text>
                  <SignaturePad
                    onSave={handleSignatureSave}
                    width={600}
                    height={250}
                    label="Firma del Cliente"
                  />
                  {signature && (
                    <HStack spacing={2} p={3} bg="green.50" borderRadius="lg" borderWidth="1px" borderColor="green.200">
                      <Icon as={CheckCircle} boxSize={5} color="green.500" />
                      <Text fontSize="sm" color="green.700" fontWeight="medium">
                        Firma capturada correctamente
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </TabPanel>

              {/* Pestaña 2: Evidencias */}
              <TabPanel px={0} py={6}>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Agrega fotos o documentos como evidencia de la entrega
                  </Text>
                  <EvidenceUploader
                    onFilesChange={handleEvidenceChange}
                    maxFiles={5}
                    maxSizeMB={5}
                    label="Evidencias de Entrega"
                  />
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3} w="100%">
            <Button
              flex={1}
              variant="outline"
              leftIcon={<Icon as={X} />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              flex={1}
              colorScheme="green"
              leftIcon={<Icon as={CheckCircle} />}
              onClick={handleConfirm}
              isDisabled={!signature}
              fontWeight="bold"
            >
              Finalizar Entrega
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
