import { useState } from "react";
import { X, ShoppingBag, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  onClose: () => void;
  onOrder: (weightOption?: string) => void;
}

export default function ProductDetailModal({ product, onClose, onOrder }: Props) {
  const isWeight = product.quantity_type === "weight";
  // weight_options now stores [min, max] (kg)
  const opts = product.weight_options || [];
  const minKg = Math.max(0.5, parseFloat(opts[0]) || 0.5);
  const maxKg = Math.min(100, parseFloat(opts[1]) || 100);
  const STEP = 0.5;
  const [weight, setWeight] = useState<number>(minKg);

  const clamp = (v: number) => Math.min(maxKg, Math.max(minKg, Math.round(v * 2) / 2));
  const dec = () => setWeight((w) => clamp(w - STEP));
  const inc = () => setWeight((w) => clamp(w + STEP));

  const getDisplayPrice = () => {
    if (!isWeight || !product.price_per_kg) return product.price;
    return product.price_per_kg * weight;
  };
  const weightLabel = `${weight}kg`;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full animate-scale-in border border-border my-8">
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

          {/* Weight stepper */}
          {isWeight && (
            <div className="mb-5 p-4 rounded-2xl bg-secondary/30 border border-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Select Weight</p>
                {product.price_per_kg && (
                  <span className="text-xs text-muted-foreground">{product.price_per_kg} EGP/kg</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={dec}
                  disabled={weight <= minKg}
                  className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  aria-label="Decrease weight"
                >
                  <Minus size={18} />
                </button>
                <div className="min-w-[110px] text-center">
                  <div className="font-heading text-3xl font-bold text-primary tabular-nums">{weight}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">kilograms</div>
                </div>
                <button
                  onClick={inc}
                  disabled={weight >= maxKg}
                  className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  aria-label="Increase weight"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-[11px] text-center text-muted-foreground mt-3">
                Range: {minKg}kg – {maxKg}kg • Step: {STEP}kg
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-3xl text-primary">
              {getDisplayPrice().toFixed(2)} EGP
            </span>
            <Button size="lg" onClick={() => onOrder(isWeight ? weightLabel : undefined)} className="rounded-full gap-2">
              <ShoppingCart size={18} />
              Order Now
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
