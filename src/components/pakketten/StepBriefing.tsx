import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefingData } from "./types";

interface StepBriefingProps {
  data: BriefingData;
  onChange: (data: BriefingData) => void;
}

export function StepBriefing({ data, onChange }: StepBriefingProps) {
  const update = (field: keyof BriefingData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div>
      <div className="mb-8">
        <h2
          className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
        >
          <span className="text-foreground">Vertel ons over je project</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[14px] text-muted-foreground">
          Vul onderstaande gegevens in zodat wij een passend voorstel kunnen maken.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
        <div className="space-y-1.5">
          <Label htmlFor="naam" className="text-[13px]">Naam *</Label>
          <Input id="naam" value={data.naam} onChange={(e) => update("naam", e.target.value)} placeholder="Jan Jansen" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bedrijfsnaam" className="text-[13px]">Bedrijfsnaam</Label>
          <Input id="bedrijfsnaam" value={data.bedrijfsnaam} onChange={(e) => update("bedrijfsnaam", e.target.value)} placeholder="Jouw bedrijf B.V." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kvkNummer" className="text-[13px]">KVK-nummer</Label>
          <Input id="kvkNummer" value={data.kvkNummer} onChange={(e) => update("kvkNummer", e.target.value)} placeholder="12345678" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="btwNummer" className="text-[13px]">BTW-nummer</Label>
          <Input id="btwNummer" value={data.btwNummer} onChange={(e) => update("btwNummer", e.target.value)} placeholder="NL123456789B01" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px]">E-mailadres *</Label>
          <Input id="email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="jan@bedrijf.nl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="telefoon" className="text-[13px]">Telefoonnummer *</Label>
          <Input id="telefoon" type="tel" value={data.telefoon} onChange={(e) => update("telefoon", e.target.value)} placeholder="06 12345678" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website" className="text-[13px]">Huidige website (optioneel)</Label>
          <Input id="website" value={data.website} onChange={(e) => update("website", e.target.value)} placeholder="www.jouwsite.nl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gewensteOpleverdatum" className="text-[13px]">Gewenste opleverdatum</Label>
          <Input id="gewensteOpleverdatum" value={data.gewensteOpleverdatum} onChange={(e) => update("gewensteOpleverdatum", e.target.value)} placeholder="Zo snel mogelijk, volgende maand..." />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="doelWebsite" className="text-[13px]">Wat is het doel van je website? *</Label>
          <Input id="doelWebsite" value={data.doelWebsite} onChange={(e) => update("doelWebsite", e.target.value)} placeholder="Meer klanten, online verkoop, informeren..." />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="doelgroep" className="text-[13px]">Wie is je doelgroep? *</Label>
          <Input id="doelgroep" value={data.doelgroep} onChange={(e) => update("doelgroep", e.target.value)} placeholder="Ondernemers, consumenten, specifieke leeftijdsgroep..." />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="inspiratieWebsites" className="text-[13px]">Heb je inspiratiewebsites? (optioneel)</Label>
          <Input id="inspiratieWebsites" value={data.inspiratieWebsites} onChange={(e) => update("inspiratieWebsites", e.target.value)} placeholder="www.voorbeeld.nl, www.inspiratie.com" />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="opmerkingen" className="text-[13px]">Aanvullende informatie</Label>
          <Textarea id="opmerkingen" value={data.opmerkingen} onChange={(e) => update("opmerkingen", e.target.value)} placeholder="Heb je nog specifieke wensen of vragen?" rows={4} />
        </div>

        {/* Kortingscode */}
        <div className="space-y-1.5">
          <Label htmlFor="kortingscode" className="text-[13px]">Kortingscode</Label>
          <Input id="kortingscode" value={data.kortingscode} onChange={(e) => update("kortingscode", e.target.value)} placeholder="CODE123" />
        </div>

        <div className="md:col-span-2 space-y-4 pt-4 border-t border-border">
          <div className="flex items-start gap-3">
            <Checkbox
              id="emailUpdates"
              checked={data.emailUpdates}
              onCheckedChange={(checked) => update("emailUpdates", !!checked)}
            />
            <Label htmlFor="emailUpdates" className="text-[13px] text-muted-foreground font-normal leading-snug cursor-pointer">
              Ik wil graag e-mail updates ontvangen van Webiro
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="akkoord"
              checked={data.akkoord}
              onCheckedChange={(checked) => update("akkoord", !!checked)}
            />
            <Label htmlFor="akkoord" className="text-[13px] text-muted-foreground font-normal leading-snug cursor-pointer">
              Ik ga akkoord met de opdracht en betaling *
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
