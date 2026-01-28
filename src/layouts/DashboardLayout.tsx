import { Outlet } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/authStore';
import { MENU_BY_ROLE } from '@/lib/menuConfig';
import type { UserRole } from '@/types';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Obtener el menú basado en el rol del usuario
  const menuItems = useMemo(() => {
    const userRole = (user?.rol as UserRole) || 'Cliente';
    return MENU_BY_ROLE[userRole] || MENU_BY_ROLE.Cliente;
  }, [user?.rol]);

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar - Fixed Left */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar menuItems={menuItems} />
      </div>

      {/* Mobile Sidebar - Sheet */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar menuItems={menuItems} onItemClick={handleMobileSidebarClose} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Page Content with independent scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
