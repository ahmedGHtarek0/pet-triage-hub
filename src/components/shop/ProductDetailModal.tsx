import { useState } from "react";
import { X, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  onClose: () => void;
  onOrder: (weightOption?: string) => void;
}

export default function ProductDetailModal({ product, onClose, onOrder }: Props) {
  const isWeight = product.quantity_type === "weight";
  const [selectedWeight, setSelectedWeight] = useState<string>(
    isWeight && product.weight_options?.length ? product.weight_options[0] : ""
  );

  const getDisplayPrice = () => {
    if (!isWeight || !product.price_per_kg || !selectedWeight) return product.price;
    const num = parseFloat(selectedWeight);
    return isNaN(num) ? product.price : product.price_per_kg * num;
  };

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

          <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>

          {/* Weight options */}
          {isWeight && product.weight_options && product.weight_options.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Select Weight:</p>
              <div className="flex flex-wrap gap-2">
                {product.weight_options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedWeight(opt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedWeight === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {product.price_per_kg && (
                <p className="text-xs text-muted-foreground mt-2">{product.price_per_kg} EGP/kg</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-3xl text-primary">
              {getDisplayPrice().toFixed(2)} EGP
            </span>
            <Button size="lg" onClick={() => onOrder(isWeight ? selectedWeight : undefined)} className="rounded-full gap-2">
              <ShoppingCart size={18} />
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
