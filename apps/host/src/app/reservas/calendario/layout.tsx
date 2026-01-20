'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { AuthGuard } from '@/components/AuthGuard';

export default function CalendarioReservasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
