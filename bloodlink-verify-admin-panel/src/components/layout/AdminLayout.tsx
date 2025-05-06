
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckCircle, X, LogOut, Menu, X as Close } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="h-10 w-10 rounded-full shadow-md"
        >
          {sidebarOpen ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-bloodlink flex items-center justify-center">
                <span className="text-white font-bold text-sm">BL</span>
              </div>
              <h1 className="text-lg font-semibold">BloodLink Admin</h1>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              href="/admin/dashboard"
              active={isActive("/admin/dashboard")}
            />
            <SidebarItem
              icon={Users}
              label="Pending Verifications"
              href="/admin/pending"
              active={isActive("/admin/pending")}
            />
            <SidebarItem
              icon={CheckCircle}
              label="Verified Users"
              href="/admin/verified"
              active={isActive("/admin/verified")}
            />
            <SidebarItem
              icon={X}
              label="Rejected Users"
              href="/admin/rejected"
              active={isActive("/admin/rejected")}
            />
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-md transition-colors hover:bg-sidebar-accent/50"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
