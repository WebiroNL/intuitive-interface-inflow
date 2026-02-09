import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Pakketten = lazy(() => import("./pages/Pakketten"));
const Proces = lazy(() => import("./pages/Proces"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Intake = lazy(() => import("./pages/Intake"));
const AlgemeneVoorwaarden = lazy(() => import("./pages/AlgemeneVoorwaarden"));
const Documentatie = lazy(() => import("./pages/Documentatie"));
const OneTBL = lazy(() => import("./pages/OneTBL"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8] dark:bg-[#110E13]">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#EAF0FF] border-t-[#3A4DEA] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#110E13]/60 dark:text-gray-400">Laden...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F7F7F8] dark:bg-[#110E13] transition-colors duration-300">
        {!isAdminRoute && <Header />}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pakketten" element={<Pakketten />} />
            <Route path="/proces" element={<Proces />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
            <Route path="/documentatie" element={<Documentatie />} />
            <Route path="/1tbl" element={<OneTBL />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
