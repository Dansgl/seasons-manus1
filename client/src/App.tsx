import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
// Home versions (history)
import HomeV1 from "./pages/HomeV1";
import HomeV2 from "./pages/HomeV2";
import HomeV3 from "./pages/HomeV3";
import HomeV4 from "./pages/HomeV4";
import HomeV5 from "./pages/HomeV5";
import HomeV6 from "./pages/HomeV6";
// V6 pages (new design system)
import CatalogV6 from "./pages/CatalogV6";
import ProductDetailV6 from "./pages/ProductDetailV6";
import DashboardV6 from "./pages/DashboardV6";
import LoginV6 from "./pages/LoginV6";
import CheckoutV6 from "./pages/CheckoutV6";
import BrandsV6 from "./pages/BrandsV6";
import BlogV6 from "./pages/BlogV6";
import BlogPostV6 from "./pages/BlogPostV6";
// Other pages
import SwapSelection from "./pages/SwapSelection";
import AdminPanel from "./pages/AdminPanel";

function Router() {
  return (
    <Switch>
      {/* Main routes - V6 design */}
      <Route path={"/"} component={HomeV6} />
      <Route path={"/catalog"} component={CatalogV6} />
      <Route path={"/product/:slug"} component={ProductDetailV6} />
      <Route path={"/dashboard"} component={DashboardV6} />
      <Route path={"/login"} component={LoginV6} />
      <Route path={"/checkout"} component={CheckoutV6} />
      <Route path={"/brands"} component={BrandsV6} />
      <Route path={"/blog"} component={BlogV6} />
      <Route path={"/blog/:slug"} component={BlogPostV6} />
      {/* Other pages */}
      <Route path={"/swap-selection"} component={SwapSelection} />
      <Route path={"/admin"} component={AdminPanel} />
      {/* Home version history */}
      <Route path={"/v1"} component={HomeV1} />
      <Route path={"/v2"} component={HomeV2} />
      <Route path={"/v3"} component={HomeV3} />
      <Route path={"/v4"} component={HomeV4} />
      <Route path={"/v5"} component={HomeV5} />
      <Route path={"/v6"} component={HomeV6} />
      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
