import type { ReactNode } from 'react';

interface ResponsiveTableWrapperProps {
  children: ReactNode;
}

export const ResponsiveTableWrapper = ({ children }: ResponsiveTableWrapperProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border bg-card">
      <div className="inline-block min-w-full">
        {children}
      </div>
    </div>
  );
};

interface ResponsiveTableProps {
  children: ReactNode;
}

export const ResponsiveTable = ({ children }: ResponsiveTableProps) => {
  return (
    <table className="w-full border-collapse text-sm">
      {children}
    </table>
  );
};

interface ResponsiveTableHeaderProps {
  children: ReactNode;
}

export const ResponsiveTableHeader = ({ children }: ResponsiveTableHeaderProps) => {
  return (
    <thead className="sticky top-0 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
      {children}
    </thead>
  );
};

interface ResponsiveTableBodyProps {
  children: ReactNode;
}

export const ResponsiveTableBody = ({ children }: ResponsiveTableBodyProps) => {
  return (
    <tbody className="divide-y divide-border">
      {children}
    </tbody>
  );
};

interface ResponsiveTableRowProps {
  children: ReactNode;
  isHeader?: boolean;
}

export const ResponsiveTableRow = ({ children, isHeader }: ResponsiveTableRowProps) => {
  const rowClass = isHeader
    ? 'bg-muted/50 hover:bg-muted/75'
    : 'hover:bg-muted/30 transition-colors';

  return (
    <tr className={rowClass}>
      {children}
    </tr>
  );
};

interface ResponsiveTableCellProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
  isMobileHidden?: boolean;
}

export const ResponsiveTableCell = ({
  children,
  className = '',
  isHeader = false,
  isMobileHidden = false,
}: ResponsiveTableCellProps) => {
  const baseClass = isHeader
    ? 'px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider'
    : 'px-3 py-3 text-left';

  const responsiveClass = isMobileHidden
    ? 'hidden md:table-cell'
    : '';

  return (
    <td className={`${baseClass} ${responsiveClass} ${className}`.trim()}>
      {children}
    </td>
  );
};
