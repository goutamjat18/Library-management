import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "./pages/Login";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import Transactions from "./pages/Transactions";
import BookAvailable from "./pages/BookAvailable";
import BookIssue from "./pages/BookIssue";
import ReturnBook from "./pages/ReturnBook";
import PayFine from "./pages/PayFine";
import Reports from "./pages/Reports";
import Maintenance from "./pages/Maintenance";
import AddMembership from "./pages/AddMembership";
import UpdateMembership from "./pages/UpdateMembership";
import AddBook from "./pages/AddBook";
import UpdateBook from "./pages/UpdateBook";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";

const queryClient = new QueryClient();

function PrivateRoute({ children, adminRequired }: { children: ReactNode; adminRequired?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminRequired && !user.isAdmin) return <Navigate to="/home" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.isAdmin ? "/admin" : "/home"} /> : <Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/admin" element={<PrivateRoute adminRequired><AdminHome /></PrivateRoute>} />
      <Route path="/home" element={<PrivateRoute><UserHome /></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
      <Route path="/transactions/available" element={<PrivateRoute><BookAvailable /></PrivateRoute>} />
      <Route path="/transactions/issue" element={<PrivateRoute><BookIssue /></PrivateRoute>} />
      <Route path="/transactions/return" element={<PrivateRoute><ReturnBook /></PrivateRoute>} />
      <Route path="/transactions/fine" element={<PrivateRoute><PayFine /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/maintenance" element={<PrivateRoute adminRequired><Maintenance /></PrivateRoute>} />
      <Route path="/maintenance/add-membership" element={<PrivateRoute adminRequired><AddMembership /></PrivateRoute>} />
      <Route path="/maintenance/update-membership" element={<PrivateRoute adminRequired><UpdateMembership /></PrivateRoute>} />
      <Route path="/maintenance/add-book" element={<PrivateRoute adminRequired><AddBook /></PrivateRoute>} />
      <Route path="/maintenance/update-book" element={<PrivateRoute adminRequired><UpdateBook /></PrivateRoute>} />
      <Route path="/maintenance/users" element={<PrivateRoute adminRequired><UserManagement /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
