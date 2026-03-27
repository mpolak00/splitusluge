import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";

export function useUserSession() {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem("ms_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: { id: number; name: string; email: string }) => {
    localStorage.setItem("ms_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("ms_user");
    setUser(null);
  };

  return { user, login, logout };
}

export default function UserAuth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { login: saveSession } = useUserSession();

  const registerMutation = trpc.comments.register.useMutation({
    onSuccess: (data) => {
      saveSession(data.user);
      setSuccess(true);
    },
    onError: (err) => setError(err.message),
  });

  const loginMutation = trpc.comments.login.useMutation({
    onSuccess: (data) => {
      saveSession(data.user);
      setSuccess(true);
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "register") {
      registerMutation.mutate({ name, email, password });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">
              {mode === "register" ? "Registracija uspješna!" : "Prijava uspješna!"}
            </h2>
            <p className="text-muted-foreground">
              Sad možete komentirati i ocjenjivati poslovanja u imeniku.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button asChild className="flex-1">
                <Link href="/pregled">Pretraži imenik</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">Naslovnica</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Naslovnica
          </Link>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Prijava" : "Registracija"}
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login"
              ? "Prijavite se za komentiranje i ocjenjivanje"
              : "Napravite račun za komentiranje"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Ime</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Vaše ime"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                    minLength={2}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="vas@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Lozinka</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder={mode === "register" ? "Minimalno 6 znakova" : "Vaša lozinka"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={mode === "register" ? 6 : 1}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded p-2">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending || loginMutation.isPending}
            >
              {registerMutation.isPending || loginMutation.isPending
                ? "Učitavanje..."
                : mode === "login"
                ? "Prijavi se"
                : "Registriraj se"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {mode === "login"
                ? "Nemate račun? Registrirajte se"
                : "Već imate račun? Prijavite se"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
