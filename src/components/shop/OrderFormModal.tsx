import { useState, useRef } from "react";
import { X, Loader2, CheckCircle, Banknote, Smartphone, CreditCard, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder, uploadPaymentScreenshot, type Product } from "@/lib/products";
import { toast } from "sonner";

interface Props {
  product: Product;
  weightOption?: string;
  onClose: () => void;
}

const paymentMethods = [
  { id: "cash", label: "Cash on Delivery", icon: Banknote, info: null },
  { id: "vodafone", label: "Vodafone Cash", icon: Smartphone, info: "Send to: 01151121767" },
  { id: "instapay", label: "InstaPay", icon: CreditCard, info: "Account: 01151121767" },
];

export default function OrderFormModal({ product, weightOption, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cash");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getDisplayPrice = () => {
    if (product.quantity_type === "weight" && product.price_per_kg && weightOption) {
      const num = parseFloat(weightOption);
      return isNaN(num) ? product.price : product.price_per_kg * num;
    }
    return product.price;
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (payment === "vodafone" && !screenshotFile) {
      toast.error("Please upload your payment screenshot");
      return;
    }
    setSaving(true);
    try {
      let screenshotUrl: string | null = null;
      if (screenshotFile) {
        screenshotUrl = await uploadPaymentScreenshot(screenshotFile);
      }
      const displayPrice = getDisplayPrice();
      const productLabel = weightOption
        ? `${product.name} (${weightOption}) — ${displayPrice.toFixed(2)} EGP`
        : `${product.name} — ${displayPrice.toFixed(2)} EGP`;

      await createOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_address: address.trim(),
        product_id: product.id,
        product_name: productLabel,
        payment_method: payment,
        weight_option: weightOption || null,
        payment_screenshot_url: screenshotUrl,
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
            <p className="text-sm text-muted-foreground">
              {product.name}
              {weightOption && ` (${weightOption})`}
              {" — "}{getDisplayPrice().toFixed(2)} EGP
            </p>
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

          {/* Vodafone screenshot upload */}
          {payment === "vodafone" && (
            <div>
              <Label className="mb-2 block">Payment Screenshot *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {screenshotPreview ? (
                <div className="relative rounded-xl border border-border overflow-hidden">
                  <img src={screenshotPreview} alt="Payment screenshot" className="w-full max-h-48 object-contain bg-secondary/20" />
                  <button
                    onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-primary"
                >
                  <Upload size={24} />
                  <span className="text-sm font-medium">Upload Screenshot</span>
                  <span className="text-xs">Click to select an image</span>
                </button>
              )}
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
