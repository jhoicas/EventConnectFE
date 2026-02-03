/**
 * Auth Service Types and Methods
 * 
 * This module provides TypeScript interfaces and service methods
 * for authentication operations including login and registration.
 */

// ============================================================================
// REGISTRATION PAYLOADS
// ============================================================================

/**
 * Payload for Company/Provider Registration
 * 
 * @endpoint POST /api/Auth/register
 * @example
 * ```typescript
 * const payload: RegisterEmpresaPayload = {
 *   usuario: "admin.empresa",
 *   email: "admin@empresa.com",
 *   password: "SecurePass123",
 *   nombre_Completo: "Juan García",
 *   telefono: "+573001234567",
 *   empresa_Id: 0,  // Always 0 for new companies
 *   rol_Id: 0       // Default role
 * };
 * ```
 */
export interface RegisterEmpresaPayload {
  /** Username for the company admin account */
  usuario: string;
  
  /** Email address */
  email: string;
  
  /** Password (minimum 6 characters recommended) */
  password: string;
  
  /** Full name of the user */
  nombre_Completo: string;
  
  /** Phone number (optional) */
  telefono?: string | null;
  
  /** Company ID (use 0 for new company registration) */
  empresa_Id: number;
  
  /** Role ID (use 0 for default admin provider role) */
  rol_Id: number;
}

/**
 * Payload for Client Registration
 * 
 * @endpoint POST /api/Auth/register-cliente
 * @example
 * ```typescript
 * const payload: RegisterClientePayload = {
 *   email: "cliente@example.com",
 *   password: "SecurePass123",
 *   nombre_Completo: "María López",
 *   telefono: "+573009876543",
 *   documento: "1234567890",
 *   tipo_Documento: "CC",
 *   direccion: "Calle 123 #45-67",
 *   ciudad: "Bogotá",
 *   empresa_Id: 0,
 *   tipo_Cliente: "Natural"
 * };
 * ```
 */
export interface RegisterClientePayload {
  /** Email address */
  email: string;
  
  /** Password (minimum 6 characters recommended) */
  password: string;
  
  /** Full name of the client */
  nombre_Completo: string;
  
  /** Phone number (optional) */
  telefono?: string | null;
  
  /** ID document number (optional) */
  documento?: string | null;
  
  /** Document type: CC (Cédula), TI (Tarjeta), PA (Pasaporte), CE (Extranjería) */
  tipo_Documento?: string | null;
  
  /** Physical address (optional) */
  direccion?: string | null;
  
  /** City (optional) */
  ciudad?: string | null;
  
  /** Company ID (use 0 for independent clients) */
  empresa_Id: number;
  
  /** Client type: 'Natural' for individuals, 'Juridica' for legal entities */
  tipo_Cliente?: string;
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example: Register a Company
 * 
 * ```typescript
 * import { authService } from '@/features/auth/services/authService';
 * import type { RegisterEmpresaPayload } from '@/types';
 * 
 * const registerCompany = async () => {
 *   const data: RegisterEmpresaPayload = {
 *     usuario: "admin.eventos",
 *     email: "admin@eventosespeciales.com",
 *     password: "MySecurePassword123",
 *     nombre_Completo: "Carlos Mendoza",
 *     telefono: "+573001234567",
 *     empresa_Id: 0,
 *     rol_Id: 0
 *   };
 *   
 *   try {
 *     await authService.registerEmpresa(data);
 *     console.log("Company registered successfully!");
 *   } catch (error) {
 *     console.error("Registration failed:", error);
 *   }
 * };
 * ```
 */

/**
 * Example: Register a Client
 * 
 * ```typescript
 * import { authService } from '@/features/auth/services/authService';
 * import type { RegisterClientePayload } from '@/types';
 * 
 * const registerClient = async () => {
 *   const data: RegisterClientePayload = {
 *     email: "maria@gmail.com",
 *     password: "MyPassword123",
 *     nombre_Completo: "María García",
 *     telefono: "+573009876543",
 *     documento: "1052345678",
 *     tipo_Documento: "CC",
 *     direccion: "Carrera 15 #80-45",
 *     ciudad: "Bogotá",
 *     empresa_Id: 0,
 *     tipo_Cliente: "Natural"
 *   };
 *   
 *   try {
 *     await authService.registerCliente(data);
 *     console.log("Client registered successfully!");
 *   } catch (error) {
 *     console.error("Registration failed:", error);
 *   }
 * };
 * ```
 */

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Auth Service Endpoints
 * 
 * | Method | Endpoint | Payload Type | Description |
 * |--------|----------|--------------|-------------|
 * | POST | /api/Auth/register | RegisterEmpresaPayload | Register company/provider |
 * | POST | /api/Auth/register-cliente | RegisterClientePayload | Register client |
 * | POST | /api/Auth/login | LoginRequest | User login |
 * | GET | /api/Auth/me | - | Get current user |
 */

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/Auth/login',
  REGISTER_EMPRESA: '/api/Auth/register',
  REGISTER_CLIENTE: '/api/Auth/register-cliente',
  CURRENT_USER: '/api/Auth/me',
} as const;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates empresa registration payload
 */
export const validateEmpresaPayload = (data: RegisterEmpresaPayload): string[] => {
  const errors: string[] = [];
  
  if (!data.usuario?.trim()) errors.push('Usuario es requerido');
  if (!data.email?.trim()) errors.push('Email es requerido');
  if (!data.password || data.password.length < 6) errors.push('Contraseña debe tener al menos 6 caracteres');
  if (!data.nombre_Completo?.trim()) errors.push('Nombre completo es requerido');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Email inválido');
  
  return errors;
};

/**
 * Validates cliente registration payload
 */
export const validateClientePayload = (data: RegisterClientePayload): string[] => {
  const errors: string[] = [];
  
  if (!data.email?.trim()) errors.push('Email es requerido');
  if (!data.password || data.password.length < 6) errors.push('Contraseña debe tener al menos 6 caracteres');
  if (!data.nombre_Completo?.trim()) errors.push('Nombre completo es requerido');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Email inválido');
  
  return errors;
};
