import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCallback } from "react";

export type CheckoutMode = "subscription" | "payment";

export interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  mode: CheckoutMode;
  // Subscription
  priceId?: string;
  setupPriceId?: string;
  contractDuration?: "monthly" | "yearly" | "2year";
  // One-time payment
  amountCents?: number;
  description?: string;
  paymentType?: "full" | "deposit" | "final" | "termination";
  orderId?: string;
  // Common
  customerEmail?: string;
  userId?: string;
  clientId?: string;
  title?: string;
}

export function CheckoutDialog(props: CheckoutDialogProps) {
  const {
    open, onClose, mode, priceId, setupPriceId, contractDuration,
    amountCents, description, paymentType, orderId,
    customerEmail, userId, clientId, title,
  } = props;

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const returnUrl = `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`;
    const fnName = mode === "subscription" ? "create-subscription-checkout" : "create-checkout";
    const body = mode === "subscription"
      ? {
          priceId,
          setupPriceId,
          contractDuration,
          customerEmail,
          userId,
          clientId,
          returnUrl,
          environment: getStripeEnvironment(),
        }
      : {
          amountCents,
          description,
          paymentType,
          orderId,
          customerEmail,
          userId,
          clientId,
          returnUrl,
          environment: getStripeEnvironment(),
        };

    const { data, error } = await supabase.functions.invoke(fnName, { body });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "Kon checkout niet starten");
    }
    return data.clientSecret as string;
  }, [mode, priceId, setupPriceId, contractDuration, amountCents, description, paymentType, orderId, customerEmail, userId, clientId]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{title || "Afrekenen"}</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          {open && (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
