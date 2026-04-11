import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at: string;
  quantity_type: "unit" | "weight";
  price_per_kg: number | null;
  weight_options: string[];
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  product_id: string | null;
  product_name: string;
  payment_method: string;
  status: string;
  created_at: string;
  quantity: number;
  weight_option: string | null;
  payment_screenshot_url: string | null;
}

// ============ Products ============

export async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []) as Product[];
}

export async function addProduct(product: Omit<Product, "id" | "created_at">): Promise<void> {
  await supabase.from("products").insert({
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image_url,
    category: product.category,
    in_stock: product.in_stock,
    quantity_type: product.quantity_type,
    price_per_kg: product.price_per_kg,
    weight_options: product.weight_options,
  });
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const update: any = {};
  if (product.name !== undefined) update.name = product.name;
  if (product.description !== undefined) update.description = product.description;
  if (product.price !== undefined) update.price = product.price;
  if (product.image_url !== undefined) update.image_url = product.image_url;
  if (product.category !== undefined) update.category = product.category;
  if (product.in_stock !== undefined) update.in_stock = product.in_stock;
  if (product.quantity_type !== undefined) update.quantity_type = product.quantity_type;
  if (product.price_per_kg !== undefined) update.price_per_kg = product.price_per_kg;
  if (product.weight_options !== undefined) update.weight_options = product.weight_options;
  await supabase.from("products").update(update).eq("id", id);
}

export async function deleteProduct(id: string): Promise<void> {
  await supabase.from("products").delete().eq("id", id);
}

// ============ Orders ============

export async function getOrders(): Promise<Order[]> {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []) as Order[];
}

export async function createOrder(order: {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  product_id: string;
  product_name: string;
  payment_method: string;
  quantity?: number;
  weight_option?: string | null;
  payment_screenshot_url?: string | null;
}): Promise<void> {
  await supabase.from("orders").insert(order);
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await supabase.from("orders").update({ status }).eq("id", id);
}

export async function deleteOrder(id: string): Promise<void> {
  await supabase.from("orders").delete().eq("id", id);
}

// ============ Screenshot Upload ============

export async function uploadPaymentScreenshot(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("payment-screenshots")
    .upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage
    .from("payment-screenshots")
    .getPublicUrl(path);
  return data.publicUrl;
}
