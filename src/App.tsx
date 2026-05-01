import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";
import { captureReferralFromUrl } from "@/lib/partnerTracking";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Pakketten = lazy(() => import("./pages/Pakketten"));
const Proces = lazy(() => import("./pages/Proces"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Oplossingen = lazy(() => import("./pages/Oplossingen"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const Intake = lazy(() => import("./pages/Intake"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const OverOns = lazy(() => import("./pages/OverOns"));
const Documentatie = lazy(() => import("./pages/Documentatie"));
const OneTBL = lazy(() => import("./pages/OneTBL"));
const ReformClub = lazy(() => import("./pages/ReformClub"));
const SitemapRedirect = lazy(() => import("./pages/SitemapRedirect"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MoodboardTool = lazy(() => import("./pages/MoodboardTool"));
const AccountResetPassword = lazy(() => import("./pages/AccountResetPassword"));
const NovelleRapport = lazy(() => import("./pages/NovelleRapport"));
const MillionRapport = lazy(() => import("./pages/MillionRapport"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const ClientActivate = lazy(() => import("./pages/ClientActivate"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const PartnerLanding = lazy(() => import("./pages/PartnerLanding"));
const PartnerLogin = lazy(() => import("./pages/PartnerLogin"));
const PartnerRegister = lazy(() => import("./pages/PartnerRegister"));
const PartnerPortal = lazy(() => import("./pages/PartnerPortal"));
const PartnerOnboarding = lazy(() => import("./pages/PartnerOnboarding"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CheckoutReturn = lazy(() => import("./pages/CheckoutReturn"));

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
  const isReportRoute = location.pathname.startsWith('/novellerapport');
  const isClientRoute = location.pathname.startsWith('/dashboard') || location.pathname === '/login' || location.pathname.startsWith('/client/');
  const isPartnerPortalRoute = location.pathname.startsWith('/partner/dashboard') || location.pathname === '/partner/login' || location.pathname === '/partner/register';
  const hideChrome = isAdminRoute || isReportRoute || isClientRoute || isPartnerPortalRoute;
  useCartSync();

  // Capture ?ref= / ?partner= on initial load and on every route change
  useEffect(() => {
    captureReferralFromUrl();
  }, [location.pathname, location.search]);

  return (
    <>
      <ScrollToTop />
      {!hideChrome && <ColumnGuides />}
      {!hideChrome && <CartDrawer />}
      <div className="min-h-screen bg-background transition-colors duration-300">
        {!hideChrome && <Header />}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pakketten" element={<Pakketten />} />
            <Route path="/checkout/return" element={<CheckoutReturn />} />
            <Route path="/proces" element={<Proces />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/oplossingen" element={<Oplossingen />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/algemene-voorwaarden" element={<LegalPage />} />
            <Route path="/privacy-policy" element={<LegalPage />} />
            <Route path="/disclaimer" element={<LegalPage />} />
            <Route path="/cookiebeleid" element={<LegalPage />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/legal/:slug" element={<LegalPage />} />
            <Route path="/p/:slug" element={<LegalPage />} />
            <Route path="/documentatie" element={<Documentatie />} />
            <Route path="/1tbl" element={<OneTBL />} />
            <Route path="/reformclub" element={<ReformClub />} />
            <Route path="/sitemap.xml" element={<SitemapRedirect />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:handle" element={<ProductDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/account/reset-password" element={<AccountResetPassword />} />
            <Route path="/account/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/account" element={<Navigate to="/dashboard" replace />} />
            <Route path="/moodboard" element={<MoodboardTool />} />
            <Route path="/novellerapport" element={<NovelleRapport />} />
            <Route path="/client/login" element={<ClientLogin />} />
            <Route path="/client/activate" element={<ClientActivate />} />
            <Route path="/dashboard/*" element={<ClientPortal />} />
            <Route path="/partner" element={<PartnerLanding />} />
            <Route path="/partner/login" element={<PartnerLogin />} />
            <Route path="/partner/register" element={<PartnerRegister />} />
            <Route path="/partner/dashboard/*" element={<PartnerPortal />} />
            <Route path="/onboarding" element={<PartnerOnboarding />} />
            {/* Legacy aliases */}
            <Route path="/login" element={<Navigate to="/client/login" replace />} />
            <Route path="/client/:slug/*" element={<Navigate to="/dashboard" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {!hideChrome && <Footer />}
      </div>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
