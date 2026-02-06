export interface MetricaGeneral {
  nombre: string;
  valor: number;
  unidad?: string;
  cambioPorcentual: number;
  tendencia: 'up' | 'down' | 'neutral';
}

export interface MetricasGenerales {
  ingresos: MetricaGeneral;
  reservas: MetricaGeneral;
  clientes: MetricaGeneral;
  activos: MetricaGeneral;
  alertas: MetricaGeneral;
}

export interface TendenciaDiaria {
  fecha: string; // YYYY-MM-DD
  ingresos: number;
  reservas: number;
  clientes: number;
}

export interface TendenciaMensual {
  mes: string; // YYYY-MM
  ingresos: number;
  reservas: number;
  clientes: number;
}

export interface TendenciasDashboard {
  diarias: TendenciaDiaria[];
  mensuales: TendenciaMensual[];
}

export interface KPI {
  id: string;
  nombre: string;
  valor: number;
  unidad?: string;
  cambioPorcentual?: number;
  estado?: 'bueno' | 'alerta' | 'critico';
}

export interface TopActivo {
  id: string;
  nombre: string;
  categoria: string;
  ingresos: number;
  reservas: number;
  utilizacion: number; // 0-100
}

export interface TopCliente {
  id: string;
  nombre: string;
  ingresos: number;
  frecuencia: number;
  segmento: 'VIP' | 'Frecuente' | 'Ocasional' | 'Nuevo';
}

export interface EstadoReservaDistribucion {
  estado: string;
  cantidad: number;
  porcentaje: number;
}

export interface DistribucionGeografica {
  ciudad: string;
  reservas: number;
  ingresos: number;
  clientes: number;
}

export interface ComportamientoSegmento {
  segmento: 'VIP' | 'Frecuente' | 'Ocasional' | 'Nuevo';
  clientes: number;
  ingresos: number;
  ticketPromedio: number;
  retencion: number;
}

export interface RentabilidadCategoria {
  categoria: string;
  ingresos: number;
  costos: number;
  margen: number;
}

export interface RentabilidadMes {
  mes: string; // YYYY-MM
  ingresos: number;
  costos: number;
  margen: number;
}

export interface ReporteRentabilidad {
  totalIngresos: number;
  totalCostos: number;
  margenTotal: number;
  porCategoria: RentabilidadCategoria[];
  porMes: RentabilidadMes[];
}

export interface DashboardCompleto {
  metricas: MetricasGenerales;
  tendencias: TendenciasDashboard;
  kpis: KPI[];
  topActivos: TopActivo[];
  topClientes: TopCliente[];
  estados: EstadoReservaDistribucion[];
  geografica: DistribucionGeografica[];
  comportamiento: ComportamientoSegmento[];
  rentabilidadCategoria: RentabilidadCategoria[];
}

export interface ResponseAdminDashboard<T = any> {
  status: 'success' | 'error';
  code: number;
  message: string;
  data: T;
  timestamp: string;
}
