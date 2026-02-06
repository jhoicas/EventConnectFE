// Tipos para el módulo de Disponibilidad

export type EstadoDisponibilidad = 'Disponible' | 'Reservado' | 'Mantenimiento' | 'No_Disponible';

export interface DisponibilidadDia {
  fecha: string; // YYYY-MM-DD
  cantidad_disponible: number;
  cantidad_total: number;
  estado: EstadoDisponibilidad;
  reservas: number; // cantidad de reservas en ese día
  mantenimiento: boolean;
  precio_especial?: number; // precio especial para ese día si aplica
  observaciones?: string;
}

export interface DisponibilidadRango {
  activo_Id: number;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  dias: DisponibilidadDia[];
  activo_nombre?: string;
  cantidad_total?: number;
}

export interface CrearDisponibilidadRequest {
  activo_Id: number;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  cantidad_disponible: number;
  estado: EstadoDisponibilidad;
  precio_especial?: number;
  observaciones?: string;
}

export interface ActualizarDisponibilidadRequest {
  estado: EstadoDisponibilidad;
  cantidad_disponible?: number;
  precio_especial?: number;
  observaciones?: string;
}

export interface VerificacionDisponibilidad {
  activo_Id: number;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  cantidad_requerida: number;
  disponible: boolean;
  cantidad_disponible: number;
  precio_base: number;
  precio_especial?: number;
  dias_con_restriccion: string[]; // array de fechas con restricciones
  mensaje: string;
}

export interface DisponibilidadPorActivo {
  activo_Id: number;
  activo_nombre: string;
  activo_sku: string;
  precio_base: number;
  cantidad_total: number;
  proximos_30_dias: DisponibilidadDia[];
  occupancy_rate: number; // porcentaje de ocupación
  mantenimientos_programados: Array<{
    fecha_inicio: string;
    fecha_fin: string;
    razon: string;
  }>;
}

export interface DisponibilidadResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface DisponibilidadListResponse {
  items: DisponibilidadDia[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CalendarioData {
  activo_Id: number;
  mes: number; // 1-12
  anio: number;
  semanas: Array<Array<{
    fecha: string;
    numero_dia: number;
    disponible: number;
    total: number;
    estado: EstadoDisponibilidad;
    fuera_mes: boolean;
  }>>;
}
