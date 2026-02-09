import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updatePageMeta } from "@/utils/seo";
import { storefrontApiRequest, ShopifyProduct } from "@/lib/shopify";

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        const productData = data?.data?.productByHandle;
        
        if (productData) {
          setProduct(productData);
          
          // Set default selected options
          const defaults: Record<string, string> = {};
          productData.options?.forEach((option: { name: string; values: string[] }) => {
            if (option.values.length > 0) {
              defaults[option.name] = option.values[0];
            }
          });
          setSelectedOptions(defaults);
          
          // Set first variant as selected
          if (productData.variants?.edges?.length > 0) {
            setSelectedVariant(productData.variants.edges[0].node.id);
          }
          
          updatePageMeta(
            productData.title,
            productData.description?.substring(0, 155) || `Bekijk ${productData.title} bij Webiro Shop`,
            `/shop/${handle}`
          );
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [handle]);

  // Find variant based on selected options
  useEffect(() => {
    if (!product) return;
    
    const matchingVariant = product.variants?.edges?.find((v) => {
      return v.node.selectedOptions?.every(
        (opt) => selectedOptions[opt.name] === opt.value
      );
    });
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node.id);
    }
  }, [selectedOptions, product]);

  const getCurrentVariant = () => {
    return product?.variants?.edges?.find((v) => v.node.id === selectedVariant)?.node;
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-32 px-4">
        <div className="container-webiro">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background pt-32 px-4">
        <div className="container-webiro text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product niet gevonden</h1>
          <Button asChild>
            <Link to="/shop">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar shop
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const currentVariant = getCurrentVariant();
  const images = product.images?.edges || [];

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="pt-28 pb-4 px-4 border-b border-border/50">
        <div className="container-webiro">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar shop
          </Link>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12 px-4">
        <div className="container-webiro">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-3xl overflow-hidden relative group">
                {images[selectedImage]?.node ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">Productafbeelding</p>
                    </div>
                  </div>
                )}
                
                {/* Floating badge */}
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Webiro
                </Badge>
              </div>
              
              {/* Thumbnail gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">NFC Producten</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>
                
                {/* Rating placeholder */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm">Nieuw product</span>
                </div>
              </div>

              {/* Price */}
              <div className="py-4 border-y border-border/50">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {currentVariant 
                      ? formatPrice(currentVariant.price.amount, currentVariant.price.currencyCode)
                      : formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
                    }
                  </span>
                  <span className="text-muted-foreground text-sm">incl. BTW</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Options */}
              {product.options && product.options.length > 0 && product.options[0].name !== 'Title' && (
                <div className="space-y-4">
                  {product.options.map((option) => (
                    <div key={option.name}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                              selectedOptions[option.name] === value
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background text-foreground hover:border-primary/50'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-3 pt-4">
                <Button size="lg" className="w-full text-lg py-6 rounded-full">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  In winkelwagen
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Check className="w-4 h-4 inline mr-1 text-green-500" />
                  Direct leverbaar • Gratis verzending vanaf €50
                </p>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Snelle levering</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Veilig betalen</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">14 dagen retour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container-webiro">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Waarom kiezen voor Webiro NFC?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-2xl p-6 border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Plug & Play</h3>
              <p className="text-sm text-muted-foreground">
                Wij programmeren alles voor je. Ontvang je product en begin direct met verzamelen van reviews.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-6 border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Premium Kwaliteit</h3>
              <p className="text-sm text-muted-foreground">
                Hoogwaardige materialen die jarenlang meegaan. Waterdicht en krasbestendig.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-6 border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Nederlandse Support</h3>
              <p className="text-sm text-muted-foreground">
                Hulp nodig? Ons team staat klaar om je te helpen met installatie en configuratie.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
