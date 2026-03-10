import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { answers, followUp } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Je bent de creatief directeur van Webiro, een premium webdesign- en marketingbureau.
Je taak is om op basis van de antwoorden van een potentiële klant een visueel moodboard-concept te genereren en een passend pakket aan te bevelen.

De pakketten zijn:
- Starter (€499): 1-pager, basis design, 5 werkdagen
- Professional (€999): Multi-page, custom design, animaties, 7 werkdagen  
- Premium (€1.999): Alles van Professional + advanced animaties, CMS, prioriteit support

Je antwoord moet ALTIJD in het volgende JSON-formaat:
{
  "moodboard": {
    "stijl": "beschrijving van de visuele stijl (2-3 zinnen)",
    "kleuren": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "kleurNamen": ["naam1", "naam2", "naam3", "naam4", "naam5"],
    "typografie": { "heading": "font naam", "body": "font naam" },
    "sfeer": ["keyword1", "keyword2", "keyword3", "keyword4"],
    "layoutStijl": "beschrijving van layout aanpak",
    "inspiratie": "korte beschrijving van visuele referenties"
  },
  "pakketAdvies": {
    "aanbevolen": "Starter | Professional | Premium",
    "reden": "waarom dit pakket past (2-3 zinnen)",
    "extras": ["eventuele add-ons die relevant zijn"]
  },
  "samenvatting": "persoonlijke boodschap aan de klant over hun project (3-4 zinnen)"
}

Zorg dat de kleuren mooi op elkaar afgestemd zijn en passen bij de branche en stijlvoorkeur.
Geef altijd een eerlijk en passend advies, niet altijd het duurste pakket.
Als er een follow-up vraag is, geef een conversationeel antwoord in een "chat" veld naast de JSON.`;

    const userMessage = followUp
      ? `Eerdere antwoorden: ${JSON.stringify(answers)}\n\nVervolgvraag: ${followUp}`
      : `Hier zijn de antwoorden van de quiz:\n${JSON.stringify(answers, null, 2)}\n\nGenereer een moodboard-concept en pakketadvies.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Te veel verzoeken, probeer het later opnieuw." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-credits zijn op." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI fout" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from the response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If JSON parsing fails, return raw content
    }

    return new Response(JSON.stringify({ result: parsed || content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("moodboard-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
