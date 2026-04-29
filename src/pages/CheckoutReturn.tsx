import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Tick02Icon, Loading03Icon } from "@hugeicons/react";
import { supabase } from "@/integrations/supabase/client";

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "unknown">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("unknown");
      return;
    }
    // Best-effort: check if our webhook already inserted the payment row.
    // If not, just show a generic success — Stripe will eventually fire the webhook.
    let cancelled = false;
    const check = async () => {
      for (let i = 0; i < 6; i++) {
        const { data } = await supabase
          .from("payments")
          .select("id, status")
          .eq("stripe_session_id", sessionId)
          .maybeSingle();
        if (cancelled) return;
        if (data) {
          setStatus("success");
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!cancelled) setStatus("success");
    };
    check();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" ? (
          <>
            <Loading03Icon className="h-12 w-12 text-primary animate-spin mx-auto" />
            <h1 className="text-2xl font-semibold">Betaling verwerken...</h1>
            <p className="text-muted-foreground">Even geduld, we bevestigen je betaling.</p>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Tick02Icon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold">Bedankt voor je betaling</h1>
            <p className="text-muted-foreground">
              Je ontvangt binnen enkele minuten een bevestiging per e-mail. We nemen zo snel mogelijk contact met je op.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link to="/dashboard" className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                Naar mijn portaal
              </Link>
              <Link to="/" className="px-5 py-2.5 rounded-md border border-border text-sm font-medium">
                Terug naar home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
