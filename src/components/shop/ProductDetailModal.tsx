import { X, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  onClose: () => void;
  onOrder: () => void;
}

export default function ProductDetailModal({ product, onClose, onOrder }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-border">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted z-10">
          <X size={20} />
        </button>

        {product.image_url ? (
          <div className="h-64 overflow-hidden rounded-t-2xl">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-64 bg-secondary/30 flex items-center justify-center rounded-t-2xl">
            <ShoppingBag className="text-muted-foreground" size={64} />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-heading text-2xl font-bold">{product.name}</h2>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
              {product.category}
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-3xl text-primary">
              {product.price.toFixed(2)} EGP
            </span>
            <Button size="lg" onClick={onOrder} className="rounded-full gap-2">
              <ShoppingCart size={18} />
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
