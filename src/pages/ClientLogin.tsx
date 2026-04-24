import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";

export default function ClientLogin() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading || !user) return;
    (async () => {
      const { data } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.id) navigate("/dashboard", { replace: true });
      else toast.error("Geen klantaccount gekoppeld aan dit e-mailadres.");
    })();
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Ingelogd");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <img src={webiroLogo} alt="Webiro" className="h-7 mb-6 block dark:hidden" />
          <img src={webiroLogoDark} alt="Webiro" className="h-7 mb-6 hidden dark:block" />
          <h1 className="text-2xl font-semibold text-foreground">Klantportaal</h1>
          <p className="text-sm text-muted-foreground mt-1">Log in om je dashboard te bekijken</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-6 space-y-4" autoComplete="off">
          <div>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5"
              placeholder="jij@bedrijf.nl"
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Bezig..." : "Inloggen"}
          </Button>
        </form>

        <p className="text-center text-[12px] text-muted-foreground mt-4">
          Geen toegang? Neem contact op met je accountmanager bij Webiro.
        </p>
      </div>
    </div>
  );
}
