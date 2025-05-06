import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import StocksPage from "./pages/StocksPage";
import RequestsPage from "./pages/RequestsPage";
import ReceiverPage from "./pages/ReceiverPage";
import DonorsPage from "./pages/DonorsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LicenseUploadPage from "./pages/LicenseUploadPage";
import NavbarPublic from "./components/layout/NavbarPublic";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <><NavbarPublic /><LoginPage /></>
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" /> : <><NavbarPublic /><RegisterPage /></>
            } />
            <Route path="/license-upload" element={
              isAuthenticated ? <Navigate to="/" /> : <><NavbarPublic /><LicenseUploadPage /></>
            } />
            
            {/* Protected routes */}
            <Route path="/" element={
              isAuthenticated ? <DashboardLayout><Index /></DashboardLayout> : <Navigate to="/login" />
            } />
            <Route path="/stocks" element={
              isAuthenticated ? <DashboardLayout><StocksPage /></DashboardLayout> : <Navigate to="/login" />
            } />
            <Route path="/requests" element={
              isAuthenticated ? <DashboardLayout><RequestsPage /></DashboardLayout> : <Navigate to="/login" />
            } />
            <Route path="/receiver" element={
              isAuthenticated ? <DashboardLayout><ReceiverPage /></DashboardLayout> : <Navigate to="/login" />
            } />
            <Route path="/donors" element={
              isAuthenticated ? <DashboardLayout><DonorsPage /></DashboardLayout> : <Navigate to="/login" />
            } />
            <Route path="/notifications" element={
              isAuthenticated ? <DashboardLayout><NotificationsPage /></DashboardLayout> : <Navigate to="/login" />
            } />
            <Route path="/settings" element={
              isAuthenticated ? <DashboardLayout><SettingsPage /></DashboardLayout> : <Navigate to="/login" />
            } />
            <Route path="/profile" element={
              isAuthenticated ? <DashboardLayout><ProfilePage /></DashboardLayout> : <Navigate to="/login" />
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
