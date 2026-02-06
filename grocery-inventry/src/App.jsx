import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useDispatch, useSelector } from "react-redux";

import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";

import { Sidebar } from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import { store } from "./store/store";
import { checkAuth } from "./features/auth/authSlice";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();


const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <Sidebar>
          <Routes>
            <Route path="/admin">
              <Route index element={<Dashboard />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Sidebar>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
