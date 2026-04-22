import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Delete02Icon,
  ArrowRight01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const formatPrice = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: currencyCode }).format(
    parseFloat(amount),
  );

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    isLoading,
    isSyncing,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode || "EUR";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    if (!user) {
      closeCart();
      toast.info("Log in om af te rekenen", {
        action: {
          label: "Inloggen",
          onClick: () => navigate("/dashboard", { state: { returnTo: "/shop" } }),
        },
      });
      return;
    }

    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      closeCart();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? null : closeCart())}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0">
        <SheetHeader className="flex-shrink-0 px-6 py-5 border-b border-border">
          <SheetTitle className="text-[18px] font-semibold tracking-tight">
            Winkelwagen
          </SheetTitle>
          <SheetDescription className="text-[13px] text-muted-foreground">
            {totalItems === 0
              ? "Je winkelwagen is leeg"
              : `${totalItems} ${totalItems === 1 ? "product" : "producten"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <HugeiconsIcon
                    icon={ShoppingCart01Icon}
                    size={22}
                    className="text-muted-foreground"
                  />
                </div>
                <p className="text-[14px] text-muted-foreground mb-6">Nog geen producten toegevoegd</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    closeCart();
                    navigate("/shop");
                  }}
                >
                  Verder winkelen
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-4 pb-5 border-b border-border last:border-0"
                    >
                      <div className="w-20 h-20 bg-muted/40 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[14px] text-foreground line-clamp-1">
                          {item.product.node.title}
                        </h4>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            {item.selectedOptions.map((o) => o.value).join(" • ")}
                          </p>
                        )}
                        <p className="text-[14px] font-semibold text-foreground mt-2">
                          {formatPrice(item.price.amount, item.price.currencyCode)}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center border border-border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              disabled={isLoading}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                            >
                              <HugeiconsIcon icon={MinusSignIcon} size={12} />
                            </button>
                            <span className="w-8 text-center text-[13px] font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={isLoading}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                            >
                              <HugeiconsIcon icon={PlusSignIcon} size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            disabled={isLoading}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            aria-label="Verwijder"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 px-6 py-5 border-t border-border bg-background space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[14px] text-muted-foreground">Subtotaal</span>
                  <span className="text-[18px] font-bold text-foreground">
                    {formatPrice(totalPrice.toString(), currency)}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground -mt-2">
                  Verzending en BTW worden berekend bij afrekenen.
                </p>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-11"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
                  ) : (
                    <>
                      Afrekenen
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
                    </>
                  )}
                </Button>
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/shop");
                  }}
                  className="w-full text-center text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Verder winkelen
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
