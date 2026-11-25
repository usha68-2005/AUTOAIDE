import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import TaskSchedulerPage from "./pages/TaskSchedulerPage";
import DiaryPage from "./pages/DiaryPage";
import CareerPage from "./pages/CareerPage";
import DashboardPage from "./pages/DashboardPage";
import RelaxationPage from "./pages/RelaxationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks" element={<TaskSchedulerPage />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/relaxation" element={<RelaxationPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
