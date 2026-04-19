import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag02Icon } from "@hugeicons/core-free-icons";
import { useCartStore } from "@/stores/cartStore";

export const CartButton = ({ className = "" }: { className?: string }) => {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={openCart}
      aria-label={`Winkelwagen (${totalItems})`}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors ${className}`}
    >
      <HugeiconsIcon icon={ShoppingBag02Icon} size={18} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center leading-none">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
};
