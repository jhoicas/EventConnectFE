import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuItem } from '@/lib/menuConfig';
import { useState } from 'react';

interface SidebarProps {
  menuItems: MenuItem[];
  onItemClick?: () => void;
}

interface SidebarItemProps {
  item: MenuItem;
  onItemClick?: () => void;
}

const SidebarItem = ({ item, onItemClick }: SidebarItemProps) => {
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
          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </NavLink>
  );
};

export const Sidebar = ({ menuItems, onItemClick }: SidebarProps) => {
  return (
    <aside className="w-64 border-r bg-background h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold text-foreground">EventConnect</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem key={item.label} item={item} onItemClick={onItemClick} />
          ))}
        </nav>
      </div>
    </aside>
  );
};
