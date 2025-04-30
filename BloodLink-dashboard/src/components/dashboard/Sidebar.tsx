
import React from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Droplet, ArrowLeftRight, UserRound, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Stocks", icon: Droplet, path: "/stocks" },
    { label: "Requests", icon: ArrowLeftRight, path: "/requests" },
    { label: "Receiver", icon: UserRound, path: "/receiver" },
    // { label: "Donors", icon: Users, path: "/donors" },
  ];

  return (
    <aside 
      className={cn(
        "relative h-screen flex flex-col bg-white border-r border-border transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-border justify-between">
        <div className="flex items-center overflow-hidden">
          <div className={cn("w-10 h-10 flex items-center justify-center bg-bloodlink-50 rounded border border-bloodlink-100", 
            !open && "w-full"
          )}>
            <span className="text-bloodlink-600 font-semibold text-lg">B</span>
          </div>
          
          {open && (
            <span className="ml-3 font-semibold text-xl text-foreground animate-fade-in">
              Bloodlink
            </span>
          )}
        </div>
        
        <button 
          onClick={() => setOpen(!open)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
      <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center py-3 px-3 rounded-lg font-medium transition-all",
                  isActive 
                    ? "bg-bloodlink-50 text-bloodlink-600" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  !open && "justify-center"
                )}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "flex-shrink-0",
                    isActive ? "text-bloodlink-500" : "text-muted-foreground"
                  )} 
                />
                {open && (
                  <span className="ml-3 whitespace-nowrap animate-fade-in">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {open && (
        <div className="p-4 m-4 rounded-lg bg-gradient-to-r from-bloodlink-50 to-bloodlink-100 border border-bloodlink-200 animate-fade-in">
          <h3 className="font-medium text-bloodlink-700 mb-1">Blood Drive Event</h3>
          <p className="text-sm text-bloodlink-600">June 14th - World Blood Donor Day</p>
        </div>
      )}
    </aside>
  );
};
