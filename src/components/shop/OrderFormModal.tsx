import { useState } from "react";
import { X, Loader2, CheckCircle, Banknote, Smartphone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder, type Product } from "@/lib/products";
import { toast } from "sonner";

interface Props {
  product: Product;
  onClose: () => void;
}

const paymentMethods = [
  { id: "cash", label: "Cash on Delivery", icon: Banknote, info: null },
  { id: "vodafone", label: "Vodafone Cash", icon: Smartphone, info: "Send to: 01151121767" },
  { id: "instapay", label: "InstaPay", icon: CreditCard, info: "Account: 01151121767" },
];

export default function OrderFormModal({ product, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cash");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSaving(true);
    try {
      await createOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_address: address.trim(),
        product_id: product.id,
        product_name: product.name,
        payment_method: payment,
      });
      setSuccess(true);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order");
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in border border-border">
          <CheckCircle className="mx-auto mb-4 text-primary" size={64} />
          <h2 className="font-heading text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-2">Your order for <strong>{product.name}</strong> has been placed.</p>
          {payment !== "cash" && (
            <p className="text-sm text-primary font-medium mb-4">
              {paymentMethods.find((m) => m.id === payment)?.info}
            </p>
          )}
          <Button onClick={onClose} className="rounded-full mt-4">Close</Button>
        </div>
      </div>
    );
  }

  const selectedMethod = paymentMethods.find((m) => m.id === payment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-heading text-xl font-bold">Place Order</h2>
            <p className="text-sm text-muted-foreground">{product.name} — {product.price.toFixed(2)} EGP</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
          </div>
          <div>
            <Label>Delivery Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
          </div>

          <div>
            <Label className="mb-2 block">Payment Method</Label>
            <div className="space-y-2">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    payment === m.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <m.icon size={20} className={payment === m.id ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">{m.label}</p>
                    {m.info && <p className="text-xs text-muted-foreground">{m.info}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedMethod?.info && payment !== "cash" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <p className="text-sm font-medium text-primary">{selectedMethod.info}</p>
              <p className="text-xs text-muted-foreground mt-1">Please complete the payment before delivery</p>
            </div>
          )}

          <Button
            className="w-full rounded-full"
            size="lg"
            disabled={saving}
            onClick={handleSubmit}
          >
            {saving ? <><Loader2 className="animate-spin mr-2" size={18} /> Placing Order...</> : "Confirm Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
