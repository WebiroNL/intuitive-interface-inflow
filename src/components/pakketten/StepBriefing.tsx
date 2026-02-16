import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BriefingData } from "./types";

interface StepBriefingProps {
  data: BriefingData;
  onChange: (data: BriefingData) => void;
}

export function StepBriefing({ data, onChange }: StepBriefingProps) {
  const update = (field: keyof BriefingData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Vertel ons over je project<span className="text-primary">.</span>
      </h2>
      <p className="text-muted-foreground mb-8">
        Vul onderstaande gegevens in zodat wij een passend voorstel kunnen maken.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <div className="space-y-2">
          <Label htmlFor="bedrijfsnaam">Bedrijfsnaam *</Label>
          <Input
            id="bedrijfsnaam"
            value={data.bedrijfsnaam}
            onChange={(e) => update("bedrijfsnaam", e.target.value)}
            placeholder="Jouw bedrijf B.V."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactpersoon">Contactpersoon *</Label>
          <Input
            id="contactpersoon"
            value={data.contactpersoon}
            onChange={(e) => update("contactpersoon", e.target.value)}
            placeholder="Jan Jansen"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mailadres *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jan@bedrijf.nl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefoon">Telefoonnummer *</Label>
          <Input
            id="telefoon"
            type="tel"
            value={data.telefoon}
            onChange={(e) => update("telefoon", e.target.value)}
            placeholder="06 12345678"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Huidige website (optioneel)</Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="www.jouwsite.nl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branche">Branche *</Label>
          <Input
            id="branche"
            value={data.branche}
            onChange={(e) => update("branche", e.target.value)}
            placeholder="Horeca, Retail, IT..."
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="doelgroep">Doelgroep *</Label>
          <Input
            id="doelgroep"
            value={data.doelgroep}
            onChange={(e) => update("doelgroep", e.target.value)}
            placeholder="Wie wil je bereiken met je website?"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="doel">Doel van de website *</Label>
          <Input
            id="doel"
            value={data.doel}
            onChange={(e) => update("doel", e.target.value)}
            placeholder="Meer klanten, online verkoop, informeren..."
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="opmerkingen">Overige opmerkingen</Label>
          <Textarea
            id="opmerkingen"
            value={data.opmerkingen}
            onChange={(e) => update("opmerkingen", e.target.value)}
            placeholder="Heb je nog specifieke wensen of vragen?"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
