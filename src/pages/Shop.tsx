import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Sparkles, Truck, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updatePageMeta } from "@/utils/seo";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePageMeta(
      "Webiro Shop - NFC Producten voor Ondernemers",
      "Verzamel moeiteloos Google Reviews met onze NFC bordjes, sleutelhangers en stickers. Premium kwaliteit, direct leverbaar.",
      "/shop"
    );
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(20);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        
        <div className="container-webiro relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium NFC Producten</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Meer <span className="text-primary">Google Reviews</span><br />
              met één tik
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Onze NFC producten maken het verzamelen van klantreviews moeiteloos. 
              Klanten tikken, reviewen, klaar. Zo simpel is het.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span>Gratis verzending vanaf €50</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>14 dagen retour</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Direct leverbaar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-4">
        <div className="container-webiro">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Alle Producten</h2>
            <Badge variant="secondary" className="text-sm">
              {products.length} producten
            </Badge>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-lg animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-5">
                    <div className="h-5 bg-muted rounded mb-3" />
                    <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Link 
                  key={product.node.id} 
                  to={`/shop/${product.node.handle}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card">
                    {/* Image container */}
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                      {product.node.images.edges[0]?.node ? (
                        <img
                          src={product.node.images.edges[0].node.url}
                          alt={product.node.images.edges[0].node.altText || product.node.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                          <ShoppingBag className="w-16 h-16 text-primary/30" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Quick view button */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <Button size="sm" className="w-full rounded-full bg-white text-foreground hover:bg-white/90">
                          Bekijk product
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>

                      {/* Badge */}
                      {index === 0 && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          Populair
                        </Badge>
                      )}
                      {product.node.title.includes("Kit") && (
                        <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                          Bundel Deal
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-5">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">Nieuw</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {product.node.title}
                      </h3>
                      
                      {/* Description snippet */}
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.node.description?.substring(0, 80)}...
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(
                            product.node.priceRange.minVariantPrice.amount,
                            product.node.priceRange.minVariantPrice.currencyCode
                          )}
                        </span>
                        {product.node.variants.edges.length > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {product.node.variants.edges.length} opties
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Binnenkort beschikbaar
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We werken hard aan onze productcatalogus. Neem contact op als je specifieke wensen hebt!
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">
                  Contact opnemen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="container-webiro">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Waarom Webiro NFC?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Onze NFC producten helpen ondernemers om moeiteloos meer Google Reviews te verzamelen 
              en hun online reputatie te versterken.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Plug & Play
              </h3>
              <p className="text-muted-foreground">
                Wij programmeren alles voor je. Ontvang je product, plaats het, en begin direct met verzamelen.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Premium Kwaliteit
              </h3>
              <p className="text-muted-foreground">
                Hoogwaardige materialen die jarenlang meegaan. Waterdicht, krasbestendig en stijlvol.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nederlandse Support
              </h3>
              <p className="text-muted-foreground">
                Hulp nodig? Ons team staat klaar om je te helpen met installatie en configuratie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container-webiro">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Klaar om meer reviews te verzamelen?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Begin vandaag nog met het versterken van je online reputatie. 
                Gratis verzending vanaf €50.
              </p>
              <Button size="lg" variant="secondary" className="rounded-full text-primary">
                Bekijk alle producten
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
