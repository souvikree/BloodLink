
import React from "react";
import { cn } from "@/lib/utils";
import { Search, Bell, Settings, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header 
      className={cn(
        "h-16 flex items-center border-b border-border bg-white/80 backdrop-blur-sm px-4 sticky top-0 z-30",
        sidebarOpen ? "ml-64" : "ml-20",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mr-4 md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input 
          type="text" 
          placeholder="Search..."
          className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary border-none text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      
      <div className="ml-auto flex items-center space-x-1">
        <Link to="/notifications" className="p-2 rounded-full hover:bg-secondary transition-colors relative">
          <Bell size={20} className="text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bloodlink-500 rounded-full"></span>
        </Link>
        
        <Link to="/settings" className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Settings size={20} className="text-foreground" />
        </Link>
        
        <div className="ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="w-9 h-9 rounded-full bg-bloodlink-100 border border-bloodlink-200 flex items-center justify-center text-bloodlink-600 font-medium hover:bg-bloodlink-50 transition-colors">
                J
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link to="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
