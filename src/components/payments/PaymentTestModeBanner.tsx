import { isPaymentsTestMode } from "@/lib/stripe";

export function PaymentTestModeBanner() {
  if (!isPaymentsTestMode()) return null;
  return (
    <div className="w-full bg-orange-500/10 border-b border-orange-500/30 px-4 py-2 text-center text-xs text-orange-200">
      Testmodus actief — gebruik testkaart 4242 4242 4242 4242 (willekeurige toekomstige datum + CVC).
    </div>
  );
}
