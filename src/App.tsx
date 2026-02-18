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
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const Intake = lazy(() => import("./pages/Intake"));
const AlgemeneVoorwaarden = lazy(() => import("./pages/AlgemeneVoorwaarden"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Documentatie = lazy(() => import("./pages/Documentatie"));
const OneTBL = lazy(() => import("./pages/OneTBL"));
const ReformClub = lazy(() => import("./pages/ReformClub"));
const SitemapRedirect = lazy(() => import("./pages/SitemapRedirect"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Laden...</p>
      </div>
    </div>
  );
}

/* Global vertical column guide lines — fixed, full page height, same grid as content */
function ColumnGuides() {
  // Lines sit at the outer edge of the max-w-7xl (1280px) container.
  // On screens < 1280px we enforce a minimum 24px from viewport edges so lines never disappear.
  // Content uses px-6 lg:px-12 INSIDE the container → breathing room between line and content.
  return (
    <div className="fixed inset-0 pointer-events-none z-[60]" aria-hidden>
      <div
        className="absolute top-0 bottom-0 w-px bg-border/50"
        style={{ left: "max(24px, calc((100vw - 1280px) / 2))" }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-border/50"
        style={{ right: "max(24px, calc((100vw - 1280px) / 2))" }}
      />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <ColumnGuides />
      <div className="min-h-screen bg-background transition-colors duration-300">
        {!isAdminRoute && <Header />}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pakketten" element={<Pakketten />} />
            <Route path="/proces" element={<Proces />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/documentatie" element={<Documentatie />} />
            <Route path="/1tbl" element={<OneTBL />} />
            <Route path="/reformclub" element={<ReformClub />} />
            <Route path="/sitemap.xml" element={<SitemapRedirect />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:handle" element={<ProductDetail />} />
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
