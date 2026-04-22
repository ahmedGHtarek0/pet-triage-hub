import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Pencil, Trash2, Loader2, ShoppingBag, Weight, Hash, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage, type Product } from "@/lib/products";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [inStock, setInStock] = useState(true);
  const [quantityType, setQuantityType] = useState<"unit" | "weight">("unit");
  const [pricePerKg, setPricePerKg] = useState("");
  const [minWeight, setMinWeight] = useState("0.5");
  const [maxWeight, setMaxWeight] = useState("100");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const resetForm = () => {
    setName(""); setDescription(""); setPrice(""); setImageUrl(""); setCategory("General"); setInStock(true);
    setQuantityType("unit"); setPricePerKg(""); setMinWeight("0.5"); setMaxWeight("100");
    setEditing(null); setShowForm(false);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setName(p.name);
    setDescription(p.description || "");
    setPrice(String(p.price));
    setImageUrl(p.image_url || "");
    setCategory(p.category || "General");
    setInStock(p.in_stock);
    setQuantityType(p.quantity_type || "unit");
    setPricePerKg(p.price_per_kg ? String(p.price_per_kg) : "");
    // weight_options now stores [min, max]
    const opts = p.weight_options || [];
    setMinWeight(opts[0] || "0.5");
    setMaxWeight(opts[1] || "100");
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image files allowed"); return; }
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setImageUrl(url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) { toast.error("Name and price are required"); return; }
    if (quantityType === "weight" && !pricePerKg.trim()) { toast.error("Price per kg is required for weight-based products"); return; }
    setSaving(true);
    try {
      const weightOptions =
        quantityType === "weight" ? [minWeight.trim() || "0.5", maxWeight.trim() || "100"] : [];
      const data: any = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image_url: imageUrl.trim(),
        category: category.trim(),
        in_stock: inStock,
        quantity_type: quantityType,
        price_per_kg: quantityType === "weight" ? parseFloat(pricePerKg) : null,
        weight_options: weightOptions,
      };
      if (editing) {
        await updateProduct(editing.id, data);
        toast.success("Product updated");
      } else {
        await addProduct(data);
        toast.success("Product added");
      }
      resetForm();
      await refresh();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteProduct(id);
    toast.success("Product deleted");
    await refresh();
    setDeletingId(null);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-primary" size={24} />
          <h2 className="font-heading text-2xl font-bold">Products</h2>
          <Badge variant="secondary">{products.length}</Badge>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-full gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative min-h-full flex items-center justify-center p-4">
            <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full animate-scale-in border border-border p-6 my-8">
            <h3 className="font-heading text-xl font-bold mb-4">{editing ? "Edit Product" : "Add Product"}</h3>
            <div className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description" rows={3} />
              </div>

              {/* Quantity Type */}
              <div>
                <Label className="mb-2 block">Sold By</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantityType("unit")}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${
                      quantityType === "unit"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Hash size={16} /> Per Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantityType("weight")}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${
                      quantityType === "weight"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Weight size={16} /> By Weight
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{quantityType === "weight" ? "Base Price (EGP)" : "Price (EGP)"}</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="General" />
                </div>
              </div>

              {quantityType === "weight" && (
                <>
                  <div>
                    <Label>Price per KG (EGP)</Label>
                    <Input type="number" value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} placeholder="e.g. 150" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Min Weight (kg)</Label>
                      <Input type="number" step="0.1" min="0.1" value={minWeight} onChange={(e) => setMinWeight(e.target.value)} placeholder="0.5" />
                    </div>
                    <div>
                      <Label>Max Weight (kg)</Label>
                      <Input type="number" step="0.1" min="0.1" value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)} placeholder="100" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-2">Customers will pick any weight in this range using +/- controls.</p>
                </>
              )}

              <div>
                <Label className="mb-2 block">Product Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imageUrl ? (
                  <div className="relative rounded-xl border border-border overflow-hidden group">
                    <img src={imageUrl} alt="Product" className="w-full max-h-48 object-contain bg-secondary/20" />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-primary disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                    <span className="text-sm font-medium">{uploading ? "Uploading..." : "Upload Product Image"}</span>
                    <span className="text-xs">PNG, JPG up to ~10MB</span>
                  </button>
                )}
                <Input
                  className="mt-2"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste an image URL"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={inStock} onCheckedChange={setInStock} />
                <Label>In Stock</Label>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" disabled={saving} onClick={handleSave}>
                  {saving ? <><Loader2 className="animate-spin mr-2" size={16} /> Saving...</> : editing ? "Update Product" : "Add Product"}
                </Button>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingBag className="mx-auto mb-3" size={48} />
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary/30 shrink-0">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={24} className="text-muted-foreground" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  {p.quantity_type === "weight" && <Badge variant="outline" className="text-xs">By Weight</Badge>}
                  {!p.in_stock && <Badge variant="destructive" className="text-xs">Out of Stock</Badge>}
                </div>
                <p className="text-sm text-muted-foreground truncate">{p.description}</p>
                <p className="text-sm font-medium text-primary mt-1">
                  {p.price.toFixed(2)} EGP
                  {p.quantity_type === "weight" && p.price_per_kg && ` • ${p.price_per_kg} EGP/kg`}
                  {" • "}{p.category}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil size={14} /></Button>
                <Button size="sm" variant="destructive" disabled={deletingId === p.id} onClick={() => handleDelete(p.id)}>
                  {deletingId === p.id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
