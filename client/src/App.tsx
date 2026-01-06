import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { UmamiAnalytics } from "./components/UmamiAnalytics";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Loader2 } from "lucide-react";

// Critical path pages - loaded immediately
import HomeV6 from "./pages/HomeV6";
import CatalogV6 from "./pages/CatalogV6";
import ProductDetailV6 from "./pages/ProductDetailV6";
import LoginV6 from "./pages/LoginV6";

// Lazy loaded pages - loaded on demand
const DashboardV6 = lazy(() => import("./pages/DashboardV6"));
const CheckoutV6 = lazy(() => import("./pages/CheckoutV6"));
const CartV6 = lazy(() => import("./pages/CartV6"));
const FavoritesV6 = lazy(() => import("./pages/FavoritesV6"));
const BrandsV6 = lazy(() => import("./pages/BrandsV6"));
const BlogV6 = lazy(() => import("./pages/BlogV6"));
const BlogPostV6 = lazy(() => import("./pages/BlogPostV6"));
const SwapSelection = lazy(() => import("./pages/SwapSelection"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const FAQ = lazy(() => import("./pages/FAQ"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F1ED" }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#B85C4A" }} />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Critical path routes - loaded immediately */}
        <Route path={"/"} component={HomeV6} />
        <Route path={"/catalog"} component={CatalogV6} />
        <Route path={"/product/:slug"} component={ProductDetailV6} />
        <Route path={"/login"} component={LoginV6} />
        {/* Lazy loaded routes */}
        <Route path={"/cart"} component={CartV6} />
        <Route path={"/favorites"} component={FavoritesV6} />
        <Route path={"/dashboard"} component={DashboardV6} />
        <Route path={"/checkout"} component={CheckoutV6} />
        <Route path={"/brands"} component={BrandsV6} />
        <Route path={"/blog"} component={BlogV6} />
        <Route path={"/blog/:slug"} component={BlogPostV6} />
        <Route path={"/swap-selection"} component={SwapSelection} />
        <Route path={"/admin"} component={AdminPanel} />
        <Route path={"/about"} component={About} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/how-it-works"} component={HowItWorks} />
        <Route path={"/faq"} component={FAQ} />
        {/* 404 */}
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <UmamiAnalytics />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
