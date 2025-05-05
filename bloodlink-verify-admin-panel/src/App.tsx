
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";

// Pages
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import PendingUsers from "./pages/PendingUsers";
import VerifiedUsers from "./pages/VerifiedUsers";
import RejectedUsers from "./pages/RejectedUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Redirect from index to admin login */}
            <Route path="/" element={<Navigate to="/admin-login" replace />} />
            
            {/* Public route */}
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Protected admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route 
              path="/admin/pending" 
              element={
                <RequireAuth>
                  <PendingUsers />
                </RequireAuth>
              }
            />
            <Route 
              path="/admin/verified" 
              element={
                <RequireAuth>
                  <VerifiedUsers />
                </RequireAuth>
              }
            />
            <Route 
              path="/admin/rejected" 
              element={
                <RequireAuth>
                  <RejectedUsers />
                </RequireAuth>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
