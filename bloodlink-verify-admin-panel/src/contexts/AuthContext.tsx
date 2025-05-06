
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Mock admin credentials for demo purposes
// In a real app, this would be handled by a backend service
const ADMIN_EMAIL = "admin@bloodlink.org";
const ADMIN_PASSWORD = "adminpassword";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("admin_authenticated") === "true";
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          setIsAuthenticated(true);
          localStorage.setItem("admin_authenticated", "true");
          toast.success("Login successful");
          
          // Redirect to dashboard or the page they tried to access
          const origin = location.state?.from?.pathname || "/admin/dashboard";
          navigate(origin);
          resolve(true);
        } else {
          toast.error("Invalid email or password");
          resolve(false);
        }
        setLoading(false);
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    navigate("/admin-login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page, but save the current location
      navigate("/admin-login", { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? children : null;
}
