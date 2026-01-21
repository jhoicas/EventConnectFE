'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button as ChakraButton,
  ButtonProps,
  Input as ChakraInput,
  InputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card as ChakraCard,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Spinner,
  Flex,
  useColorModeValue,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Badge,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon } from '@chakra-ui/icons';
import { FiUser, FiLogOut } from 'react-icons/fi';

// Re-exportar todo de Chakra
export * from "@chakra-ui/react";

// --- ATOMS ---
export interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}
export const Button: React.FC<CustomButtonProps> = ({ children, isLoading, ...props }) => (
  <ChakraButton colorScheme="blue" fontWeight="bold" isLoading={isLoading} {...props}>{children}</ChakraButton>
);

export interface CustomInputProps extends InputProps {
  label?: string;
  error?: string;
}
export const Input: React.FC<CustomInputProps> = ({ label, error, ...props }) => (
  <FormControl isInvalid={!!error}>
    {label && <FormLabel>{label}</FormLabel>}
    <ChakraInput borderColor={useColorModeValue('gray.300', 'gray.600')} {...props} />
    {error && <FormErrorMessage>{error}</FormErrorMessage>}
  </FormControl>
);

export const Card: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  return (
    <ChakraCard bg={bg} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
      {title && <CardHeader borderBottomWidth="1px" borderColor={borderColor} py={4}><Heading size="md">{title}</Heading></CardHeader>}
      <CardBody>{children}</CardBody>
    </ChakraCard>
  );
};

export const Loading: React.FC<{ text?: string }> = ({ text = "Cargando..." }) => (
  <Flex justify="center" align="center" direction="column" h="100%" minH="200px" gap={4}>
    <Spinner size="xl" color="blue.500" thickness="4px" />
    <Text color="gray.500" fontWeight="medium">{text}</Text>
  </Flex>
);

export const ErrorMessage: React.FC<{ title?: string; message: string }> = ({ title = "Error", message }) => (
  <Box p={4} bg="red.50" color="red.700" borderRadius="md" borderWidth="1px" borderColor="red.200">
    <Text fontWeight="bold">{title}</Text>
    <Text fontSize="sm">{message}</Text>
  </Box>
);

// --- MOLECULES ---
export const FormContainer: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  footer?: React.ReactNode;
}> = ({ title, description, children, onSubmit, footer }) => (
  <Box w="full" maxW="md" mx="auto">
    <Card>
      <VStack spacing={6} as="form" onSubmit={onSubmit} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>{title}</Heading>
          {description && <Text color="gray.500">{description}</Text>}
        </Box>
        <VStack spacing={4} align="stretch">{children}</VStack>
        {footer && <Box pt={2}>{footer}</Box>}
      </VStack>
    </Card>
  </Box>
);

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  width?: string;
  hideOnMobile?: boolean;
}
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
}
export function DataTable<T>({ data, columns, isLoading }: DataTableProps<T>) {
  if (isLoading) return <Loading />;
  if (!data || data.length === 0) return <Box p={8} textAlign="center"><Text color="gray.500">No hay datos</Text></Box>;
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((col, idx) => (
              <Th key={idx} width={col.width} display={col.hideOnMobile ? { base: 'none', md: 'table-cell' } : 'table-cell'}>{col.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, rowIdx) => (
            <Tr key={rowIdx}>
              {columns.map((col, colIdx) => (
                <Td key={colIdx} display={col.hideOnMobile ? { base: 'none', md: 'table-cell' } : 'table-cell'}>
                  {col.cell ? col.cell(item) : (item as any)[col.accessor]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

// --- ORGANISMS ---
export interface NavbarProps {
  title: string;
  username?: string;
  userAvatar?: string;
  userRole?: string;
  userEmail?: string;
  pendingUsersCount?: number;
  onMenuClick: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onLogout: () => void;
}
export const Navbar: React.FC<NavbarProps> = ({ title, username, userAvatar, userRole, userEmail, pendingUsersCount, onMenuClick, onProfileClick, onNotificationClick, onLogout }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  return (
    <Flex as="header" position="sticky" top={0} zIndex={1000} bg={bg} h="64px" px={4} align="center" justify="space-between" borderBottomWidth="1px" borderColor={borderColor} boxShadow="sm">
      <HStack spacing={4}>
        <IconButton aria-label="Menu" icon={<HamburgerIcon />} variant="ghost" onClick={onMenuClick} />
        <Heading size="md" color="blue.500">{title}</Heading>
      </HStack>
      <HStack spacing={3}>
        {pendingUsersCount !== undefined && pendingUsersCount > 0 && (
           <IconButton aria-label="Notifications" icon={<Box position="relative"><BellIcon boxSize={5} /><Badge position="absolute" top="-1px" right="-1px" colorScheme="red" borderRadius="full" boxSize="16px" fontSize="xs" display="flex" alignItems="center" justifyContent="center">{pendingUsersCount}</Badge></Box>} variant="ghost" onClick={onNotificationClick} />
        )}
        <Menu>
          <MenuButton as={Button} variant="ghost" rightIcon={<Avatar size="xs" src={userAvatar} name={username} />} px={2}>
            <Box textAlign="right" display={{ base: 'none', md: 'block' }} mr={2}>
              <Text fontSize="sm" fontWeight="bold">{username}</Text>
              <Text fontSize="xs" color="gray.500">{userRole}</Text>
            </Box>
          </MenuButton>
          <MenuList>
            <Box px={4} py={2} display={{ base: 'block', md: 'none' }}><Text fontWeight="bold">{username}</Text><Text fontSize="sm" color="gray.500">{userEmail}</Text></Box>
            <MenuDivider display={{ base: 'block', md: 'none' }} />
            <MenuItem icon={<FiUser />} onClick={onProfileClick}>Mi Perfil</MenuItem>
            <MenuDivider />
            <MenuItem icon={<FiLogOut />} onClick={onLogout} color="red.500">Cerrar Sesión</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export interface MenuItemType { 
  label: string; 
  icon: React.ElementType; 
  href?: string; 
  isActive?: boolean;
  submenu?: MenuItemType[];
}
export interface SidebarProps { 
  isOpen: boolean; 
  onClose: () => void; 
  items: MenuItemType[]; 
  onItemClick: (href: string) => void; 
}

const SidebarMenuItem: React.FC<{
  item: MenuItemType;
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick: (href: string) => void;
  onClose?: () => void;
  router?: any;
  isMobile?: boolean;
  level?: number;
}> = ({ item, isExpanded, onToggle, onItemClick, onClose, router, isMobile, level = 0 }) => {
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  // Usar isMobile del prop si está disponible, sino usar hook
  const isMobileValue = isMobile !== undefined ? isMobile : useBreakpointValue({ base: true, md: false });

  // Esta función ya no se usa, la lógica está inline arriba

  // Si tiene submenú, solo toggle, no navegar
  if (hasSubmenu) {
    return (
      <Box>
        <Box
          as={ChakraButton}
          variant="ghost"
          w="100%"
          justifyContent="flex-start"
          leftIcon={<item.icon />}
          rightIcon={<Box transform={isExpanded ? 'rotate(180deg)' : 'rotate(0)'} transition="transform 0.2s">▼</Box>}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          borderRadius="0"
          position="relative"
          bg={item.isActive ? activeBg : 'transparent'}
          color={item.isActive ? activeColor : 'inherit'}
          _hover={{
            bg: item.isActive ? activeBg : hoverBg,
          }}
          _before={item.isActive ? {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            bg: 'blue.500',
            borderRadius: '0 4px 4px 0',
          } : undefined}
          pl={4}
          fontWeight={item.isActive ? 'semibold' : 'normal'}
          fontSize="sm"
          type="button"
        >
          {item.label}
        </Box>
        {isExpanded && (
          <VStack align="stretch" spacing={0} pl={4} py={1}>
            {item.submenu!.map((subitem) => {
              // Si el subitem tiene href válido, usar navegación directa
              if (subitem.href && subitem.href !== '#') {
                return (
                  <ChakraButton
                    key={subitem.href}
                    variant="ghost"
                    w="100%"
                    justifyContent="flex-start"
                    leftIcon={<subitem.icon />}
                    borderRadius="0"
                    position="relative"
                    bg={subitem.isActive ? activeBg : 'transparent'}
                    color={subitem.isActive ? activeColor : 'inherit'}
                    _hover={{
                      bg: subitem.isActive ? activeBg : hoverBg,
                    }}
                    _before={subitem.isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      bg: 'blue.400',
                    } : undefined}
                    pl={8}
                    fontSize="xs"
                    fontWeight={subitem.isActive ? 'semibold' : 'normal'}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      console.log('Click en subitem:', subitem.href);
                      e.preventDefault();
                      e.stopPropagation();
                      // Navegación directa - usar router.push inmediatamente
                      if (subitem.href && subitem.href !== '#') {
                        console.log('Navegando a:', subitem.href);
                        // Prioridad: router directo > onItemClick
                        if (router) {
                          router.push(subitem.href);
                        }
                        if (onItemClick) {
                          onItemClick(subitem.href);
                        }
                        // Cerrar solo en móvil
                        if (isMobileValue && onClose) {
                          setTimeout(() => {
                            onClose();
                          }, 200);
                        }
                      }
                    }}
                    type="button"
                    cursor="pointer"
                    pointerEvents="auto"
                  >
                    {subitem.label}
                  </ChakraButton>
                );
              }
              return null;
            })}
          </VStack>
        )}
      </Box>
    );
  }

  // Si no tiene submenú y tiene href válido, usar navegación directa
  if (item.href && item.href !== '#') {
    return (
      <ChakraButton
        variant="ghost"
        w="100%"
        justifyContent="flex-start"
        leftIcon={<item.icon />}
        borderRadius="0"
        position="relative"
        bg={item.isActive ? activeBg : 'transparent'}
        color={item.isActive ? activeColor : 'inherit'}
        _hover={{
          bg: item.isActive ? activeBg : hoverBg,
        }}
        _before={item.isActive ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          bg: 'blue.500',
          borderRadius: '0 4px 4px 0',
        } : undefined}
        pl={4}
        fontWeight={item.isActive ? 'semibold' : 'normal'}
        fontSize="sm"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          console.log('Click en item:', item.href);
          e.preventDefault();
          e.stopPropagation();
          // Navegación directa - usar router.push inmediatamente
          if (item.href && item.href !== '#') {
            console.log('Navegando a:', item.href);
            // Prioridad: router directo > onItemClick
            if (router) {
              router.push(item.href);
            }
            if (onItemClick) {
              onItemClick(item.href);
            }
            // Cerrar solo en móvil
            if (isMobileValue && onClose) {
              setTimeout(() => {
                onClose();
              }, 200);
            }
          }
        }}
        type="button"
        cursor="pointer"
        pointerEvents="auto"
      >
        {item.label}
      </ChakraButton>
    );
  }

  // Fallback para items sin href
  return (
    <Box
      as={ChakraButton}
      variant="ghost"
      w="100%"
      justifyContent="flex-start"
      leftIcon={<item.icon />}
      borderRadius="0"
      position="relative"
      bg={item.isActive ? activeBg : 'transparent'}
      color={item.isActive ? activeColor : 'inherit'}
      _hover={{
        bg: item.isActive ? activeBg : hoverBg,
      }}
      pl={4}
      fontWeight={item.isActive ? 'semibold' : 'normal'}
      fontSize="sm"
      type="button"
      isDisabled
    >
      {item.label}
    </Box>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, items, onItemClick }) => {
  const router = useRouter();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  // Handler para items navegables - ejecuta navegación directamente
  const handleItemNavigation = (href: string) => {
    if (href && href !== '#') {
      // Ejecutar navegación directamente con router.push
      router.push(href);
      // También notificar al padre por si acaso
      if (onItemClick) {
        onItemClick(href);
      }
      // Cerrar solo en móvil
      if (isMobile && onClose) {
        setTimeout(() => {
          onClose();
        }, 200);
      }
    }
  };

  const SidebarContent = (
    <VStack align="stretch" spacing={0} h="100%" py={4}>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.label}
          item={item}
          isExpanded={expandedItems.includes(item.label)}
          onToggle={() => toggleItem(item.label)}
          onItemClick={handleItemNavigation}
          onClose={onClose}
          router={router}
          isMobile={isMobile}
        />
      ))}
    </VStack>
  );

  return (
    <>
      <Drawer 
        isOpen={isOpen} 
        placement="left" 
        onClose={onClose}
        size="xs"
        closeOnOverlayClick={true}
        closeOnEsc={true}
        blockScrollOnMount={false}
      >
        <DrawerOverlay display={{ md: 'none' }} />
        <DrawerContent display={{ md: 'none' }} bg={bg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menú</DrawerHeader>
          <DrawerBody p={0}>
            {SidebarContent}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box
        display={{ base: 'none', md: isOpen ? 'block' : 'none' }}
        w="250px"
        pos="fixed"
        left="0"
        top="64px"
        h="calc(100vh - 64px)"
        bg={bg}
        borderRightWidth="1px"
        borderColor={borderColor}
        overflowY="auto"
        zIndex={1000}
        transition="transform 0.3s ease-in-out"
        transform={{ base: 'none', md: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        pointerEvents="auto"
      >
        {SidebarContent}
      </Box>
    </>
  );
};
