import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface AuditoriaFiltrosState {
  tabla: string;
  accion: string;
  usuario: string;
  desde: string;
  hasta: string;
}

interface AuditoriaFiltrosProps {
  value: AuditoriaFiltrosState;
  onChange: (value: AuditoriaFiltrosState) => void;
}

export const AuditoriaFiltros = ({ value, onChange }: AuditoriaFiltrosProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label>Tabla</Label>
        <Input
          placeholder="Ej: Reservas"
          value={value.tabla}
          onChange={(event) => onChange({ ...value, tabla: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Acción</Label>
        <Select
          value={value.accion}
          onValueChange={(accion) => onChange({ ...value, accion })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="CREATE">CREATE</SelectItem>
            <SelectItem value="UPDATE">UPDATE</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="LOGIN">LOGIN</SelectItem>
            <SelectItem value="CUSTOM">CUSTOM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Usuario</Label>
        <Input
          placeholder="Usuario o email"
          value={value.usuario}
          onChange={(event) => onChange({ ...value, usuario: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Desde</Label>
        <Input
          type="date"
          value={value.desde}
          onChange={(event) => onChange({ ...value, desde: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Hasta</Label>
        <Input
          type="date"
          value={value.hasta}
          onChange={(event) => onChange({ ...value, hasta: event.target.value })}
        />
      </div>
    </div>
  );
};
