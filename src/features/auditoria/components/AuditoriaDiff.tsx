import { useMemo } from 'react';

interface DiffRow {
  key: string;
  before?: string;
  after?: string;
  change: 'added' | 'removed' | 'changed' | 'same';
}

const safeParse = (value: unknown): unknown => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const flatten = (obj: unknown, prefix = ''): Record<string, string> => {
  if (obj === null || obj === undefined) {
    return prefix ? { [prefix]: '' } : { value: '' };
  }
  if (typeof obj !== 'object') {
    return prefix ? { [prefix]: stringifyValue(obj) } : { value: stringifyValue(obj) };
  }

  const result: Record<string, string> = {};
  const entries = Object.entries(obj as Record<string, unknown>);

  if (entries.length === 0 && prefix) {
    result[prefix] = '';
    return result;
  }

  entries.forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      Object.assign(result, flatten(value, path));
    } else {
      result[path] = stringifyValue(value);
    }
  });

  return result;
};

interface AuditoriaDiffProps {
  before?: unknown;
  after?: unknown;
}

export const AuditoriaDiff = ({ before, after }: AuditoriaDiffProps) => {
  const rows = useMemo<DiffRow[]>(() => {
    const beforeObj = safeParse(before);
    const afterObj = safeParse(after);

    const beforeMap = flatten(beforeObj);
    const afterMap = flatten(afterObj);
    const keys = Array.from(new Set([...Object.keys(beforeMap), ...Object.keys(afterMap)])).sort();

    return keys.map((key) => {
      const beforeValue = beforeMap[key];
      const afterValue = afterMap[key];

      if (beforeValue === undefined) {
        return { key, before: '', after: afterValue, change: 'added' };
      }
      if (afterValue === undefined) {
        return { key, before: beforeValue, after: '', change: 'removed' };
      }
      if (beforeValue === afterValue) {
        return { key, before: beforeValue, after: afterValue, change: 'same' };
      }
      return { key, before: beforeValue, after: afterValue, change: 'changed' };
    });
  }, [before, after]);

  if (!rows.length) {
    return <div className="text-sm text-slate-500">Sin cambios registrados.</div>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Campo</th>
            <th className="px-3 py-2 text-left font-medium">Antes</th>
            <th className="px-3 py-2 text-left font-medium">Después</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">{row.key}</td>
              <td
                className={`px-3 py-2 text-slate-600 ${
                  row.change === 'removed' || row.change === 'changed' ? 'bg-red-50 text-red-700' : ''
                }`}
              >
                <span className="font-mono text-xs break-all">{row.before}</span>
              </td>
              <td
                className={`px-3 py-2 text-slate-600 ${
                  row.change === 'added' || row.change === 'changed' ? 'bg-emerald-50 text-emerald-700' : ''
                }`}
              >
                <span className="font-mono text-xs break-all">{row.after}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
