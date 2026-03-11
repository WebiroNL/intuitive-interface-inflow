import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBag01Icon, ArrowRight01Icon, Truck01Icon, ShieldKeyIcon, FlashIcon, StarIcon } from '@hugeicons/core-free-icons';
import { updatePageMeta } from "@/utils/seo";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { CTASection } from "@/components/CTASection";

const formatPrice = (amount: string, currencyCode: string) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: currencyCode }).format(parseFloat(amount));

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePageMeta(
      "Shop – Premium NFC Producten | Webiro",
      "Verzamel moeiteloos Google Reviews met onze premium NFC bordjes, stickers en sleutelhangers. Direct leverbaar."
    );
  }, []);

  useEffect(() => {
    fetchProducts(20)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-background pt-[60px]">
      {/* ══════ HERO ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">
                Premium NFC producten
              </p>
              <h1
                className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
              >
                <span className="text-foreground">Meer reviews. </span>
                <span className="text-primary/70">Met één tik.</span>
              </h1>
              <p className="text-[16px] text-muted-foreground leading-relaxed max-w-md mb-8">
                Onze NFC-producten maken het verzamelen van Google Reviews moeiteloos. Klanten tikken,
                reviewen, klaar.
              </p>

              {/* Trust strip */}
              <div className="flex flex-wrap gap-6 text-[13px] text-muted-foreground">
                {[
                  { icon: Truck01Icon, text: "Gratis verzending v/a €50" },
                  { icon: ShieldKeyIcon, text: "14 dagen retour" },
                  { icon: FlashIcon, text: "Direct leverbaar" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <HugeiconsIcon icon={icon} size={15} className="text-primary" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature visual — stacked NFC mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {[
                    { label: "Plug & Play", desc: "Wij programmeren, jij plaatst" },
                    { label: "Premium kwaliteit", desc: "Waterdicht & krasbestendig" },
                    { label: "Eigen branding", desc: "Volledig in jouw huisstijl" },
                    { label: "Nederlandse support", desc: "Hulp bij installatie" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors"
                    >
                      <h3 className="text-[14px] font-semibold text-foreground mb-1">{item.label}</h3>
                      <p className="text-[13px] text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ PRODUCTS ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.08]"
                style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
              >
                Alle producten
              </h2>
              {!loading && (
                <p className="text-sm text-muted-foreground mt-2">{products.length} producten</p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                  <div className="aspect-[4/5] bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-5 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link
                  key={product.node.id}
                  to={`/shop/${product.node.handle}`}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] bg-muted/30 relative overflow-hidden">
                    {product.node.images.edges[0]?.node ? (
                      <img
                        src={product.node.images.edges[0].node.url}
                        alt={product.node.images.edges[0].node.altText || product.node.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-background text-foreground text-[13px] font-semibold rounded-lg">
                        Bekijk product <ArrowRight size={14} />
                      </span>
                    </div>

                    {/* Variant count badge */}
                    {product.node.variants.edges.length > 1 && (
                      <span className="absolute top-3 right-3 text-[11px] font-medium px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground">
                        {product.node.variants.edges.length} varianten
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                      {product.node.title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground line-clamp-2 mb-3">
                      {product.node.description?.substring(0, 100)}
                    </p>
                    <p className="text-[18px] font-bold text-foreground">
                      {formatPrice(
                        product.node.priceRange.minVariantPrice.amount,
                        product.node.priceRange.minVariantPrice.currencyCode
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Geen producten gevonden</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We werken aan onze productcatalogus. Neem contact op als je specifieke wensen hebt.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════ USP SECTION ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-2xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08] mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              Waarom Webiro NFC?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Onze NFC-producten helpen ondernemers om moeiteloos meer Google Reviews te verzamelen en
              hun online reputatie te versterken.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Plug & Play",
                desc: "Wij programmeren alles voor je. Ontvang, plaats en begin direct met verzamelen.",
              },
              {
                icon: Star,
                title: "Premium kwaliteit",
                desc: "Hoogwaardige materialen die jarenlang meegaan. Waterdicht, krasbestendig en stijlvol.",
              },
              {
                icon: Shield,
                title: "Nederlandse support",
                desc: "Hulp nodig? Ons team staat klaar voor installatie, configuratie en al je vragen.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
