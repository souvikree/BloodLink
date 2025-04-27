
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  function cn(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/40">
      <div className={cn("transition-all duration-300 ease-in-out", sidebarOpen ? "w-64" : "w-20")}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      <div className="relative flex flex-col flex-1 overflow-hidden">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};
