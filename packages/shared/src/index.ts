export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTOS: '/productos',
  CATEGORIAS: '/categorias',
  CLIENTES: '/clientes',
  RESERVAS: '/reservas',
  ACTIVOS: '/activos',
  BODEGAS: '/bodegas',
  LOTES: '/lotes',
  MANTENIMIENTOS: '/mantenimientos',
  USUARIOS: '/usuarios',
  CONFIGURACION: '/configuracion',
  CHAT: '/chat',
  PERFIL: '/perfil',
};

export const API_ENDPOINTS = {
  LOGIN: '/Auth/login',
  PRODUCTOS: '/Producto',
  CATEGORIAS: '/Categoria',
  CLIENTES: '/Cliente',
  RESERVAS: '/Reserva',
  ACTIVOS: '/Activo',
  BODEGAS: '/Bodega',
  LOTES: '/Lote',
  MANTENIMIENTOS: '/Mantenimiento',
  USUARIOS: '/Usuario',
};

// Interfaces comunes
export interface User {
  id: number;
  email: string;
  nombre_Completo: string;
  rol: string;
  token?: string;
  avatar_URL?: string;
  telefono?: string;
}

export interface LoginResponse {
  token: string;
  usuario: User;
  expiration: string;
}

export interface LoginRequest {
  Username: string;
  Password: string;
}

// Tipos de Cotización
export interface Cotizacion {
  [key: string]: any;
}

export interface CreateCotizacionRequest {
  [key: string]: any;
}

export interface UpdateCotizacionRequest {
  [key: string]: any;
}

export interface ConvertirCotizacionRequest {
  [key: string]: any;
}

export interface ExtenderVencimientoRequest {
  [key: string]: any;
}

export interface EstadisticasCotizaciones {
  [key: string]: any;
}

// Tipos de Pago
export interface TransaccionPago {
  [key: string]: any;
}

export interface CreateTransaccionPagoRequest {
  [key: string]: any;
}

export interface ResumenPagos {
  transacciones: any[];
  [key: string]: any;
}

