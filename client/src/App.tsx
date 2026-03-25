import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { ALL_BUSINESSES_PATH } from "@shared/paths";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import SeoHead from "@/components/SeoHead";
import { SeoProvider } from "@/contexts/SeoContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import About from "@/pages/About";
import AdminPanel from "@/pages/AdminPanel";
import AllBusinesses from "@/pages/AllBusinesses";
import BusinessDetailPage from "@/pages/BusinessDetailPage";
import BusinessMap from "@/pages/BusinessMap";
import BusinessRegistration from "@/pages/BusinessRegistration";
import CategoryPage from "@/pages/CategoryPage";
import CategoryEnglish from "@/pages/CategoryEnglish";
import HomeEnglish from "@/pages/HomeEnglish";
import HomeNew from "@/pages/HomeNew";
import MiniSite from "@/pages/MiniSite";
import NotFound from "@/pages/NotFound";
import Paketi from "@/pages/Paketi";
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
      <Route path="/en" component={HomeEnglish} />
      <Route path="/en/:slug" component={CategoryEnglish} />
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
      <Route path="/admin" component={AdminPanel} />
      <Route path="/paketi" component={Paketi} />
      <Route path="/preview/:id" component={MiniSite} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <SeoProvider>
            <TooltipProvider>
              <SeoHead />
              <Toaster />
              <Header />
              <Router />
              <Footer />
              <PromoBanner />
            </TooltipProvider>
          </SeoProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
