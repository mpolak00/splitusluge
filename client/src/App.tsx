import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { ALL_BUSINESSES_PATH } from "@shared/paths";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PromoBanner } from "@/components/PromoBanner";
import SeoHead from "@/components/SeoHead";
import { SeoProvider } from "@/contexts/SeoContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import About from "@/pages/About";
import AllBusinesses from "@/pages/AllBusinesses";
import BusinessDetailPage from "@/pages/BusinessDetailPage";
import BusinessMap from "@/pages/BusinessMap";
import BusinessRegistration from "@/pages/BusinessRegistration";
import CategoryPage from "@/pages/CategoryPage";
import HomeNew from "@/pages/HomeNew";
import NotFound from "@/pages/NotFound";
import Promoviranje from "@/pages/Promoviranje";
import Terms from "@/pages/Terms";

function LegacyAllBusinessesRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate(ALL_BUSINESSES_PATH, { replace: true });
  }, [navigate]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeNew} />
      <Route path="/mapa" component={BusinessMap} />
      <Route path="/svi-obrci" component={LegacyAllBusinessesRedirect} />
      <Route path={ALL_BUSINESSES_PATH} component={AllBusinesses} />
      <Route path="/registracija" component={BusinessRegistration} />
      <Route path="/promoviranje" component={Promoviranje} />
      <Route path="/promocija" component={Promoviranje} />
      <Route path="/usluga/:slug" component={CategoryPage} />
      <Route path="/poslovanje/:id/:slug" component={BusinessDetailPage} />
      <Route path="/o-nama" component={About} />
      <Route path="/uvjeti" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <SeoProvider>
          <TooltipProvider>
            <SeoHead />
            <Toaster />
            <Router />
            <PromoBanner />
          </TooltipProvider>
        </SeoProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
