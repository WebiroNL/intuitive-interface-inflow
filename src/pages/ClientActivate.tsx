import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";

interface ClientLookup {
  id: string;
  company_name: string;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  contact_person: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  address_street: string | null;
  address_postal: string | null;
  address_city: string | null;
  address_country: string | null;
}

function checkPasswordStrength(p: string): { ok: boolean; messages: string[] } {
  const messages: string[] = [];
  if (p.length < 10) messages.push("Minimaal 10 tekens");
  if (!/[a-z]/.test(p)) messages.push("Minimaal één kleine letter");
  if (!/[A-Z]/.test(p)) messages.push("Minimaal één hoofdletter");
  if (!/[0-9]/.test(p)) messages.push("Minimaal één cijfer");
  return { ok: messages.length === 0, messages };
}

export default function ClientActivate() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ClientLookup | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    kvk_number: "",
    btw_number: "",
    address_street: "",
    address_postal: "",
    address_city: "",
    password: "",
    password2: "",
  });

  useEffect(() => {
    if (!token) {
      setError("Geen activatie token gevonden in de URL");
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error: invokeError } = await supabase.functions.invoke("client-activate", {
        body: { action: "lookup", token },
      });
      if (invokeError || (data as any)?.error) {
        setError((data as any)?.error ?? "Kan link niet valideren");
        setLoading(false);
        return;
      }
      const c = (data as any).client as ClientLookup;
      setClient(c);
      setForm((f) => ({
        ...f,
        company_name: c.company_name ?? "",
        email: c.email ?? "",
        phone: c.phone ?? "",
        first_name: c.first_name ?? "",
        last_name: c.last_name ?? "",
        kvk_number: c.kvk_number ?? "",
        btw_number: c.btw_number ?? "",
        address_street: c.address_street ?? "",
        address_postal: c.address_postal ?? "",
        address_city: c.address_city ?? "",
      }));
      setLoading(false);
    })();
  }, [token]);

  const strength = checkPasswordStrength(form.password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error("Wachtwoorden komen niet overeen");
      return;
    }
    if (!strength.ok) {
      toast.error("Wachtwoord voldoet niet aan eisen");
      return;
    }
    if (!form.email.trim() && !form.phone.trim()) {
      toast.error("Vul ten minste e-mail of telefoon in");
      return;
    }

    setSubmitting(true);
    let resJson: any = null;
    try {
      const res = await fetch(
        `https://epostamzxunjjrjjnotj.supabase.co/functions/v1/client-activate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "activate",
            token,
            password: form.password,
            fields: {
              company_name: form.company_name,
              email: form.email,
              phone: form.phone,
              first_name: form.first_name,
              last_name: form.last_name,
              kvk_number: form.kvk_number,
              btw_number: form.btw_number,
              address_street: form.address_street,
              address_postal: form.address_postal,
              address_city: form.address_city,
            },
          }),
        }
      );
      resJson = await res.json().catch(() => ({}));
      if (!res.ok || resJson?.error) {
        setSubmitting(false);
        toast.error(resJson?.error ?? `Activeren mislukt (${res.status})`);
        return;
      }
    } catch (err) {
      setSubmitting(false);
      toast.error((err as Error).message || "Netwerkfout");
      return;
    }
    const data = resJson;

    const loginEmail = (data as any).login_email as string;
    // Direct inloggen
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: form.password,
    });
    setSubmitting(false);
    if (signErr) {
      toast.success("Account aangemaakt — log nu in");
      navigate("/client/login", { replace: true });
      return;
    }
    toast.success("Welkom!");
    navigate("/dashboard", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-3 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] text-center">
          <img src={webiroLogo} alt="Webiro" className="h-7 mb-6 mx-auto block dark:hidden" />
          <img src={webiroLogoDark} alt="Webiro" className="h-7 mb-6 mx-auto hidden dark:block" />
          <div className="bg-card border border-border rounded-lg p-8">
            <h1 className="text-xl font-semibold text-foreground mb-2">Link ongeldig</h1>
            <p className="text-sm text-muted-foreground mb-6">{error ?? "Deze activatielink werkt niet meer."}</p>
            <Button variant="outline" onClick={() => navigate("/client/login")}>Naar inlogpagina</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[560px]">
        <div className="flex flex-col items-center mb-8">
          <img src={webiroLogo} alt="Webiro" className="h-7 mb-6 block dark:hidden" />
          <img src={webiroLogoDark} alt="Webiro" className="h-7 mb-6 hidden dark:block" />
          <h1 className="text-2xl font-semibold text-foreground">Account activeren</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Welkom {client.company_name}. Vul ontbrekende gegevens aan en kies een sterk wachtwoord.
          </p>
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          {/* Bedrijf */}
          <div>
            <Label htmlFor="company_name">Bedrijfsnaam *</Label>
            <Input id="company_name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} required className="mt-1.5" />
          </div>

          {/* Login gegevens */}
          <div className="bg-muted/30 border border-border rounded p-3 space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Login gegevens (minimaal één vereist)</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" placeholder="info@bedrijf.nl" />
              </div>
              <div>
                <Label htmlFor="phone">Telefoon</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" placeholder="+316..." />
              </div>
            </div>
          </div>

          {/* Naam */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="first_name">Voornaam *</Label>
              <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="last_name">Achternaam *</Label>
              <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required className="mt-1.5" />
            </div>
          </div>

          {/* Bedrijfsgegevens */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="kvk">KVK nummer *</Label>
              <Input id="kvk" value={form.kvk_number} onChange={(e) => setForm({ ...form, kvk_number: e.target.value })} required className="mt-1.5" placeholder="12345678" />
            </div>
            <div>
              <Label htmlFor="btw">BTW nummer (optioneel)</Label>
              <Input id="btw" value={form.btw_number} onChange={(e) => setForm({ ...form, btw_number: e.target.value })} className="mt-1.5" placeholder="NL000000000B00" />
            </div>
          </div>

          {/* Adres */}
          <div className="bg-muted/30 border border-border rounded p-3 space-y-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Adres (optioneel)</p>
            <div>
              <Label htmlFor="street">Straat + huisnummer</Label>
              <Input id="street" value={form.address_street} onChange={(e) => setForm({ ...form, address_street: e.target.value })} className="mt-1.5" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="postal">Postcode</Label>
                <Input id="postal" value={form.address_postal} onChange={(e) => setForm({ ...form, address_postal: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="city">Plaats</Label>
                <Input id="city" value={form.address_city} onChange={(e) => setForm({ ...form, address_city: e.target.value })} className="mt-1.5" />
              </div>
            </div>
          </div>

          {/* Wachtwoord */}
          <div className="border-t border-border pt-5 space-y-3">
            <div>
              <Label htmlFor="password">Wachtwoord *</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="mt-1.5"
                autoComplete="new-password"
              />
              {form.password && !strength.ok && (
                <ul className="mt-2 text-[12px] text-destructive space-y-0.5">
                  {strength.messages.map((m) => <li key={m}>• {m}</li>)}
                </ul>
              )}
              {form.password && strength.ok && (
                <p className="mt-2 text-[12px] text-emerald-600">✓ Sterk wachtwoord</p>
              )}
            </div>
            <div>
              <Label htmlFor="password2">Bevestig wachtwoord *</Label>
              <Input
                id="password2"
                type="password"
                value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })}
                required
                className="mt-1.5"
                autoComplete="new-password"
              />
              {form.password2 && form.password !== form.password2 && (
                <p className="mt-1 text-[12px] text-destructive">Wachtwoorden komen niet overeen</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Bezig..." : "Account activeren"}
          </Button>
        </form>
      </div>
    </div>
  );
}
