import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type FieldKey =
  | "all"
  | "summary_bullets"
  | "reach_text"
  | "benchmark_text"
  | "plain_language"
  | "recommendation_bullets"
  | "insights";

const FIELD_GUIDELINES: Record<FieldKey, string> = {
  all: `Genereer alle teksten via 'generate_report_copy'.
- summary_bullets: 5 tot 6 korte bullets met hoogtepunten + 1 conclusie als laatste bullet.
- reach_text: 2 alinea's over bereik, impressies en frequentie (sweet spot 1.5-3).
- benchmark_text: 2 alinea's over vergelijking met markt-benchmark.
- plain_language: precies 3 items met titels "Zichtbaarheid", "Interesse", "Bezoek".
- recommendation_bullets: 4 tot 5 concrete aanbevelingen voor volgende maand.`,
  summary_bullets: `Genereer ALLEEN summary_bullets via 'generate_report_copy': 5-6 korte, krachtige bullets met de belangrijkste hoogtepunten + 1 conclusie zin als laatste bullet. Gebruik concrete cijfers.`,
  reach_text: `Genereer ALLEEN reach_text via 'generate_report_copy': 2 korte alinea's over bereik en impressies, gescheiden door dubbele newline. Leg uit wat de frequentie betekent (sweet spot 1.5-3 voor naamsbekendheid).`,
  benchmark_text: `Genereer ALLEEN benchmark_text via 'generate_report_copy': 2 korte alinea's over benchmark vergelijking, gescheiden door dubbele newline. Vergelijk kosten per LPV en CTR met de markt-benchmark. Benadruk besparing of voorsprong.`,
  plain_language: `Genereer ALLEEN plain_language via 'generate_report_copy': precies 3 items met titels "Zichtbaarheid", "Interesse", "Bezoek". Korte begrijpelijke uitleg per item op basis van de cijfers.`,
  recommendation_bullets: `Genereer ALLEEN recommendation_bullets via 'generate_report_copy': 4-5 concrete, actiegerichte aanbevelingen voor de volgende maand. Denk aan budget, targeting, creatives, lead conversie, retargeting.`,
  insights: `Genereer ALLEEN insights via 'generate_report_copy': een korte interne notitie (3-5 zinnen) voor het Webiro-team met opvallende observaties, kansen en aandachtspunten op basis van de cijfers. Mag iets directer/technischer zijn dan klanttekst.`,
};

function buildToolForField(field: FieldKey) {
  const allProps: Record<string, any> = {
    summary_bullets: { type: "array", items: { type: "string" } },
    reach_text: { type: "string" },
    benchmark_text: { type: "string" },
    plain_language: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, text: { type: "string" } },
        required: ["title", "text"],
        additionalProperties: false,
      },
    },
    recommendation_bullets: { type: "array", items: { type: "string" } },
    insights: { type: "string" },
  };

  let properties: Record<string, any>;
  let required: string[];
  if (field === "all") {
    // backwards compatible: zonder insights (oude flow)
    properties = {
      summary_bullets: allProps.summary_bullets,
      reach_text: allProps.reach_text,
      benchmark_text: allProps.benchmark_text,
      plain_language: allProps.plain_language,
      recommendation_bullets: allProps.recommendation_bullets,
    };
    required = Object.keys(properties);
  } else {
    properties = { [field]: allProps[field] };
    required = [field];
  }

  return [{
    type: "function",
    function: {
      name: "generate_report_copy",
      description: "Genereert teksten voor het maandrapport.",
      parameters: { type: "object", properties, required, additionalProperties: false },
    },
  }];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { metrics, company_name, period, field } = await req.json();
    const targetField: FieldKey = (field as FieldKey) ?? "all";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Je bent een senior performance marketing analist bij Webiro. Je schrijft maandrapportages voor klanten in vlot, positief, professioneel Nederlands. Je gebruikt geen em-dashes, geen jargon zonder uitleg, en je formuleert resultaten altijd zo positief mogelijk zonder onwaarheden. Bedragen in euro's met Nederlands formaat (komma als decimaalteken). Houd zinnen kort en concreet. Geen emoji.`;

    const userMessage = `Bedrijf: ${company_name}
Periode: ${period}

Cijfers van deze maand:
${JSON.stringify(metrics, null, 2)}

${FIELD_GUIDELINES[targetField] ?? FIELD_GUIDELINES.all}`;

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
        tools: buildToolForField(targetField),
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
