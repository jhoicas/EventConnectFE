export const APP_ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/registro',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  
  // Cliente routes
  CLIENTE_EXPLORAR: '/cliente/explorar',
  CLIENTE_COTIZACIONES: '/cliente/cotizaciones',
  CLIENTE_RESERVAS: '/cliente/reservas',
  CLIENTE_MENSAJES: '/cliente/mensajes',
  CLIENTE_PERFIL: '/cliente/perfil',
  
  // Catálogo
  CATEGORIAS: '/categorias',
  PRODUCTOS: '/productos',
  
  // Gestión
  CLIENTES: '/clientes',
  RESERVAS: '/reservas',
  RESERVAS_CALENDARIO: '/reservas/calendario',
  CHAT: '/chat',
  
  // Inventario
  ACTIVOS: '/activos',
  BODEGAS: '/bodegas',
  LOTES: '/lotes',
  MANTENIMIENTOS: '/mantenimientos',
  
  // Administración
  USUARIOS: '/usuarios',
  CONFIGURACION: '/configuracion',
  FACTURACION: '/facturacion',
  
  // Operario
  OPERARIO_ENTREGAS: '/operario/entregas',
  OPERARIO_RECOGIDAS: '/operario/recogidas',
  OPERARIO_SCANNER: '/operario/scanner',
  OPERARIO_INCIDENTES: '/operario/incidentes',
  
  // Otros
  GESTION_LANDING: '/gestion-landing',
  POLITICA_PRIVACIDAD: '/politica-privacidad',
  TERMINOS: '/terminos',
} as const;

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES];
