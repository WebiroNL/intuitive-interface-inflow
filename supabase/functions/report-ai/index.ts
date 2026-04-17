import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { metrics, company_name, period } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Je bent een senior performance marketing analist bij Webiro. Je schrijft maandrapportages voor klanten in vlot, positief, professioneel Nederlands. Je gebruikt geen em-dashes, geen jargon zonder uitleg, en je formuleert resultaten altijd zo positief mogelijk zonder onwaarheden. Bedragen in euro's met Nederlands formaat (komma als decimaalteken). Houd zinnen kort en concreet. Geen emoji.`;

    const userMessage = `Bedrijf: ${company_name}
Periode: ${period}

Cijfers van deze maand:
${JSON.stringify(metrics, null, 2)}

Genereer alle teksten voor het maandrapport via de tool 'generate_report_copy'. 

Richtlijnen per veld:
- summary_bullets: 5 tot 6 korte, krachtige bullets met de belangrijkste hoogtepunten en 1 conclusie zin als laatste bullet. Gebruik concrete cijfers.
- reach_text: 2 korte alinea's over bereik en impressies. Leg uit wat de frequentie betekent (sweet spot tussen 1.5 en 3 voor naamsbekendheid). Vermeld het regio bereik positief.
- benchmark_text: 2 korte alinea's. Vergelijk de kosten per landing page view met de benchmark. Als er bespaard wordt, benadruk dat percentage. Als de CTR boven de benchmark ligt, vermeld dat ook.
- plain_language: precies 3 items met titel + uitleg. Titels: "Zichtbaarheid", "Interesse", "Bezoek". Korte begrijpelijke uitleg per item op basis van de cijfers.
- recommendation_bullets: 4 tot 5 concrete, actiegerichte aanbevelingen voor de volgende maand op basis van de cijfers. Denk aan: budget, targeting, creatives, lead conversie, retargeting.`;

    const tools = [{
      type: "function",
      function: {
        name: "generate_report_copy",
        description: "Genereert alle teksten voor het maandrapport.",
        parameters: {
          type: "object",
          properties: {
            summary_bullets: {
              type: "array",
              items: { type: "string" },
              description: "5-6 korte bullets met hoogtepunten en conclusie",
            },
            reach_text: {
              type: "string",
              description: "2 alinea's over bereik en impressies, gescheiden door dubbele newline",
            },
            benchmark_text: {
              type: "string",
              description: "2 alinea's over benchmark vergelijking, gescheiden door dubbele newline",
            },
            plain_language: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  text: { type: "string" },
                },
                required: ["title", "text"],
                additionalProperties: false,
              },
              description: "Precies 3 items: Zichtbaarheid, Interesse, Bezoek",
            },
            recommendation_bullets: {
              type: "array",
              items: { type: "string" },
              description: "4-5 concrete aanbevelingen voor volgende maand",
            },
          },
          required: ["summary_bullets", "reach_text", "benchmark_text", "plain_language", "recommendation_bullets"],
          additionalProperties: false,
        },
      },
    }];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "generate_report_copy" } },
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
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call returned", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Geen output ontvangen" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const args = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ result: args }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("report-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Onbekende fout" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
