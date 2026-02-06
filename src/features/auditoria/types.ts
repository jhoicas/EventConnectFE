export interface AuditoriaEvento {
  id?: number | string;
  tabla?: string;
  registroId?: number | string;
  usuario?: string;
  accion?: string;
  fecha?: string;
  ip?: string;
  descripcion?: string;
  datos_anteriores?: unknown;
  datos_nuevos?: unknown;
}

export interface AuditoriaResumen {
  total?: number;
  porAccion?: Record<string, number>;
  porTabla?: Record<string, number>;
  ultimos?: AuditoriaEvento[];
}

export interface AuditoriaListResponse {
  items: AuditoriaEvento[];
  total: number;
  page: number;
  pageSize: number;
}
