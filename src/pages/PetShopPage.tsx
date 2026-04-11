import { useState, useEffect } from "react";
import { ShoppingBag, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts, type Product } from "@/lib/products";
import ProductDetailModal from "@/components/shop/ProductDetailModal";
import OrderFormModal from "@/components/shop/OrderFormModal";

export default function PetShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [orderWeight, setOrderWeight] = useState<string | undefined>();

  useEffect(() => {
    getProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat && p.in_stock;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="container mx-auto px-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">
                Pet <span className="gradient-text">Shop</span>
              </h1>
              <p className="text-muted-foreground text-sm">Quality products for your beloved pets</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="font-heading text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground">Check back later for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="glass-card-hover overflow-hidden group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="h-48 overflow-hidden bg-secondary/30">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="text-muted-foreground" size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xl text-primary">
                        {product.quantity_type === "weight" && product.price_per_kg
                          ? `${product.price_per_kg} EGP/kg`
                          : `${product.price.toFixed(2)} EGP`}
                      </span>
                      <Button size="sm" variant="outline" className="rounded-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrder={(w) => {
            setOrderProduct(selectedProduct);
            setOrderWeight(w);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Order Form Modal */}
      {orderProduct && (
        <OrderFormModal
          product={orderProduct}
          weightOption={orderWeight}
          onClose={() => { setOrderProduct(null); setOrderWeight(undefined); }}
        />
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/logo.png" alt="Pet Planet" className="h-8 w-8" />
            <span className="font-heading font-bold gradient-text">Pet Planet</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 Pet Planet Veterinary Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
