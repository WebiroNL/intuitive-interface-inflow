import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";

export default function PartnerLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    // Verify partner record
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: partner } = await supabase
        .from("partners")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!partner) {
        toast.error("Geen partner account gevonden bij dit e-mailadres");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      if (partner.status !== "approved") {
        toast.warning(
          partner.status === "pending"
            ? "Je aanmelding wordt nog beoordeeld"
            : "Je partner account is niet actief",
        );
      }
      navigate("/partner/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src={isDark ? webiroLogoDark : webiroLogo} alt="Webiro" className="h-7 mx-auto" />
          </Link>
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Partner login</h1>
          <p className="text-muted-foreground mt-1 text-[14px]">Log in op je partner dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div>
            <Label htmlFor="email">E-mailadres</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Inloggen..." : "Inloggen"}
          </Button>
        </form>

        <p className="text-center text-[13px] text-muted-foreground mt-6">
          Nog geen partner?{" "}
          <Link to="/partner/register" className="text-primary hover:underline font-medium">
            Word partner
          </Link>
        </p>
      </div>
    </div>
  );
}
