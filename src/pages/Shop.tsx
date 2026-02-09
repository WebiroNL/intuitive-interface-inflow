import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updatePageMeta } from "@/utils/seo";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePageMeta(
      "Webiro Shop",
      "Ontdek producten en diensten van Webiro. Premium website templates, marketing tools en meer.",
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
      <section className="pt-32 pb-16 px-4">
        <div className="container-webiro text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">Webiro Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Premium Producten
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ontdek onze selectie van website templates, marketing tools en digitale producten 
            die je bedrijf naar het volgende niveau tillen.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-4">
        <div className="container-webiro">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link 
                  key={product.node.id} 
                  to={`/shop/${product.node.handle}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.node.images.edges[0]?.node ? (
                        <img
                          src={product.node.images.edges[0].node.url}
                          alt={product.node.images.edges[0].node.altText || product.node.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {product.node.title}
                      </h3>
                      <p className="text-primary font-bold">
                        {formatPrice(
                          product.node.priceRange.minVariantPrice.amount,
                          product.node.priceRange.minVariantPrice.currencyCode
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Binnenkort beschikbaar
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We werken hard aan onze productcatalogus. Neem contact op als je specifieke wensen hebt!
              </p>
              <Button asChild>
                <Link to="/contact">
                  Contact opnemen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
