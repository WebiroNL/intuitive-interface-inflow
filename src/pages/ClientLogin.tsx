import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { toast } from "sonner";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";

export default function ClientLogin() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
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
      else toast.error("Geen klantaccount gekoppeld aan dit account.");
    })();
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Vertaal identifier (e-mail of telefoon) naar het login e-mail dat Supabase Auth gebruikt
    const { data: resolved, error: resolveError } = await supabase.functions.invoke("client-activate", {
      body: { action: "resolve_login", identifier: identifier.trim() },
    });

    if (resolveError || (resolved as any)?.error) {
      setSubmitting(false);
      toast.error((resolved as any)?.error ?? "Ongeldige login");
      return;
    }

    const loginEmail = (resolved as any).login_email as string;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    setSubmitting(false);
    if (error) {
      toast.error("Ongeldige inloggegevens");
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
          <p className="text-sm text-muted-foreground mt-1">Log in met je mobiel nummer of e-mailadres</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-lg p-6 space-y-3" autoComplete="off">
          <FloatingInput
            id="identifier"
            type="text"
            label="Mobiel nummer of e-mailadres"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="off"
          />
          <FloatingInput
            id="password"
            type="password"
            label="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            showPasswordToggle
          />
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
