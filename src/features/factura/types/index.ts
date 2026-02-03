export interface Factura {
  id: number;
  empresa_Id: number;
  cliente_Id: number;
  reserva_Id: number | null;
  prefijo: string;
  consecutivo: number;
  cufe: string;
  fecha_Emision: string;
  fecha_Vencimiento: string | null;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: string;
  datos_Cliente_Snapshot: string;
  observaciones: string;
  creado_Por_Id: number;
  anulado_Por_Id: number | null;
  fecha_Anulacion: string | null;
  razon_Anulacion: string | null;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
}

export interface GenerarFacturaDto {
  reserva_Id: number;
}
