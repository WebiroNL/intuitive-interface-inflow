import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";

export default function PartnerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    company_name: "",
    contact_person: "",
    phone: "",
    website: "",
    kvk_number: "",
    btw_number: "",
    iban: "",
    bank_name: "",
    address_street: "",
    address_city: "",
    address_postal: "",
    address_country: "NL",
    social_instagram: "",
    social_facebook: "",
    social_linkedin: "",
    social_tiktok: "",
    social_youtube: "",
    social_x: "",
    notes: "",
    agreed_terms: false,
  });
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const update = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed_terms) {
      toast.error("Akkoord met partner voorwaarden vereist");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Wachtwoord moet minstens 8 tekens zijn");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("partner-signup", { body: form });
    setLoading(false);

    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Aanmelding mislukt");
      return;
    }

    toast.success("Aanmelding ontvangen! We beoordelen je aanvraag binnen 1 werkdag.");
    // Auto sign in
    await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    navigate("/partner/dashboard");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src={isDark ? webiroLogoDark : webiroLogo} alt="Webiro" className="h-7 mx-auto" />
          </Link>
          <h1 className="text-[32px] font-semibold tracking-tight text-foreground">Word partner</h1>
          <p className="text-muted-foreground mt-2">
            Vul je gegevens in. We beoordelen je aanvraag.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
          {/* Account */}
          <section className="space-y-4">
            <h2 className="text-[15px] font-semibold text-foreground">Account</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mailadres *</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Wachtwoord *</Label>
                <Input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} />
              </div>
            </div>
          </section>

          {/* Bedrijf */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-[15px] font-semibold text-foreground">Bedrijf</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Bedrijfsnaam *</Label>
                <Input id="company_name" required value={form.company_name} onChange={(e) => update("company_name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="contact_person">Contactpersoon *</Label>
                <Input id="contact_person" required value={form.contact_person} onChange={(e) => update("contact_person", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Telefoon</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://" value={form.website} onChange={(e) => update("website", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="kvk_number">KvK nummer</Label>
                <Input id="kvk_number" value={form.kvk_number} onChange={(e) => update("kvk_number", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="btw_number">BTW nummer</Label>
                <Input id="btw_number" value={form.btw_number} onChange={(e) => update("btw_number", e.target.value)} />
              </div>
            </div>
          </section>

          {/* Adres */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-[15px] font-semibold text-foreground">Adres</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="address_street">Straat en huisnummer</Label>
                <Input id="address_street" value={form.address_street} onChange={(e) => update("address_street", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="address_postal">Postcode</Label>
                <Input id="address_postal" value={form.address_postal} onChange={(e) => update("address_postal", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="address_city">Plaats</Label>
                <Input id="address_city" value={form.address_city} onChange={(e) => update("address_city", e.target.value)} />
              </div>
            </div>
          </section>

          {/* Bank */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-[15px] font-semibold text-foreground">Uitbetaling</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_name">Rekeninghouder</Label>
                <Input id="bank_name" value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" placeholder="NL00 BANK 0000 0000 00" value={form.iban} onChange={(e) => update("iban", e.target.value)} />
              </div>
            </div>
          </section>

          {/* Social media */}
          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-[15px] font-semibold text-foreground">Social media</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="social_instagram">Instagram</Label>
                <Input id="social_instagram" placeholder="@username" value={form.social_instagram} onChange={(e) => update("social_instagram", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="social_facebook">Facebook</Label>
                <Input id="social_facebook" placeholder="https://facebook.com/..." value={form.social_facebook} onChange={(e) => update("social_facebook", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="social_linkedin">LinkedIn</Label>
                <Input id="social_linkedin" placeholder="https://linkedin.com/in/..." value={form.social_linkedin} onChange={(e) => update("social_linkedin", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="social_tiktok">TikTok</Label>
                <Input id="social_tiktok" placeholder="https://tiktok.com/@..." value={form.social_tiktok} onChange={(e) => update("social_tiktok", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="social_youtube">YouTube</Label>
                <Input id="social_youtube" placeholder="https://youtube.com/@..." value={form.social_youtube} onChange={(e) => update("social_youtube", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="social_x">X (Twitter)</Label>
                <Input id="social_x" placeholder="https://x.com/..." value={form.social_x} onChange={(e) => update("social_x", e.target.value)} />
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4 pt-4 border-t border-border">
            <Label htmlFor="notes">Vertel kort wie je bent en hoe je Webiro wilt promoten</Label>
            <Textarea id="notes" rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </section>

          {/* Akkoord */}
          <div className="flex items-start gap-3 pt-4 border-t border-border">
            <Checkbox id="agreed" checked={form.agreed_terms} onCheckedChange={(v) => update("agreed_terms", !!v)} />
            <Label htmlFor="agreed" className="text-[13px] font-normal leading-relaxed cursor-pointer">
              Ik ga akkoord met de{" "}
              <Link to="/algemene-voorwaarden" className="text-primary underline">algemene voorwaarden</Link>{" "}
              en het privacybeleid van Webiro.
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Bezig..." : "Aanmelden als partner"}
          </Button>

          <p className="text-center text-[13px] text-muted-foreground">
            Al een account?{" "}
            <Link to="/partner/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
