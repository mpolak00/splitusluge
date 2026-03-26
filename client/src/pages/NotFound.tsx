import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ALL_BUSINESSES_PATH } from "@shared/paths";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-orange-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>

          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Stranica nije pronađena
          </h2>

          <p className="text-slate-600 mb-8 leading-relaxed">
            Stranica koju tražite ne postoji ili je premještena.
            <br />
            Pokušajte pretražiti imenik ili se vratite na naslovnicu.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Naslovnica
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation(ALL_BUSINESSES_PATH)}
              className="px-6 py-2.5 rounded-lg"
            >
              <Search className="w-4 h-4 mr-2" />
              Pretraži imenik
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
