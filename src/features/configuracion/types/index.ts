export interface ConfiguracionSistema {
  id: number;
  empresa_Id: number | null;
  clave: string;
  valor: string;
  descripcion: string;
  tipo_Dato: string;
  es_Global: boolean;
  fecha_Actualizacion: string;
}

export interface CreateConfiguracionDto {
  empresa_Id?: number;
  clave: string;
  valor: string;
  descripcion: string;
  tipo_Dato: string;
  es_Global: boolean;
}

export interface UpdateConfiguracionDto {
  valor: string;
  descripcion?: string;
}
