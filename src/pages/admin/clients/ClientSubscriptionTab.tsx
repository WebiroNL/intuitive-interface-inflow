import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Client {
  id: string;
  company_name: string;
  email?: string | null;
  contact_person?: string | null;
  first_name?: string | null;
}

interface Props {
  client: Client;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function ClientSubscriptionTab({ client }: Props) {
  const [serviceLabel, setServiceLabel] = useState("3 maanden Google Ads");
  const [monthlyEuros, setMonthlyEuros] = useState(500);
  const [discountPercent, setDiscountPercent] = useState(50);
  const [discountMonths, setDiscountMonths] = useState(3);
  const [contractMonths, setContractMonths] = useState(3);
  const [contractStartDate, setContractStartDate] = useState("2026-05-05");
  const [cancelAtEnd, setCancelAtEnd] = useState(false);

  const [isTest, setIsTest] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [emailLog, setEmailLog] = useState<string | null>(null);

  const recipientForEmail = isTest ? testEmail.trim() : (client.email || "");
  const ready =
    serviceLabel.trim().length > 0 &&
    monthlyEuros > 0 &&
    contractMonths > 0 &&
    contractStartDate &&
    (!isTest || /\S+@\S+\.\S+/.test(testEmail)) &&
    (isTest || (client.email && /\S+@\S+\.\S+/.test(client.email)));

  async function handleSend() {
    if (!ready) {
      toast.error("Vul alle velden correct in");
      return;
    }
    setSending(true);
    setCreatedLink(null);
    setEmailLog(null);
    try {
      // 1. Stripe link aanmaken
      const { data, error } = await supabase.functions.invoke("create-client-subscription", {
        body: {
          clientId: client.id,
          serviceLabel,
          monthlyAmountCents: Math.round(monthlyEuros * 100),
          discountPercent: discountPercent || undefined,
          discountMonths: discountMonths || undefined,
          contractMonths,
          contractStartDate,
          cancelAtEnd,
          environment: "live",
          returnUrl: `${window.location.origin}/portaal?abonnement=ok`,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      const url = (data as any).url as string;
      setCreatedLink(url);

      // 2. Email versturen
      const idempotencyKey = `subscription-link-${client.id}-${(data as any).sessionId}-${isTest ? "test" : "live"}`;
      const { error: mailErr } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "payment-link",
          recipientEmail: recipientForEmail,
          idempotencyKey,
          templateData: {
            recipientName: client.first_name || client.contact_person || "",
            companyName: client.company_name,
            serviceDescription: serviceLabel,
            monthlyAmount: `€${monthlyEuros}`,
            discountText: discountPercent && discountMonths
              ? `${discountPercent}% korting eerste ${discountMonths} maanden`
              : "Geen korting",
            contractStartDate: new Date(contractStartDate).toLocaleDateString("nl-NL", {
              day: "numeric", month: "long", year: "numeric",
            }),
            contractDuration: `${contractMonths} maanden`,
            paymentUrl: url,
            isTest,
          },
        },
      });
      if (mailErr) throw mailErr;

      setEmailLog(
        isTest
          ? `Test verstuurd naar ${recipientForEmail}. Stripe link is echt en werkend.`
          : `Live verstuurd naar ${recipientForEmail}.`,
      );
      toast.success(isTest ? "Testmail verstuurd" : "Betaalverzoek verstuurd");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Mislukt");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-lg border border-border p-4 space-y-4">
        <h3 className="font-semibold">Contract & prijs</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Dienst (op factuur en in mail)</Label>
            <Input value={serviceLabel} onChange={(e) => setServiceLabel(e.target.value)} />
          </div>
          <div>
            <Label>Maandbedrag (€, ex BTW)</Label>
            <Input type="number" value={monthlyEuros} onChange={(e) => setMonthlyEuros(Number(e.target.value))} />
          </div>
          <div>
            <Label>Looptijd (maanden)</Label>
            <Input type="number" value={contractMonths} onChange={(e) => setContractMonths(Number(e.target.value))} />
          </div>
          <div>
            <Label>Korting (%)</Label>
            <Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} />
          </div>
          <div>
            <Label>Korting voor (maanden)</Label>
            <Input type="number" value={discountMonths} onChange={(e) => setDiscountMonths(Number(e.target.value))} />
          </div>
          <div>
            <Label>Startdatum abonnement</Label>
            <Input type="date" value={contractStartDate} onChange={(e) => setContractStartDate(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">
              Klant betaalt nu €0 via iDEAL (SEPA mandaat). Eerste afschrijving op deze datum.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={cancelAtEnd} onCheckedChange={setCancelAtEnd} />
            <Label className="cursor-pointer">Stop automatisch na looptijd</Label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Verzending</h3>
          <div className="flex items-center gap-2">
            <Switch checked={isTest} onCheckedChange={setIsTest} />
            <Label className="cursor-pointer text-sm">{isTest ? "Testmodus" : "Live verzenden"}</Label>
          </div>
        </div>

        {isTest ? (
          <div>
            <Label>Test e-mailadres</Label>
            <Input
              type="email"
              placeholder="jij@webiro.nl"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              De Stripe link is echt en werkt. Doorlopen vanaf de testmail = échte SEPA mandaat.
              Open hem dus alleen om de inhoud te checken; rond niet af tenzij dit de bedoeling is.
            </p>
          </div>
        ) : (
          <div>
            <Label>Klant ontvangt mail op</Label>
            <Input value={client.email || ""} disabled />
          </div>
        )}

        <Button onClick={handleSend} disabled={!ready || sending} className="w-full">
          {sending
            ? "Bezig…"
            : isTest
              ? "Stuur test naar mij"
              : `Stuur betaalverzoek naar ${client.company_name}`}
        </Button>

        {createdLink && (
          <div className="space-y-2 pt-2 border-t border-border">
            <Label>Payment link (kun je ook handmatig kopiëren)</Label>
            <div className="flex gap-2">
              <Input value={createdLink} readOnly className="text-xs" />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(createdLink);
                  toast.success("Link gekopieerd");
                }}
              >
                Kopieer
              </Button>
            </div>
            {emailLog && <p className="text-xs text-muted-foreground">{emailLog}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
