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

export type UserRole = 'SuperAdmin' | 'Admin-Proveedor' | 'Operario' | 'Cliente' | 'Usuario';

// Producto
export interface Producto {
  id: number;
  empresa_Id: number;
  categoria_Id: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  unidad_Medida: string;
  precio_Alquiler_Dia: number;
  cantidad_Stock: number;
  stock_Minimo: number;
  imagen_URL?: string;
  es_Alquilable: boolean;
  es_Vendible: boolean;
  requiere_Mantenimiento: boolean;
  dias_Mantenimiento: number;
  peso_Kg?: number;
  dimensiones?: string;
  observaciones?: string;
  activo: boolean;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}

export interface CreateProductoDto {
  categoria_Id: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  unidad_Medida?: string;
  precio_Alquiler_Dia: number;
  cantidad_Stock: number;
  stock_Minimo?: number;
  imagen_URL?: string;
  es_Alquilable?: boolean;
  es_Vendible?: boolean;
  peso_Kg?: number;
  dimensiones?: string;
  observaciones?: string;
}

export interface UpdateProductoDto {
  id: number;
  categoria_Id: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  unidad_Medida: string;
  precio_Alquiler_Dia: number;
  cantidad_Stock: number;
  stock_Minimo: number;
  imagen_URL?: string;
  es_Alquilable: boolean;
  es_Vendible: boolean;
  requiere_Mantenimiento: boolean;
  dias_Mantenimiento: number;
  peso_Kg?: number;
  dimensiones?: string;
  observaciones?: string;
  activo: boolean;
}

// Categoría
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  activo: boolean;
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
}

export interface UpdateCategoriaDto {
  id: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  activo: boolean;
}

// Cliente
export interface Cliente {
  id: number;
  empresa_Id: number;
  tipo_Cliente: string;
  nombre: string;
  documento: string;
  tipo_Documento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  contacto_Nombre?: string;
  contacto_Telefono?: string;
  rating: number;
  observaciones?: string;
  estado: string;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}

export interface CreateClienteDto {
  tipo_Cliente: string;
  nombre: string;
  documento: string;
  tipo_Documento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  contacto_Nombre?: string;
  contacto_Telefono?: string;
  observaciones?: string;
}

export interface UpdateClienteDto {
  id: number;
  tipo_Cliente: string;
  nombre: string;
  documento: string;
  tipo_Documento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  contacto_Nombre?: string;
  contacto_Telefono?: string;
  rating: number;
  observaciones?: string;
  estado: string;
}

// Reserva
export interface Reserva {
  id: number;
  empresa_Id: number;
  cliente_Id: number;
  usuario_Id: number;
  codigo_Reserva: string;
  estado: string;
  fecha_Evento: string;
  fecha_Entrega?: string;
  fecha_Devolucion_Programada?: string;
  fecha_Devolucion_Real?: string;
  direccion_Entrega?: string;
  ciudad_Entrega?: string;
  contacto_En_Sitio?: string;
  telefono_Contacto?: string;
  subtotal: number;
  descuento: number;
  total: number;
  fianza: number;
  fianza_Devuelta: boolean;
  metodo_Pago: string;
  estado_Pago: string;
  observaciones?: string;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}

export interface CreateReservaDto {
  cliente_Id: number;
  fecha_Evento: string;
  fecha_Entrega?: string;
  fecha_Devolucion_Programada?: string;
  direccion_Entrega?: string;
  ciudad_Entrega?: string;
  contacto_En_Sitio?: string;
  telefono_Contacto?: string;
  subtotal: number;
  descuento: number;
  total: number;
  fianza?: number;
  metodo_Pago: string;
  estado_Pago: string;
  observaciones?: string;
}

export interface UpdateReservaDto {
  id: number;
  cliente_Id: number;
  estado: string;
  fecha_Evento: string;
  fecha_Entrega?: string;
  fecha_Devolucion_Programada?: string;
  direccion_Entrega?: string;
  ciudad_Entrega?: string;
  contacto_En_Sitio?: string;
  telefono_Contacto?: string;
  subtotal: number;
  descuento: number;
  total: number;
  fianza: number;
  fianza_Devuelta: boolean;
  metodo_Pago: string;
  estado_Pago: string;
  observaciones?: string;
}

// Activo
export interface Activo {
  id: number;
  empresa_Id: number;
  bodega_Id?: number;
  categoria_Id: number;
  codigo_Activo: string;
  nombre: string;
  descripcion?: string;
  marca?: string;
  modelo?: string;
  numero_Serie?: string;
  estado: string;
  fecha_Adquisicion?: string;
  valor_Adquisicion?: number;
  vida_Util_Meses?: number;
  ubicacion_Fisica?: string;
  qr_Code?: string;
  imagen_URL?: string;
  observaciones?: string;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}

export interface CreateActivoDto {
  bodega_Id?: number;
  categoria_Id: number;
  codigo_Activo: string;
  nombre: string;
  descripcion?: string;
  marca?: string;
  modelo?: string;
  numero_Serie?: string;
  fecha_Adquisicion?: string;
  valor_Adquisicion?: number;
  vida_Util_Meses?: number;
  ubicacion_Fisica?: string;
  imagen_URL?: string;
  observaciones?: string;
}

export interface UpdateActivoDto {
  id: number;
  bodega_Id?: number;
  categoria_Id: number;
  codigo_Activo: string;
  nombre: string;
  descripcion?: string;
  marca?: string;
  modelo?: string;
  numero_Serie?: string;
  estado: string;
  fecha_Adquisicion?: string;
  valor_Adquisicion?: number;
  vida_Util_Meses?: number;
  ubicacion_Fisica?: string;
  imagen_URL?: string;
  observaciones?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Bodega
export interface Bodega {
  id: number;
  empresa_Id: number;
  codigo_Bodega: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  capacidad_M3?: number;
  estado: string;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}

export interface CreateBodegaDto {
  codigo_Bodega: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  capacidad_M3?: number;
}

export interface UpdateBodegaDto {
  id: number;
  codigo_Bodega: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  capacidad_M3?: number;
  estado: string;
}

// Lote
export interface Lote {
  id: number;
  producto_Id: number;
  bodega_Id?: number;
  codigo_Lote: string;
  fecha_Fabricacion?: string;
  fecha_Vencimiento?: string;
  cantidad_Inicial: number;
  cantidad_Actual: number;
  costo_Unitario: number;
  estado: string;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}

export interface CreateLoteDto {
  producto_Id: number;
  bodega_Id?: number;
  codigo_Lote: string;
  fecha_Fabricacion?: string;
  fecha_Vencimiento?: string;
  cantidad_Inicial: number;
  costo_Unitario: number;
}

export interface UpdateLoteDto {
  id: number;
  producto_Id: number;
  bodega_Id?: number;
  codigo_Lote: string;
  fecha_Fabricacion?: string;
  fecha_Vencimiento?: string;
  cantidad_Inicial: number;
  cantidad_Actual: number;
  costo_Unitario: number;
  estado: string;
}
// Mantenimiento
export interface Mantenimiento {
  id: number;
  activo_Id: number;
  tipo_Mantenimiento: string;
  fecha_Programada?: string;
  fecha_Realizada?: string;
  descripcion?: string;
  responsable_Id?: number;
  proveedor_Servicio?: string;
  costo?: number;
  estado: string;
  observaciones?: string;
  fecha_Creacion: string;
}

export interface CreateMantenimientoDto {
  activo_Id: number;
  tipo_Mantenimiento: string;
  fecha_Programada?: string;
  descripcion?: string;
  responsable_Id?: number;
  proveedor_Servicio?: string;
  costo?: number;
  observaciones?: string;
}

export interface UpdateMantenimientoDto {
  id: number;
  activo_Id: number;
  tipo_Mantenimiento: string;
  fecha_Programada?: string;
  fecha_Realizada?: string;
  descripcion?: string;
  responsable_Id?: number;
  proveedor_Servicio?: string;
  costo?: number;
  estado: string;
  observaciones?: string;
}