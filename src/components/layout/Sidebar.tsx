import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/lib/menuConfig';
import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { useListarNotificaciones } from '@/features/notificaciones/hooks/useNotificaciones';
import { APP_ROUTES } from '@/lib/routes';

interface SidebarProps {
  menuItems: MenuItem[];
  onItemClick?: () => void;
}

interface SidebarItemProps {
  item: MenuItem;
  onItemClick?: () => void;
  badge?: number;
}

const SidebarItem = ({ item, onItemClick, badge }: SidebarItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  if (hasSubmenu) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
            {badge && badge > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold ml-auto">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {isExpanded && item.submenu && (
          <div className="ml-6 space-y-1">
            {item.submenu.map((subItem: MenuItem) => (
              <NavLink
                key={subItem.href}
                to={subItem.href}
                onClick={onItemClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <subItem.icon className="h-4 w-4 shrink-0" />
                <span>{subItem.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      onClick={onItemClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
      {badge && badge > 0 && (
        <span className="absolute right-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
};

export const Sidebar = ({ menuItems, onItemClick }: SidebarProps) => {
  const { data: notificaciones = [] } = useListarNotificaciones({ 
    estado: ['pendiente', 'enviada']
  });
  // Filtrar solo notificaciones no leídas
  const totalNoLeidas = notificaciones.filter(n => !n.leidaEn).length;

  return (
    <aside className="w-64 border-r bg-background h-full overflow-y-auto flex flex-col">
      <div className="p-4">
        <div className="mb-6">
          <Logo />
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const badge =
              item.href === APP_ROUTES.CLIENTE_MENSAJES ? totalNoLeidas : 0;
            return (
              <SidebarItem
                key={item.label}
                item={item}
                onItemClick={onItemClick}
                badge={badge}
              />
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
