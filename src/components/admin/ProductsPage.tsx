import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, ShoppingBag, Weight, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getProducts, addProduct, updateProduct, deleteProduct, type Product } from "@/lib/products";
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
  const [weightOptionsStr, setWeightOptionsStr] = useState("");

  const refresh = async () => {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const resetForm = () => {
    setName(""); setDescription(""); setPrice(""); setImageUrl(""); setCategory("General"); setInStock(true);
    setQuantityType("unit"); setPricePerKg(""); setWeightOptionsStr("");
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
    setWeightOptionsStr((p.weight_options || []).join(", "));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) { toast.error("Name and price are required"); return; }
    if (quantityType === "weight" && !pricePerKg.trim()) { toast.error("Price per kg is required for weight-based products"); return; }
    setSaving(true);
    try {
      const weightOptions = weightOptionsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const data: any = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image_url: imageUrl.trim(),
        category: category.trim(),
        in_stock: inStock,
        quantity_type: quantityType,
        price_per_kg: quantityType === "weight" ? parseFloat(pricePerKg) : null,
        weight_options: quantityType === "weight" ? weightOptions : [],
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
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-border p-6">
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
                  <div>
                    <Label>Weight Options (comma-separated)</Label>
                    <Input value={weightOptionsStr} onChange={(e) => setWeightOptionsStr(e.target.value)} placeholder="0.5kg, 1kg, 2kg, 5kg" />
                    <p className="text-xs text-muted-foreground mt-1">e.g. 0.5kg, 1kg, 2kg</p>
                  </div>
                </>
              )}

              <div>
                <Label>Image URL</Label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
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
