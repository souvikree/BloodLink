// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import api from "@/utils/api"; // Your Axios instance

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.post("/api/admin/login", { email, password });

      const token = res.data.token;
      if (token) {
        localStorage.setItem("admin_token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set the token in Axios headers
        console.log("Token set in local storage and Axios headers:", token);
        setIsAuthenticated(true);
        toast.success("Login successful");

        const origin = (location.state as any)?.from?.pathname || "/admin/dashboard";
        navigate(origin, { replace: true });
        return true;
      }

      toast.error("No token received from server.");
      return false;
    } catch (err) {
      toast.error("Invalid email or password");
      console.error("Login error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login", { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  return isAuthenticated ? children : null;
};
